# HoverCard Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the exact public API for `HoverCard`. It is part of the
overlay/floating stabilization workstream listed in
[`v1-release/plan.md`](../v1-release/plan.md) and is the companion split-out of
the deprecated `Popover` `trigger="hover"` mode (issue #773, P8).

`HoverCard` is built directly on reka-ui's `HoverCard*` primitives and shares
the floating-panel shell + motion machinery with `Popover` via the shared
`PopoverPanel` shell and the `[data-selection]`-gated popover motion stylesheet.

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
`hoverDelay` / `leaveDelay` timers (seconds; defaults `hoverDelay: 0`,
`leaveDelay: 0.5`). In v1 that hand-rolled timer code is **deleted** and the
hover affordance moves to this component.

- `Popover` keeps `trigger="hover"` working through `v1.x` for back-compat, but
  emits a **one-time** dev-mode `warnDeprecated` pointing at `HoverCard`.
- The deprecated path maps `hoverDelay` → `openDelay` and `leaveDelay` →
  `closeDelay` (both stay in seconds — see the mapping table below). No behavior
  change for existing callers in `v1.x`.
- New code uses `<HoverCard>` directly.

See the `Popover` spec ("Deprecations") for the full Popover back-compat table.

## Decisions at a glance

| Decision | Direction |
|---|---|
| Primitive | reka `HoverCardRoot` / `HoverCardTrigger` / `HoverCardPortal` / `HoverCardContent` |
| Open trigger | Pointer hover + focus only — no click, no keyboard toggle (reka contract) |
| Delay units | **Seconds** (`hoverDelay` / `leaveDelay`), consistent with `Tooltip`. Converted to reka's ms `openDelay` / `closeDelay` internally |
| Visibility model | `v-model:open` (canonical) |
| Positioning | `side` / `align` / `offset` / `collisionPadding` / `portalTo`, same vocabulary and defaults as `Popover` |
| Shell | Shared `PopoverPanel` — owns `data-slot="content"` + rounded/elevated/ring visuals only, no behavior |
| Motion | Shared popover motion (`[data-selection]` stylesheet + `usePopoverMotion`). Hover opens are pointer-driven → `animated` |
| Styling | No class-injection props. Stable `data-slot` / `data-state` / `data-motion` hooks only |
| Trigger slot | `#trigger` via reka `HoverCardTrigger as-child` — aria + hover/focus wiring is automatic |

## Exact public API for v1

### Types

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

type HoverCardSlotProps = {
  /** Imperatively open the card. */
  open: () => void
  /** Imperatively close the card. */
  close: () => void
}

interface HoverCardProps {
  open?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  collisionPadding?: number
  portalTo?: string | HTMLElement
  /** Seconds from pointer-enter on the trigger until the card opens. */
  hoverDelay?: number
  /** Seconds from pointer-leave (trigger or content) until the card closes. */
  leaveDelay?: number
}
```

Defaults (aligned with `Popover` for positioning, `Tooltip` for delays):

- `open = false`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `collisionPadding = 10`
- `portalTo = 'body'`
- `hoverDelay = 0.5`
- `leaveDelay = 0.3`

Notes:

- `hoverDelay` / `leaveDelay` are in **seconds** and multiplied by `1000` for
  reka's `openDelay` / `closeDelay` (which are ms), matching how `Tooltip`
  converts `hoverDelay`.
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
| `#trigger` | `{ open, close }` | Rendered through reka `HoverCardTrigger as-child`. Hover/focus + `aria-describedby` wiring is automatic. The slot must render a single element root (as-child contract). |
| `#default` | `{ open, close }` | Card content, rendered inside the shared `PopoverPanel` shell. |

Slot rules:

- `#trigger` is required; without it there is nothing to hover.
- `#default` content should be read-only / supplementary. Focusable controls are
  technically renderable but discouraged (reka keeps the card open while the
  pointer is over it, but keyboard users cannot reliably reach it).
- Both slots receive the same `{ open, close }` shape as `Popover` for symmetry,
  even though hover cards rarely need imperative control.

### Exposed

```ts
defineExpose({
  open: () => void,
  close: () => void,
})
```

Mirrors `Popover`'s exposed surface.

## Accessibility and semantics

- Trigger and content use reka's HoverCard a11y: the content is associated with
  the trigger via `aria-describedby` (reka wires this on the trigger when the
  card is open). Do not hand-roll aria — let the primitive own it.
- HoverCard is **sighted-pointer + focus** only. It is not keyboard-openable and
  is invisible to touch. Treat its content as progressive enhancement; never put
  primary information or the only copy of an action inside it.
- The trigger remains a normal interactive element (link/button) for its own
  click semantics; the hover card layers a preview on top without intercepting
  that interaction.
- Focusing the trigger via keyboard opens the card (reka behavior), so the
  preview is reachable for keyboard users tabbing through, but it cannot be
  toggled with Enter/Space.

## Motion

`HoverCard` reuses the shared popover motion machinery rather than a bespoke
animation:

- Content renders inside `PopoverPanel`, which carries `data-slot="content"` +
  `data-selection` and the inner `data-slot="content-body"` with
  `:data-motion="motion"` from `usePopoverMotion`.
- Hover/focus opens are pointer-recency driven and therefore classify as
  `animated`: enter `180ms` / exit `140ms` with `cubic-bezier(0.23, 1, 0.32, 1)`,
  scaling in from the trigger via
  `transform-origin: var(--reka-hover-card-content-transform-origin)` on the
  content-body. (HoverCard owns its own transform-origin var, the same way
  Popover uses `--reka-popover-...` and Select uses `--reka-select-...`.)
- The `instant` (~80ms opacity fade, no scale/translate) path still exists for
  any non-pointer open (e.g. a programmatic `v-model:open` flip), inherited from
  the shared stylesheet — no extra wiring.
- `prefers-reduced-motion: reduce` disables the content animation (shared
  stylesheet forces `animation-duration: 0`).

`PopoverPanel` owns the **shell only** (rounded-lg, `bg-surface-elevation-2`,
shadow, ring + the `data-slot`/`data-state`/`data-motion` wiring). `HoverCard`
renders its own `HoverCardContent` and its own contents inside `PopoverPanel`;
it does not delegate behavior to the panel. This is the same DRY split applied
to `Popover` / `Select` / `Combobox` / pickers.

## Styling hooks

No class-injection props (`popoverClass` and friends do not exist on this
component). Stable hooks only:

- `data-slot="trigger"` on the trigger element
- `data-slot="content"` on the positioned content (from `PopoverPanel`)
- `data-slot="content-body"` on the animated inner shell
- `data-state="open" | "closed"` (supplied by reka `HoverCardContent`)
- `data-motion="animated" | "instant"` on the content-body

## Examples

```vue
<!-- Author card on hover -->
<HoverCard :hover-delay="0.4" side="top" align="start">
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
<!-- before — deprecated, warns once -->
<Popover trigger="hover" :hover-delay="0.2" :leave-delay="0.5" placement="top-start">
  <template #target><a href="/u/jane">Jane Doe</a></template>
  <template #body><AuthorCard :user="jane" /></template>
</Popover>

<!-- after -->
<HoverCard :hover-delay="0.2" :leave-delay="0.5" side="top" align="start">
  <template #trigger><a href="/u/jane">Jane Doe</a></template>
  <template #default><AuthorCard :user="jane" /></template>
</HoverCard>
```

Mapping applied by the migration (and by `Popover`'s `v1.x` back-compat shim
internally):

| `Popover` (deprecated hover) | `HoverCard` |
|---|---|
| `trigger="hover"` | (implicit — HoverCard only opens on hover) |
| `hoverDelay` (seconds) | `hoverDelay` (seconds) |
| `leaveDelay` (seconds) | `leaveDelay` (seconds) |
| `placement="top-start"` | `side="top"` + `align="start"` |
| `#target` | `#trigger` |
| `#body` / `#body-main` | `#default` |
| `show` / `v-model:show` | `v-model:open` |

## Out of scope for v1

Revisit in `1.x` only with a concrete use case:

- `dismissible` / outside-click behavior (hover cards close on pointer-leave).
- `matchTriggerWidth`.
- An arrow element (reka `HoverCardArrow` is available; not exposed yet).
- A shared open-delay group analogous to `TooltipProvider` / `TooltipGroup`.
- Mobile/touch open affordance (HoverCard is intentionally pointer/focus only).
