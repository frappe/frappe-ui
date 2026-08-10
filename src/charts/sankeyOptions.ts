import type { EChartsCoreOption } from 'echarts/core'
import { BLUR_OPACITY, DATA_LABEL_FONT_SIZE, toNumber } from './axisChartCommon'
import { formatValue } from './format'
import { CHART_FONT_FAMILY } from './measureText'
import { chartColors, type ChartTokens } from './tokens'
import { mergeDeep } from './utils'
import type {
  ChartPaletteName,
  ChartValueFormatter,
  SankeyChartConfig,
  SankeyGraph,
  SankeyLink,
} from './types'

// Plot, labels and tooltip all read the same `SankeyGraph`, so the band under
// the pointer can't disagree with the one the option drew.

export type SankeyOptionContext = {
  tokens: ChartTokens
  /** Prints a flow wherever a number is printed: node labels, tooltip. */
  format?: ChartValueFormatter
}

const SANKEY_PALETTE: ChartPaletteName = 'categorical'

/** Node thickness in px. Slimmer than the echarts default, which reads as a bar. */
const NODE_WIDTH = 12
const NODE_GAP = 10

/** Alpha of a band. Bands cross, so they have to read through each other. */
const LINK_OPACITY = 0.4
/** Just enough bend to tell two crossing bands apart at a glance. */
const LINK_CURVENESS = 0.1

/** Room for the labels, which hang off the last column of nodes. */
const PLOT_INSET = '5%'
const LABEL_INSET = '10%'

const BLANK_NODE = '(Blank)'

/**
 * The flow as a graph. Nodes are the de-duplicated union of the source and
 * target columns, in the order the rows first mention them, and every kept row
 * becomes one link — so a click on a band leads back to the row behind it.
 */
export function buildSankeyGraph(
  config: SankeyChartConfig,
  { tokens }: SankeyOptionContext,
): SankeyGraph {
  const rows = config.data ?? []
  const names: string[] = []
  const registered = new Set<string>()
  /** Kept links only, so the reachability check never walks a dropped edge. */
  const outgoing = new Map<string, Set<string>>()

  const register = (name: string) => {
    if (registered.has(name)) return
    registered.add(name)
    names.push(name)
  }

  const unpainted: Omit<SankeyLink, 'color'>[] = []

  for (const row of rows) {
    const source = nodeLabel(row[config.sourceColumn])
    const target = nodeLabel(row[config.targetColumn])
    const value = toNumber(row[config.valueColumn])
    // A sankey reads a quantity moving along a band, and a negative one has no
    // band to draw.
    if (value === null || value < 0) continue

    // A link back into what already flows into its source closes a loop, and
    // the layout has no column to put either end in — echarts keeps shuffling
    // the two until it gives up. A node linked to itself is that same case with
    // a path of length zero.
    if (reaches(outgoing, target, source)) {
      if (import.meta.env.DEV) {
        console.warn(
          `[frappe-ui] The link "${source}" → "${target}" closes a cycle in the sankey data. Dropping it; a flow has to move in one direction.`,
        )
      }
      continue
    }

    register(source)
    register(target)
    const targets = outgoing.get(source) ?? new Set<string>()
    targets.add(target)
    outgoing.set(source, targets)

    unpainted.push({ source, target, value, row })
  }

  const colors = chartColors(config.palette, tokens, {
    fallback: SANKEY_PALETTE,
    count: names.length,
  })
  const colorOf = new Map(names.map((name, index) => [name, colors[index]]))

  return {
    nodes: names.map((name) => ({
      name,
      value: throughput(name, unpainted),
      color: colorOf.get(name)!,
    })),
    // The source's color, matching `lineStyle.color: 'source'` in the option:
    // the tooltip swatch has to be the color the band is actually painted in.
    links: unpainted.map((link) => ({
      ...link,
      color: colorOf.get(link.source)!,
    })),
  }
}

/** Whether `to` is already downstream of `from`, `from` itself included. */
function reaches(
  outgoing: Map<string, Set<string>>,
  from: string,
  to: string,
): boolean {
  const stack = [from]
  const visited = new Set<string>()

  while (stack.length) {
    const node = stack.pop()!
    if (node === to) return true
    if (visited.has(node)) continue
    visited.add(node)
    for (const next of outgoing.get(node) ?? []) stack.push(next)
  }

  return false
}

/**
 * What passes through a node. The two sides of an intermediate node are equal
 * in balanced data and not in unbalanced data, so the larger one wins: it is
 * the side that decides how tall echarts draws the node.
 */
function throughput(
  name: string,
  links: { source: string; target: string; value: number }[],
) {
  let incoming = 0
  let leaving = 0
  for (const link of links) {
    if (link.target === name) incoming += link.value
    if (link.source === name) leaving += link.value
  }
  return Math.max(incoming, leaving)
}

function nodeLabel(value: any) {
  return value === null || value === undefined || value === ''
    ? BLANK_NODE
    : String(value)
}

export function buildSankeyOption(
  config: SankeyChartConfig,
  context: SankeyOptionContext,
): EChartsCoreOption {
  const { tokens, format } = context
  const graph = buildSankeyGraph(config, context)
  const isVertical = config.orient === 'vertical'

  const option = {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: CHART_FONT_FAMILY },
    // No `tooltip` key and no TooltipComponent: a sankey has no axis pointer to
    // drive, and the visible tooltip is a Vue component (ChartTooltip).
    series: [
      {
        type: 'sankey',
        name: config.valueColumn,
        orient: isVertical ? 'vertical' : 'horizontal',
        nodeAlign: config.nodeAlign ?? 'justify',
        top: PLOT_INSET,
        bottom: PLOT_INSET,
        left: PLOT_INSET,
        // The labels of the last column hang past the nodes, and the end they
        // hang off is the end the flow arrives at.
        right: isVertical ? PLOT_INSET : LABEL_INSET,
        nodeWidth: NODE_WIDTH,
        nodeGap: NODE_GAP,
        // The layout is the reading; dragging a node edits it.
        draggable: false,
        label: {
          show: true,
          // A vertical node is a wide bar, so a label beside it would sit over
          // its neighbour instead of next to it.
          position: isVertical ? 'top' : 'right',
          color: tokens.dataLabel,
          fontSize: DATA_LABEL_FONT_SIZE,
          formatter: (params: any) =>
            `${params.name} · ${printValue(Number(params.value), format)}`,
        },
        // A flow is read by following it: hovering one band lifts the whole
        // path it belongs to and pushes the rest of the graph back.
        emphasis: { focus: 'adjacency' },
        blur: {
          itemStyle: { opacity: BLUR_OPACITY },
          lineStyle: { opacity: LINK_OPACITY * BLUR_OPACITY },
          label: { opacity: BLUR_OPACITY },
        },
        lineStyle: {
          color: 'source',
          opacity: LINK_OPACITY,
          curveness: LINK_CURVENESS,
        },
        data: graph.nodes.map((node) => ({
          name: node.name,
          value: node.value,
          itemStyle: { color: node.color, borderWidth: 0 },
        })),
        links: graph.links.map((link) => ({
          source: link.source,
          target: link.target,
          value: link.value,
        })),
      },
    ],
  }

  return mergeDeep(option, config.echartOptions)
}

/** A node label sits in the gap beside the plot, so it reads shortened. */
function printValue(value: number, format?: ChartValueFormatter) {
  return format ? format(value) : formatValue(value, 1, true)
}
