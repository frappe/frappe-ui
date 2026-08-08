# Frappe UI v1 Changelog

User-facing v1 changes. **Unreleased** entries describe changes since
**v0.1.278**. Log only breaking changes, deprecations, observable behavior
changes, and migration guidance — not internal refactors or test additions.

All deprecations preserve backwards compatibility through v1.x and emit a
one-time dev-mode warning (unless noted). Removal is post-v1.

## Unreleased

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

### Dialog — v1 spec

- Flat top-level props (`title`, `message`, `icon`, `size`, `position`,
  `paddingTop`, `actions`) are canonical; legacy `options` blob warns.
- `v-model:open` is canonical; `v-model` (modelValue) still works silently.
- New props: `dismissible` (default `true`, replaces
  `disableOutsideClickToClose`), `bare`, `showCloseButton` (default `true`,
  independent of the auto-header).
- Canonical slots `#default`, `#title`, `#actions` (scoped with
  `{ close, actions }`). Legacy `#body*` slots warn.
- `icon.theme` (`yellow | blue | red | green`) replaces `icon.appearance`;
  legacy value auto-mapped.
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
- Legacy `confirmDialog()` warns; use `dialog.confirm()`.

### DatePicker family — v1 spec

`DatePicker`, `DateRangePicker`, and `DateTimePicker` share the v1
popover-trigger vocabulary used by `Combobox` / `Dropdown` / `Select`.

- `side` (default `'bottom'`) + `align` (default `'start'`) + `offset`
  (default `4`) replace `placement` (deprecated alias).
- `keepOpen` (default `false`) replaces `autoClose` (deprecated, inverse).
- `typeable` (default `true`) replaces picker-level `readonly` and
  `allowCustom` (both deprecated). `:typeable="false"` blocks typing while
  keeping the popover interactive.
- Constraints: `min?: string` and `max?: string` (`YYYY-MM-DD`, plus
  `YYYY-MM-DD HH:mm:ss` on `DateTimePicker`), and
  `isDateUnavailable?: (date: Dayjs) => boolean` for arbitrary disabling.
  Min/max and the predicate compose. On `DateTimePicker`,
  `minDateTime`/`maxDateTime` are deprecated aliases.
- `v-model:open` supported on all three pickers via `open` + `update:open`.
- `openOnFocus` (default `false`) and `openOnClick` (default `true`) let
  consumers opt out of either trigger path. Same defaults applied to
  `Combobox` for parity.
- `#trigger` is the canonical custom-trigger slot; `#target` is a
  deprecated alias.
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

- `side` / `align` / `offset` replace `placement`.
- `keepOpen` (default `false`) replaces `autoClose`.
- `typeable` (default `true`) replaces picker-level `readonly` / `allowCustom`.
- `v-model:open` via `open` + `update:open`; new `openOnFocus` (default
  `false`) and `openOnClick` (default `true`) props.
- Flexible typed input: `"3pm"`, `"3.30pm"`, `"1500"`, `"9:30:15 am"`
  parse to canonical `HH:mm[:ss]`.
- `min` / `max` replace `minTime` / `maxTime` (deprecated aliases).
- `scrollMode` is deprecated; list is always centered on the selection.

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

### DatePicker family — legacy composable deprecated

`useDatePicker` and its helpers (`getDate`, `getDatesAfter`,
`getDaysInMonth`, `isLeapYear`) are not used by any picker component and
are not part of the v1 API. They remain exported through v1.x and warn.

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
`value` prop is deprecated.

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

### FeatherIcon — deprecated; `lucide-*` recommended

`FeatherIcon` remains exported. Feather-name strings passed to
`Button.icon` / `iconLeft` / `iconRight`, `Dialog.options.icon`, `Dropdown`
item icons, and `TabButtons` icons continue to render via `FeatherIcon`
but now warn.

```vue
<!-- preferred -->
<Button icon="lucide-plus" />
<span class="lucide-search size-4" aria-hidden="true" />

<!-- still works, warns -->
<Button icon="plus" />
```

Hardcoded internal `FeatherIcon` usages across core components were
migrated to `lucide-*` in this release. No consumer-visible behavior change.

### Legacy components — dev-mode warnings

`Input.vue` warns once on mount. Migrate to `TextInput`.

`MonthPicker` is deprecated. For simple month picking, use `Select` with month
options.

`Pill` is no longer exported from the package entrypoint. It remains an
internal `TabButtons` detail.

`ThemeSwitcher` remains exported for v1 compatibility, but is deprecated. For
new theme switchers, compose `Select` with the `useColorScheme` composable.

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
[migration guide](../docs/content/docs/migration.md#autocomplete-removed).

### Dropdown / ContextMenu — deprecated members removed (ADR-0008)

Three surfaces that shipped as deprecated aliases in the betas are deleted,
not aliased. All three are **silent breaks** in plain-JS apps — before/afters
in the
[migration guide](../docs/content/docs/migration.md#dropdown-and-contextmenu);
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
[ADR-0008](../spec/adr/0008-no-deprecated-members-in-1-0-0.md). Nothing is
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
[migration guide](../docs/content/docs/migration.md#popover-hovercard-tooltip).

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
[migration guide](../docs/content/docs/migration.md#tooltip).

### HoverCard — `open()` and `close()` on the template ref

- Added: `open()` and `close()` on the component instance, matching `Popover`.
- The trigger slot's props are now typed (`HoverCardSlotProps`) instead of
  `any`.

### BottomSheet — focus stays inside an open sheet

The sheet opts out of autofocusing its first field, so it does not pop the
keyboard on a phone. That also left focus on the trigger behind the overlay,
with nothing holding it — `Tab` walked the page behind an open modal. The sheet
now takes focus itself on open. The keyboard still stays down.

### Divider — `action.onClick` preferred

`action.handler` is deprecated. Warning emits via the shared
`warnDeprecated` utility. Action mode preserves separator semantics for
assistive technologies.

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

## Deprecation log

| API                                | Replacement                          | Notes                                  |
| ---------------------------------- | ------------------------------------ | -------------------------------------- |
| `Divider.action.handler`           | `Divider.action.onClick`             | Warns when set                         |
| `Password.value` prop              | `v-model` / `modelValue`             | Warns when set                         |
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
| `Input.vue`                        | `TextInput`                          | Warns on mount                         |
| `Autocomplete`                     | `Combobox` or `MultiSelect`          | **Removed** — import fails             |
| `FormControl type='autocomplete'`  | `type="combobox"`, or `Combobox` standalone | **Removed** — silent; dev-only `console.error` |
| DatePicker family `placement`      | `side` + `align` + `offset`          | Mapped internally; warns               |
| DatePicker family `autoClose`      | `keepOpen` (inverse)                 | Mapped internally; warns               |
| DatePicker family `allowCustom`    | `typeable: false`                    | Mapped internally; warns               |
| DatePicker family `readonly`       | `typeable: false`                    | Picker-level only; warns               |
| DatePicker family `inputClass`     | `class` on the component element     | Warns when set                         |
| DatePicker family `value` prop     | `v-model` / `modelValue`             | Warns when set                         |
| DatePicker family `change` emit    | `update:modelValue` / `v-model`      | Warns when bound                       |
| DatePicker family `#target` slot   | `#trigger`                           | Silent alias; warns                    |
| `TimePicker.scrollMode`            | none (always centered)               | Warns when set                         |
| `DateTimePicker.minDateTime`       | `min`                                | Mapped internally; warns               |
| `DateTimePicker.maxDateTime`       | `max`                                | Mapped internally; warns               |
| `TimePicker.minTime`               | `min`                                | Mapped internally; warns               |
| `TimePicker.maxTime`               | `max`                                | Mapped internally; warns               |
| `useDatePicker` composable         | use picker components directly       | Warns on call                          |
| `getDate` / `getDatesAfter` / etc. | use picker components directly       | JSDoc only; no runtime warning         |
| `FeatherIcon`                      | `lucide-*` strings (or a `Component`) | Warns when feather names pass through |
| Dialog legacy `options` blob       | flat top-level props                 | Warns once per instance                |
| Dialog `#body*` slots              | `#default` / `#title` / `#actions`   | Warns when used                        |
| Dialog `icon.appearance`           | `icon.theme`                         | Auto-mapped; warns                     |
| `confirmDialog()`                  | `dialog.confirm()`                   | Warns on call                          |
