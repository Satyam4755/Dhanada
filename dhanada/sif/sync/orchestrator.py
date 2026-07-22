import os
import subprocess
import time
import frappe
import logging
from .logger import log_error, log_sync_start, log_sync_completed
from .scheduler import sync_scheme_details, sync_nav_performance

logger = logging.getLogger("sif_sync")

def run_subprocess(command: list, cwd: str, stage_name: str):
    """
    Runs a subprocess and raises an exception if it fails.
    """
    logger.info(f"Starting orchestration stage: {stage_name}")
    try:
        # We assume the same python environment that is running bench is capable of running the fetcher.
        # Alternatively, using just "python" since `bench execute` runs in the frappe env.
        # It's safer to use `sys.executable` if we need the exact python, but the fetcher scripts
        # might just need a basic python with requests. Let's use `python` as it will resolve to the env.
        import sys
        
        # Replace the first element (e.g. "python") with the exact sys.executable for safety,
        # but only if it is "python".
        if command[0] == "python":
            command[0] = sys.executable

        env = os.environ.copy()
        # Add PYTHONPATH to current cwd for the scripts
        env["PYTHONPATH"] = cwd

        process = subprocess.run(
            command,
            cwd=cwd,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        if process.returncode != 0:
            error_msg = f"Stage '{stage_name}' failed with exit code {process.returncode}.\nOutput:\n{process.stdout}"
            logger.error(error_msg)
            raise Exception(error_msg)
            
        logger.info(f"Stage '{stage_name}' completed successfully.\nOutput:\n{process.stdout}")
        
    except Exception as e:
        log_error(f"Orchestration failure at stage {stage_name}: {str(e)}", exc_info=True)
        raise

def run_complete_pipeline():
    """
    Master orchestration function for the entire end-to-end pipeline.
    Serially executes:
    1. AMFI Fetch
    2. NAV Fetch
    3. Performance Calculation
    4. Frappe Scheme Sync
    5. Frappe NAV/Performance Sync
    """
    start_time = time.time()
    
    use_local = frappe.conf.get("sif_sync_use_local") == 1
    if not use_local:
        log_error("Orchestrator requires sif_sync_use_local to be 1 in site_config.json")
        raise ValueError("sif_sync_use_local must be 1 for complete automated pipeline.")
        
    fetcher_path = frappe.conf.get("sif_sync_local_fetcher_path")
    if not fetcher_path or not os.path.isdir(fetcher_path):
        error_msg = f"sif_sync_local_fetcher_path is not configured or does not exist: {fetcher_path}"
        log_error(error_msg)
        raise ValueError(error_msg)

    logger.info("Starting Full End-to-End Automated Pipeline")
    
    try:
        # Stage 1: AMFI Fetch
        run_subprocess(
            ["python", "scripts/fetch_scheme_data.py"],
            cwd=fetcher_path,
            stage_name="AMFI Scheme Fetch"
        )
        
        # Stage 2: NAV Fetch
        run_subprocess(
            ["python", "scripts/fetch_sif_nav.py"],
            cwd=fetcher_path,
            stage_name="AMFI NAV Fetch"
        )
        
        # Stage 3: Performance Calculation
        run_subprocess(
            ["python", "scripts/calculate_performance.py"],
            cwd=fetcher_path,
            stage_name="Performance Calculation"
        )
        
        # Stage 4: Frappe Scheme Sync
        logger.info("Starting Frappe Scheme Details Sync")
        sync_scheme_details()
        
        # Stage 5: Frappe NAV/Performance Sync
        logger.info("Starting Frappe NAV and Performance Sync")
        sync_nav_performance()
        
        duration = time.time() - start_time
        logger.info(f"Full End-to-End Pipeline completed successfully in {round(duration, 2)} seconds.")
        
    except Exception as e:
        logger.error(f"Full End-to-End Pipeline failed: {str(e)}")
        # We don't continue if any step fails.
        raise
