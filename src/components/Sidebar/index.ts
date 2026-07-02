export { default as Sidebar } from './Sidebar.vue'
export { default as SidebarItem } from './SidebarItem.vue'
export { default as SidebarLabel } from './SidebarLabel.vue'
export { default as SidebarCollapseToggle } from './SidebarCollapseToggle.vue'
export { default as SidebarHeader } from './SidebarHeader.vue'
// Legacy adapter for the deprecated `sections` config prop.
export { default as SidebarSection } from './SidebarSection.vue'

export type {
  SidebarProps,
  SidebarItemProps,
  SidebarLabelProps,
  SidebarHeaderProps,
  SidebarSectionProps,
} from './types'
export { sidebarCollapsedKey, sidebarToggleKey } from './types'
