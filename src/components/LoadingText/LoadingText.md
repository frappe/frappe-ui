# LoadingText

A [Spinner](./spinner) with a label next to it, for inline loading states like
"Loading..." or "Saving...".

<ComponentPreview name="LoadingText-ActivityFeed" />

## Examples

### Save status

Swap `LoadingText` with a plain status line while a form saves. Click
**Save** to see it.

<ComponentPreview name="LoadingText-Autosave" />

## Behavior

### Text

`text` sets the label and defaults to `Loading...`. The text is 14px and uses
`text-ink-gray-4`, and the spinner beside it is 12px.

## Accessibility

The component has `role="status"`, so screen readers announce its text. The
spinner is hidden from them, so the text isn't read twice.

<!-- @include: ./LoadingText.api.md -->
