// Import investment plan data from constants
import { CHART_CONFIG, INVESTMENT_PLANS_CONFIG, SHEET_CONFIG } from '@/constants'
import { log, logError } from '@/Logger'

export const getSelectedPlan = (): string | null => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }
  const selectedPlan = sheet.getRange(INVESTMENT_PLANS_CONFIG.PLAN_DROPDOWN_CELL).getValue() as string
  if (selectedPlan === 'Select a plan...' || selectedPlan === '') {
    return null
  }
  return selectedPlan
}

export const updatePlanDescription = (selectedPlan: string) => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  const plans = INVESTMENT_PLANS_CONFIG.PLANS
  const planData = plans[selectedPlan as keyof typeof plans]

  if (planData && planData.tagline && planData.description) {
    const taglineCell = sheet.getRange(INVESTMENT_PLANS_CONFIG.PLAN_TAGLINE_CELL)
    const descriptionCell = sheet.getRange(INVESTMENT_PLANS_CONFIG.PLAN_DESCRIPTION_CELL)

    taglineCell.setValue(planData.tagline)
    descriptionCell.setValue(planData.description)
    log(`Updated plan tagline and description for: ${selectedPlan}`)
  } else {
    // Clear both cells if no plan selected or plan not found
    const taglineCell = sheet.getRange(INVESTMENT_PLANS_CONFIG.PLAN_TAGLINE_CELL)
    const descriptionCell = sheet.getRange(INVESTMENT_PLANS_CONFIG.PLAN_DESCRIPTION_CELL)

    taglineCell.setValue('')
    descriptionCell.setValue('')
  }
}

export const createPlanDropdown = () => {
  const sheetName = SHEET_CONFIG.MONTHLY_SHEET
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  const dropdownCell = sheet.getRange(INVESTMENT_PLANS_CONFIG.PLAN_DROPDOWN_CELL)
  const planNames = Object.keys(INVESTMENT_PLANS_CONFIG.PLANS)

  // Create data validation for plan dropdown
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(planNames, true).setAllowInvalid(false).build()

  dropdownCell.setDataValidation(rule)

  // Set default value if cell is empty
  if (!dropdownCell.getValue()) {
    dropdownCell.setValue(planNames[0]) // Set to first plan as default
    updatePlanDescription(planNames[0]) // Update description for default plan
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
  const investableFunds = sheet.getRange(SHEET_CONFIG.INVESTABLE_FUNDS_CELL).getValue()

  // Get the selected plan from the dropdown
  const selectedPlan = getSelectedPlan()
  if (!selectedPlan) {
    log('No plan selected. Please select a plan from the dropdown.')
    updatePlanDescription('') // Clear description
    return
  }

  // Update the plan description
  updatePlanDescription(selectedPlan)

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
    // Skip the description and tagline properties
    if (category === 'description' || category === 'tagline') return

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
  const dataRange = sheet.getRange(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE)
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
        if (rangeNotation.includes(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE)) {
          targetChart = chart
        }
      })
    }
  })

  if (targetChart) {
    // Create a completely new chart with correct colors from start
    const success = createNewInvestmentChartWithSlices(sheet, sortedColors, selectedPlan, investableFunds)
    if (success) {
      // Chart updated successfully
      sheet.removeChart(targetChart)
    }
  } else {
    log(
      `No chart found using ${CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE} data range. Please create a pie chart that uses ${CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE} data.`
    )
  }
}

export const updateCurrentPlanDescription = () => {
  const selectedPlan = getSelectedPlan()
  if (selectedPlan) {
    updatePlanDescription(selectedPlan)
  } else {
    updatePlanDescription('')
  }
}

export const createNewInvestmentChartWithSlices = (
  // eslint-disable-next-line
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  colors: string[],
  selectedPlan: string,
  investableFunds: number
): boolean => {
  try {
    // Create a new chart with colors array built in
    const chartBuilder = sheet.newChart()
    chartBuilder
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange(CHART_CONFIG.INVESTMENT_PLANS.DEFAULT_DATA_RANGE))
      .setOption('title', `${selectedPlan} ($${investableFunds.toLocaleString()} Investable)`)
      .setOption('titleTextStyle', { alignment: 'center' })
      .setOption('pieSliceText', 'value')
      .setOption('legend', {
        position: 'bottom',
        textStyle: { fontSize: CHART_CONFIG.INVESTMENT_PLANS.FONT_SIZE },
      })
      .setOption('colors', colors)
      .setOption('pieSliceBorderColor', 'white')
      .setOption('pieSliceBorderWidth', 2)
      .setOption('width', CHART_CONFIG.INVESTMENT_PLANS.WIDTH)
      .setOption('height', CHART_CONFIG.INVESTMENT_PLANS.HEIGHT)

    // Use anchor cell for positioning
    const anchorCell = sheet.getRange(CHART_CONFIG.INVESTMENT_PLANS.ANCHOR_CELL)
    chartBuilder.setPosition(anchorCell.getRow(), anchorCell.getColumn(), 0, 0)

    const newChart = chartBuilder.build()
    sheet.insertChart(newChart)
    return true
  } catch (error) {
    logError(error, 'Failed to create investment plan chart')
    return false
  }
}
