# Stepper

Shows where a person or a process is in an ordered sequence of steps.

<ComponentPlayground name="Stepper" />

## Examples

### Setup wizard

`clickable` turns finished steps into buttons, so a person can go back. A step
marked `skipped` shows as passed, without a check.

<ComponentPreview name="Stepper-Wizard" />

### Plain

`vertical` with nothing else: the step number sits inside every step that is not
finished yet.

<ComponentPreview name="Stepper-Plain" />

### Run progress with sub-steps

A step with `children` gets its own line of sub-steps. `loading` spins the
outline of the current step's circle; `failed` marks it failed. `edge="end"`
puts the indicators after the labels.

<ComponentPreview name="Stepper-RunProgress" />

### Compact

`size="sm"` for a sidebar or a run log. `meta` shows trailing text such as a
duration.

<ComponentPreview name="Stepper-Compact" />

### Segmented

Without `vertical`, the stepper is the stock `Progress` with one interval per
step, and the labels underneath. Sub-steps are not shown.

<ComponentPreview name="Stepper-Segmented" />

## Behavior

### Current step

`v-model` holds the current step's value, which can be a sub-step's value. Every
step before it shows as done and every step after it as upcoming. An empty
value, or one that matches no step, shows every step as upcoming. `completed`
shows every step as done.

A step with sub-steps follows them: done once every sub-step is done or skipped,
current while it holds the current sub-step. Naming the parent itself makes its
first sub-step current.

### Skipped steps

Set `skipped` on a step the flow passed without doing. It shows as skipped once
the current step is past it, and as upcoming before that. The line through a
skipped step fills like a finished one.

### Running and failed

`loading` and `failed` describe the current step. `loading` keeps the circle and
its number still and moves a short arc around the outline. It stops under
reduced motion.

### Going back

With `clickable`, finished and skipped steps are buttons. Clicking one emits
`update:modelValue` with its value. While `completed` is set, no step is a
button, because `completed` overrides the value a click would set. The stepper
never moves on its own: the caller decides what the next step is.

## Accessibility

The steps are an ordered list, and sub-steps a nested list. The current step has
`aria-current="step"`. Each indicator carries a hidden word for its state
("completed", "running", "skipped", …), so the list reads without the icons.
With `clickable`, finished steps are buttons you can reach with Tab and press
with Enter or Space.

<!-- @include: ./Stepper.api.md -->
