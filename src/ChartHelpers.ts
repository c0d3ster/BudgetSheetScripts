import { CHART_CONFIG, SHEET_CONFIG } from './constants'
import { log, logError } from './Logger'

export const storeChartInformation = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  // Clear previous chart info (U6:V20 to avoid debug mode area)
  sheet.getRange('U6:V20').clearContent()

  const charts = sheet.getCharts()

  charts.forEach((chart: GoogleAppsScript.Spreadsheet.EmbeddedChart) => {
    const ranges = chart.getRanges()
    if (ranges.length > 0) {
      ranges.forEach(range => {
        const rangeNotation = range.getA1Notation()

        // Check if this is the earnings chart (when implemented)
        if (rangeNotation.includes(CHART_CONFIG.EARNINGS.DATA_RANGE) && CHART_CONFIG.EARNINGS.DATA_RANGE !== 'TBD') {
          sheet.getRange(CHART_CONFIG.EARNINGS.LABEL_CELL).setValue(CHART_CONFIG.EARNINGS.LABEL)
          sheet.getRange(CHART_CONFIG.EARNINGS.ID_CELL).setValue(chart.getChartId())
          log(`Earnings Chart ID: ${chart.getChartId()}`)
        }

        // Check if this is the expense chart
        if (rangeNotation.includes(CHART_CONFIG.EXPENSE.DATA_RANGE)) {
          sheet.getRange(CHART_CONFIG.EXPENSE.LABEL_CELL).setValue(CHART_CONFIG.EXPENSE.LABEL)
          sheet.getRange(CHART_CONFIG.EXPENSE.ID_CELL).setValue(chart.getChartId())
          log(`Expense Chart ID: ${chart.getChartId()}`)
        }

        // Check if this is the investment plan chart
        if (rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLAN.DATA_RANGE)) {
          sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.LABEL_CELL).setValue(CHART_CONFIG.INVESTMENT_PLAN.LABEL)
          sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.ID_CELL).setValue(chart.getChartId())
          log(`Investment Chart ID: ${chart.getChartId()}`)
        }
      })
    }
  })

  log('Chart information stored in columns U and V')
}

export const populateChartInfoWithValues = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  // Clear previous chart info (U6:V20 to avoid debug mode area)
  sheet.getRange('U6:V20').clearContent()

  // Set up the chart info structure
  sheet.getRange(CHART_CONFIG.EARNINGS.LABEL_CELL).setValue(CHART_CONFIG.EARNINGS.LABEL)
  sheet.getRange(CHART_CONFIG.EARNINGS.ID_CELL).setValue('TBD - Earnings chart not implemented yet')

  sheet.getRange(CHART_CONFIG.EXPENSE.LABEL_CELL).setValue(CHART_CONFIG.EXPENSE.LABEL)
  sheet.getRange(CHART_CONFIG.EXPENSE.ID_CELL).setValue('Expense Chart ID will be populated when chart is found')

  sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.LABEL_CELL).setValue(CHART_CONFIG.INVESTMENT_PLAN.LABEL)
  sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.ID_CELL).setValue('Investment Plan Chart ID will be populated when chart is found')

  // Now try to find actual charts and update their IDs
  const charts = sheet.getCharts()

  charts.forEach((chart: GoogleAppsScript.Spreadsheet.EmbeddedChart) => {
    const ranges = chart.getRanges()
    if (ranges.length > 0) {
      ranges.forEach(range => {
        const rangeNotation = range.getA1Notation()

        // Check if this is the expense chart
        if (rangeNotation.includes(CHART_CONFIG.EXPENSE.DATA_RANGE)) {
          sheet.getRange(CHART_CONFIG.EXPENSE.ID_CELL).setValue(chart.getChartId())
          log(`Found Expense Chart ID: ${chart.getChartId()}`)
        }

        // Check if this is the investment plan chart
        if (rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLAN.DATA_RANGE)) {
          sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.ID_CELL).setValue(chart.getChartId())
          log(`Found Investment Chart ID: ${chart.getChartId()}`)
        }
      })
    }
  })

  log('Chart information populated with values in columns U and V')
}

export const colorPieChartRedToYellow = () => {
  const sheetName = 'Monthly'
  const startCell = 'Y5'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  const charts = sheet.getCharts()
  if (charts.length === 0) {
    throw new Error('No charts found on the sheet')
  }

  const targetChart = charts.find(chart => {
    const ranges = chart.getRanges()
    return ranges.length && ranges[0].getCell(1, 1).getA1Notation() === startCell
  })

  if (!targetChart) {
    throw new Error('No matching chart found starting at V5')
  }

  const dataRange = targetChart.getRanges()[0]
  const dataValues = dataRange.getValues()

  // Get all valid values to calculate min/max
  const validRows = dataValues
    .map((row, i) => ({ label: row[0], value: Number(row[1]), index: i }))
    .filter(row => row.label !== '' && !isNaN(row.value) && row.value > 0)

  if (validRows.length === 0) {
    throw new Error('No valid slices found')
  }

  const values = validRows.map(row => row.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)

  // Calculate the true median
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  const interpolateColor = (color1: number[], color2: number[], t: number) => {
    // Linear interpolation between two colors
    return '#' + [0, 1, 2].map(i =>
      Math.round(color1[i] + (color2[i] - color1[i]) * t).toString(16).padStart(2, '0')
    ).join('')
  }

  // Colors as [r, g, b] - using #FFFFCC as the lightest
  const lowColor = [0xFF, 0xFF, 0xCC] // #FFFFCC - light yellow
  const medColor = [0xFF, 0xD5, 0x80] // #FFD580 - orange
  const highColor = [0xF1, 0xCC, 0xCC] // #F1CCCC - red

  // Create color array only for valid data rows
  const colorArray: string[] = []
  validRows.forEach(row => {
    let hex: string
    let t: number
    let colorStep: string

    if (row.value <= median) {
      // Interpolate between low and median
      t = (row.value - minVal) / (median - minVal || 1)
      hex = interpolateColor(lowColor, medColor, t)
      colorStep = 'low-median'
    } else {
      // Interpolate between median and high
      t = (row.value - median) / (maxVal - median || 1)
      hex = interpolateColor(medColor, highColor, t)
      colorStep = 'median-high'
    }

    colorArray.push(hex)
  })

  // Update the chart with the new colors
  const chartBuilder = sheet.newChart()
  chartBuilder
    .setChartType(Charts.ChartType.PIE)
    .addRange(dataRange)
    .setPosition(
      targetChart.getContainerInfo().getAnchorRow(),
      targetChart.getContainerInfo().getAnchorColumn(),
      targetChart.getContainerInfo().getOffsetX(),
      targetChart.getContainerInfo().getOffsetY()
    )
    .setOption('pieSliceText', 'value')
    .setOption('legend', { position: 'bottom' })
    .setOption('colors', colorArray)
    .setOption('pieSliceBorderColor', 'white')
    .setOption('pieSliceBorderWidth', 2)

  const newChart = chartBuilder.build()
  sheet.insertChart(newChart)
  sheet.removeChart(targetChart)
} 