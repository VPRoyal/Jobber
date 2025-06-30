# 📘 Jobber: Easy Cron Scheduler

Jobber is a modern, fully customizable and extensible **job scheduling microservice** that allows you to schedule, monitor, and manage recurring jobs (cron tasks) via a user-friendly frontend and a robust backend system. It's designed for scalability, flexibility, and developer experience — with a clean UI and production-grade backend architecture.

---

## 🚀 Project Overview

* **Name:** Jobber
* **Tagline:** Easy Cron Scheduler
* **Frontend:** React (Vite) + TypeScript + Tailwind CSS
* **Backend:** Node.js + TypeScript + Express + TypeORM
* **Database:** MySQL (switchable to PostgreSQL)
* **Deployment:**  Render (Frontend + Backend) / Aiven.io (Database)
* **Status:** ✅ Completed MVP with scope for enhancements

---

## 🔧 Tech Stack

| Layer      | Tech Stack                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | React + Vite + TypeScript + Tailwind CSS              |
| Backend    | Node.js + Express + TypeScript + TypeORM              |
| Database   | MySQL / PostgreSQL (via TypeORM)                      |
| Scheduler  | node-cron + custom scheduler service                  |
| Validation | class-validator + class-transformer                   |
| Deployment | Render (FE + BE) / Aiven.io (DB) |

---

## 📁 Folder Structure (Monorepo)

```
jobber/
├── frontend/                  # React frontend
│   ├── src/
│   |   ├── assets
│   |   ├── components
│   |   ├── contexts
│   |   ├── hooks
│   |   ├── pages
│   |   ├── services
│   |   ├── styles
│   |   ├── types
│   |   ├── utils
│   ├── public/
│   └── vite.config.ts
│
├── backend/                   # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── executers/
│   │   ├── middlerwares/
│   │   ├── models/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.ts
│   └── tsconfig.json
│
├── .env
├── README.md
└── package.json (if monorepo)
```

---

## 🔄 Architecture Flow

### 🌐 Fullstack Flow Diagram

```
            ┌───────────────┐                 ┌────────────────┐
            │   Frontend    │ ◄──── UI/UX ───►│   REST Client  │
            └──────┬────────┘                 └────────────────┘
                   │                                    
                   ▼     Axios HTTP Requests             
           ┌───────────────┐                     ┌────────────────┐
           │   Express.js   │ ◄──── Routing ────► │ Job Controller │
           └──────┬────────┘                     └────────┬───────┘
                  │                                       │
         Scheduler Service                      Job Service Layer
           (node-cron + DB sync)                (CRUD + Validation)
                  │                                       │
                  ▼                                       ▼
           ┌──────────────┐                    ┌────────────────────┐
           │ TypeORM ORM  │ ◄── Data Layer ──► │     MySQL DB       │
           └──────────────┘                    └────────────────────┘
```

---

## ✨ Major Features (Complete App)

### ✅ Job Management

* Create job with:

  * Name
  * Cron Expression
  * Type (from allowed executors)
  * Optional Description and Payload
* Edit, delete, or view job details
* Status: Active, Inactive, Paused

### 📅 Scheduler

* Custom `SchedulerService` built on `node-cron`
* Executes scheduled jobs
* Tracks lastRunAt & nextRunAt
* Supports future expansion (job types, payloads)

### 🧠 Type-safe Job Types

* Dynamic registration of job execution handlers via `executorMap`
* Controlled via enum to avoid unsafe job execution
* Types exposed via API (`/jobs/types`)

### 🧪 Validations

* `class-validator` DTO-based validation
* Supports optional payloads, required fields, enums, and pattern matches

### 📚 API Endpoints

```
GET    /jobs           → List all jobs
GET    /jobs/:id       → Get job by ID
GET    /jobs/types     → Get valid job types (frontend dropdown)
POST   /jobs/create    → Create new job
PUT    /jobs/:id       → Update job (planned)
DELETE /jobs/:id       → Delete job (planned)
```

### 🌐 Frontend Features

* Job list view (paginated, searchable)
* Job creation form (validated)
* Job detail view
* Custom API service with axios
* Route-level error handling

### 📈 Scalable Backend Design

* TypeORM + Repository pattern
* Separated DTOs, services, controllers
* Future-safe design: plug in Redis, RabbitMQ, SQS
* Fully typed with TypeScript and modular structure

---

## 🔗 Deployment Links

> You can update these once deployed.

* **Frontend:** [https://jobber-1.onrender.com/](https://jobber-1.onrender.com/)
* **Backend:** [https://jobber-xm4d.onrender.com](https://jobber-xm4d.onrender.com)
* **Docs (Swagger - TODO):** `/docs`

---

## 👨‍💻 Author

**Vinay Pratap Singh**
🔗 [GitHub](https://github.com/VPRoyal) • 💼 Web3, Fullstack, System Design • 🇮🇳

---
