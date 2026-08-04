#!/bin/bash
set -e

# Usage: ./docker/scripts/backup.sh
# Connects to the backend container to perform a backup

if [ -z "$SITE_NAME" ]; then
    # Parse site name from .env
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Creating backup for ${SITE_NAME}..."
docker compose exec backend bench --site ${SITE_NAME} backup --with-files
echo "Backup complete. Files are stored in frappe-bench/sites/${SITE_NAME}/private/backups/"
