# CalendarHeatmapChart

Shows a value for each day, with weeks as columns and weekdays as rows.

## A year of days

`date` and `value` name the day and the value of each row. The day is a `Date` or an ISO string such as `2024-03-01`. A time or offset after the date is ignored. Days with no row are drawn empty, so gaps show. `format` formats the numbers in the tooltip and on the scale under the calendar.

`weekStart` sets the weekday at the top of each column, `sunday` to `saturday`. It defaults to `sunday`. Month and weekday names follow the dayjs locale, as the tooltip does.

<ComponentPreview name="Charts-CalendarCommits" csr="true" self-layout />

## Rows on the same day

Rows that fall on the same day are summed into one day, so a column of timestamps works as it is. An average or a rate does not sum, so aggregate it per day before it reaches the chart. `select` reports the day, its total, and every row behind it.

## Longer ranges

`start` and `end` set the days drawn. Each defaults to the first or last day in the data. A range of a year or less draws as one band. A longer range draws one band per calendar year, with the year beside it, and the cells shrink so every band fits the card. Each band spans its whole year, so the months line up from year to year, and only the days in the range are drawn.

<ComponentPreview name="Charts-CalendarYears" csr="true" self-layout />

## Scale

`palette`, `min` and `max` work as on [HeatmapChart](/docs/charts/heatmapchart). The scale covers the days in the range only. When no day is negative, it starts at 0, so the smallest day still reads darker than an empty one.

The calendar always runs left to right, also in RTL. The header, scale and tooltip follow `dir`.

<!-- @include: ./CalendarHeatmapChart.api.md -->
