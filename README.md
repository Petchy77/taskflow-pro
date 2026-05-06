# 🚀 TaskFlow Pro

> Production-ready, full-stack task management platform with real-time collaboration. Deployed on Railway + Vercel with complete CI/CD pipeline.

[![Backend CI](https://github.com/Petchy77/taskflow-pro/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Petchy77/taskflow-pro/actions/workflows/backend-ci.yml)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-18-red)](https://angular.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue)](https://kubernetes.io/)
[![Live](https://img.shields.io/badge/Live-Demo-success)](https://taskflow-pro-jet.vercel.app)

---

## 🌐 Live Demo

### 🎯 Try it now!

| Service | URL |
|---------|-----|
| 🌍 **Frontend (Vercel)** | **[taskflow-pro-jet.vercel.app](https://taskflow-pro-jet.vercel.app)** |
| 🔌 **Backend API (Railway)** | [taskflow-pro-production-1415.up.railway.app/api](https://taskflow-pro-production-1415.up.railway.app/api) |
| ❤️ **Health Check** | [/api/actuator/health](https://taskflow-pro-production-1415.up.railway.app/api/actuator/health) |

### 🔑 Demo Credentials

| Username | Password   | Role  |
|----------|------------|-------|
| `petch`  | `petch123` | USER  |
| `admin`  | `admin123` | ADMIN |

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

TaskFlow Pro is a complete full-stack task management platform with real-time collaboration features. The project demonstrates end-to-end software development practices: from database design and JWT-secured RESTful APIs to Angular frontend with drag-and-drop Kanban board, WebSocket real-time updates, comprehensive testing, and production cloud deployment.

## ✨ Key Features

- 🔐 **JWT Authentication** with BCrypt password hashing and role-based access (USER/ADMIN)
- 📋 **Task Management** — Create, update, delete tasks with project assignment
- 🎯 **Kanban Board** with HTML5 drag-and-drop status updates
- 🔔 **Real-time Notifications** — WebSocket broadcasting for collaborative updates
- 🔍 **Advanced Filtering** — JPA Specification API for dynamic queries
- 📊 **Dashboard** — Live task statistics and recent activity
- 💬 **Toast Notifications** — User-friendly feedback system
- 📱 **Responsive UI** — Modern design with Tailwind CSS
- ☁️ **Production Deployment** — Live on Railway (backend) + Vercel (frontend)

## 🛠️ Tech Stack

### Backend
- **Java 21** with Spring Boot 3.3
- **Spring Security** with JWT authentication (HS384)
- **Spring Data JPA** with Hibernate ORM
- **Spring WebSocket** with STOMP protocol
- **Flyway** for database migration
- **MySQL 8** as primary database
- **Redis 7** for caching
- **JUnit 5 + Mockito + AssertJ** for testing
- **Maven** for build management
- **Lombok** for boilerplate reduction

### Frontend
- **Angular 18** with standalone components
- **TypeScript 5.5** with strict mode
- **Tailwind CSS 3** for styling
- **RxJS 7** for reactive programming
- **Signal-based state management**
- **STOMP.js + SockJS** for WebSocket
- **Lucide Angular** for icons

### DevOps & Cloud
- **Docker** with multi-stage builds (250MB image)
- **Docker Compose** for local development
- **Kubernetes** manifests with HPA, StatefulSet, and Ingress
- **GitHub Actions** for CI/CD pipeline
- **JaCoCo** for code coverage analysis
- **Railway** for backend cloud deployment
- **Vercel** for frontend CDN deployment

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│  Angular SPA (Vercel CDN)                │
│  • Login, Dashboard, Tasks, Kanban       │
│  • WebSocket subscription                │
│  taskflow-pro-jet.vercel.app             │
└────────────┬─────────────────────────────┘
             │ HTTPS REST + WebSocket (CORS)
┌────────────▼─────────────────────────────┐
│  Spring Boot API (Railway)               │
│  • JWT Authentication                    │
│  • Task & Project CRUD                   │
│  • WebSocket broadcasting                │
│  • Bean Validation                       │
│  • Global Exception Handler              │
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

# Start backend services (MySQL, Redis, Backend, phpMyAdmin)
docker compose up -d

# Run frontend
cd frontend-angular
npm install
ng serve --port 4200
```

**Local URLs:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- phpMyAdmin: http://localhost:8081

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
- `PATCH  /api/tasks/{id}/status` — Update task status (broadcasts WebSocket event)
- `DELETE /api/tasks/{id}` — Delete task

### WebSocket
- `WS /api/ws` — STOMP endpoint
- Subscribe `/topic/tasks` — Receive real-time task updates

## ✅ Implementation Status

### ✅ Completed
- [x] User registration with BCrypt password hashing
- [x] JWT-based stateless authentication (HS384)
- [x] Role-based access control (USER/ADMIN)
- [x] Project and Task CRUD APIs
- [x] Pagination, sorting, and filtering with JPA Specification
- [x] Bean validation with detailed error messages
- [x] Global exception handling
- [x] CORS configuration for SPA clients
- [x] Database migration with Flyway
- [x] Sample data seeding for development
- [x] **Real-time notifications via WebSocket**
- [x] **Angular 18 frontend** (Login, Dashboard, Tasks, Kanban)
- [x] **HTML5 drag-and-drop Kanban board**
- [x] **Toast notification system**
- [x] **30 unit tests with 78% service coverage**
- [x] **Docker production builds (multi-stage, 250MB)**
- [x] **Kubernetes deployment manifests**
- [x] **GitHub Actions CI/CD pipeline**
- [x] **🌐 Cloud deployment** (Railway backend + Vercel frontend)

### ⏳ Planned
- [ ] React admin dashboard
- [ ] Prometheus + Grafana monitoring

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
4. Configure environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `SPRING_DATA_REDIS_HOST`
   - `SPRING_DATA_REDIS_PORT`
   - `SPRING_DATA_REDIS_PASSWORD`
   - `JWT_SECRET`
5. Generate public domain in Settings → Networking

Railway auto-deploys on every push to `main`.

### Frontend (Vercel)

1. Import GitHub repo to Vercel
2. Set Root Directory: `frontend-angular`
3. Build Command: `npm run build` (uses `--configuration production`)
4. Output Directory: `dist/frontend-angular/browser`
5. Update `environment.prod.ts` with production API URL

Vercel auto-deploys on every push to `main`.

## 📁 Project Structure

```
taskflow-pro/
├── backend/                      # Spring Boot application
│   ├── src/main/java/com/taskflow/
│   │   ├── config/               # Security, WebSocket, CORS
│   │   ├── controller/           # REST endpoints
│   │   ├── dto/                  # Request/Response DTOs + Events
│   │   ├── entity/               # JPA entities
│   │   ├── exception/            # Custom exceptions
│   │   ├── mapper/               # DTO mappers
│   │   ├── repository/           # JPA repositories
│   │   ├── security/             # JWT components
│   │   └── service/              # Business logic
│   ├── src/test/java/            # Unit tests (30 tests)
│   ├── src/main/resources/
│   │   ├── db/migration/         # Flyway SQL scripts
│   │   └── application.yml       # Configuration
│   └── Dockerfile                # Multi-stage build
├── frontend-angular/             # Angular 18 SPA
│   └── src/app/
│       ├── core/
│       │   ├── guards/           # Auth guards
│       │   ├── interceptors/     # JWT interceptor
│       │   ├── models/           # TypeScript interfaces
│       │   └── services/         # Auth, API, WebSocket, Toast
│       ├── features/
│       │   ├── auth/login/       # Login page
│       │   ├── dashboard/        # Stats overview
│       │   └── tasks/
│       │       ├── task-list/    # Filterable list view
│       │       └── kanban-board/ # Drag-and-drop board
│       └── shared/
│           ├── components/       # Reusable components
│           └── layout/           # App layout
├── k8s/                          # Kubernetes manifests
├── .github/workflows/            # CI/CD pipelines
└── docker-compose.yml            # Dev infrastructure
```

## 🎯 Highlights for Recruiters

This portfolio demonstrates:

- **Full-stack expertise** — Backend (Spring Boot) + Frontend (Angular) + Database (MySQL)
- **Production cloud deployment** — Railway + Vercel with auto-deploy CI/CD
- **Modern Java practices** — Records, Optional, Stream API, Lombok
- **Security best practices** — JWT, BCrypt, CORS, SQL injection prevention
- **Test-driven development** — JUnit 5, Mockito, AssertJ with high coverage
- **DevOps fluency** — Docker multi-stage, Kubernetes manifests, CI/CD
- **Real-time systems** — WebSocket with STOMP for collaborative updates
- **Modern frontend patterns** — Standalone components, Signals, Functional guards
- **Clean architecture** — Layered design with clear separation of concerns
- **End-to-end ownership** — From database design to live production URL

## 👤 Author

**Natawat S. (Petch)**

Full-Stack Developer | Bangkok, Thailand

🔗 [GitHub: @Petchy77](https://github.com/Petchy77)

🌐 [Live Demo](https://taskflow-pro-jet.vercel.app)

---

⭐ If you find this project useful, please consider giving it a star!