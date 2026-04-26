# Selection and Menu API RFC

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the intended public API direction for:

- `ItemList`
- `ItemListRow`
- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`

It is based on:

- the v1 component philosophy
- the real-world usage audit in
  [`research/07-real-world-component-usage-audit.md`](./research/07-real-world-component-usage-audit.md)
- the decision to prefer higher-level components with props and slots over
  publicly exposing compound primitive families

This RFC is meant to guide v1 implementation and cleanup. It does not authorize
breaking removals in `1.0.0`.

The shared design rules, goals, non-goals, component boundaries, deprecation
policy, and implementation order live in this document. The detailed
per-component specs live in sibling sub-spec files:

- [`08a-itemlist-spec.md`](./08a-itemlist-spec.md) — `ItemList` and
  `ItemListRow`
- [`08b-dropdown-spec.md`](./08b-dropdown-spec.md) — `Dropdown`
- [`08c-select-spec.md`](./08c-select-spec.md) — `Select`
- [`08d-combobox-spec.md`](./08d-combobox-spec.md) — `Combobox`
- [`08e-multiselect-spec.md`](./08e-multiselect-spec.md) — `MultiSelect`

Each sub-spec inherits the shared design rules defined here and only restates
rules where it narrows or specializes them for that component.

## Decision summary

- add `ItemList` as the shared styled list surface for option and menu rows
- add `ItemListRow` as the shared row shell for item rendering
- keep `Dropdown`, `Select`, `Combobox`, and `MultiSelect` as separate
  higher-level components with clear boundaries
- treat `Dropdown` as an action menu, not as the generic value picker
- standardize on shell-owned item customization
- standardize slot vocabulary around `#trigger`, `#item-prefix`, `#item-label`,
  `#item-suffix`, `#empty`, and `#footer`
- support `v-model:open` across the family
- keep query internal for now, but standardize on `@update:query`
- keep older APIs working in v1.x, but move weaker customization patterns out of
  the happy path
- keep `onClick` and `condition` as canonical naming where they already match
  library convention

## Goals

- keep these components separate and narrowly scoped
- make app usage easier and more consistent
- avoid breaking existing apps during `1.x`
- aggressively deprecate awkward customization APIs when a better replacement
  exists
- standardize slot vocabulary, state vocabulary, and styling hooks
- keep the component shell responsible for spacing, hover, selected, disabled,
  and layout states
- reuse one styled list foundation across selection and menu components instead
  of duplicating row markup and classes

## Non-goals

- collapsing all pickers into a single do-everything component
- exposing a broad set of low-level primitive families as the primary public API
- removing legacy APIs immediately in v1
- solving every richer people-picker or chip-input use case inside the base
  `MultiSelect`

## Component responsibilities

These boundaries should stay clear.

- `ItemList` = the shared styled list surface for option and menu rows
- `ItemListRow` = the shared row shell for item rendering
- `Dropdown` = action menus
- `Select` = small static choice lists
- `Combobox` = searchable single-choice picker
- `MultiSelect` = searchable multi-choice picker

This means:

- `ItemList` is the reusable base layer, not the default recommendation for
  ordinary app code
- do not grow `Dropdown` into a value picker
- do not treat `Select` as the searchable story
- do not keep `Autocomplete` as the long-term canonical public API once
  `Combobox` and `MultiSelect` are good enough

## Shared design rules

### 1. State conventions

Across this family:

- primary value uses `v-model` / `modelValue`
- visibility uses `v-model:open`
- secondary state gets named models only when really needed

For v1:

- `Dropdown` should support `v-model:open`
- `Select` should support `v-model:open`
- `Combobox` should support `v-model:open`
- `MultiSelect` should support `v-model:open`
- query stays internal for now
- searchable components may emit `update:query`, but should not require
  `v-model:query`

### 2. Trigger customization vocabulary

Use one advanced trigger slot name across this family where a trigger exists:

- `#trigger`

`ItemList` itself does not need a trigger. It is the content/list layer.

Slot props should be component-specific but predictable. At minimum:

- `open`
- `disabled`

Where relevant, also expose:

- `selectedOption`
- `selectedOptions`
- `displayValue`
- `toggleOpen`
- `close`

Compatibility aliases can remain:

- `Dropdown` keeps its current default slot behavior as a supported trigger API
  in `v1.x`
- `Select`, `Combobox`, and `MultiSelect` can keep convenience slots like
  `#prefix` and `#suffix`

`#trigger` should remain the consistent explicit slot name across the family,
but `Dropdown` should also continue to support and document the default slot for
trigger-only customization because it is a common and ergonomic use case.

### 3. Shell-owned item customization

This is the most important API decision.

`ItemList` should be the place where this shell is defined once and reused.

The component should own the item shell, including:

- spacing
- row height
- hover styling
- active styling
- selected styling
- disabled styling
- icon/check/suffix layout regions

Consumers should customize content through shared sub-slots instead of
rebuilding the whole row.

Preferred shared item slots:

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`

Escape hatch:

- `#item`

`#item` should remain supported, but it should be clearly documented as an
escape hatch because it forces the consumer to own the full row shell.

### 4. Styling hooks

Owned shells should expose stable hooks:

- `data-slot="trigger"`
- `data-slot="content"`
- `data-slot="item"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`
- `data-slot="empty"`
- `data-slot="footer"`

And state hooks where relevant:

- `data-state="open|closed"`
- `data-state="active|inactive"`
- `data-state="checked|unchecked"`
- `data-disabled`
- `data-variant`
- `data-size`

These hooks should reduce the need for shell replacement just to change classes.

### 5. Shared item object direction

The option model does not need to become identical across all four components,
but it should converge where practical.

Common fields we should allow where they make sense:

```ts
{
  label: string
  value?: string | number | boolean
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
}
```

Notes:

- `slot` should be the preferred field for alternate item rendering strategies
- `slot` should map to `#item-<slot>`
- old names like `slotName` should be deprecated in favor of `slot`

### 6. Escape hatches stay, but move out of the happy path

These remain supported in v1.x, but should be documented as advanced or
deprecated depending on the component:

- direct `ItemList` usage for advanced cases

- full `#item` takeover
- per-item `component`
- per-item `render`
- old per-item custom slot fields like `slotName`

The better API should be:

- shell-owned rows
- focused sub-slots
- predictable state and styling hooks

### 7. Popover positioning conventions

Every component in this family that opens a popover over a trigger should use
the same positioning vocabulary. Today, `Dropdown` and `Combobox` disagree
(`placement: 'left' | 'center' | 'right'` vs `placement: 'start' | 'center' |
'end'`), and `Select` / `MultiSelect` don't expose positioning props at all.

For v1, the canonical positioning props across `Dropdown`, `Select`,
`Combobox`, and `MultiSelect` are:

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface PopoverPositioningProps {
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
}
```

Shared defaults:

- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`

Rules:

- `side` and `align` are logical and direction-aware; `start` / `end` flip with
  `dir="rtl"`
- components that don't currently expose positioning (`Select`, `MultiSelect`)
  should add `side`, `align`, `offset`, and `portalTo` in v1.x as additive
  props
- components that currently expose positioning under different names keep the
  old names working as compatibility aliases through `v1.x`

Compatibility mapping:

- `Dropdown.placement` (old: `'left' | 'center' | 'right'`) maps to `align`:
  - `'left'` → `align: 'start'`
  - `'center'` → `align: 'center'`
  - `'right'` → `align: 'end'`
- `Dropdown.side` keeps its current meaning; no rename needed
- `Combobox.placement` (old: `'start' | 'center' | 'end'`) maps one-to-one to
  `align` and should be accepted as an alias through `v1.x`

Rules for old names in `v1.x`:

- if both the new and the old name are provided, the new name wins and a dev
  warning is emitted
- if only the old name is provided, it is silently mapped to the new name
- docs should show `side` + `align` in the primary examples; `placement`
  continues to appear only in the deprecation table

### 8. Uniform disabled-option handling

Disabled items should behave the same way across `ItemList`, `Dropdown`,
`Select`, `Combobox`, and `MultiSelect`:

- disabled items are skipped during keyboard navigation (arrow keys, typeahead,
  home/end)
- disabled items cannot be clicked into selection or activated
- disabled items apply the shared `ItemListRow` disabled styling (muted text,
  `not-allowed` cursor) and carry the `data-disabled` attribute
- disabled items never emit `update:modelValue`, `update:selectedOption`, or
  `item-click`
- `Dropdown` route/submenu/switch rows also respect `disabled`: no navigation,
  no submenu open, no toggle
- `MultiSelect` `selectAll` skips disabled options
- `Combobox` never uses a disabled option as the `allowCustomValue` target
- if an option becomes disabled while already selected, it stays in
  `modelValue`; it only stops being interactable

This rule is the default behavior from the underlying primitives, but each
component spec should state it explicitly so apps can rely on it.

### 9. Per-item inline slots

Templates (`#item-prefix`, `#item-label`, `#item-suffix`, `#item-<slot>`,
`#item`) are the primary customization path. They are only usable where the
app has a Vue template around the component.

Some apps build option lists in JavaScript — in a composable, a config
module, a remote API response, or a shared data layer — and therefore
cannot reach a template. Historically this is why `Dropdown` grew
`item.component` and `Combobox` grew `item.render`. Both are coarse: they
replace the entire row and skip the shell-owned prefix/label/suffix
regions.

For v1, every item-accepting component in this family accepts a `slots`
field on an item object. It matches the shape you already pass to Vue
render functions — `h(Component, props, slots)` — so the same mental model
applies at the item level:

```ts
type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

// on any item object:
slots?: ItemSlots<ItemSlotProps>
```

Key names mirror the template slot names one-to-one, with the redundant
`item-` prefix stripped because we're already scoped to an item:

| template slot     | `slots.*` key |
| ----------------- | ------------- |
| `#item-prefix`    | `prefix`      |
| `#item-label`     | `label`       |
| `#item-suffix`    | `suffix`      |
| `#item`           | `item`        |

Rules:

- each key in `slots` is a function with the same slot props as the
  corresponding template slot (see per-component table below)
- `slots.item` is an escape hatch; when provided alongside `slots.prefix` /
  `slots.label` / `slots.suffix` on the same object, `slots.item` wins and
  a dev warning is emitted
- `slots` never replaces the outer `ItemListRow` shell unless `slots.item`
  is set — `slots.prefix` / `label` / `suffix` keep all other shell
  behavior intact (spacing, hover, selected styling, `data-*` hooks)

Slot-prop context per component:

- `ItemList`: `{ item, group }`
- `Dropdown`: `{ item, close, selected }`
- `Select`: `{ option }`
- `Combobox`: `{ item, query, selected }`
- `MultiSelect`: `{ item, query, selected }`

Region precedence (per row):

1. template slot on the parent component (`#item-prefix`, `#item-<slot>`,
   `#item-label`, `#item-suffix`, `#item`) — templates always win so local
   overrides stay possible
2. matching `item.slots.*` function
3. default shell rendering (icon placeholder, `label` + `description`,
   checkmark, etc.)

Authoring example (options built in JS, shell-owned row preserved):

```ts
import { h } from 'vue'
import LucideCheck from '~icons/lucide/check'
import Avatar from '@/components/Avatar.vue'

const options = users.map((user) => ({
  label: user.name,
  value: user.id,
  slots: {
    prefix: ({ item }) => h(Avatar, { image: item.image, class: 'size-4' }),
    suffix: ({ selected }) =>
      selected ? h(LucideCheck, { class: 'size-4' }) : null,
  },
}))
```

Full-row escape hatch:

```ts
const options = [
  {
    label: 'Danger zone',
    value: 'danger',
    slots: {
      item: ({ item }) =>
        h('div', { class: 'text-ink-red-5 px-2 py-1' }, item.label),
    },
  },
]
```

#### Relationship to `slot: string`

These are deliberately adjacent, singular vs plural:

- `slot?: string` picks which `#item-<slot>` template slot on the parent
  should render this item's **label** region (template-side dispatch)
- `slots?: ItemSlots<...>` provides inline slot implementations for one or
  more regions of this item (JS-side inline)

The two can coexist on the same item. If both target the label region,
normal region precedence applies: `#item-<slot>` template wins over
`slots.label`.

#### Backward compatibility

Nothing existing breaks.

- `Dropdown.item.component` keeps working as a deprecated alias of
  `slots.item`. If both are present, `slots.item` wins and a dev warning
  fires.
- `Combobox.item.render` keeps working as a deprecated alias:
  - if `render` is a function → treated as `slots.item = render`
  - if `render` is an object (undocumented in older versions but tolerated
    by some apps) → treated as `slots = render`
- Apps that pass both `render` and `slots` see a dev warning and `slots`
  wins.

### 10. Popover motion conventions

All components in this family that render a popover (`Dropdown`, `Select`,
`Combobox`, `MultiSelect`) share one motion contract.

Entry:

- the popover content scales in from the trigger, not from the viewport
  center — the element that actually scales should set
  `transform-origin: var(--reka-<component>-content-transform-origin)`
  (or the equivalent primitive-provided CSS variable)
- strong ease-out curve `cubic-bezier(0.23, 1, 0.32, 1)`
- enter duration 150–200ms, exit duration 130–160ms
- enter from `scale(0.97)` + small `translateY(2px)` + `opacity: 0` —
  never from `scale(0)`
- `prefers-reduced-motion: reduce` disables the animation

Keyboard-driven opens skip the enter/exit animation entirely:

- when the popover is opened via keyboard — Enter / Space / ArrowUp /
  ArrowDown on the trigger, typing in a searchable input, or tab-focus
  with `openOnFocus` — the content appears and disappears without
  transition
- pointer-driven opens (click / tap) play the full animation
- the mechanism: the component records the timestamp of each `pointerdown`
  on the trigger, and when the popover transitions from closed → open it
  classifies the open as pointer-driven only if a `pointerdown` fired
  within a short window (~300ms) before the transition; anything else
  defaults to keyboard
- the resolved mode is exposed as `data-motion="animated" | "instant"` on
  the content element and CSS gates the animation on that attribute
- `data-motion="instant"` still runs a very short opacity-only fade
  (~80ms, linear, no transform) on open. This is below the perception
  threshold for motion — it feels instant — but long enough to mask the
  1-frame position-settle the underlying popper performs on mount.
  Without it, keyboard opens show an abrupt jump as the popper corrects
  its position from the default frame to the measured frame. Close
  uses `animation: none`.

Rationale: pickers in this family are opened tens to hundreds of times a
day. For keyboard users, any enter/exit motion is latency the system added
between their keystroke and the next action. Pointer users open less
frequently and benefit from the entrance cue.

Tracking `keydown` alone isn't enough because tab-focus (combined with
`openOnFocus`) emits no key on the trigger itself. The pointer-recency
check catches every non-pointer path — tab-focus, typing, Enter, Space,
arrow keys — as "keyboard" by exclusion.

The pointer-recency check is factored into a shared composable
(`usePopoverMotion(open)` → `{ motion, onPointerDown }`) so every
component in this family wires the same ~10 lines of logic:
`@pointerdown="onPointerDown"` on the trigger, `:data-motion="motion"` on
the content, CSS that reads `[data-motion='animated']`. `Combobox`,
`Select`, and `Dropdown` use it today; `MultiSelect` should adopt the
same composable when it lands.

### 11. String-based icons (`lucide-*`)

Selection components in this family (`Select`, `Combobox`, `MultiSelect`,
`Dropdown`) accept `item.icon` as either a Vue `Component` **or** a
string. For strings, the family standardizes on the `lucide-<name>`
convention powered by the shared Tailwind plugin
(`tailwind/lucideIconsPlugin.js`):

- `icon: 'lucide-edit'` / `'lucide-trash-2'` / `'lucide-more-horizontal'`
  — the literal class name
- auto-rendered as `<span :class="item.icon">` inside the prefix region
  when no consumer slot (`#item-prefix` or `item.slots.prefix`) claims
  that region
- sizing (`size-4`), color (`text-ink-gray-6` by default, `text-ink-red-3`
  for `theme: 'red'` in `Dropdown`) are applied by the component

Benefits:

- no per-call-site `import` for every icon
- `item.icon` stays serialisable (survives JSON round-trips, server-
  driven menus, feature-flag configs)
- Tailwind's JIT scanner finds literal `lucide-*` strings in source and
  only emits CSS for the icons actually referenced

Limitations (worth documenting where consumers trip over them):

- dynamic construction (`` `lucide-${action}` ``) bypasses the JIT
  scanner and won't emit the class; consumers need either literal
  strings or an explicit whitelist
- consumer apps need `frappe-ui/src/**/*.vue` in their Tailwind
  `content` paths so references inside frappe-ui itself are picked up

Passing a Vue `Component` still works for cases where the plugin isn't
desired (icons outside Lucide, dynamic icon composition, etc.).
Consumer-authored prefix slots always take precedence — if the caller
wants custom rendering, they wire `#item-prefix` or `item.slots.prefix`
and the auto-icon branch is skipped.

### 12. Group field naming

Across the selection family (`Dropdown`, `Select`, `Combobox`,
`MultiSelect`), the canonical field name inside a grouped entry is
`options`:

```ts
{ group: 'Active', options: [...] }
```

Rules:

- the grouped-entry field on every selection component is `options`
- the top-level prop on each component is `options`
- `Dropdown` previously used `{ group, items }`; it accepts `items` as a
  deprecated alias on grouped entries through `v1.x`. If both are
  provided, `options` wins and a dev warning is emitted; if only `items`
  is provided, it is silently mapped to `options`.
- `Combobox` and `MultiSelect` always used `{ group, options }`; they do
  not accept an `items` alias because that shape was never part of their
  public API.
- `ItemList` is the exception — it uses `items` everywhere because it is
  the generic primitive, not a selection component. `ItemListGroup` keeps
  `{ group, items }` as its native shape.

Rationale:

- the original real-world inconsistency was Dropdown using `{ group, items }`
  while Combobox / MultiSelect used `{ group, options }`. Selection
  components agreeing on `options` matches form-control language
  (`<select><option>`) and avoids renaming Combobox / MultiSelect.
- Dropdown's group field changes from `items` → `options` to align. Old
  `{ group, items }` shapes still work as the deprecated alias on Dropdown
  only.

### 13. Deprecation policy for this family

For v1.x:

- do not break existing public APIs
- add the new preferred APIs first
- keep older APIs exported and functioning
- add dev warnings where detection is practical and low-noise
- move older APIs out of the main docs path

Good candidates for deprecation warnings:

- `Combobox` custom items using `slotName`
- `Combobox` query listeners using `input` instead of `update:query`
- `Dropdown` items using `component` for ordinary row customization
- `Select` / `MultiSelect` usage of `#option` once `#item-label` exists
- any selection component receiving `{ group, items }` group entries
  instead of `{ group, options }` (the deprecated alias for cross-component
  symmetry)

Harder-to-warn cases like `Dropdown #item` can be deprecated in docs first.

---

## Per-component specs

The exact public APIs, behaviors, slots, styling hooks, and migration paths for
the shared list surface and the single-choice pickers live in their own files:

- [`08a-itemlist-spec.md`](./08a-itemlist-spec.md) — `ItemList` and
  `ItemListRow`
- [`08b-dropdown-spec.md`](./08b-dropdown-spec.md) — `Dropdown`
- [`08c-select-spec.md`](./08c-select-spec.md) — `Select`
- [`08d-combobox-spec.md`](./08d-combobox-spec.md) — `Combobox`
- [`08e-multiselect-spec.md`](./08e-multiselect-spec.md) — `MultiSelect`

---

## Cohesion opportunities

Prop and behavior inconsistencies across `Dropdown`, `Select`, `Combobox`, and
`MultiSelect` that this RFC resolves. None require breaking changes; every
change is additive or alias-based.

This section tracks status: what the per-component specs now integrate, what
is intentionally deferred, and what is explicitly out of scope.

### Integrated into the per-component specs

#### 0. Grouped-entry field name

- Every selection component (`Dropdown`, `Select`, `Combobox`,
  `MultiSelect`) uses `{ group, options }` as the canonical grouped-entry
  shape.
- `Dropdown` previously used `{ group, items }`; its canonical group field
  is now `options`. `items` remains accepted as a deprecated alias on the
  group entry through `v1.x` (warning fires if both are provided; silent
  map if only `items` is given).
- `Combobox` and `MultiSelect` always used `{ group, options }` — no
  alias is added there because `items` was never part of their public API.
- Top-level prop names are unchanged (`options` on all four). `ItemList`'s
  `ItemListGroup` continues to use `{ group, items }` natively because
  `ItemList` is a generic primitive, not a selection component.
- See shared design rule 12 for the full rule.

#### 1. Popover positioning

- `side` + `align` + `offset` + `portalTo` are now documented on `Dropdown`,
  `Select`, `Combobox`, and `MultiSelect`.
- `Dropdown.placement` (`'left' | 'center' | 'right'`) and
  `Combobox.placement` (`'start' | 'center' | 'end'`) remain supported as
  deprecated aliases for `align`. Old → new mapping and precedence rules are
  defined in shared design rule 7.
- `Select` and `MultiSelect` had no prior positioning props; they gain the
  four props purely additively.

#### 2. `id` prop for form-label association

- `Select`, `Combobox`, and `MultiSelect` all accept `id?: string` and
  forward it to the focusable trigger/input so `<label for="...">`
  associates correctly.
- `Dropdown` is a menu button, not a form field, and does not take `id`.

#### 3. Loading state

- `Combobox` and `MultiSelect` both accept `loading?: boolean`.
- When `true`: the popover shows a loading indicator, suspends `#empty`, and
  on `Combobox` disables the create-new path for `allowCustomValue`.
- `Select` does not get `loading` because its option set is static by
  definition.

#### 4. Empty state parity

- `Dropdown`, `Select`, `Combobox`, and `MultiSelect` all accept:
  - `emptyText?: string` with a sensible default per component
  - a `#empty` slot that overrides the default empty rendering
- Component defaults: `Dropdown` / `Select` use `'No options'`;
  `Combobox` / `MultiSelect` use `'No results'`.

#### 5. Uniform disabled-option handling

- Defined once as shared design rule 8 and referenced from each
  per-component spec: keyboard skip, no click activation, no emits, shared
  `ItemListRow` disabled styling, `data-disabled`.
- Component-specific extensions (e.g. `Dropdown` submenu/switch rows,
  `Combobox` `allowCustomValue` skip, `MultiSelect` `selectAll` skip) are
  called out in each spec.

#### 6. `update:query` parity

- `Combobox` emits `update:query` with `input` kept as a compatibility
  alias.
- `MultiSelect` emits `update:query` from v1 onward. The old `MultiSelect`
  did not expose a public search event, so no alias is needed.

#### 7. Item context field: `searchTerm` → `query`

- `Combobox` custom-option `onClick` / `condition` now receive
  `{ query }` as the canonical context.
- For compatibility, the context also carries `searchTerm` with the same
  value through `v1.x`, so existing handlers destructuring
  `({ searchTerm })` keep working unchanged.
- `searchTerm` is typed as `@deprecated` and will be removed in a future
  major.

#### 8. `onClick` / `condition` keep their names

- These match broader library convention and stay canonical. No rename.

#### 9. Per-item inline slots

- All item-accepting components (`ItemList`, `Dropdown`, `Select`,
  `Combobox`, `MultiSelect`) now accept a `slots` field on item objects
  whose shape matches Vue's render-function slots object.
- Keys mirror the template slot names without the `item-` prefix:
  `{ prefix, label, suffix, item }`.
- This gives apps the same customization depth as `#item-prefix` /
  `#item-label` / `#item-suffix` / `#item` template slots when options are
  built in JavaScript and a template is not available.
- Template slots always win over `item.slots.*` for the same region, so
  local template overrides remain possible.
- Compatibility: `Dropdown.item.component` remains a deprecated alias for
  `item.slots.item`; `Combobox.item.render` remains a deprecated alias —
  a function maps to `slots.item`, an object maps to `slots`.

#### 10. Option object convergence (shared fields)

- The canonical shared option body for selectable options is:

  ```ts
  {
    label: string
    value?: string | number | boolean
    disabled?: boolean
    icon?: string | Component
    description?: string
    slot?: string
  }
  ```

- Per-component extensions are allowed only where they carry real semantics
  (`Dropdown`: `submenu`, `switch`, `component`, `route`; `Combobox`:
  `type: 'custom'`).
- Non-breaking; current shapes are supersets or subsets of this set.

### Deferred to a later `v1.x` minor

#### Size and variant parity

- `Select` has `size` + `variant`; `Combobox` now documents both in its
  spec; `MultiSelect` now documents both in its spec. Implementation for
  `MultiSelect` can land in a later `v1.x` minor since its current trigger
  is a plain `Button`.
- `Dropdown` continues to defer trigger sizing to its `button` prop; no
  change planned.

#### Grouped options for `Select`

- `Select` explicitly does not accept grouped options in the initial v1
  cut. `Combobox` and `MultiSelect` do.
- Consider adding grouped support to `Select` in a later `v1.x` minor using
  the same `ItemListGroup`-shaped input. Additive whenever it lands.

### Non-goals for cohesion work

- do not unify option value types (`string | number | bigint | object` for
  `Select` vs `string` for `Combobox` / `MultiSelect`) — that divergence
  has real semantics
- do not merge `Dropdown`'s `button` trigger shape into the listbox trigger
  shape used by `Select` / `Combobox` / `MultiSelect` — menu vs listbox is
  a meaningful semantic boundary
- do not remove `openOnFocus` / `openOnClick` from `Combobox` — they
  describe combobox-specific input behavior that doesn't generalize
- do not collapse `hideSearch` into a generic flag shared with `Select` —
  `Select` does not have search; `Combobox` is always searchable

---

## Autocomplete compatibility note

`Autocomplete` is not part of the long-term preferred API shape, but it is still
heavily used across real apps.

v1 direction:

- keep `Autocomplete` exported and functioning
- document it as a migration layer
- direct new single-select searchable work toward `Combobox`
- direct new multi-select searchable work toward `MultiSelect`

Migration intent:

- `Autocomplete` single-select -> `Combobox`
- `Autocomplete` multi-select -> `MultiSelect`
- `#target` -> `#trigger`
- `#item-prefix` / `#item-label` / `#item-suffix` vocabulary should stay
  recognizable across the migration path

This should be a long migration, not an abrupt rename.

---

## Implementation order

1. **ItemList / ItemListRow**
   - build the shared styled list surface
   - build the shared row shell
   - add grouped list support
   - add shared item slots and styling hooks
   - make it usable directly by app authors for advanced cases

2. **Dropdown**
   - compose `ItemList` / `ItemListRow`
   - add shell-owned item slots
   - add `selected` support
   - add `v-model:open`
   - keep `#item` and `component`, but move them to escape-hatch status

3. **Combobox**
   - compose `ItemList` / `ItemListRow`
   - add `update:query`
   - add `v-model:open`
   - add preferred alias: `slot`
   - preserve `onClick` and `condition`
   - preserve current custom item API while warning on old names where needed

4. **Select**
   - compose `ItemList` / `ItemListRow`
   - add `v-model:open`
   - add `#item-prefix`, `#item-label`, `#item-suffix`
   - keep `#option` as alias

5. **MultiSelect**
   - compose `ItemList` / `ItemListRow`
   - align with the same slot model as `Select` and `Combobox`
   - add `v-model:open`
   - add `update:query`
   - add grouped option support

## v1 release contract for this RFC

For v1, this RFC means:

- no breaking API removals
- clear preferred APIs for new work
- explicit deprecations for awkward legacy customization patterns
- migration paths for existing apps
- a more consistent mental model across `ItemList`, `Dropdown`, `Select`,
  `Combobox`, and `MultiSelect`
