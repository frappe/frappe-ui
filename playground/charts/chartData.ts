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
 * The file's sparkline readings: a run of 26 climbing (or falling) through a
 * wobble rather than stepping cleanly, which is the texture its small cards
 * draw — a dozen readings over a 223-wide card reads as a zigzag, not a trend.
 */
function spark(from: number, to: number, seed: number, n = 26): number[] {
  const rand = seeded(seed)
  return Array.from({ length: n }, (_, i) => {
    const base = from + ((to - from) * i) / (n - 1)
    return Math.round((base + (rand() - 0.5) * 3.6) * 10) / 10
  })
}
export const SPARK = spark(12, 27, 7)
export const SPARK_DOWN = spark(27, 12, 11)

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

/** the file's heat table: nine companies across seven columns */
export const heatTable = [
  ['Attentive', 519, 212, 457, 783, 154, 124, 224],
  ['Gumroad', 327, 289, 299, 888, 634, 423, 305],
  ['Zapier', 643, 125, 205, 220, 235, 157, 501],
  ['Evergreen', 721, 257, 479, 765, 312, 534, 399],
  ['Hourglass', 452, 368, 199, 543, 346, 388, 457],
  ['Squarespace', 254, 399, 399, 321, 279, 346, 289],
  ['Github', 457, 243, 224, 890, 568, 222, 346],
  ['Airbnb', 388, 443, 325, 679, 224, 601, 212],
  ['Figma', 299, 558, 357, 501, 457, 489, 279],
] as const
export const HEAT_COLUMNS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
export const heatCells = heatTable.flatMap(([company, ...values]) =>
  values.map((value, i) => ({ company, month: HEAT_COLUMNS[i], value })),
)

/** active users by state: the map's readings, 100 to 10,000 */
export const stateUsers: Record<string, number> = {
  TX: 5433,
  CA: 9800,
  NY: 9100,
  FL: 7200,
  IL: 6100,
  PA: 5400,
  OH: 4700,
  GA: 4900,
  NC: 4300,
  MI: 4100,
  NJ: 5000,
  VA: 3900,
  WA: 4400,
  AZ: 3600,
  MA: 4000,
  TN: 3100,
  IN: 2900,
  MO: 2700,
  MD: 3000,
  WI: 2600,
  CO: 3300,
  MN: 3200,
  SC: 2300,
  AL: 2100,
  LA: 2000,
  KY: 1900,
  OR: 2400,
  OK: 1700,
  CT: 2200,
  UT: 1800,
  IA: 1400,
  NV: 1900,
  AR: 1300,
  MS: 1100,
  KS: 1200,
  NM: 900,
  NE: 800,
  WV: 700,
  ID: 800,
  HI: 600,
  NH: 700,
  ME: 600,
  MT: 400,
  RI: 500,
  DE: 400,
  SD: 300,
  ND: 300,
  AK: 200,
  DC: 300,
  VT: 200,
  WY: 100,
}
