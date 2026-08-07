# Frappe UI v1 Changelog

User-facing v1 changes. **Unreleased** entries describe changes since
**v0.1.278**. Log only breaking changes, deprecations, observable behavior
changes, and migration guidance — not internal refactors or test additions.

All deprecations preserve backwards compatibility through v1.x and emit a
one-time dev-mode warning (unless noted). Removal is post-v1.

## Unreleased

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

Default `5`. Old name still works as a deprecated alias. `Rating` no
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
and the `change` emit are deprecated. Row hover/active background removed.

### Checkbox — `padding` deprecated

In favor of `data-*` styling hooks.

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
new theme switchers, compose `Select` with the `useTheme` composable.

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

### Dropdown — group field standardized on `options`

Matches `Combobox`, `MultiSelect`, `Select`. Old `{ group, items }` shape
is a deprecated alias; warns if both are provided on the same entry.

```ts
// before
{ group: 'Edit', items: [{ label: 'Rename', onClick: rename }] }
// after
{ group: 'Edit', options: [{ label: 'Rename', onClick: rename }] }
```

### Select — `#item-*` slot prop renamed to `item`

`#item-prefix`, `#item-label`, and `#item-suffix` on `Select` now expose
`item` as the canonical scoped binding, matching `Combobox` and
`MultiSelect`. The previous `option` key is retained as a silent alias
through v1.x; no runtime warning fires (slot-prop destructuring isn't
detectable at runtime). The `@deprecated` tag lives on the TS interface
so editors hint at the rename. The legacy `#option` slot still passes
`{ option }` unchanged.

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

## Deprecation log

| API                                | Replacement                          | Notes                                  |
| ---------------------------------- | ------------------------------------ | -------------------------------------- |
| `Divider.action.handler`           | `Divider.action.onClick`             | Warns when set                         |
| `Password.value` prop              | `v-model` / `modelValue`             | Warns when set                         |
| `Rating.rating_from` prop          | `max`                                | Silent alias; warns when set           |
| `Switch.change` emit               | `update:modelValue` / `v-model`      | Warns when bound                       |
| `Switch.labelClasses` prop         | `data-*` styling hooks               | Warns when set                         |
| `Checkbox.padding` prop            | `data-*` styling hooks               | Warns when set                         |
| `Dropdown` `{ group, items }`      | `{ group, options }`                 | Silent alias; warns if both            |
| Select `#item-*` slot prop `option` | `item`                              | Silent alias; JSDoc only, no runtime warning |
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
