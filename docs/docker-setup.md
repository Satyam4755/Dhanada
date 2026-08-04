# Docker Setup Guide

This project is fully Dockerized using Frappe's official Docker architecture combined with modern web development practices (Node.js/React).

## Architecture Overview

The application relies on several interconnected containers:

1. **mariadb**: Official MariaDB container optimized for Frappe database needs.
2. **redis-cache / redis-queue / redis-socketio**: Three dedicated Redis containers for Frappe caching, background jobs, and WebSocket handling.
3. **configurator**: A transient container that runs once during startup to automatically initialize the site, run database migrations, and install Frappe apps (CRM and Dhanada).
4. **backend**: Gunicorn (Python) server processing HTTP requests.
5. **frontend**: Nginx server handling static assets and proxying API/Websocket requests.
6. **websocket**: Node.js socket.io server for real-time Frappe events.
7. **queue-short / queue-long / scheduler**: Frappe background workers.
8. **ai-backend**: A dedicated Node.js container to run the conversational AI chatbot, securely loading `GEMINI_API_KEY` from your environment.
9. **react-frontend**: A Node.js container running the Vite dev server for the React UI.

## File Hierarchy

```text
├── docker-compose.yml       # Primary orchestration file
├── Makefile                 # Shortcuts for starting/stopping the stack
├── .env.example             # Template for environment variables
└── docker/
    ├── frappe/
    │   ├── Dockerfile       # Custom Frappe worker image
    │   └── entrypoint.sh    # Ensures MariaDB is ready before starting
    ├── nginx/
    │   ├── Dockerfile       # Custom Nginx image
    │   └── nginx.conf       # Custom proxy rules
    └── scripts/
        ├── init-site.sh     # Bootstraps the Frappe site automatically
        ├── install-app.sh   # Fetches and installs Frappe apps
        ├── wait-for-db.sh   # Healthcheck script for MariaDB
        └── backup.sh        # Utility script to back up the site
```

## Local Development Highlights

Unlike a standard production deployment where source code is baked into the image, this setup achieves a **hybrid local-development flow**:

- The `dhanada`, `ai_backend`, and `frontend` directories are mounted directly from your host machine into their respective containers.
- This means changes in Python, JS, or CSS will reflect immediately.
- The `frappe-bench` directory is dynamically generated *inside* the Docker volumes and is entirely transparent to the host. You never need to run `bench init` locally again.
