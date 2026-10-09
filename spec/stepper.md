# Stepper Spec

This document defines the public API for `Stepper`, a new atom that shows where a
person or a process is in an ordered sequence of steps.

## Role

`Stepper` shows progress through steps that happen in order: a setup wizard, an
onboarding flow, or a long-running job made of stages.

It should support:

- one current step, with every earlier step done and every later one upcoming
- a running current step (`loading`) and a failed current step (`failed`)
- skipped steps, which the flow has passed without doing
- one level of sub-steps under a step, for jobs whose stages have parts
- a vertical list and a horizontal segmented bar
- going back to a finished step by clicking it, when the caller allows it

Important boundary:

- `Stepper` only shows progress. It does not render the content of a step,
  and it is not a navigation control like `Tabs`. The caller renders the
  current step's content and moves `v-model` forward.
- if the only thing to show is "how far", with no step names, use `Progress`.

## Props

```ts
type StepValue = string | number
type StepState = 'complete' | 'current' | 'upcoming' | 'failed' | 'skipped'

interface StepItem {
  /** Unique across the whole tree, sub-steps included. */
  value: StepValue
  label: string
  /** Second line under the label. */
  description?: string
  /** Trailing text, such as a duration. */
  meta?: string
  /** The flow passed this step without doing it. */
  skipped?: boolean
  /** One level of sub-steps. Deeper nesting is ignored. */
  children?: StepItem[]
}

interface StepperProps {
  steps: StepItem[]
  /** Value of the current step; may be a sub-step's value. */
  modelValue?: StepValue | null
  /** Every step is done. Wins over modelValue. */
  completed?: boolean
  /** The current step is running: its indicator's outline spins. */
  loading?: boolean
  /** The current step failed. */
  failed?: boolean
  vertical?: boolean
  /** Vertical only: the side the indicators sit on. */
  edge?: 'start' | 'end'
  size?: 'sm' | 'md'
  /** Vertical only: show sub-steps for every step, or only the current one. */
  substeps?: 'all' | 'current'
  /** Finished steps become buttons that set v-model. */
  clickable?: boolean
}
```

Defaults: `vertical = false`, `edge = 'start'`, `size = 'md'`,
`substeps = 'all'`, every boolean `false`.

`vertical` and `edge` reuse the `Tabs` vocabulary (spec/tabs.md). `steps` is
structured data the component renders, which P3 allows.

### Why no `status` on a step

Every state except `skipped` follows from one value, so the caller holds one
`v-model` instead of keeping a status on every item in sync. `skipped` is the
one state the position cannot tell, so it is a flag on the item. `loading` and
`failed` describe the current step, so they live on the root. `status` is also
one of the names CONTEXT.md lists to avoid.

## State

Each step's state comes from its position relative to the current step:

- before the current step: `complete`
- the current step: `current`, or `failed` when `failed` is set
- after the current step: `upcoming`
- `skipped: true` and before the current step: `skipped`; after it: `upcoming`
- `completed`: every step is `complete`, or `skipped` when flagged
- `modelValue` empty or matching no step: every step is `upcoming`

A step with sub-steps takes its state from them: `complete` when every
sub-step is done or skipped, `current` (or `failed`) when it holds the current
sub-step, otherwise `upcoming`. The current value should name a sub-step, not
its parent; naming the parent makes its first sub-step current.

Order is depth-first: a step, then its sub-steps, then the next step.

## Rendering

### Indicators

Every indicator is a lucide outline icon, never filled:

| State | Icon | Number |
| --- | --- | --- |
| `upcoming` | `lucide-circle` | step number |
| `current` | `lucide-circle` | step number |
| `current` + `loading` | `lucide-circle`, a short arc travels round the outline | step number |
| `complete` | `lucide-circle-check` | none |
| `failed` | `lucide-circle-alert`, `ink-red-7` | none |
| `skipped` | `lucide-circle-minus` | none |

Sub-steps carry no number. A current sub-step that is not loading shows
`lucide-circle-dot`. The number is the step's position among top-level steps,
starting at 1.

The running arc keeps the icon still and spins only the paint inside its mask,
the same technique `Spinner` uses, so the circle never wobbles. It stops under
`prefers-reduced-motion`.

### Vertical

An ordered list. A line joins the indicators; the part after a `complete` or
`skipped` step is `surface-gray-10`, the rest `outline-gray-2`. Sub-steps have
their own smaller line inside their parent's row.

### Horizontal

The stock `Progress` with `intervals` set to the number of top-level steps,
used as it ships. An interval fills once its step is `complete` or `skipped`.
Labels sit under the intervals in a matching grid. Sub-steps are not shown.

## Slots

Scoped by the unit, per P6. Each receives `{ item, index, state }`, where
`index` is the position among its siblings (P7).

- `#step-prefix` replaces the indicator
- `#step-label` replaces the label
- `#step-description` replaces the description
- `#step-suffix` replaces the meta text

## Events

- `update:modelValue(value)` when a finished step is clicked (`clickable`).

## Template ref

None. `v-model` is the only way to move the stepper, and no verb in
spec/imperative-api.md applies.

## Styling hooks (P10)

- root: `data-slot="stepper"`, `data-orientation="horizontal|vertical"`,
  `data-size`, `data-edge` (vertical), `data-loading` when loading
- each step and sub-step: `data-slot="step"`, `data-state="<StepState>"`
- indicator: `data-slot="step-indicator"`, `data-state`

## Accessibility

- The root is an `<ol>`, each step an `<li>`, sub-steps a nested `<ol>`.
- The current step has `aria-current="step"`.
- Each indicator has a visually hidden state word ("completed", "current",
  "running", "failed", "skipped", "not started") so the list reads without
  the icons.
- With `clickable`, finished steps render a `<button>` that is reachable by
  Tab, activates with Enter and Space, and shows the library's focus ring on
  keyboard focus. Other steps are not focusable.
- Motion respects `prefers-reduced-motion`.
