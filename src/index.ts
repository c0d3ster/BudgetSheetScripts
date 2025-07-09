export * from './Trigger'
export * from './Logger'
export * from './InvestmentPlans'
export * from './Initialize'
export * from './Debug'
export * from './DebtToIncome'
export * from './ChartHelpers'
export * from './constants'

// Attach all exports to the global object for Apps Script
import * as exportsAll from './Trigger'
import * as initAll from './Initialize'
for (const key in exportsAll) {
  // @ts-ignore
  globalThis[key] = exportsAll[key]
}
for (const key in initAll) {
  // @ts-ignore
  globalThis[key] = initAll[key]
}

// Helper to programmatically set up the onEdit trigger
function setupTriggers() {
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}
// @ts-ignore
(globalThis as any).setupTriggers = setupTriggers;
