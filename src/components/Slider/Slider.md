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

A range renders one thumb per value. When a name is set, each thumb is qualified
with it ("Price minimum", "Price maximum", or "Stops value 2 of 3" past two
thumbs) so the endpoints are told apart. An unnamed range keeps the plain
"Minimum"/"Maximum" names.

## value-commit

`value-commit` fires once when the user finishes dragging the slider — useful
for triggering side effects only at drag end, not on every step.

<ComponentPreview name="Slider-ValueCommit" />

## States

<ComponentPreview name="Slider-States" />

<!-- @include: ./Slider.api.md -->
