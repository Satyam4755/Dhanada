import frappe

def check():
    amcs = frappe.get_all("SIF Asset Management Company", fields=["name", "rta"])
    for a in amcs:
        print(a)
