# Dhanada

Dhanada is a specialized investment platform for KNAPS. It integrates a Frappe CRM backend, an AI-powered chatbot backend (Node.js + Gemini), and a React frontend. The goal of this platform is to provide users with seamless mutual fund discovery, performance tracking, dynamic SIP/Lumpsum comparisons, and organic lead capture for our investment advisors.

This documentation serves as the ultimate onboarding guide for new developers.

---

## 📂 1. Project Overview

This repository is a full-stack application structured as a Frappe App. It contains both Frappe-specific modules and decoupled frontend/backend services.

### Repository Structure

- **`dhanada/`**: The core Frappe app directory. Contains backend Python API logic (`api.py`), DocType definitions, and server-side scripts for the CRM.
- **`frontend/`**: The React (Vite) frontend application. This is where the user interface, including the investment dashboard and chatbot UI, is built.
- **`ai_backend/`**: A Node.js backend running the conversational AI chatbot. It integrates with Google Gemini and Frappe CRM APIs.
- **`.github/`**: GitHub Actions workflows for continuous integration (CI) and automated linting.

---

## 🛠️ 2. Prerequisites

Before cloning the repository, ensure your development environment has the necessary tools installed.

### Common Requirements (All OS)
- **Git**: For version control.
- **Node.js** (v18+): Required to run the React frontend and AI Backend.
- **npm** or **yarn**: Package managers for Node.js.
- **Python** (v3.10+): Required by Frappe framework.
- **MariaDB** (v10.6+): The primary database for Frappe CRM.
- **Redis**: In-memory data structure store used by Frappe for caching and background jobs.
- **Frappe Bench**: The CLI tool to manage Frappe environments.
- **VS Code**: Recommended IDE with ESLint and Prettier extensions.

### macOS specific Requirements
If you are on macOS, the easiest way to install these is using **Homebrew**:
```bash
brew install git python node redis mariadb
```

### Windows specific Requirements
If you are on Windows, it is highly recommended to use **WSL (Windows Subsystem for Linux)** with Ubuntu to run the Frappe framework natively.
```bash
wsl --install
```
Once inside WSL, install the dependencies using `apt`:
```bash
sudo apt update
sudo apt install git python3 nodejs redis-server mariadb-server
```

---

## 📥 3. Repository Clone

Clone the repository to your local machine into your Frappe bench's apps directory.

### Git HTTPS (If you haven't set up SSH keys)
```bash
git clone https://github.com/knapsfs/Dhanada2.0.git dhanada
```

### Git SSH (Recommended)
```bash
git clone git@github.com:knapsfs/Dhanada2.0.git dhanada
```

*(Note: The cloning should ideally be done inside your bench's `apps` folder during the Bench Setup phase).*

---

## 🏗️ 4. Initial Frappe Bench Setup

If this is your first time setting up Frappe on this machine, follow these steps to initialize a new bench.

### macOS & Linux (or Windows WSL)

1. **Install Bench CLI**
   ```bash
   pip3 install frappe-bench
   ```
   *Installs the bench command-line utility globally.*

2. **Initialize a new bench**
   ```bash
   bench init frappe-bench --frappe-branch version-15
   ```
   *Creates a new directory called `frappe-bench`, clones the Frappe framework, and sets up Python virtual environments and directory structures.*

3. **Switch to the bench directory**
   ```bash
   cd frappe-bench
   ```

4. **Create a new site**
   ```bash
   bench new-site newSite.local
   ```
   *Creates a new database and configuration for your specific site. You will be prompted to set an Administrator password.*

---

## 🚀 5. Existing Project Installation

Follow these steps to run **THIS** specific repository on your local machine.

**Step 1: Navigate to your bench directory**
```bash
cd frappe-bench
```

**Step 2: Get the Dhanada app**
```bash
bench get-app https://github.com/knapsfs/Dhanada2.0.git
```
*This clones the repository into the `apps/` directory and installs its Python dependencies.*

**Step 3: Install CRM dependency (if not installed)**
```bash
bench get-app crm
```

**Step 4: Create the site (if you skipped Section 4)**
```bash
bench new-site newSite.local
```

**Step 5: Install apps on the site**
```bash
bench --site newSite.local install-app crm
bench --site newSite.local install-app dhanada
```

**Step 6: Run Migrations**
```bash
bench --site newSite.local migrate
```
*Ensures all DocTypes and database schemas are up to date.*

**Step 7: Start the Frappe server**
```bash
bench start
```
*Starts the Python web server, Redis, and background workers.*

---

## ⚙️ 6. Frappe Site Commands

Here is a reference for common `bench` commands you'll use:

| Command | Purpose |
|---------|---------|
| `bench new-site <site-name>` | Creates a new site and database. |
| `bench use <site-name>` | Sets the default site so you don't have to pass `--site` every time. |
| `bench migrate` | Runs database migrations and syncs DocTypes for the site. |
| `bench build` | Compiles JS/CSS assets for the Frappe environment. |
| `bench clear-cache` | Clears Redis cache. Useful when metadata or configurations don't update. |
| `bench clear-website-cache` | Clears frontend website cache. |
| `bench restart` | Restarts the background workers and web server. |
| `bench doctor` | Diagnoses bench setup issues (e.g., disconnected queues). |
| `bench update` | Updates all apps by pulling latest code and running migrations. |
| `bench backup` | Creates a database backup of the site. |
| `bench restore <file-path>` | Restores a database backup. |
| `bench uninstall-app <app>` | Removes an app from a specific site's database. |
| `bench remove-from-installed-apps <app>` | Removes app trace from site config if uninstallation fails. |
| `bench drop-site <site>` | Completely deletes a site and its database. |
| `bench destroy-all-sessions` | Logs out all users from the site. |
| `bench enable-scheduler` | Enables background jobs for the site. |
| `bench disable-scheduler` | Pauses all background jobs. |

---

## 🏢 7. Frappe CRM Commands

Since this project heavily integrates with Frappe CRM, here are CRM-specific tips:

- **Installing CRM**: `bench get-app crm && bench --site newSite.local install-app crm`
- **Updating CRM**: Ensure you regularly update the CRM module alongside custom apps: `bench update --apps crm`
- **Common Troubleshooting**: If CRM Leads fail to save via the API, ensure that the `CRM Lead` DocType permissions allow Guest creation (if used publicly) or check the error logs in Frappe Desk (`/app/error-log`).

---

## 🎨 8. Frontend Setup

The frontend is a decoupled React application built with Vite.

**Step 1: Navigate to the frontend directory**
```bash
cd apps/dhanada/frontend
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Run the development server**
```bash
npm run dev
```
*This starts the Vite dev server with Hot Module Replacement (HMR). Usually runs on `http://localhost:5173`.*

**Other useful commands:**
- `npm run build`: Compiles the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.

---

## 🤖 9. AI Backend Setup

The AI backend powers the conversational chatbot and interacts with Google Gemini and Frappe APIs.

**Step 1: Navigate to the backend directory**
```bash
cd apps/dhanada/ai_backend
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Set up Environment Variables**
Create a `.env` file in the `ai_backend` folder based on `.env.example` (if provided). You will need:
```env
GEMINI_API_KEY=<your_google_gemini_api_key>
```
*(Never commit this file!)*

**Step 4: Run the server**
```bash
npm start
```
*Starts the Node.js server, typically on `http://localhost:3405`.*

---

## 🔄 10. Daily Development Workflow

When starting your day, follow this standard routine:

1. **Pull the latest code:**
   ```bash
   cd apps/dhanada
   git pull origin main
   ```
2. **Switch to your feature branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Run migrations (if Python code or DocTypes changed):**
   ```bash
   cd ../..
   bench migrate
   ```
4. **Start Frappe:**
   ```bash
   bench start
   ```
5. **Start Frontend (in a new terminal):**
   ```bash
   cd apps/dhanada/frontend
   npm run dev
   ```
6. **Start AI Backend (in a new terminal):**
   ```bash
   cd apps/dhanada/ai_backend
   npm start
   ```
7. **Commit & Push:** Once work is tested and complete.

---

## 🌳 11. Git Workflow

We follow standard branch-based Git workflows.

| Command | Purpose |
|---------|---------|
| `git clone <url>` | Downloads the repository to your machine. |
| `git checkout <branch>` | Switches your working directory to another branch. |
| `git checkout -b <branch>` | Creates a new branch and switches to it. |
| `git pull` | Fetches and merges the latest changes from the remote server. |
| `git add .` | Stages all modified files for a commit. |
| `git commit -m "msg"` | Saves your staged changes locally with a descriptive message. |
| `git push origin <branch>`| Uploads your local commits to GitHub. |
| `git fetch` | Downloads objects and refs from another repository without merging. |
| `git merge <branch>` | Combines the specified branch's history into your current branch. |

---

## 🔄 12. Updating Project

Whenever you pull new code from `main` or `develop`, run the following commands to ensure your environment is synchronized:

```bash
# 1. Update Frappe database schemas
cd frappe-bench
bench migrate
bench build

# 2. Update AI Backend dependencies
cd apps/dhanada/ai_backend
npm install

# 3. Update Frontend dependencies
cd ../frontend
npm install
```

---

## 🐛 13. Troubleshooting

Here are common issues you might face and how to fix them:

- **Port already in use**: 
  - *Fix*: Find the PID holding the port: `lsof -i :3405` (macOS/Linux) and kill it: `kill -9 <PID>`.
- **Redis not running**: 
  - *Fix*: Start Redis. On macOS: `brew services start redis`. On Linux: `sudo systemctl start redis`.
- **MariaDB connection failed**: 
  - *Fix*: Ensure the database service is running: `brew services start mariadb` or `sudo systemctl start mariadb`.
- **Bench not found**: 
  - *Fix*: Ensure your Python environment variables are configured, or reinstall bench: `pip3 install frappe-bench`.
- **npm install failed / Node version mismatch**: 
  - *Fix*: Use `nvm` (Node Version Manager) to switch to Node 18+: `nvm use 18`.
- **Migration failed**: 
  - *Fix*: Read the traceback. Usually caused by conflicting schema changes. Run `bench --site newSite.local clear-cache` and retry.
- **Site not found**: 
  - *Fix*: Ensure `newSite.local` is added to your OS `/etc/hosts` file: `127.0.0.1 newSite.local`, and run `bench use newSite.local`.

---

## 🔐 14. Environment Variables

Environment variables are used to securely store secrets and configurations. 

- **Frontend**: Store in `apps/dhanada/frontend/.env`
- **AI Backend**: Store in `apps/dhanada/ai_backend/.env`
- **Frappe**: Store in `frappe-bench/sites/newSite.local/site_config.json`

**AI Backend Required Variables (`ai_backend/.env`)**
```env
# Google Gemini API Key
GEMINI_API_KEY=your_api_key_here
```
> ⚠️ **WARNING**: NEVER commit `.env` files to git. Ensure they are listed in `.gitignore`.

---

## 🔗 15. Project URLs

When everything is running locally, access the platform via:

- **Frappe Desk (Admin)**: [http://newSite.local:8000/app](http://newSite.local:8000/app)
- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **AI Backend API**: [http://localhost:3405](http://localhost:3405)

---

## 📋 16. Useful Bench Commands Cheat Sheet

| Command | Purpose | Example |
|---------|---------|---------|
| `bench start` | Start development servers | `bench start` |
| `bench migrate` | Sync database schemas | `bench --site newSite.local migrate` |
| `bench console` | Open Python shell with Frappe context | `bench --site newSite.local console` |
| `bench execute` | Run a specific python method | `bench execute dhanada.api.get_funds_list` |
| `bench clear-cache`| Reset Redis cache | `bench clear-cache` |

---

## 📂 17. Folder Structure

```text
dhanada/
├── .github/                  # GitHub Actions CI/CD workflows
├── ai_backend/               # Node.js Chatbot service
│   ├── .env                  # (Local only) Secrets for Gemini API
│   ├── server.js             # Express API server entry point
│   ├── chatbot.js            # Core AI and state machine logic
│   ├── leadManager.js        # CRM API integration logic
│   └── knowledgeService.js   # Local knowledge base handler
├── dhanada/                  # Frappe backend application
│   ├── api.py                # Whitelisted python API endpoints
│   ├── hooks.py              # Frappe application hooks & routing
│   └── ...                   # DocType definitions and server scripts
├── frontend/                 # React UI application
│   ├── src/                  # React components, contexts, and hooks
│   ├── vite.config.js        # Vite bundler configuration
│   └── package.json          # Frontend dependencies
├── pyproject.toml            # Python package configurations
└── README.md                 # This documentation
```

---

## 🏆 18. Best Practices

- **Pull before push**: Always `git pull` before starting new work or pushing to avoid merge conflicts.
- **Never commit secrets**: Keep all passwords, API keys, and tokens in `.env` files.
- **Run migrations**: Run `bench migrate` immediately after pulling code if any `json` schema files were updated.
- **Keep dependencies updated**: Periodically run `npm update` and `bench update --requirements` to patch security vulnerabilities.
- **Use feature branches**: Do not commit directly to `main`. Create branches like `feature/chatbot-ui` or `fix/nav-bug`.
- **Write meaningful commits**: Use clear commit messages (e.g., `fix: resolve issue with CRM lead sync`).

---

## 📜 19. License

MIT
