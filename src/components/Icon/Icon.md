# Icon

Renders one icon from a `lucide-*` name, an emoji, or a Vue component. Most
components take an `icon` prop and render it for you, so use `Icon` only for
an icon outside those props.

<ComponentPreview name="Icon-Lucide" />

## Examples

### Space list

Each space stores its icon as a string, and people can pick a lucide icon or an
emoji. `Icon` renders either one from the same `icon` prop.

<ComponentPreview name="Icon-Spaces" />

### Custom SVG

Pass any Vue component as `icon` to render an icon that lucide does not have,
such as a product logo.

<ComponentPreview name="Icon-ComponentIcon" />

## Behavior

### Icon sources

`icon` accepts three forms:

- A `lucide-*` string renders a `<span>` with that icon class.
- A string with no letters or digits, such as an emoji or a symbol, renders
  as text.
- A Vue component renders through `<component :is>`.

Any other string, such as a bare name like `"plus"`, renders nothing and logs
a warning in development. `null`, `undefined` and an empty string also render
nothing.

### `icon` and `name`

`name` accepts the same values as `icon`. When both are set, `icon` wins. An
explicit `icon=""` or `:icon="null"` renders nothing, while
`:icon="undefined"` falls back to `name`.

### Size and color

`Icon` has no size or color props. Set them with classes, such as
`class="size-4 text-ink-gray-6"`. A lucide icon takes the text color. Class,
style and other attributes land on the rendered element.

## Accessibility

Every icon renders with `aria-hidden="true"`, so screen readers skip it. When
an icon is the only content of a button or link, give that element an
`aria-label`.

<!-- @include: ./Icon.api.md -->
