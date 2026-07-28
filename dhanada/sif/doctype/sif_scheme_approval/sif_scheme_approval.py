# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class SIFSchemeApproval(Document):
	_DOCTYPE_NAME = "SIF Scheme Approval"

	def on_update(self):
		# Prevent duplicate execution: only run if status JUST changed to Approved
		old_doc = self.get_doc_before_save()
		if self.status == "Approved" and old_doc and old_doc.status != "Approved":
			# Prevent recursion since process_approval() calls doc.save() internally
			if not self.flags.currently_processing_approval:
				self.flags.currently_processing_approval = True
				
				from dhanada.sif.sync.approval import process_approval
				process_approval(self)
				
				self.flags.currently_processing_approval = False
