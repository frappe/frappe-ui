# DatePicker & TimePicker Family Audit

Status: audit for `frappe-ui` v1 planning.

This document covers the three picker components shipped from the `DatePicker` directory plus the standalone `TimePicker`:

- `DatePicker` — single date selection
- `DateRangePicker` — start/end date range
- `DateTimePicker` — date + time combined
- `TimePicker` — standalone time selection (also embedded by `DateTimePicker`)

The vocabulary-alignment rules in this document apply to **all four** components. The first three share an internal composables module (`DatePicker/composables.ts`); `TimePicker` inlines equivalent logic so it stays decoupled from the DatePicker tree.

---

## Current state summary

All three pickers are already on TypeScript and `<script setup>`, have `types.ts`, stories, tests, and docs. The audit matrix marks them as "Good baseline". This document focuses on what still needs to change before the API can be frozen at v1.

---

## Vocabulary alignment with the selection family

These three issues are about making DatePicker props consistent with what `Combobox`, `Dropdown`, and `Select` already use.

### `placement` → `side` + `align` + `offset`

DatePicker currently takes a single compound `placement` string (`'bottom-start'`, `'top-end'`, etc.). `Combobox` and `Dropdown` settled on the decomposed vocabulary: `side` (`top | bottom | left | right`) + `align` (`start | center | end`) + `offset` (number). `placement` is kept on Combobox only as a `@deprecated` back-compat alias.

DatePicker should do the same: introduce `side`, `align`, and `offset`, deprecate `placement`, and map the old values internally.

```ts
// Current (deprecated)
placement?: 'bottom-start' | 'bottom-end' | 'top-start' | ...

// v1
side?: 'top' | 'right' | 'bottom' | 'left'   // default: 'bottom'
align?: 'start' | 'center' | 'end'            // default: 'start'
offset?: number                                // default: 4
/** @deprecated use side + align */
placement?: DatePickerPlacement
```

---

### `autoClose` → `keepOpen`

DatePicker has `autoClose: boolean` (default `true`). The selection family uses `keepOpen` on individual items as the escape hatch. At the component level there is no direct equivalent — but the naming `keepOpen` is the established direction. These are inverse booleans of each other:

| Current                     | v1 equivalent               |
| --------------------------- | --------------------------- |
| `autoClose: true` (default) | `keepOpen: false` (default) |
| `autoClose: false`          | `keepOpen: true`            |

**Fix:** Rename `autoClose` to `keepOpen` with default `false`. Deprecate `autoClose` with a mapping.

---

### `allowCustom` → drop it (use `readonly`)

DatePicker has two props that both make the text input non-editable:

- `readonly` — standard HTML concept, prevents typing, popover still opens
- `allowCustom: false` — also prevents typing, popover still opens

They produce identical behavior: `:readonly="props.readonly || !props.allowCustom"`. `allowCustom` is fully redundant. The "force calendar-only, no freeform typing" use case is already covered by `readonly`.

**Fix:** Deprecate `allowCustom`. Document that `readonly` is the correct way to disable freeform input while keeping the picker interactive.

---

### `inputClass` → drop it

`inputClass` applies extra classes to the inner `TextInput` element. The only practical use case is controlling width. Since the Popover root has `class="inline-block"` and the inner TextInput has `w-full`, users can size the picker by putting a class on the component element itself:

```html
<!-- instead of inputClass="w-48" -->
<DatePicker class="w-48" ... />
```

There is no case where `inputClass` is needed that `class` on the component cannot cover. The prop leaks internal structure.

**Fix:** Deprecate `inputClass`. Document the `class` pattern as the width control.

---

## Issues to fix before v1

### 1. FeatherIcon in all three pickers

All three components import and render `FeatherIcon` for the chevron-down suffix in the default trigger slot:

```ts
// @ts-ignore - Vue SFC without explicit types
import FeatherIcon from '../FeatherIcon.vue'
```

```html
<FeatherIcon
  name="chevron-down"
  class="h-4 w-4 cursor-pointer"
  @mousedown.prevent="togglePopover"
/>
```

This is a v1 blocker — the plan requires removing all internal `FeatherIcon` usage from core components.

**Fix:** Replace with `LucideChevronDown` imported via `~icons/lucide/chevron-down`, matching the pattern already used by `Select` and `Combobox`.

---

### 2. Deprecated `value` prop — keep but warn

All three pickers accept both `value` and `modelValue` with an `||` fallback:

```ts
interface DatePickerProps extends CommonDatePickerProps {
  value?: string // uncontrolled
  modelValue?: string // controlled
}
```

The v1 plan says: "use `v-model` / `modelValue` for the primary value state."

The `value` prop is a legacy uncontrolled pattern that should be deprecated. Keep exporting it for migration but add a dev-mode warning when `value` is used without `modelValue`.

---

### 3. `DateTimePickerProps` is not exported

`DateTimePicker.vue` defines its extra props inline and does not export a public type:

```ts
// inside DateTimePicker.vue — not in types.ts
interface ExtraDateTimeProps {
  minDateTime?: string
  maxDateTime?: string
  allowCustomTime?: boolean
}
```

`DateTimePickerProps` does not exist in `types.ts` or anywhere in the public surface.

**Fix:** Define and export `DateTimePickerProps` from `types.ts`:

```ts
export interface DateTimePickerProps extends DatePickerProps {
  minDateTime?: string
  maxDateTime?: string
  allowCustomTime?: boolean
}
```

---

### 4. `DateRangePicker` emits the wrong type shape

`DateRangePicker` reuses `DatePickerEmits`:

```ts
export type DatePickerEmits = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}
```

But the actual emitted value is a comma-separated string like `"2025-01-01,2025-01-31"`, not a plain date string. Users who `v-model` bind a range picker receive a comma-separated string and must split it themselves — this is not documented in the types.

**Fix:** Define a separate `DateRangePickerEmits` that makes the format explicit, and document the output format. Consider whether the emitted value should be `string[]` instead of a comma-joined string for a cleaner v1 API.

Option A (keep string, document it):

```ts
export type DateRangePickerEmits = {
  /** Emits a comma-separated "YYYY-MM-DD,YYYY-MM-DD" string, or "" when cleared. */
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}
```

Option B (emit array — breaking change from current):

```ts
export type DateRangePickerEmits = {
  /** Emits [fromDate, toDate] in YYYY-MM-DD format, or [] when cleared. */
  (event: 'update:modelValue', value: [string, string] | []): void
  (event: 'change', value: [string, string] | []): void
}
```

The `modelValue` prop already accepts `string | string[]`, which suggests Option B aligns better with the input shape. **Recommended: choose one and freeze it.**

---

### 5. `clearable` prop ignored by `DateRangePicker`

`clearable` is defined in `CommonDatePickerProps` but `DateRangePicker` never applies it. The Clear footer is always rendered — only the Clear button is disabled when no range is selected.

`DatePicker` wraps its entire footer in `v-if="props.clearable"`. `DateRangePicker` has no such guard.

**Fix:** Add `clearable` to `DateRangePicker`'s `withDefaults` and apply `v-if="props.clearable"` to its footer section, matching `DatePicker`'s behavior.

---

### 6. `useDatePicker` composable is stale and should be deprecated

`useDatePicker.ts` is exported publicly but is not used by any of the three picker components. It uses a 1-based month index and raw `Date` objects — a completely different internal model from the `dayjs`-based approach used by the actual pickers.

The legacy utility functions it depends on (`getDate`, `getDatesAfter`, `getDaysInMonth`, `isLeapYear`) are also exported from `utils.ts` but are only used by this composable.

**Fix:**

- Mark `useDatePicker` as `@deprecated` in its JSDoc and add a dev-mode warning.
- Mark the legacy util exports (`getDate`, `getDatesAfter`, `getDaysInMonth`, `isLeapYear`) as `@deprecated`.
- Keep them exported for the v1 migration window, consistent with the broader deprecation policy.

---

### 7. `defineSlots` missing in `DateTimePicker`

`DatePicker` and `DateRangePicker` both call `defineSlots<{...}>()` with typed slot descriptors. `DateTimePicker` does not call `defineSlots` at all.

**Fix:** Add `defineSlots<{...}>()` to `DateTimePicker` matching the other two pickers.

---

### 8. Missing accessible label on `DateTimePicker` cycle-view button

`DatePicker` and `DateRangePicker` both pass `label="cycle-calendar-view"` to the month/year cycle button, which produces an `aria-label` for screen readers. `DateTimePicker` omits this:

```html
<!-- DateTimePicker.vue — missing label -->
<button variant="ghost" size="sm" @click="cycleView"></button>
```

**Fix:** Add `label="cycle-calendar-view"` to the cycle-view button in `DateTimePicker`.

---

### 9. `defineExpose` only on `DateRangePicker`

`DateRangePicker` exposes `open()` so callers can open it programmatically:

```ts
defineExpose({
  open: () => popoverRef.value?.open(),
})
```

`DatePicker` and `DateTimePicker` expose nothing. If programmatic opening is a supported use case, all three should be consistent.

**Fix:** Either add `defineExpose({ open })` to `DatePicker` and `DateTimePicker` as well, or remove it from `DateRangePicker` and document an alternative pattern. Recommend exposing it on all three for consistency.

---

## API issues to decide before freeze

### Emit format for `DateRangePicker` (comma-string vs array)

**Resolved:** Option B (array). `update:modelValue` and `change` emit `[from, to]` or `[]` (`DateRangeValue`). Internal serializer keeps a comma-joined string for change-tracking only; the public payload is the array.

---

## Code quality note (not a v1 blocker)

All three pickers duplicate approximately 70% of their implementation: navigation (`prev`, `next`, `cycleView`), week grid generation, view state, input handling (`onBlur`, `onEnter`, `activateInput`, `commitInput`), and popover coordination.

This is a maintenance risk. A shared internal composable or a `DatePickerPanel` base component would reduce the surface. This does not need to happen before v1, but should be in the immediate post-v1 roadmap.

---

## v1 target public API

### Shared `CommonDatePickerProps`

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface CommonDatePickerProps {
  // Positioning — aligned with Combobox/Dropdown/Select vocabulary
  side?: PopoverSide // default: 'bottom'
  align?: PopoverAlign // default: 'start'
  offset?: number // default: 4
  /** @deprecated use side + align */
  placement?: DatePickerPlacement

  // Display
  format?: string
  variant?: 'subtle' | 'ghost' | 'outline'
  placeholder?: string
  label?: string

  // Interaction
  readonly?: boolean // prevents typing; popover still opens
  disabled?: boolean // prevents all interaction
  clearable?: boolean
  keepOpen?: boolean // default: false (closes after selection)
  /** @deprecated use keepOpen: true */
  autoClose?: boolean

  // Constraints
  min?: string // YYYY-MM-DD — earliest selectable date
  max?: string // YYYY-MM-DD — latest selectable date
  isDateUnavailable?: (date: Dayjs) => boolean // return true to block a date

  // Deprecated
  /** @deprecated use readonly instead */
  allowCustom?: boolean
  /** @deprecated apply class directly to the component element */
  inputClass?: string | string[] | Record<string, boolean>
}
```

---

### `DatePicker`

```ts
interface DatePickerProps extends CommonDatePickerProps {
  modelValue?: string
  /** @deprecated use modelValue */
  value?: string
}

type DatePickerEmits = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}
```

Slots: `target`, `prefix`, `suffix` (all with `{ togglePopover, isOpen, displayLabel, inputValue }`).

Exposed: `open(): void`

---

### `DateRangePicker`

```ts
interface DateRangePickerProps extends CommonDatePickerProps {
  /** Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection. */
  modelValue?: string[]
  /** @deprecated use modelValue */
  value?: string[]

  /** Render two calendar panels side by side (current month + next month). Default: false. */
  dualPane?: boolean
}

/** Emitted range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */
type DateRangeValue = [string, string] | []

type DateRangePickerEmits = {
  (event: 'update:modelValue', value: DateRangeValue): void
  (event: 'change', value: DateRangeValue): void
}
```

Slots: `target`, `prefix`, `suffix` (same shape as DatePicker).

Exposed: `open(): void`

**`dualPane` rendering rules:**

- Only renders the second panel when `view === 'date'` — cycling to month/year falls back to a single panel to avoid duplicate selectors.
- Right panel always shows the month following `currentMonth` and hides its own prev/Today nav (left panel hides its next nav, so chrome isn't duplicated).

---

### `DateTimePicker`

```ts
interface DateTimePickerProps extends CommonDatePickerProps {
  modelValue?: string
  /** @deprecated use modelValue */
  value?: string
  // min/max/isDateUnavailable are inherited from CommonDatePickerProps.
  // `min`/`max` accept either YYYY-MM-DD or YYYY-MM-DD HH:mm:ss; date-only
  // values get day-level granularity, datetime values second-level.
  /** @deprecated use `min` */
  minDateTime?: string
  /** @deprecated use `max` */
  maxDateTime?: string
  allowCustomTime?: boolean
}
```

Emits: same shape as `DatePickerEmits` (emitted value is `YYYY-MM-DD HH:mm:ss`).

Slots: `target`, `prefix`, `suffix` (same shape as DatePicker).

Exposed: `open(): void`

---

## TimePicker

`TimePicker` was not included in the original DatePicker audit but follows the same popover-trigger pattern and ships the same vocab debt. The fixes mirror the DatePicker family one-for-one.

### Vocab alignment

Same four issues as the DatePicker family:

| Current                                 | v1                                                             |
| --------------------------------------- | -------------------------------------------------------------- |
| `placement: 'bottom-start' \| ...`      | `side` + `align` + `offset` (deprecate `placement`)            |
| `autoClose: boolean` (default `true`)   | `keepOpen: boolean` (default `false`); deprecate `autoClose`   |
| `allowCustom: boolean` (default `true`) | `readonly: boolean` (default `false`); deprecate `allowCustom` |
| `value?: string` (uncontrolled)         | use `modelValue` / `v-model`; deprecate `value`                |

`TimePicker` has no `inputClass` prop, so that fix is N/A.

### Hardcoded chevron icon — already fixed

`TimePicker.vue` previously hardcoded `FeatherIcon[name=chevron-down]` in the suffix slot. This is now a `<span class="lucide-chevron-down">` via the shared Tailwind icon plugin. No further action.

### `readonly` is a new prop

Unlike the DatePicker family, `TimePicker` did not previously expose `readonly`. The default trigger already wires `:readonly="!props.allowCustom"`. v1 adds a proper `readonly` prop and computes the underlying readonly state as `props.readonly || props.allowCustom === false` so existing call sites keep working under the deprecation window.

### Composables stay inlined (for now)

The DatePicker family extracted `usePopoverPositioning`, `useKeepOpen`, and `useDeprecationWarnings` into `DatePicker/composables.ts`. For v1, `TimePicker` inlines the same small bits of logic rather than importing across component boundaries. Post-v1, these should move to a shared `src/composables/` module that both families consume — same refactor as the "shared CalendarPanel" item, just for the popover-trigger plumbing.

### v1 target public API

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface TimePickerProps {
  // Value
  modelValue?: string
  /** @deprecated use modelValue */
  value?: string

  // Positioning
  side?: PopoverSide // default: 'bottom'
  align?: PopoverAlign // default: 'start'
  offset?: number // default: 4
  /** @deprecated use side + align */
  placement?: TimePickerPlacement

  // Display
  placeholder?: string
  variant?: 'outline' | 'subtle'
  use12Hour?: boolean

  // Interaction
  readonly?: boolean // default: false — prevents typing; popover still opens
  disabled?: boolean
  keepOpen?: boolean // default: false (closes after selection)
  /** @deprecated use keepOpen (inverse) */
  autoClose?: boolean

  // Options / constraints
  interval?: number
  options?: Array<{ value: string; label?: string }>
  min?: string // HH:mm[:ss] — minimum selectable time
  max?: string // HH:mm[:ss] — maximum selectable time
  scrollMode?: 'center' | 'start' | 'nearest'

  // Deprecated
  /** @deprecated use readonly */
  allowCustom?: boolean
  /** @deprecated use `min` */
  minTime?: string
  /** @deprecated use `max` */
  maxTime?: string
}

type TimePickerEmits = {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'input-invalid', input: string): void
  (e: 'invalid-change', invalid: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
```

Slots: `prefix`, `suffix` (suffix exposes `{ togglePopover, isOpen }`).

---

## shadcn/ui comparison

shadcn (both React and Vue versions) treats the date picker as a **composition pattern** — users wire together `Popover` + `Calendar` primitives themselves rather than reaching for a single `<DatePicker>` component. The Vue version (`shadcn-vue`) is built on top of `@internationalized/date` and Reka UI.

### Where frappe-ui is ahead

**Monolithic high-level API.** shadcn's composition approach is flexible but puts integration burden on the caller every time. frappe-ui's single `<DatePicker>` component is the right call for this library's audience. The v1 plan explicitly says "keep app-facing public APIs high-level where possible."

**`clearable` with quick-action buttons.** Neither shadcn version documents or ships a clearable/quick-action pattern. frappe-ui's Today/Tomorrow/Clear footer is a practical differentiator — keep it.

**`allowCustom` text input.** shadcn shows typed input as a composition example requiring extra setup. frappe-ui has it built-in.

**`DateTimePicker` as a first-class component.** shadcn shows date+time as a composition example. frappe-ui ships it as a standalone component with proper min/max datetime constraints.

### Where frappe-ui is behind

**`DatePicker` has no `minDate`/`maxDate` props.**
`DateTimePicker` has `minDateTime`/`maxDateTime`, but the plain `DatePicker` has no equivalent. Users cannot restrict the selectable range to future dates, past dates, or a specific window. shadcn-vue exposes `min-value`/`max-value` on `Calendar`.

This is a notable gap. Apps commonly need "no past dates" or "within the next 30 days" constraints. The logic already exists in `DateTimePicker` (the `dateDisabled` function) and just needs to be lifted to `DatePicker`.

**No `isDateUnavailable` callback for arbitrary date disabling.**
shadcn-vue allows disabling specific individual dates. frappe-ui has no mechanism for this — once `minDate`/`maxDate` don't cover the case (e.g., disable weekends, holidays), there is no escape hatch. An `isDateUnavailable?: (date: Dayjs) => boolean` callback would cover all cases including min/max (which can be built on top of it).

**No standalone `Calendar` / inline panel.**
shadcn's `Calendar` component can be used inline without a popover. frappe-ui always wraps the calendar in a `Popover`. There is no way for an app to render the calendar grid directly (e.g., in a card or sidebar filter). This is a post-v1 item, but worth noting.

**No locale or calendar system support.**
shadcn-vue supports 13 calendar systems (Persian, Hebrew, Japanese, etc.) and RTL direction. frappe-ui is hardcoded to Gregorian. This is a post-v1 item.

### Decisions this comparison reaffirms

- Keep the monolithic `<DatePicker>` API (do not decompose into primitives for v1)
- Keep `clearable` as a first-class prop — it's a differentiator
- Keep `DateTimePicker` as a standalone component
- Drop `allowCustom` — `readonly` already covers this

### What to add for v1

**`min` / `max` on `DatePicker` and `DateRangePicker`.** This is a common enough need that it should be in the v1 frozen API. Naming aligns with `Rating` and numeric `TextInput`, which already use `min`/`max`. Add to `CommonDatePickerProps`:

```ts
/** Earliest selectable date (YYYY-MM-DD, or YYYY-MM-DD HH:mm:ss for DateTimePicker). */
min?: string

/** Latest selectable date (YYYY-MM-DD, or YYYY-MM-DD HH:mm:ss for DateTimePicker). */
max?: string
```

Internally, derive a `dateDisabled` function from these (same pattern as `DateTimePicker`). On `DateTimePicker`, `min`/`max` subsume the legacy `minDateTime`/`maxDateTime`, which remain as deprecated aliases. Likewise on `TimePicker`, `min`/`max` replace `minTime`/`maxTime`.

**`isDateUnavailable` callback on all three pickers.** A single predicate is more composable than min/max alone and covers cases they cannot (weekends, holidays, custom business logic):

```ts
/** Return true to prevent a date from being selected. */
isDateUnavailable?: (date: Dayjs) => boolean
```

If both `min`/`max` and `isDateUnavailable` are provided, the internal disabled check combines them (`min`/`max` constraints OR `isDateUnavailable(date)`).

### What is explicitly post-v1

- Standalone `Calendar` panel component (inline usage)
- Locale / calendar system / RTL support

---

## `#actions` slot — sidebar of shortcuts

The current `#actions` slot renders as a ~40px footer at the bottom of the popover. In practice it fits one button and a label, which is not enough for the real shortcut lists callers want to build ("Today", "Last 7 days", "Last 12 months"). The dominant industry pattern (Linear, Notion, GitHub, Asana) puts these in a left sidebar with ~6–8 rows of vertical room.

The current footer `#actions` was added during the v1 refactor and has no published consumers, so it can be repurposed without a deprecation window.

### Decisions

| Decision          | Direction                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Slot name         | `#actions` — kept, matches `Dialog`                                                                            |
| Location          | Left sidebar inside the popover, divided from the calendar by `divide-x divide-outline-gray-2`                 |
| Visibility        | Rendered only when the slot is provided. Calendar layout unchanged otherwise.                                  |
| Styling           | Unstyled. Consumer renders their own button list inside `<aside class="flex flex-col p-2 gap-0.5">`.           |
| Popover width     | Fixed widths (`w-56` on `DatePicker`) switch to `w-fit` when the sidebar is present.                           |
| Footer block      | **Removed** from all three components.                                                                         |
| Auto Clear button | **Removed.** Consumers who want an in-popover Clear write it inside `#actions` using the `clear` slot prop.    |
| `clearable` prop  | Survives. Reduced to an input-level affordance — controls the trigger input's clear `×`, not a popover button. |
| Migration         | None. Behavior-change changelog entry only.                                                                    |

### Slot props

`DatePicker` and `DateTimePicker` reuse their existing slot-prop shapes. `DateRangePickerActionsSlotProps` gains a `setRange` method.

```ts
interface DatePickerActionsSlotProps {
  selected: string // 'YYYY-MM-DD' or ''
  setDate: (date: string | Date | Dayjs) => void
  clear: () => void
  close: () => void
}

interface DateRangePickerActionsSlotProps {
  fromDate: string
  toDate: string

  /** Mirrors a cell click — sets one endpoint at a time. */
  setDate: (date: string | Date | Dayjs) => void

  /** Commits both endpoints atomically; normalizes order. */
  setRange: (range: [string | Date | Dayjs, string | Date | Dayjs]) => void

  clear: () => void
  close: () => void
}

interface DateTimePickerActionsSlotProps extends DatePickerActionsSlotProps {
  time: string // 'HH:mm:ss' or ''
}
```

`setRange` is the only new internal helper. Implementation: parse both inputs through `coerceToDayjs`, validate against `checkUnavailable`, write `fromDate.value` / `toDate.value`, call `ensureOrder()`, then `emitIfChanged()`. Without it, fixed-window presets ("Last 7 days") would have to call `setDate` twice and rely on internal state ordering.

### Behavior

- `setDate` / `setRange` respect `min` / `max` / `isDateUnavailable` — calls with unavailable dates silently no-op.
- `close()` closes the popover unconditionally (ignores `keepOpen`). A consumer calling `close()` is making an explicit choice.
- No internal arrow-key navigation inside the sidebar. Consumer-rendered `<button>`s sit in normal Tab order, before the calendar grid. The grid keeps its own arrow-key navigation.
- `data-slot="actions"` set on the `<aside>` for styling hooks (P10).

### Example

```vue
<DateRangePicker v-model="range">
  <template #actions="{ fromDate, toDate, setRange, clear, close }">
    <button @click="setRange([dayjs(), dayjs()]); close()">Today</button>
    <button @click="setRange([dayjs().subtract(7, 'day'), dayjs()]); close()">
      Last 7 days
    </button>
    <button @click="setRange([dayjs().subtract(28, 'day'), dayjs()]); close()">
      Last 4 weeks
    </button>
    <button @click="setRange([dayjs().subtract(3, 'month'), dayjs()]); close()">
      Last 3 months
    </button>
    <button @click="setRange([dayjs().subtract(12, 'month'), dayjs()]); close()">
      Last 12 months
    </button>
    <hr class="my-1 border-outline-gray-2" />
    <button v-if="fromDate || toDate" @click="clear(); close()">Clear</button>
  </template>
</DateRangePicker>
```

### Open / deferred

- Sidebar a11y as a roving-focus menu — add behind a future opt-in if a real consumer needs it.
- `<ShortcutButton>` helper component — extract post-v1 if consumer patterns converge.
- `#footer` slot for non-shortcut affordances (Apply / Cancel) — purely additive, ship when asked.

---

## Execution checklist

**Vocab alignment**

- [ ] Replace `placement` with `side` + `align` + `offset`; deprecate `placement` with internal mapping
- [ ] Rename `autoClose` → `keepOpen` (default `false`); deprecate `autoClose`
- [ ] Deprecate `allowCustom`; document `readonly` as the replacement
- [ ] Deprecate `inputClass`; document `class` on the component element as the replacement

**Constraints**

- [x] Add `min` / `max` to `CommonDatePickerProps` (all three pickers). On `DateTimePicker`, deprecate `minDateTime`/`maxDateTime` as aliases.
- [x] Add `isDateUnavailable?: (date: Dayjs) => boolean` to `CommonDatePickerProps`
- [x] Lift date-disabling logic from `DateTimePicker` into a shared util; wire it into `DatePicker` and `DateRangePicker`

**Structural fixes**

- [ ] Replace `FeatherIcon` with `LucideChevronDown` in all three pickers
- [ ] Add `DateTimePickerProps` to `types.ts` and export it
- [ ] Define and export `DateRangePickerEmits`; decide comma-string vs `string[]` before freeze
- [ ] Fix `clearable` in `DateRangePicker` (add default `true`, apply `v-if` guard to footer)
- [ ] Add `defineSlots` to `DateTimePicker`
- [ ] Add `label="cycle-calendar-view"` to `DateTimePicker` cycle-view button
- [ ] Add `defineExpose({ open })` to `DatePicker` and `DateTimePicker`

**Deprecations**

- [ ] Add `@deprecated` warning for `value` prop (dev-mode warn, all three pickers)
- [ ] Deprecate `useDatePicker` composable (JSDoc + dev-mode warning)
- [ ] Deprecate legacy util exports: `getDate`, `getDatesAfter`, `getDaysInMonth`, `isLeapYear`

**TimePicker**

- [ ] Add `side` / `align` / `offset` to `TimePickerProps`; deprecate `placement` with internal mapping
- [ ] Add `keepOpen` (default `false`); deprecate `autoClose` with inverse mapping
- [ ] Add `readonly` prop; deprecate `allowCustom`; internal trigger reads `props.readonly || props.allowCustom === false`
- [ ] Add `@deprecated` warning for `value` prop (dev-mode warn)
- [ ] Update `DateTimePicker`'s internal `TimePicker` call site to use `side`/`align`/`readonly` instead of `placement`/`allowCustom`
- [x] Add `min`/`max` props; deprecate `minTime`/`maxTime` with internal fallback

**`#actions` slot relocation**

- [ ] Move `#actions` rendering from footer to left sidebar in `DatePicker`, `DateRangePicker`, `DateTimePicker`
- [ ] Delete the footer `<div v-if="$slots.actions || (clearable && …)">` block from all three components
- [ ] Switch fixed-width popovers to `w-fit` when `$slots.actions` is present
- [ ] Add `setRange(range)` to `DateRangePicker`; expose via the `#actions` slot props
- [ ] Add `data-slot="actions"` to the sidebar `<aside>`
- [ ] Reduce `clearable` to an input-level affordance (no popover Clear button)
- [ ] Update / replace `WithActions` story per picker to show the canonical shortcut list pattern
- [ ] Cypress: slot renders to the left of calendar; click commits via `setDate` / `setRange` + `close`; `setRange` normalizes reversed input; no auto Clear in footer
- [ ] Changelog entry: behavior change — `#actions` moved to sidebar, footer removed, in-popover auto Clear removed

**Docs**

- [ ] Regenerate `docs/meta/DatePicker.md` after API changes
- [ ] Regenerate `docs/meta/TimePicker.md` after API changes
