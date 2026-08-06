import json

file_path = 'apps/dhanada/dhanada/sif/doctype/sif_scheme_approval/sif_scheme_approval.json'

with open(file_path, 'r') as f:
    data = json.load(f)

for perm in data.get("permissions", []):
    if perm.get("role") == "System Manager":
        perm["cancel"] = 1

with open(file_path, 'w') as f:
    json.dump(data, f, indent=1)

