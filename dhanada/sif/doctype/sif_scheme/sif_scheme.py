# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SIFScheme(Document):
	def before_insert(self):
		if not self.flags.from_approval:
			frappe.throw("Direct creation of SIF Scheme is not allowed. Please use the 'SIF New Scheme Approval' workflow.", title="Approval Required")
