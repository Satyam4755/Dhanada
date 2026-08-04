ARG FRAPPE_VERSION=v15
FROM frappe/frappe-nginx:${FRAPPE_VERSION}

# Use default frappe-nginx configuration.
# If additional proxying rules are needed (e.g. for AI backend), they can be added here.
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
