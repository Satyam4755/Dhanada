import frappe

def run():
    docs = frappe.get_all("SIF Scheme", fields=["name", "scheme_name", "sebi_code"])
    deleted_count = 0
    for d in docs:
        name_lower = str(d.scheme_name).lower()
        if "test" in name_lower or "e2e" in name_lower or "apex" in name_lower or "summit" in name_lower or "platinum" in name_lower or "diviniti" in name_lower or str(d.sebi_code).startswith("TEMP_"):
            print(f"Deleting scheme: {d.scheme_name} ({d.sebi_code})")
            frappe.delete_doc("SIF Scheme", d.name, force=1, ignore_permissions=True)
            deleted_count += 1
            
    frappe.db.commit()
    print(f"Deleted {deleted_count} schemes.")
