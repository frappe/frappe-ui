# Popover Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for the rebuilt `Popover` and the
shared `PopoverPanel` shell. `Popover` is a general-purpose floating-panel
primitive built on reka-ui's `PopoverRoot`. It shares the popover positioning
conventions in [`selection.md`](./selection.md) (shared design rule 7) and the
popover motion conventions (shared design rule 10).

The hover-on-trigger behavior is split out into a separate `HoverCard`
component (see [HoverCard split](#hovercard-split)); `Popover` keeps
`trigger="hover"` working through `v1.x` as a deprecated alias.

## Role

`Popover` is the unstyled-by-default floating panel: a trigger plus a portaled,
positioned content surface. It owns positioning, dismissal, and motion, but it
does **not** own selection, query, or action-menu semantics.

If the UI is:

- choosing a form/picker value → use `Select` / `Combobox`
- a menu of actions → use `Dropdown`
- a hover-revealed info card → use `HoverCard`

`Popover` stays the escape hatch for everything else: filters, color pickers,
custom editor chrome, attached anchored panels.

## PopoverPanel shell

`PopoverPanel` is a shared, behavior-free component that owns the floating-panel
**shell only**. It is rendered inside a reka `*Content` element by the consuming
component (`Popover`, `Select`, `Combobox`, `DatePicker`, `TimePicker`).

`PopoverPanel` owns:

- the visual shell: `rounded-lg bg-surface-elevation-2 shadow-2xl ring-1
  ring-black ring-opacity-5`
- `data-slot="content"`
- the motion-target wiring: `data-state="open|closed"` and
  `data-motion="animated|instant"` on the animated content-body

`PopoverPanel` does **not** own:

- the reka root / content element (each consumer keeps its own
  `SelectRoot` / `ComboboxRoot` / `PopoverRoot` + matching `*Content`)
- positioning props, dismissal, keyboard, or a11y
- selection / query / menu behavior

### Motion rhythm prop

`PopoverPanel` supports two motion rhythms so the same shell can serve the
selection family and `Popover`:

- `rhythm="popover"` (default): scale-from-trigger, `180ms` enter / `140ms`
  exit — the shared selection rhythm (see [Motion](#motion)).
- `rhythm="instant"`: the shorter scale-only rhythm.

Decision on `Dropdown`: `Dropdown` is **left as-is** and does **not** fold into
`PopoverPanel`. Its motion CSS is gated on `[data-selection]` specifically so it
does not leak to `Dropdown`, whose rhythm is intentionally shorter and
scale-only. Re-homing it is not clean enough to justify in this rebuild; it
keeps its current shell.

## Exact public API for v1

### Types

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface PopoverProps {
  open?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
  collisionPadding?: number
  dismissible?: boolean
  matchTriggerWidth?: boolean
  bare?: boolean

  // --- deprecated, kept working through v1.x ---
  /** @deprecated use `v-model:open` */
  show?: boolean
  /** @deprecated use `side` + `align`; split on '-', bare side => align 'center' */
  placement?:
    | 'top' | 'top-start' | 'top-end'
    | 'right' | 'right-start' | 'right-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
  /** @deprecated use `dismissible` */
  hideOnBlur?: boolean
  /** @deprecated renamed to `matchTriggerWidth` */
  matchTargetWidth?: boolean
  /** @deprecated use the separate `HoverCard` component */
  trigger?: 'click' | 'hover'
  /** @deprecated only used with `trigger="hover"`; moved to HoverCard (seconds) */
  hoverDelay?: number
  /** @deprecated only used with `trigger="hover"`; moved to HoverCard (seconds) */
  leaveDelay?: number
  /** @deprecated no class-injection; use data-slot CSS hooks */
  popoverClass?: string | object | Array<string | object>
  /** @deprecated motion is on by default; no-op */
  transition?: 'default' | null
}
```

Defaults:

- `open = false`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`
- `collisionPadding = 10`
- `dismissible = true`
- `matchTriggerWidth = false`
- `bare = false` — when `true`, `#default` renders without the PopoverPanel shell
  (no background, border, shadow, rounding); the content brings its own surface.
  Mirrors Dialog's `bare`. The deprecated `#body` slot maps to this behavior.

Positioning follows the shared popover positioning conventions in
[`selection.md`](./selection.md).

State conventions:

- visibility is controlled with `v-model:open`
- `Popover` does not own any value/selection state
- `matchTriggerWidth` sets `minWidth: var(--reka-popover-trigger-width)` on the
  content (matches min width to the trigger, not a hard width); it keeps using
  the same reka CSS variable as before

### Emits

```ts
interface PopoverEmits {
  'update:open': [value: boolean]
  // behavior-named aliases, kept; Calendar binds keyboard shortcuts on these
  open: []
  close: []
}
```

- `update:open` is canonical and fires once per toggle (no double-emit)
- `open` / `close` fire after the open state settles, matching the boolean
- the old `update:show` is removed; the deprecated `show` prop is supported via
  silent back-compat mapping (see below), not via a `update:show` emit

### Slots

Guaranteed slot props:

```ts
type PopoverSlotProps = {
  open: () => void
  close: () => void
}

// Deprecated #target preserves the old, wider contract:
type PopoverTargetSlotProps = {
  togglePopover: (flag?: boolean | Event) => void
  updatePosition: () => void // no-op, kept for source compatibility
  open: () => void
  close: () => void
  isOpen: boolean
}
```

Supported slots:

- `#trigger="{ open, close }"`
  - rendered via reka `PopoverTrigger` **as-child**: click, keyboard, and aria
    wiring are automatic. Do **not** hand-wire `@click` here.
- `#default="{ open, close }"`
  - panel content, rendered inside the standard `PopoverPanel` shell (or bare,
    with no shell, when the `bare` prop is set)
- `#body` / `#body-main`
  - compatibility aliases with the same `{ open, close }` props. `#body` is a
    full body override and renders **bare** (no shell), matching its v0 contract
    — equivalent to `#default` + `bare`. `#body-main` renders inside the shell.
- `#target="{ togglePopover, updatePosition, isOpen, open, close }"`
  - **deprecated.** Rendered via reka `PopoverAnchor` **as-child** with the old
    manual-wiring contract preserved: nothing is auto-wired, the consumer calls
    `togglePopover` / `open` / `close` itself. `updatePosition` is a no-op.

Exact slot rules:

- `#trigger` wins over `#target`
- `#default` wins over `#body`, which wins over `#body-main`
- the deprecated `#target` keeps its manual contract so existing
  `@click="togglePopover"` consumers do not double-toggle when migrated to a
  real `PopoverTrigger`
- the shell is provided by `PopoverPanel` for shelled content (`#default`
  without `bare`, and `#body-main`). Bare content — `#default` + `bare`, or the
  legacy `#body` override — renders directly in `PopoverContent` with no shell,
  so consumers bringing their own surface don't get a panel-in-a-panel

### Exposed

```ts
defineExpose<{ open: () => void; close: () => void }>()
```

Only `open()` and `close()`. `togglePopover` / `updatePosition` remain
slot-prop-only on the deprecated `#target` slot and are not exposed.

## Back-compat and precedence

Rule (shared with the rest of the family, shared design rule 7):

- when **both** the old and the new surface are bound, the **new one wins** and
  a **one-time** dev warning fires (via `warnDeprecated`)
- when **only the old** surface is bound, it is **silently** mapped to the new
  one — no warning

Mapping table:

| Old surface | New surface | Mapping |
|---|---|---|
| `show` / `v-model:show` | `open` / `v-model:open` | direct |
| `placement="bottom-start"` | `side="bottom"` + `align="start"` | split on `'-'`; bare side (e.g. `"bottom"`) → `align: "center"` |
| `hideOnBlur` | `dismissible` | direct (same boolean meaning) |
| `matchTargetWidth` | `matchTriggerWidth` | rename, same `--reka-popover-trigger-width` behavior |
| `trigger="hover"` (+ `hoverDelay` / `leaveDelay`) | `<HoverCard>` | keeps working; one-time warn points at `HoverCard`. Delays stay in **seconds**. |
| `popoverClass` | `data-slot` CSS hooks | no-op + warn |
| `transition="default"` | default motion | no-op (motion is on by default) |
| `#target` | `#trigger` | old manual contract preserved on `#target` |
| `#body` | `#default` + `bare` | full override; renders bare (no shell) |
| `#body-main` | `#default` | renders inside the shell |

Use the existing `warnDeprecated(name, replacement, docHref?)` helper at
`src/utils/warnDeprecated.ts`: it is a no-op in production, fires once per
`name`, and has `_resetWarnDeprecated()` for tests.

`placement` precedence detail: if `placement` is bound together with `side`
and/or `align`, the explicit `side`/`align` win for whichever axis they set, and
a one-time warning fires; if only `placement` is bound, it is split silently.

## Styling hooks

No class-injection props. `popoverClass` is a deprecated no-op (+ warn).
Stable hooks instead:

- `data-slot="trigger"` — on the trigger element (`PopoverTrigger` /
  deprecated `PopoverAnchor`)
- `data-slot="content"` — on the `PopoverPanel` shell
- `data-state="open" | "closed"` — driven by the reka popover primitive
- `data-motion="animated" | "instant"` — on the animated content-body, set by
  `usePopoverMotion`

The shell visual is owned by `PopoverPanel`: `rounded-lg
bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5`. (This is a
deliberate restyle from the legacy `rounded-lg border bg-surface-elevation-2
shadow-xl` shell.)

Gameplan rule still applies in apps: gray shades only, never color shades.

## Motion

`Popover` follows the shared popover motion conventions (shared design rule 10)
via the existing `usePopoverMotion` composable + shared popover motion CSS:

- content scales in from the trigger via
  `transform-origin: var(--reka-popover-content-transform-origin)` on the
  animated element (the inner content-body, not the outer positioned wrapper)
- enter `180ms` / exit `140ms` with `cubic-bezier(0.23, 1, 0.32, 1)`, from
  `scale(0.97)` + `translateY(2px)` + `opacity: 0`
- keyboard-driven opens skip the animation entirely (resolve to
  `data-motion="instant"`)
- pointer-driven opens (click / tap) play the full animation
  (`data-motion="animated"`)
- classification is pointer-recency based: an open transition counts as
  pointer-driven only if a `pointerdown` fired on the trigger within ~300ms
  before it; everything else defaults to keyboard
- `prefers-reduced-motion: reduce` disables the content animation
- `transition="default"` is a deprecated no-op (motion is on by default)

Bind `usePopoverMotion(open).onPointerDown` to the trigger's `@pointerdown`
exactly as `Select` does.

## Accessibility and semantics

`Popover` follows the disclosure/popover pattern, not listbox or menu:

- `#trigger` is a real `PopoverTrigger` with auto click/keyboard/aria wiring
  (`aria-expanded`, `aria-controls`, toggle on Enter/Space)
- the deprecated `#target` is a `PopoverAnchor` with no auto wiring — the
  consumer owns interaction, matching legacy behavior
- focus management, escape handling, and outside-pointer dismissal are
  delegated to the reka popover primitive
- `dismissible = false` prevents outside-interaction dismissal
  (`onInteractOutside` → `preventDefault`); interacting with the trigger itself
  is also prevented from triggering a close-then-reopen flicker

## HoverCard split

A separate `<HoverCard>` component is built on reka `HoverCard` primitives. It
owns hover-reveal behavior and deletes the hand-rolled timer code from the
legacy `Popover`:

- `hoverDelay` / `leaveDelay` in **seconds** (consistent with `Tooltip`)
- standard `side` / `align` / `offset` / `portalTo` / `collisionPadding`
- renders content inside the shared `PopoverPanel` shell

On `Popover`, `trigger="hover"` (plus `hoverDelay` / `leaveDelay`) keeps working
through `v1.x` with a one-time `warnDeprecated` pointing at `HoverCard`.

## Keep supported in v1.x

These stay supported:

- `v-model:open`
- `side`, `align`, `offset`, `portalTo`, `collisionPadding`
- `dismissible`
- `matchTriggerWidth`
- `#trigger`, `#default`
- deprecated-but-working: `show`, `placement`, `hideOnBlur`, `matchTargetWidth`,
  `trigger="hover"` (+ `hoverDelay` / `leaveDelay`), `popoverClass`,
  `transition`, `#target`, `#body`, `#body-main`
- `@open` / `@close` emits

## Deprecate

Keep working, but deprecate:

- `show` / `v-model:show` → `v-model:open`
- `placement` → `side` + `align`
- `hideOnBlur` → `dismissible`
- `matchTargetWidth` → `matchTriggerWidth`
- `trigger="hover"` → `<HoverCard>`
- `popoverClass` → `data-slot` CSS hooks
- `transition` → default motion (no-op)
- `#target` → `#trigger`
- `#body` / `#body-main` → `#default`

Do **not** deprecate:

- `side`, `align`, `offset`, `portalTo`, `collisionPadding`
- `dismissible`
- `@open` / `@close`

## Migration path

### Trigger: `#target` + manual wiring → `#trigger`

Old:

```vue
<Popover placement="bottom-start">
  <template #target="{ togglePopover }">
    <Button @click="togglePopover()">Open</Button>
  </template>
  <template #body-main>
    <div class="p-2">Panel</div>
  </template>
</Popover>
```

New:

```vue
<Popover side="bottom" align="start">
  <template #trigger>
    <Button>Open</Button>
  </template>
  <template #default>
    <div class="p-2">Panel</div>
  </template>
</Popover>
```

The `#trigger` slot is an as-child `PopoverTrigger`: drop the `@click`. Keeping
`@click="togglePopover"` on `#trigger` would double-toggle — that wiring belongs
only on the deprecated `#target` slot.

### Controlled visibility

Old:

```vue
<Popover :show="isOpen" @update:show="isOpen = $event" />
```

New:

```vue
<Popover v-model:open="isOpen" />
```

### Hover trigger → HoverCard

Old:

```vue
<Popover trigger="hover" :hover-delay="0.5" :leave-delay="0.5">
  <template #target>...</template>
  <template #body-main>...</template>
</Popover>
```

New:

```vue
<HoverCard :hover-delay="0.5" :leave-delay="0.5">
  <template #trigger>...</template>
  <template #default>...</template>
</HoverCard>
```

### Custom panel chrome via `popoverClass` → CSS hooks

Old:

```vue
<Popover popover-class="w-64" />
```

New: target the stable hook instead of injecting a class.

```css
[data-slot='content'] {
  width: 16rem;
}
```

## Changelog

### v1.0.0 rebuild

- **Rebuilt on reka `PopoverTrigger` (as-child).** `#trigger` auto-wires click,
  keyboard, and aria; no more manual `togglePopover` on the trigger.
- **`v-model:open` replaces `show` / `update:show`.** Single canonical emit;
  `show` is silently mapped through `v1.x`.
- **`side` + `align` replace `placement`.** Same split-on-`'-'` mapping; bare
  side → `align: 'center'`.
- **`dismissible` replaces `hideOnBlur`; `matchTriggerWidth` replaces
  `matchTargetWidth`.**
- **Shared `PopoverPanel` shell** owns the floating-panel visual + `data-slot` /
  `data-state` / `data-motion` hooks; restyled to `shadow-2xl` + `ring` (no
  `border`).
- **Motion on by default** via `usePopoverMotion` + shared popover motion CSS;
  `transition="default"` is a no-op.
- **No class-injection props.** `popoverClass` is a no-op + warn; use the
  `data-slot` hooks.
- **`HoverCard` split out** onto reka `HoverCard` primitives; legacy hand-rolled
  timers deleted. `trigger="hover"` on `Popover` warns and points at
  `HoverCard`.
- **`Dropdown` intentionally not folded into `PopoverPanel`** — its shorter,
  scale-only motion rhythm stays gated away from the selection rhythm.
