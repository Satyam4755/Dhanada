import logging
import json
import frappe
import os
from datetime import datetime

# Initialize standard Python logger
logger = logging.getLogger("sif_sync")
logger.setLevel(logging.INFO)

# File handler for structured JSON logs
log_dir = frappe.get_site_path("logs")
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
log_file = os.path.join(log_dir, "sif_sync.log")

file_handler = logging.FileHandler(log_file)
file_handler.setLevel(logging.INFO)

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage()
        }
        if hasattr(record, "stats"):
            log_record["stats"] = record.stats
        if hasattr(record, "validation_errors"):
            log_record["validation_errors"] = record.validation_errors
        return json.dumps(log_record)

file_handler.setFormatter(JsonFormatter())
if not logger.handlers:
    logger.addHandler(file_handler)


def log_sync_start():
    logger.info("SIF Sync Started")


def log_sync_completed(duration_seconds: float, stats: dict, validation_errors: list):
    """
    Logs the completion of a sync cycle with detailed statistics.
    
    :param duration_seconds: Total time taken for sync.
    :param stats: Dictionary containing created, updated, skipped, errors counts.
    :param validation_errors: List of dictionaries with validation failure details.
    """
    extra = {
        "stats": {
            **stats,
            "duration_seconds": duration_seconds
        },
        "validation_errors": validation_errors
    }
    logger.info("SIF Sync Completed", extra=extra)


def log_error(message: str, exc_info=False):
    """Logs an error to file and also uses Frappe's Error Log."""
    logger.error(message, exc_info=exc_info)
    frappe.log_error(title="SIF Sync Error", message=message)

def log_warning(message: str):
    logger.warning(message)

