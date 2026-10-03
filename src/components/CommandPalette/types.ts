import type { Component } from 'vue'

export interface CommandPaletteItemData {
  name: string
  title: string
  description?: string
  icon?: Component
  disabled?: boolean
  [key: string]: unknown
}

export interface CommandPaletteGroup {
  title: string
  items: CommandPaletteItemData[]
  component?: Component
  hideTitle?: boolean
}
