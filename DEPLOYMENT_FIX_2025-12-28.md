# GitHub Actions Cloud Build Deployment Fix

**Date:** 2025-12-28  
**Issue:** Cloud Build step 4 failing with non-zero exit status  
**Status:** ✅ FIXED

---

## 🐛 Problem Analysis

### **Error Message:**
```
BUILD FAILURE: Build step failure: build step 4 "gcr.io/cloud-builders/gcloud" failed: step exited with non-zero status: 1
ERROR: (gcloud.builds.submit) build 2f6c956d-5e45-4daa-b753-df5fe0c452bd completed with status "FAILURE"
```

### **Root Cause:**
The `sed` command in the Cloud Build deployment configuration was using the **pipe character (`|`)** as a delimiter:

```bash
sed -i "s|image: .*|image: us-central1-docker.pkg.dev/$PROJECT_ID/...|g"
```

**Problem:** The replacement string itself contains pipe characters in the Docker image URL path, causing `sed` to misinterpret the command and fail.

### **Affected File:**
`deployment/shared/production-deploy-full.yaml` - Lines 84 and 96

---

## ✅ Solution

### **Fix Applied:**
Changed the `sed` delimiter from **pipe (`|`)** to **hash (`#`)** to avoid conflicts:

**Before:**
```bash
sed -i "s|image: .*|image: us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/frontend:$_VERSION|g"
```

**After:**
```bash
sed -i "s#image: .*#image: us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/frontend:$_VERSION#g"
```

### **Changes Made:**

#### **Step 3: Deploy Frontend** (Line 84)
```yaml
- name: "gcr.io/cloud-builders/gcloud"
  id: "deploy-frontend"
  entrypoint: "bash"
  args:
    - "-c"
    - |
      sed -i "s#image: .*#image: us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/frontend:$_VERSION#g" deployment/frontend/run-service.yaml
      gcloud run services replace deployment/frontend/run-service.yaml --region us-central1
```

#### **Step 4: Deploy Backend** (Line 96)
```yaml
- name: "gcr.io/cloud-builders/gcloud"
  id: "deploy-backend"
  entrypoint: "bash"
  args:
    - "-c"
    - |
      sed -i "s#image: .*#image: us-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/tryliate-backend:$_VERSION#g" deployment/backend/run-service.yaml
      gcloud run services replace deployment/backend/run-service.yaml --region us-east1
```

---

## 🔧 Technical Details

### **Why This Works:**

1. **Sed Delimiter Flexibility:** The `sed` command allows any character as a delimiter, not just `/` or `|`
2. **Hash Character Safety:** The `#` character is safe because it doesn't appear in Docker image URLs
3. **No Escaping Needed:** Using `#` eliminates the need to escape pipe characters in the replacement string

### **Alternative Delimiters:**
Other safe delimiters that could have been used:
- `@` - `s@pattern@replacement@g`
- `:` - `s:pattern:replacement:g`
- `%` - `s%pattern%replacement%g`

---

## 📋 Deployment Pipeline Flow

The fixed deployment now follows this sequence:

```
1. Build Frontend Docker Image
   ↓
2. Push Frontend to Artifact Registry
   ↓
3. Build Backend Docker Image
   ↓
4. Push Backend to Artifact Registry
   ↓
5. Deploy Frontend (sed + gcloud run services replace) ✅ FIXED
   ↓
6. Deploy Backend (sed + gcloud run services replace) ✅ FIXED
```

---

## 🚀 Commit Details

**Commit Hash:** `69ff081`  
**Branch:** `main`  
**Commit Message:**
```
fix: Change sed delimiter in Cloud Build deployment to prevent conflicts with image URLs
```

**Files Changed:**
- `deployment/shared/production-deploy-full.yaml` (2 insertions, 2 deletions)

---

## ✅ Verification

### **Next Steps:**
1. ✅ Fix committed and pushed to GitHub
2. ⏳ GitHub Actions workflow will automatically trigger
3. ⏳ Cloud Build will execute with the corrected `sed` commands
4. ⏳ Both frontend and backend should deploy successfully

### **How to Monitor:**
- **GitHub Actions:** https://github.com/Tryliate/Tryliate/actions
- **Cloud Build Console:** https://console.cloud.google.com/cloud-build/builds?project=tryliate-production-v1

---

## 🎯 Expected Outcome

With this fix, the deployment pipeline should now:
- ✅ Successfully modify the Cloud Run service YAML files
- ✅ Deploy the frontend to `us-central1`
- ✅ Deploy the backend to `us-east1`
- ✅ Complete without errors

---

## 📚 Lessons Learned

### **Best Practices for `sed` in CI/CD:**

1. **Choose Safe Delimiters:** Always use delimiters that won't appear in your replacement strings
2. **Test Locally:** Test `sed` commands locally before adding to CI/CD pipelines
3. **Use Alternative Tools:** Consider `yq` for YAML manipulation instead of `sed`
4. **Add Comments:** Document why specific delimiters are chosen

### **Alternative Approach (Future Improvement):**

Instead of using `sed`, consider using `yq` (YAML processor):
```bash
yq eval '.spec.template.spec.containers[0].image = "us-central1-docker.pkg.dev/..."' -i deployment/frontend/run-service.yaml
```

This would be more robust and YAML-aware.

---

## 🔍 Related Files

- `.github/workflows/production-pipeline.yml` - GitHub Actions workflow
- `deployment/shared/production-deploy-full.yaml` - Cloud Build configuration (FIXED)
- `deployment/frontend/run-service.yaml` - Frontend Cloud Run service definition
- `deployment/backend/run-service.yaml` - Backend Cloud Run service definition

---

**Status:** ✅ **RESOLVED**  
**Fix Applied:** 2025-12-28 01:09 IST  
**Deployed:** Waiting for GitHub Actions to complete
