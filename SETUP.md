# Environment Setup Guide

## Overview

This project uses a dual-environment setup:
- **Dev Sheet**: For development and testing
- **Production Template Sheet**: For customer distribution (Etsy)

## Account Setup

### Transferring Ownership (Option 1)

If you want to transfer existing projects:

#### Google Apps Script Projects:
1. Go to [Google Apps Script](https://script.google.com/)
2. Select your project
3. Click project settings (gear icon)
4. Add `support@c0d3ster.com` as editor
5. Transfer ownership through sharing dialog

#### Google Sheets:
1. Open your budget sheet
2. Click "Share" (top right)
3. Add `support@c0d3ster.com` as editor
4. Transfer ownership

### Creating New Projects (Option 2 - Recommended)

For a clean business setup:

#### 1. Create New Google Apps Script Projects:
1. Login as `support@c0d3ster.com`
2. Create "Budget Sheet Template - Dev"
3. Create "Budget Sheet Template - Production"
4. Copy Script IDs and update configurations

#### 2. Update Clasp Configurations:
```bash
# Update .clasp.dev.json with new dev Script ID
# Update .clasp.prod.json with new production Script ID
```

#### 3. Set Up Google Cloud Project:
1. Create new Google Cloud project under `support@c0d3ster.com`
2. Enable Google Apps Script API
3. Create service account for GitHub Actions

## Initial Setup

### 1. Create Production Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project called "Budget Sheet Template - Production"
3. Copy the Script ID from the URL
4. Update `.clasp.prod.json` with the production Script ID

### 2. Set Up GitHub Secrets

In your GitHub repository settings, add these secrets:

#### `GOOGLE_APPS_SCRIPT_CREDENTIALS`
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Apps Script API
4. Create a service account
5. Download the JSON credentials
6. Add the entire JSON as a secret

#### `CLASP_TOKEN`
1. Run `clasp login` locally
2. Copy the token from `~/.clasprc.json`
3. Add as a secret

### 3. Configure Branch Protection

1. Go to repository Settings > Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators

## Workflow

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-investment-plan

# 2. Make changes to TypeScript files
yarn dev  # Watch mode

# 3. Test on dev sheet
yarn push:dev

# 4. Commit and push
git add .
git commit -m "feat: add new investment plan"
git push origin feature/new-investment-plan

# 5. Create PR
# GitHub Actions will automatically deploy to dev sheet
```

### Production Deployment

```bash
# 1. Merge PR to main
# GitHub Actions automatically deploys to production

# 2. Or manually deploy to production
yarn push:prod
```

## Environment Management

### Dev Environment
- **Purpose**: Development and testing
- **Updates**: Every commit/PR
- **Access**: Development team only
- **Commands**: `yarn push:dev`, `yarn open:dev`

### Production Environment
- **Purpose**: Customer template (Etsy)
- **Updates**: Only on main branch merges
- **Access**: Customers via Etsy
- **Commands**: `yarn push:prod`, `yarn open:prod`

## Troubleshooting

### GitHub Actions Failures

1. **Authentication Issues**:
   - Check `GOOGLE_APPS_SCRIPT_CREDENTIALS` secret
   - Verify service account has Apps Script permissions

2. **Build Failures**:
   - Check TypeScript compilation errors
   - Verify all dependencies are installed

3. **Deployment Failures**:
   - Check Script IDs in `.clasp.dev.json` and `.clasp.prod.json`
   - Verify clasp authentication

### Local Development Issues

1. **Wrong Environment**:
   - Use `yarn push:dev` for development
   - Use `yarn push:prod` for production

2. **Authentication Issues**:
   - Run `clasp login` to re-authenticate
   - Check `.clasprc.json` file

## Best Practices

### Development
- Always test on dev sheet before production
- Use feature branches for new development
- Write descriptive commit messages
- Test thoroughly before merging to main

### Production
- Only merge tested code to main
- Monitor GitHub Actions for deployment success
- Keep production template stable
- Document breaking changes

### Security
- Never commit credentials
- Use environment-specific Script IDs
- Regularly rotate service account keys
- Monitor access logs 