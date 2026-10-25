---
'frappe-ui': patch
---

HeatmapChart: when no value is negative, the color scale now starts at 0 instead of at the smallest value, so the smallest cell no longer draws as pale as an empty one; set `min` for the old scale (fix).
