import frappe

def test():
    meta = frappe.get_meta("SIF Scheme Approval Item")
    for df in meta.fields:
        print(f"Field: {df.fieldname}, Type: {df.fieldtype}, in_list_view: {df.in_list_view}, hidden: {df.hidden}, columns: {df.columns}, reqd: {df.reqd}")

