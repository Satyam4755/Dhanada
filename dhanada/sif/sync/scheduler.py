import time
import frappe
from .github_client import GitHubClient
from .local_client import LocalFileSystemClient
from .mapper import DataMapper
from .importer import DataImporter
from .logger import log_sync_start, log_sync_completed, log_error, log_warning

def sync_nav_performance(dry_run: bool = False):
    """
    Fetches, maps, and imports the latest NAV CSV and all Performance JSONs.
    Scheduled for Tue-Sat via cron.
    """
    start_time = time.time()
    log_sync_start()
    
    try:
        use_local = frappe.conf.get("sif_sync_use_local") == 1
        client = LocalFileSystemClient() if use_local else GitHubClient()
        
        # 1. Fetch data
        nav_data = client.fetch_latest_nav()
        perf_data = client.fetch_performance()
        
        raw_data = {
            "nav_daily": nav_data,
            "performance": perf_data
        }
        
        # 2. Map data
        mapper = DataMapper()
        dataset = mapper.map_dataset(raw_data)
        validation_errors = mapper.validator.errors
        
        # 3. Import data
        importer = DataImporter(dry_run=dry_run)
        
        # Since this is NAV and Performance only, we only pass those lists
        # (Though DataImporter handles empty lists safely, it's better to explicitly iterate what we need
        #  or just call import_dataset. Since import_dataset iterates over all lists safely, we just use it)
        importer.import_dataset(dataset)
        
        duration = time.time() - start_time
        log_sync_completed(
            duration_seconds=round(duration, 2),
            stats=importer.stats,
            validation_errors=validation_errors
        )
        
        return {
            "status": "success",
            "type": "nav_performance",
            "dry_run": dry_run,
            "duration": round(duration, 2),
            "stats": importer.stats,
            "validation_errors_count": len(validation_errors)
        }
        
    except Exception as e:
        log_error(f"NAV and Performance Sync failed entirely: {e}", exc_info=True)
        raise

def sync_scheme_details(dry_run: bool = False):
    """
    Fetches, maps, and imports all Scheme Detail JSONs.
    Scheduled for Weekly (Sunday) via cron.
    """
    start_time = time.time()
    log_sync_start()
    
    try:
        use_local = frappe.conf.get("sif_sync_use_local") == 1
        client = LocalFileSystemClient() if use_local else GitHubClient()
        
        # 1. Fetch data
        scheme_data = client.fetch_scheme_details()
        
        raw_data = {
            "scheme_details": scheme_data
        }
        
        # 2. Map data
        mapper = DataMapper()
        dataset = mapper.map_dataset(raw_data)
        validation_errors = mapper.validator.errors
        
        # 3. Import data
        importer = DataImporter(dry_run=dry_run)
        importer.import_dataset(dataset)
        
        duration = time.time() - start_time
        log_sync_completed(
            duration_seconds=round(duration, 2),
            stats=importer.stats,
            validation_errors=validation_errors
        )
        
        return {
            "status": "success",
            "type": "scheme_details",
            "dry_run": dry_run,
            "duration": round(duration, 2),
            "stats": importer.stats,
            "validation_errors_count": len(validation_errors)
        }
        
    except Exception as e:
        log_error(f"Scheme Details Sync failed entirely: {e}", exc_info=True)
        raise
