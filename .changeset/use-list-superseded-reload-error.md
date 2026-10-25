---
'frappe-ui': patch
---

useList, useCall: a request that a newer request replaces, such as the first of two quick `reload()` calls, no longer sets `error` or calls `onError`.
