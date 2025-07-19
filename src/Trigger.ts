import { colorPieChartGreenToLightGreen, colorPieChartRedToYellow } from '@/ChartHelpers'
import { DEBUG_CONFIG, INVESTMENT_PLANS_CONFIG } from '@/constants'
import { toggleDebugVisibility } from '@/Debug'
import { createInvestmentPlanPieChart } from '@/InvestmentPlans'
import { log, logError } from '@/Logger'
import { getEarningsSourceRange, getFixedExpensesSourceRange, getVariableExpensesSourceRange } from '@/managers'

// Helper function to check if one range intersects with another range
const isRangeIntersecting = (editedRange: string, sourceRange: string): boolean => {
  try {
    // Parse the ranges to get their boundaries
    const edited = parseRange(editedRange)
    const source = parseRange(sourceRange)

    // Check if ranges intersect (overlap)
    return (
      edited.startRow <= source.endRow &&
      edited.endRow >= source.startRow &&
      edited.startCol <= source.endCol &&
      edited.endCol >= source.startCol
    )
  } catch (error) {
    logError(`Parsing ranges failed: ${error}`)
    return false
  }
}

// Helper function to parse a range string (e.g., "G5:G16", "L5", "P10:Q11") into row/column boundaries
const parseRange = (rangeStr: string): { startRow: number; startCol: number; endRow: number; endCol: number } => {
  // Handle single cell (e.g., "L5")
  const singleCellMatch = rangeStr.match(/^([A-Z]+)(\d+)$/)
  if (singleCellMatch) {
    const col = columnToNumber(singleCellMatch[1])
    const row = parseInt(singleCellMatch[2])
    return { startRow: row, startCol: col, endRow: row, endCol: col }
  }

  // Handle range format (e.g., "G5:G16", "P10:Q11")
  const rangeMatch = rangeStr.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/)
  if (rangeMatch) {
    const startCol = columnToNumber(rangeMatch[1])
    const startRow = parseInt(rangeMatch[2])
    const endCol = columnToNumber(rangeMatch[3])
    const endRow = parseInt(rangeMatch[4])
    return { startRow, startCol, endRow, endCol }
  }

  throw new Error(`Invalid range format: ${rangeStr}`)
}

// Helper function to convert column letter to number (A=1, B=2, etc.)
const columnToNumber = (column: string): number => {
  let result = 0
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64)
  }
  return result
}

// eslint-disable-next-line
export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  // log(`onEdit function called - Sheet: ${e.source.getActiveSheet().getName()}`)

  // Check if the edit was in the "Monthly" sheet
  if (e.source.getActiveSheet().getName() === 'Monthly') {
    const editedRange = e.range.getA1Notation()
    //log(`onEdit triggered for range: ${editedRange} (Column: ${e.range.getColumn()}, Row: ${e.range.getRow()})`)

    // Check if the edit was in the plan dropdown
    if (editedRange === INVESTMENT_PLANS_CONFIG.PLAN_DROPDOWN_CELL) {
      log(`onEdit: investment plan dropdown (${editedRange})`)

      // Create the investment plan chart
      try {
        createInvestmentPlanPieChart()
        log(`onEdit: investment plan chart update complete`)
      } catch (error) {
        logError(error, 'Investment plan chart update failed')
      }
      return
    }

    // Check if debug mode was toggled
    if (editedRange === DEBUG_CONFIG.VALUE_CELL) {
      log(`onEdit: Debug mode toggle`)
      toggleDebugVisibility()
      log(`onEdit: Debug mode toggle complete`)
      return
    }

    // Check if the edit was in the source ranges that feed into expense calculations
    // Get source ranges from cells
    const earningsSourceRange = getEarningsSourceRange()
    const fixedExpensesSourceRange = getFixedExpensesSourceRange()
    const variableExpensesSourceRange = getVariableExpensesSourceRange()

    // Check if source ranges are valid
    if (!earningsSourceRange || !fixedExpensesSourceRange || !variableExpensesSourceRange) {
      log(
        `onEdit: One or more source ranges are empty. Earnings: "${earningsSourceRange}", Fixed: "${fixedExpensesSourceRange}", Variable: "${variableExpensesSourceRange}"`
      )
      return
    }

    // Check if the edited range intersects with any of the source ranges
    const isEarningsRange = isRangeIntersecting(editedRange, earningsSourceRange)
    const isFixedExpensesRange = isRangeIntersecting(editedRange, fixedExpensesSourceRange)
    const isVariableExpensesRange = isRangeIntersecting(editedRange, variableExpensesSourceRange)

    log(
      `onEdit: Range check for ${editedRange} - Earnings: ${isEarningsRange}, Fixed: ${isFixedExpensesRange}, Variable: ${isVariableExpensesRange}`
    )

    // Handle each source range type individually
    if (isEarningsRange) {
      log(`onEdit: earnings range (${editedRange})`)
      try {
        colorPieChartGreenToLightGreen()
        createInvestmentPlanPieChart()
        log(`onEdit: earnings chart and investment plan chart updates complete`)
      } catch (error) {
        logError(error, 'Earnings chart update failed')
      }
    }

    if (isFixedExpensesRange) {
      log(`onEdit: fixed expenses range (${editedRange})`)
      try {
        colorPieChartRedToYellow()
        createInvestmentPlanPieChart()
        log(`onEdit: fixed expenses chart and investment plan chart updates complete`)
      } catch (error) {
        logError(error, 'Fixed expenses chart update failed')
      }
    }

    if (isVariableExpensesRange) {
      log(`onEdit: variable expenses range (${editedRange})`)
      try {
        colorPieChartRedToYellow()
        createInvestmentPlanPieChart()
        log(`onEdit: variable expenses chart and investment plan chart updates complete`)
      } catch (error) {
        logError(error, 'Variable expenses chart update failed')
      }
    }
  }
}
