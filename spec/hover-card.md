# HoverCard Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the exact public API for `HoverCard`. It is part of the
overlay/floating stabilization workstream listed in
[`v1-release/plan.md`](../v1-release/plan.md) and is the companion split-out of
the removed `Popover` `trigger="hover"` mode (issue #773, P8).

`HoverCard` is built directly on reka-ui's `HoverCard*` primitives and shares
the floating-panel shell + motion machinery with `Popover` via the shared
`PopoverPanel` shell and its co-located motion stylesheet.

## Role

`HoverCard` shows a non-interactive-to-open, sighted-only preview card when the
pointer rests on a trigger — author cards, link previews, mention hovercards,
metric explainers. It is **information on hover**, not an action surface.

Reach for a different component when:

- the surface holds focusable controls users must reach by keyboard, or must
  open on click/tap → use [`Popover`](../src/components/Popover/Popover.md).
- the surface is a short text label → use
  [`Tooltip`](../src/components/Tooltip/Tooltip.md).
- the surface is a menu of actions → use `Dropdown`.

Because it only opens on pointer hover/focus, `HoverCard` content must be
**supplementary** — never the only path to information or actions. Touch and
keyboard-only users will not reliably open it. This is the same contract reka
documents for HoverCard.

## Relationship to `Popover` `trigger="hover"`

`Popover` historically supported `trigger="hover"` with hand-rolled
`hoverDelay` / `leaveDelay` timers, measured in **seconds**. In v1 that timer
code is **deleted** and the hover affordance moves to this component.

- `trigger="hover"` was removed from `Popover` before `1.0.0` under
  [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md). There is no alias
  and no warning: Vue drops an unknown prop silently, so a `Popover` still
  passing `trigger="hover"` renders an ordinary click popover.
- `Popover`'s `trigger` prop now selects `click` or `manual`.
- `HoverCard`'s `hoverDelay` / `leaveDelay` map to reka's `openDelay` /
  `closeDelay` and are in **milliseconds**. A v0 `0.5` becomes `500`.

See [`popover.md`](./popover.md) and
[`migration.md`](../docs/content/docs/migration.md#popover-hovercard-tooltip)
for the full removal table.

## Decisions at a glance

| Decision | Direction |
|---|---|
| Primitive | reka `HoverCardRoot` / `HoverCardTrigger` / `HoverCardPortal` / `HoverCardContent` |
| Open trigger | Pointer hover + focus only — no click, no keyboard toggle (reka contract) |
| Delay units | **Milliseconds** (`hoverDelay` / `leaveDelay`), consistent with `Tooltip` and reka |
| Visibility model | `v-model:open` (canonical) |
| Positioning | `side` / `align` / `offset` / `collisionPadding` / `portalTo`, same vocabulary and defaults as `Popover` |
| Shell | Shared `PopoverPanel` — owns `data-slot="content-body"` + rounded/elevated/ring visuals only, no behavior |
| Motion | Shared `PopoverPanel` motion. One rhythm across the library — an `80ms` fade on open, nothing on close |
| Styling | No class-injection props. Stable `data-slot` / `data-state` / `data-motion` hooks only |
| Trigger slot | `#trigger` via reka `HoverCardTrigger as-child` — hover/focus wiring is automatic; there is no aria association |

## Exact public API for v1

### Types

The types live in `src/components/HoverCard/types.ts`, and `PopoverSide` /
`PopoverAlign` are imported from `Popover`'s types rather than redeclared. The
shape below is a summary.

```ts
type HoverCardSlotProps = {
  /** Whether the card is currently open. */
  open: boolean
  /** Sets the card open state. */
  setOpen: (value: boolean) => void
  /** Closes the card. */
  close: () => void
}

interface HoverCardProps {
  open?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  collisionPadding?: number
  portalTo?: PortalTarget
  /** Milliseconds from pointer-enter on the trigger until the card opens. */
  hoverDelay?: number
  /** Milliseconds from pointer-leave (trigger or content) until the card closes. */
  leaveDelay?: number
  /** Render a reka HoverCardArrow, styled to match the panel surface. */
  arrow?: boolean
}
```

Defaults (aligned with `Popover` for positioning, `Tooltip` for delays):

- `open = false`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `collisionPadding = 10`
- `portalTo` unset — the fallback when neither the prop nor an embedding
  host names a target is `body`. See [`portal-target.md`](./portal-target.md).
- `hoverDelay = 300`
- `leaveDelay = 300`
- `arrow = false`

Notes:

- `hoverDelay` / `leaveDelay` are in **milliseconds** and pass directly to
  reka's `openDelay` / `closeDelay`.
- `side` / `align` map to reka's `side` + `align` on `HoverCardContent`;
  `offset` maps to `side-offset`. Same split as `Popover` (and the
  `placement="bottom-start"` legacy mapping lives only on `Popover`).
- There is **no** `dismissible` / `matchTriggerWidth` prop — hover cards are not
  dismissed by outside-click (they close on pointer-leave) and do not size to
  the trigger. Add later in `1.x` only with a concrete use case.

### Emits

```ts
interface HoverCardEmits {
  'update:open': [value: boolean]
}
```

Canonical visibility event is `update:open` (drives `v-model:open`). There are
no behavior-named `@open` / `@close` emits — unlike `Popover`, no consumer binds
keyboard shortcuts on a hover card's open/close, so the surface stays minimal.

### Slots

| Slot | Scope | Purpose |
|---|---|---|
| `#trigger` | `{ open, setOpen, close }` | Rendered through reka `HoverCardTrigger as-child`. Hover and focus wiring is automatic. The slot must render a single element root (as-child contract). |
| `#default` | `{ open, setOpen, close }` | Card content, rendered inside the shared `PopoverPanel` shell. |

Slot rules:

- `#trigger` is required; without it there is nothing to hover.
- `#default` content should be read-only / supplementary. Focusable controls are
  technically renderable but discouraged (reka keeps the card open while the
  pointer is over it, but keyboard users cannot reliably reach it).
- Both slots receive the same `{ open, setOpen, close }` shape as `Popover` for symmetry,
  even though hover cards rarely need imperative control.

### Exposed

```ts
interface HoverCardExposed {
  open: () => void
  close: () => void
}
```

`HoverCard` exposes only these two. `Popover` also publishes `contentEl`; a
hover card has no caller needing the element, so it is not mirrored here.

## Accessibility and semantics

- **There is no automatic `aria-describedby`.** reka's `HoverCardTrigger`
  (2.9.9, `node_modules/reka-ui/src/HoverCard/HoverCardTrigger.vue`) adds
  `data-state` and the pointer/focus handlers and nothing else, and reka's own
  documentation says the card "is intended for sighted users only, the content
  will be inaccessible to keyboard users". Nothing links the trigger to the
  content for a screen reader. Do not describe this component as accessible by
  association.
- HoverCard is **sighted-pointer + focus** only. It is not keyboard-openable and
  is invisible to touch. Treat its content as progressive enhancement; never put
  primary information or the only copy of an action inside it.
- If the same information must reach every user, put it somewhere reachable and
  let the card be the shortcut.
- The trigger remains a normal interactive element (link/button) for its own
  click semantics; the hover card layers a preview on top without intercepting
  that interaction.
- Focusing the trigger via keyboard opens the card (reka behavior), so the
  preview is reachable for keyboard users tabbing through, but it cannot be
  toggled with Enter/Space.

## Motion

`HoverCard` reuses the shared popover motion machinery rather than a bespoke
animation. It uses the one rhythm every popup in the library uses: the card
appears instantly, with only a short fade to smooth the paint.

- open: `80ms` linear fade from `opacity: 0`. No scale, no translate
- close: no animation
- Content renders inside `PopoverPanel`, which carries
  `data-slot="content-body"` and `data-motion="instant"`
- `prefers-reduced-motion: reduce` disables the content animation (shared
  stylesheet forces `animation-duration: 0`)

Nothing in the library scales in. A panel appears at a fixed spot, so an
entrance only puts motion between the press and the content. `HoverCard` was the
last holdout, on the argument that a hover open is not on a latency path. That
is true, but it is not worth being the only surface with its own rhythm.

`PopoverPanel` owns the **shell only** (rounded-6, `bg-surface-elevation-2`,
shadow, ring + the `data-slot`/`data-state`/`data-motion` wiring). `HoverCard`
renders its own `HoverCardContent` and its own contents inside `PopoverPanel`.
It does not delegate behavior to the panel. This is the same DRY split applied
to `Popover` / `Select` / `Combobox` / pickers.

## Styling hooks

No class-injection props (`popoverClass` and friends do not exist on this
component). Stable hooks only:

- `data-slot="trigger"` on the trigger element
- `data-slot="content"` on the portaled reka `HoverCardContent`
- `data-slot="content-body"` on the `PopoverPanel` shell that owns the visuals
- `data-slot="arrow"` on the arrow, when `arrow` is set
- `data-state="open" | "closed"` (supplied by reka `HoverCardContent`)
- `data-motion="instant"` on the content-body

## Examples

```vue
<!-- Author card on hover -->
<HoverCard :hover-delay="400" side="top" align="start">
  <template #trigger>
    <a href="/u/jane" class="font-medium underline">Jane Doe</a>
  </template>
  <template #default>
    <div class="flex gap-3">
      <Avatar :image="jane.image" :label="jane.name" size="lg" />
      <div>
        <div class="text-base font-medium text-ink-gray-9">{{ jane.name }}</div>
        <div class="text-sm text-ink-gray-6">{{ jane.bio }}</div>
      </div>
    </div>
  </template>
</HoverCard>
```

```vue
<!-- Programmatic control via exposed handle -->
<HoverCard ref="card">
  <template #trigger><Button label="Details" /></template>
  <template #default="{ close }">
    <MetricExplainer @done="close" />
  </template>
</HoverCard>
```

## Migration path

### From `Popover` `trigger="hover"`

```vue
<!-- before — v0 Popover, removed in 1.0.0 -->
<Popover trigger="hover" :hover-delay="0.2" :leave-delay="0.5" placement="top-start">
  <template #target><a href="/u/jane">Jane Doe</a></template>
  <template #body><AuthorCard :user="jane" /></template>
</Popover>

<!-- after -->
<HoverCard :hover-delay="200" :leave-delay="500" side="top" align="start">
  <template #trigger><a href="/u/jane">Jane Doe</a></template>
  <template #default><AuthorCard :user="jane" /></template>
</HoverCard>
```

The delays change unit, so leaving `0.2` in place is silent: reka reads it as
0.2 milliseconds and the card opens instantly.

Mapping to apply by hand. There is no shim; the old props are gone.

| `Popover` v0 (removed hover mode) | `HoverCard` |
|---|---|
| `trigger="hover"` | (implicit — HoverCard only opens on hover) |
| `hoverDelay` (seconds) | `hoverDelay` (milliseconds; multiply by 1000) |
| `leaveDelay` (seconds) | `leaveDelay` (milliseconds; multiply by 1000) |
| `placement="top-start"` | `side="top"` + `align="start"` |
| `#target` | `#trigger` |
| `#body` / `#body-main` | `#default` |
| `show` / `v-model:show` | `v-model:open` |

## Out of scope for v1

Revisit in `1.x` only with a concrete use case:

- `dismissible` / outside-click behavior (hover cards close on pointer-leave).
- `matchTriggerWidth`.
- A shared open-delay group analogous to `TooltipProvider` / `TooltipGroup`.
- Mobile/touch open affordance (HoverCard is intentionally pointer/focus only).

## Changelog

### 2026-09-17

Spec corrections only. No runtime behavior changed.

- **Delays are milliseconds everywhere.** The prop comments said seconds and
  the examples passed `0.2` / `0.4` / `0.5`, which reka reads as fractions of a
  millisecond. They now read `200` / `400` / `500`.
- **The slot `open` is a boolean.** It was typed as a method. `setOpen` writes
  the state; `close()` is `setOpen(false)`.
- **`arrow` is documented.** It shipped while "Out of scope for v1" still
  listed an arrow as unavailable.
- **No automatic `aria-describedby`.** Neither the installed reka-ui (2.9.9)
  nor reka's documentation wires the content to the trigger. The old claim made
  the card sound more accessible than it is.
- **`trigger="hover"` on `Popover` is removed, not deprecated.** There is no
  shim; the migration table is a by-hand mapping.
