# Progress

Visually represents progress or completion of a task. Updates dynamically to
give users clear feedback on status.

## Playground

<ComponentPlayground name="Progress" />

## Animated

The continuous bar transitions its fill, so values arriving on a timer read as
one smooth movement rather than a series of jumps.

<ComponentPreview name="Progress-Animated" />

## Storage quota

A consumption meter. The numbers sit below the bar instead of in the `hint`
slot, because "700 GB of 2 TB" carries more than a percentage and shares the row
with an action.

<ComponentPreview name="Progress-Storage" />

## Onboarding checklist

The value is derived from how many steps are done, so finishing a step moves the
bar. Completing items is the most common source of a progress value.

<ComponentPreview name="Progress-Onboarding" />

## Multi-step form

`intervals` turns the bar into a step indicator — one segment per step, filled
up to the current one. This is what the interval variant is for.

<ComponentPreview name="Progress-MultiStepForm" />

## Sizes

<ComponentPreview name="Progress-Sizes" />

<!-- @include: ./Progress.api.md -->
