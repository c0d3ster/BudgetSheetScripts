import { CHART_CONFIG, SHEET_CONFIG, COLOR_SCHEMES, ColorScheme, ChartConfig } from './constants'
import { log, logError } from './Logger'

export const colorPieChart = (sheetName: string = 'Monthly', dataRangeConfig: string, colorScheme: ColorScheme) => {
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
    return ranges.length > 0 && ranges.some(range => range.getA1Notation().includes(dataRangeConfig))
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
    return (
      '#' +
      [0, 1, 2]
        .map(i =>
          Math.round(color1[i] + (color2[i] - color1[i]) * t)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
    )
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

  log(
    `Color array length: ${colorArray.length}, Valid rows: ${validRows.length}, Total data rows: ${dataValues.length}`
  )

  // Determine chart config based on data range
  let chartConfig: ChartConfig

  // Get data ranges from cells
  const earningsDataRange = sheet.getRange(CHART_CONFIG.EARNINGS.DATA_RANGE_CELL).getValue()
  const expenseDataRange = sheet.getRange(CHART_CONFIG.EXPENSES.DATA_RANGE_CELL).getValue()

  if (dataRangeConfig.includes(earningsDataRange)) {
    chartConfig = CHART_CONFIG.EARNINGS
  } else if (dataRangeConfig.includes(expenseDataRange)) {
    chartConfig = CHART_CONFIG.EXPENSES
  } else if (dataRangeConfig.includes(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE)) {
    chartConfig = CHART_CONFIG.INVESTMENT_PLANS
  } else {
    // No matching chart configuration found
    logError(`No matching chart configuration found for data range: ${dataRangeConfig}`)
    return
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
    .setOption('legend', {
      position: chartConfig.LEGEND_POSITION,
      textStyle: { fontSize: chartConfig.FONT_SIZE },
    })
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
  const expenseDataRange = sheet?.getRange(CHART_CONFIG.EXPENSES.DATA_RANGE_CELL).getValue()
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
