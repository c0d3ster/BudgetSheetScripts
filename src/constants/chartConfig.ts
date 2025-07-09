// Chart Configuration
export const CHART_CONFIG = {
  EARNINGS: {
    ANCHOR_CELL: "C19",
    DATA_RANGE_CELL: "Y6", // Cell containing the data range
    DEFAULT_DATA_RANGE: "AB5:AC24", // Default earnings data range
    SOURCE_RANGE: "G5:G16", // Source range where user edits earnings data
    LABEL_CELL: "X6",
    LABEL: "Earnings Chart",
    WIDTH: 375,
    HEIGHT: 210,
    PIE_SLICE_TEXT: "value", // Show dollar amounts in slices
    LEGEND_POSITION: "auto", // Auto legend position
    FONT_SIZE: 10,
  },
  EXPENSE: {
    ANCHOR_CELL: "H19",
    DATA_RANGE_CELL: "Y7", // Cell containing the data range
    DEFAULT_DATA_RANGE: "AE5:AF24", // Default expense data range
    SOURCE_RANGE: "L5:L16,Q5:Q16", // Source ranges where user edits expense data (fixed + variable)
    LABEL_CELL: "X7",
    LABEL: "Expense Chart",
    WIDTH: 375,
    HEIGHT: 210,
    PIE_SLICE_TEXT: "value", // Show dollar amounts in slices
    LEGEND_POSITION: "auto", // Auto legend position
    FONT_SIZE: 10,
  },
  INVESTMENT_PLAN: {
    DEFAULT_DATA_RANGE: "K46:L52", // Default investment plan data range
    DATA_RANGE_CELL: "Y8", // Cell containing the data range
    LABEL_CELL: "X8",
    LABEL: "Investment Plan Chart",
    WIDTH: 375,
    HEIGHT: 350,
    PIE_SLICE_TEXT: "value", // Show dollar amounts in slices
    LEGEND_POSITION: "bottom", // Use bottom legend for investment plan
    FONT_SIZE: 10,
  }
} 