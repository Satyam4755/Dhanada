# Dhanada

Dhanada is a specialized investment platform for KNAPS. It integrates a Frappe CRM backend, an AI-powered chatbot backend (Node.js + Gemini), and a React frontend. The goal of this platform is to provide users with seamless mutual fund discovery, performance tracking, dynamic SIP/Lumpsum comparisons, and organic lead capture for our investment advisors.

This repository is **fully Dockerized**. You do not need to install Python, Frappe Bench, MariaDB, or Redis on your host machine.

---

## 🚀 Quick Start (Dockerized Development)

To get a complete working environment locally, follow these steps.

### Prerequisites
- **Docker** and **Docker Compose (v2)**
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/knapsfs/Dhanada2.0.git dhanada
cd dhanada
```

### Step 2: Set up Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env` to add your actual `GEMINI_API_KEY`. (Do not change database variables unless necessary).

### Step 3: Start the Environment
Use Docker Compose to spin up all 11 services and automatically bootstrap the Frappe site:
```bash
docker compose up -d
```
*Note: The first run will take a few minutes as it pulls images, initializes MariaDB, creates the Frappe site, installs the CRM module, and runs migrations.*

To watch the initialization logs, run:
```bash
docker compose logs -f configurator
```

### Step 4: Access the Services

Once the `configurator` service completes successfully, you can access:
- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **Frappe Desk / CRM**: [http://localhost:8080/app](http://localhost:8080/app) (Login: `Administrator` / `admin`)
- **AI Backend API**: [http://localhost:3405](http://localhost:3405)

---

## 🛠️ Development Workflow

Your local directories (`dhanada`, `ai_backend`, and `frontend`) are heavily mounted into the Docker containers.

- Edit Python files in `./dhanada` → Changes reflect in the `backend` container instantly.
- Edit JS files in `./frontend` → Vite auto-reloads.
- Edit JS files in `./ai_backend` → Node auto-restarts (assuming you use nodemon/similar, or simply restart the specific container: `docker compose restart ai-backend`).

### Helpful Makefile Commands
We have provided a `Makefile` for convenience:
- `make up`: Starts all services.
- `make down`: Stops all services.
- `make logs`: Follows logs for all services.
- `make shell`: Opens a bash shell inside the Frappe `backend` container (as the `frappe` user).
- `make shell-root`: Opens a root bash shell inside the `backend` container.
- `make clean`: Destroys the environment completely (removes containers and deletes persistent volumes/cache).

### Running Bench Commands
If you need to run specific bench commands (e.g., generating boilerplate code or executing scripts), jump into the backend container:
```bash
make shell
bench --site newSite.local migrate
```

---

## 📖 Architecture & Details

For an in-depth explanation of the Docker architecture, initialization scripts, and why the `frappe-bench` directory is excluded from version control, please read our [Docker Setup Guide](docs/docker-setup.md).

---

## 📜 License

MIT
