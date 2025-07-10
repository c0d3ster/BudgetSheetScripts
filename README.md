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
- **Logger.ts** - Logging utilities
- **Reset.ts** - Reset functionality
- **index.ts** - Main entry point

#### Managers Directory (`/managers/`)

Organized manager files for data and range operations:

- **SourceRangeManager.ts** - Source data range management
- **DataRangeManager.ts** - Data range management and operations
- **index.ts** - Barrel file for easy imports

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

- **Smart auto-push development mode**: `yarn dev:auto` - Watches for changes with 30-second debouncing and manual push trigger
- **Manual push to dev**: `yarn push:dev` - Manual build and push to dev sheet
- **Development mode with watch**: `yarn dev` - Watches for changes and auto-rebuilds (does NOT auto-push)
- **Pull changes from dev**: `yarn pull:dev` - Syncs changes from dev sheet
- **Open dev sheet**: `yarn open:dev`
- **View logs**: `yarn logs`
- **Check status**: `yarn status`

> **💡 Development Tips**:
>
> - Use `yarn dev:auto` for smart development with full control
> - Press Enter anytime to push immediately (bypasses 30-second timer)
> - Changes are batched and pushed after 30 seconds of inactivity
> - For manual control, just use `yarn push:dev` directly

> **⚠️ Note**: The auto-push workflow (`yarn dev:auto`) is designed for single-developer use. With multiple developers, everyone would be overwriting the same dev sheet, causing conflicts and lost work. For team development, each developer would need their own local Google Apps Script project.

### Troubleshooting

#### **Common Issues**

**Timer not resetting on file changes?**

- Check that you're editing files in the `src/` directory
- Ensure the file watcher is running (you should see "👀 Watching for changes...")

**Manual push not working?**

- Make sure you're pressing Enter in the terminal where `yarn dev:auto` is running
- Check that there are pending changes (you should see pending changes count)

**Changes not being batched?**

- The script deduplicates file changes, so multiple saves of the same file won't create multiple entries
- Each unique file change is tracked separately

**Push failing?**

- Check your `.clasp.dev.json` configuration
- Ensure you're logged in with `clasp login`
- Check Google Apps Script quotas and limits

### Production Deployments

- **Manual production push**: `yarn push:prod` - Manually push to production template
- **Open production sheet**: `yarn open:prod` - Open production template sheet

### Automated Deployments (GitHub Actions)

- **PR/Develop branch**: Automatically deploys to dev sheet
- **Manual production deployment**: Use GitHub Actions "Run workflow" button
- **Releases**: Created on manual production deployments

### Smart Development Workflow

The new `yarn dev:auto` provides intelligent development with full control:

#### **Features**

- **30-second debouncing**: Timer resets with each file change
- **Manual push trigger**: Press Enter anytime to push immediately
- **Change batching**: Multiple files pushed together
- **Deduplicated logging**: No spam from multiple file watcher events

#### **Usage Examples**

```bash
# Start smart development mode
yarn dev:auto
```

**Typical workflow:**

```bash
# 1. Start development
yarn dev:auto

# 2. Make changes to files
# You'll see: "📝 File changed: src/Logger.ts (1 pending changes)"
# You'll see: "⏰ Auto-push scheduled in 30 seconds (press Enter to push now)"

# 3. Make more changes quickly
# Timer resets each time, giving you 30 seconds from the last change

# 4. Push when ready (two options):
# Option A: Press Enter to push immediately
# Option B: Wait 30 seconds for auto-push

# 5. See results: "📤 Pushing 3 file changes to dev sheet..."
```

#### **Real-world Scenarios**

**Scenario 1: Quick Iteration**

```bash
# Make a small change
# Press Enter immediately
# Test the change
# Repeat
```

**Scenario 2: Multiple Changes**

```bash
# Make several changes across multiple files
# Timer keeps resetting (30 seconds from last change)
# Press Enter when all changes are ready
# All changes pushed together
```

**Scenario 3: Set and Forget**

```bash
# Make changes
# Walk away for coffee
# Come back to find changes auto-pushed after 30 seconds
```

### Typical Development Cycle

```bash
# 1. Start development with smart auto-push
yarn dev:auto              # Watch for changes with full control

# 2. Make changes to TypeScript files
# (Timer resets with each change, or press Enter to push immediately)

# 3. Test changes immediately in your dev sheet
# (Manual or automatic push based on your preference!)

# 4. Commit and push
git add .
git commit -m "feat: new feature"
git push origin feature-branch

# 5. When ready for production
# Go to GitHub Actions → Run workflow → Select "production"
```

---

## Manual Deployment

**For Development:**

1. Checkout the develop branch: `git checkout develop`
2. Build the project: `yarn build`
3. Deploy to dev: `clasp push`

**For Production:**

1. Checkout main branch: `git checkout main`
2. Build the project: `yarn build`
3. Deploy to production: `clasp push`

### Build Commands

- `yarn build` - Build the TypeScript code
- `yarn dev` - Watch mode for development
- `yarn lint` - Run ESLint

## Project Structure

- `src/` - TypeScript source code
- `build/` - Compiled JavaScript (deployed to Google Apps Script)
- `.clasp.dev.json` - Development script configuration
- `.clasp.prod.json` - Production script configuration

## Notes

- All `.ts` files are compiled and pushed to Google Apps Script
- Use `yarn push:dev` after making changes to sync with dev sheet
- Use GitHub Actions for production deployments
- The TypeScript configuration provides better IntelliSense in your editor
- The GitHub Actions workflow builds the project on PRs and pushes
- Manual deployment is used for Google Apps Script deployment
- Use `clasp push` to deploy changes to Google Apps Script

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
