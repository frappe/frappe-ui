---
'frappe-ui': minor
---

Duration: the new `largestUnit` and `smallestUnit` props show days
(`1d 2h 3m 4s`) or round to the minute, and the input reads `1d` and `2 days`. A minute field reads a bare `15` as 15 minutes and `1:30` as 1h 30m.
`formatDuration` and `parseDuration` take the same units as an optional last
argument, and the `DurationUnits` type is exported.
