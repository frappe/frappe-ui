# Dropdown Spec

This document defines the public API for `Dropdown`, the menu component. It
stands alone: the rules it shares with the selection pickers (positioning,
motion, row customization, styling hooks, `lucide-*` icons) are stated here in
full rather than by reference.

`Dropdown` composes [`ItemListRow`](./item-list-row.md) for row presentation
and owns its own menu shell. For picking a value rather than running an action,
see [`selection.md`](./selection.md).

## Role

`Dropdown` is the action menu component.

It should continue to support:

- simple action lists
- grouped actions
- submenus
- switch/toggle rows
- route-based actions
- occasional advanced custom rows
- menu-style "choose one of a few actions" cases where the app marks the current
  choice

Important boundary:

- if the UI is semantically choosing a form value or picker value, use `Select`
- if the UI is a menu of actions or view/filter/sort modes and one is currently
  active, `Dropdown` is still acceptable

So `Dropdown` can support checkmarks and active menu items, but it should not
become the generic replacement for `Select`.

## Exact public API for v1

### Props

```ts
type DropdownSide = 'top' | 'right' | 'bottom' | 'left'
type DropdownAlign = 'start' | 'center' | 'end'

interface DropdownProps {
  button?: ButtonProps
  options?: DropdownOptions
  open?: boolean
  side?: DropdownSide
  align?: DropdownAlign
  offset?: number
  matchTriggerWidth?: boolean
  portalTo?: string | HTMLElement
}
```

Defaults:

- `options = []`
- `open = false`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `matchTriggerWidth = false`
- `portalTo = 'body'` — the fallback when neither the prop nor an embedding
  host names a target. See [`portal-target.md`](./portal-target.md).

`side` picks which side of the trigger the menu opens on, `align` how it lines
up along that side, `offset` the gap in px, and `portalTo` where the content is
teleported. `start` and `end` are direction-aware and flip under `dir="rtl"`.
These are the same four props and the same defaults the selection pickers use.
`matchTriggerWidth` sizes the menu to the trigger element, for menus acting as
a select-like control under a wide custom trigger. Note the deliberate
difference from Popover's prop of the same name: Dropdown sets an exact
`width` (a menu should match its trigger precisely), while Popover sets
`minWidth` (a panel may need to grow beyond it).

There is no `placement` prop. It was removed before `1.0.0` per
[ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md); `align` covers it
(`left`→`start`, `center`→`center`, `right`→`end`).

There is no `emptyText` prop. The empty state renders fixed copy
(`"No options"`); `#empty` replaces it entirely. An action menu is rarely
empty by data — usually every row was `condition()`-ed away — so a copy prop
was never earned.

State conventions:

- visibility is controlled with `v-model:open`
- `Dropdown` does **not** expose `v-model` for a selected value
- `Dropdown` does **not** own query state

`button` is only used when no custom trigger slot is provided.

### Emits

```ts
interface DropdownEmits {
  'update:open': [value: boolean]
}
```

There is no component-level `select` event in v1. Action handling stays
item-owned through `route` and `onClick`.

### Slots

Guaranteed slot props:

```ts
type DropdownTriggerSlotProps = {
  open: boolean
  setOpen: (value: boolean) => void
  close: () => void
  disabled: boolean
  // the dropdown's fallthrough attributes are spread in too
  [key: string]: any
}

type DropdownItemSlotProps = {
  item: DropdownOption
  close: () => void
  selected: boolean
}

type DropdownGroupSlotProps = {
  group: DropdownGroupOption
}
```

`open` is the current state, not a method. `setOpen(value)` writes it and
`close()` is shorthand for `setOpen(false)`. A disabled trigger ignores
`setOpen(true)`.

These names are the source of truth in `src/components/Dropdown/types.ts`,
which re-exports the shared shapes from `src/components/Menu/types.ts`. Read
them there rather than trusting a copy.

Supported slots:

- `#trigger="{ open, setOpen, close, disabled }"`
  - preferred advanced trigger slot
- default slot
  - supported trigger slot with the same contract as `#trigger`
  - especially ergonomic when trigger customization is the only customization
    needed
- `#item-prefix="{ item, close, selected }"`
  - custom leading content for all item rows, including submenu and switch rows
- `#item-label="{ item, close, selected }"`
  - custom label/content region for all item rows
- `#item-suffix="{ item, close, selected }"`
  - custom trailing content for all item rows
- `#item="{ item, close, selected }"`
  - full-row escape hatch for leaf action rows only
- `#item-<slot>="{ item, close, selected }"`
  - dynamic named label slot selected via `item.slot`
- `#group-label="{ group }"`
  - optional custom group label rendering
- `#empty`
  - empty state for any menu level with no visible items

Exact slot rules:

- `#trigger` wins over the default slot
- the default slot wins over the generated `button` trigger
- `close()` closes the whole dropdown, not just the current submenu
- `selected` is always `Boolean(item.selected)`
- `#item-<slot>` overrides the label region only; it does not replace the full
  row shell
- `#item` is an escape hatch for leaf action rows only
- submenu and switch rows keep their shell-owned structure even when `#item`
  exists
- `#item-prefix`, `#item-label`, and `#item-suffix` apply at every menu depth
- a custom suffix **replaces** the built-in control. On a submenu row it
  replaces the chevron; on a switch row it replaces the switch. The suffix
  region has one occupant, and the app's content is it
- a suffix that renders nothing (`null`, `undefined`, a comment, whitespace)
  counts as absent, so the built-in control comes back

## Exact option shape for v1

```ts
type DropdownTheme = 'gray' | 'red'

type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

interface DropdownBaseOption {
  icon?: string | Component | null
  description?: string
  selected?: boolean
  disabled?: boolean
  theme?: DropdownTheme
  slot?: string
  slots?: ItemSlots<DropdownItemSlotProps>
  condition?: () => boolean
  [key: string]: any
}

interface DropdownActionOption extends DropdownBaseOption {
  label: string
  route?: RouteDestination
  onClick?: (event: Event) => void
  submenu?: never
  switch?: never
  switchValue?: never
  component?: never
}

interface DropdownSwitchOption extends DropdownBaseOption {
  label: string
  switch: true
  switchValue?: boolean
  onClick?: (value: boolean) => void
  route?: never
  submenu?: never
  component?: never
}

interface DropdownSubmenuOption extends DropdownBaseOption {
  label: string
  submenu: DropdownOptions
  route?: never
  onClick?: never
  switch?: never
  switchValue?: never
  component?: never
}

interface DropdownGroupOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  theme?: DropdownTheme
  options: DropdownOption[]
}

type DropdownOption =
  | DropdownActionOption
  | DropdownSwitchOption
  | DropdownSubmenuOption

type DropdownOptions = Array<DropdownOption | DropdownGroupOption>
```

These are aliases. `src/components/Dropdown/types.ts` re-exports the shared
`Menu/types.ts` shapes under `Dropdown*` names, so `ContextMenu` and `Dropdown`
cannot drift apart. `RouteDestination` (a path string or a route object) comes
from `src/components/shared/route.ts`.

`onClick` takes a plain `Event`, not a `PointerEvent`. The menu primitive
emits its own `CustomEvent` when a row is selected, by pointer or by keyboard,
and that is what the handler receives.

The group entry is `{ group, options }`, matching `Combobox`, `MultiSelect`,
and `Select`. Dropdown's previous `{ group, items }` shape and the `component:`
escape-hatch row were removed before `1.0.0` per
[ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md); each keeps a `never`
marker in the types so passing the old key is a type error rather than a
silently ignored extra field, and a DEV-only console warning fires when either
arrives at runtime.

Notes:

- `label` is required for every standard action, switch, and submenu row
- `submenu` and `switch` are mutually exclusive item modes
- app-defined extra fields like `value`, `id`, `image`, `shortcut`, and
  analytics metadata are allowed and must be passed through unchanged to slot
  props
- `slot` is the preferred name for dynamic label slot selection
- keep `onClick` and `condition` as canonical names

`icon` takes a Vue component or a string, the same as in the selection
pickers. Three forms are supported:

- a Vue component
- a `lucide-*` string (`icon: 'lucide-pen'`), rendered as that Lucide icon and
  sized and colored by the component — `text-ink-red-5` on a `theme: 'red'`
  row, `text-ink-gray-6` otherwise. Write the class out in full; a name built
  at runtime is invisible to Tailwind's scanner and renders nothing
- an emoji or symbol glyph (`icon: '🚀'`), rendered as plain text

Any other string — a bare Feather name such as `'pen'` — renders nothing and
warns once per component and prop in dev. The `FeatherIcon` fallback was
removed before `1.0.0` under
[ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md). See
`src/utils/iconString.ts` for the classifier and the warning.

## Rendering and behavior rules

### Grouping and visibility

- `options` may mix plain items and explicit groups
- plain items are rendered as implicit unlabeled groups in source order
- each menu level should normalize its `DropdownOptions` input into an explicit
  grouped structure before row rendering
- the normalization shape is internal to `Dropdown`; only the
  `{ group, options }` external API contract is part of the public surface
- `condition()` is evaluated before rendering at every menu depth
- items whose `condition()` returns false are omitted
- groups with zero visible items are omitted
- if a menu or submenu level has no visible items, render `#empty`

### Trigger behavior

- if `#trigger` is provided, use it
- else if the default slot is provided, use it as the compatibility trigger slot
- else render the generated `Button` from `button`
- trigger disabled state is derived from `button.disabled` or a forwarded
  `disabled` attribute
- a mouse press opens the menu on `pointerdown`, not on release, matching
  `Select`. The click that ends that same press is swallowed so it cannot
  toggle the menu shut; a later, separate click still closes it
- touch keeps the release path — opening on press would fight scrolling
- press-drag-release onto an item activates that item

### Item behavior

- `selected` is visual-only state owned by the app
- `Dropdown` does not infer selection and does not emit selection changes
- selected rows receive shell-owned selected styling, but `Dropdown` does
  **not** render a trailing checkmark automatically
- if any visible item in a group has an icon, items without icons in that same
  group should reserve the same prefix space for alignment
- `route` takes precedence over `onClick` on leaf action rows
- leaf action rows close the dropdown on selection through menu semantics
- switch rows do not auto-close on toggle
- submenu rows open nested menu content and do not call `onClick`

### Disabled handling

Disabled rows behave the same way here as in the selection pickers:

- disabled items are skipped by keyboard navigation and typeahead
- disabled leaf actions do not call `onClick` and do not follow `route`
- disabled submenu rows do not open their submenu
- disabled switch rows do not toggle and do not emit
- disabled items apply `ItemListRow` disabled styling and `data-disabled`

### Rendering precedence

For each visible item:

1. if `item.submenu` exists, render a submenu row
2. else if `item.switch === true`, render a switch row
3. else determine the row by combining template slots, `item.slots`, and
   the default shell (see per-region precedence below)

Per-region precedence for standard action rows:

Full row (if any of these provide a full-row renderer, the per-region
renderers below are skipped):

1. `#item` slot
2. `item.slots.item`

Prefix region:

1. `#item-prefix` slot
2. `item.slots.prefix`
3. default: `icon` with group-level alignment placeholder behavior

Label region:

1. `#item-<slot>` slot matching `item.slot`
2. `#item-label` slot
3. `item.slots.label`
4. default: `label` plus optional `description`

Suffix region (a custom suffix **replaces** the built-in control, it is not
added next to it):

1. `#item-suffix` slot, if it renders something
2. `item.slots.suffix`, if it renders something
3. default: the switch control on a switch row, the chevron on a submenu row,
   and nothing on a leaf action row

"Renders something" is `hasRenderableContent` in `src/utils/vnode.ts`: `null`,
`undefined`, `false`, a comment, and whitespace-only text all count as nothing,
so a conditional suffix that returns `null` falls through to the next step.

A custom suffix owns the whole suffix region. If a switch row needs a custom
suffix *and* a switch, the slot has to render the `Switch` itself, wired to
`item.switchValue` and `item.onClick`. This is the accepted contract, confirmed
2026-09-17; the earlier append wording in this spec was never implemented.

Notes:

- replacement is scoped to the suffix region. The row shell, the prefix, and
  the label are untouched, and the row keeps its menu semantics
- submenu and switch rows keep their shell-owned **row structure** even when a
  full-row renderer is provided elsewhere — the full-row escape hatch applies
  to leaf action rows only, matching the existing `#item` rule

## Styling hooks

Stable hooks for `Dropdown` should include:

- `data-slot="content"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="empty"`

Standard rows inside `Dropdown` should use `ItemListRow`, which provides:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`

State hooks should include, where relevant:

- `data-state="open|closed"` on menu content via the menu primitive
- `data-disabled`
- row-level selected/active styling hooks inherited from `ItemListRow`

## Motion

`Dropdown` uses the same motion as `Select`: the menu appears instantly, with
only a short fade to smooth the paint.

- open: `80ms` linear fade from `opacity: 0`. No scale, no translate
- close: no animation
- the rhythm is the same for pointer and keyboard opens; the menu content
  always carries `data-motion="instant"`
- `prefers-reduced-motion: reduce` disables the content animation

## Accessibility and semantics

`Dropdown` should follow the menu button pattern, not the listbox/select
pattern.

That means:

- trigger uses menu-trigger semantics
- leaf actions are menu actions, not form options
- submenu items expose submenu semantics
- keyboard navigation, escape handling, typeahead, and submenu arrow-key
  behavior are delegated to the underlying menu primitive
- `selected` is visual state only; it does not change the component into a
  single-select control

## Removed before `1.0.0`

Removed under [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md) in the
selection-and-menus sweep
([#871](https://github.com/frappe/frappe-ui/issues/871)); before/afters live in
[`migration.md`](../docs/content/docs/migration.md):

- `placement` prop and the `DropdownPlacement` type — `align` replaces it
- `{ group, items }` group entries — `{ group, options }` replaces them
- `component:` option rows and the `DropdownComponentOption` type —
  `slots: { item: fn }` replaces them
- the `FeatherIcon` fallback for bare icon-name strings — a `lucide-*` string,
  an emoji glyph, or a component; anything else warns and renders nothing
- `DropdownExposed` — described a template-ref surface that never existed;
  per [ADR-0012](./adr/0012-template-ref-surface.md), `Dropdown` exposes
  nothing (`v-model:open` and the `close` slot prop cover it)

## Row customization in JS

For rows authored in JavaScript where no template is in reach, per-region
`slots` functions are preferred when the shell still makes sense:

```ts
import { h } from 'vue'
import Avatar from '@/components/Avatar.vue'

const options = users.map((user) => ({
  label: user.name,
  selected: user.id === activeId,
  onClick: () => switchTo(user.id),
  slots: {
    prefix: ({ item }) =>
      h(Avatar, { image: item.image, class: 'size-4' }),
    suffix: ({ selected }) =>
      selected ? h('span', { class: 'lucide-check size-4' }) : null,
  },
}))
```

The `null` branch matters: on a submenu or switch row, a suffix that renders
something takes the region over, and the chevron or the switch is not drawn.
Returning `null` hands the region back.

`slots.item` takes over the whole row instead — reserve it for deeply custom
rows, destructive full-width special rows, and similar exceptional content:

```ts
{
  label: 'Delete',
  slots: {
    item: () =>
      h(Button, { variant: 'solid', theme: 'red' }, () => 'Delete'),
  },
}
```

## Changelog

### 2026-09-17

Spec corrections only. No runtime behavior changed.

- **A custom suffix replaces the built-in control; it is not appended.** The
  spec promised the opposite in two places. The maintainer confirmed
  replacement on 2026-09-17, and `MenuItemContent.vue` has implemented it all
  along. Covered by a regression test in `Dropdown.cy.ts`.
- **`onClick` takes an `Event`.** It was written as `PointerEvent`, but the
  menu primitive hands the handler a `CustomEvent`.
- **The `FeatherIcon` string fallback is gone.** It was removed before
  `1.0.0`; an unsupported icon string warns and renders nothing. Emoji glyphs
  are supported and were undocumented.
- **The trigger slot gets `setOpen`.** The slot-props type block omitted it,
  even though the supported-slots list already named it.

### 2026-08-08

- **ADR-0008 removals.** `placement`, `{ group, items }`, `component:` rows,
  and the phantom `DropdownExposed` type are gone (see
  [Removed before `1.0.0`](#removed-before-100)). The spec previously
  mandated keeping the first three as deprecated aliases through `v1.x`;
  ADR-0008 postdates that promise and wins.
- **`matchTriggerWidth` documented.** The prop shipped in the betas but the
  spec predated it.
- **`emptyText` dropped from the spec.** It was never implemented; the empty
  state is fixed copy plus the `#empty` slot, and an action menu that is
  empty by data rather than by `condition()` is rare enough that a copy prop
  never earned its place.
- **The trigger forwards `disabled` to the menu primitive.** Previously only
  the generated `Button` was natively disabled; a custom trigger slot with a
  `disabled` attribute could still be opened by keyboard or synthetic clicks.

### 2026-04-24

- **`item.icon` accepts `lucide-*` strings.** Pass `icon: 'lucide-pen'`
  directly in an item definition — no component import needed. Strings
  starting with `lucide-` are rendered as a `<span>` styled via the Tailwind
  CSS-mask plugin. Other strings still route to FeatherIcon (back-compat).
  Component values continue to work unchanged. *(Historical: the FeatherIcon
  fallback was removed before `1.0.0`.)*

- **Group labels toned to `text-ink-gray-4`.** Separator group headings are
  now visually quieter so they recede behind the action items.
