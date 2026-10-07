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

export type ThemeRoles = Record<ThemeRole, string[]>

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
  channels: [
    m('graphite'),
    m('harboar'),
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
  heat: [m('rosewood'), m('limestone'), m('apricot'), m('dune')],
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
}

const EARTHY: ThemeRoles = {
  bar: [e('terracotta')],
  stack: [e('moss'), e('olive'), e('dune'), e('terracotta')],
  stackLabelled: [e('moss'), e('olive'), e('dune'), e('terracotta')],
  group: [e('stone'), e('terracotta'), e('dune'), e('wheat')],
  line: [e('moss')],
  markers: [e('moss')],
  lines: [e('terracotta'), e('moss')],
  steps: [e('dune'), e('moss'), e('clay'), e('stone')],
  scatter: [e('dune')],
  scatters: [e('clay'), e('olive'), e('dune'), e('stone')],
  channels: [e('moss'), e('olive'), e('dune'), e('terracotta'), e('wheat')],
  bubble: [e('olive')],
  bubbles: [e('moss'), e('sand'), e('clay'), e('olive')],
  map: [
    e('moss'),
    e('olive'),
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
  channels: [q(1), q(3), q(6), q(8), q(5)],
  bubble: [q(4)],
  bubbles: [q(1), q(3), q(6), q(7)],
  map: [1, 2, 3, 4, 5, 6, 7, 8].map(q),
  heat: [q(1), q(7), q(2), q(4), q(6)],
  funnel: [q(1)],
  funnelSteps: [q(1)],
  pie: [q(1), q(4), q(7), q(5), q(2)],
  doughnut: [q(1), q(4), q(7), q(5), q(2)],
  half: [1, 2, 3, 4, 5, 6, 7, 8].map(q),
  rose: [q(1), q(2), q(3), q(7), q(5), q(4)],
  area: [q(4)],
  areas: [q(5), q(1), q(3), q(8)],
  stepped: [q(1), q(3), q(4), q(6)],
  spark: [q(5)],
  annotation: [q(5)],
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
  channels: [d(1), d(2), d(3), d(7), d(8)],
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
  rose: [d(7), d(3), d(8), d(2), d(5), d(1)],
  area: [d(2)],
  areas: [d(1), d(2), d(3), d(3)],
  stepped: [d(1), d(2), d(7), d(9)],
  spark: [d(2)],
  annotation: [d(8)],
}

export const THEME_ROLES: Record<ChartTheme, ThemeRoles> = {
  ocean: OCEAN,
  mist: MIST,
  earthy: EARTHY,
  qualitative: QUALITATIVE,
  diverging: DIVERGING,
}

/**
 * The funnel's opacity per step: Ocean fades its five variables in from a
 * fifth to full; every other theme draws one variable at a fifth.
 */
export const FUNNEL_OPACITY: Record<ChartTheme, number[]> = {
  ocean: [0.2, 0.4, 0.6, 0.8, 1],
  mist: [0.2, 0.2, 0.2, 0.2, 0.2],
  earthy: [0.2, 0.2, 0.2, 0.2, 0.2],
  qualitative: [0.2, 0.2, 0.2, 0.2, 0.2],
  diverging: [0.2, 0.2, 0.2, 0.2, 0.2],
}
