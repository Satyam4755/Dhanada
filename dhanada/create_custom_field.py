import frappe

def create_field():
    if not frappe.db.exists("Custom Field", "CRM Lead-interest"):
        custom_field = frappe.get_doc({
            "doctype": "Custom Field",
            "dt": "CRM Lead",
            "fieldname": "interest",
            "label": "Interest",
            "fieldtype": "Data",
            "insert_after": "source"
        })
        custom_field.insert(ignore_permissions=True)
        frappe.db.commit()
        print("Custom field created.")
    else:
        print("Custom field already exists.")
