import { RouterLinkProps } from 'vue-router'
import { type Component } from 'vue'

export type ContextMenuItem = {
    label: string
    icon?: string | Component | null
    disabled?: boolean
    hidden?: boolean
    theme?: string
    component?: any
    onClick?: (val: any) => void
    route?: RouterLinkProps['to']
    condition?: () => boolean
    submenu?: ContextMenuItems
    separator?: boolean
    shortcut?: string
    showTooltip?: boolean
}

export type ContextMenuGroupItem = {
    key?: number
    group: string
    items: ContextMenuItem[]
    hideLabel?: boolean
    theme?: string
}

export type ContextMenuItemType = ContextMenuItem | ContextMenuGroupItem

export type ContextMenuItems = Array<ContextMenuItemType>

export interface ContextMenuProps {
    items?: ContextMenuItems
    disabled?: boolean
    showTooltip?: boolean | ((label: string) => boolean)
}
