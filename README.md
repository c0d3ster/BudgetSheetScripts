# Budget Sheet Scripts

[**View the Budget Sheet**](https://docs.google.com/spreadsheets/d/1hLbh3-CBF2TNFnzuWob1Ae3Om8ULyZeW6yYSGfN66oQ/edit?gid=0#gid=0)

Google Apps Script project for budget tracking and automation, written in **TypeScript** for improved maintainability and developer experience.

---

## Source Code Organization

### Overview
This directory contains the Google Apps Script source code for the Budget Sheet automation system. The code is written in TypeScript and organized for better maintainability and configuration management.

### File Structure

#### Core Scripts
- **InvestmentPlans.ts** - Main investment plan chart creation and management
- **Trigger.ts** - Event handlers for spreadsheet edits
- **ChartHelpers.ts** - Chart styling and color management
- **Debug.ts** - Debug mode functionality
- **Initialize.ts** - Initialization and setup functions
- **Logger.ts** - Logging utilities
- **DebtToIncome.ts** - Debt-to-income ratio calculations

#### Configuration Files
- **constants/index.ts** - Main constants barrel file (imports from organized structure)

#### Constants Directory (`/constants/`)
Organized configuration files for better maintainability:
- **chartConfig.ts** - Chart-specific configuration (ranges, labels, dimensions)
- **sheetConfig.ts** - Sheet names and cell references
- **debugConfig.ts** - Debug mode configuration
- **loggingConfig.ts** - Logging configuration
- **investmentPlansConfig.ts** - Investment plan percentages and category colors
- **index.ts** - Barrel file for easy imports

---

## Key Features

### Investment Plans
- **Conservative Plan**: 50% Emergency Fund, balanced distribution
- **Risktaker Plan**: 35% Cryptocurrencies, minimal emergency fund
- **Family Plan**: 30% Education Fund, 25% Vacation Fund
- **Baller Plan**: 50% Vacation Fund, 25% Precious Metals

### Chart Categories
- Emergency Fund (Red)
- Brokerage Account (Teal)
- Precious Metals (Yellow)
- Cryptocurrencies (Purple)
- Vacation Fund (Light Green)
- Education Fund (Orange)
- Remainder (Light Gray)

---

## Configuration Management

### Adding New Investment Plans
1. Edit `constants/investmentPlansConfig.ts`
2. Add new plan object with category percentages
3. Ensure percentages total 100% or less

### Changing Cell References
1. Update appropriate file in `/constants/` directory
2. All scripts will automatically use new references

### Adding New Chart Categories
1. Update `constants/investmentPlansConfig.ts` with new category and color
2. Update all investment plans to include the new category
3. Ensure color is consistent across all plans

---

## Usage

### Main Functions
- `createInvestmentPlanPieChart()` - Creates/updates investment plan chart
- `createPlanDropdown()` - Creates plan selection dropdown
- `getSelectedPlan()` - Retrieves currently selected plan
- `onEdit(e)` - Trigger function for automatic updates

### Constants Usage
```typescript
import { CHART_CONFIG, SHEET_CONFIG, INVESTMENT_PLANS_CONFIG } from './constants'
```

---

## Best Practices
- Always use constants instead of hardcoded cell references
- Update configuration files when changing sheet layout
- Test chart updates after modifying investment plan percentages
- Use the logging system for debugging and monitoring

---

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Authenticate with Google Apps Scripts:
   ```bash
   clasp login
   ```

3. Configure environment:
   - **Dev environment**: Uses your development Google Apps Script project
   - **Production environment**: Uses your production template project

---

## Development Workflow

### Environment Setup
- **Dev Sheet**: Used for development and testing
- **Production Template Sheet**: Used for customer distribution (Etsy)

### Daily Development
- **Auto-push development mode**: `yarn dev:auto` - Watches for changes and automatically pushes to dev sheet
- **Manual push to dev**: `yarn push:dev` - Manual build and push to dev sheet
- **Development mode with watch**: `yarn dev` - Watches for changes and auto-rebuilds (does NOT auto-push)
- **Pull changes from dev**: `yarn pull:dev` - Syncs changes from dev sheet
- **Open dev sheet**: `yarn open:dev`
- **View logs**: `yarn logs`
- **Check status**: `yarn status`

> **⚠️ Note**: The auto-push workflow (`yarn dev:auto`) is designed for single-developer use. With multiple developers, everyone would be overwriting the same dev sheet, causing conflicts and lost work. For team development, each developer would need their own local Google Apps Script project.

### Production Deployments
- **Manual production push**: `yarn push:prod` - Manually push to production template
- **Open production sheet**: `yarn open:prod` - Open production template sheet

### Automated Deployments (GitHub Actions)
- **PR/Develop branch**: Automatically deploys to dev sheet
- **Manual production deployment**: Use GitHub Actions "Run workflow" button
- **Releases**: Created on manual production deployments

### Typical Development Cycle
```bash
# 1. Start development with auto-push
yarn dev:auto              # Watch for changes and auto-push to dev sheet

# 2. Make changes to TypeScript files
# (yarn dev:auto will auto-rebuild and push to dev sheet)

# 3. Test changes immediately in your dev sheet
# (no manual push needed!)

# 4. Commit and push
git add .
git commit -m "feat: new feature"
git push origin feature-branch

# 5. When ready for production
# Go to GitHub Actions → Run workflow → Select "production"
```

---

## Notes
- All `.ts` files are compiled and pushed to Google Apps Script
- Use `yarn push:dev` after making changes to sync with dev sheet
- Use GitHub Actions for production deployments
- The TypeScript configuration provides better IntelliSense in your editor

## Deployment Verification

### Automatic Verification
- **Deployment logs** are automatically created when `initializeBudgetSystem()` runs
- **Check Google Apps Script logs** for deployment timestamps
- **DeploymentLog sheet** is created with deployment history

### Manual Verification
- **Run `verifyDeployment()`** in Google Apps Script editor to check current deployment
- **Check the DeploymentLog sheet** in your spreadsheet for deployment history
- **Look for console logs** with deployment timestamps

### Verification Steps
1. **After deployment**: Run `verifyDeployment()` in Apps Script editor
2. **Check logs**: View execution logs in Apps Script
3. **Check sheet**: Look for "DeploymentLog" sheet with timestamps
4. **Test functionality**: Verify your changes work as expected 