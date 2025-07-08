import { log } from './Logger'

export const createDebtToIncomePieChart = () => {
  const sheetName = 'Monthly'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(sheetName)
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`)

  // Get the calculated financial summary data from C18:F21
  const estimatedEarnings = sheet.getRange('F18').getValue()
  const estimatedExpenses = Math.abs(sheet.getRange('F19').getValue()) // Make positive
  const investableFunds = sheet.getRange('F20').getValue()
  const debtToIncomeRatio = sheet.getRange('F21').getValue()

  log(`Creating Debt-to-Income Chart:`)
  log(`Earnings: $${estimatedEarnings}`)
  log(`Expenses: $${estimatedExpenses}`)
  log(`Investable: $${investableFunds}`)
  log(`D/I Ratio: ${debtToIncomeRatio}`)

  // Create the data for the pie chart
  const chartData = [
    ['Category', 'Amount'],
    ['Expenses', estimatedExpenses],
    ['Investable Funds', investableFunds]
  ]

  // Write the data to a temporary range
  const tempRange = sheet.getRange('Z1:AA3')
  tempRange.setValues(chartData)

  // Create a new chart
  const chartBuilder = sheet.newChart()
  chartBuilder
    .setChartType(Charts.ChartType.PIE)
    .addRange(tempRange)
    .setPosition(5, 25, 0, 0) // Position the chart to the right of your expense chart
    .setOption('title', 'Income Allocation')
    .setOption('pieSliceText', 'percentage')
    .setOption('legend', { position: 'bottom' })
    .setOption('colors', ['#FF6B6B', '#4ECDC4']) // Red for expenses, teal for investable
    .setOption('pieSliceBorderColor', 'white')
    .setOption('pieSliceBorderWidth', 2)

  const chart = chartBuilder.build()
  sheet.insertChart(chart)

  log('Debt-to-Income pie chart created successfully!')
}