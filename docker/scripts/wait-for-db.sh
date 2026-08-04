#!/bin/bash
set -e

# Uses ping/mysqladmin or python to check DB readiness
# Frappe base image has python available
python3 -c "
import socket
import time
import os

host = os.environ.get('DB_HOST', 'mariadb')
port = int(os.environ.get('DB_PORT', 3306))

for i in range(30):
    try:
        s = socket.create_connection((host, port), timeout=1)
        s.close()
        print('Database is up!')
        exit(0)
    except OSError:
        print('Waiting for database...')
        time.sleep(2)
print('Database did not start in time.')
exit(1)
"
