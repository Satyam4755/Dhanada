import frappe
import json

def get_approval():
    approvals = frappe.get_all("SIF Scheme Approval", order_by="creation desc", limit=1)
    if not approvals:
        return "No approvals found"
        
    doc = frappe.get_doc("SIF Scheme Approval", approvals[0].name)
    
    result = {
        "name": doc.name,
        "scheme": doc.scheme,
        "changed_fields": []
    }
    
    for item in doc.changed_fields:
        result["changed_fields"].append({
            "field_name": item.field_name,
            "old_value": item.old_value,
            "new_value": item.new_value
        })
        
    print(json.dumps(result, indent=2))

