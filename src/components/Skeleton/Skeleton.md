# Skeleton

A gray placeholder block that pulses while content loads. Put it where the
content will appear, then replace it with the real element when the data
arrives.

<ComponentPreview name="Skeleton-List" />

## Examples

### Article card

Blocks for a cover image, a title and two lines of text, sized like the card
they stand in for.

<ComponentPreview name="Skeleton-Card" />

### Paragraph

Lines of different widths read as text.

<ComponentPreview name="Skeleton-Text" />

## Behavior

### Size and shape

`Skeleton` takes no props. Set its size and shape with classes or inline
styles on the element, such as `class="h-5 w-48"` for a line of text or
`class="size-10 rounded-full"` for an avatar.

## Accessibility

Each block has `aria-hidden="true"`, so screen readers skip it. To announce
the loading state, mark the region that is loading with `aria-busy="true"` or
add a visually hidden status message.

<!-- @include: ./Skeleton.api.md -->
