# Popover

A floating panel that opens from a trigger on click. For a panel that opens on
hover, such as a profile preview, use [`HoverCard`](./hovercard) instead.

<ComponentPreview name="Popover-FilterPanel" />

## Examples

### Workspace switcher

`match-trigger-width` makes the panel at least as wide as the trigger, so the
list lines up under the button.

<ComponentPreview name="Popover-WorkspaceSwitcher" />

### Set a status

`:dismissible="false"` keeps the panel open on an outside click, so a half-typed
status is not lost. `v-model:open` closes it from the Cancel and Save buttons.

<ComponentPreview name="Popover-StatusMessage" />

### Color picker

`bare` removes the panel's background, border, shadow and rounding, so the
content draws its own surface.

<ComponentPreview name="Popover-ColorPicker" />

### Field help

`side="right"` opens the panel beside the icon, and `arrow` points it back at
the icon.

<ComponentPreview name="Popover-FieldHelp" />

### Search suggestions

`trigger="manual"` and `:auto-focus="false"` let typing in the input open the
panel while the caret stays in the input.

<ComponentPreview name="Popover-Typeahead" />

## Behavior

### Trigger and content

Put the trigger in `#trigger` and the panel content in `#default`. A click on
the trigger opens and closes the panel. Both slots receive
`{ open, setOpen, close }`, where `close()` is the same as `setOpen(false)`.

### Open state

Bind `v-model:open` only when something outside the popover needs to open or
close it. The popover emits `open` when it opens and `close` when it closes.

### Position

`side` (`top`, `right`, `bottom`, `left`) picks the edge of the trigger the
panel opens on, and `align` (`start`, `center`, `end`) its position along that
edge. `offset` sets the gap in pixels. The panel flips and shifts to stay
inside the screen. `collisionPadding` sets the space it keeps from the screen
edge.

### Closing

The popover closes on a click outside it and on `Escape`. Set
`:dismissible="false"` to turn off both, for a panel with its own Save and
Cancel buttons.

### Reference element

The panel is placed against the trigger. Pass an element as `reference` to
place it against that element instead. Use it when the trigger is a labelled
field: pass the input row, and the panel opens under the input instead of
under the field's description. It works with both `trigger` values.

### Typing in the trigger

Two props stop a panel from getting in the way of the input that opens it.
`trigger="manual"` turns off the click toggle: a click on the input only places
the caret, and only `v-model:open` opens and closes the panel.
`:auto-focus="false"` keeps focus in the input when the panel opens.

### Attributes

`<Popover>` renders no element of its own, so a `class` or `style` on it goes
nowhere. Put them on the element inside `#trigger`.

## Accessibility

<kbd>Enter</kbd> or <kbd>Space</kbd> on a focused trigger opens and closes the
panel, and <kbd>Escape</kbd> closes it. The trigger gets `aria-expanded` and
`aria-controls`.

`trigger="manual"` removes `aria-expanded` and `aria-controls`. Add the
combobox pattern yourself, or use [`Combobox`](./combobox), which has it.

## Migrating from v0

`#target` is now `#trigger`, `#body` and `#body-main` are now `#default`, and
`placement` is now `side` and `align`. See the
[migration guide](../migration#popover-hovercard-tooltip) for the full table.

<!-- @include: ./Popover.api.md -->
