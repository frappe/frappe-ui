---
'frappe-ui': patch
---

MobileShell: in an installed PWA on iOS 26, the tab bar now reaches the bottom edge and clears the home indicator by the safe-area inset, without a strip of page background below it; the viewport fix lives in `frappe-ui/style.css` (fix).
