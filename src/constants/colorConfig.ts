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
    lowColor: [0xe8, 0xf0, 0xd9], // #E8F0D9 - light green-yellow (low)
    medColor: [0xd9, 0xea, 0xd3], // #D9EAD3 - original green (mid)
    highColor: [0xb6, 0xd7, 0xa8], // #B6D7A8 - darker green (high)
  },
}
