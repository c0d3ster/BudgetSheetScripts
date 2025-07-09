import { DEBUG_CONFIG } from '@/constants'
import { isDebugModeEnabled } from '@/Debug'

// Logger utility for Google Apps Script
// Manages logging in U20 with aggregated log feed

export const log = (message: string) => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    Logger.log('Monthly sheet not found for logging')
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
  const currentLogs = logCell.getValue() || ''

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
    sheet.getRange(DEBUG_CONFIG.LOG_CELL).clearContent()
  }
}

export const logError = (error: unknown, context = ''): void => {
  let errorMessage: string

  if (typeof error === 'string') {
    errorMessage = context ? `${context}: ${error}` : `ERROR: ${error}`
  } else if (error instanceof Error) {
    errorMessage = context ? `${context}: ${error.message}` : `ERROR: ${error.message}`
  } else {
    errorMessage = context ? `${context}: ${String(error)}` : `ERROR: ${String(error)}`
  }

  log(errorMessage)
}

/**
 * Log deployment information for verification
 * This helps confirm when changes are actually deployed
 */
export const logDeployment = (): void => {
  const timestamp = new Date().toISOString()
  const version = `v${Date.now()}`

  // Log to Google Apps Script logs for verification
  Logger.log(`🚀 Deployment verified: ${version} at ${timestamp}`)

  // You can also add this to a cell in your sheet for visual verification
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
    const logSheet = sheet.getSheetByName('DeploymentLog') || sheet.insertSheet('DeploymentLog')

    // Add deployment entry
    logSheet.appendRow([timestamp, version, 'Auto-deployment'])

    // Keep only last 10 entries
    const lastRow = logSheet.getLastRow()
    if (lastRow > 10) {
      logSheet.deleteRows(1, lastRow - 10)
    }
  } catch (error) {
    Logger.log('Could not write to deployment log sheet:', error)
  }
}

/**
 * Simple function to verify deployment status
 * Call this manually to check if your latest code is deployed
 */
export const verifyDeployment = (): string => {
  const timestamp = new Date().toISOString()
  const version = `v${Date.now()}`

  logDeployment()

  return `✅ Deployment verified: ${version} at ${timestamp}`
}
