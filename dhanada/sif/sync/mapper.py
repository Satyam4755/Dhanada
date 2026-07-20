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

    def _extract_plans(self, plans_dict: Dict, sebi_code: str, dataset: SyncDataset):
        """Recursively extract plans from the nested structure."""
        
        # Level 1: type (regular / direct)
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
                    continue
                    
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
                            if "isin_code" in add_plan:
                                self._create_plan_record(add_plan, sebi_code, mapped_type, mapped_option, mapped_sub, dataset)

    def _create_plan_record(self, node: Dict, sebi_code: str, p_type: str, p_opt: str, p_sub: Optional[str], dataset: SyncDataset):
        isin = node.get("isin_code")
        if not isin:
            return
            
        dataset.scheme_plans.append(SchemePlan(
            isin=isin,
            sebi_code=sebi_code,
            type=p_type,
            option=p_opt,
            sub_option=p_sub,
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
                
                managers = []
                for fm in raw_scheme.get("fund_managers", []):
                    # AMFI format stores concatenated manager names in "name" and tenure in "from".
                    # For simplicity, we store the full string. In Frappe, this string becomes the Fund Manager name.
                    fm_name = fm.get("name")
                    if fm_name:
                        # Create unique Fund Manager canonical record
                        dataset.fund_managers.append(FundManager(manager_name=fm_name))
                        # Create link record for child table
                        managers.append(SchemeFundManager(
                            manager_name=fm_name,
                            is_active=True
                        ))
                
                category_name = raw_scheme.get("category", "Uncategorized")
                dataset.subcategories.append(Subcategory(subcategory_name=category_name))
                
                raw_sif = raw_scheme.get("sif_name")
                sif_name = str(raw_sif).replace(" SIF", "").strip() if raw_sif else None

                dataset.schemes.append(Scheme(
                    sebi_code=raw_scheme.get("sebi_code"),
                    scheme_name=raw_scheme.get("fund_name"),
                    amc_registration_number=None,
                    sif_name=sif_name,
                    investment_strategy=investment_strategy,
                    scheme_type=scheme_type,
                    scheme_subcategory=category_name,
                    risk_band=None, # 'potential_risk_class' is text, not integer
                    scheme_objective=raw_scheme.get("fund_type", ""),
                    exit_load=raw_scheme.get("exit_load"),
                    minimum_subscription=min_sub,
                    is_active=True,
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

        # Remove duplicates from subcategories and fund_managers lists
        # We do this cleanly by turning them into dicts keyed by their unique names
        unique_subs = {sub.subcategory_name: sub for sub in dataset.subcategories}
        dataset.subcategories = list(unique_subs.values())
        
        unique_fms = {fm.manager_name: fm for fm in dataset.fund_managers}
        dataset.fund_managers = list(unique_fms.values())

        return dataset
