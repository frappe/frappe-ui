---
'frappe-ui': patch
---

useCall: handle standard Frappe `/api/method` response envelope with `message` property. When Frappe methods return `{ message: ... }` without a top-level `data` field, `useCall` now transparently maps `message` to `data` so `data.value`, `onSuccess`, `transform`, `submit()`, and `execute()` work as expected.
