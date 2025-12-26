$env:PROJECT_ID = "tryliate-production-v1"

gcloud builds submit --config cloudbuild.frontend.yaml `
  --project $env:PROJECT_ID `
  .
