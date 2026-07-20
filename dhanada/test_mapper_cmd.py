import json
from pprint import pprint
from dataclasses import asdict
from dhanada.sif.sync.mapper import DataMapper

def execute():
    with open("/tmp/AMFI_Fetcher/data/sif/scheme/details/altv_i_h_hlsf_25_09_0001_edel.json", "r") as f:
        raw_json = json.load(f)

    # Inject what fetch_scheme_data.py will inject
    raw_json["sif_name"] = "Altiva SIF"

    raw_data = {
        "scheme_details": [raw_json],
        "nav_daily": [],
        "performance": []
    }

    mapper = DataMapper()
    dataset = mapper.map_dataset(raw_data)

    print("\n--- SCHEME OBJECT ---")
    if dataset.schemes:
        pprint(asdict(dataset.schemes[0]))

    print("\n--- FIRST SCHEME PLAN OBJECT ---")
    if dataset.scheme_plans:
        pprint(asdict(dataset.scheme_plans[0]))

    print("\n--- FUND MANAGERS ---")
    for fm in dataset.fund_managers:
        pprint(asdict(fm))

    print("\n--- SUBCATEGORIES ---")
    for sub in dataset.subcategories:
        pprint(asdict(sub))
