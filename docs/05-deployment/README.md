# 🚀 Deployment Guide

Deploy Tryliate to production on Google Cloud Run.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Google Cloud account with billing enabled
- ✅ `gcloud` CLI installed and configured
- ✅ Docker installed (for local testing)
- ✅ GitHub repository set up
- ✅ Supabase project created

---

## 🔧 Environment Setup

### 1. Google Cloud Project

```bash
# Create a new project
gcloud projects create tryliate-prod --name="Tryliate Production"

# Set as active project
gcloud config set project tryliate-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Environment Variables

Create `deploy/cloud/google-cloud/env/cloud_run_env.yaml`:

```yaml
NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "your-publishable-key"
SUPABASE_SECRET_KEY: "your-secret-key"
GROQ_API_KEY: "your-groq-api-key"
# ... (see .env.example for full list)
```

---

## 🐳 Docker Build

### Frontend Dockerfile

Located at `docker/frontend.Dockerfile`:

```dockerfile
FROM node:25-alpine AS base
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install -g bun && bun install
COPY . .
RUN bun run build
EXPOSE 8080
CMD ["bun", "start"]
```

### Backend Dockerfile

Located at `docker/backend.Dockerfile`:

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY server/package.json server/bun.lock ./
RUN bun install
COPY server/ ./
EXPOSE 8080
CMD ["bun", "run", "index.js"]
```

---

## ☁️ Cloud Run Deployment

### Option 1: Manual Deployment

```bash
# Deploy Frontend
gcloud builds submit --config=deployment/frontend/cloudbuild.yaml

# Deploy Backend
gcloud builds submit --config=deployment/backend/cloudbuild.yaml
```

### Option 2: GitHub Actions (Recommended)

The repository includes `.github/workflows/full-stack-deploy.yml` for automated deployment.

**Setup:**

1. Add GitHub secrets:
   - `GCP_PROJECT_ID`
   - `GCP_SA_KEY` (Service Account JSON)

2. Push to `main` branch:
   ```bash
   git push origin main
   ```

3. GitHub Actions will automatically:
   - Build Docker images
   - Push to Artifact Registry
   - Deploy to Cloud Run

---

## 🔐 OAuth Configuration

**[Full OAuth Setup Guide →](./OAUTH_SETUP.md)**

### Supabase OAuth

1. Go to Supabase Dashboard → Settings → API
2. Create OAuth App:
   - **Name:** Tryliate Production
   - **Redirect URI:** `https://your-frontend-url/auth/callback/supabase`
   - **Scopes:** `all`

3. Copy Client ID and Secret to environment variables

### Google OAuth

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID:
   - **Application type:** Web application
   - **Authorized redirect URIs:** `https://your-frontend-url/auth/callback/google`

3. Copy Client ID and Secret to environment variables

---

## 📊 Monitoring

### Cloud Run Metrics

```bash
# View logs
gcloud run services logs read frontend --region=us-central1

# View metrics
gcloud run services describe frontend --region=us-central1
```

### Health Checks

- **Frontend:** `https://your-frontend-url/`
- **Backend:** `https://your-backend-url/health`

---

## 🐛 Troubleshooting

**[Full Troubleshooting Guide →](./TROUBLESHOOTING.md)**

### Common Issues

**Issue: "Container failed to start"**
```bash
# Check logs
gcloud run services logs read frontend --limit=50

# Common causes:
# - Missing environment variables
# - Port mismatch (ensure PORT=8080)
# - Build errors
```

**Issue: "502 Bad Gateway"**
```bash
# Check if service is running
gcloud run services list

# Restart service
gcloud run services update frontend --region=us-central1
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Located at `.github/workflows/full-stack-deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/setup-gcloud@v1
      - run: gcloud builds submit --config=deployment/shared/production-deploy.yaml
```

---

## 📈 Scaling Configuration

### Auto-scaling Settings

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: frontend
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "12"
        autoscaling.knative.dev/target: "80"
    spec:
      containers:
        - image: gcr.io/PROJECT_ID/frontend
          resources:
            limits:
              cpu: "1000m"
              memory: "512Mi"
```

---

## 🔗 Related Documentation

- **[OAuth Setup](./OAUTH_SETUP.md)** - Detailed OAuth configuration
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Getting Started](../01-getting-started/README.md)** - Local development setup

---

**Ready to deploy? Let's go! 🚀**
