---
'frappe-ui': patch
---

DatePicker: a typed date without a year, such as `15 oct`, now resolves to the
current year. It used to resolve to 2001 in Chrome.
