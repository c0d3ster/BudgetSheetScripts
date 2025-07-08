# Budget Sheet Scripts - Source Code Organization

## Overview
This directory contains the Google Apps Script source code for the Budget Sheet automation system. The code has been reorganized for better maintainability and configuration management.

## File Structure

### Core Scripts
- **`InvestmentPlans.js`** - Main investment plan chart creation and management
- **`Trigger.js`** - Event handlers for spreadsheet edits
- **`ColorPieChartSlices.js`** - Chart styling and color management
- **`Debug.js`** - Debug mode functionality
- **`Initialize.js`** - Initialization and setup functions
- **`Logger.js`** - Logging utilities
- **`DebtToIncome.js`** - Debt-to-income ratio calculations

### Configuration Files
- **`Constants.js`** - Main constants file (imports from organized structure)

### Constants Directory (`/constants/`)
Organized configuration files for better maintainability:

- **`chartConfig.js`** - Chart-specific configuration (ranges, labels, dimensions)
- **`sheetConfig.js`** - Sheet names and cell references
- **`dataRanges.js`** - Data range definitions
- **`debugConfig.js`** - Debug mode configuration
- **`loggingConfig.js`** - Logging configuration
- **`investmentPlansConfig.js`** - Investment plan percentages and category colors
- **`index.js`** - Barrel file for easy imports

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

## Configuration Management

### Adding New Investment Plans
1. Edit `constants/investmentPlansConfig.js`
2. Add new plan object with category percentages
3. Ensure percentages total 100% or less

### Changing Cell References
1. Update appropriate file in `/constants/` directory
2. All scripts will automatically use new references

### Adding New Chart Categories
1. Update `constants/investmentPlansConfig.js` with new category and color
2. Update all investment plans to include the new category
3. Ensure color is consistent across all plans

## Usage

### Main Functions
- `createInvestmentPlanPieChart()` - Creates/updates investment plan chart
- `createPlanDropdown()` - Creates plan selection dropdown
- `getSelectedPlan()` - Retrieves currently selected plan
- `onEdit(e)` - Trigger function for automatic updates

### Constants Usage
```javascript
import { CHART_CONFIG, SHEET_CONFIG, DATA_RANGES, INVESTMENT_PLANS_CONFIG } from './Constants.js'
```

## Best Practices
- Always use constants instead of hardcoded cell references
- Update configuration files when changing sheet layout
- Test chart updates after modifying investment plan percentages
- Use the logging system for debugging and monitoring 