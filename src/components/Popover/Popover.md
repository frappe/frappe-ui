# Popover

Shows content in a floating panel anchored to a trigger, portaled out of the
page flow so it never disturbs the layout. Built on
[reka-ui](https://reka-ui.com/)'s `Popover` primitives, so click, keyboard, and
aria wiring come for free.

## Basic

`#trigger` is rendered through reka's `PopoverTrigger` as-child — clicking it
(or pressing <kbd>Enter</kbd> / <kbd>Space</kbd> while focused) toggles the
panel. `#default` renders inside the standard shell. Both slots receive `open`
and `close` helpers.

<ComponentPreview name="Popover-Click" />

## Side and alignment

Use `side` (`top` / `right` / `bottom` / `left`) and `align` (`start` / `center`
/ `end`) to position the panel. The panel flips and shifts automatically to stay
within the viewport (`collisionPadding` controls the gap kept from the edge).

<ComponentPreview name="Popover-SideAlign" />

## Controlled open state

Bind `v-model:open` to drive the panel from outside, or read it to react to open
/ close. The component also exposes `open()` and `close()` methods via a
template ref, and emits `open` / `close` events.

<ComponentPreview name="Popover-Controlled" />

## Non-dismissible

By default the popover closes on an outside click or focus. Set
`:dismissible="false"` to keep it open until you close it explicitly — useful
for panels with their own confirm / cancel actions.

<ComponentPreview name="Popover-Dismissible" />

## Match trigger width

Set `match-trigger-width` to make the panel's `min-width` match the trigger.
Handy for select-style menus where the panel should line up under a wide button.

<ComponentPreview name="Popover-MatchTriggerWidth" />

## Bare

Set `bare` to drop the panel shell (background, border, shadow, rounding) so
`#default` content can bring its own surface — useful for pickers and cards that
are already styled. This replaces the deprecated `#body` slot.

<ComponentPreview name="Popover-Bare" />

## Arrow

Set `arrow` to render a small arrow that points back at the trigger. It's styled
to match the panel surface.

<ComponentPreview name="Popover-Arrow" />

## Styling

The popover ships with its panel shell baked in
(`rounded-lg bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5`)
— there are no class-injection props. Style it through the stable `data-slot`
hooks instead:

| Hook                         | Element                                      |
| ---------------------------- | -------------------------------------------- |
| `[data-slot="trigger"]`      | the trigger wrapper                          |
| `[data-slot="content"]`      | the portaled content (reka `PopoverContent`) |
| `[data-slot="content-body"]` | the panel shell that owns the visuals        |

Open / closed and motion phase are reflected as `data-state="open" \| "closed"`
and `data-motion="animated" \| "instant"` for state-driven styling.

```css
:where([data-slot='content-body']) {
  /* your overrides */
}
```

## Motion

The panel animates by default — a scale-from-trigger entrance (180ms in / 140ms
out). Opening via the keyboard skips the animation (`data-motion="instant"`),
and `prefers-reduced-motion` is respected. No configuration is required.

## Notes

- Use `#trigger` + `#default` for the standard click popover. Both slots get
  `{ open, close }`.
- Reach for `v-model:open` only when an external control needs to drive the
  panel — clicking the trigger already toggles it.
- For a panel that opens on hover (profile previews, link previews), use the
  dedicated [`HoverCard`](./hovercard) component instead of a popover.

## Migrating from v0

The v0 API still works through v1.x — old props are mapped silently, and binding
both the old and new prop logs a one-time dev warning. See the full mapping table
in [Migration from v0 → Popover / HoverCard](../migration#popover-hovercard).

<!-- @include: ./Popover.api.md -->
