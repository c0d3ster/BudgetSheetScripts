// Color Configuration for Charts
export interface ColorScheme {
  lowColor: number[] // [r, g, b]
  medColor: number[] // [r, g, b]
  highColor: number[] // [r, g, b]
}

// Predefined color schemes for pie charts
export const COLOR_SCHEMES = {
  RED_TO_YELLOW: {
    lowColor: [0xff, 0xff, 0xcc], // #FFFFCC - light yellow
    medColor: [0xff, 0xd5, 0x80], // #FFD580 - orange
    highColor: [0xf1, 0xcc, 0xcc], // #F1CCCC - red
  },
  GREEN_TO_LIGHT_GREEN: {
    lowColor: [0xad, 0xff, 0x2f], // #ADFF2F - green yellow (more yellow)
    medColor: [0x7c, 0xfc, 0x7c], // #7CFC7C - light lime green (more pastel)
    highColor: [0x32, 0xcd, 0x32], // #32CD32 - lime green (lighter but still most green)
  },
}
