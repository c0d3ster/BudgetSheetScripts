import { DEBUG_CONFIG } from './constants'
import { logError } from './Logger'

// Debug mode setup and management

export const setupDebugMode = () => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    logError('Monthly sheet not found for debug setup')
    return
  }

  // Set up debug mode label
  const labelCell = sheet.getRange(DEBUG_CONFIG.LABEL_CELL)
  labelCell.setValue('Debug Mode:')

  // Set up debug mode dropdown
  const valueCell = sheet.getRange(DEBUG_CONFIG.VALUE_CELL)
  valueCell.clear()

  // Create data validation for Enabled/Disabled dropdown
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Enabled', 'Disabled'], true)
    .setAllowInvalid(false)
    .build()

  valueCell.setDataValidation(rule)
  valueCell.setValue('Disabled') // Default to debug off

  // Hide debug columns when debug is off
  toggleDebugVisibility()
}

export const isDebugModeEnabled = () => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    return false
  }

  const debugValue = sheet.getRange(DEBUG_CONFIG.VALUE_CELL).getValue()
  return debugValue === 'Enabled'
}

export const toggleDebugVisibility = () => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    return
  }

  const isDebugEnabled = isDebugModeEnabled()

  const images = sheet.getImages()

  if (images.length > 0) {
    const img = images[0] // Use the first image

    if (isDebugEnabled) {
      // Move image off-screen (row 100, col 1)
      img.setAnchorCell(sheet.getRange(100, 1))
    } else {
      // Move image to cover debug area (row 3, col 23 = X3)
      img.setAnchorCell(sheet.getRange(3, 23))
    }
  }
}
