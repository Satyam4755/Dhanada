import frappe
import re

def execute():
    schemes = frappe.get_all("SIF Scheme", fields=["name", "risk_band"])
    updated = 0
    for scheme in schemes:
        if scheme.risk_band is not None:
            val_str = str(scheme.risk_band)
            match = re.search(r'\d+', val_str)
            if match:
                risk_val = int(match.group())
                if 1 <= risk_val <= 5:
                    frappe.db.set_value("SIF Scheme", scheme.name, "risk_band", risk_val)
                    updated += 1
                else:
                    frappe.db.set_value("SIF Scheme", scheme.name, "risk_band", None)
                    updated += 1
            else:
                frappe.db.set_value("SIF Scheme", scheme.name, "risk_band", None)
                updated += 1
    
    frappe.db.commit()
    print(f"Normalized {updated} SIF Scheme risk_band values.")
