---
'frappe-ui': minor
---

Charts: `DonutChart` and `PercentageBarChart` take `order: 'rows'`, which draws the slices in the order the rows arrive instead of biggest first, for ordered categories such as ageing buckets (additive).
