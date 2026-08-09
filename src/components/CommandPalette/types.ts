import type { Component } from 'vue'

export interface CommandPaletteItemData {
  /** Unique key across all groups. */
  name: string
  /** Primary label. */
  title: string
  /** Secondary text shown right-aligned. */
  description?: string
  icon?: string | Component
  disabled?: boolean
  [key: string]: unknown
}

export interface CommandPaletteGroup {
  /** Heading shown above the group's items. */
  title: string
  /** Hide the heading while still grouping items under it. */
  hideTitle?: boolean
  items: CommandPaletteItemData[]
  /**
   * Component used to render each item, receiving `item` and `active` props.
   * Defaults to the built-in `CommandPaletteItem` (title + icon + description).
   */
  component?: Component
}

export interface CommandPaletteProps {
  /** Groups of items to search and pick from. */
  groups?: CommandPaletteGroup[]
}

export interface CommandPaletteEmits {
  /** Fired when an item is picked. The palette closes right after. */
  select: [item: CommandPaletteItemData]
}
