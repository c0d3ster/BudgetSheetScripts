import { DEBUG_CONFIG, SHEET_CONFIG, CHART_CONFIG } from './constants'
import { colorPieChartRedToYellow, colorPieChartGreenToLightGreen } from './ChartHelpers'
import { createInvestmentPlanPieChart } from './InvestmentPlans'
import { log, logError } from './Logger'
import { toggleDebugVisibility } from './Debug'

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  log(`onEdit function called - Sheet: ${e.source.getActiveSheet().getName()}`)

  // Check if the edit was in the "Monthly" sheet
  if (e.source.getActiveSheet().getName() === "Monthly") {
    const range = e.range
    log(`onEdit triggered for range: ${range.getA1Notation()} (Column: ${range.getColumn()}, Row: ${range.getRow()})`)

    // Check if debug mode was toggled
    if (range.getA1Notation() === DEBUG_CONFIG.VALUE_CELL) {
      log(`onEdit: Debug mode toggle`)
      toggleDebugVisibility()
      log(`onEdit: Debug mode toggle complete`)
      return
    }

    // Check if the edit was in the source ranges that feed into expense calculations
    // G5-16 (column 7), L5-16 (column 12), Q5-16 (column 17)
    const isEarningsRange = range.getColumn() === 7 && range.getRow() >= 5 && range.getRow() <= 16
    const isFixedExpensesRange = range.getColumn() === 12 && range.getRow() >= 5 && range.getRow() <= 16
    const isVariableExpensesRange = range.getColumn() === 17 && range.getRow() >= 5 && range.getRow() <= 16

    const isSourceRange = isEarningsRange || isFixedExpensesRange || isVariableExpensesRange

    log(`onEdit: Range check - Earnings: ${isEarningsRange}, Fixed: ${isFixedExpensesRange}, Variable: ${isVariableExpensesRange}, IsSource: ${isSourceRange}`)

    if (isSourceRange) {
      let rangeType = ''
      if (isEarningsRange) rangeType = 'earnings'
      else if (isFixedExpensesRange || isVariableExpensesRange) rangeType = 'expenses'

      log(`onEdit: ${rangeType} range (${range.getA1Notation()})`)

      // Add a small delay to ensure the edit is complete
      Utilities.sleep(100)

      // Run appropriate functions based on what was edited
      try {
        if (isEarningsRange) {
          colorPieChartGreenToLightGreen()
          createInvestmentPlanPieChart()
          log(`onEdit: earnings chart and investment plan chart updates complete`)
        } else {
          // For expense ranges, update expense chart and investment plan
          colorPieChartRedToYellow()
          createInvestmentPlanPieChart()
          log(`onEdit: expense chart and investment plan chart updates complete`)
        }
      } catch (error) {
        logError(error, "Chart update failed")
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


  }
}