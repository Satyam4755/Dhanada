import frappe
from dhanada.sif.sync.importer import DataImporter
from dhanada.sif.sync.models import SyncDataset, Scheme, AMC

def run():
    amc = frappe.db.get_value("SIF Asset Management Company", None, "name")
    subcat = frappe.db.get_value("SIF Investment Stategy Subcategory", None, "name")
    
    if not amc or not subcat:
        print("No AMC or Subcategory found in DB for testing.")
        return

    dataset = SyncDataset(
        amcs=[],
        subcategories=[],
        fund_managers=[],
        schemes=[
            Scheme(
                sebi_code="TEST_API_002",
                scheme_name="Test API Scheme 2",
                sif_name=amc, # AMC name is not SIF Name necessarily but we'll try
                investment_strategy="Equity",
                scheme_type="Open Ended",
                scheme_subcategory=subcat,
                scheme_objective="Testing API",
                allocations=[],
                managers=[],
                is_active=True,
                is_active_for_subscription=True
            )
        ],
        scheme_plans=[],
        nav_updates=[],
        performances=[]
    )
    
    # Try to set the real sif_name so the API importer doesn't skip it
    amc_sif_name = frappe.db.get_value("SIF Asset Management Company", amc, "sif_name")
    if amc_sif_name:
        dataset.schemes[0].sif_name = amc_sif_name
        
    importer = DataImporter()
    importer.import_dataset(dataset)
    print(f"Stats after import: {importer.stats}")
    
    pending = frappe.db.exists("SIF New Scheme Approval", {"sebi_code": "TEST_API_002", "docstatus": 0})
    print(f"Pending approval found: {pending}")

    # Duplicate check
    importer2 = DataImporter()
    importer2.import_dataset(dataset)
    print(f"Stats after second import: {importer2.stats}")

    frappe.db.rollback()
