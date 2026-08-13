import type { AcceptableValue } from 'reka-ui'
import type { Component } from 'vue'

/**
 * A value a `CommandPaletteItem` can carry. The palette hands it back
 * untouched in `select`, so most apps pass their own command object.
 */
export type CommandPaletteValue = AcceptableValue

/**
 * The event `CommandPalette` and `CommandPaletteItem` emit on `select`.
 *
 * `detail.originalEvent` is the click that picked the item, so a caller can
 * read `metaKey`, `ctrlKey`, `shiftKey` and `button`. Call `preventDefault()`
 * on the event itself to keep the palette open.
 */
export type CommandPaletteSelectEvent = CustomEvent<{
  originalEvent: PointerEvent
  value?: CommandPaletteValue
}>

export interface CommandPaletteProps {
  /**
   * Filter the items against the query on the client. Set it to `false` when a
   * server search already decided what matches (ADR-0009), then refetch on
   * `update:query` yourself.
   */
  filterable?: boolean
  /**
   * The dialog's accessible name, and the list's. It is read by screen readers
   * and never drawn, because the palette's shell has no header.
   */
  title?: string
}

export interface CommandPaletteEmits {
  /**
   * Fired when the user picks an item. The palette closes right after, unless
   * the handler calls `event.preventDefault()`.
   */
  select: [value: CommandPaletteValue, event: CommandPaletteSelectEvent]
}

export interface CommandPaletteSlotProps {
  /** The current search text. */
  query: string
  /** The value of the item the keyboard is on, or `undefined`. */
  active: CommandPaletteValue | undefined
  /** Whether no item is on screen, hidden by the query or never given. */
  empty: boolean
}

export interface CommandPaletteInputProps {
  /** Placeholder text for the search field. */
  placeholder?: string
}

export interface CommandPaletteGroupProps {
  /** Heading above the group's items. Leave it out to group without a heading. */
  label?: string
}

export interface CommandPaletteItemProps {
  /** The value the palette reports in `select`. */
  value: CommandPaletteValue
  /**
   * Text the client filter matches. It defaults to the item's own rendered
   * text, so set it only when the default slot draws more than the label.
   * An item that draws no text at all has to set it, or the filter can never
   * narrow it away.
   */
  label?: string
  /** Extra words the client filter matches, on top of the label. */
  keywords?: string[]
  /** Stop the user picking this item. */
  disabled?: boolean
  /**
   * Element the item renders as. Use `a` with an `href` for a real link, so
   * middle-click and modifier-click open a new tab.
   */
  as?: string | Component
}

export interface CommandPaletteItemEmits {
  /**
   * Fired when this item is picked, before the palette's own `select`. Call
   * `event.preventDefault()` to keep the palette open.
   */
  select: [event: CommandPaletteSelectEvent]
}

export interface CommandPaletteItemSlotProps {
  /** Whether the keyboard or the pointer is on this item. */
  active: boolean
  /** Whether the item cannot be picked. */
  disabled: boolean
}

export interface CommandPaletteEmptySlotProps {
  /** The current search text. */
  query: string
}

export interface CommandPaletteFooterSlotProps {
  /** The value of the item the keyboard is on, or `undefined`. */
  active: CommandPaletteValue | undefined
}
