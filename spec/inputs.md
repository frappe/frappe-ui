# Input Components API Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the v1 API direction for the input-family components:

- `TextInput`
- `Textarea`
- `Password`
- `Checkbox`
- `Switch`
- `Rating`
- `Slider`
- `ErrorMessage`

`FileUploader` is intentionally out of scope for this spec; it will be
covered separately.

It also covers the v1 stance on `Input.vue`, which this document originally
treated as a warn-and-keep deprecation (see the superseded note below).

> **Superseded on the `Autocomplete` question.**
> [#869](https://github.com/frappe/frappe-ui/issues/869) decided `Autocomplete`
> and the `FormControl type='autocomplete'` route are **deleted before the tag**
> rather than warned through `1.x`, on ADR-0008. Everything this document says
> about warning-and-keeping the two is history, kept for the audit data behind
> it. What shipped is in
> [`migration.md`](../docs/content/docs/migration.md#autocomplete-removed).
>
> **Superseded on `Input.vue` and the ref surface, too.**
> [#874](https://github.com/frappe/frappe-ui/issues/874) applied the same
> ADR-0008 logic to `Input.vue` and to `Password.value`: both are **removed**
> rather than warned, since a census found no live call sites for either. The
> same PR implements ADR-0012 — `TextInput`/`Textarea`/`Password`'s `.el` ref
> becomes `.inputElement` (typed, read-only) plus a `focus(options?)` method.
> What shipped is in
> [`migration.md`](../docs/content/docs/migration.md#inputs).
>
> **Superseded on deprecated aliases and the size scale.** ADR-0008 applies to
> the whole input family, so `1.0.0` ships no `@deprecated` input members.
> `Rating.rating_from`, `Rating.readonly`, `Switch.labelClasses`, the `Switch`
> `change` emit, and `Checkbox.padding` are **removed**, not warned;
> `Checkbox.padding` is replaced by `padded`. `size="xl"` is removed from the
> text-input scale and `xs` is added. Everything below that promises a
> `warnDeprecated` alias, a still-functional legacy prop, or "no breaking
> changes" is history. What shipped is in
> [`migration.md`](../docs/content/docs/migration.md#inputs) and
> [`#input-sizes`](../docs/content/docs/migration.md#input-sizes).

It is a sibling of [`selection.md`](./selection.md), which covers the pickers
these controls sit next to.

## Scope

This spec answers:

- what the shared labeling, sizing, variant, and `v-model` contracts look like
  across every input
- which existing per-component issues must be resolved before v1
- which members are removed before the tag, and what replaces them

Decisions involving real-world usage data are backed by a bench-wide usage
audit of the input family.

## Decision summary

- every input gets the same shared labeling props: `label`, `description`,
  `error`, `required`
- every input auto-generates an `id` and wires label-for, `aria-describedby`,
  and `aria-errormessage` automatically
- text-style inputs, binary controls, and range controls follow three separate
  size scales by component class
- text inputs converge on a single `subtle | outline | ghost` variant set
- every input uses `defineModel<T>()` for the primary value, with typed
  `*Emits` interfaces only for non-model events
- `FeatherIcon` is removed from `Switch` and `Rating`; both use Lucide
- `Rating.rating_from` becomes `max`; the old name is removed, not aliased
- `FormControl` stays a type-routing component for v1 (185 router-style call
  sites, 0 wrapper-style)
- `Switch.labelClasses` is removed and `Checkbox.padding` becomes `padded`;
  external styling goes through the `data-*` hooks
- **v1 removes the deprecated members rather than shipping them.** ADR-0008
  starts the freeze at `1.0.0`, so an alias kept for one minor would be frozen
  for the whole major. Each removal is listed in `migration.md`.

Historical: this document was first written when v1 was to introduce no
breaking changes, with every removal behind a `warnDeprecated` alias. The
bullets above record what shipped.

## Shared labeling contract

Every input that has a labelable role accepts the same four props, plus `id`.
`InputLabelingProps` and `InputLabelingSlots` in
`src/composables/useInputLabeling.ts` are the declarations; the blocks below
summarize them.

### Props

```ts
interface InputLabelingProps {
  /** Label rendered above (or beside, for binary controls) the input. */
  label?: string

  /**
   * Helper text rendered below the input.
   * Hidden when `error` is set. A `#description` slot is not — it keeps
   * rendering above the error. See "Description versus error" below.
   */
  description?: string

  /**
   * Error message rendered below the input.
   * Sets `aria-invalid="true"` and `data-state="invalid"` on the control.
   * Accepts a string, an array of strings, or an `Error` object;
   * `Error.messages` is rendered as stacked plain text, `Error.message` is
   * the fallback.
   *
   * This is the same value `ErrorMessage.message` takes, so the two never
   * disagree. A component that forwards the prop reads it from
   * `InputLabelingProps['error']`.
   */
  error?: ErrorMessageValue

  /**
   * Marks the field as required.
   * Renders an asterisk after the label (with `sr-only` "(required)" text)
   * and forwards `required` / `aria-required` to the underlying control.
   */
  required?: boolean
}
```

### Slots

```ts
interface InputLabelingSlots {
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any

  // No `#error` slot. The error string is a stable contract; apps that need
  // rich error UI should render it as a sibling. The error-state wiring
  // (`aria-invalid`, `data-state`, `aria-errormessage`) stays driven by the
  // `error` prop.
}
```

### Layout

Two layouts, automatic per component:

- **Stack** (label above the control):
  - `TextInput`, `Textarea`, `Password`, `Rating`, `Slider`
- **Inline row** (label beside the control):
  - `Checkbox`, `Switch`

For inline-row controls, `description` and `error` stack below the row,
indented to align under the label region (not under the control).

### `id` association

- Every input calls `const inputId = props.id ?? useId()`.
- The generated id is shared between the rendered `<label for>` (or
  `aria-labelledby` for non-form controls like `Slider`) and the underlying
  control.
- `description` is rendered with `id="${inputId}-description"` and linked via
  `aria-describedby` on the control.
- `error` is rendered with `id="${inputId}-error"` and linked via
  `aria-errormessage` on the control. `aria-invalid="true"` is set when
  `error` is non-empty.
- Apps may pass `id` explicitly to override.

### Required-indicator rendering

Reuse `FormLabel`'s existing pattern as the canonical implementation:

```html
<label for="...">
  Label text
  <span aria-hidden="true" class="text-ink-red-5 select-none">*</span>
  <span class="sr-only">(required)</span>
</label>
```

Apps using the `#label` slot receive `{ required }` so they can render the
indicator inside their custom label content.

### `error` prop rules

- `error: string` renders as a single line of text below the control.
- `error: string[]` renders one line per entry. Empty entries are dropped.
- `error: Error` renders `Error.messages` (joined with line breaks via
  `whitespace-pre-line`) when present, otherwise `Error.message`.
- An empty string, an empty array, and an `Error` with neither `message` nor
  `messages` all mean no error: no error region, and no `aria-invalid`.
- One function, `errorLines` in `src/utils/errorLines.ts`, decides this for
  both `ErrorMessage` and the input family.
- The error region is rendered as plain text. **`v-html` is not used.**
- `error` text uses `text-ink-red-5` (matches the required asterisk for
  visual consistency of "needs attention" affordances).
- Setting `error` suppresses the `description` **prop**.

### Description versus error

The `description` prop and the `#description` slot behave differently once
`error` is set.

- The `description` prop is hidden. `showDescription` in `useInputLabeling` is
  `description && !hasError`.
- A `#description` slot keeps rendering. It stacks above the error region and
  stays in `aria-describedby`. The slot is app-owned content the component
  cannot summarize, so hiding it would silently drop it.
- `aria-describedby` follows what renders, not what the props say: it lists the
  description id when either the prop or the slot renders, then the error id
  when there is an error.

### Form typography

Label and description type do not follow `size`.

- Labels are a fixed 13px (`text-sm`), `ink-gray-6`, and `ink-gray-4` when
  disabled.
- Descriptions are a fixed 13px (`text-p-sm`), `ink-gray-6`, and `ink-gray-4`
  when disabled.
- `Textarea` text is a fixed 13px at every size. `Textarea` `size` still moves
  padding, corner radius, and minimum height.

## Shared types

`src/composables/inputTypes.ts` is the single declaration of the size and
variant vocabulary. It exports `InputSize`, `ToggleSize`, `RangeSize`,
`InputVariant`, and `InputExposed`. Do not restate the unions elsewhere.

```ts
/** Text-style inputs. Fixed control heights: 24 / 28 / 32 / 40px. */
export type InputSize = 'xs' | 'sm' | 'md' | 'lg'

/** Binary controls. */
export type ToggleSize = 'xs' | 'sm' | 'md'

/** Numeric range controls. */
export type RangeSize = 'sm' | 'md'

/** Text-style inputs that have a container surface. */
export type InputVariant = 'subtle' | 'outline' | 'ghost'
```

Apply per component:

| Component      | Size type   | Variant type       |
| -------------- | ----------- | ------------------ |
| `TextInput`    | `InputSize` | `InputVariant`     |
| `Textarea`     | `InputSize` | `InputVariant`     |
| `Password`     | `InputSize` | `InputVariant`     |
| `Rating`       | `InputSize` | n/a                |
| `Checkbox`     | `ToggleSize`| n/a                |
| `Switch`       | `ToggleSize`| n/a                |
| `Slider`       | `RangeSize` | n/a                |

Every component implements every value on its own scale, so the three unions
carry no dead values.

- `xl` was removed from `InputSize`. It drew `lg`'s 40px height with an 18px
  font, so it was a font override wearing a size name. `xs` was added for the
  24px row.
- `RangeSize` is separate from `ToggleSize` because `Slider` has no `xs`
  dimensions. Sharing the type would let `xs` type-check and then render `sm`.
- On the `InputSize` components, an unsupported `size` falls back to the
  component's own default through `resolvePropValue` and warns once in dev,
  rather than dropping the geometry classes. `Checkbox`, `Switch`, and `Slider`
  pick their classes inline, so an unsupported value lands on the smallest
  branch without a warning.

Size scales follow the control's visual nature, not API symmetry: the range a
text field needs makes a binary affordance chunky.

## `v-model` pattern

Every input uses `defineModel<T>()` for the primary value:

```ts
const model = defineModel<string>()             // TextInput, Textarea, Password
const model = defineModel<boolean>()            // Switch
const model = defineModel<boolean | 1 | 0>()    // Checkbox (union retained for v1; coerce internally)
const model = defineModel<number>()             // Rating
const model = defineModel<SliderValue>()        // Slider
```

Typed `*Emits` interfaces are added only when a component emits non-model
events:

```ts
// Slider
interface SliderEmits {
  'value-commit': [value: SliderValue]
}
```

`*Props` interfaces in `types.ts` continue to declare every non-model prop;
the model itself is documented at the component file via the
`defineModel<T>()` generic.

## Per-component changes

### TextInput

- Already at v1 baseline. No structural changes.
- Apply shared labeling props (`label`, `description`, `error`, `required`).
- Auto-generate `id` via `useId()` fallback.
- Confirm `InputSize` and `InputVariant` (no change from current shape).

### Textarea

- Apply shared labeling props.
- Drop the unused `type: 'text'` default in `withDefaults` (`type` is not in
  `TextareaProps`).
- Add `'ghost'` to the variant set so it matches `TextInput` and `Password`.
- Add `required` prop for parity.
- Consolidate the local `label` prop into the shared labeling contract
  (same prop name, no breaking change — call sites continue to work).

### Password

- Add `defineModel<string>()`. This fixes the current bug where
  `<Password v-model>` does not update from typing.
- Deprecate the `value` prop alias (warn via `warnDeprecated`); remove in a
  future major.
- Add explicit `size`, `variant`, `disabled`, `placeholder`, `id`, `required`
  props instead of routing through `$attrs`.
- Apply shared labeling props.

### Checkbox

- Keep `modelValue` typed as `boolean | 1 | 0` for v1 — narrowing to
  `boolean` is a breaking change for any consumer passing `1` / `0`. Use
  `defineModel<boolean | 1 | 0>()` and coerce internally to `boolean` for
  the rendered control state. Document `boolean` as the canonical type;
  narrow in a future major.
- Let `defineModel` own the `modelValue` prop and `update:modelValue` emit;
  redeclaring either in the component produces duplicate model updates. Keep
  `modelValue` on the exported public prop type for consumer compatibility.
- Apply shared labeling props (inline-row layout).
- Switch to `defineModel`.
- `size` is `ToggleSize`.
- Remove the `padding` prop. `padded` replaces it: it wraps the control and
  label in a clickable surface with hover, active, and focus states. Other
  spacing overrides go through the `data-*` hooks (see "Styling hooks" below).
  The audit found 0 real `padding` call sites, so nothing to migrate.

Historical: this spec first planned to keep `padding` working through `v1.x`
behind a `warnDeprecated` call. ADR-0008 replaced that with removal.

### Switch

- Remove internal `FeatherIcon` import. Replace with Lucide. (Internal
  refactor — no public API change.)
- Retype `icon` from `any` to `string | Component`. Strings starting with
  `lucide-` route through the shared Lucide Tailwind utility (matches the
  pattern recently adopted by `Button.icon`). Existing values continue to
  resolve.
- Remove the `change` emit. It duplicated `update:modelValue`; switches have no
  meaningful `input` versus `change` distinction.
- Apply shared labeling props (inline-row layout).
- `Switch` already uses `defineModel<boolean>()` — no change to the model
  wiring beyond the refactor.
- `size` is `ToggleSize`.
- Remove the `labelClasses` prop. Styling moves to the `data-*` hooks (see
  "Styling hooks" below). The audit found 0 real call sites on frappe-ui's
  `Switch`, so nothing to migrate.
- Add `padded` and `controlPosition` (`'start' | 'end'`, default `'end'`).

Historical: this spec first planned to keep the `change` emit and
`labelClasses` working through `v1.x` behind `warnDeprecated` calls. ADR-0008
replaced that with removal.

### Rating

- Remove internal `FeatherIcon` import.
- The icon is configurable. `icon` takes a class-icon name
  (`icon="lucide-heart"`), which renders as a `<span>` carrying that class, or
  a Vue component, which receives `fill="currentColor"` so closed-path SVGs
  render filled. The default is the inline `RatingStar` component, not
  `lucide-star`: the Lucide class icon is a mask of the outline star, so it
  cannot draw a solid one.
- An `#icon` slot overrides the icon per star. It is stamped once per half so
  half-step clipping still works, and receives `RatingIconSlotProps`:
  `index`, `side`, `state`, `leftState`, `rightState`, `value`, `previewValue`,
  and `max`.
- Rename `rating_from` to `max`. Default `5`. `rating_from` is removed, not
  aliased.
- `size` is `InputSize`. `step` is `1` or `0.5`.
- Type emits via a `RatingEmits` interface (replace the current
  `defineEmits(['update:modelValue'])` string-array form).
- Apply shared labeling props.
- Switch to `defineModel<number>()`.

Historical: this spec first held the star shape fixed for v1 and planned a
`rating_from` alias. Neither shipped.

### Slider

- Add `disabled` prop, forwarded to `SliderRoot.disabled` and
  `aria-disabled`.
- Add `size: RangeSize` (`'sm' | 'md'`), default `'sm'`. `md` increases
  track and thumb proportionally. `RangeSize` is its own type rather than
  `ToggleSize` because `Slider` has no `xs` dimensions.
- **Bug fix:** remove the hardcoded `aria-label="Volume"`. The string was
  a leftover from a specific consumer and was incorrect for every other
  call site (assistive tech announces every Slider as "Volume"). Labeling
  now flows through the shared labeling contract; if no `label` is
  provided, no `aria-label` is set and consumers should pass one
  explicitly. Treated as a bug fix, not an API change.
- Add a typed `SliderEmits` interface exposing
  `'value-commit': [value: SliderValue]`, bound to `SliderRoot`'s
  `@valueCommit`. Apps use this to fire side-effects only when the user
  finishes dragging.
- Apply shared labeling props.

### ErrorMessage

`ErrorMessage` continues to exist for direct use, but its v1 role narrows.

- **`v-html` is preserved as-is for v1.** Removal is deferred — revisit
  post-v1 once consumers are tracked.
- The message prop is typed as `ErrorMessageValue`: a string, an array of
  strings, or an `Error` that may carry `messages`. The input `error` prop
  takes the same value, and `errorLines` reads it for both.
- Most consumers should migrate to the input-level `error` prop. Document
  `ErrorMessage` as the standalone option for contexts where an input is
  not present (e.g. form-level error banners).

Note: the input-level `error` region (rendered by the shared labeling
contract) is plain text and does not use `v-html`. That rule is about the
new in-input rendering, independent of the standalone `ErrorMessage`
component.

## Deprecations

### `warnDeprecated` utility

Add `src/utils/warnDeprecated.ts`. It shipped with three exports — `warnOnce`,
`warnDeprecated`, and `warnRemoved` — all built on one deduped dev-only
`console.warn`. Read the module for the signatures.

Rules:

- dev-mode only (`import.meta.env.PROD` short-circuit)
- module-level `Set` dedupes by `name` so the warning fires once per session
- called from each deprecated component's `setup` (or the relevant code
  path), not at import time, so stack traces point at the call site
- consolidates the existing one-off pattern used by
  `Divider.action.handler`

### What shipped in 1.0.0

No input member ships with a `warnDeprecated` alias. The table below is the
planned wiring; the right-hand column records the outcome.

| Component / API                     | Planned warning                    | Replacement                  | Outcome in 1.0.0 |
| ----------------------------------- | ---------------------------------- | ---------------------------- | ---------------- |
| `Input.vue`                         | `Input`                            | `TextInput`                  | Removed; the import fails |
| `Autocomplete`                      | `Autocomplete`                     | `Combobox` or `MultiSelect`  | Removed          |
| `FormControl type='autocomplete'`   | `FormControl.type`                 | `type="combobox"`            | Removed; dev-only `console.error` |
| `Password.value` prop               | `Password.value`                   | `v-model` / `modelValue`     | Removed; silent — falls through as a DOM attribute |
| `Rating.rating_from` prop           | `Rating.rating_from`               | `max`                        | Removed; silently ignored |
| `Rating.readonly` prop              | —                                  | `disabled`                   | Removed; silently ignored |
| `Switch.change` emit                | `Switch.change`                    | `update:modelValue` / `v-model` | Removed; the handler never fires |
| `Switch.labelClasses` prop          | `Switch.labelClasses`              | `data-*` styling hooks       | Removed; styles nothing |
| `Checkbox.padding` prop             | `Checkbox.padding`                 | `padded`                     | Removed; styles nothing |
| `size="xl"` on any input            | —                                  | `size="lg"`                  | Removed; falls back to the component default and warns |
| `Divider.action.handler` (existing) | `Divider.action.handler`           | `Divider.action.onClick`     | Removed; `Divider` reads `onClick` only |

None of the removals break at build time, so the migration guide tells apps to
grep for the old names.

`src/utils/warnDeprecated.ts` shipped, but with `warnOnce` and `warnRemoved`
next to `warnDeprecated`. `warnRemoved` is the one this family's removals would
use; it says "X was removed. Use Y instead." No input component calls any of
them, because a removed prop has nowhere left to call from. `Tree` and the
editor extensions are the current callers.

`FeatherIcon` removal is tracked in the broader v1 plan.

### Deprecation policy

Historical. This was the policy before ADR-0008:

- deprecated APIs continue to work through `v1.x`
- removal is a future-major concern
- legacy and deprecated components move out of standard docs and onto the
  single legacy-docs page
- the `FormControl type='autocomplete'` route warns but keeps rendering
  `Autocomplete`

ADR-0008 replaced every rule but the third for `1.0.0`: the API freeze starts
at the tag, so a member kept for one minor would be frozen for the whole major.
Deprecated input members are removed before the tag instead. The
`type='autocomplete'` route went first, in
[#869](https://github.com/frappe/frappe-ui/issues/869).

## Decisions backed by the usage audit

The two decisions below are backed by bench-wide usage data.

### 1. `FormControl` stays a router for v1

The audit found 185 `FormControl` call sites across nine app frontends.
**Every observed call site uses it as a type-routing component.** Zero
sites use it as a slot-based label wrapper around a custom control.

Deprecation pressure is narrow: only 7 `type='autocomplete'` call sites,
concentrated in 2 files (`meet/.../DeviceSettingsTab.vue` and
`insights/.../DashboardFilterEditor.vue`). All pass standard `:options`
arrays of `{ label, value }` shape.

**v1 decision:**

- `FormControl` remains a type-routing component
- ~~the `type='autocomplete'` route stays functional, with a dev-mode
  deprecation warning pointing consumers at `Combobox` standalone~~ — the
  route is removed; see the note at the top
- a router-vs-wrapper redesign is not pursued; the data shows no real-world
  consumer leans on a wrapper-style use that would block the router approach

### 2. Class-injection props are removed in v1

The audit found:

- `Switch.labelClasses` — **0 real call sites** on frappe-ui's `Switch`.
  Two files surface a `labelClasses` symbol but they are app-local
  `Autocomplete` wrappers with their own internal API, not consumers of the
  prop on the frappe-ui component.
- `Checkbox.padding` — **0 real call sites** across all audited apps.
- No other class-injection props were found on input components in real
  usage.

**v1 decision:**

- both props are removed. The zero-call-site count is what made removal safe,
  and ADR-0008 made keeping them expensive: a member that ships in `1.0.0` is
  frozen for the major.
- inputs expose a `data-*` vocabulary for external styling instead:
  `data-slot`, `data-size`, `data-variant`, `data-state`, `data-disabled`,
  `data-required`
- `Checkbox.padded` covers what `padding` was reached for in practice — a
  clickable surface around the control and label.

Migration load: zero apps affected.

Historical: the audit's own conclusion was to warn and keep both through
`v1.x`. ADR-0008 superseded it.

## Implementation notes

The per-component changes above are the source of truth for behavior. This
section captures the cross-cutting infrastructure, acceptance gates, and
test/story expectations that apply to every input in scope.

### Shared infrastructure

- `src/utils/warnDeprecated.ts` — dev-mode warning utility (see
  "Deprecations").
- `src/composables/useInputLabeling.ts` — returns `{ inputId, labelledBy,
  describedBy, errorMessageId, dataAttrs, hasError }`. Also exports the
  shared `InputLabelingProps` and `InputLabelingSlots` interfaces from the
  same module.
- `src/composables/inputTypes.ts` — exports `InputSize`, `ToggleSize`,
  `RangeSize`, `InputVariant`, and `InputExposed` (shared types live next to
  composables; no separate `src/types/` directory).
- `src/components/InputLabeling/` — `InputLabel`, `InputDescription`,
  `InputError`, `RequiredIndicator`, and `LabelingWrapper`, so every input
  renders the same label, description, and error DOM.

### Repo conventions

- Input components live under `src/components/<Component>/` with
  `<Component>.vue`, `index.ts`, `types.ts`, `<Component>.cy.ts`, and a
  `stories/` directory.
- Use the existing `src/utils/useId.ts` instead of re-implementing.
- Use `<script setup lang="ts">` everywhere; never the Options API.
- Lucide icons go through the shared Tailwind utility (see `Button.icon`
  precedent).
- Stories regenerate `meta/<Component>.md` via `propsgen` — don't hand-edit
  meta files.

### Acceptance gates

Every change against this spec must pass:

- `yarn typecheck` clean
- `yarn test` (Cypress component tests) clean for touched components
- Storybook stories render without console warnings or errors
- No new dev `console.warn` on a clean call path — neither from
  `warnDeprecated` nor from a `resolvePropValue` fallback
- No regressions in `propsgen`-generated meta — diffs reviewed
- `dist/` builds without new warnings (`yarn build`)
- **Every break is listed in `migration.md`.** A removal that is not in the
  migration guide is a bug in the change, not an accepted break.

Historical: the last gate read "no breaking changes — every existing call site
continues to work with no source edits required". ADR-0008 replaced it.

### Tests for every component

Each touched component must ship updated/new Cypress tests
(`<Component>.cy.ts`) covering, at minimum:

- **v-model round trip** — `defineModel` writes propagate to the parent and
  parent updates re-render the control
- **Shared labeling contract** — `label`, `description`, `error`, `required`
  each render correctly; `aria-describedby`, `aria-errormessage`,
  `aria-invalid`, `aria-required` wire to the right ids
- **`id` association** — `<label for>` matches the control's `id`; explicit
  `id` prop overrides the generated one
- **Sizes / variants** — every value in the component's `Size` / `Variant`
  union renders (smoke-level is fine; visual regression is not required)
- **Disabled state** — `disabled` forwards to the control and to
  `data-disabled`
- **Component-specific behaviors**:
  - `Password` — toggling visibility, no plaintext leak in DOM when hidden
  - `Switch` / `Checkbox` — clicking the label toggles the control
  - `Slider` — `value-commit` fires on drag end (not on every step)
  - `Rating` — `max` controls star count; `icon` and `#icon` override the
    star, and the slot runs for both halves under `step="0.5"`
- **Removed members** — a removed prop or emit is inert: passing
  `rating_from`, `labelClasses`, or `padding` changes nothing, and a `@change`
  handler on `Switch` never fires

Stories must cover the same surface visually so consumers can see the
labeling contract in action.

### Stories for manual testing

Each touched component must ship Storybook stories that let a human
exercise the component end-to-end, not just snapshot it. At minimum, every
component gets:

- **Default** — bare-bones usage with `v-model` bound to a story arg, so
  the toggle in the controls panel updates the live component
- **All sizes** — one story rendering every value of the component's size
  union side by side, labeled with the size name
- **All variants** (text inputs only) — one story rendering every value
  of `InputVariant` side by side
- **Labeling contract** — a story that exposes `label`, `description`,
  `error`, `required` as story args so the reviewer can flip each one and
  see the rendered label/description/error region update, including the
  `aria-*` wiring (verify in browser devtools)
- **Disabled** — disabled state rendered alongside enabled for visual
  contrast
- **Component-specific scenarios** — anything worth eyeballing:
  - `Password` — visibility toggle in action
  - `Slider` — drag interaction, watch `value-commit` in the actions panel
  - `Rating` — different `max` values, hover state, a custom `icon`
  - `Switch` / `Checkbox` — clicking the label vs the control

No story demonstrates a removed member. The earlier plan asked for one story
per deprecated prop so a reviewer could watch the warning fire; nothing is
left to fire.

Stories should be runnable with `yarn dev` against the local frappe-ui
copy, so the reviewer can manually exercise every code path the spec
introduces.

**Rewrite existing stories where it makes sense.** Don't preserve old
stories out of inertia. If a current story:

- predates the shared labeling contract and renders a hand-rolled
  `<label>` next to the control,
- duplicates what the new "All sizes" / "All variants" / "Labeling
  contract" stories cover,
- demos a removed API as the primary example (e.g. `Rating` showing
  `rating_from`, `Switch` showing `@change`), or
- exists only to demo a removed structural detail,

replace it with the v1 equivalent rather than keeping both. Keep an old
story only when it covers a real scenario the new stories don't (e.g. an
integration with another component, a non-obvious prop combination).

### Deprecation wiring

Historical. This section planned a `warnDeprecated(...)` call in `Input.vue`,
`Password.vue`, `Rating.vue`, `Switch.vue`, `Checkbox.vue`, and `Divider.vue`.
Every one of those members was removed instead, so no input component wires a
warning. See "What shipped in 1.0.0" above.

`Input` is removed rather than moved to the legacy-components docs page; the
v1 migration guide points at the new API. `Autocomplete` and
`FormControl type='autocomplete'` are listed there as removed too.

### `data-*` styling hooks

Every input shell renders the canonical `data-*` vocabulary:

- `data-slot` — element role inside the component (e.g. `"label"`,
  `"control"`, `"description"`, `"error"`)
- `data-size` — current `size` value
- `data-variant` — current `variant` value (where applicable)
- `data-state` — `"valid" | "invalid" | "checked" | "unchecked" | …`
- `data-disabled` — present when disabled, absent otherwise
- `data-required` — present when required, absent otherwise

Select the two booleans by presence (`[data-disabled]`). Their value is not
part of the contract (P10).

The `useInputLabeling` composable returns a `dataAttrs` object that
components spread onto their root element so the vocabulary stays
consistent.

**`control` versus `trigger` (INP-Q10).** Every input marks its main
interactive element `data-slot="control"`. `trigger` is reserved for the
selection family — `Select`, `Combobox` and `MultiSelect` — whose box shows the
selection and opens the popover. The date and time pickers use `control`: their
`<input>` is something you type into, so it is a control that also opens a
panel. Both names would otherwise mean "the thing you click", and an app
styling `[data-slot="control"]` would miss half the inputs.

The pickers add two more hooks on top:

- `data-slot="chevron"` on the trailing chevron, so an app can restyle or hide
  it without replacing the `#suffix` slot.
- `role="combobox"`, `aria-haspopup` and `aria-expanded` on the picker
  `<input>`, so a screen reader announces that the field opens a panel and
  whether that panel is open. `aria-haspopup` is `dialog` on the date pickers
  and `listbox` on `TimePicker`, matching what each one opens.

`FormLabel` carries `data-slot="label"`, the same marker `InputLabel` already
rendered, so one selector reaches every label in the library.

The `data-*` hooks are the whole external styling surface.
`Switch.labelClasses` and `Checkbox.padding` are gone.

### Out of scope (do not silently expand)

- `FileUploader` (covered in a separate spec)
- narrowing `Checkbox.modelValue` to `boolean` (breaking; deferred to a
  future major)
- adding an `#error` slot on inputs (the spec rejects this)
- removing `v-html` from `ErrorMessage` (deferred — preserved as-is for v1)
- new size or variant tokens beyond `InputSize` / `ToggleSize` / `RangeSize` /
  `InputVariant`

## v1 release contract for this spec

- **every break is listed in `migration.md`** — `rating_from`, `readonly`,
  `Switch.change`, `labelClasses`, `padding`, `Password.value`, `size="xl"`,
  and `Input.vue` are removed, not aliased
- new shared labeling contract is additive on every input in scope
- size and variant scales are codified into `src/composables/inputTypes.ts` and
  restated nowhere
- a more consistent mental model across `TextInput`, `Textarea`, `Password`,
  `Checkbox`, `Switch`, `Rating`, and `Slider`
- `FileUploader` is out of scope and addressed in a separate spec

Historical: this contract read "strictly no breaking changes — every existing
call site keeps working with no source edits required" until ADR-0008.
