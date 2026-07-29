import frappe

def run():
    print("MOCKING UI SAVE...")
    frappe.db.commit()

    # Get the approval we created earlier
    approvals = frappe.get_all("SIF Scheme Approval", limit=1)
    if not approvals:
        print("No approvals found!")
        return
        
    doc = frappe.get_doc("SIF Scheme Approval", approvals[0].name)
    doc.db_set("status", "Pending")
    
    # reset scheme to 3
    scheme = frappe.get_doc("SIF Scheme", doc.scheme)
    scheme.db_set("risk_band", 3)
    frappe.db.commit()
    
    # Simulate UI payload
    ui_payload = doc.as_dict()
    ui_payload["status"] = "Approved"
    for row in ui_payload["changed_fields"]:
        row["apply_change"] = 1
        
    try:
        updated_doc = frappe.get_doc(ui_payload)
        updated_doc.save()
        frappe.db.commit()
        print("Saved successfully.")
    except Exception as e:
        print(f"Error during save: {e}")
        frappe.db.rollback()

    scheme = frappe.get_doc("SIF Scheme", doc.scheme)
    print(f"Scheme risk_band: {scheme.risk_band}")
