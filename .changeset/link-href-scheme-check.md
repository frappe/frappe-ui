---
'frappe-ui': patch
---

SidebarItem, SidebarRailItem, MobileNavItem, Breadcrumbs, ListRow and CommandPaletteItem: an `href` is rendered only when it is relative or uses `http`, `https`, `mailto` or `tel`. Other schemes leave the link without an `href`.
