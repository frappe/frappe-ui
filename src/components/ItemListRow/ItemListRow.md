# ItemListRow

A single row of a menu or list, with a prefix, a label and a suffix. It is the
row that `Dropdown`, `Select`, `Combobox` and `MultiSelect` render, so use it
to build a custom menu that matches them.

<ComponentPreview name="ItemListRow-StatusMenu" />

## Behavior

### Slots

The default slot holds the label. `#label` replaces the default slot when you
pass both. `#prefix` and `#suffix` render only when they have content, so an
empty slot leaves no gap.

### Active and selected

`active` marks the row the pointer or keyboard is on. `selected` marks the
chosen value. Both give the row the same highlight. The row does not track
either state: set them from your own state, as the status menu does on
`mouseenter` and `click`.

### Disabled

`disabled` mutes the row and shows a not-allowed cursor. It does not stop
clicks or set the `disabled` attribute on the element, so skip the action in
your handler.

### Size

`size` is `xs`, `sm` (default), `md` or `lg`: rows at least 24, 28, 32 and 40px
tall. These match the input sizes, so a menu lines up with the trigger above
it.

### Element

The row renders a `div`. `as` sets another tag or a component, such as
`as="button"` or `as="a"`. Other attributes, such as `type`, `href` or
`role`, land on that element.

## Accessibility

The row sets no role. Add the roles your menu needs, such as `role="option"`
and `aria-selected` inside a `role="listbox"` container.

<!-- @include: ./ItemListRow.api.md -->
