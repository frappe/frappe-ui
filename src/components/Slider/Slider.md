# Slider

A slider input for selecting a single value or a range of values within a
minimum and maximum.

## Playground

<ComponentPlayground name="Slider" />

<ComponentPreview name="Slider-Default" layout="stacked" />

## Sizes

<ComponentPreview name="Slider-Sizes" />

## Range

Use a two-element `modelValue` to render two thumbs.

<ComponentPreview name="Slider-Range" />

## Negative Values

When `min` is negative the slider fills bidirectionally from the zero-crossing,
so positive and negative values are visually distinct.

<ComponentPreview name="Slider-NegativeValues" />

## Labeling

<ComponentPreview name="Slider-Labeling" />

The accessible name lands on the thumb, which is the element carrying
`role="slider"`. A caller's `aria-labelledby` or `aria-label` overrides the name
derived from `label`, so the visible label and the announced name can differ.
Use one or the other.

`required` is the one exception to that routing. The ARIA role table does not
list `aria-required` for `slider`, so setting it fails the `aria-allowed-attr`
audit rule and screen readers ignore it. The state is announced from inside the
label instead, as `sr-only` text next to the asterisk. The asterisk itself is
`aria-hidden`, and `data-required` is a styling hook.

That has a consequence: `required` is announced only while the name comes from
the rendered label. A caller `aria-label` or `aria-labelledby` replaces it as
the name, so the thumb then announces the name without "(required)". A `#label`
slot replaces the whole label body, asterisk included, so nothing renders it at
all — the slot receives `{ required }` for that. In each of the three cases,
render or word the required state yourself.

A range renders one thumb per value. When a name is set, each thumb is qualified
with it ("Price minimum", "Price maximum", or "Stops value 2 of 3" past two
thumbs) so the endpoints are told apart. An unnamed range keeps the plain
"Minimum"/"Maximum" names.

Any other `aria-*` you set is copied to every thumb, so a range gets one shared
value for all of them. `aria-valuetext` on a range is announced identically at
both endpoints. `aria-hidden` is the exception and stays on the root, because it
hides a subtree rather than describing the control. It also makes the control
`inert`: the thumbs stay in the tab order otherwise, which puts keyboard focus
inside a subtree a screen reader cannot see.

## value-commit

`value-commit` fires once when the user finishes dragging the slider — useful
for triggering side effects only at drag end, not on every step.

<ComponentPreview name="Slider-ValueCommit" />

## States

<ComponentPreview name="Slider-States" />

<!-- @include: ./Slider.api.md -->
