import type { Component } from 'vue'

export type ItemListSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ItemListItem {
  /** Primary label shown for the item row. */
  label?: string

  /** Stable value for selection state and list keys. */
  value?: string | number | boolean

  /** Optional leading icon for custom row renderers. */
  icon?: string | Component

  /** Supporting text shown below the main label. */
  description?: string

  /** Disables interaction for the item. */
  disabled?: boolean

  /** Marks the item as selected. */
  selected?: boolean

  /** Marks the item as the currently active row. */
  active?: boolean

  /** Named slot suffix used to resolve `item-*` slots dynamically. */
  slot?: string
}

export interface ItemListGroup<TItem extends ItemListItem = ItemListItem> {
  /** Stable key for the group container. */
  key?: string | number

  /** Optional heading shown above the group items. */
  group?: string

  /** Hides the rendered group label while preserving grouping. */
  hideLabel?: boolean

  /** Items rendered inside the group. */
  items: TItem[]
}

export interface ItemListProps<TItem extends ItemListItem = ItemListItem> {
  /** Flat items to render when grouped data is not provided. */
  items?: TItem[]

  /** Explicit grouped data. Takes precedence over `items`. */
  groups?: Array<ItemListGroup<TItem>>

  /** Shared row density applied to every item. */
  size?: ItemListSize

  /** Fallback text rendered when the list is empty. */
  emptyText?: string
}

export interface ItemListItemSlotProps<
  TItem extends ItemListItem = ItemListItem,
> {
  /** Current item being rendered. */
  item: TItem

  /** Group containing the current item. */
  group: ItemListGroup<TItem>
}

export interface ItemListGroupSlotProps<
  TItem extends ItemListItem = ItemListItem,
> {
  /** Group being rendered. */
  group: ItemListGroup<TItem>
}

export interface ItemListSlots<TItem extends ItemListItem = ItemListItem> {
  /** Content rendered before the standard item label. */
  'item-prefix'?: (props: ItemListItemSlotProps<TItem>) => any

  /** Content rendered for the standard item label area. */
  'item-label'?: (props: ItemListItemSlotProps<TItem>) => any

  /** Content rendered after the standard item label. */
  'item-suffix'?: (props: ItemListItemSlotProps<TItem>) => any

  /** Replaces the entire item row. */
  item?: (props: ItemListItemSlotProps<TItem>) => any

  /** Fallback content rendered when there are no items. */
  empty?: () => any

  /** Content rendered below the item list. */
  footer?: () => any

  /** Custom renderer for group labels. */
  'group-label'?: (props: ItemListGroupSlotProps<TItem>) => any

  [slotName: string]: ((props: any) => any) | undefined
}

export interface ItemListEmits<TItem extends ItemListItem = ItemListItem> {
  /** Fired when an enabled item row is clicked. */
  'item-click': [item: TItem]
}

export interface ItemListRowProps {
  /** Element tag or component used for the row wrapper. */
  as?: string | Component

  /** Shared row density preset. */
  size?: ItemListSize

  /** Highlights the row as the current active target. */
  active?: boolean

  /** Highlights the row as selected. */
  selected?: boolean

  /** Disables interaction and applies muted styling. */
  disabled?: boolean
}
