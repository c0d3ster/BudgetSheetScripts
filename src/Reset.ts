import { setupDebugMode } from './Debug'
import { createPlanDropdown } from './InvestmentPlans'
import { setupDataRangeCells } from './DataRangeManager'
import { log, logError } from './Logger'

// Sheet Reset/Repair Tool
// Run this if you accidentally delete or break chart labels, dropdowns, or debug controls.
// This will restore all necessary controls and labels without affecting your financial data.

export const resetSheetSetup = () => {
  log('--- SHEET RESET/REPAIR STARTED ---')

  try {
    // Restore debug controls
    log('Restoring debug controls...')
    setupDebugMode()
    log('Debug controls restored.')

    // Restore investment plan dropdown
    log('Restoring investment plan dropdown...')
    createPlanDropdown()
    log('Investment plan dropdown restored.')

    // Restore data range cells and chart labels
    log('Restoring data range cells and chart labels...')
    setupDataRangeCells()
    log('Data range cells and chart labels restored.')

    log('--- SHEET RESET/REPAIR COMPLETE ---')
    log('No user data was affected. Only controls, dropdowns, and chart info labels were restored.')
  } catch (error) {
    logError(error, 'Sheet reset/repair failed')
    throw error
  }
}
