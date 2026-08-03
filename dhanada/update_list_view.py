import frappe

def run():
    # Make interest visible in List View
    doc = frappe.get_doc('Custom Field', 'CRM Lead-interest')
    doc.in_list_view = 1
    doc.in_standard_filter = 1
    doc.save(ignore_permissions=True)
    
    # Ensure chat_summary is NOT in List View
    doc_chat = frappe.get_doc('Custom Field', 'CRM Lead-chat_summary')
    doc_chat.in_list_view = 0
    doc_chat.in_standard_filter = 0
    doc_chat.save(ignore_permissions=True)

    frappe.db.commit()
    frappe.clear_cache(doctype='CRM Lead')
    print("List view properties updated successfully.")
