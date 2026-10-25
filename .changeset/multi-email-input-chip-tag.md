---
'frappe-ui': patch
---

MultiEmailInput: chips now use the design system's tag size, with a 20px height, a 12px avatar and a 12px close icon. The suggestion list no longer opens empty: it stays closed on focus when there is nothing to suggest, and while a typed address matches nothing, unless `emptyText` or the `empty` slot is set. A click reopens it after Escape.
