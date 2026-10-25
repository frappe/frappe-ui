---
'frappe-ui': patch
---

useCall, useIsolatedCall: a `GET` request now sends object and array params as
JSON in the query string, so Frappe can parse them (fix).
