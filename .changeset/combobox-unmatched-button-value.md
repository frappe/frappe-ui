---
'frappe-ui': patch
---

Combobox: in `trigger="button"` mode, a value that is not in the loaded options
shows as text instead of the placeholder. An empty string value with no matching
option still shows the placeholder.
