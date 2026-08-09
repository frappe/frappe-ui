# Chart props are flat and name the columns

**Status**: accepted

## Context

A chart is configured once and saved. An app stores the chart a user built, then
draws it again later from that stored row. The real constraint on the API is not
how a chart reads in a template. It is whether the whole configuration survives a
round trip through a database.

v1 took a single `config` object, after ECharts. It round-tripped, but it put
every chart behind one opaque bag. The type system could not say which keys a
donut reads, and `series[]` used a series' display name as its identity, so
renaming a series dropped the styling attached to it.

v2 compared four API shapes against that constraint.
[charts.md](../charts.md) holds the conventions the decision produced.

## Decision

A chart is one tag whose props are plain data. Column props are strings that name
columns of `data` — `x`, `y`, `series`, `category`, `value`. Axis options sit in
`xAxis` / `yAxis` / `y2Axis`. Per-series styling sits in `seriesConfig`, keyed by
series identity rather than by display name.

There is no `config` object. A saved chart is one typed object, spread with
`v-bind="savedChart"`. Each component exports its props type — `BarChartProps`,
`DonutChartProps` — as the single source of truth.

`echartOptions` stays as the deep-merge escape hatch, at the four levels v1
offered: chart, x axis, y axis and series. All four carry real overrides in
pilot, builder, helpdesk, central and press, so none of them can go. The escape
hatch is not a design goal. A prop that belongs in the library belongs in the
library, and `echartOptions` is what a caller reaches for when v2 has said no.

## Considered alternatives

**Composition, one child component per series** (Recharts). `<BarChart><Bar
y="revenue" /></BarChart>` reads well when a developer writes it by hand. It
fails the constraint: the configuration lives in a component tree, so storing a
chart means serializing markup and replaying it.

**Grammar of graphics, channel bindings** (Plot, Vega-Lite). The most expressive
of the four. It asks the caller to learn marks, scales and encodings before
drawing a bar chart, and it hands the caller decisions the library should own —
the opposite of the conventions in charts.md.

**A single config object** (v1, ECharts). Round-trips. See Context for why it
still loses.

## Consequences

- A stored chart is a props object. Loading one is `v-bind`, with no adapter.
- The types do the documenting. Each docs page reads its props type, so the
  reference cannot drift from the component.
- Renaming a series changes its `label` and keeps its color, because the
  `seriesConfig` key is the identity.
- Wide and long data both work: the column props say which shape arrived.
  Components pivot long data to wide internally.
