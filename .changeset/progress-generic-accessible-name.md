---
'frappe-ui': patch
---

Progress: a bar without a `label` now has the accessible name "Progress" instead
of its percentage, so screen readers do not read the value twice (fix).
