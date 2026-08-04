#!/bin/bash
set -e

# Wait for db to be ready (a simple wait could also be handled by docker-compose depends_on, but this is safer)
if [ -f "/docker/scripts/wait-for-db.sh" ]; then
    /docker/scripts/wait-for-db.sh
fi

exec "$@"
