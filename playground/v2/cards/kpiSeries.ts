// The points behind the KPI cards' charts, read straight off the design's
// own art (espresso-2.0 › kpi-card, 31860:13142). Each chart carries its
// own series: the variants share a shape but not a viewBox, and the filled
// ones are drawn from their own path — so a hover lands on the shape that
// is actually being pointed at, and the dot sits on that chart's own line.
//
// `x` is the point's centre — a vertex of the line, or the middle of a bar
// (the bars' paths start at their left edge, so half a bar's width is added
// here). `h` is its height above the baseline, in the chart's viewBox units.
// KpiCard turns those heights into values, scaled to the card's total.
export interface Series {
  /** the chart's viewBox, so pointer positions can be scaled into it */
  width: number
  height: number
  /** the line charts mark the point with a dot; the bar charts don't */
  dot: boolean
  points: { x: number; h: number }[]
}

const pair = (xs: number[], hs: number[]) => xs.map((x, i) => ({ x, h: hs[i] }))

export const B_SPARK_FILL: Series = {
  width: 223,
  height: 42,
  dot: true,
  points: pair(
    [
      0, 7.9, 12.73, 16.68, 22.83, 32.48, 40.39, 44.34, 47.85, 53.99, 60.58,
      66.72, 70.68, 78.14, 88.23, 92.19, 98.77, 105.79, 120.72, 133.01, 135.21,
      140.91, 147.94, 155.4, 176.03, 202.81, 223,
    ],
    [
      11.55, 11.55, 14.52, 14.52, 11.55, 20.59, 20.59, 27.59, 22.14, 22.14,
      22.14, 26.76, 20.59, 20.59, 20.59, 26.76, 14.52, 19.86, 19.86, 19.86,
      22.14, 42, 21.41, 14.52, 14.52, 14.52, 14.52,
    ],
  ),
}

export const B_SPARK_SUBTLE: Series = {
  width: 225,
  height: 44,
  dot: true,
  points: pair(
    [
      0.75, 8.55, 13.31, 17.21, 23.27, 32.8, 40.6, 44.5, 47.96, 54.03, 60.52,
      66.59, 70.49, 77.85, 87.81, 91.71, 98.21, 105.14, 119.86, 131.99, 134.16,
      139.79, 146.72, 154.08, 174.44, 200.86, 224.25,
    ],
    [
      17.85, 17.85, 22.31, 22.31, 17.85, 31.44, 31.44, 41.96, 33.77, 33.77,
      33.77, 40.72, 31.44, 31.44, 31.44, 40.72, 22.31, 30.35, 30.35, 30.35,
      33.77, 42.58, 32.68, 22.31, 22.31, 22.31, 22.31,
    ],
  ),
}

export const B_SPARK_OUTLINE: Series = {
  width: 225,
  height: 44,
  dot: true,
  points: pair(
    [
      0.75, 8.55, 13.31, 17.21, 23.27, 32.8, 40.6, 44.5, 47.96, 54.03, 60.52,
      66.59, 70.49, 77.85, 87.81, 91.71, 98.21, 105.14, 119.86, 131.99, 134.16,
      139.79, 146.72, 154.08, 174.44, 200.86, 224.25,
    ],
    [
      17.85, 17.85, 22.31, 22.31, 17.85, 31.44, 31.44, 41.96, 33.77, 33.77,
      33.77, 40.72, 31.44, 31.44, 31.44, 40.72, 22.31, 30.35, 30.35, 30.35,
      33.77, 42.58, 32.68, 22.31, 22.31, 22.31, 22.31,
    ],
  ),
}

export const B_BAR: Series = {
  width: 223,
  height: 42,
  dot: false,
  points: pair(
    [
      1, 9.19, 17.37, 25.56, 33.74, 41.93, 50.11, 58.3, 66.48, 74.67, 82.85,
      91.04, 99.22, 107.41, 115.59, 123.78, 131.96, 140.15, 148.33, 156.52,
      164.7, 172.89, 181.07, 189.26, 197.44, 205.63, 213.81, 222,
    ],
    [
      6, 12, 16, 12, 14, 21, 25, 36, 27, 27, 20, 34, 25, 25, 16, 33, 17, 21, 25,
      18, 6, 23, 25, 38, 36, 20, 12, 6,
    ],
  ),
}

export const B_STACKED: Series = {
  width: 223,
  height: 38,
  dot: false,
  points: pair(
    [
      4.5, 18.5, 32.5, 46.5, 60.5, 74.5, 88.5, 102.5, 116.5, 130.5, 144.5,
      158.5, 172.5, 186.5, 200.5, 214.5,
    ],
    [
      16.5, 35.5, 24.5, 9.5, 16.5, 27.5, 22.5, 35.5, 22.5, 29.5, 16.5, 27.5,
      9.5, 35.5, 16.5, 9.5,
    ],
  ),
}

export const R_SPARK_FILL: Series = {
  width: 146,
  height: 40,
  dot: true,
  points: pair(
    [
      0, 5.17, 8.33, 10.92, 14.94, 21.27, 26.44, 29.03, 31.33, 35.35, 39.66,
      43.69, 46.27, 51.16, 57.77, 60.35, 64.67, 69.26, 79.04, 87.08, 88.52,
      92.26, 96.85, 101.74, 115.25, 132.78, 146,
    ],
    [
      11, 11, 13.82, 13.82, 11, 19.61, 19.61, 26.27, 21.08, 21.08, 21.08, 25.49,
      19.61, 19.61, 19.61, 25.49, 13.82, 18.92, 18.92, 18.92, 21.08, 40, 20.39,
      13.82, 13.82, 13.82, 13.82,
    ],
  ),
}

export const R_SPARK_SUBTLE: Series = {
  width: 146,
  height: 43,
  dot: true,
  points: pair(
    [
      0, 5.09, 8.21, 10.75, 14.71, 20.94, 26.03, 28.5, 30.84, 34.8, 39.05,
      43.01, 45.55, 50.36, 56.87, 59.42, 63.66, 68.19, 77.81, 85.73, 87.15,
      90.83, 95.35, 100.16, 113.46, 130.72, 146,
    ],
    [
      17.06, 17.06, 21.3, 21.3, 17.06, 29.97, 29.97, 40.11, 32.18, 32.18, 32.18,
      38.79, 29.97, 29.97, 29.97, 38.79, 21.3, 28.93, 28.93, 28.93, 32.18,
      40.56, 31.15, 21.3, 21.3, 21.3, 21.3,
    ],
  ),
}

export const R_SPARK_OUTLINE: Series = {
  width: 147,
  height: 40,
  dot: true,
  points: pair(
    [
      26, 36.19, 42.42, 47.51, 55.43, 67.89, 78.08, 82.6, 87.7, 95.62, 104.11,
      112.04, 117.13, 125.06, 136.38, 146,
    ],
    [
      11, 11, 14.51, 14.51, 11, 21.69, 21.69, 27.05, 23.53, 23.53, 23.53, 29,
      21.69, 11, 20.84, 20.84,
    ],
  ),
}

export const R_BAR: Series = {
  width: 146,
  height: 40,
  dot: false,
  points: pair(
    [49, 57, 65, 73, 81, 89, 97, 105, 113, 121, 129, 137, 145],
    [6, 12, 16, 12, 14, 21, 25, 34, 27, 27, 25, 25, 16],
  ),
}

export const R_STACKED: Series = {
  width: 146,
  height: 40,
  dot: false,
  points: pair(
    [71.5, 85.5, 99.5, 113.5, 127.5, 141.5],
    [16.5, 35.5, 24.5, 9.5, 16.5, 9.5],
  ),
}

// The comparison behind "vs last month". `days` also spaces the chart's
// points, so the tooltip's dates follow the pick.
export interface Period {
  label: string
  days: number
  delta: number
}

export const PERIODS: Period[] = [
  { label: 'vs last week', days: 7, delta: 3 },
  { label: 'vs last month', days: 30, delta: 7 },
  { label: 'vs last quarter', days: 91, delta: 12 },
  { label: 'vs last year', days: 365, delta: 48 },
]
