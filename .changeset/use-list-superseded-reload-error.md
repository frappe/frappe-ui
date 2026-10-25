---
'frappe-ui': patch
---

useList: a fetch that a newer fetch replaces, such as the first of two quick `reload()` calls, no longer sets `error` or calls `onError` (fix).
