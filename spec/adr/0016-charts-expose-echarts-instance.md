# Charts hand back the echarts instance

**Status**: accepted

## Context

Seven components in `src/charts/` hand back the echarts instance through a
template ref — `AreaChart.vue:143`, `BarChart.vue:147`, `DonutChart.vue:370`,
`HeatmapChart.vue:245`, `LineChart.vue:143`, `SankeyChart.vue:225` and
`ScatterChart.vue:321`, each calling
`defineExpose<ChartExposed>({ chart: computed(() => chart.value) })`.
`ChartExposed` lives at `src/charts/types.ts:8-11` and is exported from
`src/charts/index.ts:79`.

The **form** is what [`imperative-api.md`](../imperative-api.md) §2.5 asks for: a
generic on `defineExpose`, never `satisfies`, one shared exported type, a
computed rather than a raw ref.

The **content** breaks three clauses of the same document.

- §2.1 — `chart` is not one of the five permitted verbs.
- §2.2 — the surface takes functions, the two element cases in §2.3, and one
  documented computed. That computed was `Editor.isEmpty`.
- §2.4 — "Nothing else hands back a third-party object without an ADR." The
  object is echarts'.

No ADR existed. [`charts.md`](../charts.md) never mentioned the template ref, and
§2.7's disposition table had no chart row.

[ADR-0014](./0014-flat-props-name-columns.md) settled the declarative half of
this question: `echartOptions` is the deep-merge escape hatch, at four levels,
and "a prop that belongs in the library belongs in the library". This ADR settles
the imperative half. It is a `1.0.0` question because whatever ships freezes.

## Decision

**`ChartExposed` stays, on all seven echarts-backed charts.** It is the second
and last named exception to §2.4.

### `echartOptions` reaches every option key and no instance method

The escape hatch is a deep merge into the generated option. It merges at the
chart root (`axisChartOptions.ts:194`, `donutChartOptions.ts:227`,
`sankeyOptions.ts:227`, `heatmapOptions.ts:348`, `scatterOptions.ts:230`), per
axis (`axisChartCommon.ts:299`, `:572`) and per series
(`axisChartOptions.ts:409`), through `mergeDeep` at `utils.ts:21-38`.

So no option key is out of reach. echarts' other half — the methods on the
instance — takes no option key, and nothing on the component surface stands in
for it.

**The evidenced case is an image of the plot.** Insights' own chart wrapper had
it: `BaseChart.vue:65-78` exposes `downloadChart` over
`getDataURL({ type: 'png', pixelRatio: 2 })`. Without a handle, Insights
rasterises the DOM instead — `ChartBuilder.vue:52-63` calls `dom-to-image`'s
`toPng` behind a class-name filter and a `clientHeight` guard
(`helpers/index.ts:151-153`), and the dashboard export does the same
(`DashboardBuilder.vue:64`, `Dashboard.vue:36`). A PNG is not an option key, and
convention 2 keeps a download button out of the library's chrome. The app puts
its own button in the `actions` slot, and that button needs the instance.

Two more, weaker but real. `convertToPixel` and `convertFromPixel` place an app's
own overlay against chart coordinates; the library uses them internally for hit
testing (`useAxisChart.ts:207,213`). `dispatchAction` highlights a series from
outside the chart; the library drives it internally on legend hover
(`useAxisChart.ts:179-188`, `DonutChart.vue:274-276`) and offers no prop for it.
Neither has a site in the bench today.

### Three cases that look like arguments and are not

- **`showTip` / `hideTip`.** The visible tooltip is a Vue component
  (`components/ChartTooltip.vue`) driven by zrender hit-testing. echarts' own
  tooltip draws only the axis pointer (`axisChartCommon.ts:172-183`), so
  `showTip` would not move what a caller means by the tooltip.
- **`resize`, `showLoading` / `hideLoading`, `clear`, `dispose`.** The component
  owns all of them — a `ResizeObserver` at `useChart.ts:108-112,152-156`,
  disposal at `:159-166`, and the `loading` prop with its slot. Calling them from
  outside is redundant or harmful.
- **`dataZoom` and `select` actions.** They need option components the builders
  never emit, so the declarative side blocks them first.
  [ADR-0015](./0015-what-enters-charts.md) leaves `show_scrollbar` open on
  exactly that footing.

### The capability cannot be withheld

The plot is a DOM element echarts initialised (`useChart.ts:134`).
`echarts.getInstanceByDom(el)` hands the same instance to anyone who can reach
that element, with no exposed member at all. Deleting `ChartExposed` would not
remove the capability. It would move it onto markup the library never promised —
the case §2.3 already decided for DOM elements, where pretending otherwise "just
pushes people to `querySelector`, which is worse".

That is what makes this an escape hatch rather than a convenience. A declared
seam with written limits beats an undeclared one that consumers find anyway.

### What consumers may rely on

- The member exists on all seven echarts-backed charts and is the only thing they
  hand back. `FunnelChart` and `NumberCard` draw no echarts plot and hand back
  nothing.
- It is the instance the component draws into, not a copy.
- It is `undefined` until the plot has a size and the fonts settle
  (`useChart.ts:122-129`), and again after unmount (`:159-166`). Watch it; do not
  read it once in `onMounted`.

### What consumers may not rely on

- **State applied through the instance.** The component rebuilds the whole option
  and calls `setOption(next, { notMerge: true })` on every reactive change
  (`useChart.ts:100`). A prop, data or theme change drops any externally
  dispatched highlight or selection, and any hand-written `setOption`. The handle
  is for one-shot reads and actions. State goes in props.
- **The shape of `ECharts`.** It is echarts' type. frappe-ui does not own it and
  may bump echarts' major inside a frappe-ui minor, and whatever that changes
  about this object changes here. The promise is that the member exists and
  carries the live instance. It is not a promise about echarts' API.
- **The generated option.** It is rebuilt per release and it is not API.

### Why a computed, not the raw ref

Vue unwraps refs on the way out of a template ref, so a raw ref reaches the
caller as a plain **writable** value and anyone holding the ref can assign over
the component's instance handle. Assigning to an unwrapped computed fails loudly.
That is §2.2's reason, and it applies here unchanged.

The published type follows the runtime. `ShallowUnwrapRef` applies to the exposed
type, so a caller reading `plot.value.chart` gets `ECharts | undefined` and not a
`ComputedRef` — checked with `vue-tsc` against
`InstanceType<typeof AreaChart>['chart']`. `ScrollArea`'s getter
(`ScrollArea.vue:43-49`) and this computed give the same guarantee.

### It freezes at `1.0.0`

After the tag, `chart` cannot be renamed or removed before `2.0.0`. Accepting it
now accepts it for the whole `1.x` line, echarts major bumps included. **A second
member on `ChartExposed` needs a fresh ADR** — the same limit §2.1 puts on a
sixth verb and §2.3 on a third element role.

## Considered alternatives

- **Delete `ChartExposed`.** The bench has zero call sites: no template ref on
  any v2 chart in insights, crm, helpdesk, builder, gameplan, raven or frappe's
  `ui/` package. A loud break would cost nothing today. Rejected because
  `getInstanceByDom` makes the deletion cosmetic, and because Insights'
  DOM-rasterised export is the workaround the deletion keeps in place.
- **Named verbs instead of the instance** — `downloadImage()`,
  `highlightSeries()`. Rejected. Each is an unproven method frozen until `2.0.0`
  (§2.0), each covers one echarts call out of a long list, and the list grows one
  request at a time — the "four names for one idea" failure §2.3 exists to stop.
  `getDataURL` alone takes a type, a pixel ratio, a background and a list of
  excluded components.
- **A `dispatch()` method** forwarding to `dispatchAction`. Rejected. It is the
  instance with fewer capabilities and a frappe-ui name over echarts' payload
  types, and `notMerge: true` makes dispatched state just as fragile. If the
  instance is the seam, one member is the honest way to say so.
- **A frappe-ui facade over the instance.** Rejected. It turns a third-party
  surface the library does not promise into a frappe-ui surface it does.

## Consequences

- §2.4 now names two exceptions, `Editor.editor` and charts' `chart`.
  `imperative-api.md` §2.7 carries the chart row and `charts.md` records the
  contract.
- **The two "may not rely on" clauses have to reach the docs.** No chart docs
  page mentions the handle today, and the generated API tables have no exposed
  section. That belongs to the charts docs sweep.
- A repeated use of the handle is a feature request, not a second member. Image
  export is the candidate, and [`charts.md`](../charts.md)'s rule decides it.
