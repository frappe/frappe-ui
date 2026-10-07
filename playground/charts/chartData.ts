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
 * 51,987 sits on a pale step and 12,345 on the darkest — so the ramp is read
 * off the numbers here, which is the one thing a heat map has to do.
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
