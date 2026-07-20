import frappe

def check():
    meta = frappe.get_meta("SIF Asset Management Company")
    field = meta.get_field("rta")
    if field:
        print(f"Fieldname: {field.fieldname}")
        print(f"Fieldtype: {field.fieldtype}")
        print(f"Reqd: {field.reqd}")
        print(f"Options: {field.options}")
    else:
        print("Field 'rta' not found in DocType.")
