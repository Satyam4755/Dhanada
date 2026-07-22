from typing import Dict, Any, List, Optional
from datetime import datetime
import re
from .models import (
    AMC, Subcategory, FundManager, SchemeAllocation, SchemeFundManager, 
    Scheme, SchemePlan, NavUpdate, SchemePlanPerformance, SyncDataset
)
from .validator import DataValidator
from .logger import log_warning

class DataMapper:
    def __init__(self):
        self.validator = DataValidator()
        self.unmapped_fields_log = set()

    def _parse_date(self, date_str: str) -> Optional[datetime.date]:
        if not date_str:
            return None
        try:
            # Handle YYYY-MM-DD...
            if len(date_str) >= 10 and date_str[4] == "-" and date_str[7] == "-":
                return datetime.strptime(date_str[:10], "%Y-%m-%d").date()
            # Handle DD-MMM-YYYY...
            elif "-" in date_str and len(date_str) >= 11:
                return datetime.strptime(date_str[:11], "%d-%b-%Y").date()
            return None
        except ValueError:
            return None

    def _parse_currency(self, val_str: Any) -> float:
        if not val_str:
            return 0.0
        val = str(val_str)
        # Strip "Rs.", "/-", spaces, commas
        val = re.sub(r'[Rr]s\.?|/-|\s|,', '', val)
        try:
            return float(val)
        except ValueError:
            return 0.0

    def _parse_float(self, val: Any) -> Optional[float]:
        if val is None or str(val).strip() in ("", "None", "null"):
            return None
        try:
            return float(val)
        except ValueError:
            return None

    def _derive_scheme_type(self, fund_type_desc: str) -> Optional[str]:
        desc = (fund_type_desc or "").lower()
        if "open ended" in desc or "open-ended" in desc:
            return "Open Ended"
        elif "close ended" in desc or "closed-ended" in desc or "close-ended" in desc:
            return "Close Ended"
        elif "interval" in desc:
            return "Interval"
        return None

    def _derive_investment_strategy(self, fund_type_desc: str, category: str) -> str:
        desc = (fund_type_desc + " " + (category or "")).lower()
        if "equity" in desc and "debt" not in desc:
            return "Equity"
        elif "debt" in desc and "equity" not in desc:
            return "Debt"
        elif "hybrid" in desc or ("equity" in desc and "debt" in desc):
            return "Hybrid"
        return "Equity" # Fallback

    def _parse_flat_plan(self, node: Dict, sebi_code: str, dataset: SyncDataset):
        if not isinstance(node, dict) or "isin_code" not in node:
            return
            
        name = node.get("name", "").lower()
        p_type = "Direct" if "direct" in name else "Regular"
        p_opt = "IDCW" if "idcw" in name or "dividend" in name or "income distribution" in name else "Growth"
        
        p_sub = None
        if "payout" in name: p_sub = "Payout"
        elif "reinvest" in name: p_sub = "Reinvestment"
        elif "transfer" in name: p_sub = "Transfer"
        
        self._create_plan_record(node, sebi_code, p_type, p_opt, p_sub, dataset)

    def _extract_plans(self, plans_dict: Dict, sebi_code: str, dataset: SyncDataset):
        """Recursively extract plans from the nested structure."""
        if not plans_dict:
            return
            
        # Format 1: Flat/List structure with "additional_plans" at the root
        if "name" in plans_dict or "additional_plans" in plans_dict:
            self._parse_flat_plan(plans_dict, sebi_code, dataset)
            if "additional_plans" in plans_dict and isinstance(plans_dict["additional_plans"], list):
                for p in plans_dict["additional_plans"]:
                    self._parse_flat_plan(p, sebi_code, dataset)
            return

        # Format 2: Nested dictionary structure (regular -> growth)
        for plan_type_key, type_dict in plans_dict.items():
            if not isinstance(type_dict, dict): continue
            
            mapped_type = "Regular" if "regular" in plan_type_key.lower() else "Direct"
            
            # Level 2: option (growth / idcw)
            for option_key, option_dict in type_dict.items():
                if not isinstance(option_dict, dict): continue
                
                mapped_option = "Growth" if "growth" in option_key.lower() else "IDCW"
                
                # Check if this is a leaf node (contains isin_code directly)
                if "isin_code" in option_dict:
                    self._create_plan_record(option_dict, sebi_code, mapped_type, mapped_option, None, dataset)
                    
                # Check for additional_plans array under Growth or direct options
                if "additional_plans" in option_dict and isinstance(option_dict["additional_plans"], list):
                    for add_plan in option_dict["additional_plans"]:
                        self._create_plan_record(add_plan, sebi_code, mapped_type, mapped_option, None, dataset)
                    
                # Level 3: sub_option (payout, reinvestment, transfer, unknown)
                for sub_opt_key, sub_dict in option_dict.items():
                    if not isinstance(sub_dict, dict): continue
                    
                    mapped_sub = None
                    key_lower = sub_opt_key.lower()
                    if "payout" in key_lower:
                        mapped_sub = "Payout"
                    elif "reinvestment" in key_lower:
                        mapped_sub = "Reinvestment"
                    elif "transfer" in key_lower:
                        mapped_sub = "Transfer"
                        
                    # Is this a leaf node?
                    if "isin_code" in sub_dict:
                        self._create_plan_record(sub_dict, sebi_code, mapped_type, mapped_option, mapped_sub, dataset)
                    
                    # Handle additional_plans array inside unknown or other nodes
                    if "additional_plans" in sub_dict and isinstance(sub_dict["additional_plans"], list):
                        for add_plan in sub_dict["additional_plans"]:
                            self._create_plan_record(add_plan, sebi_code, mapped_type, mapped_option, mapped_sub, dataset)

    def _parse_managers(self, raw_managers_list: List[Dict], dataset: SyncDataset) -> List[SchemeFundManager]:
        parsed_managers = []
        
        # Regex helpers to strip labels and titles, and extract standard dates
        label_pattern = re.compile(r'(?i)(Debt|Equity|Arbitrage)\s+Portion\s*[:\-]?\s*|\(for.*?portion\)|\bFM\s*\d+\s*[:\-]\s*')
        title_pattern = re.compile(r'^(Mr\.|Ms\.|Mrs\.|Dr\.|Mr|Ms|Mrs|Dr)\s*', flags=re.IGNORECASE)
        date_pattern = re.compile(r'(\d{2}-[a-zA-Z]{3}-\d{4}|\d{2}-\d{2}-\d{4}|[a-zA-Z]+\s+\d{2},\s+\d{4}|\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?)')
        
        for fm in raw_managers_list:
            raw_name = fm.get("name", "") or ""
            raw_from = fm.get("from", "") or ""
            raw_to = fm.get("to")
            
            # Clean up labels and titles from name
            clean_name = label_pattern.sub('', raw_name).strip()
            clean_name = title_pattern.sub('', clean_name).strip()
            if not clean_name: continue
            
            # Truncate to 140 chars to satisfy Frappe Link field limits for malformed upstream data
            clean_name = clean_name[:140].strip()
            
            # Parse dates
            parsed_from_date = None
            if raw_from:
                match_from = date_pattern.search(str(raw_from))
                if match_from:
                    parsed_from_date = self._parse_date(match_from.group(1))
                    
            parsed_to_date = None
            if raw_to:
                match_to = date_pattern.search(str(raw_to))
                if match_to:
                    parsed_to_date = self._parse_date(match_to.group(1))

            dataset.fund_managers.append(FundManager(manager_name=clean_name))
            parsed_managers.append(SchemeFundManager(
                manager_name=clean_name,
                manager_type=fm.get("type"),
                role_or_portion=fm.get("role_or_portion"),
                from_date=parsed_from_date,
                to_date=parsed_to_date,
                is_active=True if not parsed_to_date else False
            ))
                
        return parsed_managers

    def _create_plan_record(self, node: Dict, sebi_code: str, p_type: str, p_opt: str, p_sub: Optional[str], dataset: SyncDataset):
        isin = node.get("isin_code")
        if not isin:
            return
            
        # Map time_period to Frappe Select options
        period_val = node.get("time_period")
        frappe_period = None
        if period_val:
            period_map = {
                "daily": "Daily",
                "weekly": "Weekly",
                "fortnightly": "Fortnightly",
                "monthly": "Monthly",
                "quarterly": "Quarterly",
                "half_yearly": "Half Yearly",
                "annual": "Annual",
                "periodic": "Periodic"
            }
            frappe_period = period_map.get(period_val)
            
        dataset.scheme_plans.append(SchemePlan(
            isin=isin,
            sebi_code=sebi_code,
            type=p_type,
            option=p_opt,
            sub_option=p_sub,
            period=frappe_period,
            sif_code=node.get("amfi_code"),
            rta_code=node.get("rta_code")
        ))

    def map_dataset(self, raw_data: Dict[str, Any]) -> SyncDataset:
        dataset = SyncDataset()

        # We assume the caller passes raw_data grouped by source type for processing.
        # { "scheme_details": [...], "nav_daily": [...], "performance": [...] }

        # 1. Scheme Details
        for raw_scheme in raw_data.get("scheme_details", []):
            if self.validator.validate_amfi_scheme_details(raw_scheme):
                
                # Derive fields
                scheme_type = self._derive_scheme_type(raw_scheme.get("fund_type", ""))
                investment_strategy = self._derive_investment_strategy(raw_scheme.get("fund_type", ""), raw_scheme.get("category", ""))
                
                min_sub = 0.0
                inv_limits = raw_scheme.get("investment_limits", {})
                if isinstance(inv_limits, dict):
                    min_sub = self._parse_currency(inv_limits.get("minimum_application_amount"))
                
                managers = self._parse_managers(raw_scheme.get("fund_managers") or [], dataset)
                
                allocations = []
                for alloc in (raw_scheme.get("asset_allocation") or []):
                    if isinstance(alloc, dict):
                        allocations.append(SchemeAllocation(
                            allocation_type=alloc.get("allocation_type") or "Unknown Allocation Type",
                            minimum_allocation_percentage=self._parse_float(alloc.get("minimum_percentage")),
                            maximum_allocation_percentage=self._parse_float(alloc.get("maximum_percentage"))
                        ))
                
                category_name = raw_scheme.get("category", "Uncategorized")
                dataset.subcategories.append(Subcategory(subcategory_name=category_name))
                
                raw_sif = raw_scheme.get("sif_name")
                sif_name = str(raw_sif).replace(" SIF", "").strip() if raw_sif else None

                # Extract AMC
                if sif_name:
                    sebi_code = raw_scheme.get("sebi_code", "")
                    code_fallback = sebi_code.split("/")[-1] if "/" in sebi_code else sif_name.upper()[:4]
                    
                    dataset.amcs.append(AMC(
                        code=code_fallback,
                        amc_name=f"{sif_name} Asset Management",
                        sif_name=sif_name,
                        registration_number=code_fallback, # Unavailable in JSON, fallback to code
                        rta="", # Unavailable at root level, safely default to empty
                        is_active=True
                    ))

                dataset.schemes.append(Scheme(
                    sebi_code=raw_scheme.get("sebi_code"),
                    scheme_name=raw_scheme.get("fund_name"),
                    amc_registration_number=None,
                    sif_name=sif_name,
                    investment_strategy=investment_strategy,
                    scheme_type=scheme_type,
                    scheme_subcategory=category_name,
                    risk_band=raw_scheme.get("riskometer_as_on_date"),
                    riskometer_at_launch=raw_scheme.get("riskometer_at_launch"),
                    potential_risk_class=raw_scheme.get("potential_risk_class"),
                    scheme_objective=raw_scheme.get("scheme_objective") or "Objective not provided",
                    face_value=raw_scheme.get("face_value"),
                    exit_load=raw_scheme.get("exit_load"),
                    minimum_subscription=min_sub,
                    nfo_start_date=self._parse_date(raw_scheme.get("nfo_open_date")),
                    nfo_end_date=self._parse_date(raw_scheme.get("nfo_close_date")),
                    nfo_allotment_date=self._parse_date(raw_scheme.get("allotment_date")),
                    scheme_reopen_date=self._parse_date(raw_scheme.get("reopen_date")),
                    maturity_date=self._parse_date(raw_scheme.get("maturity_date")),
                    benchmark_tier_1=raw_scheme.get("benchmark_tier_1"),
                    benchmark_tier_2=raw_scheme.get("benchmark_tier_2"),
                    is_active=True,
                    allocations=allocations,
                    managers=managers
                ))
                
                # Extract plans
                self._extract_plans(raw_scheme.get("plans", {}), raw_scheme.get("sebi_code"), dataset)


        # 2. NAV Daily
        for raw_nav in raw_data.get("nav_daily", []):
            if self.validator.validate_amfi_nav(raw_nav):
                dataset.nav_updates.append(NavUpdate(
                    sif_code=raw_nav.get("sif_code"),
                    nav_date=self._parse_date(raw_nav.get("nav_date")), # type: ignore
                    nav=self._parse_float(raw_nav.get("nav")) or 0.0
                ))

        # 3. Performance
        for raw_perf in raw_data.get("performance", []):
            if self.validator.validate_amfi_performance(raw_perf):
                ret = raw_perf.get("returns", {})
                
                # Log unmapped fields (e.g. 7_year)
                if "7_year" in ret and "7_year" not in self.unmapped_fields_log:
                    log_warning("Source field '7_year' in performance is ignored (no matching Frappe field).")
                    self.unmapped_fields_log.add("7_year")

                dataset.performances.append(SchemePlanPerformance(
                    sif_code=raw_perf.get("sif_code"),
                    performance_date=self._parse_date(raw_perf.get("last_updated")), # type: ignore
                    day_1=self._parse_float(ret.get("1_day")),
                    week_1=self._parse_float(ret.get("1_week")),
                    month_1=self._parse_float(ret.get("1_month")),
                    months_3=self._parse_float(ret.get("3_month")), # Mismatch handled
                    months_6=self._parse_float(ret.get("6_month")), # Mismatch handled
                    year_to_date=self._parse_float(ret.get("year_to_date")),
                    year_1=self._parse_float(ret.get("1_year")),
                    years_2=self._parse_float(ret.get("2_year")), # Mismatch handled
                    years_3=self._parse_float(ret.get("3_year")), # Mismatch handled
                    years_5=self._parse_float(ret.get("5_year")), # Mismatch handled
                    years_10=self._parse_float(ret.get("10_year")), # Mismatch handled
                    since_inception=self._parse_float(ret.get("since_launch")), # Mismatch handled
                ))

        # Remove duplicates from subcategories, fund_managers, and amcs lists
        # We do this cleanly by turning them into dicts keyed by their unique names
        unique_subs = {sub.subcategory_name: sub for sub in dataset.subcategories}
        dataset.subcategories = list(unique_subs.values())
        
        unique_fms = {fm.manager_name: fm for fm in dataset.fund_managers}
        dataset.fund_managers = list(unique_fms.values())
        
        unique_amcs = {amc.sif_name: amc for amc in dataset.amcs if amc.sif_name}
        dataset.amcs = list(unique_amcs.values())

        return dataset
