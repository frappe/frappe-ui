# Popover Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for the rebuilt `Popover` and the
shared `PopoverPanel` shell. `Popover` is a general-purpose floating-panel
primitive built on reka-ui's `PopoverRoot`. It shares the positioning props
(`side`, `align`, `offset`, `portalTo`) and the popover motion described in
[`selection.md`](./selection.md).

The hover-on-trigger behavior lives in a separate `HoverCard` component (see
[HoverCard split](#hovercard-split)). `Popover`'s `trigger` prop now selects
`click` or `manual`; `trigger="hover"` was removed before `1.0.0`, with no
alias and no warning.

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

- the visual shell: `rounded-6 bg-surface-elevation-2 shadow-2xl ring-1
  ring-black ring-opacity-5`
- `data-slot="content"`
- the motion-target wiring: `data-state="open|closed"` and
  `data-motion="instant"` on the content-body

`PopoverPanel` does **not** own:

- the reka root / content element (each consumer keeps its own
  `SelectRoot` / `ComboboxRoot` / `PopoverRoot` + matching `*Content`)
- positioning props, dismissal, keyboard, or a11y
- selection / query / menu behavior

### Motion rhythm

There is one rhythm and no prop to pick it: an `80ms` opacity fade on open,
nothing on close (see [Motion](#motion)). Every surface uses it, `HoverCard`
included. Nothing in the library scales in.

Decision on `Dropdown`: `Dropdown` is **left as-is** and does **not** fold into
`PopoverPanel`. It keeps its own menu shell, and shares the fade with
`ContextMenu` through `Menu.vue`. The rhythms match, but re-homing the shell is
not clean enough to justify in this rebuild.

## Exact public API for v1

### Types

The types live in `src/components/Popover/types.ts`. Read them there; the
shape below is a summary.

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface PopoverProps {
  open?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: PortalTarget
  collisionPadding?: number
  dismissible?: boolean
  autoFocus?: boolean
  trigger?: 'click' | 'manual'
  reference?: Element
  matchTriggerWidth?: boolean
  bare?: boolean
  arrow?: boolean
}
```

Defaults:

- `open = undefined` — the popover is uncontrolled and starts closed. Bind
  `open` and it becomes controlled: the popover shows what the parent says,
  and `update:open` is a request the parent may decline
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo` unset — the fallback when neither the prop nor an embedding
  host names a target is `body`. See [`portal-target.md`](./portal-target.md).
- `collisionPadding = 10`
- `dismissible = true` — covers both user dismiss channels, outside
  interaction and `Escape`
- `autoFocus = true` — when `false`, the content does not take focus on open,
  so a panel driven by typing leaves the caret in the trigger's input
- `trigger = 'click'` — `manual` does nothing on click; only `v-model:open`
  opens and closes it, and the trigger gets no `aria-expanded` or
  `aria-controls`
- `reference` unset — the content is positioned against the trigger. Pass an
  element to position against that instead, for a labelled field where the
  panel should sit under the input row rather than under the description. It
  works in both trigger modes
- `matchTriggerWidth = false`
- `bare = false` — when `true`, `#default` renders without the PopoverPanel shell
  (no background, border, shadow, rounding); the content brings its own surface.
  Mirrors Dialog's `bare`
- `arrow = false` — when `true`, renders a reka `PopoverArrow` inside
  `PopoverContent`, styled `fill-surface-elevation-2` to match the shell.
  `data-slot="arrow"`.

Positioning uses the same four props (`side`, `align`, `offset`, `portalTo`)
and defaults as the selection family — see [`selection.md`](./selection.md).

State conventions:

- visibility is controlled with `v-model:open`
- `Popover` does not own any value/selection state
- `matchTriggerWidth` sets `minWidth: var(--reka-popover-trigger-width)` on the
  content (matches min width to the trigger, not a hard width)

### Emits

```ts
interface PopoverEmits {
  'update:open': [value: boolean]
  // behavior-named aliases, kept; Calendar binds keyboard shortcuts on these
  open: []
  close: []
}
```

- `update:open` is canonical and fires once per toggle (no double-emit). It is
  the *request*, so it fires even when a controlled parent declines it
- `open` / `close` report the state the popover actually reached. A controlled
  parent that declines a request gets no `open` event, so nothing an `@open`
  handler set up is left without its matching `@close`
- `update:show` is removed, along with the `show` prop

### Slots

Guaranteed slot props:

```ts
type PopoverSlotProps = {
  open: boolean
  setOpen: (value: boolean) => void
  close: () => void
}
```

`open` is the current state, not a method. `setOpen(value)` writes it and
`close()` is shorthand for `setOpen(false)`. On `Popover` alone, `open` used to
be a method; it is now the boolean, matching `Dropdown`, `Select`,
`MultiSelect`, `HoverCard`, and `Sidebar`.

Supported slots:

- `#trigger="{ open, setOpen, close }"`
  - rendered via reka `PopoverTrigger` **as-child**: click, keyboard, and aria
    wiring are automatic. Do **not** hand-wire `@click` here. Under
    `trigger="manual"` the trigger renders through a bare `Primitive` instead
    and wires nothing.
- `#default="{ open, setOpen, close }"`
  - panel content, rendered inside the standard `PopoverPanel` shell (or bare,
    with no shell, when the `bare` prop is set)

Exact slot rules:

- these are the only two slots. `#target`, `#body`, and `#body-main` were
  removed before `1.0.0`; see
  [`migration.md`](../docs/content/docs/migration.md#popover-hovercard-tooltip)
- the shell is provided by `PopoverPanel` for shelled content. With `bare`,
  `#default` renders directly in `PopoverContent` with no shell, so consumers
  bringing their own surface don't get a panel-in-a-panel
- `<Popover>` does not inherit attributes: it renders no element of its own, so
  a `class` on the component lands nowhere. Put it on the element inside
  `#trigger`

### Exposed

```ts
interface PopoverExposed {
  open: () => void
  close: () => void
  /** The content element. `null` while the popover is closed. */
  contentEl: HTMLElement | null
}
```

`open()` and `close()` are no-ops when the popover is already in that state.
`contentEl` is a property getter that reads the element on demand, so it is
read-only for the caller and reports `null` while the content is unmounted.

**Unresolved:** `contentEl` does not fit the shared element policy in
[`imperative-api.md`](./imperative-api.md). That policy names elements
`<role>Element` from a fixed list (`inputElement`, `viewportElement`), rules out
wrapper and content elements, and its table still records `Popover` as
`{ open, close }`. `contentEl` is shipped, documented, and tested
(`Popover.cy.ts`, "exposes contentEl, null while closed"). Either the policy
grows a content-element role by ADR or the member goes through a deprecation —
that decision is **pending**, and until it lands neither this spec nor
`Popover.vue` changes.

## Styling hooks

No class-injection props. `popoverClass` was removed before `1.0.0`. Stable
hooks instead:

- `data-slot="trigger"` — on the trigger element
- `data-slot="content"` — on the portaled reka `PopoverContent`
- `data-slot="content-body"` — on the `PopoverPanel` shell that owns the visuals
- `data-slot="arrow"` — on the arrow, when `arrow` is set
- `data-state="open" | "closed"` — driven by the reka popover primitive
- `data-motion="instant"` — on the content-body

The shell visual is owned by `PopoverPanel`: `rounded-6
bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5`. (This is a
deliberate restyle from the legacy `rounded-lg border bg-surface-elevation-2
shadow-xl` shell.)

Gameplan rule still applies in apps: gray shades only, never color shades.

## Motion

`Popover` uses the same motion as `Select` and `Dropdown`: the panel appears
instantly, with only a short fade to smooth the paint.

- open: `80ms` linear fade from `opacity: 0`. No scale, no translate
- close: no animation
- the rhythm is the same for pointer and keyboard opens; the content-body
  always carries `data-motion="instant"`
- `prefers-reduced-motion: reduce` disables the content animation
- there is no motion prop. `transition` was removed before `1.0.0`

A panel that appears at a fixed spot has nothing to scale from, so an entrance
animation only adds latency. Every surface in the library uses this rhythm,
`HoverCard` and `ContextMenu` included.

## Accessibility and semantics

`Popover` follows the disclosure/popover pattern, not listbox or menu:

- `#trigger` is a real `PopoverTrigger` with auto click/keyboard/aria wiring
  (`aria-expanded`, `aria-controls`, toggle on Enter/Space)
- `trigger="manual"` renders the trigger through a bare `Primitive` instead, so
  there is no click toggle and no `aria-expanded` / `aria-controls`. A manual
  popover needs its own pattern — the combobox wiring, say, or use `Combobox`,
  which has it
- the content is a reka `PopoverContent` with `role="dialog"`. There is no
  automatic `aria-describedby` between trigger and content; label the content
  yourself when it needs one
- focus management, escape handling, and outside-pointer dismissal are
  delegated to the reka popover primitive
- `autoFocus = false` cancels reka's focus-on-open (`onOpenAutoFocus` →
  `preventDefault`) so the caret stays in a trigger the user is typing in
- `dismissible = false` prevents both dismiss channels: outside interaction
  (`onInteractOutside` → `preventDefault`) and `Escape`
  (`onEscapeKeyDown` → `preventDefault`). Wiring only the first left
  `:dismissible="false"` closing on `Escape` anyway
- interacting with the trigger itself never dismisses from outside, so the
  trigger's own toggle decides the final state with no close-then-reopen flicker

## HoverCard split

A separate `<HoverCard>` component is built on reka `HoverCard` primitives. It
owns hover-reveal behavior and deletes the hand-rolled timer code from the
legacy `Popover`:

- `hoverDelay` / `leaveDelay` in **milliseconds** (consistent with `Tooltip`),
  both defaulting to `300`
- standard `side` / `align` / `offset` / `portalTo` / `collisionPadding`
- renders content inside the shared `PopoverPanel` shell

`trigger="hover"` on `Popover` was removed, not aliased. See
[`hover-card.md`](./hover-card.md).

## Current public surface

- `v-model:open`, `@open` / `@close`
- `side`, `align`, `offset`, `portalTo`, `collisionPadding`
- `dismissible`, `autoFocus`, `trigger`, `reference`
- `matchTriggerWidth`, `bare`, `arrow`
- `#trigger`, `#default`
- template ref: `open()`, `close()`, `contentEl`

## Removed before `1.0.0`

Removed under [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md). There
is no alias and no warning: Vue drops an unknown prop or slot silently, so
check every `<Popover>` in an app. The before/after table lives in
[`migration.md`](../docs/content/docs/migration.md#popover-hovercard-tooltip).

- `show` / `v-model:show` and the `update:show` emit → `v-model:open`
- `placement` and the `PopoverPlacement` type → `side` + `align`
- `hideOnBlur` → `dismissible`
- `matchTargetWidth` → `matchTriggerWidth`
- `trigger="hover"` (+ `hoverDelay` / `leaveDelay`) → `<HoverCard>`, with the
  delays now in milliseconds
- `popoverClass` → `data-slot` CSS hooks
- `transition` → built-in motion
- `#target` → `#trigger`; `#body` → `#default` + `bare`; `#body-main` →
  `#default`
- the `togglePopover` and `updatePosition` slot props → `setOpen`; reka
  repositions on its own
- the `isOpen` slot prop → `open`, which is now the boolean
- `NestedPopover` → `Popover`

## Migration path (historical)

These before-examples use the removed v0 API on purpose.

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
`@click="togglePopover"` on `#trigger` would double-toggle: the handler and
reka's own toggle cancel each other and the panel stays shut.

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
<HoverCard :hover-delay="500" :leave-delay="500">
  <template #trigger>...</template>
  <template #default>...</template>
</HoverCard>
```

v0's delays were seconds. `HoverCard`'s are milliseconds, so multiply by 1000:
`0.5` becomes `500`.

### Custom panel chrome via `popoverClass` → CSS hooks

Old:

```vue
<Popover popover-class="w-64" />
```

New: target the stable hook instead of injecting a class.

```css
[data-slot='content-body'] {
  width: 16rem;
}
```

## Changelog

### 2026-09-17

Spec corrections only. No runtime behavior changed.

- **The v0 API is removed, not deprecated.** This spec promised `show`,
  `placement`, `hideOnBlur`, `matchTargetWidth`, `trigger="hover"`,
  `popoverClass`, `transition`, `#target`, `#body`, and `#body-main` would keep
  working through `v1.x`. ADR-0008 postdates that promise and wins. The old
  names now appear only in the labelled historical examples.
- **The slot `open` is a boolean.** The slot-props block typed it as a method.
  `setOpen` writes the state; `close()` is `setOpen(false)`.
- **`autoFocus`, `trigger="manual"`, and `reference` are documented.** All
  three shipped without reaching this spec.
- **`contentEl` is documented, and its conflict with the shared element policy
  is recorded as unresolved.**
- **`dismissible` covers `Escape` as well as outside interaction.**
- **The styling hooks name the right elements.** `data-slot="content"` is the
  portaled reka content; the shell is `data-slot="content-body"`.
- **No automatic `aria-describedby`.** The content is `role="dialog"`; nothing
  wires a description onto the trigger.

### v1.0.0 rebuild

*Historical. This entry was written while the old API was still planned as a
deprecated alias; the aliases were dropped before `1.0.0` shipped.*

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
- **Motion on by default** via the shared popover motion CSS — an `80ms` fade,
  no scale; `transition="default"` is a no-op.
- **No class-injection props.** `popoverClass` is a no-op + warn; use the
  `data-slot` hooks.
- **`HoverCard` split out** onto reka `HoverCard` primitives; legacy hand-rolled
  timers deleted. `trigger="hover"` on `Popover` warns and points at
  `HoverCard`.
- **`Dropdown` intentionally not folded into `PopoverPanel`** — it keeps its own
  menu shell and its own copy of the instant fade.
