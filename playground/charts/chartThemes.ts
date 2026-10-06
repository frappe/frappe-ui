// The five palettes the design's Theme group offers (espresso-2.0,
// 35795:203360): Ocean, Qualitative, Diverging, Mist, Earthy. The file
// names them and draws no swatches, so each is five steps picked to read
// as its name: one hue stepped light for Ocean and Mist, five hues apart
// for Qualitative, warm through neutral to cool for Diverging, and soil
// and leaf for Earthy.
export type ChartTheme =
  | 'ocean'
  | 'qualitative'
  | 'diverging'
  | 'mist'
  | 'earthy'

export const CHART_THEMES: Array<{ id: ChartTheme; label: string }> = [
  { id: 'ocean', label: 'Ocean' },
  { id: 'qualitative', label: 'Qualitative' },
  { id: 'diverging', label: 'Diverging' },
  { id: 'mist', label: 'Mist' },
  { id: 'earthy', label: 'Earthy' },
]

export const CHART_PALETTES: Record<ChartTheme, string[]> = {
  ocean: ['#1d6fd1', '#4a92e0', '#7fb3ea', '#aed0f3', '#d6e7f9'],
  qualitative: ['#2d87d6', '#e8792b', '#2e9e6b', '#c53d4f', '#8a63d2'],
  diverging: ['#c0392b', '#e9956f', '#d9d5c3', '#7fb1cf', '#2b6ca3'],
  mist: ['#383838', '#6b6b6b', '#9a9a9a', '#c4c4c4', '#e3e3e3'],
  earthy: ['#7a5230', '#a9743f', '#c9a66b', '#5f7a4b', '#8fa671'],
}
