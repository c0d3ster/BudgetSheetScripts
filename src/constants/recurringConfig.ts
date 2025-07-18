// Recurring Income/Expense Configuration
export const RECURRING_CONFIG = {
  // Frequency options for dropdown
  FREQUENCIES: {
    WEEKLY: 'Weekly',
    BI_WEEKLY: 'Bi-weekly',
    MONTHLY: 'Monthly',
    SEMI_ANNUAL: 'Semi-annual',
    ANNUAL: 'Annual',
  } as const,

  // Column positions in the recurring data sheet
  COLUMNS: {
    DESCRIPTION: 'A',
    AMOUNT: 'B',
    CATEGORY: 'C',
    FREQUENCY: 'D',
    START_DATE: 'E',
    END_DATE: 'F',
    SPLIT_AMOUNT: 'G',
    NEXT_DUE: 'H',
    STATUS: 'I',
  },

  // Default values
  DEFAULTS: {
    STATUS_ACTIVE: 'Active',
    STATUS_INACTIVE: 'Inactive',
  },

  // Sheet configuration
  SHEET: {
    NAME: 'Recurring',
    HEADER_ROW: 1,
    DATA_START_ROW: 2,
  },

  // Budgeting behavior configuration
  BUDGETING: {
    // For these frequencies, split the amount across the period
    SPLIT_FREQUENCIES: ['SEMI_ANNUAL', 'ANNUAL'],
    // For these frequencies, show the full amount in the due month
    FULL_AMOUNT_FREQUENCIES: ['WEEKLY', 'BI_WEEKLY', 'MONTHLY'],
  },
}

export type FrequencyType = (typeof RECURRING_CONFIG.FREQUENCIES)[keyof typeof RECURRING_CONFIG.FREQUENCIES]
