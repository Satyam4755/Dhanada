from typing import Dict, Any, List
import re
from urllib.parse import urlparse
from datetime import datetime

class ValidationError(Exception):
    pass

class DataValidator:
    def __init__(self):
        self.errors = []

    def log_error(self, entity_type: str, identifier: str, message: str):
        self.errors.append({
            "entity_type": entity_type,
            "identifier": identifier,
            "error": message
        })

    def _is_valid_date(self, date_str: str) -> bool:
        if not date_str:
            return True
        try:
            # Handle various date formats we might encounter, usually YYYY-MM-DD or DD-MMM-YYYY
            if "-" in date_str and len(date_str) > 8:
                if date_str[2] == "-":
                    datetime.strptime(date_str, "%d-%b-%Y")
                else:
                    datetime.strptime(date_str[:10], "%Y-%m-%d")
            return True
        except ValueError:
            return False

    def validate_amfi_scheme_details(self, raw_scheme: Dict[str, Any]) -> bool:
        sebi_code = raw_scheme.get("sebi_code")
        if not sebi_code:
            self.log_error("SchemeDetails", "Unknown", "Missing 'sebi_code'")
            return False

        required_fields = ["fund_name", "category", "fund_type"]
        for field in required_fields:
            if not raw_scheme.get(field):
                self.log_error("SchemeDetails", str(sebi_code), f"Missing required field: {field}")
                return False

        # Nested plans exist?
        if "plans" not in raw_scheme or not isinstance(raw_scheme["plans"], dict):
            self.log_error("SchemeDetails", str(sebi_code), "Missing or invalid 'plans' dictionary")
            return False

        return True

    def validate_amfi_nav(self, raw_nav: Dict[str, Any]) -> bool:
        sif_code = raw_nav.get("sif_code")
        if not sif_code:
            self.log_error("NAV", "Unknown", "Missing 'sif_code'")
            return False

        if not raw_nav.get("nav_date"):
            self.log_error("NAV", str(sif_code), "Missing 'nav_date'")
            return False
            
        if not self._is_valid_date(raw_nav.get("nav_date")):
            self.log_error("NAV", str(sif_code), f"Invalid date format for nav_date: {raw_nav.get('nav_date')}")
            return False

        if raw_nav.get("nav") is None or str(raw_nav.get("nav")).strip() == "":
            self.log_error("NAV", str(sif_code), "Missing 'nav' value")
            return False

        try:
            float(raw_nav.get("nav", 0))
        except (ValueError, TypeError):
            self.log_error("NAV", str(sif_code), f"Invalid number format for 'nav': {raw_nav.get('nav')}")
            return False

        return True

    def validate_amfi_performance(self, raw_perf: Dict[str, Any]) -> bool:
        sif_code = raw_perf.get("sif_code")
        if not sif_code:
            self.log_error("Performance", "Unknown", "Missing 'sif_code'")
            return False

        if "last_updated" not in raw_perf:
            self.log_error("Performance", str(sif_code), "Missing 'last_updated'")
            return False
            
        if not self._is_valid_date(raw_perf.get("last_updated")):
            self.log_error("Performance", str(sif_code), "Invalid date format for 'last_updated'")
            return False

        if "returns" not in raw_perf or not isinstance(raw_perf["returns"], dict):
            self.log_error("Performance", str(sif_code), "Missing or invalid 'returns' dictionary")
            return False

        return True
