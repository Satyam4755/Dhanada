import frappe

def run():
    scheme_name = "25"
    scheme = frappe.get_doc("SIF Scheme", scheme_name)
    
    # Store initial for reference
    original_min_sub = scheme.minimum_subscription
    
    # Force a change in DB to trigger sync discrepancy
    scheme.db_set("minimum_subscription", 7777777.0)
    
    # Run sync to create approval doc
    from dhanada.sif.sync.scheduler import sync_scheme_details
    sync_scheme_details()
    
    # Get the latest pending approval
    approvals = frappe.get_all("SIF Scheme Approval", filters={"scheme": scheme_name, "docstatus": 0}, order_by="creation desc", limit=1)
    if not approvals:
        print("Fail: No pending approval document was created.")
        return
        
    approval_doc = frappe.get_doc("SIF Scheme Approval", approvals[0].name)
    print(f"Created Approval Doc: {approval_doc.name}")
    
    # Check the minimum_subscription row
    checked = False
    for row in approval_doc.changed_fields:
        if row.field_name == "minimum_subscription":
            row.apply_change = 1
            checked = True
        else:
            row.apply_change = 0
            
    if not checked:
        print("Fail: Did not find minimum_subscription in changed_fields.")
        return
        
    approval_doc.save()
    
    # Submit the document
    approval_doc.submit()
    
    # Verify it updated the SIF Scheme (GitHub value overwrites 7777777.0)
    scheme_after_submit = frappe.get_doc("SIF Scheme", scheme_name)
    submitted_val = scheme_after_submit.minimum_subscription
    print(f"After submit min sub: {submitted_val} (Should NOT be 7777777.0)")
    
    # Check cancel permission
    has_cancel_perm = frappe.permissions.has_permission("SIF Scheme Approval", ptype="cancel", doc=approval_doc.name)
    print(f"Has Cancel Permission: {has_cancel_perm}")
    
    # Cancel the document
    approval_doc.cancel()
    
    # Verify DocStatus
    print(f"Final DocStatus: {approval_doc.docstatus}")
    
    # Verify it reverted to the OLD value (7777777.0)
    scheme_after_cancel = frappe.get_doc("SIF Scheme", scheme_name)
    cancelled_val = scheme_after_cancel.minimum_subscription
    print(f"After cancel min sub: {cancelled_val}")
    
    if float(cancelled_val) == 7777777.0:
        print("Success: The field was successfully reverted to its previous value!")
    else:
        print("Fail: The field did NOT revert to its previous value.")
