# 🚀 TaskFlow Pro

> Production-ready, full-stack task management platform with **dual frontends** (Angular for users, React for admins) + real-time collaboration. Deployed on Railway + Vercel with complete CI/CD pipeline.

[![Backend CI](https://github.com/Petchy77/taskflow-pro/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Petchy77/taskflow-pro/actions/workflows/backend-ci.yml)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-brightgreen)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-18-red)](https://angular.dev)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue)](https://kubernetes.io/)
[![Live](https://img.shields.io/badge/Live-Demo-success)](https://taskflow-pro-jet.vercel.app)

---

## 🌐 Live Demo

### 🎯 Three Production URLs

| Service | URL | Stack |
|---------|-----|-------|
| 🌍 **User App** | **[taskflow-pro-jet.vercel.app](https://taskflow-pro-jet.vercel.app)** | Angular 18 |
| 🛡️ **Admin Dashboard** | **[taskflow-pro-8yjp.vercel.app](https://taskflow-pro-8yjp.vercel.app)** | React 18 |
| 🔌 **Backend API** | [taskflow-pro-production-1415.up.railway.app/api](https://taskflow-pro-production-1415.up.railway.app/api) | Spring Boot 4 |
| ❤️ **Health Check** | [/api/actuator/health](https://taskflow-pro-production-1415.up.railway.app/api/actuator/health) | Actuator |

### 🔑 Demo Credentials

| Username | Password   | Role  | App                       |
|----------|------------|-------|---------------------------|
| `petch`  | `petch123` | USER  | User App (Angular)        |
| `admin`  | `admin123` | ADMIN | Admin Dashboard (React)   |

### 🧪 Try the API

```bash
# Login and get JWT
curl -X POST https://taskflow-pro-production-1415.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"petch","password":"petch123"}'

# Health check
curl https://taskflow-pro-production-1415.up.railway.app/api/actuator/health
```

---

## 📋 Overview

TaskFlow Pro is a **complete enterprise-grade task management platform** demonstrating end-to-end software development. It features two separate frontend applications (Angular for end-users, React for administrators) sharing a single Spring Boot backend with role-based access control. The project covers JWT authentication, real-time WebSocket updates, audit logging, comprehensive testing, and multi-cloud production deployment.

## ✨ Key Features

### 🌍 User App (Angular)
- 🔐 JWT authentication with role-based access
- 📋 Task & project CRUD with assignment
- 🎯 Drag-and-drop Kanban board (HTML5 DnD)
- 🔔 Real-time notifications via WebSocket
- 🔍 Advanced filtering with JPA Specification
- 📊 Dashboard with live statistics
- 💬 Toast notification system
- 📱 Responsive design with Tailwind CSS

### 🛡️ Admin Dashboard (React)
- 📊 KPI dashboard with Recharts visualizations
- 👥 User management (role/status/delete with confirmation)
- 📈 Task analytics with completion metrics & priority distribution
- 📜 **Audit log** for all admin actions (enterprise compliance)
- ⚙️ System settings & info display
- 🔒 Admin-only protected routes

### 🔌 Backend API (Spring Boot)
- 🛡️ JWT authentication (HS384) with BCrypt password hashing
- 👮 Role-based authorization (`@PreAuthorize`)
- 📡 WebSocket broadcasting (STOMP protocol)
- 🗄️ Flyway database migration
- 📝 Audit trail for admin actions
- 🌐 CORS configured for multi-origin SPAs
- ⚠️ Global exception handling
- ✅ Bean Validation with detailed error messages

## 🛠️ Tech Stack

### Backend
- **Java 21** + **Spring Boot 4.0**
- **Spring Security** with JWT (HS384) + `@PreAuthorize`
- **Spring Data JPA** with Hibernate ORM
- **Spring WebSocket** with STOMP protocol
- **Flyway** for database migration
- **MySQL 8** primary database
- **Redis 7** caching layer
- **JUnit 5 + Mockito + AssertJ** testing
- **Maven** build management
- **Lombok** for boilerplate reduction

### User App (Angular)
- **Angular 18** with standalone components
- **TypeScript 5.5** strict mode
- **Tailwind CSS 3** styling
- **RxJS 7** reactive programming
- Signal-based state management
- **STOMP.js + SockJS** for WebSocket
- Lucide Angular icons

### Admin Dashboard (React)
- **React 18** + **TypeScript** + **Vite 6**
- **React Router 7** for routing
- **Tailwind CSS 3** styling
- **Recharts** for data visualization
- **Axios** with interceptors for JWT
- **Lucide React** icons
- **date-fns** for timestamps

### DevOps & Cloud
- **Docker** multi-stage builds (~250MB image)
- **Docker Compose** for local development
- **Kubernetes** manifests with HPA, StatefulSet, Ingress
- **GitHub Actions** CI/CD pipelines
- **JaCoCo** code coverage analysis
- **Railway** backend cloud deployment
- **Vercel** dual frontend CDN deployment

## 🏗️ Architecture

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  USER APP (Angular)         │  │  ADMIN DASHBOARD (React)    │
│  • Login, Tasks, Kanban     │  │  • Users, Audit, Analytics  │
│  • WebSocket subscription   │  │  • Charts (Recharts)        │
│  taskflow-pro-jet           │  │  taskflow-pro-8yjp          │
│       .vercel.app           │  │       .vercel.app           │
└─────────────┬───────────────┘  └─────────────┬───────────────┘
              │                                 │
              └────────────┬────────────────────┘
                           │ HTTPS REST + WebSocket (CORS)
              ┌────────────▼─────────────────────────────┐
              │  Spring Boot 4 API (Railway)             │
              │  • JWT Authentication (HS384)            │
              │  • Role-Based Authorization              │
              │  • Task & Project CRUD                   │
              │  • Admin endpoints (@PreAuthorize)       │
              │  • WebSocket broadcasting (STOMP)        │
              │  • Audit logging                         │
              │  • Bean Validation + Global Exceptions   │
              └─────┬──────────────────────────┬─────────┘
                    │                          │
              ┌─────▼──────┐            ┌──────▼─────┐
              │  MySQL 8   │            │  Redis 7   │
              │  (Railway) │            │  (Railway) │
              └────────────┘            └────────────┘
```

## 🏃 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Java 21+
- Maven 3.9+

### Run Everything Locally

```bash
# Clone repository
git clone https://github.com/Petchy77/taskflow-pro.git
cd taskflow-pro

# Start backend services (MySQL, Redis, phpMyAdmin)
docker compose up -d

# Run user app (Angular)
cd frontend-angular
npm install
ng serve --port 4200

# In another terminal: Run admin dashboard (React)
cd ../admin-react
npm install
npm run dev    # runs on port 5173
```

**Local URLs:**
- 🌍 User App: http://localhost:4200
- 🛡️ Admin Dashboard: http://localhost:5173
- 🔌 Backend API: http://localhost:8080/api
- 🗄️ phpMyAdmin: http://localhost:8081

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and receive JWT
- `GET  /api/users/me` — Get current user profile

### Projects
- `GET    /api/projects` — List user's projects
- `POST   /api/projects` — Create new project
- `GET    /api/projects/{id}` — Get project details
- `PUT    /api/projects/{id}` — Update project
- `DELETE /api/projects/{id}` — Delete project

### Tasks
- `GET    /api/tasks` — List tasks (filterable by status, priority, projectId)
- `POST   /api/tasks` — Create new task
- `GET    /api/tasks/{id}` — Get task details
- `PUT    /api/tasks/{id}` — Update task
- `PATCH  /api/tasks/{id}/status` — Update status (broadcasts WebSocket event)
- `DELETE /api/tasks/{id}` — Delete task

### Admin (requires ADMIN role)
- `GET    /api/admin/stats` — System statistics (users, projects, tasks, completion)
- `GET    /api/admin/users` — List all users with task counts
- `PATCH  /api/admin/users/{id}/role` — Update user role (USER ↔ ADMIN)
- `PATCH  /api/admin/users/{id}/toggle` — Enable/disable user
- `DELETE /api/admin/users/{id}` — Delete user (cannot delete self)
- `GET    /api/admin/audit-logs` — Paginated audit log

### WebSocket
- `WS /api/ws` — STOMP endpoint
- Subscribe `/topic/tasks` — Real-time task updates

## ✅ Implementation Status

### ✅ Completed
- [x] User registration with BCrypt password hashing
- [x] JWT-based stateless authentication (HS384)
- [x] Role-based access control (USER/ADMIN)
- [x] Project and Task CRUD APIs
- [x] Pagination, sorting, filtering with JPA Specification
- [x] Bean validation with detailed error messages
- [x] Global exception handling
- [x] CORS configuration for multi-origin SPAs
- [x] Database migration with Flyway
- [x] Sample data seeding
- [x] **Real-time notifications via WebSocket (STOMP)**
- [x] **Angular 18 user app** (Login, Dashboard, Tasks, Kanban)
- [x] **React 18 admin dashboard** (Users, Analytics, Audit Logs, Settings)
- [x] **HTML5 drag-and-drop Kanban board**
- [x] **Toast notification system**
- [x] **Audit logging for admin actions**
- [x] **30 unit tests with 78% service coverage**
- [x] **Docker production builds (multi-stage, ~250MB)**
- [x] **Kubernetes deployment manifests**
- [x] **GitHub Actions CI/CD pipeline**
- [x] **🌐 Three-tier cloud deployment** (Railway + Vercel × 2)

### ⏳ Planned
- [ ] Prometheus + Grafana monitoring
- [ ] E2E tests with Playwright

## 🧪 Testing

```bash
cd backend

# Run unit tests
mvn test

# Generate coverage report
mvn test jacoco:report

# View HTML report
open target/site/jacoco/index.html
```

**Coverage Highlights:**
- Service layer: **78%** (business logic)
- Mapper layer: **91%**
- Total: **56%**

## 🐳 Docker Deployment

```bash
# Build and start full stack
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f backend
```

## ☸️ Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check status
kubectl get all -n taskflow

# Port-forward for testing
kubectl port-forward -n taskflow svc/backend 8080:8080
```

See [k8s/README.md](k8s/README.md) for detailed deployment guide.

## ☁️ Cloud Deployment

### Backend (Railway)

1. Connect GitHub repo to Railway
2. Set Root Directory: `backend`
3. Add MySQL and Redis services
4. Configure environment variables (auto-injected via `${{MySQL.MYSQL_URL}}` pattern)
5. Generate public domain in Settings → Networking

Railway auto-deploys on every push to `main`.

### User App (Vercel — taskflow-pro-jet)

1. Import GitHub repo to Vercel
2. Set Root Directory: `frontend-angular`
3. Build Command: `ng build --configuration production`
4. Output Directory: `dist/frontend-angular/browser`
5. Configure `environment.prod.ts` with backend URL

### Admin Dashboard (Vercel — taskflow-pro-8yjp)

1. Import same GitHub repo as separate project
2. Set Root Directory: `admin-react`
3. Framework Preset: Vite (auto-detected)
4. Add env var: `VITE_API_URL=https://taskflow-pro-production-1415.up.railway.app/api`

Both Vercel projects auto-deploy on every push to `main`.

## 📁 Project Structure

```
taskflow-pro/
├── backend/                       # Spring Boot 4 API
│   ├── src/main/java/com/taskflow/
│   │   ├── config/                # Security, WebSocket, CORS
│   │   ├── controller/            # REST endpoints (incl. AdminController)
│   │   ├── dto/                   # Request/Response DTOs (incl. admin/)
│   │   ├── entity/                # JPA entities (incl. AuditLog)
│   │   ├── exception/             # Custom exceptions
│   │   ├── mapper/                # DTO mappers
│   │   ├── repository/            # JPA repositories
│   │   ├── security/              # JWT components
│   │   └── service/               # Business logic (incl. AdminService)
│   ├── src/test/java/             # Unit tests (30 tests)
│   ├── src/main/resources/
│   │   ├── db/migration/          # Flyway SQL scripts
│   │   └── application.yml        # Configuration
│   └── Dockerfile                 # Multi-stage build
├── frontend-angular/              # Angular 18 user app
│   └── src/app/
│       ├── core/                  # Guards, interceptors, services
│       ├── features/              # Login, Dashboard, Tasks, Kanban
│       └── shared/                # Reusable components & layout
├── admin-react/                   # React 18 admin dashboard
│   └── src/
│       ├── components/            # AdminLayout, ProtectedRoute
│       ├── contexts/              # AuthContext
│       ├── pages/                 # Login, Dashboard, Users, Analytics,
│       │                          #   AuditLogs, Settings
│       ├── services/              # api.ts, adminService.ts
│       └── types/                 # TypeScript interfaces
├── k8s/                           # Kubernetes manifests
├── .github/workflows/             # CI/CD pipelines
└── docker-compose.yml             # Dev infrastructure
```

## 🎯 Highlights for Recruiters

This portfolio demonstrates:

- **Full-stack expertise across two frameworks** — Spring Boot (Java) + Angular (TS) + React (TS)
- **Production cloud deployment** — Three live URLs on Railway + Vercel with auto-deploy CI/CD
- **Enterprise patterns** — JWT, role-based authorization, audit logging, CORS, Flyway migrations
- **Modern Java practices** — Records, Optional, Stream API, `@PreAuthorize`
- **Security best practices** — JWT (HS384), BCrypt, role-based access, SQL injection prevention
- **Test-driven development** — JUnit 5, Mockito, AssertJ with high service coverage
- **DevOps fluency** — Docker multi-stage, Kubernetes manifests, GitHub Actions CI/CD
- **Real-time systems** — WebSocket with STOMP for collaborative updates
- **Modern frontend patterns** — Standalone Angular components + React functional components with hooks
- **Clean architecture** — Layered design with clear separation of concerns
- **End-to-end ownership** — From database design to three live production URLs

## 👤 Author

**Natawat S. (Petch)**

Full-Stack Developer | Bangkok, Thailand

🔗 [GitHub: @Petchy77](https://github.com/Petchy77)

🌐 [User App](https://taskflow-pro-jet.vercel.app) | 🛡️ [Admin Dashboard](https://taskflow-pro-8yjp.vercel.app)

---

⭐ If you find this project useful, please consider giving it a star!