# Charts

`frappe-ui/charts` is the standard chart family for every Frappe app. A chart in
one app must look and read like a chart in the next one. That only holds if the
family keeps one coherent model instead of collecting the union of what its
consumers asked for.

This spec states the conventions the family is built on, the rule that decides
what enters it, and the contract between a plot and the chrome around it.

The API itself is documented on the docs site. The shape it takes is
[ADR-0014](./adr/0014-flat-props-name-columns.md). What the current family
admits and refuses is [ADR-0015](./adr/0015-what-enters-charts.md).

The conventions govern `frappe-ui/charts` only. The chart exports at the package
root are the earlier family. They keep working through the betas, and nothing
here schedules their removal.

## The conventions

1. **A prop says what the data means. It does not say what the renderer should
   do.** `x`, `y`, `series`, `stacked`, and `horizontal` describe a reading of
   the data. `barGap: '-100%'` is an instruction to echarts. Instructions go
   through `echartOptions`.
2. **The library owns the look. The caller owns the meaning.** Dotted gridlines,
   xs legends, one legend placement, and no hover dimming are decided once, for
   every app. A prop that hands such a decision back to the caller breaks the
   family.
3. **Legibility is the library's job, not a knob.** The library measures text,
   truncates, and waits for the font to settle. A prop that asks the caller to
   fix a readability problem is the library admitting it failed.
4. **One mechanism per concept.** No parallel path and no branch per case. A
   second spelling of an idea the family already has is a defect, not a feature.
5. **The library draws data. It does not model a domain or compute a caller's
   numbers.** Rows and keys go in, a plot comes out. No `Dimension` or `Measure`
   objects, and no deriving a value the caller should pass.
6. **Plot and chrome separate cleanly.** The library owns the chrome. A plot an
   app draws itself still wears it.

## The rule

A feature enters the family when it follows from these conventions. A feature
stays out when it contradicts one, whatever the demand.

Demand decides **order**, never **membership**. One app asking is enough for a
feature the model already implies. Every app asking is not enough for a feature
that breaks it.

Convention 3 has a second edge: a request for a knob is often a request for work
the library should do unasked. A label angle prop becomes automatic label
fitting. A funnel scale menu becomes a minimum readable stage width.

## Plot and chrome

A chart has two layers. The plot is echarts inside a box. The chrome is
everything around it, in Vue and semantic tokens: the card surface, the title
and subtitle block, the `actions` slot, the y axis title labels, the legend with
its hover cue and hidden-series toggling, the HTML tooltip, and the loading,
error, and empty states.

The chrome lives in `components/ChartCard.vue`, `components/ChartContainer.vue`,
`components/ChartLegend.vue`, and `components/ChartTooltip.vue`. All four are
exported, so an app that draws its own plot reads as one of the family.

```vue
<ChartContainer title="Revenue by region" :loading="loading" :error="error">
  <div ref="plot" class="h-full w-full" />
  <template #legend><ChartLegend :items="buckets" /></template>
</ChartContainer>
```

The card surface has one owner. `ChartCard` holds the card classes and the
`card` prop turns them off. For a plot, the caller supplies the card, which is
the established pattern. `NumberCard` draws one by default, because a reading
with no plot is a card, and `:card="false"` lets an app lay out several readings
inside its own card.

## Naming

The color ramps carry one name each, from the CSS token through to the theme
object: `categorical`, `sequential`, `diverging`. "Palette" names the choice
between them — the `palette` prop, `ChartPalette`, `paletteColors` — never a
ramp itself.
