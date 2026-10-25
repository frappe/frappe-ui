---
'frappe-ui': minor
---

Duration: the new `largestUnit` and `smallestUnit` props show days
(`1d 2h 3m 4s`) or round to the minute, and the input reads `1d` and `2 days`
(additive). `formatDuration` takes the same units as an optional third argument,
and the `DurationUnits` type is exported.
