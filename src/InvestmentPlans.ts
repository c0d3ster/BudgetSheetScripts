// Import investment plan data from constants
import { CHART_CONFIG, SHEET_CONFIG, INVESTMENT_PLANS_CONFIG } from './constants'
import { log, logError } from './Logger'

export const getSelectedPlan = (): string | null => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }
  const selectedPlan = sheet.getRange(SHEET_CONFIG.PLAN_DROPDOWN_CELL).getValue() as string
  if (selectedPlan === "Select a plan..." || selectedPlan === "") {
    return null
  }
  return selectedPlan
}

export const createPlanDropdown = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  const dropdownCell = sheet.getRange(SHEET_CONFIG.PLAN_DROPDOWN_CELL)
  const planNames = Object.keys(INVESTMENT_PLANS_CONFIG.PLANS)

  // Create data validation for plan dropdown
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(planNames, true)
    .setAllowInvalid(false)
    .build()

  dropdownCell.setDataValidation(rule)

  // Set default value if cell is empty
  if (!dropdownCell.getValue()) {
    dropdownCell.setValue(planNames[0]) // Set to first plan as default
  }
}

export const createInvestmentPlanPieChart = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  // Get the actual financial data
  const investableFunds = sheet.getRange(SHEET_CONFIG.INVESTABLE_FUNDS_CELL).getValue() as number

  // Get the selected plan from the dropdown
  const selectedPlan = getSelectedPlan()
  if (!selectedPlan) {
    log("No plan selected. Please select a plan from the dropdown.")
    return
  }

  const plans = INVESTMENT_PLANS_CONFIG.PLANS
  const planData = plans[selectedPlan as keyof typeof plans]
  if (!planData) {
    log(`Plan "${selectedPlan}" not found.`)
    return
  }

  // Use imported category colors
  const categoryColors = INVESTMENT_PLANS_CONFIG.CATEGORY_COLORS
  const chartData: [string, number][] = []
  let totalAllocated = 0

  // Calculate amounts for all categories
  Object.entries(planData).forEach(([category, percentage]) => {
    const calculatedAmount = (investableFunds * (percentage as number)) / 100
    const roundedAmount = Math.floor(calculatedAmount / 50) * 50
    chartData.push([category, roundedAmount])
    if (roundedAmount > 0) {
      totalAllocated += roundedAmount
    }
  })

  // Add remainder
  const remainder = investableFunds - totalAllocated
  if (remainder > 0) {
    chartData.push(['Remainder', remainder])
  }

  const dataRows = chartData

  // Separate Remainder from other categories
  const remainderRow = dataRows.find(row => row[0] === 'Remainder')
  const otherRows = dataRows.filter(row => row[0] !== 'Remainder')

  // Sort other categories by amount (highest to lowest)
  const sortedOtherRows = otherRows.sort((a, b) => b[1] - a[1])

  // Add sorted categories, then remainder at bottom
  const sortedData: [string, number][] = []
  sortedData.push(...sortedOtherRows)
  if (remainderRow) {
    sortedData.push(remainderRow)
  }

  const sortedColors: string[] = []
  for (let i = 0; i < sortedData.length; i++) {
    const category = sortedData[i][0]
    const amount = sortedData[i][1]
    // Always include a color for every row, regardless of amount
    if (amount > 0) {
      const color = categoryColors[category as keyof typeof categoryColors]
      sortedColors.push(color)
    } else {
      // Include zero-value categories with gray color
      sortedColors.push('#E0E0E0')
    }
  }

  // Write the sorted data starting at I46 (no header)
  const dataRange = sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE)
  dataRange.setValues(sortedData)

  // Add a small delay to ensure data is written before updating chart
  Utilities.sleep(100)

  const charts = sheet.getCharts()
  let targetChart = null

  charts.forEach(chart => {
    const ranges = chart.getRanges()
    if (ranges.length > 0) {
      ranges.forEach(range => {
        const rangeNotation = range.getA1Notation()
        if (rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE)) {
          targetChart = chart
        }
      })
    }
  })

  if (targetChart) {
    // Get the old chart's position
    const oldChartPosition = targetChart
    // Create a completely new chart with correct colors from start
    const newChart = createNewInvestmentChartWithSlices(sheet, sortedColors, selectedPlan, investableFunds, oldChartPosition)
    // Chart updated successfully
    // Remove the old chart after new one is created
    sheet.removeChart(targetChart)
  } else {
    log(`No chart found using ${CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE} data range. Please create a pie chart that uses ${CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE} data.`)
  }
}

export const createNewInvestmentChartWithSlices = (sheet: GoogleAppsScript.Spreadsheet.Sheet, colors: string[], selectedPlan: string, investableFunds: number, oldChartPosition: GoogleAppsScript.Spreadsheet.EmbeddedChart | null = null) => {
  // Create a new chart with colors array built in
  const chartBuilder = sheet.newChart()
  chartBuilder
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange(CHART_CONFIG.INVESTMENT_PLAN.DEFAULT_DATA_RANGE))
    .setOption('title', `${selectedPlan} ($${investableFunds.toLocaleString()} Investable)`)
    .setOption('pieSliceText', 'value')
    .setOption('legend', { position: 'bottom', textStyle: { fontSize: CHART_CONFIG.INVESTMENT_PLAN.FONT_SIZE } })
    .setOption('colors', colors)
    .setOption('pieSliceBorderColor', 'white')
    .setOption('pieSliceBorderWidth', 2)
    .setOption('width', CHART_CONFIG.INVESTMENT_PLAN.WIDTH)
    .setOption('height', CHART_CONFIG.INVESTMENT_PLAN.HEIGHT)

  // Use old chart position if available, otherwise default position
  if (oldChartPosition) {
    const containerInfo = oldChartPosition.getContainerInfo()
    chartBuilder.setPosition(
      containerInfo.getAnchorRow(),
      containerInfo.getAnchorColumn(),
      containerInfo.getOffsetX(),
      containerInfo.getOffsetY()
    )
  } else {
    chartBuilder.setPosition(5, 5, 0, 0) // Default position
  }

  const newChart = chartBuilder.build()
  sheet.insertChart(newChart)
  return newChart
}
