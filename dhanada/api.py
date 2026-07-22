import frappe

@frappe.whitelist()
def do_sync():
    from dhanada.sif.sync.importer import sync_scheme_details
    sync_scheme_details()
    frappe.db.commit()
    print("Sync successful.")
