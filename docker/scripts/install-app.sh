#!/bin/bash
set -e

APP_NAME=$1

echo "Checking if ${APP_NAME} is installed on bench..."
if ! grep -q "^${APP_NAME}$" sites/apps.txt; then
    if [ -d "apps/${APP_NAME}" ]; then
        echo "Registering locally mounted ${APP_NAME}..."
        bench pip install -e apps/${APP_NAME}
        # Prevent duplicates
        if ! grep -q "^${APP_NAME}$" sites/apps.txt; then
            echo "${APP_NAME}" >> sites/apps.txt
        fi
    else
        echo "Fetching ${APP_NAME}..."
        bench get-app ${APP_NAME}
    fi
else
    echo "${APP_NAME} already exists in bench."
fi

echo "Installing ${APP_NAME} on site ${SITE_NAME}..."
bench --site ${SITE_NAME} install-app ${APP_NAME} || true
