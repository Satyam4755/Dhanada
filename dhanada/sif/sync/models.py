from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date

@dataclass
class AMC:
    code: str
    amc_name: str
    sif_name: str
    registration_number: str
    rta: str
    is_active: bool = True

@dataclass
class Subcategory:
    subcategory_name: str

@dataclass
class FundManager:
    manager_name: str

@dataclass
class SchemeAllocation:
    allocation_type: str
    minimum_allocation_percentage: Optional[float] = None
    maximum_allocation_percentage: Optional[float] = None

@dataclass
class SchemeFundManager:
    manager_name: str
    manager_type: Optional[str] = None
    role_or_portion: Optional[str] = None
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    is_active: bool = True

@dataclass
class Scheme:
    sebi_code: str
    scheme_name: str
    amc_registration_number: Optional[str]  # Derived from SEBI code usually, or passed explicitly
    investment_strategy: str
    scheme_type: Optional[str]
    scheme_subcategory: str  # For linking to Subcategory
    risk_band: Optional[str]
    scheme_objective: Optional[str] = None
    exit_load: Optional[str] = None
    riskometer_at_launch: Optional[str] = None
    potential_risk_class: Optional[str] = None
    face_value: Optional[str] = None
    maturity_date: Optional[date] = None
    benchmark_tier_1: Optional[str] = None
    benchmark_tier_2: Optional[str] = None
    minimum_subscription: float = 0.0
    minimum_subscription_text: Optional[str] = None
    nfo_start_date: Optional[date] = None
    nfo_end_date: Optional[date] = None
    nfo_allotment_date: Optional[date] = None
    scheme_reopen_date: Optional[date] = None
    is_active: bool = False
    is_active_for_subscription: bool = False
    registrar: Optional[str] = None
    custodian: Optional[str] = None
    auditor: Optional[str] = None
    isid_url: Optional[str] = None
    kim_url: Optional[str] = None
    sai_url: Optional[str] = None
    factsheet_url: Optional[str] = None
    monthly_portfolio_disclosure_url: Optional[str] = None
    sif_name: Optional[str] = None
    allocations: List[SchemeAllocation] = field(default_factory=list)
    managers: List[SchemeFundManager] = field(default_factory=list)

@dataclass
class SchemePlan:
    isin: str
    sebi_code: str  # For linking to Scheme
    type: str  # Regular / Direct
    option: str  # Growth / IDCW
    sub_option: Optional[str] = None
    period: Optional[str] = None
    sif_code: Optional[str] = None
    rta_code: Optional[str] = None
    nav: Optional[float] = None
    nav_date: Optional[date] = None

@dataclass
class NavUpdate:
    sif_code: str
    nav_date: date
    nav: float

@dataclass
class SchemePlanPerformance:
    sif_code: str  # Added sif_code for lookup in importer
    performance_date: date
    day_1: Optional[float] = None
    week_1: Optional[float] = None
    month_1: Optional[float] = None
    months_3: Optional[float] = None
    months_6: Optional[float] = None
    year_to_date: Optional[float] = None
    year_1: Optional[float] = None
    years_2: Optional[float] = None
    years_3: Optional[float] = None
    years_5: Optional[float] = None
    years_10: Optional[float] = None
    since_inception: Optional[float] = None

@dataclass
class SyncDataset:
    amcs: List[AMC] = field(default_factory=list)
    subcategories: List[Subcategory] = field(default_factory=list)
    fund_managers: List[FundManager] = field(default_factory=list)
    schemes: List[Scheme] = field(default_factory=list)
    scheme_plans: List[SchemePlan] = field(default_factory=list)
    nav_updates: List[NavUpdate] = field(default_factory=list)
    performances: List[SchemePlanPerformance] = field(default_factory=list)
