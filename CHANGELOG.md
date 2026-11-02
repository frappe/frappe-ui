# frappe-ui

## 1.1.0

### Minor Changes

- Charts: `DonutChart` and `PercentageBarChart` take `order: 'rows'`, which
  draws the slices in the order the rows arrive instead of biggest first, for
  ordered categories such as ageing buckets.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: new `CalendarHeatmapChart` colors one cell per day, laid out by week
  and weekday, in bands of twelve months past a year.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: `ChartContainer` takes `centered`, which centres a plot as tall as its
  content together with its legend in the height to spare; `PercentageBarChart`
  uses it, so its legend stays under the bar.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: the legend now takes one row at most; when the series do not fit, it
  shows the largest ones and a "+N more" button that lists every series, largest
  first, with a search field past 15.
  [#1294](https://github.com/frappe/frappe-ui/pull/1294)
- Charts: colors given as a CSS variable, such as `var(--brand)` in `palette`,
  `seriesConfig` or a reference line, now resolve against the chart's element
  and follow theme changes.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: a value axis whose values are all whole numbers now ticks in whole
  numbers, so a small count no longer reads 0.5 or 1.5; the new `integer` option
  on `yAxis`, `y2Axis` and a scatter's axes turns it on or off.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: `DonutChart` takes `colors`, a map from category value to color, so a
  slice such as "Overdue" keeps its color whatever its size.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Duration: the new `largestUnit` and `smallestUnit` props show days
  (`1d 2h 3m 4s`) or round to the minute, and the input reads `1d` and `2 days`.
  A minute field reads a bare `15` as 15 minutes and `1:30` as 1h 30m.
  `formatDuration` and `parseDuration` take the same units as an optional last
  argument, and the `DurationUnits` type is exported.
  [#1320](https://github.com/frappe/frappe-ui/pull/1320)
- MultiSelect: the new `highlight` event reports the highlighted option, or
  `null` once the popover closes.
  [#1298](https://github.com/frappe/frappe-ui/pull/1298)
- NumberCard: `progress` draws a bar for how far the reading has come towards a
  whole. [#1309](https://github.com/frappe/frappe-ui/pull/1309)
- Charts: new `PercentageBarChart` draws a breakdown as one bar, from the same
  rows and props as `DonutChart`.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: a reference line now stretches its value axis, so a goal above the
  data stays in view instead of not being drawn.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Stepper: the new `Stepper` component shows progress through ordered steps,
  with sub-steps, skipped steps, and a running or failed current step. It ships
  from `frappe-ui/experimental` while its API is refined.
  [#1276](https://github.com/frappe/frappe-ui/pull/1276)
- Charts: `useChart` also returns the measured plot `height`.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)

### Patch Changes

- Avatar: the gap around the `#indicator` content is now cut out of the avatar,
  so it shows the surface behind the avatar (a hovered row, a popover, a dialog)
  instead of the page color.
  [#1311](https://github.com/frappe/frappe-ui/pull/1311)
- Charts: a `DonutChart` or `PercentageBarChart` with one slice now names it and
  its share in the legend.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: series named by a `splitBy` value and axis titles now print as given,
  without capitalizing. [#1293](https://github.com/frappe/frappe-ui/pull/1293)
- Charts: a value axis raised a tick to fit a label keeps its tick step, so the
  new end lands on a tick.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: a category axis too crowded to tilt every label now lays its labels
  flat and labels every few categories, keeping the first and the last, instead
  of tilting them and dropping the ones that collide.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: a category label printed by `xAxis.format` is now truncated in the
  middle when it is too long, like an unformatted label, instead of losing its
  end. [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Vite plugin: `codeLanguages` now works on Vite 8, where the dev server's
  dependency scan failed with `Not implemented`.
  [#1301](https://github.com/frappe/frappe-ui/pull/1301)
- Combobox: a disabled input-mode combobox now draws its value in the muted
  disabled ink, as Select does.
  [#1318](https://github.com/frappe/frappe-ui/pull/1318)
- Combobox: in `trigger="button"` mode, a value that is not in the loaded
  options shows as text instead of the placeholder. An empty string value with
  no matching option still shows the placeholder.
  [#1209](https://github.com/frappe/frappe-ui/pull/1209)
- Dialog: `dialog.prompt` now focuses its first text or textarea field when it
  opens, and Enter in a single-line field submits it.
  [#1275](https://github.com/frappe/frappe-ui/pull/1275)
- Charts: a donut whose only non-zero slice is the whole draws a closed ring,
  and zero slices take no gap on the ring while staying in the legend.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Charts: a breakdown's shares add up to 100% in `DonutChart`'s legend, tooltip
  and labels, and `DonutSliceEvent.percent` is now that rounded whole-number
  share. [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Editor: resizing an image, video or embed now snaps to 25%, 50%, 75% and full
  width, to the media's original size, and to the width of other media in the
  document, with a guide line and a width label while you drag; hold Alt to
  resize freely. [#1316](https://github.com/frappe/frappe-ui/pull/1316)
- Editor: content set from outside through `v-model` no longer adds an undo
  step, so undo cannot wipe a document that loaded after the editor mounted.
  [#1299](https://github.com/frappe/frappe-ui/pull/1299)
- useCall, useIsolatedCall: a `GET` request now sends object and array params as
  JSON in the query string, so Frappe can parse them.
  [#1233](https://github.com/frappe/frappe-ui/pull/1233)
- HeatmapChart: when no value is negative, the color scale now starts at 0
  instead of at the smallest value, so the smallest cell no longer draws as pale
  as an empty one; set `min` for the old scale.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Dropdown, ContextMenu: rows in a group now have a 1px gap between them, so a
  highlighted row next to a selected row no longer looks like one block.
  [#1274](https://github.com/frappe/frappe-ui/pull/1274)
- Dropdown, ContextMenu: a menu taller than the space on screen now scrolls
  instead of running off the edge.
  [#1300](https://github.com/frappe/frappe-ui/pull/1300)
- MultiEmailInput: chips now use the design system's tag size, with a 20px
  height, a 12px avatar and a 12px close icon. The suggestion list no longer
  opens empty: it stays closed on focus when there is nothing to suggest, and
  while a typed address matches nothing, unless `emptyText` or the `empty` slot
  is set. A click reopens it after Escape.
  [#1306](https://github.com/frappe/frappe-ui/pull/1306)
- MultiSelect: a checked row is no longer filled grey; its checkbox shows the
  state. [#1298](https://github.com/frappe/frappe-ui/pull/1298)
- MultiSelect: attributes such as `aria-label` reach the trigger, as on Select,
  and the list takes its name from `label` or `aria-label`.
  [#1298](https://github.com/frappe/frappe-ui/pull/1298)
- NumberCard: a card with no title, `title-suffix` or `actions` no longer leaves
  an empty row above the number.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- NumberCard: a delta that prints as zero, such as `0.04` shown as "0%", now
  reads as flat: no arrow, neutral tone.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- Stepper: an app that scans frappe-ui's Tailwind content globs now gets the
  classes `Stepper` from `frappe-ui/experimental` draws with, so it no longer
  renders unstyled. [#1308](https://github.com/frappe/frappe-ui/pull/1308)
- Switch: disabled switches use distinct backgrounds for on and off states.
  [#1292](https://github.com/frappe/frappe-ui/pull/1292)
- Charts: `xAxis.format` on a time axis prints the date in the tooltip and no
  longer flattens the levelled tick labels.
  [#1307](https://github.com/frappe/frappe-ui/pull/1307)
- useList, useCall: a request that a newer request replaces, such as the first
  of two quick `reload()` calls, no longer sets `error` or calls `onError`.
  [#1312](https://github.com/frappe/frappe-ui/pull/1312)

## 1.0.2

### Patch Changes

- Editor: the suggestion menus (@mention, /, #, :) can now be clicked inside a
  Dialog without closing it (fix).
  [#1288](https://github.com/frappe/frappe-ui/pull/1288)
- Editor: @mention results now list an exact name match first, then names that
  start with the typed text, then names with a word that starts with it (fix).
  [#1288](https://github.com/frappe/frappe-ui/pull/1288)
- MobileShell: in an installed iOS 26 app, the tab bar now reaches the bottom
  edge and clears the home indicator; `frappe-ui/style.css` now gives every
  installed app with a translucent status bar a page at least as tall as the
  screen, which is what restores the full-screen viewport (fix).
  [#1289](https://github.com/frappe/frappe-ui/pull/1289)
- Combobox, MultiSelect: search results now list exact matches first, then
  labels that start with the typed text, then labels with a word that starts
  with it (fix). [#1290](https://github.com/frappe/frappe-ui/pull/1290)
- Vite plugin: an app linked into a bench's `apps/` from another folder now
  builds and runs in dev; tools such as Pilot set `FRAPPE_BENCH_PATH` to the
  bench (fix). [#1283](https://github.com/frappe/frappe-ui/pull/1283)

## 1.0.1

### Patch Changes

- Charts: a category axis label that is shortened in the middle now keeps its
  ending, and no longer gets a second ellipsis at the end (fix).
  [#1279](https://github.com/frappe/frappe-ui/pull/1279)
- Checkbox: a checked or indeterminate checkbox now lightens on hover and press,
  and checkboxes no longer show a shadow on hover (fix).
  [#1186](https://github.com/frappe/frappe-ui/pull/1186)
- Editor: images and videos without a size get one only after the person's own
  edit, not when a document opens or a collaborator edits it, and one Ctrl+Z now
  undoes the person's edit (fix).
  [#1266](https://github.com/frappe/frappe-ui/pull/1266)
- PageHeaderMobile: the `#prefix` and `#suffix` slots now follow the text
  direction, so in right-to-left pages the back button sits on the right (fix).
  [#1230](https://github.com/frappe/frappe-ui/pull/1230)
- Progress: a bar without a `label` now has the accessible name "Progress"
  instead of its percentage, so screen readers do not read the value twice
  (fix). [#1113](https://github.com/frappe/frappe-ui/pull/1113)
- SidebarRailItem: a `subtle` item paints no fill behind an image, so a rounded
  logo shows no gray rim at its corners (fix).
  [#1272](https://github.com/frappe/frappe-ui/pull/1272)
- Editor: dragging a link or selected text out of a read-only editor now carries
  the browser's URL or text, as it does from plain HTML (fix).
  [#1104](https://github.com/frappe/frappe-ui/pull/1104)
- Realtime: updates keep arriving after a reconnect and on a new socket (fix).
  [#1105](https://github.com/frappe/frappe-ui/pull/1105)
- Editor: the mention, emoji, tag and slash-command menus stay next to the caret
  when the page or the editor's scroll container scrolls or the window resizes,
  and never show a position meant for an older list (fix).
  [#1161](https://github.com/frappe/frappe-ui/pull/1161)
