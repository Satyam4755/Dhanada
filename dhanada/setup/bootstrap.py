import frappe

def after_install():
    ensure_master_data()

def after_migrate():
    ensure_master_data()


frappe.logger().info("Running bootstrap...")
def ensure_master_data():
    """
    Main function to ensure all master data exists.
    Call all specific ensure_* functions from here.
    """
    frappe.logger().info("Starting Dhanada bootstrap process...")
    ensure_crm_sources()
    frappe.logger().info("Finished Dhanada bootstrap process.")

def ensure_crm_sources():
    """
    Ensure required CRM Lead Sources exist.
    """
    required_sources = [
        "Website Chatbot",
        "Website Form",
        "Website",
        "WhatsApp",
        "Referral",
        "Manual"
    ]
    
    for source in required_sources:
        if not frappe.db.exists("CRM Lead Source", {"source_name": source}):
            try:
                # Create the CRM Lead Source
                doc = frappe.get_doc({
                    "doctype": "CRM Lead Source",
                    "source_name": source,
                    "details": ""
                })
                # Attempt to insert, ignore if it already exists (to be extra safe)
                doc.insert(ignore_permissions=True)
                frappe.logger().info(f"Created CRM Lead Source: {source}")
            except Exception as e:
                frappe.logger().error(f"Failed to create CRM Lead Source '{source}': {str(e)}")
        else:
            frappe.logger().info(f"Skipped existing CRM Lead Source: {source}")
