// Chart Configuration
export const CHART_CONFIG = {
  EARNINGS: {
    ANCHOR_CELL: "C19",
    DATA_RANGE_CELL: "Y6", // Cell containing the data range
    DEFAULT_DATA_RANGE: "AB5:AC24", // Default earnings data range
    LABEL_CELL: "X6",
    LABEL: "Earnings Chart",
    WIDTH: 377,
    HEIGHT: 210,
    PIE_SLICE_TEXT: "value", // Show dollar amounts in slices
    LEGEND_POSITION: "auto", // Auto legend position
    FONT_SIZE: 10,
  },
  EXPENSES: {
    ANCHOR_CELL: "H19",
    DATA_RANGE_CELL: "Y7", // Cell containing the data range
    DEFAULT_DATA_RANGE: "AE5:AF24", // Default expense data range
    LABEL_CELL: "X7",
    LABEL: "Expenses Chart",
    WIDTH: 377,
    HEIGHT: 210,
    PIE_SLICE_TEXT: "value", // Show dollar amounts in slices
    LEGEND_POSITION: "auto", // Auto legend position
    FONT_SIZE: 10,
  },
  INVESTMENT_PLANS: {
    ANCHOR_CELL: "D37",
    DEFAULT_DATA_RANGE: "K45:L51", // Default investment plan data range
    DATA_RANGE_CELL: "Y8", // Cell containing the data range
    LABEL_CELL: "X8",
    LABEL: "Investment Plans Chart",
    WIDTH: 402,
    HEIGHT: 350,
    PIE_SLICE_TEXT: "value", // Show dollar amounts in slices
    LEGEND_POSITION: "bottom", // Use bottom legend for investment plan
    FONT_SIZE: 12,
  }
}

// Source range configuration for trigger detection
export const SOURCE_RANGE_CONFIG = {
  EARNINGS: {
    LABEL_CELL: "X12",
    VALUE_CELL: "Y12",
    DEFAULT_RANGE: "G5:G16",
    LABEL: "Earnings Range"
  },
  FIXED_EXPENSES: {
    LABEL_CELL: "X13",
    VALUE_CELL: "Y13",
    DEFAULT_RANGE: "L5:L16",
    LABEL: "Fixed Expenses"
  },
  VARIABLE_EXPENSES: {
    LABEL_CELL: "X14",
    VALUE_CELL: "Y14",
    DEFAULT_RANGE: "Q5:Q16",
    LABEL: "Variable Expenses"
  }
} 