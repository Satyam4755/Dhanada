import frappe

def run():
    custom_field_name = "CRM Lead-chat_summary"
    if frappe.db.exists("Custom Field", custom_field_name):
        doc = frappe.get_doc("Custom Field", custom_field_name)
        doc.read_only = 1
        doc.insert_after = "source"
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        
        # Clear cache so it updates in UI immediately
        frappe.clear_cache(doctype="CRM Lead")
        print("Updated 'chat_summary' field successfully.")
    else:
        print("Custom field 'chat_summary' not found.")
