// The axes the file's cartesian cards share, as the library's axis charts
// take them: a category axis of months printed as the file prints it —
// the year at January, "Jul" at July, nothing in between — and a value
// axis from 0 to 24k in nine steps of 3k, printed short. The library
// draws the rest: 12px ink-gray-5 labels, dashed hairline gridlines, no
// axis lines.
import type {
  ChartValueAxisOptions,
  ChartXAxisOptions,
} from '../../src/charts/types'

const MONTH = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** a `YYYY-MM` category as a year and a month index */
const parse = (value: string) => {
  const [y, m] = String(value).split('-')
  return { year: y, month: Number(m) - 1 }
}
/** the file's labels lie flat, however many months there are */
const flat = { axisLabel: { interval: 0, hideOverlap: false, rotate: 0 } }

/** "2021 · Jul · 2022 · Jul · 2023": the year at January, Jul at July */
export const yearAxis: ChartXAxisOptions = {
  type: 'category',
  format: (value: string) => {
    const { year, month } = parse(value)
    if (month === 0) return year
    if (month === 6) return 'Jul'
    return ''
  },
  echartOptions: flat,
}

/** "2021 · Mar · May · Jul · Sep · Nov": every other month of one year */
export const monthAxis: ChartXAxisOptions = {
  type: 'category',
  format: (value: string) => {
    const { year, month } = parse(value)
    if (month === 0) return year
    return month % 2 === 0 ? MONTH[month] : ''
  },
  echartOptions: flat,
}

/** "24k … 3k, 0": thousands with the file's small k */
export const thousands = (value: number) =>
  value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value)

/** 0 → 24k in steps of 3k, printed "24k … 3k, 0" */
export const salesAxis: ChartValueAxisOptions = {
  min: 0,
  max: 24000,
  format: thousands,
  echartOptions: { interval: 3000 },
}

/** 0 → 21k, the file's bubble multi-series axis */
export const bubbleAxis: ChartValueAxisOptions = {
  min: 0,
  max: 21000,
  format: thousands,
  echartOptions: { interval: 3000 },
}

/** 0 → 150 in steps of 30, printed with one decimal as the file does */
export const priceAxis: ChartValueAxisOptions = {
  min: 0,
  max: 150,
  format: (value: number) => value.toFixed(1),
  echartOptions: { interval: 30 },
}

/** $0 → $70k in steps of $10k */
export const incomeAxis: ChartValueAxisOptions = {
  min: 0,
  max: 70000,
  format: (value: number) =>
    value === 0 ? '$0' : `$${Math.round(value / 1000)}k`,
  echartOptions: { interval: 10000 },
}
