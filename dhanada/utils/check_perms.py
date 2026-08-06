import frappe

def run():
    meta = frappe.get_meta("SIF Scheme Approval")
    print("is_submittable:", meta.is_submittable)

    perms = frappe.get_all("DocPerm", filters={"parent": "SIF Scheme Approval", "role": "System Manager"}, fields=["`read`", "`write`", "`submit`", "`cancel`"])
    print("Permissions (System Manager):", perms)

    # Check active workflows
    workflows = frappe.get_all("Workflow", filters={"document_type": "SIF Scheme Approval", "is_active": 1})
    print("Active Workflows:", workflows)
