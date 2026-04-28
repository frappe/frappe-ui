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

It also covers the v1 stance on the deprecated `Input.vue` and `Autocomplete`,
and the `FormControl type='autocomplete'` route.

It is a sibling of [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md)
and inherits any shared design rules from that document where they apply.

## Scope

This spec answers:

- what the shared labeling, sizing, variant, and `v-model` contracts look like
  across every input
- which existing per-component issues must be resolved before v1
- which deprecations must be wired with dev warnings

Decisions involving real-world usage data are backed by
[`research/09-input-components-usage-audit.md`](./research/09-input-components-usage-audit.md).

## Decision summary

- every input gets the same shared labeling props: `label`, `description`,
  `error`, `required`
- every input auto-generates an `id` and wires label-for, `aria-describedby`,
  and `aria-errormessage` automatically
- text-style inputs and binary/numeric controls follow two separate size
  scales by component class
- text inputs converge on a single `subtle | outline | ghost` variant set
- every input uses `defineModel<T>()` for the primary value, with typed
  `*Emits` interfaces only for non-model events
- `FeatherIcon` is removed from `Switch` and `Rating`; both use Lucide
- `Rating.rating_from` is renamed to `max`, with a deprecated alias
- `Input.vue`, `Autocomplete`, and the `FormControl type='autocomplete'`
  route all gain dev-mode deprecation warnings via a shared utility
- `FormControl` stays a type-routing component for v1 (185 router-style call
  sites, 0 wrapper-style)
- `Switch.labelClasses` and `Checkbox.padding` are deprecated (warned, still
  functional) in favor of `data-*` styling hooks; removal is post-v1
- **v1 introduces no breaking changes.** Every API change is additive or
  ships behind a `warnDeprecated` alias that keeps the old call site working

## Shared labeling contract

Every input that has a labelable role accepts the same four props.

### Props

```ts
interface InputLabelingProps {
  /** Label rendered above (or beside, for binary controls) the input. */
  label?: string

  /**
   * Helper text rendered below the input.
   * Hidden when `error` is set.
   */
  description?: string

  /**
   * Error message rendered below the input.
   * Sets `aria-invalid="true"` and `data-state="invalid"` on the control.
   * Accepts an `Error` object; `Error.messages` is rendered as stacked
   * plain text, `Error.message` is the fallback.
   */
  error?: string | Error

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
  <span aria-hidden="true" class="text-ink-red-3 select-none">*</span>
  <span class="sr-only">(required)</span>
</label>
```

Apps using the `#label` slot receive `{ required }` so they can render the
indicator inside their custom label content.

### `error` prop rules

- `error: string` renders as a single line of text below the control.
- `error: Error` renders `Error.messages` (joined with line breaks via
  `whitespace-pre-line`) when present, otherwise `Error.message`.
- The error region is rendered as plain text. **`v-html` is not used.**
- `error` text uses `text-ink-red-3` (matches the required asterisk for
  visual consistency of "needs attention" affordances).
- Setting `error` automatically suppresses the `description` region.

## Shared types

```ts
/** Size scale for text-style inputs. */
export type InputSize = 'sm' | 'md' | 'lg' | 'xl'

/** Size scale for binary and numeric range controls. */
export type ToggleSize = 'sm' | 'md'

/** Variant scale for text-style inputs that have a container surface. */
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
| `Slider`       | `ToggleSize`| n/a                |

Rationale: `lg` and `xl` produce useful visual range for text inputs and
trigger surfaces but produce oversized chunky controls for binary
affordances and sliders. Size scales follow the control's visual nature,
not API symmetry.

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
- Type emits via a `CheckboxEmits` interface.
- Apply shared labeling props (inline-row layout).
- Switch to `defineModel`.
- Deprecate the `padding` prop (warn via `warnDeprecated`); keep functional
  through `v1.x`. Styling moves to `data-*` hooks (see "Styling hooks"
  below). Audit found 0 real call sites, so the warning is essentially a
  no-op in practice.

### Switch

- Remove internal `FeatherIcon` import. Replace with Lucide. (Internal
  refactor — no public API change.)
- Retype `icon` from `any` to `string | Component`. Strings starting with
  `lucide-` route through the shared Lucide Tailwind utility (matches the
  pattern recently adopted by `Button.icon`). Existing values continue to
  resolve.
- Deprecate the `change` emit (warn via `warnDeprecated` when the parent
  binds `@change`); keep firing through `v1.x`. It duplicates
  `update:modelValue`; switches do not have a meaningful `input` vs
  `change` distinction.
- Apply shared labeling props (inline-row layout).
- `Switch` already uses `defineModel<boolean>()` — no change to the model
  wiring beyond the refactor.
- Deprecate the `labelClasses` prop (warn via `warnDeprecated` when set);
  keep applied to the `<label>` through `v1.x`. Styling moves to `data-*`
  hooks (see "Styling hooks" below). Audit found 0 real call sites on
  frappe-ui's `Switch`, so the warning is essentially a no-op in practice.

### Rating

- Remove internal `FeatherIcon` import. Default icon becomes `lucide-star`
  via the shared Lucide Tailwind utility. Star icon stays hardcoded for v1;
  configurable shape is a post-v1 additive change if needed.
- Rename `rating_from` to `max`. Default `5`. Keep `rating_from` working as
  a deprecated alias through `v1.x` with a `warnDeprecated` call.
- Type emits via a `RatingEmits` interface (replace the current
  `defineEmits(['update:modelValue'])` string-array form).
- Apply shared labeling props.
- Switch to `defineModel<number>()`.

### Slider

- Add `disabled` prop, forwarded to `SliderRoot.disabled` and
  `aria-disabled`.
- Add `size: ToggleSize` (`'sm' | 'md'`), default `'sm'`. `md` increases
  track and thumb proportionally.
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
- Type the message prop as `string | Error` cleanly; remove the
  `(message as any).messages` cast by typing `Error.messages?: string[]`
  via a small library-level interface. (Internal typing improvement, not a
  runtime change.)
- Most consumers should migrate to the input-level `error` prop. Document
  `ErrorMessage` as the standalone option for contexts where an input is
  not present (e.g. form-level error banners).

Note: the input-level `error` region (rendered by the shared labeling
contract) is plain text and does not use `v-html`. That rule is about the
new in-input rendering, independent of the standalone `ErrorMessage`
component.

## Deprecations

### `warnDeprecated` utility

Add `src/utils/warnDeprecated.ts`:

```ts
const warned = new Set<string>()

export function warnDeprecated(
  name: string,
  replacement: string,
  docHref?: string,
) {
  if (import.meta.env.PROD) return
  if (warned.has(name)) return
  warned.add(name)
  const suffix = docHref ? ` See ${docHref}` : ''
  console.warn(
    `[frappe-ui] ${name} is deprecated. Use ${replacement} instead.${suffix}`,
  )
}
```

Rules:

- dev-mode only (`import.meta.env.PROD` short-circuit)
- module-level `Set` dedupes by `name` so the warning fires once per session
- called from each deprecated component's `setup` (or the relevant code
  path), not at import time, so stack traces point at the call site
- consolidates the existing one-off pattern used by
  `Divider.action.handler`

### Wired warnings for v1

| Component / API                     | Warning name                       | Replacement                  |
| ----------------------------------- | ---------------------------------- | ---------------------------- |
| `Input.vue`                         | `Input`                            | `TextInput`                  |
| `Autocomplete`                      | `Autocomplete`                     | `Combobox` or `MultiSelect`  |
| `FormControl type='autocomplete'`   | `FormControl type="autocomplete"`  | Use `Combobox` standalone    |
| `Password.value` prop               | `Password.value`                   | `v-model` / `modelValue`     |
| `Rating.rating_from` prop           | `Rating.rating_from`               | `max`                        |
| `Switch.change` emit                | `Switch.change`                    | `update:modelValue` / `v-model` |
| `Switch.labelClasses` prop          | `Switch.labelClasses`              | `data-*` styling hooks       |
| `Checkbox.padding` prop             | `Checkbox.padding`                 | `data-*` styling hooks       |
| `Divider.action.handler` (existing) | `Divider.action.handler`           | `Divider.action.onClick`     |

`FeatherIcon` removal is tracked in the broader v1 plan and uses the same
utility once finalized.

### Deprecation policy

Per the v1 plan:

- deprecated APIs continue to work through `v1.x`
- removal is a future-major concern
- legacy and deprecated components move out of standard docs and onto the
  single legacy-docs page
- `FormControl type='autocomplete'` route warns but keeps rendering
  `Autocomplete` (removing the route now would break consumers; removal is
  a post-v1 step)

## Decisions backed by the usage audit

The two decisions below are backed by data in
[`research/09-input-components-usage-audit.md`](./research/09-input-components-usage-audit.md).

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
- the `type='autocomplete'` route stays functional, with a dev-mode
  deprecation warning pointing consumers at `Combobox` standalone
- a router-vs-wrapper redesign is not pursued; the data shows no real-world
  consumer leans on a wrapper-style use that would block the router approach

### 2. Class-injection props are deprecated, not removed in v1

The audit found:

- `Switch.labelClasses` — **0 real call sites** on frappe-ui's `Switch`.
  Two files surface a `labelClasses` symbol but they are app-local
  `Autocomplete` wrappers with their own internal API, not consumers of the
  prop on the frappe-ui component.
- `Checkbox.padding` — **0 real call sites** across all audited apps.
- No other class-injection props were found on input components in real
  usage.

**v1 decision:**

- both props remain functional in v1, with a `warnDeprecated` warning when
  set; removal is post-v1
- inputs additionally expose a `data-*` vocabulary for external styling:
  `data-slot`, `data-size`, `data-variant`, `data-state`, `data-disabled`,
  `data-required`
- this matches the selection-spec (rule 4) precedent and keeps v1 strictly
  non-breaking

Migration load: zero apps affected.

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
  `InputVariant` (shared types live next to composables; no separate
  `src/types/` directory).
- `src/components/FormLabel.vue` — required-indicator markup is extracted
  here so every input reuses the same DOM.

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
- No new `console.warn` from `warnDeprecated` in clean (non-deprecated) call
  paths
- No regressions in `propsgen`-generated meta — diffs reviewed
- `dist/` builds without new warnings (`yarn build`)
- **No breaking changes.** Every existing call site continues to work with
  no source edits required. New behaviors are additive; old behaviors that
  are being phased out fire `warnDeprecated` and continue to function
  through `v1.x`.

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
  - `Rating` — `max` controls star count; `rating_from` alias still works
- **Deprecation warnings** — when a deprecated API is used, the test
  asserts `console.warn` fires once with the expected message; when the
  modern API is used, the test asserts no warning fires

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
- **Deprecated API** — one story per deprecated prop/emit on the component
  that explicitly uses the old API, so the reviewer can confirm the
  `console.warn` fires once and the component still works (e.g. a
  `Switch` story binding `@change`, a `Rating` story passing
  `:rating_from="10"`)
- **Component-specific scenarios** — anything worth eyeballing:
  - `Password` — visibility toggle in action
  - `Slider` — drag interaction, watch `value-commit` in the actions panel
  - `Rating` — different `max` values, hover state
  - `Switch` / `Checkbox` — clicking the label vs the control

Stories should be runnable with `yarn dev` against the local frappe-ui
copy, so the reviewer can manually exercise every code path the spec
introduces.

**Rewrite existing stories where it makes sense.** Don't preserve old
stories out of inertia. If a current story:

- predates the shared labeling contract and renders a hand-rolled
  `<label>` next to the control,
- duplicates what the new "All sizes" / "All variants" / "Labeling
  contract" stories cover,
- demos a deprecated API as the primary example (e.g. `Rating` showing
  `rating_from`, `Switch` showing `@change`), or
- exists only to demo a removed structural detail,

replace it with the v1 equivalent rather than keeping both. Keep an old
story only when it covers a real scenario the new stories don't (e.g. an
integration with another component, a non-obvious prop combination).
Deprecated APIs still need their own dedicated story per the list above —
that's separate from rewriting the *primary* examples to use the new
contract.

### Deprecation wiring

`warnDeprecated(...)` is wired in the following files (matching the
Deprecations table):

- `src/components/Input.vue` — warn on mount: `Input` → `TextInput`
- `src/components/Autocomplete/Autocomplete.vue` — warn on mount:
  `Autocomplete` → `Combobox` or `MultiSelect`
- `src/components/FormControl/FormControl.vue` — warn when
  `props.type === 'autocomplete'`: → `Combobox` standalone
- `src/components/Password/Password.vue` — `value` prop
- `src/components/Rating/Rating.vue` — `rating_from` prop
- `src/components/Switch/Switch.vue` — `change` emit, `labelClasses` prop
- `src/components/Checkbox/Checkbox.vue` — `padding` prop
- `src/components/Divider/Divider.vue` — `Divider.action.handler` (replaces
  the prior ad-hoc deprecation log)

`Input`, `Autocomplete`, and `FormControl type='autocomplete'` move out of
standard component docs onto the single legacy-components docs page; the
v1 migration guide points at the new APIs.

### `data-*` styling hooks

Every input shell renders the canonical `data-*` vocabulary:

- `data-slot` — element role inside the component (e.g. `"label"`,
  `"control"`, `"description"`, `"error"`)
- `data-size` — current `size` value
- `data-variant` — current `variant` value (where applicable)
- `data-state` — `"valid" | "invalid" | "checked" | "unchecked" | …`
- `data-disabled` — `"true"` when disabled, absent otherwise
- `data-required` — `"true"` when required, absent otherwise

The `useInputLabeling` composable returns a `dataAttrs` object that
components spread onto their root element so the vocabulary stays
consistent.

`Switch.labelClasses` and `Checkbox.padding` continue to work alongside
the `data-*` hooks. They are deprecated, not removed in v1.

### Out of scope (do not silently expand)

- `FileUploader` (covered in a separate spec)
- removing the `FormControl type='autocomplete'` route (warn only — gated
  on post-v1 `FormControl` scope decision)
- removing `Switch.labelClasses`, `Checkbox.padding`, `Switch.change` emit,
  or any other deprecated API in v1 (warn only — removal is post-v1)
- narrowing `Checkbox.modelValue` to `boolean` (breaking; deferred to a
  future major)
- adding an `#error` slot on inputs (the spec rejects this)
- removing `v-html` from `ErrorMessage` (deferred — preserved as-is for v1)
- new size or variant tokens beyond `InputSize` / `ToggleSize` /
  `InputVariant`
- any change that requires consumer source edits to keep working

## v1 release contract for this spec

- **strictly no breaking changes** — every existing call site keeps working
  with no source edits required
- new shared labeling contract is additive on every input in scope
- size and variant scales are codified into shared types
- deprecated APIs continue to function with dev-mode warnings; removal is
  post-v1
- a more consistent mental model across `TextInput`, `Textarea`, `Password`,
  `Checkbox`, `Switch`, `Rating`, and `Slider`
- `FileUploader` is out of scope and addressed in a separate spec
