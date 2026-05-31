import type { Component } from 'vue'
import type { SidebarItemProps, SidebarSectionProps } from '../Sidebar/types'

export type SettingsItem = SidebarItemProps & { component?: Component }
export type SettingsSection = Omit<SidebarSectionProps, 'items'> & {
  items: SettingsItem[]
}
