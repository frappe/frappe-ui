# DatePicker

Three input fields that open a calendar: `DatePicker` picks a date,
`DateTimePicker` picks a date and a time, and `DateRangePicker` picks a start
and an end date. To pick only a time, use [TimePicker](./timepicker).

<ComponentPlayground name="DatePicker" />

## Examples

### Booking forms {#date-picker}

`DatePicker` with `min` and `max` for flights and birthdays,
`isDateUnavailable` to block weekends and full days, `#actions` for shortcuts
such as "Tomorrow", and `#trigger` for an "Add due date" button on a task.

<ComponentPreview name="DatePicker-Examples" />

### Scheduling a meeting {#datetime-picker}

`DateTimePicker` for a meeting that cannot be in the past, a maintenance window
with a `min` and a `max`, and `#actions` shortcuts that set a date and time.

<ComponentPreview name="DatePicker-DateTime" />

### Time off, stays and reports {#date-range-picker}

`DateRangePicker` with shortcuts in `#actions`, `dual-pane` for hotel stays,
`isDateUnavailable` for a sprint on weekdays only, and a `#trigger` that splits
the range into "Depart" and "Return" fields over one calendar.

<ComponentPreview name="DatePicker-Range" />

## Behavior

### Values

| Picker            | `v-model`                                 |
| ----------------- | ----------------------------------------- |
| `DatePicker`      | `'YYYY-MM-DD'`                            |
| `DateTimePicker`  | `'YYYY-MM-DD HH:mm:ss'`                   |
| `DateRangePicker` | `[from, to]` as `'YYYY-MM-DD'`, or `[]`   |

`format` changes only the text shown in the input, not the value. Type a range
with `DateRangeValue`, exported from `frappe-ui`.

### Limits

`min` and `max` take `'YYYY-MM-DD'`. `DateTimePicker` also takes
`'YYYY-MM-DD HH:mm:ss'`. `isDateUnavailable` receives each date as a Dayjs
object and returns `true` to block it. It works together with `min` and
`max`.

### Typing a date

People can type a date into the input by default. Set `:typeable="false"` to
allow picking from the calendar only. On `DateTimePicker`, `typeable` covers
both the date and the time inputs.

### Clearing

`clearable` is `true` by default, and an empty input clears the value. On
`DatePicker` and `DateTimePicker`, `:clearable="false"` fills an empty input
with today's date (and the current time) instead. `DateRangePicker` does not
read `clearable`: emptying its input always clears the range.

### Closing

The popover closes after a date is picked. Set `keep-open` to keep it open.
`DateTimePicker` stays open after a date click, because the time is still
missing, and moves focus to the time input.

### Label, description and error

`label` renders above the field and `description` below it. `error` renders
below the field and hides `description`. It takes a string, an array of strings
(one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label and sets `required` on the
`<input>`.

The pickers have no `#label` or `#description` slot. A `#trigger` slot
replaces the input, and the label, description and error go with it.

### Slots

`#trigger`, `#prefix` and `#suffix` receive
`{ open, disabled, setOpen, close, displayLabel, inputValue }`. `close()` is
the same as `setOpen(false)`.

`#actions` renders a column of shortcuts beside the calendar. It receives
`open`, `disabled`, `setOpen`, `close` and `clear`, plus:

| Picker            | Extra `#actions` props                          |
| ----------------- | ----------------------------------------------- |
| `DatePicker`      | `selected`, `setDate`                           |
| `DateTimePicker`  | `selected`, `time`, `setDate`                   |
| `DateRangePicker` | `fromDate`, `toDate`, `setDate`, `setRange`     |

## Accessibility

The input has `role="combobox"`, `aria-haspopup="dialog"` and
`aria-expanded`, so a screen reader announces that the field opens a panel and
whether the panel is open.

<!-- @include: ./DatePicker.api.md -->
