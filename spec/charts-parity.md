# Charts v2 — parity audit vs legacy charts

Audited 2026-08-01, comparing `src/components/Charts` (v1) against `src/charts` (v2).
Dual axis (`y2Axis` + `series.axis`) has landed since the audit, as has `HeatmapChart`,
which v1 never had.

## Missing components

1. **Raw `ECharts` wrapper** — v1's documented escape hatch for chart types we don't
   ship (gauge, sankey, …). v2 only has the `useChart` composable. Low effort, high
   importance.
2. **Combo charts** — v1's `AxisChart` mixed `bar`/`line`/`area` series in one chart;
   v2 components are homogeneous. Combo + y2 is the canonical "sales vs growth rate"
   chart and the main reason y2 exists. Medium-high effort, high importance.
3. `useAxisChartOptions` export — replaced by per-chart builders with a different
   signature. Document the rename.

## Missing / changed config API

- `xAxis.type: 'value'` (numeric x) — **missing**; v2 supports category|time only.
  Hit-testing assumes category index or timestamp. Medium effort/importance.
- `yAxis.yMin/yMax` → renamed `min`/`max`; `swapXY` → `horizontal` (bar-only, matches
  v1's real support).
- `connectNulls` default flipped: v1 always `true`, v2 `false` with opt-in.
  **Migration-visible.**
- `showDataLabels` no longer implies visible line points.
- `yAxis.title` is HTML chrome now — `yAxis.echartOptions.name` overrides are no-ops.
- Funnel and NumberCard carry no echarts at all, so they have no `echartOptions`
  escape hatch and expose no chart instance.
- Funnel: hand-drawn SVG rather than an echarts series; `showPercentages`
  default flipped to true with different placement; draw order is data order, not
  forced descending.
- NumberCard: `deltaPrefix` missing (currency deltas); v1's HTML/icon `prefix`
  (v-html) missing — needs a `prefix` slot; value formatting default changed from
  always-compact to full-precision unless `compact`. **Migration-visible.**
- Donut: full parity (`maxSliceCount` → `maxSlices`, now actually implemented).

## Missing / changed behaviors

1. Raw echarts click payload (`events.click`) gone — typed events only; raw instance
   is exposed via `defineExpose({ chart })`, document it.
2. Legend paginates in v1 (echarts scroll), wraps/scrolls vertically in v2.
3. In-canvas title/subtitle removed — `echartOptions.title` is inert.
4. `formatDate` signature swapped (grain/format order) + grain format strings changed.
   Silent breakage for positional callers.
5. `formatValue(NaN)`: "NaN" → ""; shorten precision default 0 → 1.
6. v1 forced `min-w-[300px] min-h-[300px]`; v2 fills parent with no floor — apps
   relying on intrinsic minimums render 0-height.
7. NumberChart's `body`/`title`/`subtitle`/`delta` slots gone (v2: actions/empty/caption).
8. v2 NumberCard ships its own card chrome; v1 was an unstyled block.

## Missing integration / docs

1. **Not exported from main entry** — v2 is `frappe-ui/charts` subpath only
   (deliberate: keeps echarts out of the main bundle; decide + document).
2. **No docs page / stories** — `src/charts` is in neither `sourceRoots` nor
   `colocatedRoots` in docs/.vitepress/config.ts. Biggest adoption blocker.
3. `frappe-ui/charts-style.css` import requirement undocumented.
4. Stale v1 references: `docs/content/public/llms.txt`, `docs/components/Home/ComponentGroups.vue`.
5. No `@deprecated` tags or legacy.md entry for v1 exports.

## v2 is ahead (do not regress)

Empty/loading/error states; the finalized palettes — Jewel categorical, the sequential
blue ramp and a softened RdYlBu diverging ramp — theme-reactive with dark derived from
light slot for slot; a `HeatmapChart` v1 never had; legend toggle/hover;
HTML tooltips with slots; donut Others grouping + half variant; working stacked areas;
per-series stackName; NumberCard sparkline + count-up; typed events; unit tests;
types exported from the package entry.
