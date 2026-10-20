<div align="center">

  <img src="client/public/logo.png" alt="xTask Logo" width="80" height="80" />

  # 🧠 xTask — Productivity & Project Management

  **A full-stack productivity workspace built to plan work, track projects, and measure effort with real-time focus timers and visual analytics.**

  [![Live Demo](https://img.shields.io/badge/Demo-xtask.vercel.app-blue?style=for-the-badge&logo=vercel)](https://xtask.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Express.js](https://img.shields.io/badge/Express.js_5-303030?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-443e38?style=for-the-badge&logo=react&logoColor=orange)](https://github.com/pmndrs/zustand)
  [![Framer Motion](https://img.shields.io/badge/Motion-ea00ff?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
  - [1. Analytics Dashboard](#1-analytics-dashboard)
  - [2. Task Management & Work Timer](#2-task-management--work-timer)
  - [3. Project Workspaces](#3-project-workspaces)
  - [4. Authentication & Security](#4-authentication--security)
  - [5. Personalization & Data Controls](#5-personalization--data-controls)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
  - [Prerequisites](#prerequisites)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Configure & Run the Backend](#step-2-configure--run-the-backend-server)
  - [Step 3: Configure & Run the Frontend](#step-3-configure--run-the-frontend-client)
- [Environment Variables Reference](#-environment-variables-reference)
  - [Backend (.env)](#backend-serverenv)
  - [Frontend (.env.local)](#frontend-clientenvlocal)
- [Available Scripts](#-available-scripts)
- [Author & Support](#-author--support)

---

## 🌟 Overview

**xTask** is a modern, responsive web application engineered to bridge the gap between simple to-do lists and full-scale project management systems. It provides individual contributors and creators with a centralized hub to:

- Organize day-to-day personal tasks and overarching multi-task projects.
- Track actual focused time spent on tasks using an embedded stopwatch timer.
- Monitor weekly completion rates, upcoming deadlines, and overdue items through interactive visual charts.
- Export workspace records into Excel (`.xlsx`) files at any time.

---

## 🚀 Live Demo

Experience the deployed version of the application:

🔗 **Production URL:** [https://xtask.vercel.app](https://xtask.vercel.app)

> [!NOTE]
> Unauthenticated visitors are automatically routed to the `/login` page. You can create a test account via standard email/password signup or log in using Google / GitHub OAuth.

---

## ✨ Key Features

### 1. Analytics Dashboard
The central dashboard aggregates real-time data across all user tasks and projects:
- **Summary Metrics**: High-level counter cards tracking today's completion percentage, items due today, and overdue task/project alerts.
- **Task Distribution Bar Chart**: Visual breakdown comparing completed, pending, and overdue tasks.
- **Weekly Trend Line Chart**: Day-by-day velocity chart tracking task completions from Monday through Sunday.
- **Today's Focus**: Curated priority panel highlighting tasks scheduled for today or lingering from yesterday.
- **Upcoming Horizons**: Snapshot list of impending deadlines due within the next 1 to 3 days.
- **Recent Accomplishments**: Feed of recently completed tasks from today and recent days.

### 2. Task Management & Work Timer
- **Categorization**: Support for both standalone **Personal** tasks and **Project-linked** tasks.
- **Task Attributes**: Title, description, due date, priority levels (**High**, **Medium**, **Low**), and completion status.
- **Embedded Task Timer**: An integrated stopwatch on every task displaying `hh:mm:ss` with **Play**, **Pause**, and **Reset** controls to quantify real work sessions. Starting a timer automatically transitions the task into *in-progress* status.
- **Dual View Layouts**: Switch effortlessly between a structured **Table/List View** and a clean **Grid/Card View**.
- **Status Filters**: Filter tasks dynamically by **All**, **In Progress**, or **Completed**.
- **Interactive Modals**: Seamless dialog forms to create, edit, mark complete, and delete tasks with confirmation guards.

### 3. Project Workspaces
- **Project Organization**: Group related deliverables into structured projects with descriptions, due dates, and priority tags.
- **Progress Tracking**: Real-time progress bars showing the ratio of completed tasks to total tasks linked to each project.
- **Dedicated Project Details (`/projects/[id]`)**: Deep-dive into any project to inspect its goals and manage its specific sub-tasks directly.
- **Cascading Safety**: Deleting a completed or active project automatically cleans up all associated sub-tasks to prevent orphaned database records.

### 4. Authentication & Security
- **Flexible Sign-In**:
  - Local authentication with username, display name, and password (hashed with `bcryptjs`).
  - Single-Click OAuth 2.0 social login via **Google** and **GitHub** (powered by Passport.js strategies).
- **Session Management**: Secure, `httpOnly` cookie-based JSON Web Tokens (JWT) with a 7-day expiration window.
- **Backend Hardening**: Protected with `helmet` security headers, strict CORS origin checks, request rate limiting via `express-rate-limit`, and NoSQL injection query sanitization.

### 5. Personalization & Data Controls
- **Theme Customization**: Built-in support for **Dark Mode** and **Light Mode**, automatically saved to local storage.
- **Excel Data Export**: Export all user tasks and projects into a formatted `.xlsx` workbook with dedicated sheets for "Tasks" and "Projects" using SheetJS.
- **In-App Feedback**: Direct feedback module in settings allowing users to send suggestions or report issues straight to the database.
- **Account Control**: Account details inspection and a full account deletion option that cleanly purges user credentials and all linked data.

---

## 🛠 Tech Stack

### Frontend (`client/`)
| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Server & Client Components) |
| **Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Component Primitives** | shadcn/ui & Radix UI |
| **Icons** | Lucide React & React Icons |
| **State Management** | Zustand |
| **Animations** | Motion (Framer Motion) |
| **Data Visualization** | Recharts |
| **Data Export** | SheetJS (`xlsx`) |

### Backend (`server/`)
| Category | Technology |
|---|---|
| **Runtime & Framework** | Node.js (ES Modules) • Express.js 5 |
| **Database & ODM** | MongoDB • Mongoose 8 |
| **Authentication** | Passport.js (`passport-google-oauth20`, `passport-github2`) • JWT • bcryptjs |
| **Security & Middleware** | Helmet • CORS • Express Rate Limit • Cookie Parser • Mongo Sanitize • Morgan |

---

## 📁 Project Architecture

```text
xTask/
├── client/                     # Next.js frontend application
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login & Signup routes
│   │   ├── actions/            # Server actions (OAuth redirects)
│   │   ├── api/                # Internal Next.js API proxy routes
│   │   ├── projects/           # Projects list & [id] detail views
│   │   ├── tasks/              # Task board, table views & timer controls
│   │   ├── settings/           # Profile, Theme, Export & Feedback
│   │   ├── notifications/      # Notification center
│   │   └── Store/              # Zustand global client stores
│   ├── components/             # Reusable UI components & shadcn primitives
│   └── public/                 # Static assets (logo, default avatars)
│
├── server/                     # Express.js backend API
│   ├── config/                 # Database connection (Mongoose)
│   ├── controllers/            # Route business logic (auth, tasks, projects)
│   ├── lib/                    # JWT generator, logger, Passport OAuth setup
│   ├── middlewares/            # Rate limiting, NoSQL sanitizer
│   ├── models/                 # Mongoose schemas (User, Task, Project, Feedback)
│   ├── routes/                 # API endpoint routers
│   └── src/
│       └── index.js            # Express server entry point
│
└── README.md                   # Project documentation
```

---

## 🧪 Getting Started (Local Setup)

Follow the step-by-step instructions below to run both the frontend and backend locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A running [MongoDB](https://www.mongodb.com/) instance (either locally on `mongodb://127.0.0.1:27017` or a cloud-hosted MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ameer77-tech/xTask.git
cd xTask
```

---

### Step 2: Configure & Run the Backend (`server/`)

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create an environment file named `.env` in the `server` directory:
   ```bash
   # On Windows (PowerShell)
   New-Item -ItemType File -Name .env

   # On macOS / Linux
   touch .env
   ```

4. Populate `server/.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   CLIENT_URL=http://localhost:3000

   # MongoDB Connection
   MONGODB_URI=mongodb://127.0.0.1:27017/xtask

   # Google OAuth (Optional for local testing; needed if testing Google sign-in)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   callBackUrl_GOOGLE=http://localhost:5000/api/auth/google/callback

   # GitHub OAuth (Optional for local testing; needed if testing GitHub sign-in)
   GITHUB_CLIENT_ID=your_github_client_id_here
   GITHUB_CLIENT_SECRET=your_github_client_secret_here
   callBackUrl_GITHUB=http://localhost:5000/api/auth/github/callback
   ```

   > [!TIP]
   > For standard local testing, **Google and GitHub credentials are optional**. You can sign up and log in immediately using standard username/password authentication!

5. Start the backend server:
   ```bash
   # Development mode
   npm run dev

   # Or standard start
   npm start
   ```

6. Confirm the backend is running by visiting:
   [http://localhost:5000/health](http://localhost:5000/health) — It should return `Server Running`.

---

### Step 3: Configure & Run the Frontend (`client/`)

1. Open a **new terminal window** and navigate into the `client` folder:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create an environment file named `.env.local` in the `client` directory:
   ```bash
   # On Windows (PowerShell)
   New-Item -ItemType File -Name .env.local

   # On macOS / Linux
   touch .env.local
   ```

4. Populate `client/.env.local` with the URLs:
   ```env
   # Frontend app origin
   NEXT_PUBLIC_XTASK_FRONTEND=http://localhost:3000

   # Express backend API origin
   NEXT_PUBLIC_XTASK_BACKEND=http://localhost:5000
   ```

5. Start the Next.js development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

7. Click **"create account"** to register a new user account, log in, and explore the app!

---

## ⚙ Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description | Example / Default | Required |
|---|---|---|:---:|
| `PORT` | Port number on which Express runs | `5000` | **Yes** |
| `CLIENT_URL` | Frontend URL allowed by CORS & used for OAuth redirects | `http://localhost:3000` | **Yes** |
| `MONGODB_URI` | MongoDB connection string (Local or MongoDB Atlas) | `mongodb://127.0.0.1:27017/xtask` | **Yes** |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth Client ID | `your_google_client_id` | No *(for OAuth only)* |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth Client Secret | `your_google_client_secret` | No *(for OAuth only)* |
| `callBackUrl_GOOGLE` | Authorized redirect URI for Google OAuth | `http://localhost:5000/api/auth/google/callback` | No *(for OAuth only)* |
| `GITHUB_CLIENT_ID` | GitHub Developer Settings OAuth Client ID | `your_github_client_id` | No *(for OAuth only)* |
| `GITHUB_CLIENT_SECRET` | GitHub Developer Settings OAuth Client Secret | `your_github_client_secret` | No *(for OAuth only)* |
| `callBackUrl_GITHUB` | Authorized callback URL for GitHub OAuth | `http://localhost:5000/api/auth/github/callback` | No *(for OAuth only)* |

### Frontend (`client/.env.local`)

| Variable | Description | Example / Default | Required |
|---|---|---|:---:|
| `NEXT_PUBLIC_XTASK_FRONTEND` | Public base URL of the client application | `http://localhost:3000` | **Yes** |
| `NEXT_PUBLIC_XTASK_BACKEND` | Public base URL of the backend API server | `http://localhost:5000` | **Yes** |

---

## 📜 Available Scripts

### Backend (`server/`)
- `npm run dev` — Starts the Express API server with live-reloading via nodemon.
- `npm start` — Starts the Express API server in production mode (`node src/index.js`).

### Frontend (`client/`)
- `npm run dev` — Starts the Next.js development server with Turbopack on port 3000.
- `npm run build` — Compiles and builds the Next.js application for production.
- `npm start` — Runs the compiled Next.js production build.
- `npm run lint` — Runs ESLint to check for code quality and formatting issues.

---

## 🤝 Contributing

Contributions are welcomed! To propose enhancements:

1. **Fork** the repository.
2. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear messages:
   ```bash
   git commit -m "feat: add your descriptive message"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** detailing your changes.

---

## 🧑‍💻 Author

**Ameer Shaik**
- LinkedIn: [linkedin.com/in/ameer-shaik-23b153359/](https://www.linkedin.com/in/ameer-shaik-23b153359/)
- GitHub: [@Ameer77-tech](https://github.com/Ameer77-tech)

---

## ⭐ Support

If you found **xTask** helpful or appreciate the project, please show your support by **giving the repository a star ⭐**!

<div align="center">
  <sub>Built with passion for productivity, focus, and clean engineering.</sub>
</div>
 a star ✨

⭐ Click the ⭐ button on top of the repository


---

<p align="center">Made with ❤ for productivity and consistency.</p>
