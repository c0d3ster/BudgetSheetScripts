import { getItemsDueInMonth, RecurringItem } from '@/managers'
import { RECURRING_CONFIG } from '@/constants'
import { log } from '@/Logger'

export const populateMonthlyFromRecurring = (targetMonth: number, targetYear: number) => {
  const recurringItems = getItemsDueInMonth(targetMonth, targetYear)
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const monthlySheet = ss.getSheetByName('Monthly')

  if (!monthlySheet) {
    throw new Error('Monthly sheet not found')
  }

  // Process items based on their individual split preference
  const processedItems = recurringItems.map(item => {
    const shouldSplit = item.splitAmount && RECURRING_CONFIG.BUDGETING.SPLIT_FREQUENCIES.includes(item.frequency)

    if (shouldSplit) {
      // Split semi-annual and annual expenses across months
      const monthsInPeriod = item.frequency === 'Semi-annual' ? 6 : 12
      return {
        ...item,
        amount: item.amount / monthsInPeriod,
        description: `${item.description} (${item.frequency.toLowerCase()} - split)`,
      }
    }

    return item
  })

  // Group items by your existing structure
  const earningsItems = processedItems.filter(item => item.amount > 0)
  const fixedExpenseItems = processedItems.filter(
    item =>
      item.amount < 0 &&
      ['Housing', 'Utilities', 'Insurance', 'Subscriptions', 'Transportation'].includes(item.category)
  )
  const variableExpenseItems = processedItems.filter(
    item =>
      item.amount < 0 &&
      !['Housing', 'Utilities', 'Insurance', 'Subscriptions', 'Transportation'].includes(item.category)
  )

  log(
    `Found ${earningsItems.length} recurring earnings, ${fixedExpenseItems.length} fixed expenses, and ${variableExpenseItems.length} variable expenses for ${targetMonth + 1}/${targetYear}`
  )

  // Add earnings items to G5:G16 range
  earningsItems.forEach((item, index) => {
    const row = 5 + index // Starting at row 5 for earnings
    if (row <= 16) {
      // Stay within G5:G16 range
      monthlySheet.getRange(row, 7).setValue(item.description) // Column G
      monthlySheet.getRange(row, 8).setValue(Math.abs(item.amount)) // Column H
    }
  })

  // Add fixed expense items to L5:L16 range
  fixedExpenseItems.forEach((item, index) => {
    const row = 5 + index // Starting at row 5 for fixed expenses
    if (row <= 16) {
      // Stay within L5:L16 range
      monthlySheet.getRange(row, 12).setValue(item.description) // Column L
      monthlySheet.getRange(row, 13).setValue(Math.abs(item.amount)) // Column M
    }
  })

  // Add variable expense items to Q5:Q16 range
  variableExpenseItems.forEach((item, index) => {
    const row = 5 + index // Starting at row 5 for variable expenses
    if (row <= 16) {
      // Stay within Q5:Q16 range
      monthlySheet.getRange(row, 17).setValue(item.description) // Column Q
      monthlySheet.getRange(row, 18).setValue(Math.abs(item.amount)) // Column R
    }
  })

  log(`Populated monthly sheet with ${processedItems.length} recurring items using existing structure`)
}

export const getRecurringSummary = (targetMonth: number, targetYear: number) => {
  const recurringItems = getItemsDueInMonth(targetMonth, targetYear)

  const summary = {
    totalEarnings: 0,
    totalFixedExpenses: 0,
    totalVariableExpenses: 0,
    netAmount: 0,
    itemCount: recurringItems.length,
    categories: new Set<string>(),
  }

  recurringItems.forEach(item => {
    summary.categories.add(item.category)
    if (item.amount > 0) {
      summary.totalEarnings += item.amount
    } else {
      const amount = Math.abs(item.amount)
      if (['Housing', 'Utilities', 'Insurance', 'Subscriptions', 'Transportation'].includes(item.category)) {
        summary.totalFixedExpenses += amount
      } else {
        summary.totalVariableExpenses += amount
      }
    }
  })

  summary.netAmount = summary.totalEarnings - summary.totalFixedExpenses - summary.totalVariableExpenses

  return {
    ...summary,
    categories: Array.from(summary.categories),
  }
}

export const validateRecurringItem = (item: Partial<RecurringItem>): string[] => {
  const errors: string[] = []

  if (!item.description?.trim()) {
    errors.push('Description is required')
  }

  if (typeof item.amount !== 'number' || isNaN(item.amount)) {
    errors.push('Amount must be a valid number')
  }

  if (!item.frequency) {
    errors.push('Frequency is required')
  }

  if (!item.startDate) {
    errors.push('Start date is required')
  }

  if (item.endDate && item.startDate && item.endDate <= item.startDate) {
    errors.push('End date must be after start date')
  }

  return errors
}

export const clearMonthlyDataForRecurring = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const monthlySheet = ss.getSheetByName('Monthly')

  if (!monthlySheet) {
    throw new Error('Monthly sheet not found')
  }

  // Clear earnings section (G5:G16)
  monthlySheet.getRange('G5:G16').clearContent()
  monthlySheet.getRange('H5:H16').clearContent()

  // Clear fixed expenses section (L5:L16)
  monthlySheet.getRange('L5:L16').clearContent()
  monthlySheet.getRange('M5:M16').clearContent()

  // Clear variable expenses section (Q5:Q16)
  monthlySheet.getRange('Q5:Q16').clearContent()
  monthlySheet.getRange('R5:R16').clearContent()

  log('Cleared existing data in preparation for recurring items')
}

export const previewRecurringItems = (targetMonth: number, targetYear: number) => {
  const recurringItems = getItemsDueInMonth(targetMonth, targetYear)

  const preview = {
    earnings: recurringItems.filter(item => item.amount > 0),
    fixedExpenses: recurringItems.filter(
      item =>
        item.amount < 0 &&
        ['Housing', 'Utilities', 'Insurance', 'Subscriptions', 'Transportation'].includes(item.category)
    ),
    variableExpenses: recurringItems.filter(
      item =>
        item.amount < 0 &&
        !['Housing', 'Utilities', 'Insurance', 'Subscriptions', 'Transportation'].includes(item.category)
    ),
    totalEarnings: 0,
    totalFixedExpenses: 0,
    totalVariableExpenses: 0,
  }

  preview.earnings.forEach(item => (preview.totalEarnings += item.amount))
  preview.fixedExpenses.forEach(item => (preview.totalFixedExpenses += Math.abs(item.amount)))
  preview.variableExpenses.forEach(item => (preview.totalVariableExpenses += Math.abs(item.amount)))

  log(`Preview for ${targetMonth + 1}/${targetYear}:`)
  log(`- Earnings: ${preview.earnings.length} items, $${preview.totalEarnings}`)
  log(`- Fixed Expenses: ${preview.fixedExpenses.length} items, $${preview.totalFixedExpenses}`)
  log(`- Variable Expenses: ${preview.variableExpenses.length} items, $${preview.totalVariableExpenses}`)

  return preview
}

export const populateMonthlyFromRecurringWithClear = (targetMonth: number, targetYear: number) => {
  // First clear existing data
  clearMonthlyDataForRecurring()

  // Then populate with recurring items
  populateMonthlyFromRecurring(targetMonth, targetYear)

  log(`Completed full population of recurring items for ${targetMonth + 1}/${targetYear}`)
}

/*
Example Usage:

// Setup recurring items in the "Recurring" tab:
// | Description | Amount | Category | Frequency | Start Date | End Date | Split Amount | Next Due | Status |
// |-------------|--------|----------|-----------|------------|----------|-------------|----------|--------|
// | Salary      | 5000   | Salary   | Bi-weekly | 2024-01-05 |          | No          | 2024-01-19| Active |
// | Car Insurance| -1200  | Insurance| Annual    | 2024-01-01 |          | Yes         | 2025-01-01| Active |
// | Netflix     | -15    | Subscriptions| Monthly| 2024-01-01 |          | No          | 2024-02-01| Active |

// Populate monthly sheet with individual split preferences:
populateMonthlyFromRecurringWithClear(0, 2024)
// Result: 
// - Car insurance shows as $100/month (1200/12) because "Split Amount" = Yes
// - Netflix shows as $15 in due month because "Split Amount" = No (monthly items don't split anyway)
*/
