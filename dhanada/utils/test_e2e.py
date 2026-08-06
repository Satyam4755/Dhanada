import frappe

def test():
    # 1. Modify two fields in a SIF Scheme
    scheme_name = "25"
    scheme = frappe.get_doc("SIF Scheme", scheme_name)
    
    # Store old values to reset later if needed, but we will just assert they change back
    original_min_sub = scheme.minimum_subscription
    original_risk_band = scheme.risk_band
    
    # Force changes
    scheme.db_set("minimum_subscription", 9999999.0)
    scheme.db_set("risk_band", 6)
    
    # 2. Run sync
    from dhanada.sif.sync.scheduler import sync_scheme_details
    result = sync_scheme_details()
    
    # 3. Find the created approval doc
    approvals = frappe.get_all("SIF Scheme Approval", filters={"scheme": scheme_name, "docstatus": 0}, order_by="creation desc")
    approval_doc = frappe.get_doc("SIF Scheme Approval", approvals[0].name)
    print("Created Approval Doc:", approval_doc.name)
    
    # 5. Check only ONE row (e.g. minimum_subscription)
    for row in approval_doc.changed_fields:
        if row.field_name == "minimum_subscription":
            row.apply_change = 1
        else:
            row.apply_change = 0
            
    approval_doc.save()
    
    # 6. Submit the approval
    approval_doc.submit()
    
    # 7. Prove only selected field updated
    scheme_updated = frappe.get_doc("SIF Scheme", scheme_name)
    
    print("Final min sub:", scheme_updated.minimum_subscription)
    print("Final risk band:", scheme_updated.risk_band)
    
    # Assertions
    if float(scheme_updated.minimum_subscription) != 9999999.0:
        print("Success: minimum_subscription was updated!")
    else:
        print("Fail: minimum_subscription was NOT updated")
        
    if int(scheme_updated.risk_band or 0) == 6:
        print("Success: risk_band remained unchanged because it was NOT checked!")
    else:
        print("Fail: risk_band was unexpectedly overwritten!")
        
