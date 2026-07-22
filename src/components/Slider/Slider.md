# Slider

A slider input for selecting a single value or a range of values within a minimum and maximum.

## Playground

<ComponentPlayground name="Slider" />

<ComponentPreview name="Slider-Default" layout="stacked" />

## Sizes

<ComponentPreview name="Slider-Sizes" />

## Range

Use a two-element `modelValue` to render two thumbs.

<ComponentPreview name="Slider-Range" />

## Negative Values

When `min` is negative the slider fills bidirectionally from the zero-crossing, so positive and negative values are visually distinct.

<ComponentPreview name="Slider-NegativeValues" />

## Labeling

<ComponentPreview name="Slider-Labeling" />

## value-commit

`value-commit` fires once when the user finishes dragging the slider —
useful for triggering side effects only at drag end, not on every step.

<ComponentPreview name="Slider-ValueCommit" />

## States

<ComponentPreview name="Slider-States" />

<!-- @include: ./Slider.api.md -->
