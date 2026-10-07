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
const flat = { interval: 0, hideOverlap: false, rotate: 0 }

/**
 * The whole reading, which is what the tooltip's date row carries ("Jan 12,
 * 2025" in the file; ours is one reading a month, so "May 2021"). The axis
 * prints far less than this — the file names a few months and leaves the rest
 * to the gridlines — so what each tick draws is set as an `axisLabel.formatter`
 * below, which the library takes over the `format` the tooltip reads.
 */
const monthYear = (value: string) => {
  const { year, month } = parse(value)
  return `${MONTH[month]} ${year}`
}

/** "2021 · Jul · 2022 · Jul · 2023": the year at January, Jul at July */
export const yearAxis: ChartXAxisOptions = {
  type: 'category',
  format: monthYear,
  echartOptions: {
    axisLabel: {
      ...flat,
      formatter: (value: string) => {
        const { year, month } = parse(value)
        if (month === 0) return year
        if (month === 6) return 'Jul'
        return ''
      },
    },
  },
}

/** "2021 · Mar · May · Jul · Sep · Nov": every other month of one year */
export const monthAxis: ChartXAxisOptions = {
  type: 'category',
  format: monthYear,
  echartOptions: {
    axisLabel: {
      ...flat,
      formatter: (value: string) => {
        const { year, month } = parse(value)
        if (month === 0) return year
        return month % 2 === 0 ? MONTH[month] : ''
      },
    },
  },
}

/**
 * A reading in full, for a tooltip row: the file's tooltips print the number
 * itself ("5302"), where its axes print the short "24k".
 */
export const count = (value: number) => value.toLocaleString('en-US')

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

/**
 * The box the file draws its plot in: 48,75,516,243 of a 580×360 card
 * (1356:68175's "Frame 1000009725", and the same on 68378, 68269 and 68212,
 * and on every card of the annotation row: 1356:68610, 68674 …),
 * which is 8.28% in from the left, 2.76% from the right, 20.83% down and
 * 11.67% up. The library sizes a plot from what is left over instead — the
 * header takes what it needs and the grid takes the rest — so ours opened a
 * third of the way higher and sat a little to the left.
 *
 * The shares are of the canvas rather than of the card, since the header above
 * it is a fixed height and not a fraction of one, and they are the numbers
 * that put the drawn plot on the file's — measured rather than derived, since
 * what the library holds back for a label is its own business.
 */
export const FILE_BOX = { right: -3 } as const

/**
 * And why the plot can reach that right edge at all. The file's end labels are
 * not centred on their ticks the way the ones between them are: "2021" starts
 * at 51 against a plot opening at 48, and "2023" ends at 560 against one
 * closing at 564 — each is pulled inside the plot rather than straddling its
 * edge. echarts centres them by default and then reserves half a label's width
 * at either end so nothing overhangs, which is the room the plot was losing.
 * Aligning the two end labels the way the file aligns them gives it back.
 */
export const endLabels = {
  axisLabel: { alignMinLabel: 'left', alignMaxLabel: 'right' },
}
/**
 * The two together, as a chart's `echartOptions`: the file's plot box, with
 * the end labels pulled inside it. The line row and the annotation row draw
 * the same box.
 */
export const filePlot = {
  grid: { ...FILE_BOX, left: 1, top: '10.2%' },
  xAxis: endLabels,
}

/**
 * The rule the file drops through the hovered reading: a solid 1px hairline,
 * black at 9% over the card — every card in the line row carries the same "Line
 * 80" (1356:68175, 68378, 68437, 68269, 68212), and the annotation row's
 * cards the same (1356:68610). `outline-gray-2` is the token
 * that lands on that grey and, unlike a black wash, survives a flip to dark.
 */
export const fileCrosshair = (t: (name: string) => string) => ({
  tooltip: {
    axisPointer: {
      type: 'line',
      lineStyle: { color: t('outline-gray-2'), width: 1, type: 'solid' },
    },
  },
})
