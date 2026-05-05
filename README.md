# 🚀 TaskFlow Pro

> Production-ready task management platform showcasing modern full-stack development with enterprise-grade DevOps practices.

[![Backend CI](https://github.com/Petchy77/taskflow-pro/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Petchy77/taskflow-pro/actions/workflows/backend-ci.yml)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue)](https://kubernetes.io/)

## 📋 Overview

TaskFlow Pro is a full-stack task management platform built to demonstrate enterprise-grade development practices. The project covers the complete software development lifecycle: from database design and backend API development to frontend UI, containerization, and CI/CD deployment.

## 🛠️ Tech Stack

### Backend
- **Java 21** with Spring Boot 3.3
- **Spring Security** with JWT authentication (HS384)
- **Spring Data JPA** with Hibernate ORM
- **Flyway** for database migration
- **MySQL 8** as primary database
- **Redis 7** for caching
- **Maven** for build management
- **Lombok** for boilerplate reduction

### Frontend (In Progress)
- **Angular 18** for main application
- **React 18** for admin panel

### DevOps (Planned)
- **Docker & Docker Compose** for containerization
- **Kubernetes** for orchestration
- **GitHub Actions** for CI/CD
- **Prometheus + Grafana** for monitoring

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Angular SPA    │     │  React Admin    │
│  (Port 4200)    │     │  (Port 5173)    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │ REST API
         ┌───────────▼───────────┐
         │   Spring Boot API     │
         │   (Port 8080)         │
         │   - JWT Auth          │
         │   - Bean Validation   │
         │   - Global Exception  │
         └─────┬───────────┬─────┘
               │           │
        ┌──────▼─────┐  ┌──▼─────┐
        │  MySQL 8   │  │ Redis 7│
        │  (3306)    │  │ (6379) │
        └────────────┘  └────────┘
```

## 🏃 Quick Start

### Prerequisites
- Java 21+
- Docker & Docker Compose
- Maven 3.9+
- Node.js 20+ (for frontend)

### Setup

```bash
# Clone repository
git clone https://github.com/Petchy77/taskflow-pro.git
cd taskflow-pro

# Start infrastructure
docker compose up -d

# Run backend
cd backend
mvn spring-boot:run
```

Backend will be available at `http://localhost:8080/api`
phpMyAdmin at `http://localhost:8081`

### Default Credentials

| Username | Password   | Role  |
|----------|------------|-------|
| `admin`  | `admin123` | ADMIN |
| `petch`  | `petch123` | USER  |

## 📚 API Endpoints

### Authentication

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "New User"
}
```

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "username": "petch",
  "password": "petch123"
}
```

### Protected Endpoints

```bash
# Get current user profile
GET /api/users/me
Authorization: Bearer <your-jwt-token>
```

## ✅ Features

### Implemented
- [x] User registration with BCrypt password hashing
- [x] JWT-based stateless authentication (HS384)
- [x] Role-based access control (USER/ADMIN)
- [x] Bean validation with detailed error messages
- [x] Global exception handling
- [x] CORS configuration for SPA clients
- [x] Database migration with Flyway
- [x] Sample data seeding for development

### In Progress
- [ ] Project and Task CRUD APIs
- [ ] Pagination, sorting, and filtering
- [ ] Real-time notifications via WebSocket

### Planned
- [ ] Angular 18 frontend
- [ ] React admin dashboard
- [ ] Unit and integration tests
- [ ] Docker production builds
- [ ] Kubernetes deployment manifests
- [ ] GitHub Actions CI/CD pipeline
- [ ] Prometheus + Grafana monitoring
- [ ] Cloud deployment (AWS/Azure)

## 🧪 Testing

```bash
# Run unit tests
cd backend
mvn test

# Run with coverage
mvn test jacoco:report
```

## 📁 Project Structure

```
taskflow-pro/
├── backend/                      # Spring Boot application
│   ├── src/main/java/
│   │   └── com/taskflow/
│   │       ├── config/           # Security, CORS configurations
│   │       ├── controller/       # REST endpoints
│   │       ├── dto/              # Request/Response DTOs
│   │       ├── entity/           # JPA entities
│   │       ├── exception/        # Custom exceptions
│   │       ├── repository/       # JPA repositories
│   │       ├── security/         # JWT components
│   │       └── service/          # Business logic
│   └── src/main/resources/
│       ├── db/migration/         # Flyway SQL scripts
│       └── application.yml       # Configuration
├── frontend-angular/             # Angular SPA (TBD)
├── frontend-admin/               # React admin (TBD)
├── k8s/                          # Kubernetes manifests (TBD)
├── docs/                         # Documentation
├── .github/workflows/            # CI/CD pipelines (TBD)
└── docker-compose.yml            # Dev infrastructure
```

## 👤 Author

**Natawat S. (Petch)**

Full-Stack Developer | Bangkok, Thailand

---

⭐ If you find this project useful, please consider giving it a star!