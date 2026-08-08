# Tooltip

A small label that describes its trigger, shown on hover or keyboard focus.
Built on [reka-ui](https://reka-ui.com/)'s `Tooltip` primitives, so focus,
dismissal and aria wiring come for free.

## Playground

<ComponentPlayground name="Tooltip" />

## Default

Pass the label as `text` and wrap the trigger in the default slot.

<ComponentPreview name="Tooltip-Examples" />

## Side and offset

`side` (`top` / `right` / `bottom` / `left`) picks which edge of the trigger the
tooltip sits on; `offset` sets the gap in px. Both match `Popover` and
`HoverCard`. The tooltip flips automatically to stay inside the viewport.

## Slots

`#default` is the **trigger** — Tooltip is the one overlay that reads this way,
because `<Tooltip text="Delete"><Button /></Tooltip>` is the shape almost every
call site wants.

`#content` is the tooltip's content, for anything richer than a string. It
renders inside the standard bubble, so you inherit the surface rather than
rebuilding it. Add `bare` when the content brings its own surface — an image
preview, say. The arrow renders either way.

<ComponentPreview name="Tooltip-Slots" />

## Grouping (shared hover delay)

Wrap a group of buttons in a `TooltipProvider` so that once one tooltip is open,
moving the pointer to a neighbouring trigger within `skip-delay` opens its
tooltip instantly — no delay between adjacent buttons. `Tooltip` and
tooltip-bearing `Button`s automatically reuse a surrounding provider instead of
creating their own.

<ComponentPreview name="Tooltip-Group" />

## Styling

There are no class-injection props. Style the tooltip through the stable
`data-slot` hooks:

| Hook                    | Element                                      |
| ----------------------- | -------------------------------------------- |
| `[data-slot="content"]` | the portaled content (reka `TooltipContent`) |
| `[data-slot="bubble"]`  | the default bubble that owns the visuals (absent under `bare`) |
| `[data-slot="arrow"]`   | the arrow pointing back at the trigger       |

```css
:where([data-slot='bubble']) {
  /* your overrides */
}
```

## Notes

- Set `disabled` to suppress the tooltip while still rendering the trigger.
  Useful when the label only applies in some states.
- A tooltip labels its trigger — it is not a place for interactive content.
  For a panel you can click into, use [`HoverCard`](./hovercard).

## Migrating from v0

`placement` is now `side`, and `arrowClass` is gone — style the arrow through
`[data-slot="arrow"]`, or use `offset` if you were using it to nudge the
tooltip's position.

`#body` is now `#content`, and it renders inside the bubble. Most `#body` call
sites hand-copied the bubble's own classes to get them back, so the move usually
means deleting that wrapper:

```vue
<!-- before -->
<Tooltip>
  <template #body>
    <div class="rounded bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl">
      <span>Hide password</span>
    </div>
  </template>
  <Button icon="eye" />
</Tooltip>

<!-- after -->
<Tooltip>
  <template #content>
    <span>Hide password</span>
  </template>
  <Button icon="eye" />
</Tooltip>
```

If the content genuinely brings its own surface, keep it and add `bare`.

<!-- @include: ./Tooltip.api.md -->
