import type { Component } from 'vue'

export type ItemListSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ItemListItem {
  label?: string
  value?: string | number | boolean
  icon?: string | Component
  description?: string
  disabled?: boolean
  selected?: boolean
  active?: boolean
  slot?: string
  [key: string]: any
}

export interface ItemListGroup<TItem extends ItemListItem = ItemListItem> {
  key?: string | number
  group?: string
  hideLabel?: boolean
  items: TItem[]
}

export interface ItemListProps<TItem extends ItemListItem = ItemListItem> {
  items?: TItem[]
  groups?: Array<ItemListGroup<TItem>>
  size?: ItemListSize
  emptyText?: string
}

export interface ItemListItemSlotProps<
  TItem extends ItemListItem = ItemListItem,
> {
  item: TItem
  group: ItemListGroup<TItem>
}

export interface ItemListGroupSlotProps<
  TItem extends ItemListItem = ItemListItem,
> {
  group: ItemListGroup<TItem>
}

export interface ItemListEmits<TItem extends ItemListItem = ItemListItem> {
  'item-click': [item: TItem]
}

export interface ItemListRowProps {
  as?: string | Component
  size?: ItemListSize
  active?: boolean
  selected?: boolean
  disabled?: boolean
}
