# DatePicker

A set of pickers for selecting dates, date ranges, or date and time. Smooth, intuitive interfaces make choosing and adjusting values quick and precise.

## Date Picker
<ComponentPreview name="DatePicker-Examples" />

## DateTime Picker
<ComponentPreview name="DatePicker-DateTime" />

## Date Range Picker
<ComponentPreview name="DatePicker-Range" />

## Date Calendar

The calendar the three pickers render inside their popover, on the page instead
of in one. It owns a single date as `v-model` and takes the same `min`, `max`
and `isDateUnavailable` constraints.

<ComponentPreview name="DatePicker-DateCalendar" />

## Date Range Calendar

The range twin of the same calendar, on the page instead of in a popover. It
owns a `[from, to]` pair as `v-model`, previews the range under the cursor while
the end is still open, and takes the same constraints.

<ComponentPreview name="DatePicker-DateRangeCalendar" />

<!-- @include: ./DatePicker.api.md -->
