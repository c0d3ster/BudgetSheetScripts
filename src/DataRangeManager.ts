import { CHART_CONFIG, SHEET_CONFIG, SOURCE_RANGE_CONFIG } from './constants'
import { log } from './Logger'

export const setupDataRangeCells = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  // Set up the chart info structure - labels in X, values in Y
  sheet.getRange(CHART_CONFIG.EARNINGS.LABEL_CELL).setValue(CHART_CONFIG.EARNINGS.LABEL)
  sheet.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).setValue(CHART_CONFIG.EARNINGS.DEFAULT_DATA_RANGE)

  sheet.getRange(CHART_CONFIG.EXPENSES.LABEL_CELL).setValue(CHART_CONFIG.EXPENSES.LABEL)
  sheet.getRange(CHART_CONFIG.EXPENSES.DATA_RANGE_CELL).setValue(CHART_CONFIG.EXPENSES.DEFAULT_DATA_RANGE)

  sheet.getRange(CHART_CONFIG.INVESTMENT_PLANS.LABEL_CELL).setValue(CHART_CONFIG.INVESTMENT_PLANS.LABEL)
  sheet
    .getRange(CHART_CONFIG.INVESTMENT_PLANS.DATA_RANGE_CELL)
    .setValue(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE)

  // Set up source range cells - labels in X, values in Y
  sheet.getRange(SOURCE_RANGE_CONFIG.EARNINGS.LABEL_CELL).setValue(SOURCE_RANGE_CONFIG.EARNINGS.LABEL)
  sheet.getRange(SOURCE_RANGE_CONFIG.EARNINGS.VALUE_CELL).setValue(SOURCE_RANGE_CONFIG.EARNINGS.DEFAULT_RANGE)
  sheet.getRange(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.LABEL_CELL).setValue(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.LABEL)
  sheet
    .getRange(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.VALUE_CELL)
    .setValue(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.DEFAULT_RANGE)
  sheet.getRange(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.LABEL_CELL).setValue(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.LABEL)
  sheet
    .getRange(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.VALUE_CELL)
    .setValue(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.DEFAULT_RANGE)

  // Now try to find actual charts and log which ones are found
  const charts = sheet.getCharts()
  const foundCharts = new Set<string>()

  charts.forEach(chart => {
    const ranges = chart.getRanges()
    if (ranges.length > 0) {
      ranges.forEach(range => {
        const rangeNotation = range.getA1Notation()

        // Check if this is the earnings chart
        const earningsDataRange = sheet.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).getValue()
        if (rangeNotation.includes(earningsDataRange) && !foundCharts.has('earnings')) {
          log(`Found Earnings Chart using range: ${earningsDataRange}`)
          foundCharts.add('earnings')
        }

        // Check if this is the expense chart
        const expenseDataRange = sheet.getRange(CHART_CONFIG.EXPENSES.DATA_RANGE_CELL).getValue()
        if (rangeNotation.includes(expenseDataRange) && !foundCharts.has('expense')) {
          log(`Found Expenses Chart using range: ${expenseDataRange}`)
          foundCharts.add('expense')
        }

        // Check if this is the investment plan chart
        if (
          rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE) &&
          !foundCharts.has('investment')
        ) {
          log(`Found Investment Plans Chart using range: ${CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE}`)
          foundCharts.add('investment')
        }
      })
    }
  })

  log('Chart information populated with values in columns U and V')
}

// Functions to manage data range cells
export const updateEarningsDataRange = (newRange: string) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  sheet.getRange('Y6').setValue(newRange)
  log(`Updated earnings data range to: ${newRange}`)
}

export const updateExpenseDataRange = (newRange: string) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  sheet.getRange('Y7').setValue(newRange)
  log(`Updated expense data range to: ${newRange}`)
}

export const updateInvestmentPlanDataRange = (newRange: string) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  sheet.getRange('V8').setValue(newRange)
  log(`Updated investment plan data range to: ${newRange}`)
}

export const getEarningsDataRange = (): string => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  return sheet.getRange('Y6').getValue()
}

export const getExpenseDataRange = (): string => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  return sheet.getRange('Y7').getValue()
}

export const getInvestmentPlanDataRange = (): string => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  return sheet.getRange('V8').getValue()
}

// Reset functions to restore default values from config
export const resetEarningsDataRange = () => {
  updateEarningsDataRange(CHART_CONFIG.EARNINGS.DEFAULT_DATA_RANGE)
  log(`Reset earnings data range to default: ${CHART_CONFIG.EARNINGS.DEFAULT_DATA_RANGE}`)
}

export const resetExpenseDataRange = () => {
  updateExpenseDataRange(CHART_CONFIG.EXPENSES.DEFAULT_DATA_RANGE)
  log(`Reset expense data range to default: ${CHART_CONFIG.EXPENSES.DEFAULT_DATA_RANGE}`)
}

export const resetInvestmentPlanDataRange = () => {
  updateInvestmentPlanDataRange(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE)
  log(`Reset investment plan data range to default: ${CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE}`)
}
