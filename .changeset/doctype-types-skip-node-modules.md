---
'frappe-ui': patch
---

Vite: `frappeTypes` finds doctype files in one pass over the app and skips `node_modules` and dot folders. Type generation on dev start no longer takes minutes in apps with a large `node_modules`.
