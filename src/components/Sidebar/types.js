/**
 * Read-only collapsed state, provided by `Sidebar` and consumed by
 * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.
 */
export const sidebarCollapsedKey = Symbol('sidebarCollapsed');
/**
 * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by
 * `SidebarCollapseToggle`. Kept separate from {@link sidebarCollapsedKey} so
 * existing read-only consumers need no change.
 */
export const sidebarToggleKey = Symbol('sidebarToggle');
