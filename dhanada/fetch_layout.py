import frappe
import json

def run():
    side_panel = frappe.db.get_value('CRM Fields Layout', 'CRM Lead-Side Panel', 'layout')
    data_fields = frappe.db.get_value('CRM Fields Layout', 'CRM Lead-Data Fields', 'layout')
    
    print("--- SIDE PANEL ---")
    print(side_panel)
    print("--- DATA FIELDS ---")
    print(data_fields)
