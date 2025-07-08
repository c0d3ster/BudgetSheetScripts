import { DEBUG_CONFIG } from './constants'
import { isDebugModeEnabled } from './Debug'

// Logger utility for Google Apps Script
// Manages logging in U20 with aggregated log feed

export const log = (message: string) => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    console.error('Monthly sheet not found for logging')
    return
  }

  const timestamp = new Date().toLocaleTimeString()
  const logMessage = `[${timestamp}] ${message}`

  // Always log to Apps Script console for when in editor
  Logger.log(logMessage)

  // Check if debug mode is enabled
  if (!isDebugModeEnabled()) {
    return // Don't log to sheet if debug mode is off
  }

  // Get current log content
  const logCell = sheet.getRange(DEBUG_CONFIG.LOG_CELL)
  let currentLogs = logCell.getValue() || ''

  // Add new log message
  const newLogs = currentLogs + (currentLogs ? '\n' : '') + logMessage

  // Keep only the last 50 lines to prevent cell from getting too large
  const logLines = newLogs.split('\n')
  if (logLines.length > 100) {
    const recentLogs = logLines.slice(-50).join('\n')
    logCell.setValue(recentLogs)
  } else {
    logCell.setValue(newLogs)
  }
}

export const clearLogs = () => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (sheet) {
    sheet.getRange('U20').clearContent()
  }
}

export const logError = (error: unknown, context = ''): void => {
  const errorMessage = context ? `${context}: ${error instanceof Error ? error.message : String(error)}` : `ERROR: ${error instanceof Error ? error.message : String(error)}`
  log(errorMessage)
}

