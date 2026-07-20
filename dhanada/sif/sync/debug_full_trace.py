import frappe
from dhanada.sif.sync.github_client import GitHubClient
from dhanada.sif.sync.mapper import DataMapper
from dhanada.sif.sync.importer import DataImporter
import traceback

def run():
    print("\n--- SIF SYNC END-TO-END DIAGNOSIS ---")
    
    # 1. GitHubClient Fetch
    client = GitHubClient()
    print("1. Fetching from GitHub...")
    
    directory = "data/sif/scheme/details"
    files = client._list_directory(directory)
    json_files = [f for f in files if f.get("name", "").endswith(".json")]
    print(f"   Number of JSON files on GitHub: {len(json_files)}")
    
    if not json_files:
        print("   No JSON files found!")
        return

    first_file = json_files[0]
    print(f"2. First JSON filename: {first_file['name']}")
    
    # Fetch content
    content = client._download_file(first_file["download_url"])
    import json
    raw_scheme = json.loads(content)
    
    # Extract raw fields
    raw_sif = raw_scheme.get("sif_name")
    raw_sebi = raw_scheme.get("sebi_code")
    print(f"3. Value of sif_name in fetched JSON: {repr(raw_sif)}")
    print(f"4. Value of sebi_code in fetched JSON: {repr(raw_sebi)}")
    
    # 2. DataMapper
    print("\n--- MAPPER STAGE ---")
    mapper = DataMapper()
    dataset = mapper.map_dataset({"scheme_details": [raw_scheme]})
    
    created_scheme = len(dataset.schemes) > 0
    print(f"5. Whether a Scheme object is created in SyncDataset: {created_scheme}")
    
    if not created_scheme:
        print("   -> Mapper validation failed. Stop.")
        return
        
    scheme_obj = dataset.schemes[0]
    print(f"   Mapped Scheme obj sif_name: {repr(scheme_obj.sif_name)}")
    
    # 3. DataImporter
    print("\n--- IMPORTER STAGE ---")
    importer = DataImporter(dry_run=False)
    
    # We will simulate the exact _upsert_scheme logic with print statements
    print(f"6. Whether _upsert_scheme() is called: Yes (simulating it now)")
    
    try:
        amc_doc = None
        if scheme_obj.sif_name:
            amc_doc = frappe.db.get_value("SIF Asset Management Company", {"sif_name": scheme_obj.sif_name}, "name")

        if not amc_doc:
            print(f"   -> WARNING: amc_doc is None (Lookup failed for sif_name={repr(scheme_obj.sif_name)}).")
            print(f"   -> EXACT CAUSE: The 'if not amc_doc:' block is triggered!")
            print(f"   -> doc.insert() WILL BE SKIPPED.")
            print(f"7. Whether frappe.new_doc() executes: No")
            print(f"8. Whether doc.insert() executes: No")
            return
            
        print(f"   -> AMC Document Found: {amc_doc}")
            
        exists = frappe.db.exists("SIF Scheme", {"sebi_code": scheme_obj.sebi_code})
        if exists:
            print(f"   -> Scheme already exists in DB as {exists}.")
            print(f"7. Whether frappe.new_doc() executes: No")
            print(f"8. Whether doc.insert() executes: No (update executes instead)")
        else:
            print(f"7. Whether frappe.new_doc() executes: Yes")
            print(f"8. Whether doc.insert() executes: Yes")
            
            # Actually try to insert it
            print("\n--- DATABASE EXECUTION ---")
            doc = frappe.new_doc("SIF Scheme")
            doc.sebi_code = scheme_obj.sebi_code
            importer._map_scheme_fields(doc, scheme_obj, amc_doc)
            
            try:
                doc.insert(ignore_permissions=True)
                frappe.db.commit()
                print("9. Whether doc.insert() succeeds: Yes")
            except Exception as e:
                frappe.db.rollback()
                print(f"9. Whether doc.insert() succeeds: No (Exception: {e})")
                
            # Verify immediately
            immediate_exists = frappe.db.exists("SIF Scheme", {"sebi_code": scheme_obj.sebi_code})
            print(f"10. Whether the document exists immediately afterwards: {bool(immediate_exists)} (doc_name: {immediate_exists})")

    except Exception as e:
        print(f"Error during import: {e}")
        traceback.print_exc()

