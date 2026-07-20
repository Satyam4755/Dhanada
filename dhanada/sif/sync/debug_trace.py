import frappe
from dhanada.sif.sync.github_client import GitHubClient
from dhanada.sif.sync.mapper import DataMapper
from dhanada.sif.sync.importer import DataImporter
import traceback

def trace_first_scheme():
    print("--- TRACE START ---")
    try:
        client = GitHubClient()
        scheme_data = client.fetch_scheme_details()
        if not scheme_data:
            print("No scheme data fetched.")
            return

        first_raw = scheme_data[0]
        sebi_code = first_raw.get("sebi_code")
        print(f"1. sebi_code: {sebi_code}")

        mapper = DataMapper()
        dataset = mapper.map_dataset({"scheme_details": [first_raw]})
        
        schemes = dataset.schemes
        if not schemes:
            print("2. Mapper did NOT create a Scheme object.")
            print(f"Validation errors: {mapper.validator.errors}")
            return
            
        print(f"2. Mapper created Scheme object: Yes. ({len(schemes)} schemes)")
        scheme_obj = schemes[0]
        print(f"   Mapped sif_name: '{scheme_obj.sif_name}'")

        importer = DataImporter(dry_run=False)
        print("3. Calling _upsert_scheme()...")
        
        # We manually trace what _upsert_scheme would do:
        amc_doc = None
        if scheme_obj.sif_name:
            amc_doc = frappe.db.get_value("SIF Asset Management Company", {"sif_name": scheme_obj.sif_name}, "name")
            
        print(f"   AMC Lookup Result: {amc_doc}")
        
        if not amc_doc:
            print(f"6. doc.insert() is SKIPPED.")
            print(f"   Exact condition: 'if not amc_doc:' (Because sif_name is '{scheme_obj.sif_name}' and AMC was not found in DB)")
            return
            
        exists = frappe.db.exists("SIF Scheme", {"sebi_code": scheme_obj.sebi_code})
        if exists:
            print("4. frappe.new_doc('SIF Scheme') is NOT executed (Scheme already exists).")
            print("5. doc.insert() is NOT executed (doc.save() would be executed instead).")
            return
            
        print("4. frappe.new_doc('SIF Scheme') WOULD BE executed.")
        print("5. doc.insert() WOULD BE executed.")
        print("7. If doc.insert() executes, but record is not present, it implies frappe.db.commit() was not called or an exception triggered frappe.db.rollback().")
        
        # Let's actually call it and see if it inserts.
        try:
            importer._upsert_scheme(scheme_obj)
            print("   _upsert_scheme executed without throwing Python exception.")
            # Verify if it's in DB
            in_db = frappe.db.exists("SIF Scheme", {"sebi_code": scheme_obj.sebi_code})
            if in_db:
                print(f"   Verified in DB: YES. It is present. DB Name: {in_db}")
            else:
                print("   Verified in DB: NO. It was not committed to MariaDB.")
        except Exception as e:
            print(f"   Exception during _upsert_scheme: {e}")
            traceback.print_exc()
            
    except Exception as e:
        print(f"Error in trace: {e}")
        traceback.print_exc()
    print("--- TRACE END ---")
