import frappe
import json

def run():
    print(json.dumps(frappe.db.get_value('Custom Field', 'CRM Lead-interest', ['in_list_view', 'in_standard_filter'], as_dict=True)))
