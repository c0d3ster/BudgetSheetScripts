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
for (const key in exportsAll) {
  // @ts-ignore
  globalThis[key] = exportsAll[key]
}
