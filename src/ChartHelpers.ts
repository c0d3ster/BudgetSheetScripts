import { CHART_CONFIG, SHEET_CONFIG, COLOR_SCHEMES, ColorScheme } from './constants'
import { log, logError } from './Logger'

export const storeChartInformation = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  // Clear previous chart info (X6:Y15 to avoid debug mode area and logs)
  sheet.getRange('X6:Y15').clearContent()

  const charts = sheet.getCharts()

  charts.forEach((chart: GoogleAppsScript.Spreadsheet.EmbeddedChart) => {
    const ranges = chart.getRanges()
    if (ranges.length > 0) {
      ranges.forEach(range => {
        const rangeNotation = range.getA1Notation()

        // Check if this is the earnings chart
        const earningsDataRange = sheet.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).getValue()
        if (rangeNotation.includes(earningsDataRange)) {
          sheet.getRange(CHART_CONFIG.EARNINGS.LABEL_CELL).setValue(CHART_CONFIG.EARNINGS.LABEL)
          log(`Earnings Chart found using range: ${earningsDataRange}`)
        }

        // Check if this is the expense chart
        const expenseDataRange = sheet.getRange(CHART_CONFIG.EXPENSE.DATA_RANGE_CELL).getValue()
        if (rangeNotation.includes(expenseDataRange)) {
          sheet.getRange(CHART_CONFIG.EXPENSE.LABEL_CELL).setValue(CHART_CONFIG.EXPENSE.LABEL)
          log(`Expense Chart found using range: ${expenseDataRange}`)
        }

        // Check if this is the investment plan chart
        if (rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE)) {
          sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.LABEL_CELL).setValue(CHART_CONFIG.INVESTMENT_PLAN.LABEL)
          log(`Investment Chart found using range: ${CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE}`)
        }
      })
    }
  })

  log('Chart information stored in columns U and V')
}

export const setupDataRangeCells = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  // Clear previous chart info (X6:Y15 to avoid debug mode area and logs)
  sheet.getRange('X6:Y15').clearContent()

  // Set up the chart info structure
  sheet.getRange(CHART_CONFIG.EARNINGS.LABEL_CELL).setValue(CHART_CONFIG.EARNINGS.LABEL)
  sheet.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).setValue(CHART_CONFIG.EARNINGS.DEFAULT_DATA_RANGE)

  sheet.getRange(CHART_CONFIG.EXPENSE.LABEL_CELL).setValue(CHART_CONFIG.EXPENSE.LABEL)
  sheet.getRange(CHART_CONFIG.EXPENSE.DATA_RANGE_CELL).setValue(CHART_CONFIG.EXPENSE.DEFAULT_DATA_RANGE)

  sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.LABEL_CELL).setValue(CHART_CONFIG.INVESTMENT_PLAN.LABEL)
  sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.DATA_RANGE_CELL).setValue(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE)

  // Now try to find actual charts and log which ones are found
  const charts = sheet.getCharts()
  const foundCharts = new Set<string>()

  charts.forEach((chart: GoogleAppsScript.Spreadsheet.EmbeddedChart) => {
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
        const expenseDataRange = sheet.getRange(CHART_CONFIG.EXPENSE.DATA_RANGE_CELL).getValue()
        if (rangeNotation.includes(expenseDataRange) && !foundCharts.has('expense')) {
          log(`Found Expense Chart using range: ${expenseDataRange}`)
          foundCharts.add('expense')
        }

        // Check if this is the investment plan chart
        if (rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE) && !foundCharts.has('investment')) {
          log(`Found Investment Chart using range: ${CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE}`)
          foundCharts.add('investment')
        }
      })
    }
  })

  log('Chart information populated with values in columns U and V')
}

export const colorPieChart = (
  sheetName: string = 'Monthly',
  dataRangeConfig: string,
  colorScheme: ColorScheme
) => {
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
    return ranges.length > 0 && ranges.some(range =>
      range.getA1Notation().includes(dataRangeConfig)
    )
  })

  if (!targetChart) {
    throw new Error(`No matching chart found for data range ${dataRangeConfig}`)
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

  // Create color array only for valid data rows
  const colorArray: string[] = []
  validRows.forEach(row => {
    let hex: string
    let t: number

    if (row.value <= median) {
      // Interpolate between low and median
      t = (row.value - minVal) / (median - minVal || 1)
      hex = interpolateColor(colorScheme.lowColor, colorScheme.medColor, t)
    } else {
      // Interpolate between median and high
      t = (row.value - median) / (maxVal - median || 1)
      hex = interpolateColor(colorScheme.medColor, colorScheme.highColor, t)
    }

    colorArray.push(hex)
  })

  // Determine chart config based on data range
  let chartConfig: any

  // Get data ranges from cells
  const earningsDataRange = sheet.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).getValue()
  const expenseDataRange = sheet.getRange(CHART_CONFIG.EXPENSE.DATA_RANGE_CELL).getValue()

  if (dataRangeConfig.includes(earningsDataRange)) {
    chartConfig = CHART_CONFIG.EARNINGS
  } else if (dataRangeConfig.includes(expenseDataRange)) {
    chartConfig = CHART_CONFIG.EXPENSE
  } else if (dataRangeConfig.includes(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE)) {
    chartConfig = CHART_CONFIG.INVESTMENT_PLAN
  } else {
    // Default fallback
    chartConfig = { WIDTH: 350, HEIGHT: 231, PIE_SLICE_TEXT: 'value', LEGEND_POSITION: 'auto', FONT_SIZE: 10 }
  }

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
    .setOption('pieSliceText', chartConfig.PIE_SLICE_TEXT)
    .setOption('legend', { position: chartConfig.LEGEND_POSITION, textStyle: { fontSize: chartConfig.FONT_SIZE } })
    .setOption('colors', colorArray)
    .setOption('pieSliceBorderColor', 'white')
    .setOption('pieSliceBorderWidth', 2)
    .setOption('width', chartConfig.WIDTH)
    .setOption('height', chartConfig.HEIGHT)

  const newChart = chartBuilder.build()
  sheet.insertChart(newChart)
  sheet.removeChart(targetChart)
}

// Convenience functions for backward compatibility
export const colorPieChartRedToYellow = () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  const expenseDataRange = sheet?.getRange(CHART_CONFIG.EXPENSE.DATA_RANGE_CELL).getValue()
  if (expenseDataRange) {
    colorPieChart(SHEET_CONFIG.MONTHLY_SHEET, expenseDataRange, COLOR_SCHEMES.RED_TO_YELLOW)
  }
}

export const colorPieChartGreenToLightGreen = () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG.MONTHLY_SHEET)
  const earningsDataRange = sheet?.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).getValue()
  if (earningsDataRange) {
    colorPieChart(SHEET_CONFIG.MONTHLY_SHEET, earningsDataRange, COLOR_SCHEMES.GREEN_TO_LIGHT_GREEN)
  }
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
  updateExpenseDataRange(CHART_CONFIG.EXPENSE.DEFAULT_DATA_RANGE)
  log(`Reset expense data range to default: ${CHART_CONFIG.EXPENSE.DEFAULT_DATA_RANGE}`)
}

export const resetInvestmentPlanDataRange = () => {
  updateInvestmentPlanDataRange(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE)
  log(`Reset investment plan data range to default: ${CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE}`)
} 