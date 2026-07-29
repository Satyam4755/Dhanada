import frappe

def run():
    print("--- STARTING DEBUG ---")
    # Fetch an existing approval or create one
    approvals = frappe.get_all("SIF Scheme Approval", limit=1)
    if not approvals:
        print("No approvals found. Cannot debug.")
        return
        
    doc = frappe.get_doc("SIF Scheme Approval", approvals[0].name)
    print(f"Loaded Approval: {doc.name}, Status: {doc.status}")
    
    # Reset to Pending for the test
    doc.db_set("status", "Pending")
    
    doc = frappe.get_doc("SIF Scheme Approval", approvals[0].name)
    print(f"Reset Status to: {doc.status}")
    
    # Check child fields
    for row in doc.changed_fields:
        print(f"Row {row.idx}: {row.field_name}, apply={row.apply_change}")
        # Force apply_change to 1
        row.apply_change = 1
        
    doc.status = "Approved"
    
    # Hook into on_update to see what happens
    print("Triggering save...")
    try:
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        print("Save completed successfully.")
    except Exception as e:
        print(f"Exception during save: {e}")
        
    # Check scheme
    scheme = frappe.get_doc("SIF Scheme", doc.scheme)
    print(f"Scheme after save: risk_band = {scheme.risk_band}")

