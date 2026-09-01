# Blogist

A cloud-native blog platform built with Django microservices, React, Docker, Kubernetes, and AWS EKS with AI content generation.

## Services
- **auth-service** — Register, login, JWT auth
- **post-service** — Create, read, delete posts
- **comment-service** — Add and fetch comments
- **ai-service** — AI blog draft generation (Groq)

## Tech Stack
- Backend: Python, Django, Django REST Framework
- Frontend: React (Vite)
- Database: PostgreSQL
- Containerization: Docker + Docker Compose
- Orchestration: Kubernetes (Minikube → AWS EKS)
- Cloud: AWS (ECR, EKS, RDS, Route53)
- AI: Groq API (Llama 3.3 70B)