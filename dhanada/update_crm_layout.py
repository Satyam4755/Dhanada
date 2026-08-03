import frappe
import json

def insert_after(fields_list, target_field, new_fields):
    if target_field in fields_list:
        idx = fields_list.index(target_field)
        for i, new_field in enumerate(new_fields):
            if new_field not in fields_list:
                fields_list.insert(idx + 1 + i, new_field)

def run():
    # Update Side Panel
    side_panel_doc = frappe.get_doc('CRM Fields Layout', 'CRM Lead-Side Panel')
    side_layout = json.loads(side_panel_doc.layout)
    for section in side_layout:
        for column in section.get('columns', []):
            insert_after(column.get('fields', []), 'source', ['interest', 'chat_summary'])
    side_panel_doc.layout = json.dumps(side_layout)
    side_panel_doc.save(ignore_permissions=True)

    # Update Data Fields
    data_fields_doc = frappe.get_doc('CRM Fields Layout', 'CRM Lead-Data Fields')
    data_layout = json.loads(data_fields_doc.layout)
    for section in data_layout:
        for column in section.get('columns', []):
            insert_after(column.get('fields', []), 'source', ['interest', 'chat_summary'])
    data_fields_doc.layout = json.dumps(data_layout)
    data_fields_doc.save(ignore_permissions=True)
    
    frappe.db.commit()
    print("Successfully added 'interest' and 'chat_summary' to CRM Lead UI layouts.")
