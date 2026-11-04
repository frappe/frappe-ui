---
'frappe-ui': patch
---

DatePicker, DateTimePicker and DateRangePicker: with a `format`, a typed date of numbers alone reads in that format's day-month-year order. Under `DD-MM-YYYY`, `3-11-2026`, `3/11/26` and `03.11.2026` are 3 November, not 11 March. A date-time can be typed without its seconds or its time. DatePicker and DateTimePicker no longer write a value on a focus and blur with no edit, so a format that hides the seconds keeps them.
