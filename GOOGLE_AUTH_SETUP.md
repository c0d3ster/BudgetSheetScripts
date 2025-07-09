# Google Apps Script Deployment Setup

## Problem

The previous setup was using `CLASP_TOKEN` which doesn't work for Google Apps Script API. Also, your organization blocks service account key creation.

## Solution

Use Workload Identity Federation (no service account keys needed).

## Setup Steps

### 1. Create Two Google Cloud Projects

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create two projects:
   - **Dev Project** (e.g., `my-apps-script-dev`)
   - **Production Project** (e.g., `my-apps-script-prod`)
3. Note both **Project IDs**

### 2. Enable Google Apps Script API in Both Projects

1. Go to **APIs & Services** > **Library** in each project
2. Search for "Google Apps Script API"
3. Click on it and enable it in both projects

### 3. Create Service Accounts for Both Environments

**For Dev:**

1. Go to **IAM & Admin** > **Service Accounts** in your dev project
2. Click **Create Service Account**
3. Name it "github-actions-deploy-dev"
4. Click **Create and Continue**
5. Select **"Editor"** role
6. Click **Continue** then **Done**

**For Production:**

1. Go to **IAM & Admin** > **Service Accounts** in your prod project
2. Click **Create Service Account**
3. Name it "github-actions-deploy-prod"
4. Click **Create and Continue**
5. Select **"Editor"** role
6. Click **Continue** then **Done**

### 4. Set Up Workload Identity Federation

**For Dev Project:**

1. Go to **IAM & Admin** > **Workload Identity Federation**
2. Click **Create Pool**
3. Name it "github-actions-dev"
4. Click **Create**
5. Click **Create Provider**
6. Name it "github-dev"
7. **Authentication Protocol**: Select **OIDC**
8. **Flow Type**: Select **ID token**
9. For **Issuer URI**, enter: `https://token.actions.githubusercontent.com`
10. For **Client ID**, enter: `https://token.actions.githubusercontent.com`
11. Click **Create**
12. Click **Add Attribute Mapping**
13. Add: `google.subject` = `assertion.sub`
14. Add: `attribute.actor` = `assertion.actor`
15. Add: `attribute.repository` = `assertion.repository`
16. Click **Add Attribute Condition**
17. Add: `attribute.repository == "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME"`
18. Click **Save**

**For Production Project:**

1. Go to **IAM & Admin** > **Workload Identity Federation**
2. Click **Create Pool**
3. Name it "github-actions-prod"
4. Click **Create**
5. Click **Create Provider**
6. Name it "github-prod"
7. **Authentication Protocol**: Select **OIDC**
8. **Flow Type**: Select **ID token**
9. For **Issuer URI**, enter: `https://token.actions.githubusercontent.com`
10. For **Client ID**, enter: `https://token.actions.githubusercontent.com`
11. Click **Create**
12. Click **Add Attribute Mapping**
13. Add: `google.subject` = `assertion.sub`
14. Add: `attribute.actor` = `assertion.actor`
15. Add: `attribute.repository` = `assertion.repository`
16. Click **Add Attribute Condition**
17. Add: `attribute.repository == "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME"`
18. Click **Save**

**To verify your pool and provider names:**

1. Go to **IAM & Admin** > **Workload Identity Federation**
2. Look at the pool names you actually created
3. Click on a pool to see the provider names you actually created
4. Update the workflow with the correct names

**Common naming patterns:**

- Pool names: `github-actions-dev`, `github-actions-prod`
- Provider names: `github-dev`, `github-prod`

**If you used different names, update the workflow accordingly:**

- Replace `github-actions-dev` with your actual pool name
- Replace `github-dev` with your actual provider name
- Replace `github-actions-prod` with your actual pool name
- Replace `github-prod` with your actual provider name

**Troubleshooting "invalid_target" error:**

1. **Check if the pool exists**: Go to Workload Identity Federation and verify the pool is there
2. **Check if the provider exists**: Click on the pool and verify the provider is there
3. **Check if they're enabled**: Make sure the pool and provider are not disabled
4. **Check the project ID**: Make sure you're using the correct project ID in the secrets
5. **Create separate pools**: You might need separate pools for dev and prod environments

**If you only created one pool for both environments:**

- Use the same pool name for both dev and prod in the workflow
- Or create separate pools for dev and prod environments

**Alternative: Skip Workload Identity Federation Entirely**
If Google Cloud Console keeps being difficult, use the simpler OAuth2 approach:

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name it "github-actions-dev" or "github-actions-prod"
5. Add authorized redirect URIs: `https://github.com/`
6. Click **Create**
7. Download the JSON file
8. Use this in your GitHub Actions workflow instead

### 5. Allow GitHub Actions to Impersonate Service Accounts

**For Dev:**

1. Go to **IAM & Admin** > **IAM**
2. Find your dev service account
3. Click the pencil icon
4. Click **Add another principal**
5. Add: `github-actions-dev@YOUR_PROJECT_ID.iam.gserviceaccount.com`
6. Role: **Workload Identity User**
7. Click **Save**

**For Production:**

1. Go to **IAM & Admin** > **IAM**
2. Find your prod service account
3. Click the pencil icon
4. Click **Add another principal**
5. Add: `github-actions-prod@YOUR_PROJECT_ID.iam.gserviceaccount.com`
6. Role: **Workload Identity User**
7. Click **Save**

### 6. Add GitHub Secrets

In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions** and add:

**For Dev:**

1. **GOOGLE_PROJECT_ID_DEV**
   - Value: Your dev Google Cloud project ID

2. **GOOGLE_SERVICE_ACCOUNT_DEV**
   - Value: Your dev service account email (e.g., `github-actions-deploy-dev@your-project.iam.gserviceaccount.com`)

**For Production:**

1. **GOOGLE_PROJECT_ID_PROD**
   - Value: Your prod Google Cloud project ID

2. **GOOGLE_SERVICE_ACCOUNT_PROD**
   - Value: Your prod service account email (e.g., `github-actions-deploy-prod@your-project.iam.gserviceaccount.com`)

**Note:** Your workflow is already configured to use Workload Identity Federation. The secrets above will work with the current workflow configuration.

### 7. Update Your Workflow

Your workflow will use Workload Identity Federation instead of service account keys.

### 8. Test Both Deployments

1. Push to `develop` branch to test dev deployment
2. Use workflow dispatch to test production deployment

**That's it!** No service account keys needed - Workload Identity Federation handles the authentication.

## Dealing with Google Cloud's Restrictive Policies

**If you get permission errors like "Principal access boundary policy" or "You don't have permission to view":**

### For Personal Google Cloud Accounts (You're the Admin!)

If you're paying for Google Cloud yourself and getting these errors:

**Check Your Roles:**

1. Go to **IAM & Admin** > **IAM**
2. Look for your email address
3. Make sure you have these roles:
   - **Owner** (full access)
   - **Project IAM Admin**
   - **Service Account Admin**
   - **Workload Identity Pool Admin**

**If you don't have Owner role:**

1. Go to **IAM & Admin** > **IAM**
2. Click **Add**
3. Add your email address
4. Grant **Owner** role
5. Click **Save**

**Enable Required APIs:**

1. Go to **APIs & Services** > **Library**
2. Search for and enable:
   - **IAM Service Account Credentials API**
   - **Cloud Resource Manager API**
   - **Service Usage API**

**Check Organization Policies:**

1. Go to **IAM & Admin** > **Organization Policies**
2. Look for policies that might be blocking:
   - Service account creation
   - Workload Identity Federation
   - IAM role assignments

**If you still get errors, try:**

1. **Create a new project** (sometimes projects get corrupted)
2. **Use a different browser** (clear cache/cookies)
3. **Check if you're in the right project** (top dropdown)
4. **Contact Google Cloud Support** (you're paying for it!)

### Option 1: Contact Your Google Cloud Admin

1. Ask your organization's Google Cloud admin to:
   - Grant you "Workload Identity Pool Admin" role
   - Grant you "Service Account Admin" role
   - Or temporarily disable the restrictive policies

### Option 2: Use a Different Approach

If Workload Identity Federation is too restricted, try:

**OAuth2 Authentication:**

1. Go to **APIs & Services** > **Credentials**
2. Create an **OAuth 2.0 Client ID**
3. Download the client configuration
4. Use `
