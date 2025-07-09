// Color Configuration for Charts
export interface ColorScheme {
  lowColor: number[] // [r, g, b]
  medColor: number[] // [r, g, b]
  highColor: number[] // [r, g, b]
}

// Predefined color schemes for pie charts
export const COLOR_SCHEMES = {
  RED_TO_YELLOW: {
    lowColor: [0xFF, 0xFF, 0xCC], // #FFFFCC - light yellow
    medColor: [0xFF, 0xD5, 0x80], // #FFD580 - orange
    highColor: [0xF1, 0xCC, 0xCC] // #F1CCCC - red
  },
  GREEN_TO_LIGHT_GREEN: {
    lowColor: [0xAD, 0xFF, 0x2F], // #ADFF2F - green yellow (more yellow)
    medColor: [0x7C, 0xFC, 0x7C], // #7CFC7C - light lime green (more pastel)
    highColor: [0x32, 0xCD, 0x32] // #32CD32 - lime green (lighter but still most green)
  }
} 