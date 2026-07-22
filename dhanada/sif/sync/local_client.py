import os
import json
import csv
import frappe
import logging
from typing import List, Dict, Any
import re
from .logger import log_error, log_warning

logger = logging.getLogger("sif_sync")

class LocalFileSystemClient:
    def __init__(self):
        self.base_path = frappe.conf.get("sif_sync_local_fetcher_path")
        if not self.base_path or not os.path.isdir(self.base_path):
            raise ValueError(f"sif_sync_local_fetcher_path is not configured correctly or directory does not exist: {self.base_path}")

    def _get_full_path(self, relative_path: str) -> str:
        return os.path.join(self.base_path, relative_path)

    # 1. SCHEME DETAILS DISCOVERY
    def fetch_scheme_details(self) -> List[Dict[str, Any]]:
        directory = self._get_full_path("data/sif/scheme/details")
        logger.info(f"Fetching scheme details from local directory: {directory}")
        
        if not os.path.isdir(directory):
            log_warning(f"Local directory not found: {directory}")
            return []
            
        json_files = [f for f in os.listdir(directory) if f.endswith(".json")]
        
        logger.info(f"Discovered {len(json_files)} JSON files in {directory}")
        
        parsed_schemes = []
        skipped = 0
        
        for file_name in json_files:
            file_path = os.path.join(directory, file_name)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    parsed_schemes.append(data)
            except Exception as e:
                skipped += 1
                log_error(f"Failed to read or parse scheme detail file {file_name}: {e}", exc_info=True)
                
        logger.info(f"Successfully parsed {len(parsed_schemes)} scheme files. Skipped {skipped}.")
        return parsed_schemes

    # 2. DAILY NAV DISCOVERY
    def fetch_latest_nav(self) -> List[Dict[str, Any]]:
        directory = self._get_full_path("data/sif/scheme/nav/daily")
        logger.info(f"Fetching latest NAV from local directory: {directory}")
        
        if not os.path.isdir(directory):
            log_warning(f"Local directory not found: {directory}")
            return []
            
        files = os.listdir(directory)
        csv_files = []
        for f in files:
            if re.match(r"^\d{8}\.csv$", f):
                csv_files.append(f)
                
        if not csv_files:
            log_warning(f"No matching YYYYMMDD.csv files found in {directory}")
            return []
            
        # Sort files descending to find the latest date
        csv_files.sort(reverse=True)
        latest_file = csv_files[0]
        latest_file_path = os.path.join(directory, latest_file)
        
        logger.info(f"Latest NAV file selected: {latest_file}")
        
        parsed_rows = []
        try:
            with open(latest_file_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if "sif_code" in row and "nav_date" in row and "nav" in row:
                        parsed_rows.append(row)
                    else:
                        log_warning(f"Skipping malformed row in {latest_file}: {row}")
                        
            logger.info(f"Successfully parsed {len(parsed_rows)} NAV rows from {latest_file}.")
        except Exception as e:
            log_error(f"Failed to read or parse NAV CSV {latest_file}: {e}", exc_info=True)
            
        return parsed_rows

    # 3. PERFORMANCE DISCOVERY
    def fetch_performance(self) -> List[Dict[str, Any]]:
        directory = self._get_full_path("data/sif/scheme/performance")
        logger.info(f"Fetching performance data from local directory: {directory}")
        
        if not os.path.isdir(directory):
            log_warning(f"Local directory not found: {directory}")
            return []
            
        json_files = [f for f in os.listdir(directory) if f.endswith(".json")]
        
        logger.info(f"Discovered {len(json_files)} JSON performance files in {directory}")
        
        parsed_performance = []
        skipped = 0
        
        for file_name in json_files:
            file_path = os.path.join(directory, file_name)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    parsed_performance.append(data)
            except Exception as e:
                skipped += 1
                log_error(f"Failed to read or parse performance file {file_name}: {e}", exc_info=True)
                
        logger.info(f"Successfully parsed {len(parsed_performance)} performance files. Skipped {skipped}.")
        return parsed_performance
