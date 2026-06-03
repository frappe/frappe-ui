import type { Component } from 'vue'
import type { DialogSize } from '../Dialog/types'
import type { SidebarItemProps, SidebarSectionProps } from '../Sidebar/types'

/**
 * A single navigable settings tab shown in the dialog sidebar. Extends the
 * sidebar item contract, adding an optional `component` rendered in the content
 * area when the tab is active.
 */
export type SettingsTab = SidebarItemProps & {
  /** Component rendered in the content area when this tab is active. */
  component?: Component
}

/** A labelled group of settings tabs rendered as one sidebar section. */
export type SettingsSection = Omit<SidebarSectionProps, 'items'> & {
  items: SettingsTab[]
}

export interface SettingsDialogProps {
  /**
   * Sidebar sections to render. Each item may carry a `component` that is
   * shown in the content area when the item is selected.
   */
  sections: SettingsSection[]

  /** Max-width size of the dialog. */
  size?: DialogSize
}

export interface SettingsDialogEmits {
  /** Fired when the dialog is opened or closed. */
  'update:modelValue': [value: boolean]
}

export interface SettingsPanelProps {
  /** Heading rendered at the top of the panel. */
  title: string

  /** Optional sub-heading rendered below the title. */
  description?: string
}
