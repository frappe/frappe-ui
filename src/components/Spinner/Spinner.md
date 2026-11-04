# Spinner

Shows that something is loading, with no known end. For a spinner with a text
label, use [LoadingText](./loadingtext).

<ComponentPlayground name="Spinner" />

## Examples

### Sync status

A spinner without `theme` takes the text color, so it matches the status line
it sits in. `track` draws a faint full circle behind the arc.

<ComponentPreview name="Spinner-SyncStatus" />

### Loading more rows

A `gray` spinner at the foot of a list while the next page loads.

<ComponentPreview name="Spinner-LoadMore" />

### Loading buttons

`Button` has a `loading` prop that shows a spinner sized to the button, so you
do not place a `Spinner` in a button yourself. `loadingText` replaces the
label while it loads.

<ComponentPreview name="Spinner-InContext" />

## Usage Guidelines

<ComponentPreview name="Spinner-Guidelines" hide-code />

<div class="guideline-text">

- Use a Skeleton, not a spinner, while page content loads.
- Keep the label while a button loads. Don't collapse it to an icon.

</div>

## Behavior

### Size

`size` is `xs`, `sm`, `md` or `lg`: 12, 14, 16 and 20px across. Leave `size`
out to size the spinner with a class such as `size-8`. It is 16px when nothing
sets a size, and the ring thickness stays in proportion at any size.

### Color

`theme="gray"` and `theme="red"` set a fixed color. Leave `theme` out to use
the current text color, which you can set with a `text-ink-*` class on the
spinner or a parent.

## Accessibility

The spinner has `role="status"` and announces `label`, "Loading" by default.
Pass a translated string in a translated app, or say what's loading, like
`label="Syncing"`. When visible text next to the spinner already says it, pass
`label=""` to hide the spinner from screen readers so it isn't read twice.

<!-- @include: ./Spinner.api.md -->
