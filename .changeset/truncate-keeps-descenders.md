---
'frappe-ui': patch
---

Tailwind preset: `truncate` now clips only horizontally, so a tight line height no longer cuts off descenders. Add `overflow-hidden` to an element that relied on `truncate` to hide extra lines vertically, or to keep the old position of an inline-block `truncate`.
