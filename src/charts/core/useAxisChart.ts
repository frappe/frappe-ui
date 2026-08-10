import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { EChartsCoreOption } from 'echarts/core'
import { useChart } from './useChart'
import { usePlotKeyboard } from './usePlotKeyboard'
import type { AxisChartOptionContext } from '../axisChartCommon'
import {
  hasSecondaryValueAxis,
  plotRows,
  resolveSeriesColors,
  resolveXAxis,
} from '../axisChartCommon'
import { applyAxisFormatters } from '../axisFormat'
import { pruneHiddenSeries, toggleHiddenSeries } from '../hiddenSeries'
import type { AxisChartFormatters } from '../seriesData'
import { formatAxisValue, formatLabel, formatValue } from '../format'
import { useChartTokens } from '../tokens'
import { documentDir, markName, plotReading } from '../utils'
import type {
  AxisChartBaseConfig,
  AxisChartSeriesConfig,
  ChartDatapointEvent,
  ChartLegendItem,
  ChartTooltipItem,
  PlotLabelPlacement,
} from '../types'

export type UseAxisChartArgs<C extends AxisChartBaseConfig> = {
  config: () => C
  buildOption: (config: C, context: AxisChartOptionContext) => EChartsCoreOption
  /** Axis label and tooltip formatters, kept beside the config by `normalizeAxisChartProps`. */
  format?: () => AxisChartFormatters
  /** True when the category axis is the Y axis, as for horizontal bars. */
  horizontal?: () => boolean
  /**
   * The visibility list to read and write. A `v-model:hiddenSeries` ref makes
   * the caller the source of truth; left out, the legend manages it here.
   */
  hiddenSeries?: Ref<string[]>
  /**
   * Each series' share of its stack, row by row — what a normalized chart
   * plots. The tooltip keeps reading the real number and prints the share
   * beside it, so the reader gets both.
   */
  stackShares?: () => Map<string, (number | null)[]>
  onSelect?: (event: ChartDatapointEvent) => void
}

/**
 * Everything a cartesian chart does around its option builder: lifecycle, theme,
 * legend state and the hit-testing behind the HTML tooltip. Bar, line and area
 * differ only in the builder they hand in, so their interactions stay identical.
 */
export function useAxisChart<C extends AxisChartBaseConfig>(
  args: UseAxisChartArgs<C>,
) {
  const plotEl = ref<HTMLElement>()
  const hiddenSeries = args.hiddenSeries ?? ref<string[]>([])

  const config = computed(args.config)
  const format = computed<AxisChartFormatters>(() => args.format?.() ?? {})
  const horizontal = computed(() => Boolean(args.horizontal?.()))
  const stackShares = computed(() => args.stackShares?.())
  const dir = computed(() => config.value.dir ?? documentDir())
  // Same resolution the option builder runs, so the hit-testing and the tooltip
  // read the axis the way it is actually drawn — and the same row list, so a
  // datapoint index means the same row on both sides.
  const xAxis = computed(() => resolveXAxis(config.value, horizontal.value))
  const xAxisType = computed(() => xAxis.value.type)
  const rows = computed(() => plotRows(config.value, xAxisType.value, true))
  const isEmpty = computed(
    () => !rows.value.length || !config.value.series.length,
  )

  // Value-axis titles are chrome, not echarts axis names. The title heads the
  // edge its axis is drawn on: on a row chart the top-left belongs to the
  // category labels, so a title there would name the wrong axis.
  const plotLabelPlacement = computed<PlotLabelPlacement>(() =>
    horizontal.value ? 'bottom' : 'top',
  )
  const plotLabel = computed(() =>
    config.value.yAxis?.title
      ? formatLabel(config.value.yAxis.title)
      : undefined,
  )
  const plotLabelSecondary = computed(() =>
    config.value.y2Axis?.title &&
    hasSecondaryValueAxis(config.value, horizontal.value)
      ? formatLabel(config.value.y2Axis.title)
      : undefined,
  )

  const { tokens } = useChartTokens(plotEl)
  const seriesColors = computed(() =>
    resolveSeriesColors(config.value, tokens.value),
  )

  // A malformed config throws while building the option; surfacing it as an
  // error state beats letting it bubble out of a render and blank the whole page.
  const built = computed(() => {
    try {
      return {
        option: args.buildOption(
          applyAxisFormatters(
            { ...config.value, dir: dir.value },
            format.value,
          ),
          {
            tokens: tokens.value,
            hiddenSeries: hiddenSeries.value,
            width: plotWidth.value,
          },
        ),
        error: null as string | null,
      }
    } catch (e: any) {
      return { option: undefined, error: e?.message ?? String(e) }
    }
  })

  const renderError = computed(() => built.value.error)

  const {
    chart,
    dispatch,
    width: plotWidth,
  } = useChart({
    container: plotEl,
    option: () => built.value.option,
    events: {
      click: (params: any) => {
        const row = rows.value[params.dataIndex]
        if (!row) return
        args.onSelect?.({
          seriesName: params.seriesName,
          dataIndex: params.dataIndex,
          value: Number(row[params.seriesName]),
          row,
        })
      },
    },
    onZrEvents: {
      mousemove: (e: any) => updateTooltip(e.offsetX, e.offsetY, e.event),
      globalout: () => {
        tooltip.open = false
      },
    },
  })

  const legendItems = computed<ChartLegendItem[]>(() =>
    config.value.series.map((series) => ({
      name: series.name,
      label: seriesLabel(series),
      color: seriesColors.value[series.name],
      hidden: hiddenSeries.value.includes(series.name),
    })),
  )

  function seriesLabel(series: AxisChartSeriesConfig) {
    return series.label ?? formatLabel(series.name)
  }

  // A series reads in the units of the axis it is actually drawn against, so
  // `y2` series never fall back to the primary formatter — except on a
  // horizontal chart, which has no second axis to put them on.
  function formatSeriesValue(series: AxisChartSeriesConfig, value: number) {
    const secondary = series.axis === 'y2' && !horizontal.value
    const formatter = secondary ? format.value.y2 : format.value.y
    return formatter ? formatter(value) : formatValue(value)
  }

  function toggleSeries(name: string) {
    hiddenSeries.value = toggleHiddenSeries(
      hiddenSeries.value,
      name,
      config.value.series.length,
    )
  }

  // Legend hover is the only thing that emphasises a series. Pointing at the
  // plot deliberately does not — the axis pointer and tooltip already read out
  // the category, and dimming on every mouse move costs more than it says.
  const hoveredSeries = ref<string | null>(null)
  function hoverSeries(name: string | null) {
    hoveredSeries.value = name
  }

  watch(hoveredSeries, (name, previous) => {
    if (previous) dispatch({ type: 'downplay', seriesName: previous })
    if (name && !hiddenSeries.value.includes(name)) {
      dispatch({ type: 'highlight', seriesName: name })
    }
  })

  const tooltip = reactive({
    open: false,
    x: 0,
    y: 0,
    label: undefined as string | undefined,
    items: [] as ChartTooltipItem[],
  })

  /**
   * The hovered index comes from a pixel-to-value conversion rather than
   * echarts' `updateAxisPointer` payload, because that payload reports the axis
   * *value*, which differs in shape between a category axis and a scaled one.
   */
  function hoveredIndex(offsetX: number, offsetY: number): number | null {
    const instance = chart.value
    if (!instance) return null

    if (!instance.containPixel({ gridIndex: 0 }, [offsetX, offsetY]))
      return null

    // A single-axis finder converts one pixel coordinate, not a point: handing
    // it an [x, y] pair makes echarts return null.
    const finder = horizontal.value ? { yAxisIndex: 0 } : { xAxisIndex: 0 }
    const value = instance.convertFromPixel(
      finder,
      horizontal.value ? offsetY : offsetX,
    ) as unknown as number
    if (value === null || value === undefined || isNaN(value)) return null

    if (xAxisType.value === 'category') {
      const index = Math.round(value)
      return index >= 0 && index < rows.value.length ? index : null
    }

    // A time or value axis converts to a coordinate rather than to a slot
    // index, so what is being pointed at is the row nearest along that scale.
    // One reading for both: they differ only in what turns a cell into a number.
    const key = config.value.xAxis.key
    return nearestOnScale(value, (row) =>
      xAxisType.value === 'value'
        ? Number(row[key])
        : new Date(row[key]).getTime(),
    )
  }

  function nearestOnScale(
    target: number,
    coordinate: (row: Record<string, any>) => number,
  ): number | null {
    let best: number | null = null
    let bestDistance = Infinity
    rows.value.forEach((row, index) => {
      const at = coordinate(row)
      if (isNaN(at)) return
      const distance = Math.abs(at - target)
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    return best
  }

  function updateTooltip(
    offsetX: number,
    offsetY: number,
    nativeEvent?: MouseEvent,
  ) {
    const index = hoveredIndex(offsetX, offsetY)
    if (index === null) {
      tooltip.open = false
      return
    }
    showIndex(index, nativeEvent?.clientX, nativeEvent?.clientY)
  }

  function showIndex(index: number, clientX?: number, clientY?: number) {
    const row = rows.value[index]
    const items = config.value.series
      .filter((series) => !hiddenSeries.value.includes(series.name))
      .map((series) => ({
        name: series.name,
        label: seriesLabel(series),
        color: seriesColors.value[series.name],
        value: Number(row[series.name]),
        formattedValue: formatSeriesValue(series, Number(row[series.name])),
        // A normalized plot draws the share, so the tooltip is the only place
        // the measured number survives — it carries both.
        percent: stackShares.value?.get(series.name)?.[index] ?? undefined,
      }))
      // A series that silently drops out of the tooltip reads as a bug, so a
      // zero stays. Only a blank cell is dropped. Biggest contributor first.
      .filter((item) => !isNaN(item.value))
      .sort((a, b) => b.value - a.value)

    if (!items.length) {
      tooltip.open = false
      return
    }

    const category = row[config.value.xAxis.key]
    tooltip.label = format.value.x
      ? format.value.x(category)
      : formatAxisValue(category, xAxis.value.type, xAxis.value.timeGrain)
    tooltip.items = items
    tooltip.x = clientX ?? tooltip.x
    tooltip.y = clientY ?? tooltip.y
    tooltip.open = true
  }

  // --- Keyboard ------------------------------------------------------------
  // The plot is one tab stop; the arrow keys walk it. Left and right step along
  // the category axis, up and down pick the series the click event carries —
  // the tooltip lists every series at once, so without that a multi-series
  // chart would have no way to say which one Enter means.

  const visibleSeries = computed(() =>
    config.value.series.filter(
      (series) => !hiddenSeries.value.includes(series.name),
    ),
  )
  const cursorSeries = ref(0)

  /**
   * Where a category sits on screen, so the tooltip hangs off the mark rather
   * than off the middle of the plot. Falls back to the plot's center when the
   * axis cannot convert — an empty scale, or a chart that has not laid out yet.
   */
  function categoryPoint(index: number) {
    const el = plotEl.value
    if (!el) return undefined
    const rect = el.getBoundingClientRect()
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    const along = convertCategory(index)
    if (along === undefined) return center
    return horizontal.value
      ? { x: center.x, y: rect.top + along }
      : { x: rect.left + along, y: center.y }
  }

  function convertCategory(index: number): number | undefined {
    const instance = chart.value
    if (!instance) return undefined
    const finder = horizontal.value ? { yAxisIndex: 0 } : { xAxisIndex: 0 }
    const key = config.value.xAxis.key
    const row = rows.value[index]
    // A category axis is addressed by slot, a scaled one by the value itself.
    const at =
      xAxisType.value === 'category'
        ? index
        : xAxisType.value === 'value'
          ? Number(row?.[key])
          : new Date(row?.[key]).getTime()
    if (typeof at !== 'number' || isNaN(at)) return undefined
    const pixel = instance.convertToPixel(finder, at) as unknown as number
    return typeof pixel === 'number' && !isNaN(pixel) ? pixel : undefined
  }

  /** The reading the live region carries, i.e. the tooltip as one line. */
  const reading = ref('')

  function readCursor(index: number) {
    const point = categoryPoint(index)
    showIndex(index, point?.x, point?.y)
    if (!tooltip.open) {
      reading.value = ''
      return
    }
    // One series is the whole tooltip; several, and the reading names the one
    // Enter would fire for rather than repeating the list beside it.
    const series = visibleSeries.value[cursorSeries.value]
    const item = tooltip.items.find((entry) => entry.name === series?.name)
    reading.value = plotReading(
      tooltip.label,
      item
        ? [{ label: item.label, value: item.formattedValue }]
        : tooltip.items.map((entry) => ({
            label: entry.label,
            value: entry.formattedValue,
          })),
    )
  }

  const keyboard = usePlotKeyboard({
    marks: () => rows.value,
    // The category is what the mark is called on the axis, so the cursor holds
    // its place through a sort, a filter or a refetch.
    key: (row) => markName(row[config.value.xAxis.key]),
    move: (index) => {
      cursorSeries.value = Math.min(
        cursorSeries.value,
        Math.max(0, visibleSeries.value.length - 1),
      )
      readCursor(index)
    },
    cross: (delta) => {
      const last = visibleSeries.value.length - 1
      cursorSeries.value = Math.min(
        last,
        Math.max(0, cursorSeries.value + delta),
      )
      if (keyboard.index.value !== null) readCursor(keyboard.index.value)
    },
    activate: (index) => {
      const row = rows.value[index]
      const series = visibleSeries.value[cursorSeries.value]
      if (!row || !series) return
      args.onSelect?.({
        seriesName: series.name,
        dataIndex: index,
        value: Number(row[series.name]),
        row,
      })
    },
    clear: () => {
      tooltip.open = false
      reading.value = ''
    },
  })

  // The reading names the series Enter would fire for, and the tooltip lists
  // the visible ones. A legend toggle under a reader who is on the plot has to
  // reach both, which the row list alone does not say.
  watch(visibleSeries, () => keyboard.refresh(), { flush: 'post' })

  // Series that disappear while hidden shouldn't stay in the hidden list forever.
  watch(
    () => config.value.series.map((s) => s.name),
    (names) => {
      hiddenSeries.value = pruneHiddenSeries(hiddenSeries.value, names)
    },
  )

  return {
    plotEl,
    chart,
    dir,
    isEmpty,
    plotLabel,
    plotLabelSecondary,
    plotLabelPlacement,
    renderError,
    tooltip,
    legendItems,
    toggleSeries,
    hoverSeries,
    /** `v-bind` onto the plot element: the tab stop and its arrow keys. */
    plotAttrs: keyboard.attrs,
    /** What the live region announces while the cursor walks the plot. */
    reading,
  }
}
