# Slider

A track with one or more handles for picking a number, or a range of numbers,
between a minimum and a maximum.

<ComponentPlayground name="Slider" />

## Examples

### Price range filter

A `v-model` with two numbers draws two handles, one for each end of the range.

<ComponentPreview name="Slider-Range" />

### Exposure adjustment

With a negative `min`, the filled part of the track starts at zero, so values
below and above zero look different.

<ComponentPreview name="Slider-NegativeValues" />

### Save when the handle is released

`value-commit` fires once when a drag ends. Save there instead of on every
change of `v-model`.

<ComponentPreview name="Slider-ValueCommit" />

## Behavior

### Value

The value is always an array of numbers: `[25]` for one handle, `[20, 80]` for
a range. Each number draws a handle. An empty or missing value shows one handle
at `min`, without updating the model.

`min` defaults to `0`, `max` to `100` and `step` to `1`.

### Negative values

When `min` is below zero and `max` is above it, the filled part of the track
runs from zero to the handle, in either direction. With a range, it runs
between the two handles as usual.

### Committed values

`update:modelValue` fires on every step of a drag. `value-commit` fires with
the final value once the drag ends. Each key press also changes the value in
one step, so it fires both events.

### Width

The slider fills the width of its container. A width class such as `w-64`
replaces that width.

### Label, description and error

`label` renders above the track and `description` below it. `error` renders
below the track and hides `description`. It takes a string, an array of
strings (one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

### Attributes

`class` and `style` go on the outer element: the wrapper when a label,
description or error shows, and the slider otherwise. `aria-*` attributes go
on every handle. Every other attribute and listener goes on the slider's root
element.

## Accessibility

Each handle has `role="slider"` and is in the tab order.

| Keys                                 | Action                          |
| ------------------------------------ | ------------------------------- |
| `ArrowLeft` `ArrowDown` / `ArrowRight` `ArrowUp`                    | Decrease / increase by `step`   |
| `Shift` + arrow, `PageDown` / `PageUp` | Decrease / increase by 10 steps |
| `Home` / `End`                       | Set the first handle to `min` / the last handle to `max` |

### Names

The name from `label` lands on each handle. A caller's `aria-labelledby` or
`aria-label` replaces it, so the visible label and the announced name can
differ. Use one or the other.

In a range, each handle adds its part to the name: "Price minimum" and "Price
maximum", or "Stops value 2 of 3" with more than two handles. A range with no
name uses "Minimum" and "Maximum".

### Required

The slider role does not allow `aria-required`, so `required` is announced
from the label instead, as hidden "(required)" text next to the asterisk. The
asterisk itself is hidden from screen readers.

This works only while the name comes from the rendered label. In these cases
you have to show or word the required state yourself:

- A caller `aria-label` or `aria-labelledby` replaces the label as the name,
  so the handle is announced without "(required)".
- A `#label` slot replaces the whole label, asterisk included. The slot
  receives `{ required }` for this.

### Other ARIA attributes

Any other `aria-*` you set is copied to every handle, so a range gets one
value for all of them. `aria-valuetext` on a range is announced the same at
both ends.

`aria-hidden` stays on the root instead, because it hides a whole subtree. It
also makes the slider `inert`. Without that, the handles would stay in the tab
order while screen readers could not see them.

## Migrating from v0

`Slider` no longer sets `aria-label="Volume"` on its own. Pass `label` so the
slider has a correct name. See the [migration guide](../migration#inputs).

<!-- @include: ./Slider.api.md -->
