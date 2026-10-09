// The five themes the Charts page offers — Ocean, Mist, Diverging,
// Qualitative, Earthy — as the Frappe Charts file (Figma
// 1GDS12ys41lxeG3wQpNq41) assigns its colour variables to each kind of
// mark, read off the file's theme frames ("Charts - ocean blue",
// "Charts - mist", "Charts - earthy tones", "Qualitative … - all charts",
// "Diverging"). A theme is a set of roles, each an ordered list of the
// file's variables (chart-tokens.css holds their light and dark values);
// a card asks for a role and gets colours resolved off the page.
//
// Where the file draws a kind in one theme only (Mist and Earthy have no
// pies) the role follows the theme's own series order.
import { HALF_ARCS } from './chartData'

export type ChartTheme =
  | 'ocean'
  | 'mist'
  | 'diverging'
  | 'qualitative'
  | 'earthy'

export const CHART_THEMES: Array<{ id: ChartTheme; label: string }> = [
  { id: 'ocean', label: 'Ocean' },
  { id: 'qualitative', label: 'Qualitative' },
  { id: 'diverging', label: 'Diverging' },
  { id: 'mist', label: 'Mist' },
  { id: 'earthy', label: 'Earthy' },
]

export type ThemeRole =
  /** the one series of the default bar */
  | 'bar'
  /** a stack, bottom to top */
  | 'stack'
  /** the labelled stack, bottom to top */
  | 'stackLabelled'
  /** the bars of a group, left to right */
  | 'group'
  /** the one line of a line chart */
  | 'line'
  /** the line with markers */
  | 'markers'
  /** two lines: sales, orders */
  | 'lines'
  /** four stepped lines */
  | 'steps'
  /** a lone scatter */
  | 'scatter'
  /** four scatter groups */
  | 'scatters'
  /** the five channels of the horizontal cards, dark to light */
  | 'channels'
  /** a lone bubble series */
  | 'bubble'
  /** four bubble groups */
  | 'bubbles'
  /** the map's ramp, low to high */
  | 'map'
  /** the heat table's cells, low to high */
  | 'heat'
  /** the funnel's steps, top to bottom */
  | 'funnel'
  /** the horizontal funnel's steps */
  | 'funnelSteps'
  /** the pie's slices, in legend order */
  | 'pie'
  /** the doughnut's slices */
  | 'doughnut'
  /** the half doughnut's eight slices */
  | 'half'
  /** the nested pie's rings, inner to outer */
  | 'rose'
  /** the area's line and fill */
  | 'area'
  /** the stacked areas, bottom to top */
  | 'areas'
  /** the stepped areas, bottom to top */
  | 'stepped'
  /** the sparkline's stroke */
  | 'spark'
  /** the line the annotation cards are drawn over */
  | 'annotation'

/**
 * Cards a theme may colour on their own. Ocean draws each of them with a role
 * above — the 100% stack with the stack, the horizontal bars with the bar —
 * and so every theme did; the Qualitative frame gives them colours of their
 * own (1413:24050). A theme that names one draws it so, and one that does not
 * falls back to what it drew before (OWN_ROLE_FALLBACK).
 */
export type OwnRole =
  /** the 100% stack, bottom to top */
  | 'stackPercent'
  /** the dual-axis card: its bars, then its line */
  | 'dual'
  /** the horizontal bars of one series */
  | 'horizontal'
  /** the horizontal 100% stack's channels, in CHANNELS order */
  | 'channelsStacked'
  /** the half ring's arcs, from 9 o'clock round to 3 */
  | 'halfArcs'
  /** the gradient under a sparkline */
  | 'sparkWash'
  /** the dashboard (1536:35040): its five spark lines, left to right */
  | 'dashSparks'
  /** the dashboard (1536:35040): its one line */
  | 'dashLine'
  /** the dashboard's three stacked lines, Data-1 to Data-3 */
  | 'dashLines'
  /** the dashboard's stacked area, lower band then upper */
  | 'dashAreas'
  /** the dashboard's gradient lines, top line first */
  | 'dashGradient'
  /** the dashboard's bars */
  | 'dashBar'
  /** the dashboard's countries, this year then last */
  | 'dashCountries'
  /** the dashboard's ring, Data 1 to Data 8 */
  | 'dashRing'
  /** the dashboard's stacked bar, in the order its legend names them */
  | 'dashStack'
  /** the dashboard's funnel: one colour, faded down the ladder */
  | 'dashFunnel'
  /** the dashboard's half ring: its legend, in slice order */
  | 'dashHalf'
  /** and its arcs, from 9 o'clock round to 3 */
  | 'dashHalfArcs'
  /** the CRM dashboard (1555:35858): the pipeline's four stages */
  | 'crmStages'
  /** the CRM dashboard's funnel steps, first to last; its edge the last */
  | 'crmFunnel'
  /** the CRM dashboard's forecast, then actual */
  | 'crmLines'
  /** the wash behind a top deal's value, laid at a fifth (see DashboardV2) */
  | 'crmWash'
  /** the expected closure's progress */
  | 'crmProgress'
  /**
   * the meetings' edges, in their order — where a theme names none, the CRM
   * dashboard keeps the Ocean frame's amber, blue, pink and teal
   */
  | 'crmMeetings'

export type ThemeRoles = Record<ThemeRole, string[]> &
  Partial<Record<OwnRole, string[]>>

const o = (n: number) => `--chart-ocean-${n}`
const m = (n: string) => `--chart-mist-${n}`
const e = (n: string) => `--chart-earthy-${n}`
const q = (n: number) => `--chart-qualitative-${n}`
const d = (n: number) => `--chart-diverging-${n}`

const OCEAN: ThemeRoles = {
  bar: [o(700)],
  stack: [o(900), o(800), o(700), o(400)],
  stackLabelled: [o(900), o(800), o(700), o(500)],
  group: [o(500), o(700), o(900), o(800)],
  line: [o(900)],
  markers: [o(800)],
  lines: [o(900), o(800)],
  steps: [o(900), o(800), o(700), o(600)],
  scatter: [o(700)],
  scatters: [o(900), o(800), o(700), o(400)],
  // the file's five channels on the horizontal cards: B-900 … B-300
  channels: [o(900), o(800), o(700), o(400), o(300)],
  bubble: [o(800)],
  bubbles: [o(900), o(800), o(700), o(400)],
  map: [100, 200, 300, 400, 500, 600, 700, 800, 900].map(o),
  heat: [o(100), o(200), o(300), o(400), o(700), o(800), o(900)],
  funnel: [o(400), o(600), o(700), o(800), o(900)],
  funnelSteps: [o(100), o(600), o(700), o(800), o(900)],
  pie: [o(400), o(900), o(700), o(600), o(800)],
  doughnut: [o(400), o(500), o(600), o(700), o(800)],
  half: [o(300), o(400), o(500), o(600), o(700), o(800), o(900), o(200)],
  // the nested pie's six arcs in the order the file stacks them, widest first:
  // B-500, 300, 600, 900, 700, 800 (1589:43629, read off the 258, 242, 208,
  // 180, 156 and 120 ellipses)
  rose: [o(500), o(300), o(600), o(900), o(700), o(800)],
  area: [o(800)],
  areas: [o(800), o(700), o(400), o(300)],
  stepped: [o(900), o(800), o(700), o(400)],
  spark: [o(700)],
  annotation: [o(800)],
  // the dashboard, read off its frame (1536:35040)
  dashSparks: [o(900), o(800), o(800), o(800), o(800)],
  dashLine: [o(700)],
  dashLines: [o(600), o(900), o(800)],
  dashAreas: [o(800), o(500)],
  dashGradient: [o(600), o(800), o(400)],
  dashBar: [o(600)],
  dashCountries: [o(600), o(800)],
  dashRing: [o(400), o(300), o(800), o(200), o(500), o(900), o(700), o(600)],
  dashStack: [o(500), o(400), o(900), o(200), o(600), o(300), o(800), o(700)],
  dashFunnel: [o(600)],
  // the CRM dashboard, read off its frame (1555:35858)
  crmStages: [o(900), o(700), o(500), o(300)],
  crmFunnel: [o(300), o(500), o(600), o(800), o(900)],
  crmLines: [o(900), o(700)],
  crmWash: [o(800)],
  crmProgress: [o(700)],
}

const MIST: ThemeRoles = {
  bar: [m('harboar')],
  stack: [m('graphite'), m('harboar'), m('rosewood'), m('apricot')],
  stackLabelled: [m('graphite'), m('harboar'), m('rosewood'), m('apricot')],
  group: [m('graphite'), m('harboar'), m('apricot'), m('dune')],
  line: [m('graphite')],
  markers: [m('graphite')],
  lines: [m('apricot'), m('graphite')],
  steps: [m('apricot'), m('graphite'), m('meadow'), m('limestone')],
  scatter: [m('apricot')],
  scatters: [m('apricot'), m('dune'), m('rosewood'), m('harboar')],
  // CHANNELS order: organic, paid, Facebook, referral, others; the file's
  // bars run paid graphite, organic harboar (1048:57142, 1048:57198)
  channels: [
    m('harboar'),
    m('graphite'),
    m('rosewood'),
    m('apricot'),
    m('dune'),
  ],
  bubble: [m('harboar')],
  bubbles: [m('harboar'), m('limestone'), m('rosewood'), m('apricot')],
  map: [
    m('graphite'),
    m('smoke'),
    m('harboar'),
    m('dune'),
    m('apricot'),
    m('rosewood'),
  ],
  // the table's fifth step is dune again (1048:58469)
  heat: [m('rosewood'), m('limestone'), m('apricot'), m('dune'), m('dune')],
  funnel: [m('harboar')],
  funnelSteps: [m('harboar')],
  pie: [m('harboar'), m('graphite'), m('apricot'), m('dune'), m('rosewood')],
  doughnut: [
    m('harboar'),
    m('graphite'),
    m('apricot'),
    m('dune'),
    m('rosewood'),
  ],
  half: [
    m('graphite'),
    m('harboar'),
    m('smoke'),
    m('meadow'),
    m('dune'),
    m('limestone'),
    m('apricot'),
    m('rosewood'),
  ],
  rose: [
    m('harboar'),
    m('graphite'),
    m('apricot'),
    m('dune'),
    m('meadow'),
    m('rosewood'),
  ],
  area: [m('harboar')],
  areas: [m('harboar'), m('smoke'), m('meadow'), m('graphite')],
  stepped: [m('limestone'), m('apricot'), m('rosewood'), m('dune')],
  spark: [m('graphite')],
  annotation: [m('harboar')],
  // the cards the Mist frame colours on their own (1048:56376)
  stackPercent: [m('graphite'), m('harboar'), m('dune'), m('apricot')],
  dual: [m('graphite'), m('dune')],
  sparkWash: [m('harboar')],
}

const EARTHY: ThemeRoles = {
  bar: [e('terracotta')],
  stack: [e('moss'), e('olive'), e('dune'), e('terracotta')],
  stackLabelled: [e('moss'), e('olive'), e('dune'), e('terracotta')],
  group: [e('stone'), e('terracotta'), e('dune'), e('wheat')],
  line: [e('moss')],
  markers: [e('moss')],
  lines: [e('terracotta'), e('moss')],
  // the third line is olive in the file, though its legend says clay
  // (961:35708)
  steps: [e('dune'), e('moss'), e('olive'), e('stone')],
  scatter: [e('dune')],
  scatters: [e('clay'), e('olive'), e('dune'), e('stone')],
  // CHANNELS order: organic, paid, Facebook, referral, others; the file's
  // bars run paid moss, organic olive (961:34425, 961:34481)
  channels: [e('olive'), e('moss'), e('dune'), e('terracotta'), e('stone')],
  bubble: [e('olive')],
  bubbles: [e('moss'), e('sand'), e('clay'), e('olive')],
  // the scale pill's eight even stops, wheat twice (961:35318)
  map: [
    e('moss'),
    e('olive'),
    e('honey'),
    e('wheat'),
    e('wheat'),
    e('clay'),
    e('terracotta'),
    e('stone'),
  ],
  heat: [e('terracotta'), e('sand'), e('wheat'), e('clay'), e('dune')],
  funnel: [e('moss')],
  funnelSteps: [e('moss')],
  pie: [e('terracotta'), e('moss'), e('dune'), e('stone'), e('wheat')],
  doughnut: [e('terracotta'), e('moss'), e('dune'), e('stone'), e('wheat')],
  half: [
    e('moss'),
    e('stone'),
    e('terracotta'),
    e('dune'),
    e('wheat'),
    e('sand'),
    e('clay'),
    e('olive'),
  ],
  rose: [
    e('terracotta'),
    e('moss'),
    e('dune'),
    e('stone'),
    e('clay'),
    e('wheat'),
  ],
  area: [e('moss')],
  areas: [e('stone'), e('terracotta'), e('sand'), e('dune')],
  stepped: [e('terracotta'), e('stone'), e('moss'), e('dune')],
  spark: [e('moss')],
  annotation: [e('terracotta')],
  // the cards the Earthy frame colours on their own (961:33659)
  dual: [e('moss'), e('dune')],
  horizontal: [e('olive')],
  channelsStacked: [
    e('olive'),
    e('moss'),
    e('wheat'),
    e('terracotta'),
    e('dune'),
  ],
}

const QUALITATIVE: ThemeRoles = {
  bar: [q(5)],
  stack: [q(5), q(1), q(3), q(8)],
  stackLabelled: [q(4), q(3), q(8), q(7)],
  group: [q(1), q(5), q(7), q(9)],
  line: [q(4)],
  markers: [q(6)],
  lines: [q(1), q(4)],
  steps: [q(3), q(1), q(6), q(7)],
  scatter: [q(1)],
  scatters: [q(1), q(3), q(6), q(8)],
  // CHANNELS order: organic, paid, Facebook, referral, others (1416:27814)
  channels: [q(5), q(1), q(9), q(8), q(3)],
  bubble: [q(4)],
  bubbles: [q(1), q(3), q(6), q(7)],
  // the map's scale pill, low to high (1413:25718 "Rectangle 41868")
  map: [1, 5, 3, 8, 6, 4, 9, 7, 2].map(q),
  heat: [q(1), q(7), q(2), q(4), q(6)],
  funnel: [q(1)],
  funnelSteps: [q(1)],
  pie: [q(1), q(4), q(7), q(5), q(2)],
  doughnut: [q(1), q(4), q(7), q(5), q(2)],
  half: [1, 2, 3, 4, 5, 6, 7, 8].map(q),
  // the nested pie's rings widest first, as Ocean's reads them (1532:44143;
  // the innermost is Q2's colour, left unbound)
  rose: [q(1), q(5), q(7), q(4), q(3), q(2)],
  area: [q(4)],
  areas: [q(5), q(1), q(3), q(8)],
  stepped: [q(1), q(3), q(4), q(6)],
  spark: [q(5)],
  annotation: [q(5)],
  // the cards the Qualitative frame colours on their own (1413:24050)
  stackPercent: [q(7), q(4), q(6), q(1)],
  dual: [q(8), q(4)],
  horizontal: [q(3)],
  channelsStacked: [q(5), q(1), q(9), q(3), q(6)],
  halfArcs: [q(1), q(4), q(3), q(7), q(2), q(9), q(8), q(5)],
  // the dashboard, read off the Qualitative frames (1511:29309, dark
  // 1523:32561). Its gradient card is bound to three Diverging colours in
  // both, and its half ring names Q7 twice in the legend; both as drawn.
  dashSparks: [q(7), q(4), q(1), q(3), q(5)],
  dashLine: [q(5)],
  dashLines: [q(1), q(6), q(5)],
  dashAreas: [q(8), q(5)],
  dashGradient: [d(2), d(7), d(1)],
  dashBar: [q(3)],
  dashCountries: [q(1), q(5)],
  dashRing: [1, 3, 9, 5, 6, 7, 8, 4].map(q),
  dashStack: [3, 1, 7, 9, 4, 8, 6, 5].map(q),
  dashFunnel: [q(5)],
  dashHalf: [1, 4, 3, 7, 5, 8, 9, 7].map(q),
  dashHalfArcs: [1, 4, 2, 7, 5, 8, 9, 3].map(q),
  // the CRM dashboard (1511:29921, dark 1523:33173): its funnel one colour
  // faded, its wash the frame's own amber (chart-tokens.css)
  crmStages: [q(1), q(3), q(5), q(4)],
  crmFunnel: [q(5)],
  crmLines: [q(4), q(5)],
  crmWash: ['--chart-crm-wash'],
  crmProgress: [q(5)],
  // both frames edge the meetings in four Diverging steps
  crmMeetings: [d(1), d(8), d(9), d(7)],
}

const DIVERGING: ThemeRoles = {
  bar: [d(7)],
  stack: [d(1), d(3), d(4), d(2)],
  stackLabelled: [d(8), d(7), d(6), d(3)],
  group: [d(1), d(2), d(3), d(4)],
  line: [d(2)],
  markers: [d(2)],
  lines: [d(2), d(8)],
  steps: [d(8), d(1), d(7), d(2)],
  scatter: [d(8)],
  scatters: [d(1), d(7), d(9), d(2)],
  // CHANNELS order: organic, paid, Facebook, referral, others; the file's
  // legend names organic D2 and paid D1 (1462:25583)
  channels: [d(2), d(1), d(3), d(7), d(8)],
  bubble: [d(1)],
  bubbles: [d(1), d(2), d(8), d(3)],
  // the file's Spectral legend: red at the low end, blue at the high
  map: [9, 8, 7, 6, 5, 4, 3, 2, 1].map(d),
  heat: [d(2), d(3), d(5), d(7), d(6)],
  funnel: [d(2)],
  funnelSteps: [d(2)],
  pie: [d(1), d(7), d(2), d(8), d(3)],
  doughnut: [d(2), d(8), d(3), d(1), d(7)],
  half: [d(2), d(7), d(6), d(8), d(1), d(4), d(3), d(9)],
  // the nested pie's rings widest first (1534:45075); the fifth is bound to
  // Qualitative 6 in the file, an orange the diverging ramp does not have
  rose: [d(1), q(6), d(2), d(8), d(3), d(7)],
  area: [d(2)],
  // bottom to top, the lowest two both D1 (1462:26080)
  areas: [d(1), d(1), d(2), d(3)],
  stepped: [d(1), d(2), d(7), d(9)],
  spark: [d(2)],
  annotation: [d(8)],
  // the cards the Diverging frame colours on their own (1462:24955)
  stackPercent: [d(1), d(2), d(3), d(4)],
  dual: [d(6), d(8)],
  horizontal: [d(2)],
  channelsStacked: [d(2), d(1), d(3), d(6), d(7)],
  halfArcs: [d(2), d(8), d(6), d(3), d(7), d(4), d(9), d(1)],
  // the dashboard, read off the Diverging frames (1507:25827, dark
  // 1524:40266)
  dashSparks: [d(8), d(7), d(1), d(2), d(9)],
  dashLine: [d(1)],
  dashLines: [d(1), d(8), d(3)],
  dashAreas: [d(6), d(7)],
  dashGradient: [d(2), d(7), d(1)],
  dashBar: [d(2)],
  dashCountries: [d(1), d(2)],
  dashRing: [1, 2, 3, 4, 6, 7, 8, 9].map(d),
  dashStack: [2, 1, 7, 9, 3, 8, 6, 4].map(d),
  dashFunnel: [d(2)],
  dashHalf: [1, 2, 3, 6, 4, 7, 8, 9].map(d),
  dashHalfArcs: [1, 2, 3, 6, 4, 7, 8, 9].map(d),
  // the CRM dashboard (1511:27161, dark 1524:41285)
  crmStages: [d(2), d(1), d(9), d(7)],
  crmFunnel: [d(2)],
  crmLines: [d(9), d(2)],
  crmWash: ['--chart-crm-wash'],
  crmProgress: [d(1)],
  // both frames edge the meetings in four Diverging steps
  crmMeetings: [d(1), d(8), d(9), d(7)],
}

/** what a theme draws a card with when it names no colours of its own for it */
export const OWN_ROLE_FALLBACK: Record<OwnRole, (r: ThemeRoles) => string[]> = {
  stackPercent: (r) => r.stack,
  dual: (r) => [r.bar[0], r.markers[0]],
  horizontal: (r) => r.bar,
  channelsStacked: (r) => r.channels,
  // the arcs carry the half ring's own ramp, at Ocean's steps
  halfArcs: (r) => HALF_ARCS.map((a) => r.half[a.step % r.half.length]),
  sparkWash: (r) => r.spark,
  dashSparks: (r) => [r.line[0], ...Array(4).fill(r.markers[0])],
  dashLine: (r) => r.line,
  dashLines: (r) => r.steps.slice(0, 3),
  dashAreas: (r) => r.areas.slice(0, 2),
  dashGradient: (r) => r.steps.slice(0, 3),
  dashBar: (r) => r.bar,
  dashCountries: (r) => [r.bar[0], r.markers[0]],
  dashRing: (r) => r.half,
  dashStack: (r) => r.half,
  dashFunnel: (r) => [r.funnel[Math.min(1, r.funnel.length - 1)]],
  dashHalf: (r) => r.half,
  dashHalfArcs: (r) => HALF_ARCS.map((a) => r.half[a.step % r.half.length]),
  crmStages: (r) => r.stack,
  crmFunnel: (r) => r.funnel,
  crmLines: (r) => r.lines,
  crmWash: (r) => r.bar,
  crmProgress: (r) => r.bar,
  crmMeetings: () => [],
}

export const THEME_ROLES: Record<ChartTheme, ThemeRoles> = {
  ocean: OCEAN,
  mist: MIST,
  earthy: EARTHY,
  qualitative: QUALITATIVE,
  diverging: DIVERGING,
}

/**
 * The funnel's opacity per step: every theme fades its colours in from a
 * fifth to full down all three cards — Ocean its five variables, the others
 * their one (1413:25979, 1462:26746, 1048:58296, 961:35579 and their rows).
 */
export const FUNNEL_OPACITY: Record<ChartTheme, number[]> = {
  ocean: [0.2, 0.4, 0.6, 0.8, 1],
  mist: [0.2, 0.4, 0.6, 0.8, 1],
  earthy: [0.2, 0.4, 0.6, 0.8, 1],
  qualitative: [0.2, 0.4, 0.6, 0.8, 1],
  diverging: [0.2, 0.4, 0.6, 0.8, 1],
}

/**
 * The columns card's opacity per step. Ocean stands its first column, its
 * lightest variable, at full colour; the others keep the ladder there too,
 * the first column at a fifth like the other two cards' first bar.
 */
export const FUNNEL_COLUMN_OPACITY: Record<ChartTheme, number[]> = {
  ocean: [1, 0.4, 0.6, 0.8, 1],
  mist: FUNNEL_OPACITY.mist,
  earthy: FUNNEL_OPACITY.earthy,
  qualitative: FUNNEL_OPACITY.qualitative,
  diverging: FUNNEL_OPACITY.diverging,
}

/**
 * How the CRM dashboard fades a funnel drawn in one colour (1511:29921,
 * 1511:27161): a tenth at the first step, then 0.3, 0.5, 0.7 and the colour
 * itself. A theme that gives each step its own colour (Ocean) is not faded.
 */
export const CRM_FUNNEL_OPACITY = [0.1, 0.3, 0.5, 0.7, 1]

/**
 * How thick the CRM dashboard lays the wash behind a top deal's value. Ocean's
 * is its deep blue laid thin, which is its light blue on white and a tint in
 * the dark; Qualitative and Diverging draw a wash of their own at full.
 */
export const CRM_WASH_OPACITY: Record<ChartTheme, number> = {
  ocean: 0.17,
  mist: 0.17,
  earthy: 0.17,
  qualitative: 1,
  diverging: 1,
}
