import frappe

def run():
    frappe.db.commit() # start clean

    # 1. Create a dummy scheme
    try:
        scheme = frappe.get_doc({
            "doctype": "SIF Scheme",
            "scheme_name": "Test Scheme Approval",
            "sebi_code": "TEST1234",
            "risk_band": 3,
            "scheme_type": "Open Ended"
        })
        scheme.insert(ignore_permissions=True)
        frappe.db.commit()
    except Exception as e:
        frappe.db.rollback()
        scheme = frappe.get_doc("SIF Scheme", {"sebi_code": "TEST1234"})

    # 2. Create approval request
    approval = frappe.get_doc({
        "doctype": "SIF Scheme Approval",
        "scheme": scheme.name,
        "status": "Pending"
    })
    
    approval.append("changed_fields", {
        "field_name": "risk_band",
        "old_value": "3",
        "new_value": "1",
        "apply_change": 0
    })
    
    approval.insert(ignore_permissions=True)
    frappe.db.commit()

    print(f"Created Approval: {approval.name}")

    # 3. Simulate UI saving with Approved status and apply_change = 1
    approval.status = "Approved"
    approval.changed_fields[0].apply_change = 1
    approval.save(ignore_permissions=True)
    frappe.db.commit()

    # 4. Check if Scheme was updated
    scheme.reload()
    print(f"Scheme risk_band after approval: {scheme.risk_band}")

