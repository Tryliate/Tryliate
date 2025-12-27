# Tryliate Nango Self-Host Deployment Script
# This script deploys Nango to Google Cloud Run and points it to the User's Supabase

param (
    [string]$ProjectID = "tryliate",
    [string]$Region = "us-central1"
)

Write-Host "🚀 Deploying Nango Self-Host for Tryliate..." -ForegroundColor Cyan

# 1. Create Nango Dockerfile if it doesn't exist
$nangoDocker = @"
FROM nangohq/nango:latest
ENV PORT=8080
EXPOSE 8080
"@
$nangoDocker | Out-File -FilePath "deployment/nango/Dockerfile" -Encoding utf8

# 2. Build and Push to Artifact Registry
Write-Host "📦 Building Nango Image..."
gcloud builds submit --tag gcr.io/$ProjectID/nango-self-host deployment/nango/

# 3. Deploy to Cloud Run
Write-Host "🌐 Deploying to Cloud Run..."
gcloud run deploy nango-self-host `
    --image gcr.io/$ProjectID/nango-self-host `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars "NANGO_DB_URL=REPLACE_WITH_USER_SUPABASE_DB_URL" `
    --set-env-vars "NANGO_ENCRYPTION_KEY=REPLACE_WITH_SECURE_KEY"

Write-Host "✅ Nango successfully deployed to Cloud Run!" -ForegroundColor Green
Write-Host "🔗 Add the service URL to Tryliate NEXT_PUBLIC_NANGO_HOST env var."
