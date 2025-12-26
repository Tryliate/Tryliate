$secrets = @(
  "google-client-id",
  "google-client-secret",
  "logo-dev-secret-key",
  "supabase-service-role-key",
  "groq-api-key",
  "supabase-oauth-client-secret",
  "redis-url",
  "upstash-redis-rest-url",
  "upstash-redis-rest-token",
  "neon-database-url"
)

foreach ($name in $secrets) {
  Write-Host "-------- Processing $name --------"
    
  # Check if secret exists
  gcloud secrets describe $name --project=tryliate-production-v1 2>&1 | Out-Null
    
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Secret exists. Deleting..."
    gcloud secrets delete $name --quiet --project=tryliate-production-v1
    if ($LASTEXITCODE -eq 0) {
      Write-Host "SUCCESS: Deleted $name"
    }
    else {
      Write-Host "ERROR: Failed to delete $name"
    }
  }
  else {
    Write-Host "Secret does not exist (already clean)."
  }
}
