# The chart engine composable is public, and what freezes with it

**Status**: accepted

## Context

`frappe-ui/charts` exports five members that are not components:
`useChart`, `registerChartModules`, and the types `UseChartArgs`,
`UseChartReturn` and `ChartEventHandlers` (`src/charts/index.ts:22-27`,
`core/useChart.ts:26-49`). They are the seam a plot the library does not draw
is built on, and the charts overview teaches them under "Custom charts".

Three of the five name echarts types. `UseChartArgs.option` returns
`EChartsCoreOption`, `UseChartReturn.chart` is a `ShallowRef<ECharts>`, and
`registerChartModules` is echarts' own `use`, re-exported under a frappe-ui
name. [ADR-0016](./0016-charts-expose-echarts-instance.md) permitted exactly one
echarts leak, the `chart` template ref, and called it the last one. Read
strictly, these five are a second.

The v1 RC API audit raised it as a decision for the `1.0.0` freeze
([#1139](https://github.com/frappe/frappe-ui/issues/1139), item 1): park them
behind `frappe-ui/experimental`, freeze them with an ADR, or wrap them in owned
types.

## Decision

**The five stay on `frappe-ui/charts` and freeze there at `1.0.0`.**

### The echarts types are not a new leak

[ADR-0014](./0014-flat-props-name-columns.md) made `echartOptions` the
declarative escape hatch, and it deep-merges into echarts' option shape at four
levels on every chart. An echarts major that renames an option key already
breaks consumers through the components themselves. `UseChartArgs.option`
returning `EChartsCoreOption` adds no coupling the stable entry does not carry,
and `UseChartReturn.chart` is the same `ECharts` object ADR-0016 already
accepted.

So this is not a second exception to `imperative-api.md` §2.4. It is the same
one, reached through a composable instead of a template ref. ADR-0016's "last
named exception" still holds: no third object crosses the boundary.

### What `useChart` promises, and what it does not

frappe-ui owns the composable's **shape and lifecycle**:

- `useChart` creates the instance once the container has a size and the fonts
  settle, follows resizes through a `ResizeObserver`, disposes on unmount, and
  honours `prefers-reduced-motion`.
- The SVG renderer is registered for every plot. Canvas is not, and adding it is
  the caller's `registerChartModules` call.
- `option` is a getter, so its reactive dependencies drive `setOption`. `events`
  and `onZrEvents` are bound once at init. A handler map swapped later is never
  read.
- `registerChartModules` is echarts' `use`. It takes echarts modules and returns
  nothing, which is why it is not named `register` or given a frappe-ui
  signature: pretending it is ours would hide where its argument types come
  from.

frappe-ui does **not** own `EChartsCoreOption`, `ECharts`, or the module objects
`registerChartModules` takes. Those are echarts', they move with the echarts
dependency, and a major bump can change them inside a frappe-ui minor. This is
the same sentence ADR-0016 writes about the template ref, and it is the whole
difference between freezing a name and freezing a third party's API.

### Why not a wrapper of owned types

Two call sites exist: the `CustomRadar` docs story, and Insights' map chart,
which calls `registerChartModules([MapSeries])` to add a series type echarts
ships and the library does not draw. Both want echarts' own vocabulary, because
the thing they are adding is an echarts module.

An owned wrapper designed from two cases would be a guess, and a guess frozen
until `2.0.0`. The library already knows what happens when it wraps a third
party's surface it does not promise: ADR-0016 rejected exactly that for the
instance.

### Why not `frappe-ui/experimental`

It splits one task across two entry points. An app drawing a custom plot imports
`ChartContainer`, `ChartLegend`, `ChartTooltip`, `ChartCard` and `useChartTokens`
from `frappe-ui/charts` and would import the composable that draws the plot from
somewhere else. The chrome and the plot are one job, and
[ADR-0010](./0010-subpath-export-rule.md) earns a subpath by cost isolation, an
extensible registry or a name collision — none of which this is. Organization
alone is explicitly not a reason.

## Considered alternatives

- **Rename `registerChartModules` to `use`.** Matches echarts exactly, and
  collides with the plainest possible name at a package boundary. Rejected; the
  doc comment says it is `use` instead.
- **Return an owned option type.** The builders generate `EChartsCoreOption`
  internally. A parallel type would either be that type renamed, or a second
  spelling of it — convention 4's failure.
- **Deleting the exports.** The chrome would still be exported and a custom plot
  would still be buildable, by hand-rolling the resize, disposal and font-settle
  logic `useChart` exists to get right once. That pushes every caller into a
  worse copy of the library's own code, which is the reasoning ADR-0016 used
  against deleting `ChartExposed`.

## Consequences

- `useChart`, `registerChartModules`, `UseChartArgs`, `UseChartReturn` and
  `ChartEventHandlers` cannot be renamed or removed before `2.0.0`.
- Their lifecycle behaviour is contract and is documented in the charts
  overview. The echarts types they carry are not.
- A sixth engine export needs a fresh ADR, on the same footing ADR-0016 puts a
  second `ChartExposed` member.
