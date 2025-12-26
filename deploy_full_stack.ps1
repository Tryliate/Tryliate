$env:PROJECT_ID = "tryliate-production-v1"
$env:VERSION = "1.1.4"

Write-Host "🚀 Starting Full Stack Deployment (Fresh YAML) for Tryliate v$env:VERSION..."

gcloud builds submit --config deployment/shared/production-deploy-full.yaml `
  --project $env:PROJECT_ID `
  --substitutions=_VERSION=$env:VERSION `
  .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment Successful!"
} else {
    Write-Host "❌ Deployment Failed!"
}
