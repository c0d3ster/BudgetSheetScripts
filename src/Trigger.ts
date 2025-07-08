import { DEBUG_CONFIG, SHEET_CONFIG } from './constants'
import { colorPieChartRedToYellow } from './ChartHelpers'
import { createInvestmentPlanPieChart } from './InvestmentPlans'
import { log, logError } from './Logger'
import { toggleDebugVisibility } from './Debug'

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  // Check if the edit was in the "Monthly" sheet
  if (e.source.getActiveSheet().getName() === "Monthly") {
    const range = e.range

    // Check if debug mode was toggled
    if (range.getA1Notation() === DEBUG_CONFIG.VALUE_CELL) {
      log(`onEdit: Debug mode toggle`)
      toggleDebugVisibility()
      log(`onEdit: Debug mode toggle complete`)
      return
    }

    // Check if the edit was in the source ranges that feed into expense calculations
    // F5-16 (column 6), J5-16 (column 10), N5-16 (column 14)
    const isEarningsRange = range.getColumn() === 6 && range.getRow() >= 5 && range.getRow() <= 16
    const isFixedExpensesRange = range.getColumn() === 10 && range.getRow() >= 5 && range.getRow() <= 16
    const isVariableExpensesRange = range.getColumn() === 14 && range.getRow() >= 5 && range.getRow() <= 16

    const isSourceRange = isEarningsRange || isFixedExpensesRange || isVariableExpensesRange

    if (isSourceRange) {
      let rangeType = ''
      if (isEarningsRange) rangeType = 'earnings'
      else if (isFixedExpensesRange) rangeType = 'fixed expenses'
      else if (isVariableExpensesRange) rangeType = 'variable expenses'

      log(`onEdit: ${rangeType} range (${range.getA1Notation()})`)

      // Add a small delay to ensure the edit is complete
      Utilities.sleep(100)

      // Run both functions - expenses affect investable funds, so update both charts
      try {
        colorPieChartRedToYellow()
        createInvestmentPlanPieChart()
        log(`onEdit: expense chart and investment plan chart updates complete`)
      } catch (error) {
        logError(error, "Expense chart update failed")
      }
    }

    // Check if the edit was in the plan dropdown
    if (range.getA1Notation() === SHEET_CONFIG.PLAN_DROPDOWN_CELL) {
      log(`onEdit: investment plan dropdown (${range.getA1Notation()})`)

      // Add a small delay to ensure the edit is complete
      Utilities.sleep(100)

      // Create the investment plan chart
      try {
        createInvestmentPlanPieChart()
        log(`onEdit: investment plan chart update complete`)
      } catch (error) {
        logError(error, "Investment plan chart update failed")
      }
    }

    // Check if the edit was in earnings range
    const earningsColumn = SHEET_CONFIG.EARNINGS_RANGE.split(':')[0].replace(/\d/g, '')
    const earningsColumnNumber = earningsColumn.charCodeAt(0) - 64 // Convert A=1, B=2, etc.
    if (range.getColumn() === earningsColumnNumber && range.getRow() >= 5) {
      log(`onEdit: earnings range (${range.getA1Notation()})`)

      // Add a small delay to ensure the edit is complete
      Utilities.sleep(100)

      // Create the investment plan chart
      try {
        createInvestmentPlanPieChart()
        log(`onEdit: investment plan chart update complete`)
      } catch (error) {
        logError(error, "Investment plan chart update failed")
      }
    }
  }
}