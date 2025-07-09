export * from './Trigger'
export * from './Logger'
export * from './InvestmentPlans'
export * from './Reset'
export * from './Debug'
export * from './ChartHelpers'
export * from './DataRangeManager'
export * from './SourceRangeManager'
export * from './constants'

// Attach all exports to the global object for Apps Script
import * as exportsAll from './Trigger'
for (const key in exportsAll) {
  // @ts-expect-error - globalThis is not typed
  globalThis[key] = exportsAll[key]
}
