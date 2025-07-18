import { RECURRING_CONFIG } from '@/constants'
import { log } from '@/Logger'

export interface RecurringItem {
  description: string
  amount: number
  category: string
  frequency: string
  startDate: Date
  endDate?: Date
  splitAmount: boolean
  nextDue: Date
  status: string
}

export const setupRecurringSheet = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(RECURRING_CONFIG.SHEET.NAME)

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(RECURRING_CONFIG.SHEET.NAME)
    log(`Created new sheet: ${RECURRING_CONFIG.SHEET.NAME}`)
  }

  // Set up headers
  const headers = [
    'Description',
    'Amount',
    'Category',
    'Frequency',
    'Start Date',
    'End Date',
    'Split Amount',
    'Next Due',
    'Status',
  ]

  const headerRange = sheet.getRange(RECURRING_CONFIG.SHEET.HEADER_ROW, 1, 1, headers.length)
  headerRange.setValues([headers])
  headerRange.setFontWeight('bold')

  // Set up data validation for frequency dropdown
  const frequencyRange = sheet.getRange(RECURRING_CONFIG.SHEET.DATA_START_ROW, 4, 1000, 1)
  const frequencyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.values(RECURRING_CONFIG.FREQUENCIES), true)
    .setAllowInvalid(false)
    .build()
  frequencyRange.setDataValidation(frequencyRule)

  // Set up data validation for split amount dropdown
  const splitAmountRange = sheet.getRange(RECURRING_CONFIG.SHEET.DATA_START_ROW, 7, 1000, 1)
  const splitAmountRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Yes', 'No'], true)
    .setAllowInvalid(false)
    .build()
  splitAmountRange.setDataValidation(splitAmountRule)

  // Set up data validation for status dropdown
  const statusRange = sheet.getRange(RECURRING_CONFIG.SHEET.DATA_START_ROW, 9, 1000, 1)
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([RECURRING_CONFIG.DEFAULTS.STATUS_ACTIVE, RECURRING_CONFIG.DEFAULTS.STATUS_INACTIVE], true)
    .setAllowInvalid(false)
    .build()
  statusRange.setDataValidation(statusRule)

  log('Recurring items sheet setup complete')
}

export const calculateNextDueDate = (startDate: Date, frequency: string, currentDate: Date = new Date()): Date => {
  const nextDue = new Date(startDate)

  while (nextDue <= currentDate) {
    switch (frequency) {
      case RECURRING_CONFIG.FREQUENCIES.WEEKLY:
        nextDue.setDate(nextDue.getDate() + 7)
        break
      case RECURRING_CONFIG.FREQUENCIES.BI_WEEKLY:
        nextDue.setDate(nextDue.getDate() + 14)
        break
      case RECURRING_CONFIG.FREQUENCIES.MONTHLY:
        nextDue.setMonth(nextDue.getMonth() + 1)
        break
      case RECURRING_CONFIG.FREQUENCIES.SEMI_ANNUAL:
        nextDue.setMonth(nextDue.getMonth() + 6)
        break
      case RECURRING_CONFIG.FREQUENCIES.ANNUAL:
        nextDue.setFullYear(nextDue.getFullYear() + 1)
        break
      default:
        throw new Error(`Unknown frequency: ${frequency}`)
    }
  }

  return nextDue
}

export const getRecurringItems = (): RecurringItem[] => {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(RECURRING_CONFIG.SHEET.NAME)

  if (!sheet) {
    log('Recurring sheet not found, returning empty array')
    return []
  }

  const lastRow = sheet.getLastRow()
  if (lastRow <= RECURRING_CONFIG.SHEET.HEADER_ROW) {
    return []
  }

  const dataRange = sheet.getRange(
    RECURRING_CONFIG.SHEET.DATA_START_ROW,
    1,
    lastRow - RECURRING_CONFIG.SHEET.HEADER_ROW,
    9
  )
  const values = dataRange.getValues()

  return values
    .filter(row => row[0] && row[1] && row[3]) // Must have description, amount, and frequency
    .map(row => ({
      description: row[0] as string,
      amount: row[1] as number,
      category: row[2] as string,
      frequency: row[3] as string,
      startDate: row[4] as Date,
      endDate: row[5] as Date | undefined,
      splitAmount: row[6] as boolean,
      nextDue: row[7] as Date,
      status: row[8] as string,
    }))
}

export const updateNextDueDates = () => {
  const items = getRecurringItems()
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(RECURRING_CONFIG.SHEET.NAME)

  if (!sheet) {
    throw new Error(`Sheet "${RECURRING_CONFIG.SHEET.NAME}" not found`)
  }

  items.forEach((item, index) => {
    if (item.status === RECURRING_CONFIG.DEFAULTS.STATUS_ACTIVE) {
      const nextDue = calculateNextDueDate(item.startDate, item.frequency)
      const rowIndex = RECURRING_CONFIG.SHEET.DATA_START_ROW + index
      sheet.getRange(rowIndex, 7).setValue(nextDue) // Column G is Next Due
    }
  })

  log('Updated next due dates for recurring items')
}

export const getItemsDueInMonth = (targetMonth: number, targetYear: number): RecurringItem[] => {
  const items = getRecurringItems()

  return items.filter(item => {
    if (item.status !== RECURRING_CONFIG.DEFAULTS.STATUS_ACTIVE) {
      return false
    }

    // Check if item is due in the target month/year
    const checkDate = new Date(item.startDate)
    while (checkDate <= new Date(targetYear, targetMonth + 11, 31)) {
      // End of target year
      if (checkDate.getMonth() === targetMonth && checkDate.getFullYear() === targetYear) {
        return true
      }

      // Calculate next occurrence
      switch (item.frequency) {
        case RECURRING_CONFIG.FREQUENCIES.WEEKLY:
          checkDate.setDate(checkDate.getDate() + 7)
          break
        case RECURRING_CONFIG.FREQUENCIES.BI_WEEKLY:
          checkDate.setDate(checkDate.getDate() + 14)
          break
        case RECURRING_CONFIG.FREQUENCIES.MONTHLY:
          checkDate.setMonth(checkDate.getMonth() + 1)
          break
        case RECURRING_CONFIG.FREQUENCIES.SEMI_ANNUAL:
          checkDate.setMonth(checkDate.getMonth() + 6)
          break
        case RECURRING_CONFIG.FREQUENCIES.ANNUAL:
          checkDate.setFullYear(checkDate.getFullYear() + 1)
          break
      }
    }

    return false
  })
}
