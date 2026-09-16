# DatePicker & TimePicker Family Spec

Status: accepted. Describes the shipped v1 contract.

Four components:

- `DatePicker` — one date
- `DateRangePicker` — a start/end range
- `DateTimePicker` — date and time together
- `TimePicker` — a time on its own, and the control `DateTimePicker` embeds

The first three are thin wrappers around two shared parts: `PickerShell`
(`src/components/shared/picker/PickerShell.vue`) owns the trigger input and the
popover, and `DateCalendar` / `DateRangeCalendar` own the grid. `TimePicker`
renders its own `PopoverRoot` and a listbox, because it opens a list of times
rather than a calendar. All four share the props vocabulary, the trigger slots,
and the template-ref surface below.

Types live in `src/components/DatePicker/types.ts` and
`src/components/TimePicker/types.ts`. This document does not repeat the unions.

---

## Props

`CommonDatePickerProps` is the shared base for the three date components. It
extends `InputLabelingProps` (`label`, `description`, `error`, `required`,
`id` — see [`inputs.md`](./inputs.md)) and adds:

| Group | Props |
| --- | --- |
| Position | `side` (default `'bottom'`), `align` (default `'start'`), `offset` (default `4`) |
| Display | `format`, `size`, `variant` (default `'subtle'`), `placeholder` |
| Open state | `open`, `openOnFocus` (default `false`), `openOnClick` (default `true`), `keepOpen` (default `false`) |
| Interaction | `typeable` (default `true`), `disabled` (default `false`), `clearable` (default `true`) |
| Constraints | `min`, `max`, `isDateUnavailable` |

`side` and `align` are re-exported from `Popover`'s `PopoverSide` and
`PopoverAlign`, not redeclared, so the picker cannot drift from
[`popover.md`](./popover.md).

`typeable: false` blocks typing in the trigger input and still lets the user
open the panel and pick a date. It maps to HTML `readonly` on the inner input;
the picker has no `readonly` prop of its own.

`keepOpen: true` leaves the panel open after a selection. Default behavior
closes it.

`clearable: true` lets an empty trigger input clear the value. With
`clearable: false`, an empty input falls back to today's date instead of an
empty value.

`min` and `max` take `YYYY-MM-DD`, or `YYYY-MM-DD HH:mm:ss` on
`DateTimePicker` for second-level granularity. `isDateUnavailable(date)`
returns `true` to block a date; it combines with `min`/`max` rather than
replacing them.

Per-component additions:

- `DatePicker`, `DateTimePicker`: `modelValue?: string`.
- `DateRangePicker`: `modelValue?: DateRangeValue`, and `dualPane` (default
  `false`) to render the current and next month side by side.

A class on the component element reaches the trigger wrapper: `PickerShell`
sets `inheritAttrs: false` and binds `$attrs` to the element around the input.
So `<DatePicker class="w-48" />` sizes the picker.

## Values and emits

`DatePicker` and `DateTimePicker` carry a string: `YYYY-MM-DD` and
`YYYY-MM-DD HH:mm:ss`. `''` means no selection.

`DateRangePicker` carries a tuple or an empty array:

```ts
/** A `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */
export type DateRangeValue = [string, string] | []
```

`DateRangeValue` types both sides of `v-model`, so a value read out of the
model type-checks when it is written back. A one-element array is not a legal
range.

All four components emit `update:modelValue`, `change`, and `update:open`.
`change` fires after the component commits a normalized value.

## Slots

All three date components take the same four slots. The names are `trigger`,
`prefix`, `suffix`, and `actions`.

- `#trigger` replaces the whole trigger input.
- `#prefix` and `#suffix` render inside the default input, before and after the
  text. `#suffix` replaces the built-in chevron.
- `#actions` renders a sidebar to the left of the calendar. See below.

`#trigger`, `#prefix`, and `#suffix` all receive `DatePickerTriggerSlotProps`:
`{ open, disabled, setOpen, close, displayLabel, inputValue }`. `open` is a
boolean; `setOpen(value)` changes it and `close()` is shorthand for
`setOpen(false)`.

`#actions` receives its own per-component shape —
`DatePickerActionsSlotProps`, `DateRangePickerActionsSlotProps`,
`DateTimePickerActionsSlotProps`. Each carries the current selection, the
commit helpers, and the same `{ open, disabled, setOpen }` trio.

`TimePicker` takes `label`, `description`, `prefix`, and `suffix`. Its
`#suffix` receives `{ open, disabled, setOpen, close }`.

## Template ref

All four expose `PickerExposed` from
`src/components/shared/picker/types.ts`:

```ts
interface PickerExposed extends InputExposed {
  /** Opens the panel. A disabled picker stays closed. */
  open: () => void
  /** Closes the panel. */
  close: () => void
  // focus(options?: FocusOptions) comes from InputExposed.
}
```

`open` and `close` are on the ref because a picker owns its trigger, so a
parent's script has no other handle on the panel
([ADR-0012](./adr/0012-template-ref-surface.md)). `focus` is the method every
input guarantees; it focuses the trigger input, or, with a custom `#trigger`,
the first tabbable node the caller rendered.

## Initial open state

A picker mounted with `open` already `true` renders with its panel open. Local
state is seeded from the prop — `ref(props.open === true)` — so the panel is
there on the first render, not one update later.

The panel comes up fully initialized, not just displayed:

- The calendar shows the bound date, and `TimePicker` scrolls to the bound
  time.
- The trigger's `aria-controls` points at the panel.

Both follow from running the open-time work at mount as well as on the
open watch. `PickerShell` runs `emit('open')`, the panel id lookup, and the
`requestFocus` signal from `onMounted`; `TimePicker` runs its own `onOpened()`
there.

Seeding emits no `update:open` at mount. The parent asked for an open panel, so
telling it the panel is open carries no information and would invite a loop.
Later controlled updates and uncontrolled trigger use are unchanged: a parent
flipping `open` from `false` to `true` and back still works, and a picker with
no `open` bound still opens from its trigger.

With a custom `#trigger`, mounting open emits `requestFocus`, so focus moves
into the panel exactly as it does for a later open.

### `open` and `disabled` disagree

`open: true` together with `disabled: true` shows the panel. Both the mount
seed and the `props.open` watch write local state directly, so neither passes
through `setOpen`, which is where the disabled guard lives. The imperative
`open()` on the ref does pass through it and stays a no-op while disabled.

This is current behavior, shipped deliberately: the mount seed matches the
controlled path that already existed, rather than introducing a second rule for
the same prop. Whether `open` should respect `disabled` at all is an open
contract question. It is not settled here, and no runtime behavior changes
until it is.

## The `#actions` sidebar

`#actions` renders a left sidebar inside the panel, divided from the calendar
by `divide-x divide-outline-gray-2`, for date shortcuts ("Today", "Last 7
days", "Last 12 months"). It renders only when the slot is provided; without
it the panel shows the calendar alone. The sidebar is unstyled: the consumer
renders their own buttons inside an `<aside class="flex flex-col p-2 gap-0.5">`
that carries `data-slot="actions"`. Fixed panel widths switch to `w-fit` when
the sidebar is present.

There is no footer and no built-in Clear button inside the panel. A consumer
who wants one writes it in `#actions` using the `clear` slot prop.

`DateRangePicker` gets an extra helper:

```ts
/** Commits one endpoint, mirroring a calendar cell click. */
setDate: (date: string | Date | Dayjs) => void

/** Commits both endpoints atomically, normalizing order. */
setRange: (range: [string | Date | Dayjs, string | Date | Dayjs]) => void
```

`setRange` exists because a fixed-window preset otherwise has to call `setDate`
twice and depend on internal ordering.

Behavior:

- `setDate` and `setRange` honor `min`, `max`, and `isDateUnavailable`. An
  unavailable date is not committed and emits nothing.
- `close()` closes the panel whatever `keepOpen` says. A consumer calling
  `close()` has made an explicit choice.
- The sidebar has no arrow-key navigation of its own. Consumer buttons sit in
  normal tab order, before the calendar grid, which keeps its own arrow keys.

```vue
<DateRangePicker v-model="range">
  <template #actions="{ fromDate, toDate, setRange, clear, close }">
    <button @click="setRange([dayjs(), dayjs()]); close()">Today</button>
    <button @click="setRange([dayjs().subtract(7, 'day'), dayjs()]); close()">
      Last 7 days
    </button>
    <hr class="my-1 border-outline-gray-2" />
    <button v-if="fromDate || toDate" @click="clear(); close()">Clear</button>
  </template>
</DateRangePicker>
```

## TimePicker

`TimePicker` holds a canonical 24-hour value, `HH:mm` or `HH:mm:ss`, and
displays it through `format` (default `'HH:mm'`). Typed text that does not
parse reverts to the last valid value, which the user sees; there are no
`input-invalid` or `invalid-change` events.

`TimePickerProps` carries the same vocabulary as the date family — `side`,
`align`, `offset`, `typeable`, `keepOpen`, `open`, `openOnFocus`,
`openOnClick`, `disabled`, `min`, `max` — plus `interval` (default `15`
minutes) and `options`, which replaces the generated grid with caller-supplied
values. `min` and `max` take `HH:mm[:ss]`.

`TimePicker` is not built on `PickerShell`. It opens a `role="listbox"` of
times rather than a calendar dialog, so its trigger carries
`aria-haspopup="listbox"` and `aria-activedescendant` instead of
`aria-haspopup="dialog"`. Its positioning and `keepOpen` logic are small enough
to inline rather than import across the family boundary. Moving that plumbing
into a shared composable is a post-v1 cleanup, not a contract question.

## Removed before `1.0.0` (historical)

These names were removed under
[ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md), which deletes every
`@deprecated` member before the `1.0.0` tag. They are recorded here so a
migration can be read off the table. They are not coming back.

| Removed | Replacement |
| --- | --- |
| `placement: 'bottom-start' \| …` | `side` + `align` + `offset` |
| `autoClose: boolean` (default `true`) | `keepOpen: boolean` (default `false`), the inverse |
| `allowCustom: boolean` | `typeable: boolean` |
| `readonly: boolean` | `typeable: false` |
| `inputClass` | `class` on the component element |
| `value` (uncontrolled) | `modelValue` / `v-model` |
| `minDateTime` / `maxDateTime` | `min` / `max` |
| `minTime` / `maxTime` (TimePicker) | `min` / `max` |
| `useDatePicker` composable | none; it was unused by every picker |
| `getDate`, `getDatesAfter`, `getDaysInMonth`, `isLeapYear` | none; used only by `useDatePicker` |
| `open` / `close` events (TimePicker) | `update:open`, which carries the state in the payload |

`DateRangePicker` also stopped emitting a comma-joined
`"2025-01-01,2025-01-31"` string. It emits `DateRangeValue`. A comma-joined key
survives internally for change tracking only and is not public.

## Open questions

- **`open` with `disabled`.** See above. `open: true` opens a disabled picker;
  `open()` on the ref does not.
- **`clearable` on `DateRangePicker`.** The prop is declared and defaulted to
  `true`, and nothing reads it. `DatePicker` and `DateTimePicker` both use it to
  decide what an empty input means. Either wire it up or drop it from the range
  picker's props.
- **Locale, calendar systems, RTL.** Hardcoded to Gregorian. Post-v1.
- **A public inline calendar.** `DateCalendar` and `DateRangeCalendar` exist as
  internal components and are deliberately not exported, so there is no
  supported way to render a grid outside a popover. Post-v1.

## Historical: execution checklist

The work this document tracked. Kept for the record; the contract above is what
ships.

**Vocabulary**

- [x] `side` / `align` / `offset` replace `placement`
- [x] `keepOpen` (default `false`) replaces `autoClose`
- [x] `typeable` replaces both `allowCustom` and `readonly` on all four
- [x] `inputClass` removed; `class` on the component element reaches the trigger

**Constraints**

- [x] `min` / `max` on all four components
- [x] `isDateUnavailable?: (date: Dayjs) => boolean` on the three date pickers
- [x] Date-disabling logic lifted into a shared `makeUnavailableCheck`

**Structure**

- [x] `FeatherIcon` replaced by a `lucide-chevron-down` span in the shared shell
- [x] `DateTimePickerProps` defined in `types.ts` and exported
- [x] `DateRangePickerEmits` defined; the tuple shape won over the comma string
- [x] `defineSlots` on `DateTimePicker`
- [x] `label="cycle-calendar-view"` on the cycle-view button, now in `DateCalendar`
- [x] `open()` / `close()` / `focus()` on all four, as `PickerExposed`
- [x] The three date pickers share `PickerShell`, which removed most of the
      duplicated trigger, popover, and input-commit code the audit flagged
- [ ] `clearable` on `DateRangePicker` — declared, never read. Still open.

**Removals**

- [x] `value`, `useDatePicker`, and the legacy date utils deleted (ADR-0008)
- [x] `placement`, `autoClose`, `allowCustom`, `inputClass`, `minDateTime` /
      `maxDateTime`, `minTime` / `maxTime` deleted

**`#actions` sidebar**

- [x] Rendered as a left sidebar in all three date pickers; panel footer deleted
- [x] Fixed-width panels switch to `w-fit` when the slot is present
- [x] `setRange(range)` on `DateRangePicker`
- [x] `data-slot="actions"` on the `<aside>`
- [x] Stories and Cypress coverage per picker

**Initial open state**

- [x] Local open state seeded from `props.open` in all four components
- [x] Open-time work runs from `onMounted` as well as the open watch, so the
      panel comes up initialized
- [x] No `update:open` at mount; controlled and uncontrolled paths unchanged
- [x] Cypress regression cases per picker: mounts open, stays closed on `false`
      and on omission, follows `false` → `true` → `false`, opens from the
      trigger with no `open` bound, emits no `update:open` at mount

**Docs**

- [x] Generated API tables live in colocated `DatePicker.api.md` and
      `TimePicker.api.md`, checked by `yarn docs:check`

## Historical: shadcn/ui comparison

shadcn treats a date picker as a composition pattern — the caller wires
`Popover` and `Calendar` together. The comparison was run to decide whether to
follow. It reaffirmed these choices, which the contract above keeps:

- One high-level `<DatePicker>` component, not a set of primitives.
- `DateTimePicker` as its own component rather than a composition recipe.
- Typed input built in.
- `clearable` as a first-class prop.

It also found three real gaps, all since closed: `min` / `max` on every picker,
`isDateUnavailable` for arbitrary dates, and quick-action shortcuts with room
to render more than one button. What stayed out of v1 — a public inline
calendar, and locale / calendar-system / RTL support — is listed under Open
questions.
