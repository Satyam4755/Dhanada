#!/bin/bash
set -e

echo "Waiting for database..."
/docker/scripts/wait-for-db.sh

echo "Initializing Frappe site: ${SITE_NAME}"

# Check if site exists
if [ ! -d "sites/${SITE_NAME}" ]; then
    echo "Creating new site ${SITE_NAME}..."
    bench new-site ${SITE_NAME} \
        --db-root-password ${DB_ROOT_PASSWORD} \
        --admin-password ${ADMIN_PASSWORD} \
        --mariadb-root-username ${DB_ROOT_USER}
else
    echo "Site ${SITE_NAME} already exists."
fi

echo "Installing CRM app..."
/docker/scripts/install-app.sh crm

echo "Installing Dhanada app..."
/docker/scripts/install-app.sh dhanada

echo "Running migrations..."
bench --site ${SITE_NAME} migrate

echo "Building assets..."
bench build

echo "Initialization complete!"
