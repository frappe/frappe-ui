# DatePicker

A set of pickers for selecting dates, date ranges, or date and time. Smooth, intuitive interfaces make choosing and adjusting values quick and precise.

## Date Picker
<ComponentPreview name="DatePicker-Examples" />

## DateTime Picker
<ComponentPreview name="DatePicker-DateTime" />

## Date Range Picker
<ComponentPreview name="DatePicker-Range" />

## Natural Language Input
All three pickers parse typed phrases like `tomorrow` or `may 4`. The phrase commits on Enter or blur. A strict `format` match wins over the parser. Set `:natural-language="false"` to opt out.

<ComponentPreview name="DatePicker-NaturalLanguage" />

Single dates (`DatePicker`, `DateTimePicker`):

| Phrase | Result |
| --- | --- |
| `today`, `now`, `tomorrow`, `tmrw`, `yesterday` | That day |
| `monday` … `sunday` | Next occurrence after today |
| `next friday`, `last monday` | That weekday in that direction |
| `next week`, `last month`, `next year` | Today shifted by one unit |
| `in 3 days`, `2 weeks ago` | Relative offset from today |
| `+5d`, `-2w`, `+1m`, `+1y` | Signed shorthand offset |
| `15th` | That day in the current month |
| `may 4`, `4 may`, `may 4 2025` | Month and day; current year unless given |

Ranges (`DateRangePicker`):

| Phrase | Result |
| --- | --- |
| `today`, `tomorrow`, `yesterday` | A single-day range |
| `this week`, `last month`, `next quarter` | The whole unit. `next week` is a full week here, one day in `DatePicker` |
| `last 7 days`, `next 2 weeks` | A window that starts or ends today |
| `since may 4` | From that date to today |
| `may 4 to may 26` | Two phrases joined by `to` or a dash |

<!-- @include: ./DatePicker.api.md -->
