# TimePicker

An input that picks a time from a list, or takes a typed time. To pick a date
and a time together, use [DateTimePicker](./datepicker#datetime-picker).

<ComponentPreview name="TimePicker-Basic" />

## Examples

### Nightly backup time

`:interval="30"` lists a time every 30 minutes.

<ComponentPreview name="TimePicker-TwentyFour" />

### Class schedule

`options` replaces the generated list with a fixed set of times, each with its
own label.

<ComponentPreview name="TimePicker-CustomOptions" />

### Shift hours

`min` and `max` limit each picker. The end time's `min` is the start time, so
a shift cannot end before it starts.

<ComponentPreview name="TimePicker-Range" />

## Behavior

### Value

The value is a 24-hour `'HH:mm'` string, or `'HH:mm:ss'` when seconds were
typed. `min` and `max` use the same form.

### Display format

`format` is a Dayjs format string for the text in the input. The default is
`HH:mm`. Use `format="h:mm A"` for a 12-hour clock. The value stays in 24-hour
form either way.

### Options

The list has a time every `interval` minutes, 15 by default. `options` takes
`{ value, label? }` items and replaces the generated list.

### Typing a time

People can type a time into the input by default. Set `:typeable="false"` to
allow picking from the list only. Typed text that cannot be read as a time
goes back to the last valid value.

### Suffix slot

`#suffix` replaces the chevron. It receives
`{ open, disabled, setOpen, close }`. Use `setOpen(!open)` for a custom
chevron. `close()` is the same as `setOpen(false)`.

### Labels

`TimePicker` takes `label`, `description`, `error` and `required`, and the
`#label` and `#description` slots.

## Accessibility

The input has `role="combobox"`, `aria-haspopup="listbox"` and
`aria-expanded`, so a screen reader announces that the field opens a list and
whether the list is open.

## Migrating from v0

`minTime` and `maxTime` are now `min` and `max`, `use12Hour` is
`format="h:mm A"`, and `scrollMode` is removed. The `open` and `close` events
are now `update:open`. See the
[migration guide](/docs/migration#datepicker-timepicker-family) and
[TimePicker events](/docs/migration#timepicker-emits) for the full list.

<!-- @include: ./TimePicker.api.md -->
