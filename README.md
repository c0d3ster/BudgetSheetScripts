# Budget Sheet Scripts

Google Apps Script project for budget tracking and automation.

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

## File Structure

- `InvestmentPlans.gs` - Investment plan chart functionality
- `Trigger.gs` - onEdit triggers for automatic updates
- `ColorPieChartSlices.gs` - Expense chart coloring

## Notes

- All `.gs` files will be pushed to Google Apps Script
- Use `npm run push` after making changes to sync with Google Apps Script
- The TypeScript configuration provides better IntelliSense in your editor 