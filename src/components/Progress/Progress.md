# Progress

A bar that shows how far a task has come, as a value from 0 to 100.

<ComponentPlayground name="Progress" />

## Examples

### File upload

`hint` shows the value as a percentage on the right of the label. The bar
updates each time `value` changes.

<ComponentPreview name="Progress-Animated" />

### Storage quota

A meter for how much of a quota is used. The numbers sit below the bar instead
of in the `#hint` slot, because "700 GB of 2 TB" says more than a percentage
and shares the row with an action.

<ComponentPreview name="Progress-Storage" />

### Onboarding checklist

The value comes from how many steps are done, so finishing a step moves the
bar.

<ComponentPreview name="Progress-Onboarding" />

### Multi-step form

`intervals` splits the bar into one segment per step. The `#hint` slot shows
"Step 2 of 3" in place of the percentage.

<ComponentPreview name="Progress-MultiStepForm" />

## Behavior

### Value

`value` is required and is a number from 0 to 100. A value below 0 shows an
empty bar, and a value above 100 shows a full bar.

### Label and hint

`label` shows on the left above the bar. `hint` shows the value followed by
`%` on the right. The `#hint` slot replaces that text with your own content,
and shows even when `hint` is not set.

### Steps

`intervals` sets the number of segments. The bar fills whole segments only:
the filled count is `value / 100 × intervals`, rounded to the nearest whole
number. Leave `intervals` out for a continuous bar.

## Accessibility

The bar has the `progressbar` role, with `aria-valuenow` set to the value
from 0 to 100. Screen readers read `label` as the value text, or the
percentage when there is no label.

<!-- @include: ./Progress.api.md -->
