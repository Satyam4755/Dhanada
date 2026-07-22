import frappe
from dhanada.api import get_funds_list, get_fund_details

def run():
    funds = get_funds_list()
    data = funds.get("data", [])

    print(f"Total funds returned: {len(data)}")

    new_funds = [f for f in data if f['launchDate'] and f['launchDate'].year >= 2024]
    old_funds = [f for f in data if f['launchDate'] and f['launchDate'].year <= 2021]

    print("\n--- NEW FUNDS ---")
    for f in new_funds[:3]:
        print(f"{f['name']} (Launch: {f['launchDate']}) -> 1Y: {f['returns1Y']}, 3Y: {f['returns3Y']}, 5Y: {f['returns5Y']}")

    print("\n--- OLD FUNDS ---")
    for f in old_funds[:3]:
        print(f"{f['name']} (Launch: {f['launchDate']}) -> 1Y: {f['returns1Y']}, 3Y: {f['returns3Y']}, 5Y: {f['returns5Y']}")

    # Test get_fund_details
    print("\n--- FUND DETAILS TEST (New Fund) ---")
    if new_funds:
        details = get_fund_details(new_funds[0]['sebi_code'] or new_funds[0]['name'])
        print(f"Details for {details['data']['name']}:")
        plan = details['data']['defaultPlan']
        if plan and plan.get('performance_data'):
            print(plan['performance_data'])

    print("\n--- FUND DETAILS TEST (Old Fund) ---")
    if old_funds:
        details = get_fund_details(old_funds[0]['sebi_code'] or old_funds[0]['name'])
        print(f"Details for {details['data']['name']}:")
        plan = details['data']['defaultPlan']
        if plan and plan.get('performance_data'):
            print(plan['performance_data'])
