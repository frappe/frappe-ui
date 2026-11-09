---
'frappe-ui': patch
---

Editor: an embed's `src` is now checked against the embed allowlist when the content is loaded as JSON, set with `setContent`, or received from a collaborator, not only when it is parsed from HTML. Embeds that point to the app's own origin are refused.
