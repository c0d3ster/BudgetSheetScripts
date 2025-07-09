import { SHEET_CONFIG, SOURCE_RANGE_CONFIG } from './constants'
import { log } from './Logger'

// Functions to manage source range cells
export const updateEarningsSourceRange = (newRange: string) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  sheet.getRange(SOURCE_RANGE_CONFIG.EARNINGS.VALUE_CELL).setValue(newRange)
  log(`Updated earnings source range to: ${newRange}`)
}

export const updateFixedExpensesSourceRange = (newRange: string) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  sheet.getRange(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.VALUE_CELL).setValue(newRange)
  log(`Updated fixed expenses source range to: ${newRange}`)
}

export const updateVariableExpensesSourceRange = (newRange: string) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  sheet.getRange(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.VALUE_CELL).setValue(newRange)
  log(`Updated variable expenses source range to: ${newRange}`)
}

export const getEarningsSourceRange = (): string => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  return sheet.getRange(SOURCE_RANGE_CONFIG.EARNINGS.VALUE_CELL).getValue()
}

export const getFixedExpensesSourceRange = (): string => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  return sheet.getRange(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.VALUE_CELL).getValue()
}

export const getVariableExpensesSourceRange = (): string => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_CONFIG.MONTHLY_SHEET}" not found`)
  }

  return sheet.getRange(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.VALUE_CELL).getValue()
}

export const resetEarningsSourceRange = () => {
  updateEarningsSourceRange(SOURCE_RANGE_CONFIG.EARNINGS.DEFAULT_RANGE)
  log(`Reset earnings source range to default: ${SOURCE_RANGE_CONFIG.EARNINGS.DEFAULT_RANGE}`)
}

export const resetFixedExpensesSourceRange = () => {
  updateFixedExpensesSourceRange(SOURCE_RANGE_CONFIG.FIXED_EXPENSES.DEFAULT_RANGE)
  log(`Reset fixed expenses source range to default: ${SOURCE_RANGE_CONFIG.FIXED_EXPENSES.DEFAULT_RANGE}`)
}

export const resetVariableExpensesSourceRange = () => {
  updateVariableExpensesSourceRange(SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.DEFAULT_RANGE)
  log(`Reset variable expenses source range to default: ${SOURCE_RANGE_CONFIG.VARIABLE_EXPENSES.DEFAULT_RANGE}`)
}
