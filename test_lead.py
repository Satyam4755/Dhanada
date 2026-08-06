import frappe
def test():
    try:
        lead = frappe.get_doc({
            "doctype": "CRM Lead",
            "first_name": "Test",
            "chat_summary": "test summary",
            "status": "Lead"
        })
        lead.insert(ignore_permissions=True)
        frappe.db.commit()
        print(f"Created Lead: {lead.name}")
    except Exception as e:
        print(f"Error: {e}")
