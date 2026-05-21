import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export const sidebarCollapsedKey: InjectionKey<ComputedRef<boolean>> =
  Symbol('sidebarCollapsed')

export type SidebarHeaderProps = {
  title: string
  subtitle?: string
  logo?: any // Icon component or image string
  menuItems?: {
    label: string
    icon: any // Icon component
    onClick?: () => void
  }[]
}

export type SidebarItemProps = {
  label: string
  accessKey?: string
  icon?: any // Icon component
  suffix?: string
  to?: RouteLocationRaw
  isActive?: boolean
  onClick?: () => void
  condition?: MaybeRefOrGetter<boolean>
}

export type SidebarSectionProps = {
  label?: string
  items: SidebarItemProps[]
  collapsible?: boolean
}

export type SidebarProps = {
  header?: SidebarHeaderProps
  sections?: SidebarSectionProps[]
  disableCollapse?: boolean
}
