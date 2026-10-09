// The numbers behind the Charts page: the readings the Frappe Charts file
// (Figma 1GDS12ys41lxeG3wQpNq41) draws its cards with, as rows the
// library's charts take — monthly sales from January 2021 to January 2023
// on a 0–24k scale, the countries and channels of the horizontal bars,
// the price-against-units points of the scatter and the bubble, the five
// stages of the funnel, the eight slices of the pie, the companies of the
// heat table and the states of the map. Every series is fixed, so the page
// draws the same on every load.

/**
 * 25 months, the file's "2021 · Jul · 2022 · Jul · 2023" axis, as
 * `YYYY-MM` strings: a category each, which is how the file spaces them.
 */
export const MONTHS: string[] = Array.from({ length: 25 }, (_, i) => {
  const d = new Date(Date.UTC(2021, i, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
})

/** the file's line, read off its path: 0–24k, 23 readings spread to 25 */
const SALES_SHAPE = [
  13.9, 14.3, 16.7, 15.5, 17.6, 16.7, 13.9, 15.5, 16.7, 14.8, 10.7, 12.4, 10.7,
  14.8, 16.7, 13.4, 11.4, 13.4, 12.4, 16.1, 14.3, 16.1, 13.9, 15.2, 16.4,
]
export const SALES = SALES_SHAPE.map((v) => Math.round(v * 1000))
export const ORDERS = SALES.map((v, i) => Math.round(v * 0.14 + (i % 4) * 90))
export const COSTS = SALES.map((v, i) => Math.round(v * 0.62 + (i % 3) * 200))
export const PROFIT = SALES.map((v, i) => v - COSTS[i])
export const DATA_2 = SALES.map((v, i) => Math.round(v * 0.45 + (i % 5) * 300))
export const DATA_3 = SALES.map((v, i) => Math.round(v * 0.3 + (i % 3) * 250))
export const DATA_4 = SALES.map((v, i) => Math.round(v * 0.2 + (i % 2) * 200))

/** one row per month: wide data, every series a column */
export const monthly = MONTHS.map((month, i) => ({
  month,
  sales: SALES[i],
  orders: ORDERS[i],
  costs: COSTS[i],
  profit: PROFIT[i],
  data1: SALES[i],
  data2: DATA_2[i],
  data3: DATA_3[i],
  data4: DATA_4[i],
  // the file's 10k target, and where the line falls short of it
  target: 10000,
}))

/**
 * The annotation row's line, as the file draws it (1356:68610 "Vector 434",
 * the same on every card of the row). It is the line row's shape set about
 * 1.93k lower, drawn by hand as 23 points on a grid a little wider than the
 * months — so it cannot be the sales above less a constant, which put ours
 * 11.6px off it on average. These are the file's line read at each month's
 * tick on its 48→564 plot instead: 1.9px off on average, 11 at the one peak
 * that falls between two ticks.
 */
export const ANNOTATION_SALES = [
  11977, 12670, 14745, 13648, 15219, 14989, 13073, 12762, 14036, 14277, 12307,
  8860, 10366, 8985, 11858, 14123, 12924, 10620, 10102, 11247, 10969, 14057,
  12397, 13807, 11487,
]
export const annotated = monthly.map((row, i) => ({
  ...row,
  sales: ANNOTATION_SALES[i],
}))

/** the first year alone, for the cards whose axis reads 2021 … Nov */
export const year = monthly.slice(0, 12)

/** four series that stack to the file's columns, data1 at the bottom */
export const stackYear = year.map((row, i) => ({
  month: row.month,
  data1: Math.round(row.sales * 0.26 + (i % 2) * 300),
  data2: Math.round(row.sales * 0.3 + (i % 3) * 200),
  data3: Math.round(row.sales * 0.26 + (i % 4) * 250),
  data4: Math.round(row.sales * 0.16 + (i % 5) * 150),
}))

/**
 * The stepped card's four bands, read off the file's own step vectors
 * (Figma 1GDS12ys41lxeG3wQpNq41, 1356:67528 "Vector 458 / 461 / 463 / 466").
 * The file stacks them — each band sits between its own line and the one
 * below, not on the axis — so what is written here is each band's own height
 * and the lines the file draws are their running totals: 1153, 5358, 7778,
 * 9227 in January, 2410, 8222, 10691, 12765 by December. data4 is the lowest.
 */
export const steppedYear = [
  { month: year[0].month, data4: 1153, data3: 4205, data2: 2420, data1: 1449 },
  { month: year[1].month, data4: 1605, data3: 2914, data2: 2765, data1: 1544 },
  { month: year[2].month, data4: 2410, data3: 3738, data2: 2321, data1: 1655 },
  { month: year[3].month, data4: 1605, data3: 4889, data2: 2271, data1: 1857 },
  { month: year[4].month, data4: 1605, data3: 4543, data2: 2074, data1: 1902 },
  { month: year[5].month, data4: 2762, data3: 4078, data2: 1925, data1: 1857 },
  { month: year[6].month, data4: 1957, data3: 5327, data2: 2518, data1: 1718 },
  { month: year[7].month, data4: 1253, data3: 4895, data2: 2617, data1: 1857 },
  { month: year[8].month, data4: 2158, data3: 3447, data2: 2617, data1: 2151 },
  { month: year[9].month, data4: 2410, data3: 4676, data2: 2716, data1: 1718 },
  { month: year[10].month, data4: 2410, data3: 5812, data2: 2469, data1: 2074 },
  { month: year[11].month, data4: 2410, data3: 5812, data2: 2469, data1: 2074 },
]

/** four series side by side, the file's six groups of four bars */
export const groupYear = year
  .filter((_, i) => i % 2 === 0)
  .map((row, i) => ({
    month: row.month,
    data1: Math.round(row.sales * 0.98 - (i % 3) * 1200),
    data2: Math.round(row.sales * 0.72 - (i % 2) * 900),
    data3: Math.round(row.sales * 0.42 + (i % 3) * 800),
    data4: Math.round(row.sales * 0.22 + (i % 2) * 700),
  }))

/** the file's "Top countries": income per capita, USD */
export const countries = [
  { country: 'United States', income: 70000 },
  { country: 'Spain', income: 62000 },
  { country: 'Italy', income: 58000 },
  { country: 'France', income: 54000 },
  { country: 'Australia', income: 49000 },
  { country: 'Brazil', income: 41000 },
  { country: 'Canada', income: 36000 },
  { country: 'Germany', income: 30000 },
  { country: 'Japan', income: 24000 },
  { country: 'South Africa', income: 17000 },
  { country: 'India', income: 9000 },
]

export const CHANNELS = [
  'Google organic',
  'Google paid',
  'Facebook ads',
  'Referral',
  'Others',
] as const

/**
 * Channel revenue per country: the file's horizontal cards. The totals are
 * read off its grouped card, where the longest bar runs to $65k of the $70k
 * the axis carries — the stacked card beside it draws the same rows as shares,
 * which the totals do not move.
 */
export const channelRevenue = [
  { country: 'Germany', ...split(218, [0.3, 0.25, 0.2, 0.15, 0.1]) },
  { country: 'Japan', ...split(166, [0.35, 0.2, 0.2, 0.15, 0.1]) },
  { country: 'South Africa', ...split(122, [0.25, 0.3, 0.2, 0.15, 0.1]) },
  { country: 'India', ...split(77, [0.4, 0.2, 0.15, 0.15, 0.1]) },
  { country: 'France', ...split(192, [0.3, 0.3, 0.15, 0.15, 0.1]) },
]

function split(total: number, shares: number[]) {
  const row: Record<string, number> = {}
  CHANNELS.forEach((channel, i) => {
    row[channel] = Math.round(total * shares[i] * 1000)
  })
  return row
}

/**
 * The trends the file's small cards draw, as it draws them: every vertex of
 * its own vector, as `[where across the card, reading]`. They are read off
 * those paths rather than generated, because on these cards the trend is the
 * drawing — the run that climbs, holds, spikes at two thirds and then
 * flattens is the shape they are read against (Figma 1356:69060, 1356:69133,
 * 1356:69126). The x of each reading is the file's too: its vertices are not
 * evenly spaced.
 */
export type SparkVertex = [at: number, value: number]

/** the rising trend: the area, line and solid cards (1356:69060) */
export const SPARK_UP: SparkVertex[] = [
  [0.0, 0.0],
  [0.0354, 0.0],
  [0.0571, 3.51],
  [0.0748, 3.51],
  [0.1024, 0.0],
  [0.1457, 10.69],
  [0.1811, 10.69],
  [0.1988, 18.96],
  [0.2146, 12.52],
  [0.2421, 12.52],
  [0.2717, 12.52],
  [0.2992, 17.99],
  [0.3169, 10.69],
  [0.3504, 10.69],
  [0.3957, 10.69],
  [0.4134, 17.99],
  [0.4429, 3.51],
  [0.4744, 9.83],
  [0.5413, 9.83],
  [0.5965, 9.83],
  [0.6063, 12.52],
  [0.6319, 27.48],
  [0.6634, 11.66],
  [0.6969, 3.51],
  [0.7894, 3.51],
  [0.9094, 3.51],
  [1.0, 3.51],
]

/** the falling trend: the share card and the inset Sales card (1356:69133) */
export const SPARK_DOWN: SparkVertex[] = [
  [0.0, 15.19],
  [0.0268, 15.19],
  [0.0481, 23.0],
  [0.0688, 17.5],
  [0.1025, 17.5],
  [0.1386, 17.5],
  [0.1663, 7.01],
  [0.1934, 12.5],
  [0.2534, 12.5],
  [0.2998, 12.5],
  [0.323, 7.01],
  [0.3482, 7.01],
  [0.3714, 0.0],
  [0.3946, 7.01],
  [0.4391, 7.01],
  [0.4584, 9.5],
  [0.4797, 8.0],
  [0.5377, 8.0],
  [0.5551, 7.01],
  [0.5687, 9.5],
  [0.5938, 9.5],
  [0.6209, 0.0],
  [0.6422, 5.5],
  [1.0, 5.5],
]

/** the short line beside the "My tickets" reading (1356:69126) */
export const SPARK_BESIDE: SparkVertex[] = [
  [0.0, 0.0],
  [0.0849, 0.0],
  [0.1368, 3.51],
  [0.1792, 3.51],
  [0.2453, 0.0],
  [0.3491, 10.69],
  [0.434, 10.69],
  [0.4717, 16.05],
  [0.5142, 12.53],
  [0.5802, 12.53],
  [0.6509, 12.53],
  [0.717, 18.0],
  [0.7594, 10.69],
  [0.8255, 0.0],
  [0.9198, 9.84],
  [1.0, 9.84],
]

/** a seeded spread, the same on every load */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/** price against units sold: the scatter's and the bubble's points */
export function pricePoints(
  n: number,
  seed: number,
  group?: string,
): Array<{ price: number; units: number; sales: number; group?: string }> {
  const rand = seeded(seed)
  return Array.from({ length: n }, () => {
    const price = Math.round((10 + rand() * 140) * 10) / 10
    const units = Math.round(3000 + rand() * 18000 - price * 40)
    return {
      price,
      units: Math.max(500, units),
      sales: Math.round(price * Math.max(500, units) * 0.1),
      ...(group ? { group } : {}),
    }
  })
}

export const SCATTER_GROUPS = [
  'Google paid',
  'Google organic',
  'Facebook ads',
  'Referral',
] as const
export const BUBBLE_GROUPS = [
  'Toys',
  'Odd equipment',
  'Sports Goods',
  'Apparel',
] as const

/** the file's funnel: five stages, 563 leads to 39 won */
export const funnel = [
  { stage: 'Leads', count: 563 },
  { stage: 'Qualified', count: 385 },
  { stage: 'Quotation', count: 291 },
  { stage: 'Ready to close', count: 191 },
  { stage: 'Won leads', count: 39 },
]

/** the file's pie: eight slices, as "Data n (share)" */
export const slices = [
  { name: 'Data 1', share: 11 },
  { name: 'Data 2', share: 17.2 },
  { name: 'Data 3', share: 8 },
  { name: 'Data 4', share: 14 },
  { name: 'Data 5', share: 9 },
  { name: 'Data 6', share: 11 },
  { name: 'Data 7', share: 22 },
  { name: 'Data 8', share: 8.3 },
]

/**
 * The file's heat table, company by company and column by column (Figma
 * 1GDS12ys41lxeG3wQpNq41, 1356:68481), carried in hundreds so each cell
 * prints three digits: the file's 51,987 is 520 here. Dividing every
 * reading by the same number leaves the ramp exactly where it was, since a
 * cell's step is its place between the lowest and highest reading.
 *
 * The file's own cells are coloured by hand rather than by what they hold —
 * 51,987 sits on a pale step and 12,345 on the darkest — so the steps are
 * carried beside the readings in `heatSteps` rather than read off them.
 */
export const heatTable = [
  ['Attentive', 520, 212, 457, 783, 154, 123, 223],
  ['Gumroad', 327, 289, 299, 888, 635, 423, 305],
  ['Zapier', 643, 125, 205, 220, 235, 157, 501],
  ['Evergreen', 721, 257, 479, 765, 312, 535, 399],
  ['Hourglass', 452, 368, 199, 543, 346, 388, 457],
  ['Squarespace', 254, 399, 399, 321, 279, 346, 289],
  ['Github', 457, 243, 223, 890, 568, 79, 346],
  ['Airbnb', 388, 443, 325, 679, 223, 601, 212],
  ['Figma', 299, 558, 357, 501, 457, 489, 279],
] as const
/**
 * The step each cell stands on, straight off the file (1356:68481): an index
 * into the theme's `heat` ramp, which for Ocean is the file's own seven —
 * B-100, 200, 300, 400, 700, 800, 900 — so 0 is #edf7fc and 6 is #095895.
 * The file places these by hand, so they are carried rather than derived; a
 * theme with a shorter ramp wraps, the way every other role on this page
 * cycles its colours.
 */
export const heatSteps = [
  [2, 0, 4, 3, 4, 6, 3],
  [4, 6, 3, 2, 3, 0, 1],
  [3, 3, 1, 4, 2, 3, 0],
  [3, 5, 3, 0, 3, 0, 1],
  [4, 0, 4, 1, 5, 4, 3],
  [0, 3, 2, 5, 1, 3, 6],
  [4, 1, 4, 2, 4, 5, 3],
  [4, 4, 1, 6, 3, 0, 1],
  [1, 3, 0, 4, 6, 3, 2],
] as const
export const HEAT_COLUMNS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
export const heatCells = heatTable.flatMap(([company, ...values]) =>
  values.map((value, i) => ({ company, month: HEAT_COLUMNS[i], value })),
)

/**
 * Active users by state: the map's readings against the file's 100-to-10,000
 * scale. The file's own map spreads its fifty-one states over all nine steps
 * of the ramp and weights them towards the dark end — eleven on Ocean 900,
 * eleven on 800, then 8, 5, 4, 5, 3, 3 and a single state on 100 (1356:68047)
 * — so the readings here are spread the same way, biggest state first. Texas
 * keeps the 5,433 the file names in its tooltip, which is also where its
 * legend dot sits on the scale.
 */
export const stateUsers: Record<string, number> = {
  CA: 8990,
  NY: 9080,
  FL: 9180,
  IL: 9270,
  TX: 5433,
  PA: 9450,
  NJ: 9540,
  GA: 9630,
  OH: 9720,
  WA: 9820,
  NC: 9910,
  MI: 7890,
  MA: 7980,
  VA: 8080,
  AZ: 8170,
  CO: 8260,
  MN: 8350,
  TN: 8440,
  MD: 8530,
  IN: 8620,
  MO: 8720,
  WI: 8810,
  OR: 6820,
  SC: 6940,
  CT: 7070,
  AL: 7190,
  LA: 7310,
  KY: 7430,
  NV: 7560,
  UT: 7680,
  OK: 5780,
  IA: 5970,
  AR: 6150,
  KS: 6330,
  MS: 6520,
  NM: 4720,
  NE: 4940,
  ID: 5160,
  WV: 5380,
  NH: 3580,
  HI: 3770,
  ME: 3950,
  RI: 4130,
  MT: 4320,
  DE: 2580,
  SD: 2850,
  ND: 3120,
  DC: 1480,
  AK: 1750,
  VT: 2020,
  WY: 650,
}

/**
 * The half ring's eight arcs, as 1589:43605 places them: the ramp step each one
 * carries and the angle it sweeps, running from 9 o'clock round to 3. The file
 * draws them by hand and neither figure follows its own legend — one arc takes
 * 40% of the ring where its label says 14, and the ramp jumps about the arc
 * (B-300, B-200, B-600, B-500, B-900, B-700, B-800, B-400) while the legend
 * below runs the ramp in order. Sized from the data the card came out evenly
 * stepped where the file's is lopsided, so the plot takes the file's arcs and
 * the legend keeps the data's names, the way the funnel's columns do. Degrees,
 * from the node's radians. The steps are Ocean's; a theme whose frame colours
 * these arcs otherwise names them as its `halfArcs` (chartThemes.ts).
 */
export const HALF_ARCS = [
  { step: 0, sweep: 28.0754 },
  { step: 7, sweep: 7.3407 },
  { step: 3, sweep: 8.4942 },
  { step: 2, sweep: 69.4755 },
  { step: 6, sweep: 8.7387 },
  { step: 4, sweep: 10.9314 },
  { step: 5, sweep: 27.0674 },
  { step: 1, sweep: 11.3996 },
]

/**
 * The heat table's cells as the Qualitative frame colours them (1413:24050,
 * the table in "Group 1000007955"): placed by hand again rather than read off
 * Ocean's — the same Ocean step comes out Q1 in one cell and Q4 in the next —
 * so the theme carries its own grid, as indexes into its `heat` colours
 * (Q1, Q7, Q2, Q4, Q6). Mist and Earthy place their cells by the same hand
 * (1048:58469, 961:35752), each in its own five.
 */
export const qualitativeHeatSteps = [
  [0, 1, 2, 0, 2, 0, 3],
  [2, 0, 0, 3, 0, 1, 0],
  [3, 2, 4, 2, 4, 4, 1],
  [0, 4, 2, 1, 2, 1, 4],
  [2, 1, 2, 4, 4, 2, 3],
  [1, 0, 0, 4, 0, 0, 2],
  [2, 0, 2, 0, 2, 3, 4],
  [2, 2, 0, 4, 0, 1, 2],
  [0, 0, 1, 2, 4, 0, 4],
] as const

/**
 * The heat table's cells as the Diverging frame colours them (1462:26919), as
 * indexes into its `heat` colours (D2, D3, D5, D7, D6). The hand is the
 * Qualitative frame's but for one cell, the eighth row's first.
 */
export const divergingHeatSteps = [
  [0, 1, 2, 0, 2, 0, 3],
  [2, 0, 0, 3, 0, 1, 0],
  [3, 2, 4, 2, 4, 4, 1],
  [0, 4, 2, 1, 2, 1, 4],
  [2, 1, 2, 4, 4, 2, 3],
  [1, 0, 0, 4, 0, 0, 2],
  [2, 0, 2, 0, 2, 3, 4],
  [1, 2, 0, 4, 0, 1, 2],
  [0, 0, 1, 2, 4, 0, 4],
] as const

/**
 * The dashboard's week (Figma 1GDS12ys41lxeG3wQpNq41, 1536:35040): 65
 * readings from Monday to Sunday, read off the file's own lines at each of
 * their vertices, 8 apart on its 512-wide plots. The file draws one shape
 * several times over — the stacked area's lower band is the stacked lines'
 * lowest, 280 up; the gradient card's three are the stacked lines', a little
 * higher — so those are carried once here and moved, as the file moves them.
 */
const WEEK_BASIC = [
  900, 790, 1110, 1070, 1140, 1300, 1030, 1110, 1260, 1110, 1540, 1200, 1280,
  1330, 1780, 1340, 1440, 1430, 1030, 1210, 1150, 1660, 1440, 1220, 1670, 2510,
  2240, 2420, 2810, 1950, 2370, 2670, 2240, 2450, 2460, 2900, 2480, 2680, 2630,
  2910, 2480, 2240, 2510, 2750, 3590, 3390, 3190, 3170, 2960, 3410, 3860, 3640,
  3470, 3870, 3940, 4410, 4040, 4220, 4370, 4130, 3890, 4350, 4320, 4560, 4570,
]
const WEEK_LOW = [
  310, 360, 430, 410, 450, 510, 390, 440, 490, 440, 630, 470, 520, 540, 750,
  540, 600, 580, 390, 480, 470, 700, 580, 490, 730, 1130, 1000, 1100, 1240, 860,
  1060, 1190, 980, 1100, 1100, 1320, 1100, 1220, 1190, 1320, 1100, 1000, 1130,
  1260, 1670, 1560, 1450, 1450, 1360, 1580, 1800, 1680, 1610, 1800, 1830, 2070,
  1880, 1970, 2050, 1930, 1800, 2050, 2020, 2150, 2150,
]
const WEEK_MID = [
  810, 900, 1060, 1020, 1090, 1240, 980, 1060, 1210, 1050, 1490, 1150, 1220,
  1290, 1720, 1290, 1390, 1380, 980, 1150, 1100, 1610, 1390, 1170, 1620, 2460,
  2180, 2370, 2770, 1900, 2320, 2620, 2180, 2400, 2410, 2850, 2420, 2630, 2580,
  2860, 2420, 2180, 2450, 2250, 2600, 2890, 2700, 2680, 2470, 2910, 2870, 3140,
  2970, 3090, 2920, 3150, 3030, 3030, 3180, 2940, 3140, 3600, 3570, 3820, 3820,
]
const WEEK_HIGH = [
  1960, 2270, 2420, 2320, 2520, 2190, 2000, 2570, 2220, 2060, 2780, 2510, 2640,
  2240, 2800, 2640, 2700, 2700, 2480, 2510, 2460, 2130, 2680, 3120, 2860, 3580,
  3200, 3050, 3200, 3320, 3170, 3710, 3770, 3410, 3370, 3540, 3360, 3500, 3460,
  3690, 3550, 3750, 3790, 4160, 4270, 3730, 3910, 3670, 3920, 4100, 4460, 4300,
  4350, 4110, 4520, 4660, 4730, 5110, 4580, 4900, 4770, 4940, 4990, 4800, 5140,
]
/** the stacked area's upper band, its own height over the lower one */
const WEEK_BAND = [
  510, 530, 550, 560, 570, 580, 540, 570, 590, 600, 640, 580, 590, 650, 690,
  610, 630, 610, 560, 570, 590, 670, 630, 620, 720, 650, 620, 690, 730, 790,
  900, 910, 860, 880, 930, 960, 910, 930, 950, 960, 860, 840, 870, 640, 490,
  760, 740, 710, 710, 780, 560, 830, 810, 680, 550, 460, 570, 490, 490, 470,
  770, 830, 840, 880, 880,
]

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
/**
 * Where the file prints each day: its labels fall at these readings, Monday on
 * the first and Sunday on the last, the five between not quite evenly.
 */
export const WEEK_TICKS = [0, 12, 22, 33, 43, 53, 64]

/** one row per reading, `at` its place in the week */
export const week = WEEK_BASIC.map((basic, i) => ({
  at: String(i),
  basic,
  // the stacked lines, lowest first as the legend names them
  data1: Math.max(0, WEEK_LOW[i] - 280),
  data2: WEEK_MID[i],
  data3: WEEK_HIGH[i],
  // the stacked area: the lower band, then the upper one's own height
  lower: WEEK_LOW[i],
  upper: WEEK_BAND[i],
  // the gradient card's three, top line first
  top: WEEK_HIGH[i] + 230,
  middle: WEEK_MID[i] + 230,
  bottom: WEEK_LOW[i],
}))

/** the dashboard's bars, read off the file's 0–4 axis (1536:35040) */
export const dashBars = [
  1.2, 2.86, 1.28, 1.65, 3.61, 1.2, 2.5, 1.47, 3.03, 0.64, 0.94, 1.95, 1.36,
  2.72, 1.1, 0.42, 0.8, 1.1, 1.65, 1.36,
].map((value, i) => ({ at: String(i + 1), value }))

/** the dashboard's countries, two readings each, in thousands */
export const dashCountries = [
  { country: 'World', current: 618, previous: 580 },
  { country: 'China', current: 500, previous: 420 },
  { country: 'India', current: 320, previous: 280 },
  { country: 'USA', current: 252, previous: 220 },
  { country: 'Indonesia', current: 157, previous: 132 },
  { country: 'Brazil', current: 98, previous: 62 },
]

/**
 * The dashboard's one stacked bar: eight stages of a pipeline, each as wide as
 * the file draws it. `legend` is the place the file names it in under the bar,
 * which is not the order the bar runs in.
 */
export const pipelineShares = [
  { name: 'Potential Leads', value: 232, legend: 0 },
  { name: 'Lead Data', value: 104, legend: 1 },
  { name: 'Price Quotation', value: 82, legend: 3 },
  { name: 'Qualified Prospects', value: 258, legend: 2 },
  { name: 'Ready for Close', value: 192, legend: 4 },
  { name: 'Converted', value: 65, legend: 5 },
  { name: 'Lead Information', value: 65, legend: 6 },
  { name: 'Customer Data', value: 54, legend: 7 },
]
