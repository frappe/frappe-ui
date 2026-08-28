# Frappe UI v1 Changelog

User-facing v1 changes. **Unreleased** entries describe changes since
**v0.1.278**. Log only breaking changes, deprecations, observable behavior
changes, and migration guidance — not internal refactors or test additions.

All deprecations preserve backwards compatibility through v1.x and emit a
one-time dev-mode warning (unless noted). Removal is post-v1.

## Unreleased

### Calendar — the Month view is a continuous strip that shows every event

The Month view no longer draws a fixed 5- or 6-row grid that hid whatever
did not fit behind an "n more" button. Its week rows grow to fit their
events and the view scrolls when they outgrow it, and titles wrap instead of
truncating. Below the `sm` breakpoint the days stack in a list instead of a
grid.

- **Behavior change:** `rangeChange` for the `Month` view now reports the
  grid's extent — the padding days of its first and last weeks included —
  rather than the first to the last of the month.
- Days outside the month in view are no longer dimmed; the first of each
  month is labelled with its month instead (`Sep 1`).
- Event titles in the Week and Day views are `ink-gray-8`, as in the Month
  view, rather than the event colour's text shade; the colour stays on the
  bar and background.
- `CalendarActions` (the `CALENDAR_ACTIONS_KEY` injection) gains
  `setCalendarDate`.
- An event with `isDraft: true` draws as a dashed outline in the event's
  colour, without the colour bar, rather than a filled pill, in every view.
- An event with `isDeclined: true` keeps its fill and bar but its title is
  struck through and muted; in the Week and Day views it no longer takes a
  column of its own, so overlapping events lay out as if it were not there.
- **Behavior change:** `reloadEvents()` on the template ref now re-reads the
  `events` prop and discards edits made in the calendar since (a drag or
  resize not yet persisted), where it used to hand the edited objects back.

### Calendar — `toDate` is honored, so events span the days they cover (breaking, silent)

An event's `toDate` was ignored: everything rendered on `fromDate`. It now
places the event on every day from `fromDate` to `toDate`, inclusive — as
one bar across them in the Month view and the Week view's all-day row, or,
for a timed event shorter than a day that crosses midnight, as a piece per
day in the time grid. A timed event ending at `00:00` does not occupy that
day.

- **Breaking, silent:** an event passed with an *exclusive* end (`toDate`
  set to the day after its last one, the way iCalendar stores all-day
  spans) now shows one day too many. Send the inclusive last day instead.
- **Behavior change:** dragging keeps an event's length. `update` emits
  `toDate` shifted by the same days as `fromDate`, where it used to set
  both to the drop day. A drag past midnight rolls `toDate` (or `fromDate`)
  to the next day with a `00:00:00` time, where it used to clamp at
  `24:00:00`.
- Full-day events (`isFullDay`) cover `fromDate`..`toDate` whole; their
  times are ignored.

### CommandPalette — removed from the root export, rebuilt in `frappe-ui/experimental` (breaking, loud)

`CommandPalette` and `CommandPaletteItem` leave the root export. The family is
rebuilt as seven composable parts — `CommandPalette`, `CommandPaletteInput`,
`CommandPaletteList`, `CommandPaletteGroup`, `CommandPaletteItem`,
`CommandPaletteEmpty` and `CommandPaletteFooter` — in `frappe-ui/experimental`
(P14 — no stability promise). It stays there until gameplan, helpdesk and this
site all run on it.

Four apps forked the old palette rather than use it, because it had one shape
and no filtering. The parts fit all four.

- **Breaking, loud:** `import { CommandPalette } from 'frappe-ui'` fails to
  resolve.
- **Breaking:** the `groups` prop is gone. Groups and items are markup now, so
  a group renders whatever it needs without a `component` escape hatch.
- **Breaking:** `select` carries the value and the click that picked it. Call
  `event.preventDefault()` to keep the palette open.
- **Behavior change:** the palette filters against the query. The old one
  rendered `groups` as given and left filtering to the caller. `filterable`
  (default `true`) turns it off for server search, the same word `Combobox` and
  `MultiSelect` use (ADR-0009).
- **Breaking:** `Mod+K` moves to the caller. The old component registered it
  itself and skipped it whenever a rich-text editor had focus, hardcoding
  knowledge of the editor into the palette.
- Every part stamps `data-slot`. An item stamps `data-state="active"` and
  `data-disabled`, and hands `active` and `disabled` to its slots.
- Rows go inside `CommandPaletteList`, the only part that scrolls. A list may
  own rows and groups and nothing else, so the field, the empty state and the
  footer are its siblings.
- `@headlessui/vue` leaves `dependencies` with it. The palette was its last
  import in the library.

Before/after for each break is in the
[migration guide](/docs/migration#commandpalette).

### Toast: the compat shims are removed (breaking, one of them silent)

`spec/toast.md` fixes the official API as sonner's namespace. These four
surfaces were never part of it. They carried no `@deprecated` tag, only a
runtime warning, so a tag-based scan could not see them.

**Loud — the member disappears and the call throws:**

- `toast.create({ message, … })` → `toast(message, { … })` or
  `toast.message(…)`. Census: 7 sites, helpdesk 5 and suite 2. Suite's two are
  local wrapper functions, so fixing them covers roughly 42 files downstream.
- `toast.remove(id)` → `toast.dismiss(id)`. Census: 0 sites.
- `toast.removeAll()` → `toast.dismiss()`. Census: 4 sites in suite (mail 3,
  calendar 1). An earlier count said 0; that was wrong.

**Silent, and this is the dangerous one:**

- The legacy object form `toast({ title, text, … })` is gone. Nothing throws.
  The object goes straight to sonner as the message, and sonner expects a
  string, a component or a VNode — so the toast renders empty or wrong. Census
  found no direct call sites in the surveyed apps, but a grep for `toast(` will
  not find these; grep for the `title`, `text` and `message` keys.
  Before/after in the [migration guide](/docs/migration#toast-legacy-object).

`renderSafeHTML`, `dispatch` and the four semantic creators
(`success`/`error`/`warning`/`info`) are unchanged.

### Toast: `description` supports the same limited inline HTML as the message (breaking, silent)

`description` rode inside the options object untouched, so sonner rendered it
as text while the message was sanitized and rendered as HTML. It now goes
through the same DOMPurify safelist (`a`, `em`, `strong`, `i`, `b`, `u`).

- **Breaking, silent:** a description holding a `<` outside that safelist loses
  those characters. `description: 'Set <Button> variant'` rendered literally
  before; now DOMPurify strips `<Button>` and the user sees `Set  variant`. No
  warning, no error.
- Census across builder, crm, gameplan, helpdesk, insights and suite found no
  toast `description` containing a `<`. The one hit was a Gameplan Cypress
  fixture for a space description, not a toast.
- Non-string descriptions (components, VNodes, render functions) pass through
  untouched, as before.
- **Also breaking, silent:** `toast.message` and `toast.loading` now sanitize
  and render their *message* as inline HTML too. They came off vue-sonner's
  namespace untouched before, so `toast.message('<b>hi</b>')` printed the tags
  literally and now renders bold. This makes them consistent with `toast()` and
  the four semantic creators, and it is what the `toast.create` migration
  advice above depends on.
- `toast.custom` takes a component rather than a message, so only its
  `description` is covered. `toast.promise` keys its strings by state and its
  `success`/`error` may be async functions, so only its `description` is
  covered; the state strings render as vue-sonner renders them.

This lands before the tag on purpose. Doing it in a `1.x` would silently change
rendered output for every existing caller.

### TabButtons: `class` on an option is replaced by `data-value` (breaking, silent in JS)

P10 says customize through slots and `data-*` attributes, never class-name
props. `class` on a `TabButton` option was the last per-item class field in the
library, and it dragged two more names onto the frozen surface.

- The tab button now renders `:data-value`, so CSS can address one tab:
  `[data-slot="tab-button"][data-value="open"] { … }`. That capability did not
  exist before — the rendered button carried `data-slot`, `data-state` and
  `data-disabled`, but no per-value hook.
- **Breaking, silent in JS:** `class` on an option object stops applying. A
  JavaScript caller keeps compiling and loses the styling with no warning. See
  the [migration guide](/docs/migration#tabbuttons-class) for the before/after.
- **Breaking, loud:** the `NativeButtonClass` type is no longer exported.
- **Breaking:** `customClass` leaves the `#prefix` and `#suffix` slot props.
  Loud if you destructure it, silent if you spread.

The composed `Tabs` family is unchanged. You write the `<TabTrigger>` there, so
a class goes on the element directly.

### HoverCard's `side`, `align` and `portalTo` use our own vocabulary (breaking in TS)

`HoverCard` typed these three off `reka-ui` rather than declaring them, so
`portalTo` accepted `null` and arbitrary objects while the other six overlays
accepted `string | HTMLElement`. `:portal-to="document.querySelector('#panel')"`
compiled against `HoverCard` and failed against `Popover`.

- `side` is now `PopoverSide`, `align` is `PopoverAlign`, `portalTo` is
  `PortalTarget` (`string | HTMLElement`), matching every other overlay.
- **Breaking in TS:** passing `null` or an object to `portalTo` no longer
  compiles. Pass a selector string or an element. Runtime behavior is
  unchanged.
- `side` and `align` are not a break. reka's `Side` and `Align` resolve to
  exactly `PopoverSide` and `PopoverAlign` today.

A widened type cannot be narrowed inside `1.x`, which is why this lands before
the tag rather than after.

### Button no longer hands back `rootRef` (breaking; loud in TS, silent in JS)

`Button` exposed an untyped, writable template ref to its root element.
ADR-0012 bans that: a template ref earns its place only when a parent's script
needs it and no other surface reaches.

- **Breaking:** `buttonRef.value.rootRef` is gone. In TypeScript it fails to
  compile. In JavaScript it reads `undefined`, so guard for it.
- What arrived through it was never one thing. Depending on props it was a
  `<button>`, an `<a>`, or a vue-router component instance, and it could be
  assigned through.
- Nothing replaces it. If you need script control, ask for it: a typed
  `focus(options?)` can ship in a `1.x` minor, and additions are cheap.

### DatePicker internals are no longer exported (breaking, loud)

`src/components/DatePicker/index.ts` re-exported its whole `utils` module, so
`months`, `monthStart`, `generateWeeks` and `getDateValue` reached the package
root. P15 bans `export *` from an implementation module, and the line was an
open channel: every helper a later commit added to `utils.ts` would have
joined the public API unreviewed and frozen.

- **Breaking, loud:** `import { months, getDateValue } from 'frappe-ui'` fails
  to resolve. Nothing replaces them. `months` was a hardcoded English-only
  `'Jan'..'Dec'` array with no i18n path, so freezing it would have been the
  worse outcome. Copy what you need into your app, or use `dayjs` directly.

The `DatePicker`, `DateTimePicker` and `DateRangePicker` components and their
types are unchanged.

### ThemeSwitcher — moved to `frappe-ui/experimental` (breaking, loud)

`ThemeSwitcher` is not taken to bar at root for `1.0.0` (#1094). It parks on
`frappe-ui/experimental` (P14 — no stability promise), still deprecated, while
apps migrate.

- **Breaking, loud:** `import { ThemeSwitcher } from 'frappe-ui'` fails to
  resolve. Import from `frappe-ui/experimental` instead: `ThemeSwitcher` and
  the type `ThemeSwitcherProps`.
- **The replacement is behavioral, not visual.** `ThemeSwitcher` renders a
  reka-ui `RadioGroupRoot` of theme preview cards. `Select` bound to the
  `useColorScheme` composable replaces the behavior, not the markup, so an app
  that wants the cards rewrites them. Moving the import is the smaller change
  and keeps the current UI.

Before/after is in the [migration guide](/docs/migration#themeswitcher).

### `useShortcut` renamed to `useKeyboardShortcut`, config reshaped (breaking; loud in TS, silent in JS)

The import fails to resolve, so the rename itself is loud. The config is the
silent half: 14 fields become 10 and Vue drops the ones that left without a
word.

`key` + `ctrl` + `shift` + `alt` collapse into one `combo` string, written
`Mod+Ctrl+Alt+Shift+<Key>`. `ctrl` never meant Control. It matched
`ctrlKey || metaKey`, so `{ key: 's', ctrl: true }` fired on ⌘S, on ⌃S and on
Win+S alike. `Mod+S` compares every modifier exactly, so only ⌘S fires on macOS
and only Ctrl+S elsewhere. Those two extra trigger paths stop. `condition`
becomes `enabled`
and takes a ref, a getter or a boolean. `triggeredOn` goes: `onHold` selects
hold mode, and a hold registration takes no `handler`, which ends the old
surprise where `triggeredOn: 'hold'` fired `handler` too.

Punctuation and digits now use a key name (`Mod+Slash`, `Mod+Shift+Digit1`),
because `+` is the separator and `'Mod++'` splits into empty parts. Digits and
punctuation match `event.code`, so a shifted character still resolves; letters
and named keys match `event.key`. The old US-layout heuristic is deleted.

TypeScript rejects an unknown combo at compile time. A JavaScript call site
that still passes the v0 shape logs one dev warning and never fires.

Migration: [`useShortcut`](/docs/migration#useshortcut-is-now-usekeyboardshortcut).

### Shortcut precedence is now last-registered-wins (breaking, silent)

Two shortcuts on one combo used to run whichever the registry reached first.
The last registration that is **enabled at the time of the keypress** now
wins. `enabled` is resolved before precedence, so two registrations with
mutually exclusive guards both keep working. Suite's slides app uses that
pattern on seven combos.

A real collision, two live shortcuts on one keypress, logs one dev warning per
combo naming the shadowed shortcut and the active one.

### `formatShortcutLabel` and `getActiveShortcuts` removed (breaking, loud)

Neither had a consumer in ten apps, and `formatShortcutLabel` was unused inside
the library too. The registry read is now internal.
`KeyboardShortcutsDialog`'s new default slot hands out the same data.

### `KeyboardShortcutsModal` renamed to `KeyboardShortcutsDialog` (breaking, loud)

The library calls every modal a dialog. Props are unchanged. The component
gains a default slot carrying the grouped shortcuts, and a `data-slot` on every
part.

Migration: [`KeyboardShortcutsModal`](/docs/migration#keyboardshortcutsmodal-is-now-keyboardshortcutsdialog).

### KeyboardShortcut — one combo vocabulary, and `data-slot` hooks (breaking, silent)

The root, each key, the `+` separators and the alternative combos carry a
`data-slot`; the root also carries `data-bg` when `bg` is set. Style through
those instead of a class prop (P10). The parser also reads the key names a
combo uses, so `Digit1` renders `1` and `Slash` renders `/`.

`combo` now reads the one grammar `useKeyboardShortcut` fires on. The older
display-only spellings are gone, because a chip for a combo that can never fire
is the failure this family exists to remove. An unknown token renders as
written and warns once in development. **Silent break:** `combo` stays typed
`string`, because callers compute it, so no type-check names the call sites and
production logs nothing.

| Gone | Write |
| --- | --- |
| `Cmd`, `Command`, `⌘`, `Meta` | `Mod` |
| `Control` | `Ctrl` |
| `Option`, `Opt`, `⌥` | `Alt` |
| `⇧` | `Shift` |
| `Win`, `Windows` | nothing; the grammar has no Windows key |
| `Esc` | `Escape` |
| `Return` | `Enter` |
| `Del` | `Delete` |
| `Up`, `Down`, `Left`, `Right` | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| `=` | `Equal` |
| `F13` and above | nothing; the grammar stops at `F12` |

The root's `role` is now `img` when `combo` is set, and absent otherwise. It
was always `note`. A labelled `img` replaces its subtree, so a screen reader
meets each key once instead of once per chip.

`useIcons` also reaches `bg` mode, where it used to be ignored.
`:use-icons="false"` now drops the arrow, Enter, Backspace and Delete icons in
both modes. The default is `true`, so a chip that never set the prop draws what
it drew before.

Migration: [`KeyboardShortcut`](/docs/migration#keyboardshortcut).

### Badge — `theme="orange"` removed (breaking; loud in TS, silent in JS)

`orange` was a deprecated alias that resolved to `amber`, so `theme="amber"`
renders exactly what `theme="orange"` used to. ADR-0008 keeps nothing
deprecated in `1.0.0`, and the alias was never on the removal list, so no
earlier census counted it (found by #1054).

TypeScript call sites fail at `vue-tsc`, because the `theme` union no longer
accepts the string. JavaScript call sites and bound values render the default
`gray` theme and log a one-time dev-mode warning naming the component, prop and
value. Check bound themes as well as literal attributes — a status-to-theme map
that yields `'orange'`, or an `?? 'orange'` default, goes grey and no grep for
`theme="orange"` finds it.

### Badge — an unsupported `theme`, `variant` or `size` no longer crashes (fix)

`Badge` indexed a class map by theme and then indexed that result by variant.
A theme outside the union made the second lookup read a property of
`undefined`, throwing `TypeError: Cannot read properties of undefined (reading
'subtle')` mid-render — the badge vanished and the error took the parent render
with it, so one stale colour name in a status map could blank a page.

All three axes now fall back to the prop's default (`gray` / `subtle` / `md`)
and warn once per offending value in dev. `variant` and `size` never threw —
they ended their lookup chains and rendered untinted or unsized — but they were
silently wrong, and now report themselves too.

The public types are unchanged: `theme` still accepts only the six supported
values, so TypeScript keeps rejecting anything else at compile time. The
fallback is a runtime net for JS call sites and bound values, not a widening of
the API.

### Editor — images and embeds resize from a bottom-right corner handle

Selecting an image, video, or embed used to reveal two vertical pills centered
on its left and right edges. They sat in the middle of the media, were easy to
miss, and only answered horizontal drags. A selected image or embed now shows a
single grip in its bottom-right corner, carrying the diagonal resize glyph —
the affordance every OS window and image editor already uses. It wears the same
28px button as the actions menu in the opposite corner, mirrored across the
media.

The drag reads both axes: the pointer's travel is projected onto the
aspect-locked diagonal, so dragging down grows the media (an edge handle could
not) and a diagonal drag keeps the corner under the cursor. Media stays
ratio-locked, as before. Keyboard resize on a focused handle now takes Up/Down
alongside Left/Right, and the embed's handle answers the arrow keys at all for
the first time — they used to move the caret out of the node instead.

Videos keep the edge pills. Their playback bar owns the bottom of the frame, so
a corner grip there either sits on the controls or hovers above them.

### Editor — video controls sit on a gradient instead of a floating pill

The playback row was a dark pill inset from the video's edges. It drew a hard
rectangle across the picture and had to stay dark enough for white icons on any
frame. It now spans the full width of the video on a gradient that fades up
into the footage, so the contrast is only where the controls are. The gradient
follows an eased ramp to a lighter peak rather than a straight two-stop fade,
which left a visible edge where the band ended.

The row itself was restyled to read as a player rather than a toolbar: solid
play/pause and volume glyphs, a seek bar that runs the width of the video with
a round thumb marking the playhead, and the elapsed/total time moved to the
right beside the volume and fullscreen buttons. The controls previously used
`ink-*` color tokens, which flip with the theme and dimmed them into the video
in dark mode; they now use the fixed white scale in both themes.

The playhead moves with the footage. It used to be driven by `timeupdate`,
which fires about four times a second and walked the thumb across the track in
steps; while the video plays, the position is now read once a frame. A tap
elsewhere on the track glides the thumb there instead of teleporting, and a
drag tracks the pointer directly — which also fixes a scrub that stopped on
the first pixel of movement, because the press-and-move started a native drag
of the node view and the browser cancelled the pointer.

### Editor — media actions live in a single menu

Selecting an image, video, or embed used to paint a row of six buttons across
its top-right corner — caption, three alignments, replace, and (on video) a
playback dropdown — sharing one 65%-black pill. It was a slab of chrome over
every selected image, most of it rarely used, and it grew with each action
added.

There is now one 28px `⋯` button there instead, on the `black-overlay-300`
fill the design specifies (espresso-2.0, node 31403-45433) with `rounded-4` and
a full-white 16px icon. It opens a menu holding the same actions, grouped: a
caption switch, Align (left/center/right, with the current one marked), the
video-only Playback switches (autoplay, loop, muted), and replace. The resize
grip in the opposite corner is the same button, so the media carries one
control style instead of the raw `black/65` and `white/50` it approximated.

### Editor — selected media no longer wears a white halo in dark mode (fix)

The ring around a selected image, video, embed, or gallery is drawn with a 2px
offset, and Tailwind's default offset color is a hard `#fff`. On a white page
that gap is invisible; in dark mode it was a bright white band around every
selected node. The offset now takes `--surface-base`, the page background in
both themes.

### Editor — fullscreen video fills the screen (fix)

Fullscreen stretched the container to the viewport, but the video kept its
committed pixel size: it sat small at the top of the screen with the playback
bar pinned directly under it and a black slab filling everything below. The
video is now centered and scaled to fit the screen, the controls run along the
bottom of it, and the editing chrome — toolbar, resize handles, caption — is
not rendered in fullscreen, where none of it is actionable.

No API change for any of these — the handles and controls are internal to the
media and iframe node views.

### Data fetching (v2) — stale responses no longer write the shared stores (fix)

Two concurrent writes to one document could leave `docStore`, `listStore`
(and every view bound to them) on the response that settled last instead of
the newest one, while `data` already held the fresh response (#1017).

The gate lives in the stores. Every request takes a monotonic sequence
number when it is dispatched; the response's store writes carry it, and the
stores reject a write for a document that a later-dispatched request has
already written. A sequence, not a timestamp — clocks move and two responses
can share a millisecond. One freshness domain covers every writer — the
`docs` side channel, the `useDoctype` / `useList` / `useDoc` hooks, and any
mix of instances or paths writing the same document. A sequence is recorded
only when a mutating write lands: a newer request that failed wrote nothing
on the server, so it does not make the older success stale, and a read (GET)
is admitted on its sequence but records nothing — the server may answer a
later reload before an earlier save commits, and the save must still land. A
delete seals the document when it settles — a delete is terminal — so no
in-flight write or reload, whatever its dispatch order, can re-create a
deleted document.
One accepted limitation: the gate orders by dispatch time, so a read
dispatched after a save, handled by the server before the save committed
and answered after it, is admitted and republishes the pre-save value —
resolving that needs server-side sequencing, which this design trades away.

`useAction` still skips the `onSuccess`/`onError` hooks of a submit that a
newer same-key submit of the same instance already outran — the store gate
protects the stores, this skip only avoids re-running hook side effects
with a stale response. `useDoc`'s write members and `useNewDoc` skip their
hooks the same way. No store write is inside any of those skips: only the
store gate decides them. It compares per document and knows whether the
newer request landed, so an overtaken insert of a different document still
lands, and an older success is kept when the newer submit failed.

No API change. Behavior changes if you relied on it:

- A stale `setValue`/`delete` on the same document no longer triggers
  `useList`'s auto-refetch; the newest submit's refetch already ran.
- Submits with different keys, and keyless submits (inserts), are
  independent — all of their hooks still fire, as before.

### Charts — a new family at `frappe-ui/charts`

The chart family for v1. It replaces the one that used to sit at the package
root, which is parked on `frappe-ui/experimental` (see the next entry).
Import the components from `frappe-ui/charts`, which carries the `--chart-*`
color tokens with it. `spec/charts.md` states the conventions, and
`spec/adr/0015-what-enters-charts.md` records what the family admits.

Landed so far:

- The chrome is exported — `ChartCard`, `ChartContainer`, `ChartLegend` and
  `ChartTooltip` — so a plot an app draws itself wears the family's look.
  `ChartCard` owns the card surface, and `card: false` turns it off.
- Combo series through `seriesConfig[key].type`, which also collapsed the three
  axis option builders into one. Per-series area fill falls out of it.
- Reference lines on the axis charts and on `ScatterChart`. A line beyond the
  data range is clipped rather than stretching the value axis.
- `stacked: 'normalized'` for shares, and `maxSeries` to cap a long grouping
  column. `maxSeries` has no default.
- `ScatterChart` and `SankeyChart`.
- Category labels fit themselves — the library measures, tilts and truncates
  instead of taking an angle prop.
- `xAxis.type: 'value'` reads the x column as a quantity: a point sits at its
  own number instead of in its row's slot, and the rows draw in numeric order.
  Ask for it — a column of numbers still reads as categories by default.
- The three states are slots — `#loading`, `#error` and `#empty` — on
  `ChartContainer` and on every chart component, so an app puts a retry button
  beside a failed query without drawing chrome of its own. `#loading` replaces
  the whole placeholder rather than a caption under a spinner.
- A loading chart draws a skeleton the size of its plot, where it used to draw
  a spinner and the words "Loading chart…". A dashboard fills in a card at a
  time, and a placeholder that holds the grid's shape reads better than eight
  spinners turning out of step. `#loading` takes it back.
- `seriesConfig[key].axis` puts a series on the second value axis. It replaces
  the `y2` prop, **which is removed**: `y` names every series once, in the order
  they are drawn and colored, so a series no longer changes color when it
  changes axis. Long data reaches the second axis for the first time, keyed by a
  value of the `series` column, and `y2Axis` is unchanged. To migrate, move each
  `y2` column into `y` at the position it should draw at and add `axis: 'y2'` to
  that column's `seriesConfig` entry. TypeScript reports the removed prop, but a
  plain template passes it through as an attribute and draws the column not at
  all — grep for `y2` on the v2 charts after upgrading.
- `ScatterChart` takes `showDataLabels`, which prints each point's `label`
  beside it. Names that collide with a neighbour are dropped.
- `NumberCard` takes `color`, the ink the reading is printed in, for a card
  standing for a series drawn in that color elsewhere. The card, the title and
  the delta tone are unchanged by it.

Changed since `1.0.0-beta.41`, the first beta that shipped the family:

- **Breaking, silent:** the six mark emits are renamed to `select` —
  `datapointClick` on `AreaChart`, `BarChart` and `LineChart`, `sliceClick` on
  `DonutChart`, `stageClick` on `FunnelChart`, `cellClick` on `HeatmapChart`,
  `linkClick` on `SankeyChart` and `pointClick` on `ScatterChart`. P1 names an
  emit after the behavior, and the six now fire from the keyboard as well, so
  "click" was false. A listener on an old name stops firing with no error —
  see the [migration guide](https://frappeui.com/docs/migration#charts).
  The payload types are unchanged.
- **Breaking, loud:** `ChartTheme` is now `ChartTokens` and `useChartTheme` is
  now `useChartTokens`, which returns `{ tokens }` rather than `{ theme }`.
  `theme` means a color tone everywhere else in the library (P4), and these
  are the resolved `--chart-*` values.
- **Breaking, loud:** `formatValue`, `formatDate`, `formatLabel`,
  `formatPercent`, `formatAxisValue`, `currentColorScheme` and
  `resolveChartTheme` are no longer exported. They had no documented use, and
  each format helper hardcodes `en-US`. Read the plot-area colors with
  `useChartTokens`, which re-resolves on a theme flip; `currentColorScheme` was
  the root `resolvedColorScheme` under another name.

### DatePicker family — trigger slot props renamed to `open` / `toggle` (breaking, silent)

`#trigger`, `#prefix` and `#suffix` on `DatePicker`, `DateRangePicker`,
`DateTimePicker` and `TimePicker` now receive `{ open, toggle }` instead of
`{ isOpen, togglePopover }` (#1054). `Popover`, `HoverCard`, `Dropdown`,
`Select`, `Combobox` and `MultiSelect` all name the boolean `open`, and
`Popover`'s trigger slot already names the flip `toggle`. `isOpen` is on
`CONTEXT.md`'s avoid list for a public API, and `togglePopover` named the
mechanism rather than the behavior (P1). The same
components already gave `#actions` a `close()`, so one component shipped two
vocabularies for one concept. `displayLabel` and `inputValue` are unchanged.

**Silent break:** a destructured `isOpen` becomes `undefined`, so a class
bound to it stops applying with no error; `togglePopover()` throws only if you
call it. Grep for both names. See the
[migration guide](/docs/migration#trigger-slot-props).

### SettingsDialog — open state moves to `v-model:open` (breaking, silent)

`v-model` → `v-model:open`, and `update:modelValue` → `update:open` (#1054).
`CONTEXT.md` says the visibility of an overlay is `open`, "always bound via
`v-model:open`", and lists bare `v-model` for visibility among the names to
avoid. `Dialog`'s dual binding is a documented carve-out for `Dialog` alone,
which P2 says new components do not inherit. `v-model:tab` is unchanged.

**Silent break:** Vue accepts the unknown `modelValue` prop with no error, so
the dialog never opens. See the
[migration guide](/docs/migration#settingsdialog).

### Dialog — `theme: 'yellow'` renamed to `'amber'` (breaking, silent)

`DialogTheme` held the library's last `yellow` (#1054). `Alert`, `SidebarCard`,
`Badge` and `Avatar` all spell the warning tone `amber`, and `Dialog` already
rendered `yellow` with the amber tokens (`bg-surface-amber-2`,
`text-ink-amber-5`), so the value name disagreed with the token it resolved to.
Applies to `icon.theme` and to the `theme` argument of `dialog.confirm` /
`dialog.danger`. Only the word changes, not the color.

**Silent break** for JavaScript call sites: `yellow` is no longer a key in the
tone maps, so the icon renders untinted and nothing throws. TypeScript call
sites get a union error. This also corrects the `warning → yellow` mapping
given in the `icon.appearance` entry below. See the
[migration guide](/docs/migration#dialog).

### Charts (v1) family — moved to `frappe-ui/experimental` (breaking)

The first chart family is not taken to bar at root for `1.0.0` (#942).
It parks on `frappe-ui/experimental` (P14 — no stability promise) with its
public API unchanged, while apps migrate to `frappe-ui/charts`, which draws
everything it did.

- **Breaking, loud:** `import { AxisChart, ... } from 'frappe-ui'` fails to
  resolve. Import from `frappe-ui/experimental` instead: `AxisChart`,
  `DonutChart`, `ECharts`, `FunnelChart`, `NumberChart` and
  `useAxisChartOptions`. Migration is the import-path change only. Apps that
  spread `content` from `frappe-ui/tailwind` keep the styles automatically.
- For new code, use `frappe-ui/charts`. Its props are flat and name the
  columns of your rows, so a `config` object becomes props — see the
  [migration guide](/docs/migration).

### Calendar family — moved to `frappe-ui/experimental` (breaking)

Calendar is not taken to bar at root for `1.0.0` (#1020, redirect of
#989). It parks on `frappe-ui/experimental` (P14 — no stability promise)
with its public API unchanged, until a redesigned calendar family
replaces it.

- **Breaking, loud:** `import { Calendar, ... } from 'frappe-ui'` fails
  to resolve. Import from `frappe-ui/experimental` instead: `Calendar`,
  `CalendarColorMap`, `CalendarActiveEvent`, and the types
  `CalendarActions`, `CalendarCellClickData`, `CalendarConfig`,
  `CalendarEvent`, `CalendarMode`, `CalendarPublicProps`,
  `CalendarTimeFormat`, `GroupedCalendarEvents`. Migration is the
  import-path change only. Apps that spread `content` from
  `frappe-ui/tailwind` keep Calendar styles automatically.
- **Fix:** the default header's month-title button renders again (it
  broke when DatePicker's `#target` slot became `#trigger`), and the
  all-day collapse buttons show their chevron icons again.

### Radius aliases and `text-*-black` styles removed (breaking, silent)

Per ADR-0006 and ADR-0008 (#998, decided in #993):

- The named radius aliases (`rounded`, `rounded-sm`, `rounded-md`,
  `rounded-lg`, `rounded-xl`, `rounded-2xl`, and their directional forms) are
  removed. Numbered tokens are the only radius vocabulary
  (`rounded` → `rounded-4`, sm→1, md→5, lg→6, xl→7, 2xl→8; identical px).
  `rounded-none` and `rounded-full` stay. **Silent break:** the preset
  replaces Tailwind's scale, so an unmigrated alias emits no CSS — square
  corners, no build error. The `tokens-v2` codemod now performs these renames
  (idempotent, runs in every mode); it rewrites bare `rounded` only inside
  quoted strings and `@apply` rules, so grep for leftovers.
- The `text-<size>-black` / `text-p-<size>-black` style classes are removed
  (zero usage; the Figma black weights were corrupt export data). Also a
  silent break. The codemod flags `font-extrabold` / `font-black` next to a
  text size instead of merging onto the removed class.

### ListFilter — removed (breaking)

- **Breaking, loud:** `ListFilter` is no longer exported — the import fails.
  Its internals (`SearchComplete`, `FilterIcon`) are gone with it (#992,
  #999). No consumer app used it. Build filter UI in app code with `Select`
  and `Combobox`.

### Data fetching (v2) — `useDoc` writes and `useNewDoc` get one request per submit (fix)

`useDoc`'s `setValue`, `delete` and every `methods:` entry, and `useNewDoc`,
still held a single shared request after the `useDoctype`/`useList` fix.
Two submits at once aborted one another, and every submit resolved from the
same `data`, so a caller could receive another caller's answer or `null`.
Each submit now sends its own request and resolves with its own response
(#991).

- No API change. These members keep the full `useCall` surface — same
  members, same types. `submit()` still resolves `null` on a failed request.
- `data` and `error` belong to the submit that started last, same as
  `useDoctype` and `useList`: a stale submit answers its own caller and
  writes nothing shared. `loading` stays `true` until every submit settles.
- Behavior change if you relied on it: a second submit no longer cancels the
  first — both requests reach the server.

### Sprite icon trio — moved to `frappe-ui/experimental` (breaking)

The sprite-based `Icon`, `IconPicker`, and `spritePlugin` leave
`frappe-ui/icons` (#904). Apps still use them, so they park on
`frappe-ui/experimental` (P14 — no stability promise) instead of being
deleted. `lucide-*` classes are the canonical way to render icons.
The named SFC icons (`CircleCheckIcon`, `HelpIcon`, ...) stay on
`frappe-ui/icons`.

- **Breaking, loud:** `import { Icon, IconPicker, spritePlugin } from
  'frappe-ui/icons'` fails to resolve. Import from
  `frappe-ui/experimental` instead. Migration is the import-path change
  only. Apps that spread `content` from `frappe-ui/tailwind` keep
  `IconPicker` styles automatically — no Tailwind change needed.
- `frappe-ui/experimental` exports `Icon` (sprite); root `frappe-ui`
  exports a different `Icon`. Alias one if you import both:
  `import { Icon as SpriteIcon } from 'frappe-ui/experimental'`.

### `createListResource` — `hasPreviousPage` stale after `reload()` (fix)

`reload()` temporarily resets `start` to `0` to re-fetch the accumulated
pages as one request, then restores it. `hasPreviousPage` was computed
while `start` was still `0` and never recomputed after the restore, so it
stayed `false` even when `start` was back above `0`. `reload()` now
recomputes `hasPreviousPage` after restoring `start`.

### KeyboardShortcut — deprecated `shortcut` and unused modifier props removed (breaking)

Per ADR-0008, the deprecated `shortcut` prop (superseded by `combo`) is
removed rather than shipped frozen — it had zero call sites. The `meta` /
`ctrl` / `shift` / `alt` boolean props are also removed (Rule 9: zero real
usage, superseded by `combo`). Both are **loud** breaks (removed props on a
typed component). Also moved from a bare `KeyboardShortcut.vue` into its own
directory with a `types.ts`, a docs page, and a Cypress test.

### useShortcut — `matchesShortcut` no longer public (breaking)

`matchesShortcut` is removed from the `frappe-ui` package export. Its own
doc comment already said "exported for unit tests only" — it was never
meant to be public API (Rule 9). Loud break (import error) for anyone who
imported it directly; no signal of any real consumer doing so. The composable
itself is now `useKeyboardShortcut`, further up this release.

### KeyboardShortcutsModal / useShortcut — brought to bar

`KeyboardShortcutsModal` gained a `types.ts` and a Cypress test (previously
only unit-tested). `useShortcut` gained a short entry on the
[composables page](/docs/other/composables). Both were renamed later in this
release, to `KeyboardShortcutsDialog` and `useKeyboardShortcut`. Read the
entries at the top of this release for the API that ships.

### SettingsDialog — `SettingsBody`'s exposed type

`SettingsBody`'s `viewportElement` expose now has a typed
`SettingsBodyExposed` type (ADR-0012), exported from `frappe-ui`. No
behavior change.

### FileUploader — uploads default to private (security fix, breaking)

- **Silent break:** `isPrivateUpload()` — the single resolver used by
  `useFileUpload` and `FileUploadHandler` — now defaults an upload with no
  stated `private` / `is_private` to **private**, not public. Previously
  `FileUploader` patched this default at the component level while
  `useFileUpload().upload(file, {})` and `new FileUploadHandler().upload(file,
  {})` resolved the same missing intent to public. The two disagreeing was
  [#922](https://github.com/frappe/frappe-ui/issues/922); `FileUploader`
  itself already uploaded private (since `v1.0.0-beta.21`) and is unaffected.
  A caller of `useFileUpload` or `FileUploadHandler` with no explicit privacy
  option now gets a private file where it previously got a public one. See
  the [migration guide](/docs/migration#fileuploader).
- Fixed: the standalone `upload(file, options)` export (re-exported from
  `frappe-ui` alongside `useFileUpload`) crashed at runtime — it required
  internal `state`/`reset` arguments the public signature never exposed a way
  to pass. It's now a real standalone function; `useFileUpload()` wraps it
  with reactive state.

### FileUploader — flat props replace the `uploadArgs` blob (breaking, P3)

- **Silent break:** `uploadArgs` is removed. Its fields that are actually used
  in the wild are now flat props: `private`, `folder`, `doctype`, `docname`,
  `fieldname`, `uploadEndpoint`, `optimize`. Old code keeps compiling —
  `uploadArgs` becomes an inert attribute on the root element — so an app
  that relied on it (`folder`, `doctype`, custom `private`, …) silently stops
  applying those options. Advanced options with no flat prop (`file_url`,
  `method`, `type`, `params`, `maxWidth`/`maxHeight`, upload cancellation) had
  zero measured use on the component (rule 9); reach for `useFileUpload()`
  directly for those. See the
  [migration guide](/docs/migration#fileuploader).

### FileUploader — `success` / `failure` emits declared stable

- Both emits lost their `@deprecated` tag (ADR-0008 forbids shipping
  `@deprecated` members at `1.0.0`) and gained real types: `success: [data:
  UploadedFile]`, `failure: [error: unknown]` (previously untyped `any`).
  Both are load-bearing at real call sites and keep their names — they
  already read as behaviors (P1), not interactions.
- Fixed: `failure` didn't fire when `validateFile` rejected a file — only on
  an actual upload error. `error` was set on the slot props either way, but a
  listener on `@failure` never heard about a validation rejection. It now
  emits `failure` with the validation error (string or `Error`) in both
  cases, matching what the type already promised.

### FileUploader — slot prop `error` is now always a string

- **Silent break:** `FileUploaderSlotProps.error` changed from `unknown` to
  `string | null`. Upload failures were already normalized to a message
  string; validation failures (`validateFile` returning an `Error`) were not
  — a custom slot could receive either a string or an `Error` object. Both
  paths now normalize to a message string before reaching the slot. A slot
  that did <span v-pre>`{{ error.message }}`</span> expecting the
  validation-`Error` case
  (uncommon, but not impossible) silently renders nothing now that `error` is
  always a string. See the
  [migration guide](/docs/migration#fileuploader).

### FileUploader — `inputRef` removed, nothing in its place

- **Breaking, loud:** per [ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md),
  `FileUploader` hands back nothing through a template ref. `inputRef` was a
  function disguised as a ref (`uploader.value.inputRef().focus()`), and the
  `openFileSelector` slot prop already covers what it was used for. Zero
  known call sites.

### FileUploader — structural bar: TypeScript, `types.ts`, tests, docs

- `FileUploader` is now fully typed (`FileUploaderProps`, `FileUploaderEmits`,
  `FileUploaderSlotProps` in `types.ts`), has `*.cy.ts` component tests
  covering the five at-bar behaviors, and a `data-slot="root"` /
  `data-state="idle" | "uploading" | "success" | "error"` pair for CSS hooks
  (P10). The default fallback trigger now renders validation/upload errors
  via `<ErrorMessage>` (`role="alert"`) — previously invisible unless the
  caller used a custom slot.

### `fileToBase64` and the `fileSize` helpers — unexported from root

- **Breaking, loud:** `fileToBase64`, `formatBytes`, `getMaxFileSize`, and
  `fileSizeLimitMessage` are no longer exported from `frappe-ui`. Zero
  external call sites at the v1 sweep (rule 9) — all four stay as internal
  helpers shared by `useFileUpload`, `FileUploadHandler`, and the editor's
  media upload engine.

### Sidebar — deprecated config API removed (breaking)

Per ADR-0008, every member marked `@deprecated` is deleted. `Sidebar` is now a
bare composable frame: `SidebarHeader` / `SidebarSection` / `SidebarLabel` /
`SidebarItem` compose in the default slot, matching the direction agreed in
`v1-release/plan.md`.

- **Breaking, silent:** `Sidebar`'s `header` and `sections` config-object props
  are gone. Old code still compiles — Vue drops them as inert attrs — but the
  sidebar renders empty instead of the configured header/sections. Compose
  `SidebarHeader` and `SidebarLabel` + `SidebarItem` (or `SidebarSection`)
  directly in the default slot.
- **Breaking, silent:** `Sidebar`'s `#header-logo` and `#footer-items` slots
  are gone (they only existed to reach into the config-object layout). Old
  `<template #header-logo>` / `#footer-items>` content stops rendering. Put
  that markup directly in the default slot instead.
- **Breaking, silent:** `SidebarSection`'s `items` prop and `#sidebar-item`
  scoped slot are gone. It's now a plain collapsible-group wrapper — `label`,
  `collapsible`, `v-model:collapsed` — whose children are `SidebarItem`s
  composed directly in its default slot, instead of an `items` array plus a
  slot to customize each row.
- **Breaking, silent:** `SidebarItemProps.isActive` (alias for `active`) and
  `.condition` (config-object visibility filter) are gone. Use `active`; use
  `v-if` on the composed `SidebarItem` instead of `condition`.
- **Breaking, silent:** `SidebarHeader`'s `#logo` slot is renamed to `#prefix`
  (P6 — no type-specific slot names when a generic one covers them). Old
  `<template #logo>` content stops rendering; the default logo/initial box
  shows instead.
- `SidebarItem`'s collapsed-rail icon no longer swaps to a centered square and
  back while the sidebar's width animates — it holds one position through the
  transition (also fixes the icon sitting 2px off the rail's center line).
- `SidebarSection`'s collapsible label is now a real `<button>` with
  `aria-expanded` / `aria-controls`, keyboard-operable (was a `<div>` with a
  click handler and no keyboard path).

### ListView family — moved to `frappe-ui/experimental` (breaking)

`ListView` is not taken to bar at root for `1.0.0`. `frappe-ui/list` is the
recommended primitive for new code, but it's a narrower, composition-based
family by design — it has no equivalent for `ListView`'s config-driven
columns (resizable widths, per-column `getLabel`/`prefix` functions, cell
tooltips, disabled-row exclusion, the built-in select banner). Rather than
freeze the whole 12-export barrel at root undeprecated, it moves to
`frappe-ui/experimental` (P14 — no stability promise) and stays there until
`frappe-ui/list` reaches full functional parity.

- **Breaking, loud:** `import { ListView, ... } from 'frappe-ui'` fails to
  resolve. Import from `frappe-ui/experimental` instead:
  `List`, `ListView`, `ListEmptyState`, `ListFooter`, `ListGroupHeader`,
  `ListGroupRows`, `ListGroups`, `ListHeader`, `ListHeaderItem`, `ListRow`,
  `ListRowItem`, `ListRows`, `ListSelectBanner`.

### `TextEditor` and its v0 exports — removed from root (breaking)

Per ADR-0008, the deprecated v0 editor exports are removed from top-level
`frappe-ui` — loud breaks, the import fails to resolve:

- `TextEditor`, `TextEditorBubbleMenu`, `TextEditorFixedMenu`,
  `TextEditorFloatingMenu`, `TextEditorContent`, `createEditorButton`
- `ImageExtension`, `SetImageOptions`, `createSuggestionExtension`,
  `BaseSuggestionItem`, `CreateSuggestionExtensionOptions` (the two
  `TextEditor/extensions/*` barrels also re-exported from root)

Use [`Editor`](/docs/molecules/editor) and its kits/building
blocks from the `frappe-ui/editor` subpath instead — see the migration guide's
[Editor section](/docs/migration#editor). This confirms
`CONTEXT.md`'s rule: the editor family is the only subsystem that exports
from a subpath rather than root, and nothing editor-related is exported from
root anymore.

The underlying v0 component files still ship, unmodified, as
`frappe-ui/editor`'s migration safety net. They are parked in
`frappe-ui/experimental` (`experimental/TextEditor/`, #1007), so apps
mid-migration keep an import path:

```ts
import { TextEditor } from 'frappe-ui/experimental'
```

This path is unstable — no deprecation window. Sharing the `experimental`
barrel costs its other importers nothing in production: #870's rollup
measurement shows unused re-export chains are pruned before `sideEffects`
marking applies, so the editor graph is tree-shaken out of non-editor
imports. Removing the files is a
separate, human-gated cleanup once every consumer has migrated (spec/editor.md
§12); the `TextEditor` public API redesign itself is out of scope for `1.0.0`
and carved out to `1.1`.

### Editor and TextEditor styles — Tailwind v4 `theme()` call fixed

`.ProseMirror ul[data-type='taskList'] input[type='checkbox']` used a
Tailwind-v3-only `theme('colors.gray.900')` call in both
`frappe-ui/editor`'s and the v0 `TextEditor`'s stylesheet, which broke
Tailwind v4 builds (#861 — a remaining instance of #299). Replaced with the
same `var(--ink-gray-9)` token the rest of both files already use.

### v1 resources — at-bar exception documented; `listResource` gets test coverage

v1 resources (`createResource`, `createListResource`, `createDocumentResource`,
`getCachedResource`, `getCachedListResource`, `getCachedDocumentResource`,
`resourcesPlugin`, `saveLocal`, `getLocal`, `deleteLocal`, `onDocUpdate`) ship
un-deprecated and frozen at `1.0.0`, per #886.
[ADR-0013](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0013-v1-resources-implementation-freeze.md) records the
one exception: the implementation stays hand-written JavaScript rather than
TypeScript, permanently — 344 production call sites make a rewrite riskier
than the freeze. `createListResource`, the second-most-used export at 57 call
sites, gets test coverage for the first time (`listResource.test.ts`):
pagination, `insert`/`setValue` refreshing the list, caching, and `reload()`'s
pagination-state restore.

### Tailwind preset — `content` export added

`frappe-ui/tailwind` exports `content`, the glob list of frappe-ui source
directories that emit Tailwind classes. Spread it into your app's
`tailwind.config.js` `content` array instead of hand-maintaining the paths —
see the new [Tailwind Setup](/docs/foundations/tailwind) docs page. Tailwind
v3 doesn't merge a preset's `content`, so this was previously unavoidable
hand-maintenance, and it had already drifted: some apps on
`frappe-ui@1.0.0-beta` glob `src/components/**` only, silently dropping every
class the editor and list molecules emit.

### Tailwind preset — `tokens.js` export removed (breaking)

The `./tailwind/tokens.js` export is removed outright, with no deprecation
window. It had zero importers anywhere and re-exported `colorPalette.js` via
`export *`, the implementation-module re-export pattern disallowed by P15.
Use the preset (`frappe-ui/tailwind`) directly.

This ships before the `1.0.0` tag, while the library "evolves freely" (P13) —
the freeze that requires a deprecation window starts at the tag, not before
it. Zero call sites is also why it's a same-release removal rather than a
carried-forward deprecation: there is no consumer for a warning to reach.

### Tailwind preset — unused token vocabulary and utilities removed (breaking)

Design-token audit before the additive-only freeze (#940): every family in
`tailwind/generated/*.json` and every utility/`--*` variable `plugin.js`
emits was checked against frappe-ui's own source, docs, and stories, plus a
fresh census of all consumer apps (crm, helpdesk, gameplan, insights,
builder, suite, central, frappe_calendar, frappe-ui-starter, and frappe's
`ui/` package). The primitive and semantic color ramps (all twelve hues, in
`surface-*`/`ink-*`/`outline-*`), and every typography weight (including
`bold`/`black`) and size through `text-12xl`, turned out to be real,
in-use vocabulary — none of that is touched. What had zero call sites
everywhere is removed:

- **`text-tiny`** and its uppercase text-transform. Not even
  shown in the docs' own type-scale page.
- **`text-13xl` through `text-16xl`** (and their `-medium`/`-semibold`/
  `-bold`/`-black` variants). The docs' own "display sizes" showcase stops
  at `text-12xl` — these four sizes were past what even the type-scale demo
  used.
- **`shadow-status`** and its backing `--elevation-status` variable. Named
  once in prose on the elevation docs page but never rendered there or
  anywhere else.
- **`surface-alert-button-*` / `ink-alert-button-*`** (`default`, `info`,
  `success`, `warning`, `error`). `Alert`'s buttons color via the shared
  `variant`+`theme` axes (P4); this Figma spec never got wired to code.
- **`surface-alpha-gray-2-overlay`**. Resolved to the black/white overlay
  ramp rather than the gray-alpha ramp its name implies, breaking the
  `{family}-{step}` pattern every other `surface-alpha` entry follows.

All five are silent breaks — a missing Tailwind class or `--*` var just
stops applying, no build or type error. See the migration guide.

The token generator (`tailwind/figma-tokens-to-theme.js`) now filters these
out at the source, so they stay gone on the next `yarn sync-tokens` run
rather than reappearing. `ALPHA_FAMILIES` also dropped a dead `'red-alpha'`
entry that never matched anything in the Figma export — no emitted token
changed.

**Also removed:** `tailwind/colors.js`, a 642-line legacy color module
superseded by `colors.json` + `colorPalette.js`. It had zero importers and
wasn't reachable through any `frappe-ui` package export (no `./tailwind/*`
wildcard) — deleting it doesn't change anything for consumers.

### `frappe-ui/vite` — types and docs

`frappe-ui/vite` now ships hand-written types (`vite/index.d.ts`, wired via
the `types` export condition), so `frappeui(...)` and its options
(`frontendRoute`, `lucideIcons`, `barrelImports`, `frappeProxy`,
`jinjaBootData`, `buildConfig`, `frappeTypes`) are typed without a
`// @ts-expect-error` workaround. Also added a
[docs page](/docs/other/vite) covering every sub-plugin,
including `barrelImports` — previously undocumented on the docs site.

### list-style.css and editor-style.css exports — removed

- **Breaking:** the manual `frappe-ui/list-style.css` and
  `frappe-ui/editor-style.css` exports are gone (loud — the consumer build
  fails with `Missing "./list-style.css" specifier`). They existed only
  because bundlers tree-shook the side-effect `import './style.css'` inside
  the `frappe-ui/list` and `frappe-ui/editor` barrels. The barrels are now
  listed in `sideEffects`, so each family's CSS ships automatically the
  moment you import anything from its subpath — delete the manual `@import`
  lines. The tree-shake was never Rolldown-specific: plain Rollup/Vite
  production builds dropped the CSS too.

### Toggles and ranged inputs — deprecated members removed

Per ADR-0008, the family's deprecated aliases are **removed**, not shipped
frozen. All five had zero call sites across the consumer apps. These are
silent breaks — old code compiles and runs, but the name is ignored (see the
migration guide's Inputs table):

- `Rating.rating_from` → `max`; `Rating.readonly` → `disabled`.
- `Switch.change` emit → `v-model` / `@update:modelValue`; `Switch.labelClasses`
  → `data-*` styling hooks.
- `Checkbox.padding` → `padded`.

`Slider` now exports its types (`SliderProps`, `SliderEmits`, `SliderValue`),
and `Rating` exports `RatingEmits`.

### CircularProgressBar — removed

- **Breaking:** `CircularProgressBar` is no longer exported (loud — the import
  fails). It was a second component for `Progress`'s concept (P8), with
  hardcoded light-mode colors and a structured `theme` object prop (P3/P4).
  One call site existed across all consumer apps. Use `Progress`, or copy the
  old SFC into your app if you need the radial form.

### Node.js requirement

- **Breaking:** Node floor is now `>=20.19.0` (was Node 18 on 0.1.x). Declared
  via `package.json` `engines` so installers and CI surface the requirement
  instead of opaque transitive-dep engine errors.

### Portal target for embedded apps

- `portalTo` on `Popover`, `HoverCard`, `Dropdown`, `Select`, `Combobox` and
  `MultiSelect` no longer declares a `'body'` prop default. An unembedded app
  still gets `'body'`, now as a fallback. No existing call behaves differently.
- New `usePortalTarget` / `providePortalTarget` / `portalTargetKey` exports let
  an embedding host redirect every overlay at once. See
  [`spec/portal-target.md`](https://github.com/frappe/frappe-ui/blob/main/spec/portal-target.md).

### Dialog — v1 spec

- Flat top-level props (`title`, `message`, `icon`, `size`, `position`,
  `paddingTop`, `actions`) are canonical. The legacy `options` blob is
  removed — see below.
- `v-model:open` is canonical; `v-model` (modelValue) still works silently.
- New props: `dismissible` (default `true`, replaces
  `disableOutsideClickToClose`), `bare`, `showCloseButton` (default `true`,
  independent of the auto-header).
- Canonical slots `#default`, `#title`, `#actions` (scoped with
  `{ close, actions }`). The legacy `#body*` slots are removed — see below.
- `icon.theme` (`amber | blue | red | green`) replaces `icon.appearance`,
  which is removed — see below.
- Auto-header no longer renders an "Untitled" fallback.

### Dialog — imperative `dialog.*` API

- New callback-based helpers: `dialog.confirm()`, `dialog.danger()`,
  `dialog.prompt()`. The `onConfirm` callback runs on click; resolving
  auto-closes the dialog, while throwing keeps it open and renders the thrown
  message inline. The action button shows a loading state until `onConfirm`
  settles. Each helper also returns a synchronous handle with `close()` for
  programmatic dismissal.
- `<FrappeUIProvider>` now renders `<Dialogs />` next to `<Toasts />`, so
  apps wrapped with the provider get the imperative stack for free.
  `<Dialogs />` is still exported for callers that don't use the provider.
- `ConfirmDialog` and `confirmDialog()` are removed — see below; use
  `dialog.confirm()` / `dialog.danger()`.
- New root exports: `DangerArgs`, `DialogControl`, `PromptControl`,
  `DialogHandle`, `PromptFieldValidator`. `DialogSlotProps` is exported from
  the `Dialog` barrel.

### Dialog — deprecated surface removed (breaking)

Every member marked `@deprecated` is deleted, per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md). Nothing is
aliased and nothing warns.

- **Breaking, silent:** the `options` blob prop and `DialogOptions` type are
  gone. It bundled `title`/`size`/`icon`/`actions` into one object. An
  `:options="{...}"` call site still compiles — Vue drops the unknown prop as
  an inert attr — but the dialog silently loses its title, size and actions.
  Use the flat top-level props.
- **Breaking, silent:** `disableOutsideClickToClose` is gone. It still lands
  as an inert attr, and `dismissible` (the inverse) defaults to `true`, so the
  dialog silently becomes dismissible. Use `dismissible`.
- **Breaking, silent:** `icon.appearance` and `DialogIconAppearance` are gone;
  only `icon.theme` remains. An `appearance` key is dropped, so the icon
  renders with no tone. Map `warning → amber`, `info → blue`, `danger → red`,
  `success → green`.
- **Breaking, silent:** the legacy `#body`, `#body-content`, `#body-main`,
  `#body-title` and `#body-header` slots are gone. Vue drops an unknown named
  slot with no error, so a missed call site renders nothing where that slot's
  content used to be. Use `#default`, `#title` and `#actions`; `#body` maps to
  `bare` + `#default`.
- **Breaking:** the callable-context shim on action `onClick` is gone. The
  context used to be callable as well as a plain object (`ctx()` closed the
  dialog); it is `{ close }` only now, so calling it as a function throws
  `TypeError: ctx is not a function`.
- **Breaking:** `defineExpose({ close })` and the `DialogExposed` type are
  gone — Dialog exposes nothing on its template ref (ADR-0012). A template-ref
  `.close()` call throws a `TypeError`. Use `v-model:open = false`, or the
  `close` slot prop. Zero known call sites.
- **Breaking:** `ConfirmDialog` and `confirmDialog()` are deleted. The import
  fails, so the build names every call site. Use `dialog.confirm()` /
  `dialog.danger()`.

Before/after for the silent breaks is in the
[migration guide](/docs/migration#dialog).

### DatePicker family — v1 spec

`DatePicker`, `DateRangePicker`, and `DateTimePicker` share the v1
popover-trigger vocabulary used by `Combobox` / `Dropdown` / `Select`.

- `side` (default `'bottom'`) + `align` (default `'start'`) + `offset`
  (default `4`) replace `placement` (removed).
- `keepOpen` (default `false`) replaces `autoClose` (removed, inverse).
- `typeable` (default `true`) replaces picker-level `readonly` and
  `allowCustom` (both removed). `:typeable="false"` blocks typing while
  keeping the popover interactive.
- Constraints: `min?: string` and `max?: string` (`YYYY-MM-DD`, plus
  `YYYY-MM-DD HH:mm:ss` on `DateTimePicker`), and
  `isDateUnavailable?: (date: Dayjs) => boolean` for arbitrary disabling.
  Min/max and the predicate compose. On `DateTimePicker`,
  `minDateTime`/`maxDateTime` are removed in favor of `min`/`max`.
- `v-model:open` supported on all three pickers via `open` + `update:open`.
- `openOnFocus` (default `false`) and `openOnClick` (default `true`) let
  consumers opt out of either trigger path. Same defaults applied to
  `Combobox` for parity.
- `#trigger` is the canonical custom-trigger slot; `#target` is removed.
- `DateRangePicker.clearable` now defaults to `true`; footer hides when
  there is nothing to clear. Live hover preview while picking the end
  date and a stable trigger width derived from `format` were added in the
  same pass.
- Public type exports added: `DateTimePickerProps`,
  `DateRangePickerEmits`, `DateTimePickerEmits`, `DateRangeValue`.

### DatePicker family — `DateRangePicker` emit shape (breaking)

`DateRangePicker` emits `update:modelValue` / `change` as a `[from, to]`
tuple (`DateRangeValue = [string, string] | []`) instead of a comma-joined
string. The `modelValue` prop already accepted `string[]`; the emit is
what changes.

```ts
// before
function onChange(v: string) { const [from, to] = v.split(',') }
// after
function onChange(v: DateRangeValue) { const [from, to] = v } // [] when cleared
```

Reactive forms that pass the value through unchanged are unaffected.

### DatePicker family — footer removed; new `#actions` sidebar slot

The dedicated popover footer on `DatePicker`, `DateRangePicker`, and
`DateTimePicker` has been removed, including the auto-rendered Clear
button that used to render there when `clearable && hasValue`. `clearable`
still governs the input-level clear affordance.

- New `#actions` slot renders as a **left sidebar** inside the popover.
  Slot props include `close`, `setDate` / `setRange`, and `clear`.
  `DateRangePicker`'s `setRange([from, to])` commits both endpoints
  atomically — use it for fixed-window presets ("Last 7 days").
- Popover content is `w-fit` when the slot is provided.
- `data-slot="actions"` is set on the sidebar `<aside>` for CSS hooks.

Migration: callers who relied on the auto-rendered Clear button should
render an explicit Clear row inside `#actions` using the `clear` slot prop.

### DateTimePicker — date selection keeps popover open (breaking)

Selecting a date in `DateTimePicker` no longer auto-closes the popover.
Focus moves into the embedded `TimePicker` instead, so users get a
continuous date → time flow. The popover closes on `Esc`, click-outside,
or programmatic `close()`.

Migration: callers relying on the implicit close should bind `v-model:open`
and close from `@update:modelValue`, or render an "Apply" button in
`#actions` (which receives `close` in its slot scope).

### TimePicker — v1 refresh

Same vocabulary as the DatePicker family plus a flexible parser.

- `side` / `align` / `offset` replace `placement` (removed).
- `keepOpen` (default `false`) replaces `autoClose` (removed).
- `typeable` (default `true`) replaces picker-level `readonly` / `allowCustom`
  (both removed).
- `v-model:open` via `open` + `update:open`; new `openOnFocus` (default
  `false`) and `openOnClick` (default `true`) props.
- Flexible typed input: `"3pm"`, `"3.30pm"`, `"1500"`, `"9:30:15 am"`
  parse to canonical `HH:mm[:ss]`.
- `min` / `max` replace `minTime` / `maxTime` (removed).
- `scrollMode` is removed; list is always centered on the selection.
- Template ref exposes only `focus()` (ADR-0012). `selectAll()` and
  `blurInput()`, dead members with no callers, are removed.

### DatePicker family — keyboard navigation

Full keyboard nav inside the calendar grid (WAI-ARIA APG Date Picker
Dialog spec).

- `↓` on the trigger input opens the popover and moves focus to the
  selected/today cell.
- Grid: `←`/`→` ±1 day, `↑`/`↓` ±1 week, `Home`/`End` week edges,
  `PageUp`/`PageDown` ±1 month, `Shift+PageUp`/`Shift+PageDown` ±1 year.
- `Enter` / `Space` selects. `Esc` closes and returns focus to the input.
- Disabled dates (via `min` / `max` / `isDateUnavailable`) are skipped.
- Arrow keys auto-advance across month boundaries.
- `DateRangePicker` dual-pane: arrow keys cross panes without advancing
  the view; range-hover shading tracks the keyboard-focused cell.

Roving tabindex: exactly one cell is in the tab order, so `Tab` enters
and leaves the grid as a single unit. Custom `#trigger` slots opt in
automatically — any open path moves focus into the grid since a
non-`TextInput` trigger has no typing context.

### DatePicker family — legacy composable removed

`useDatePicker` and its helpers (`getDate`, `getDatesAfter`,
`getDaysInMonth`, `isLeapYear`) were not used by any picker component and
were not part of the v1 API. Deleted outright — the import fails, so the
break is loud.

### DatePicker / TimePicker family — deprecated aliases removed (ADR-0008)

The back-compat aliases these components carried through the betas are
deleted, not kept as warn-and-map shims — per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md), no
deprecated member ships in `1.0.0`. Before/afters in the
[migration guide](/docs/migration#datepicker-timepicker-family).

- **`placement`, `autoClose`, `allowCustom`, picker-level `readonly`,
  `inputClass`, `value` prop removed.** All silent: a leftover prop lands as
  an inert extra attribute instead of doing anything.
- **`#target` slot removed.** Content in a leftover `<template #target>`
  silently stops rendering. Use `#trigger`.
- **`DateTimePicker.minDateTime`/`maxDateTime` and
  `TimePicker.minTime`/`maxTime` removed.** Silent: the constraint just stops
  being enforced. Use `min`/`max`.
- **`TimePicker.scrollMode` removed.** Silent; the list is always centered.

`change` stays as a supported second emit alongside `update:modelValue` —
it was never deprecated on `TimePicker`, and `DateTimePicker` depends on it
internally, so removing it from the other two pickers would have been an
inconsistent, unforced break.

### Input family — shared labeling contract

`TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`, `Rating`, and
`Slider` accept `label`, `description`, `error`, `required`. Id is
auto-generated; `<label for>`, `aria-describedby`, `aria-errormessage`,
`aria-invalid`, `aria-required` are wired automatically. `error` accepts
`string` or `Error` (with `Error.messages` rendered as stacked plain text).
Existing call sites unchanged.

### Input family — `data-*` styling hooks

Every input shell renders the canonical `data-*` vocabulary so external
CSS can target inputs without class-injection props:

- `data-slot` (`"label"`, `"control"`, `"description"`, `"error"`)
- `data-size`, `data-variant` (where applicable)
- `data-state` (`"valid" | "invalid" | "checked" | "unchecked" | …`)
- `data-disabled`, `data-required`

### Password — `v-model` fix

`Password` now uses `defineModel<string>()`, fixing the existing bug where
`<Password v-model>` did not update from typing. Explicit `size`, `variant`,
`disabled`, `placeholder`, `id`, `required` props replace `$attrs` routing.

### Password — `value` prop removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md), no
deprecated member ships in `1.0.0`. `value` warned and seeded `v-model` since
it was deprecated earlier in this cycle; a census of every downstream app
found zero call sites still passing it. Use `v-model` / `modelValue`.

### TextInput / Textarea / Password / Duration — `focus()` and `inputElement` on the ref

Implements [ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md).

- **Breaking:** `TextInput.el` and `Textarea.el` are renamed to
  `inputElement` — a computed, typed `HTMLInputElement | null` /
  `HTMLTextAreaElement | null`, never a raw ref.
- All three, plus `Duration`, now expose `focus(options?: FocusOptions)`.
  `Password` previously exposed nothing.
- `TextInput`, `Textarea`, and `Password` share one exported type,
  `TextInputExposed`, from `TextInput`'s `types.ts`.
- `DurationExposed.focus` gained the same `options?` parameter; its member
  set is unchanged.

### Rating — `max` replaces `rating_from`

Default `5`. (The old name was kept as a deprecated alias during the betas
and is now removed — see "Toggles and ranged inputs" above.) `Rating` no
longer imports `FeatherIcon`; default star comes from `lucide-star` via
the shared Tailwind plugin. Filled stars now render visibly for non-zero
values.

### Slider — additive props and a11y fix

- `disabled` prop added.
- `size: 'sm' | 'md'` added; `'md'` scales track and thumb proportionally.
- New `value-commit` emit fires when dragging ends (use for side-effects
  you don't want on every step).
- Removed hardcoded `aria-label="Volume"`. Labeling now flows through the
  shared contract; pass `label` explicitly. (Treated as a bug fix — every
  non-volume call site was announced as "Volume" by assistive tech.)
- Visibility: visible track in collapsed wrappers, full-width by default.
- Uncontrolled `Slider` initializes to `min` instead of rendering with no
  thumb.

### Switch — Lucide icons; deprecations

No longer imports `FeatherIcon`. `icon` is now `string | Component`;
`lucide-*` strings route through the shared Tailwind plugin. `labelClasses`
and the `change` emit were deprecated during the betas and are now removed
(see "Toggles and ranged inputs" above). Row hover/active background removed.

### Checkbox — `padding` deprecated

In favor of `padded`. (Now removed — see "Toggles and ranged inputs" above.)

### Textarea — `ghost` variant; `required` prop

`Textarea` now accepts the `'ghost'` variant (matching `TextInput` and
`Password`) and the shared `required` prop.

### TextInput / Textarea — `ghost` variant paints transparent (fix)

`ghost` set no `bg-*` class, so `@tailwindcss/forms` preflight painted the
input `#fff` — a white pill in dark mode. `ghost` now sets `bg-transparent`,
matching Combobox's own ghost search input. Closes #851.

### FeatherIcon — removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md), the
deprecated `FeatherIcon` component is deleted, along with the
`feather-icons` dependency. `lucide-*` strings (or a `Component`) are the
only supported icon forms now.

- **Breaking, loud:** `import { FeatherIcon } from 'frappe-ui'` and
  `<FeatherIcon>` fail at the import.
- **Breaking, silent:** every icon-name prop across the library
  (`Button.icon` / `iconLeft` / `iconRight`, `Dialog.icon`, `Dropdown` /
  `ContextMenu` item `icon`, `TabButtons` options `icon` / `iconLeft` /
  `iconRight`, `Icon.name`) used to fall back to `FeatherIcon` for a bare
  feather-style name (e.g. `"edit"`). That fallback is gone: an
  unrecognized string now renders nothing, with a dev-mode console warning
  once per (component, prop). Prefix the name with `lucide-`.

```vue
<!-- before -->
<FeatherIcon name="plus" class="size-4" />
<Button icon="plus" />

<!-- after -->
<span class="lucide-plus size-4" aria-hidden="true" />
<Button icon="lucide-plus" />
```

Hardcoded internal `FeatherIcon` usages across core components were
migrated to `lucide-*` in this release.

Before/after for the silent break is in the
[migration guide](/docs/migration#icons).

### Input — removed (breaking)

- **Breaking:** `Input` and its `Input.cy.ts` tests are deleted. Per
  [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md), no
  deprecated member ships in `1.0.0`; a census of downstream apps found no
  live call sites left that render `<Input>` (five registrations were dead
  global component registrations, never rendered). Use `TextInput` for
  text-like modes, or `Textarea` / `Select` / `Checkbox` for the other type
  modes `Input` accepted.

### Card, ListItem, standalone Toast — removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md), three
unmaintained wrappers that shipped `@deprecated` in code are deleted, not
carried forward. All three had zero call sites across the census of
downstream apps.

- **Breaking:** `Card` and its `.vue` file are removed. No drop-in
  replacement — rebuild the title/subtitle/actions/loading layout with
  plain markup, using `LoadingText` or `Skeleton` for the loading state.
- **Breaking:** `ListItem` and its `.vue` file are removed. No drop-in
  replacement — rebuild the title/subtitle/actions row with plain markup.
- **Breaking:** the standalone `Toast` SFC (`import { Toast } from
  'frappe-ui'`) is removed. This only affects direct usage of the raw
  `ToastRoot`-based component; the imperative API (`toast()` /
  `toast.success()` / `toast.error()` / `toast.info()`) and
  `<ToastProvider>` are unaffected and unchanged.

All three fail loudly at the import. Before/after examples are in the
[migration guide](/docs/migration#card-listitem-standalone-toast-removed).

### FormLabel — moved to a component directory (non-breaking)

`FormLabel` now lives at `src/components/FormLabel/FormLabel.vue` instead of
a bare `src/components/FormLabel.vue`, matching the rest of the input
family. It gains `types.ts`, tests, stories, and a docs page. The import
path for consumers (`import { FormLabel } from 'frappe-ui'`) is unchanged.

### LoadingIndicator / LoadingText — moved to component directories (non-breaking)

Same move as `FormLabel`, for the same reason: both now live at
`src/components/LoadingIndicator/` and `src/components/LoadingText/`
instead of bare `.vue` files directly under `src/components/`. Each gains
`types.ts` (`LoadingIndicatorProps`, `LoadingTextProps`), stories, a docs
page, and cypress tests. The import path for consumers
(`import { LoadingIndicator, LoadingText } from 'frappe-ui'`) is
unchanged.

Kept as distinct components from `Spinner` and `Skeleton` (P8) — usage
data across the consumer census shows real, separate demand:
`LoadingIndicator` (~60 files) and `LoadingText` (~11 files) are both
load-bearing, not redundant overlap.

### Icon — docs page and stories added

`Icon` had no `stories/` folder, so it did not appear in the docs site
despite being a public export. It now has a docs page and two stories
(lucide string form, and the `Component` escape hatch).

### MonthPicker — removed (breaking)

`MonthPicker` and its whole barrel (`MonthPicker.vue`, types, stories) are
deleted. It duplicated `Select` for a narrower case. Use `Select` with month
options — see the
[migration guide](/docs/migration#monthpicker). The import
fails, so the break is loud.

### Legacy components — dev-mode warnings

`Pill` is no longer exported from the package entrypoint. It remains an
internal `TabButtons` detail.

`ThemeSwitcher` moved to `frappe-ui/experimental` and stays deprecated there.
For new theme switchers, compose `Select` with the `useColorScheme` composable.

### Autocomplete — removed (breaking)

- **Breaking:** `Autocomplete` and its `AutocompleteProps` type are deleted.
  Use `Combobox` for one value and `MultiSelect` for several. The import
  fails, so the build names every call site. `trigger="button"` on either
  replacement is the shape `Autocomplete`'s default target had: a button
  showing the selection, with the search box inside the popover.
- **Breaking, silent:** `FormControl type="autocomplete"` is removed. The
  dispatcher falls through to `TextInput` and still forwards the type, so the
  result is `<input type="autocomplete">` — a plain text box, with no build or
  runtime error. A dev-only `console.error` names the removal.
- **Breaking, silent:** the `v-model` payload inverts. `Autocomplete` modelled
  the whole option object; both replacements model the value only. Listen to
  `@update:selectedOption` where the whole option is needed.
- **Breaking, silent:** `#target`'s `open` slot prop was the *function* that
  opened the popover; `#trigger`'s `open` is the open *state*. Anything reading
  it as a value (`v-if="open"`) was always truthy and now is not.
- `#target` → `#trigger` otherwise: `Combobox` and `MultiSelect` attach the
  open toggle to the trigger element themselves, so drop the click handler. A
  `togglePopover()` carried through the rename throws on click — the popover
  still opens, so it reads as working while logging an error.
- Grouped options use `{ group, options }`, not `{ group, items }`. Both
  normalizers now throw naming the group and the rename, rather than dying
  inside a `map` call.

Before/after for each silent break is in the
[migration guide](/docs/migration#autocomplete-removed).

### Dropdown / ContextMenu — deprecated members removed (ADR-0008)

Three surfaces that shipped as deprecated aliases in the betas are deleted,
not aliased. All three are **silent breaks** in plain-JS apps — before/afters
in the
[migration guide](/docs/migration#dropdown-and-contextmenu);
TypeScript callers get compile errors (the removed keys stay typed as
`never`), and a dev-mode console warning fires when the old shape reaches the
menu at runtime.

- **`placement` prop and `DropdownPlacement` type removed.** Use `align`
  (`left`→`start`, `center`→`center`, `right`→`end`). A leftover `placement`
  is ignored and the menu falls back to `align="start"`.
- **`{ group, items }` removed.** Use `{ group, options }`, matching
  `Combobox` / `MultiSelect` / `Select`. A leftover `items` group renders as
  an empty menu.
- **`component:` option rows removed** (`DropdownComponentOption`,
  `ContextMenuComponentOption`). Use `slots: { item: fn }`. A leftover
  `component:` row renders as a plain action row off its `label`.

Also removed: the **`DropdownExposed` type** — it described a `close()`
template-ref member that `Dropdown` never implemented ([ADR-0012] keeps
`Dropdown`'s template-ref surface empty; `v-model:open` and the `close` slot
prop cover it). Type-only, so the break is loud.

### Dropdown — disabled state reaches the menu primitive

The trigger now forwards its disabled state (from `button.disabled` or a
`disabled` fallthrough attribute) to the underlying menu primitive.
Previously only the generated `Button` was natively disabled; a custom
trigger slot with a `disabled` attribute could still open the menu via
keyboard or synthetic clicks.

### Select — `#item-*` slot prop renamed to `item`

`#item-prefix`, `#item-label`, and `#item-suffix` on `Select` expose
`item` as the canonical scoped binding, matching `Combobox` and
`MultiSelect`. The previous `option` key is removed with the rest of the
deprecated surface (ADR-0008) — destructuring `{ option }` yields
`undefined`, silently. No runtime warning is possible (slot-prop
destructuring isn't detectable), so grep for `#item-` slots destructuring
`option`.

```vue
<!-- before -->
<Select :options="people">
  <template #item-prefix="{ option }">
    <Avatar :image="option.image" />
  </template>
</Select>

<!-- after -->
<Select :options="people">
  <template #item-prefix="{ item }">
    <Avatar :image="item.image" />
  </template>
</Select>
```

### Combobox — trigger sizing matches Select

Root renders as a transparent layout box so the trigger sizes like
`Select` in flex/grid containers. Query decoupled from model in button mode.

### Combobox / MultiSelect — `#suffix` slot replaces the chevron

New `#suffix` slot on `Combobox` (input and button modes) and `MultiSelect`,
mirroring the existing slot on `Select`. Providing the slot replaces the
default chevron — render an explicit chevron fallback when your content is
conditional. Canonical use is an inline clear button. See
`Combobox/stories/Clearable.vue`.

### Combobox — `condition` authoritative for `type: 'custom'` rows

A custom row's `condition({ query })` is now consulted even before the user
types since opening, so it can fully gate its own visibility based on
selection state and the typed query. Selectable rows are unchanged. This
makes "create new" patterns expressible directly via `condition`, with no
need for a dedicated `createOption` prop. See `Combobox/stories/CreateNew.vue`.

### MultiSelect — `#summary` suppresses the phantom sizer

The trigger's default behavior pins a minimum width derived from the
worst-case default summary (`placeholder` vs `"N selected"`) so the
trigger doesn't jitter as the count changes. That sizer can't predict
custom text, so it's now skipped when `#summary` is provided — the
trigger becomes content-sized and the consumer owns the width.

### InputLabel — slot polish

The default required indicator is not rendered when `#label` is used
(slot receives `{ required }`). The labeling wrapper is dropped entirely
when there is nothing to label.

### Popover — v0 API removed (breaking)

Every member marked `@deprecated` is deleted, per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md). Nothing is
aliased and nothing warns.

- **Breaking, silent:** the `#target`, `#body` and `#body-main` slots are gone.
  Vue drops an unknown slot without an error, so a missed call site renders a
  popover with no trigger, or an empty one. Use `#trigger` and `#default`.
- **Breaking, silent:** `#trigger` wires the click itself through reka's
  `PopoverTrigger`. A click handler carried over from `#target` toggles the
  popover a second time, so it opens and shuts on one click.
- **Breaking, silent:** the `togglePopover` and `updatePosition` slot props are
  gone. `toggle` replaces the first; reka repositions on its own, so the second
  has no replacement.
- **Breaking, silent:** `placement`, `show`, `hideOnBlur`, `matchTargetWidth`,
  `trigger`, `hoverDelay`, `leaveDelay`, `popoverClass` and `transition` are
  removed, and the `update:show` emit no longer fires. An unknown prop is
  ignored, so the popover renders in its default position and state.
- **Breaking, silent:** attributes on `<Popover>` are no longer inherited.
  They used to land on a wrapper the legacy `#target` rendered; `#trigger` is
  as-child and renders no wrapper. Move `class` and `style` onto the element
  inside `#trigger`.
- **Breaking:** the `PopoverPlacement` and `PopoverLegacySlotProps` types are
  removed. Use `PopoverSide` + `PopoverAlign` and `PopoverSlotProps`. The
  import fails, so the build names every call site.
- Fixed: `CalendarWeekDayEvent` passed `placement="center"` in month view,
  which is not a side and reached reka as one. It is `side="bottom"` +
  `align="center"` now.
- **Breaking, silent:** the slot props are `{ open, close, toggle }`. `open` is
  now the boolean state, matching `Dropdown`, `Select`, `MultiSelect`,
  `HoverCard` and `Sidebar`; the `open()` method it used to be had no callers,
  since `#trigger` opens itself. `isOpen` is gone — read `open` instead. A
  destructured `isOpen` becomes `undefined` with no error, so styling that
  depends on it stops applying silently.
- Fixed: `MonthPicker` styled its panel through `popoverClass`, which had
  already become a no-op, so the panel rendered with no surface at all. It
  uses the standard panel shell now.
- Fixed: `:dismissible="false"` still closed on `Escape`. Only the outside-click
  channel was wired, while `CONTEXT.md` defines `dismissible` as covering both.

Before/after for each silent break is in the
[migration guide](/docs/migration#popover-hovercard-tooltip).

### NestedPopover — removed (breaking)

- **Breaking:** `NestedPopover` is deleted. Use `Popover`. It never nested
  anything, and it was the library's last `@headlessui/vue` + `@popperjs/core`
  popover — `@popperjs/core` leaves `dependencies` with it. The import fails,
  so the build names every call site.

### Tooltip — vocabulary aligned with Popover and HoverCard (breaking)

- **Breaking, silent:** `placement` is renamed to `side`, matching `Popover`
  and `HoverCard`. An unknown prop is ignored, so the tooltip keeps working and
  points at its default side.
- **Breaking, silent:** `arrowClass` is removed (P10 — no class-injection
  props). Style the arrow through `[data-slot="arrow"]`. It was documented as
  the arrow's fill but was mostly used to nudge the bubble's position, which
  the new `offset` prop does directly.
- Added: `offset` sets the gap in px between trigger and bubble, matching
  `Popover` and `HoverCard`. The bubble is no longer pinned at 4px.
- Added: `[data-slot="content"]`, `[data-slot="bubble"]` and
  `[data-slot="arrow"]` styling hooks.
- **Breaking, silent:** the `#body` slot is replaced by `#content`, which
  renders *inside* the bubble instead of replacing it. `#body` is not in P6's
  slot vocabulary, and it was the wrong shape: it stripped the bubble's surface,
  so six of the seven call sites in the apps hand-copied
  `rounded bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl` to put
  it back. Moving to `#content` usually means deleting that wrapper. Vue drops
  an unknown slot without an error, so a missed call site shows an empty
  tooltip.
- Added: `bare` renders `#content` without the bubble shell, for content that
  brings its own surface — an image preview, say. The arrow still renders. This
  is the honest form of what `#body` was reached for.
- `TooltipBubble` is no longer exported. It is the internal bubble shared by
  `Tooltip` and `Button`, with no call sites outside the library.
- `Tooltip` keeps `#default` as the **trigger**, deliberately. It is the one
  inversion in the library, recorded under P6: over 200 call sites use the
  `<Tooltip text="…"><Button /></Tooltip>` shorthand, and renaming the slot
  would move every one of them for no behavioral gain.

Before/after is in the
[migration guide](/docs/migration#tooltip).

### HoverCard — `open()` and `close()` on the template ref

- Added: `open()` and `close()` on the component instance, matching `Popover`.
- The trigger slot's props are now typed (`HoverCardSlotProps`) instead of
  `any`.

### BottomSheet — focus stays inside an open sheet

The sheet opts out of autofocusing its first field, so it does not pop the
keyboard on a phone. That also left focus on the trigger behind the overlay,
with nothing holding it — `Tab` walked the page behind an open modal. The sheet
now takes focus itself on open. The keyboard still stays down.

### Divider — `action.handler` removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
`action.handler` is deleted, not carried forward as a warning. Use
`action.onClick`. Zero call sites across the census. Silent break — a
leftover `handler` is dropped as an unknown key, so the action button
renders but does nothing on click. Action mode preserves separator
semantics for assistive technologies.

### PageHeaderBackButton — `to` is now a fallback (breaking)

`to` used to be the destination. Setting it made every tap push that
route. It is now used only when there is no in-app history to go back
to, such as a cold load onto a deep link. Every other tap goes back
through history.

A back button that always lands on one fixed route is not a back button.
It drops the user wherever the page author guessed they came from, which
is wrong for every other way into the page.

Migration: nothing to do if `to` already named the page users came from.
It now applies only on a cold load. If you need an unconditional push,
use a plain `Button` with your own `router.push`.

### Editor — media captions moved off `alt` (breaking)

Text in an image's or video's `alt` no longer renders as a caption.
Captions live in a separate `caption` attribute, serialised as
`data-caption`. `alt` goes back to being the screen reader description
only.

Existing `alt` values still parse and still round-trip untouched. They
just do not display as a caption any more.

The editor no longer edits `alt` at all. The caption field used to write
it; it now writes `caption`, and no other control took over `alt`. Set it
from your own content pipeline until an alt field lands.

There is deliberately no fallback from `caption` to `alt`. Stored `alt`
values are mostly upload filenames and emoji shortcodes, and a real
caption cannot be told apart from those automatically. Showing all of
them is worse than showing none.

Migration: to keep a caption visible, copy the text into `caption`. A
one-off content migration can do that where you know the old `alt`
values were captions.

### HTTP transport — four paths collapse to one (breaking)

`frappeRequest` is the single transport. Removed from the root export:

- **`request`** — the bare `fetch` wrapper under `frappeRequest`, now
  internal. Use `frappeRequest`.
- **`createCall`** — no consumers in any app.
- **`initSocket`** — no consumers in any app; every one defines its own.
  `socket.io-client` remains a dependency (`resources/realtime.ts` exports
  functions typed against its `Socket`).

All three are build failures at the import.

**`call` now honours `setConfig` (silent).** It kept its
`(method, args, options)` signature, the value it resolves to, and the
`{ response, status, error }` shape it hands `onError`, but it delegates to
`frappeRequest` instead of building its own `fetch`. It had never imported
`getConfig`, so `requestBaseUrl` and `requestHeaders` were ignored on every
`call()` while `frappeRequest` respected them. Two consequences in apps that
set either: `call` now goes to the configured base URL with
`credentials: 'include'`, and `_server_messages` from a `call` now reach
`serverMessagesHandler`.

**`FrappeRequestError` is now exported.** `frappeRequest` threw it but
nothing exported it, so a consumer could not type a `catch`.

### `frappeRequest` — `onError` fired twice per failure (fix)

`request()` attached `transformError` with a trailing `.catch`, which also
caught what `transformResponse` threw. Every failed HTTP response therefore
ran `onError` twice. It now runs once, because `frappeRequest` marks an error
it has already reported rather than because the rejection handler sees less.
That distinction matters: an *ok* response whose body will not parse — Frappe
answers an expired session with 200 and its login page, so `response.json()`
throws — is a failure only that handler sees, and it still reaches `onError`.

**A method name starting with `http` skipped the `/api/method/` prefix (fix).**
The absolute-URL check was `url.startsWith('http')`, which matches the four
letters rather than a scheme, so `http_utils.api.run` was fetched as a relative
path. It now matches `https?://`.

`frappeRequest` also gained an
explicit return type and passes its type argument through, so
`frappeRequest<Foo>()` resolves to `Foo` rather than `unknown`.

**`login` returned only `message` when `requestBaseUrl` was set (fix).**
`login` is the one endpoint that resolves to the whole body, so a caller can
read `full_name` and `home_page`. The check compared the whole URL against
`/api/method/login`, and `requestBaseUrl` makes that URL absolute, so it
stopped matching and `login` quietly resolved to `data.message`. It now
matches on the path.

### `FrappeUI` plugin — one option left (breaking)

`app.use(FrappeUI)` accepts `resources` and nothing else, and no longer
installs it by default.

- **`socketio` removed.** It defaulted to `true`, so apps that also built
  their own socket opened two live socket.io connections per page load.
- **`call` removed.** It installed a `$call` global with no consumers.
- **`config` removed (silent).** `setConfig` is the entry point. One app
  passed it.
- **`resources` no longer defaults to `true`.** The v1 resources Options API
  mixin — `this.$resources`, `$getResource`, `$getDoc`, `$getListResource`,
  `$refetchResource` — installs only on
  `app.use(FrappeUI, { resources: true })`. Composition API resources are
  unaffected. `resourcesPlugin` stays exported for direct installation.

Because a removed *option* is ignored rather than rejected, the plugin logs a
dev-mode warning naming any option it does not accept and what to use instead.

**Removed features fail loudly, in production too.** A dropped option that
evaporates is an annoyance; a dropped feature that evaporates is a mystery
crash somewhere else. So:

- A component declaring a `resources` option without
  `app.use(FrappeUI, { resources: true })` throws on creation, naming itself
  and the fix.
- Reading `this.$resources` with the option off throws the same advice. Both
  guards exist because Vue routes what a lifecycle hook throws through its own
  error handling, which only logs in production — a read throws straight into
  app code in every build.
- Reading `this.$socket` or `this.$call`, the two globals the plugin stopped
  installing, throws a message naming the replacement instead of returning
  `undefined`. Assigning your own — `app.config.globalProperties.$socket = io(…)`
  — replaces the guard, before or after `app.use(FrappeUI)`.

`realtime: true` on a v1 resource still degrades quietly to a non-realtime
resource when no socket is set. That has always been its behaviour and this
does not change it.

### Data fetching (v2) — one request per submit

`useDoctype`'s `insert`, `delete`, `setValue`, `runDocMethod` and `runMethod`,
and `useList`'s `insert`, `setValue` and `delete`, each held a single shared
request. Two submits at once aborted one another, and every submit resolved
from the same `data`, so a caller could receive another caller's answer or
`null`. Each submit now sends its own request and resolves with its own
response.

- **Breaking:** these eight members no longer carry the `useCall` surface.
  Removed: `params`, `promise`, `url`, `reset`, `abort`, `execute`, `fetch`,
  `reload`, `isFetching`, `isFinished`, `canAbort`, `aborted`. Each of them
  described one shared request, which no longer exists.
- What is left, on all eight: `submit()`, `data`, `error`, `loading` and
  `isLoading()`. `loading` is true while any submit is in flight.
- New: `delete.isLoading(name)` and `setValue.isLoading(name)` on both
  `useDoctype` and `useList`. This replaces the
  `delete.loading && delete.params.name === row.name` idiom, which showed the
  same spinner on every row once two deletes overlapped.
- New: `insert.isLoading()` on both, taking no argument. A new document has no
  name to key on, so it answers for the whole method — the same value as
  `insert.loading`. It exists so all eight methods read the same way.
- `runDocMethod.isLoading(name, method)` and `runMethod.isLoading(method)` keep
  their signatures and now answer correctly with several submits in flight.
  They previously compared the shared URL, so only the newest submit read as
  loading.
- `data` and `error` belong to the submit that started last, not the one that
  answered last. A slow submit that comes back after a newer one is dropped: it
  writes no `data`, writes no `error` and clears nothing. It still answers its
  own caller with its own outcome — resolving with its response, or rejecting
  with its error.
- The winning submit writes `data` and `error` together. Success sets `data`
  and clears `error`. Failure sets `error` and leaves `data` alone.
- **`data` is no longer reset on failure.** The old shared `useCall` set `data`
  back to `null` whenever a response came back not-ok. It now keeps the last
  successful response. Read `error`, not `data`, to tell a failed submit from a
  successful one.
- `error` is no longer cleared when a submit starts. Clearing it there erased
  the error of a sibling submit that was still in flight. An error stands until
  the newest submit settles.
- **`submit()` now rejects on any failure.** It resolves with the response or
  rejects with the error — one channel, not two. A failed `validate` already
  rejected; a failed request used to resolve with `null`. Both reject now, and
  a server that answers with `null` resolves with `null`.
- `useList`'s `insert` and `delete` now send to `baseUrl`, which they silently
  dropped. `setValue` already used it, so all three write methods now agree.
  `useDoctype` was never affected — every one of its methods already passed
  `baseUrl`.

### Data fetching (v2) — `useFrappeFetch` off the root export (breaking)

**`useFrappeFetch` removed.** It is the raw `createFetch` instance `useCall`,
`useDoc` and `useList` are built on — headers, response parsing and error
shaping, and nothing above that: no URL building, no params, no caching, no
typed return. No app imports it. It is a build failure at the import; use
`useCall` for a whitelisted method, `useDoc` for one document, `useList` for a
query.

**`FrappeResponseError` is now exported.** The composables raise it on a Frappe
error response and put it on `.error`, and `submit()` rejects with it, but
nothing exported the class, so a consumer could not narrow the error. Same gap
`FrappeRequestError` closed for `frappeRequest`.

### Data fetching (v2) — docs, and the sidebar splits from Resources

`useCall`, `useDoc`, `useList`, `useDoctype` and `useNewDoc` each get a docs
page for the first time, under a new **Data Fetching** sidebar section —
`useCall` for a whitelisted method, `useDoc` for one document, `useList` for
a query, `useDoctype` for write-only access to a DocType, `useNewDoc` for a
draft-and-insert form.

The old **Data Fetching** section is renamed **Resources** and keeps its
three pages (Resource, List Resource, Document Resource) unchanged. Both
sections link to each other: Resources stays fully supported through `1.x`;
the new composables are the recommended layer for new code.

### Data fetching (v2) — `useNewDoc` lost reactivity after submit (fix)

`useNewDoc` built its return value with `reactive({ ...out, submit, doc })`.
Spreading a `reactive()` proxy reads every ref and computed once and freezes
the result, so `data`, `error` and `loading` stopped updating the moment the
object was built — a template bound to `newDoc.loading` never saw it flip.
The return value is now built by mutating the underlying object in place, so
its properties stay live.

### Data fetching (v2) — `initialData` did nothing on `useCall` and `useList` (fix)

Both documented an `initialData` option to show a placeholder before the
first response. Neither worked. `useCall` passed it straight to the
underlying fetch, which expects the wrapped `{ data: ... }` shape the API
actually returns — the unwrapped value was invisible, so `call.data` stayed
`null` until the first response. `useList`'s `data` is read from a separate
list built in `afterFetch`, which `initialData` never touched, so
`list.data` stayed `null` the same way. Both now show the seeded value
immediately, as documented.

### Root composables and directives — renamed and shrunk

Every change below is a **loud break**: the import line fails, so the build,
the type-check or the dev server says so. No silent behavior changes, and
nothing here needs a migration-guide before/after.

**`useTheme` is now `useColorScheme`.** `theme` means color tone everywhere
else in the library (`theme="blue"` on a Button, ~300 sites), so the light/dark
composable stops competing for the word.

```ts
// before
import { useTheme, type Theme } from 'frappe-ui'
const { currentTheme, setTheme, toggleTheme } = useTheme()

// after
import { useColorScheme, type ColorScheme } from 'frappe-ui'
const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
```

- `colorScheme` is **read-only**. Assigning to the old `currentTheme` ref moved
  the ref without setting `data-theme` or `localStorage`, so the app silently
  desynced. Go through `setColorScheme`.
- `initializeTheme` and `getSystemTheme` are gone. `useColorScheme()` already
  restores the saved preference and follows the OS on its first call.
- **The `data-theme` attribute and the `theme` `localStorage` key are
  unchanged.** App CSS targeting `[data-theme='dark']` and users' saved
  preferences keep working.

**Nine scroll members become two.**

```ts
// before
import { activeScrollContainer, useScrollContainer, scrollToTop } from 'frappe-ui'
const { isScrolled } = useScrollContainer({ threshold: 12 })

// after
import { shellScrollContainer, useShellScrolled } from 'frappe-ui'
const scrolled = useShellScrolled({ threshold: 12 })
shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
```

| Removed                        | Use instead                                     |
| ------------------------------ | ----------------------------------------------- |
| `activeScrollContainer`        | `shellScrollContainer`                          |
| `useScrollContainer().isScrolled` | `useShellScrolled()`                         |
| `useScrollContainer().el`      | `shellScrollContainer`                          |
| `getScrollContainer()`         | `shellScrollContainer.value` (works outside `setup()` too) |
| `scrollTo(o)`                  | `shellScrollContainer.value?.scrollTo(o)`       |
| `scrollToTop()`                | `shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })` |
| `registerScrollContainer` / `unregisterScrollContainer` | internal to `DesktopShell` / `MobileShell` |
| `UseScrollContainer`, `UseScrollContainerOptions` | no replacement needed          |

The `shell` prefix is deliberate: both resolve only while a `DesktopShell` or
`MobileShell` is mounted. `useShellScrolled` now warns once in development when
no shell is registered, instead of silently reporting `false` forever.

**Directives are `vFocus` and `vOnOutsideClick`.** `<script setup>`
auto-registers a directive only when the binding is named `vFoo`, so the old
names forced a manual alias at every call site.

```vue
<!-- before -->
<script setup>
import { onOutsideClickDirective as vOnOutsideClick } from 'frappe-ui'
</script>

<!-- after -->
<script setup>
import { vOnOutsideClick } from 'frappe-ui'
</script>
```

`visibilityDirective` is removed with no replacement (0 call sites). Use an
`IntersectionObserver` directly, or `@vueuse/core`'s `useIntersectionObserver`.

**`useScreenSize`, `useIsMobile` and `ScreenSize` are no longer exported.** They
were a thin wrapper over a `resize` listener that the library never used itself.
Copy the ~20 lines into your app, or use `@vueuse/core`'s `useWindowSize` /
`useMediaQuery`.

### `code-editor` subpath — folded into `experimental` (breaking)

- **Breaking:** `frappe-ui/code-editor` is removed. `CodeEditor`, `CodePreview`,
  and `loadLanguage` move to `frappe-ui/experimental` (ADR-0010). One downstream
  file imported the old subpath; the fix is a one-line import change.

  ```ts
  // before
  import { CodeEditor, CodePreview } from 'frappe-ui/code-editor'

  // after
  import { CodeEditor, CodePreview } from 'frappe-ui/experimental'
  ```

### `experimental` barrel — tidy and `FrappeUIError`

- **Breaking:** `LabelingWrapper` is dropped from `frappe-ui/experimental`.
  It stays exported from its own barrel (`src/components/InputLabeling`) —
  `Combobox`, `Select`, `MultiSelect`, and `MultiEmailInput` import it from
  there internally — only the `experimental` re-export had zero external
  importers, so only that goes. The only member cut in the barrel tidy.
- `FrappeUIError` is now exported from `frappe-ui/experimental` as a type. A
  consumer previously hand-declared a structural copy of it because it wasn't
  re-exported — that copy can now be dropped in favor of the real type.

### `tsconfig.base.json` — cleaned up (breaking for extenders)

- **Breaking:** `tsconfig.base.json` no longer sets `types`
  (`vitest/globals`, `unplugin-icons/types/vue`, `node`). If your app extends
  this file and relies on any of these globals, add `types` to your own
  `tsconfig.json`. Without it, `tsc` fails with a missing-global error (e.g.
  `Cannot find name 'vi'`) the first time a global that used to come from
  `vitest/globals` or `unplugin-icons/types/vue` is referenced. `noEmit`
  stays — it's needed to keep `allowImportingTsExtensions` legal — but the
  `declaration` / `emitDeclarationOnly` pair (contradictory alongside
  `noEmit`, and unused by frappe-ui's own build) is gone.

### `./hljs-theme.css` export removed

- **Breaking:** `frappe-ui/hljs-theme.css` is no longer exported. It had zero
  importers. The underlying file
  (`experimental/TextEditor/hljs-github.css`) ships until the deprecated
  `TextEditor` is removed.

### pageMetaPlugin — removed

- **Silent break:** `pageMetaPlugin` and the global mixin it installed are gone.
  A leftover `pageMeta()` component option still compiles but is never read, so
  `document.title` and the favicon quietly stop updating. See the
  [migration guide](/docs/migration#pagemetaplugin-removed).
- `usePageMeta` is unchanged and now exports its `PageMeta` type.

### GridLayout — removed (breaking)

- **Breaking:** `GridLayout` is no longer exported. It was a thin passthrough
  to `grid-layout-plus` with no docs page and no tests. The import fails, so
  the build names every call site. Depend on `grid-layout-plus` directly.
- `grid-layout-plus` is dropped from `dependencies` — it had no other
  importer left in `src/`.
- Two bugs in the deleted component, so consumers wiring up
  `grid-layout-plus` themselves should expect different behavior:
  - `cols` and `rowHeight` were read once at setup inside a `reactive()`
    options object, not `computed`, so changing either prop after mount did
    nothing.
  - the drag placeholder color was a hardcoded `#b1b1b1`, not a theme token,
    so it ignored dark mode.

### App shell family — brought to bar

`DesktopShell`, `MobileShell`, `MobileNav`, `Rail`, `PageHeader`,
`ScrollArea`, and `FrappeUIProvider` all keep their current exports and
names.

- Every slot across the family now has a documented description, and each
  component has a docs page, a story, and cypress tests (several had none).
- **Breaking, silent:** `PageHeaderMobile`'s `#left`/`#right` slots and
  `PageHeaderMobileTitle`'s `#icon` slot are renamed to the shared
  `#prefix`/`#suffix` vocabulary (PHILOSOPHY.md P6 forbids type-specific
  slots like `#icon` outside `Button`, and `#left`/`#right` were never in
  the vocabulary). Vue drops content passed to an unknown slot name with no
  error, so the old names don't warn — they just stop rendering. See the
  [migration guide](/docs/migration#pageheadermobile-family-slot-names).
- `ScrollArea` gets a `types.ts` (`ScrollAreaProps`, `ScrollBarProps`,
  `ScrollAreaExposed`) and `data-slot="scroll-area"` /
  `"scroll-area-viewport"` / `"scroll-area-scrollbar"` / `"scroll-area-thumb"`
  styling hooks — it had none. `viewportElement` on the template ref is now
  typed via `ScrollAreaExposed`. (`SettingsDialog`'s `SettingsBody` exposes
  the same shape today but isn't wired to this type yet — that's tracked
  under SettingsDialog's own sweep.)
- `FrappeUIProvider`'s source directory moved from `src/components/Provider`
  to `src/components/FrappeUIProvider` to match its file name. Purely
  internal — `import { FrappeUIProvider } from 'frappe-ui'` is unaffected.
- **Breaking:** `FrappeUIProviderProps` is no longer exported. The component
  has no props, so the type was empty and never wired to `defineProps` —
  freezing it now would lock in nothing. Zero known consumers.
  The mismatched directory name had made the whole component invisible to
  the docs generator, so it previously had no docs page.

### `frappe` and `drive` subpaths — removed (breaking)

- **Breaking:** `frappe-ui/frappe` is removed and the `frappe/` directory is
  deleted (rule 6: frappe-ui is a dumb library; decided in #867, moved in
  frappe/frappe#41671). `useTelemetry`, `telemetryPlugin`, `useOnboarding`,
  `GettingStartedBanner`, `IntermediateStepModal`, `HelpModal`,
  `showHelpModal`, `minimize`, `TrialBanner`, `SignupBanner`, `DataImport`,
  `Link`, `Filter` and `LinkProps` now live in `@framework/ui`. The `Link` and `Filter` there
  are supersets (`Link`: `redirectable`/`editable` props, `redirect`/`edit`
  emits; `Filter`: `useFilters`, `parseFilters`/`serializeFilters`, operator
  registry).
- **Breaking:** `OnboardingSteps`, `HelpCenter` and `showHelpCenter` are
  removed with no standalone replacement — zero call sites across all
  consumer apps (they still power `HelpModal` inside `@framework/ui`).
- **Breaking:** `frappe-ui/drive` and `frappe-ui/drive/*` are removed with
  no replacement. No app imported them — the drive app owns the live copy
  of all six components.
- The `content` export from `frappe-ui/tailwind` and the docs no longer
  list a `frappe/**` glob; apps hand-maintaining
  `node_modules/frappe-ui/frappe/**` in `tailwind.config.js` should drop
  the line.

## Deprecation log

| API                                | Replacement                          | Notes                                  |
| ---------------------------------- | ------------------------------------ | -------------------------------------- |
| `Divider.action.handler`           | `Divider.action.onClick`             | **Removed** — silent; key dropped, click does nothing |
| `Password.value` prop              | `v-model` / `modelValue`             | **Removed in 1.0.0** (ADR-0008)        |
| `Rating.rating_from` prop          | `max`                                | **Removed** — silent; prop ignored     |
| `Rating.readonly` prop             | `disabled`                           | **Removed** — silent; prop ignored     |
| `Switch.change` emit               | `update:modelValue` / `v-model`      | **Removed** — silent; listener never fires |
| `Switch.labelClasses` prop         | `data-*` styling hooks               | **Removed** — silent; prop ignored     |
| `Checkbox.padding` prop            | `padded` / `data-*` styling hooks    | **Removed** — silent; prop ignored     |
| `Dropdown` `{ group, items }`      | `{ group, options }`                 | **Removed** — silent; renders empty, dev-only warning |
| `Dropdown.placement` prop          | `align`                              | **Removed** — silent; falls back to `align="start"` |
| `Dropdown`/`ContextMenu` `component:` rows | `slots: { item: fn }`        | **Removed** — silent; renders label-only row, dev-only warning |
| `DropdownExposed` type             | `v-model:open` / `close` slot prop   | **Removed** — loud; described an expose that never existed |
| Select `#item-*` slot prop `option` | `item`                              | **Removed** — silent; `{ option }` destructures to `undefined` |
| `Input.vue`                        | `TextInput`                          | **Removed in 1.0.0** (ADR-0008)        |
| `Autocomplete`                     | `Combobox` or `MultiSelect`          | **Removed** — import fails             |
| `GridLayout`                       | depend on `grid-layout-plus` directly | **Removed** — loud; import fails      |
| `FormControl type='autocomplete'`  | `type="combobox"`, or `Combobox` standalone | **Removed** — silent; dev-only `console.error` |
| DatePicker family `placement`      | `side` + `align` + `offset`          | **Removed** — silent; inert extra attribute |
| DatePicker family `autoClose`      | `keepOpen` (inverse)                 | **Removed** — silent; inert extra attribute |
| DatePicker family `allowCustom`    | `typeable: false`                    | **Removed** — silent; inert extra attribute |
| DatePicker family `readonly`       | `typeable: false`                    | **Removed** — silent; inert extra attribute |
| DatePicker family `inputClass`     | `class` on the component element     | **Removed** — silent; inert extra attribute |
| DatePicker family `value` prop     | `v-model` / `modelValue`             | **Removed** — silent; inert extra attribute |
| DatePicker family `#target` slot   | `#trigger`                           | **Removed** — silent; slot content stops rendering |
| `TimePicker.scrollMode`            | none (always centered)               | **Removed** — silent; inert extra attribute |
| `DateTimePicker.minDateTime`       | `min`                                | **Removed** — silent; constraint no longer enforced |
| `DateTimePicker.maxDateTime`       | `max`                                | **Removed** — silent; constraint no longer enforced |
| `TimePicker.minTime`               | `min`                                | **Removed** — silent; constraint no longer enforced |
| `TimePicker.maxTime`               | `max`                                | **Removed** — silent; constraint no longer enforced |
| `TimePicker.selectAll()` / `.blurInput()` | none — dead, no callers       | **Removed** — loud; template-ref member gone |
| `useDatePicker` composable         | use picker components directly       | **Removed** — loud; import fails       |
| `getDate` / `getDatesAfter` / etc. | use picker components directly       | **Removed** — loud; import fails       |
| `MonthPicker`                      | `Select`                             | **Removed** — loud; import fails       |
| `FeatherIcon`                      | `lucide-*` strings (or a `Component`) | **Removed** — import fails; feather-name props render nothing, dev-warns once |
| `Card`                             | layout markup                        | **Removed in 1.0.0** (ADR-0008), import fails |
| `ListItem`                         | layout markup                        | **Removed in 1.0.0** (ADR-0008), import fails |
| `Toast` (SFC)                      | imperative `toast(...)` API          | **Removed in 1.0.0** (ADR-0008), import fails |
| Dialog legacy `options` blob       | flat top-level props                 | **Removed** — silent; inert attr       |
| Dialog `disableOutsideClickToClose` | `dismissible` (inverted)            | **Removed** — silent; inert attr       |
| Dialog `#body*` slots               | `#default` / `#title` / `#actions`  | **Removed** — silent; renders nothing  |
| Dialog `icon.appearance`           | `icon.theme`                         | **Removed** — silent; icon loses tone  |
| Dialog action `onClick` callable context | `{ close }` object             | **Removed** — throws on call           |
| Dialog template-ref `close()`      | `v-model:open` / `close` slot prop   | **Removed** — throws on call           |
| `ConfirmDialog` component          | `dialog.confirm()` / `dialog.danger()` | **Removed** — import fails           |
| `confirmDialog()`                  | `dialog.confirm()`                   | **Removed** — import fails             |
| `FileUploader.uploadArgs`          | flat props (`private`, `folder`, `doctype`, `docname`, `fieldname`, `uploadEndpoint`, `optimize`) | **Removed** — silent; inert attr |
| `FileUploader` template-ref `inputRef` | `openFileSelector` slot prop      | **Removed** — throws on call           |
| `FileUploader` slot prop `error`   | always `string \| null`, was `unknown` | **Changed** — silent; `.message` access renders nothing |
| `useFileUpload` / `FileUploadHandler` unset privacy | explicit `private` / `is_private` | **Default changed** — silent; now resolves to private |
| `fileToBase64`, `formatBytes`, `getMaxFileSize`, `fileSizeLimitMessage` | none (internal only) | **Removed** — import fails |
| `frappe-ui/charts` `ColorScheme` type | root `ResolvedColorScheme` (re-exported from `frappe-ui/charts`) | **Removed** — loud; type import fails |
| `Badge theme="orange"`             | `theme="amber"`                      | **Removed in 1.0.0** (ADR-0008) — loud in TS (compile error); silent in JS (renders gray, dev-only warning) |
