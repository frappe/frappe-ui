---
'frappe-ui': patch
---

MobileShell: in an installed iOS 26 app, the tab bar now reaches the bottom edge and clears the home indicator; `frappe-ui/style.css` now gives every installed app with a translucent status bar a page at least as tall as the screen, which is what restores the full-screen viewport (fix).
