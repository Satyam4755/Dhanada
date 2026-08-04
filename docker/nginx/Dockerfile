ARG FRAPPE_VERSION=v15
FROM frappe/erpnext:${FRAPPE_VERSION}

# The official frappe/erpnext image (v15+) is a unified image that also contains Nginx.
# It uses nginx-entrypoint.sh to handle proxying and static asset serving.
# We will leverage the built-in default templates.

CMD ["nginx-entrypoint.sh"]
