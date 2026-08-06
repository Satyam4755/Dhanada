import frappe
import json
from frappe.utils import random_string

def patch_layout():
    """
    Intelligently patches the CRM Lead 'Side Panel' layout to ensure 
    the Chatbot Context section is always visible without overwriting 
    user customizations.
    """
    if not frappe.db.exists("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"}):
        return

    doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"})
    if not doc.layout:
        return

    layout = json.loads(doc.layout)
    
    # Check if chat_summary already exists anywhere in the layout
    field_exists = False
    for section in layout:
        for column in section.get("columns", []):
            if "chat_summary" in column.get("fields", []):
                field_exists = True
                break
        if field_exists:
            break
            
    if field_exists:
        # Idempotent: Do nothing if already present
        return

    # Create the new context section
    new_section = {
        "label": "Chatbot Context",
        "name": f"context_section_{random_string(4)}",
        "opened": True,
        "columns": [
            {
                "name": f"column_{random_string(4)}",
                "fields": ["chat_summary_html"]
            }
        ]
    }
    
    # Append the section to the end of the side panel layout
    layout.append(new_section)
    
    # Save back to database
    doc.layout = json.dumps(layout)
    doc.save(ignore_permissions=True)
    frappe.db.commit()
    print("Successfully injected Chatbot Context section into CRM Lead Side Panel Layout.")

