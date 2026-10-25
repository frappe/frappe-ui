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

The spinner has `role="status"` and the label "Loading". The text beside it is
plain text.

<!-- @include: ./LoadingText.api.md -->
