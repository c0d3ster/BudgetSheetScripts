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

1. Get your Google Apps Script project ID from the URL: `https://script.google.com/home/projects/YOUR_SCRIPT_ID_HERE/edit`
2. Update `.clasp.json` with your script ID:
   ```json
   {
     "scriptId": "YOUR_ACTUAL_SCRIPT_ID_HERE",
     "rootDir": ".",
     "fileExtension": "js"
   }
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

- **Push changes to Google Apps Script**: `npm run push`
- **Pull changes from Google Apps Script**: `npm run pull`
- **Open in Google Apps Script editor**: `npm run open`
- **View logs**: `npm run logs`

## Notes
- All `.ts` files are compiled and pushed to Google Apps Script
- Use `npm run push` after making changes to sync with Google Apps Script
- The TypeScript configuration provides better IntelliSense in your editor 