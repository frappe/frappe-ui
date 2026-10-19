# CalendarHeatmapChart

Shows a value for each day, with weeks as columns and weekdays as rows.

## A year of days

`date` and `value` name the day and the value of each row. The day is a `Date` or an ISO string such as `2024-03-01`. A time or offset after the date is ignored. A string is the day it spells, but `new Date('2024-03-01')` is UTC midnight, which west of Greenwich is the day before, so build a `Date` with `new Date(y, m, d)`. Days with no row are drawn empty, so gaps show. `format` formats the numbers in the tooltip and on the scale under the calendar.

`weekStart` sets the weekday at the top of each column, `sunday` to `saturday`. Month and weekday names follow the dayjs locale, as the tooltip does, and so does the week start when `weekStart` is not set: Monday in `de` or `en-gb`, Sunday in `en`. An app that stores its own setting, such as Frappe's `first_day_of_the_week`, passes it lowercased.

<ComponentPreview name="Charts-CalendarCommits" csr="true" self-layout />

## Rows on the same day

The chart draws one row per day and does not combine them: of two rows on the same day, the later one is drawn, as on `HeatmapChart`. Sum, count or average per day before the rows reach the chart. `select` reports the day, its value, and the row behind it.

## Longer ranges

`start` and `end` set the days drawn. Each defaults to the first or last day in the data, rounded out to the whole month. Given both, the chart draws the range even when no row falls in it, because an empty year is a reading too. With no data and no range, it shows the empty state. A range of a year or less draws as one band. A longer range draws in bands of twelve months from its first month, so a fiscal year from April is one band, not two halves. Each band has its years beside it: `2024` for a calendar year, `2023–24` for one that crosses into the next. The cells shrink so every band fits the card. Every band lays out twelve whole months, so the months line up from band to band, and only the days in the range are drawn.

<ComponentPreview name="Charts-CalendarYears" csr="true" self-layout />

## Scale

`palette`, `min` and `max` work as on [HeatmapChart](/docs/charts/heatmapchart). The scale covers the days in the range only. When no day is negative, it starts at 0. The ramp starts a step past its palest color, so every day with a row, 0 included, reads darker than a day without one.

One outlier can wash out the rest of the range: a day of 240 among days of 1 to 10 leaves every other day pale. Set `max` to where the ordinary days end. Days above it draw in the deepest color, and the scale reads `≥ 10`, so it does not claim that no day went higher. `min` works the same way at the low end.

The calendar always runs left to right, also in RTL. The header, scale and tooltip follow `dir`.

The calendar is one tab stop. Up and Down move a day, Left and Right a week, and Home and End go to the first and last day. Days with no row are reached as well and read as no data. Enter selects a day with data.

<!-- @include: ./CalendarHeatmapChart.api.md -->
