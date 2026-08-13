import { inject, provide } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { CommandPaletteSelectEvent, CommandPaletteValue } from './types'

/**
 * Internal wiring between the composed CommandPalette parts. Not public API —
 * apps interact through props, models, slots and the `data-*` hooks only.
 */
export interface CommandPaletteItemRegistration {
  /** The group the item sits in, or `null` when it sits on its own. */
  groupId: symbol | null
  /** Whether the current query keeps the item on screen. */
  visible: ComputedRef<boolean>
}

export interface CommandPaletteContext {
  /** The palette's `query` model. `CommandPaletteInput` writes to it. */
  query: Ref<string>
  /** The dialog's heading. `CommandPaletteList` names the listbox with it. */
  title: ComputedRef<string>
  /** Whether the client filter runs (ADR-0009). */
  filterable: ComputedRef<boolean>
  /** The value of the item the keyboard is on. */
  activeValue: Ref<CommandPaletteValue | undefined>
  /** True while no item is on screen, hidden by the query or never given. */
  empty: ComputedRef<boolean>
  /** Whether `text` plus `keywords` pass the current query. */
  matches: (text: string, keywords: string[]) => boolean
  /** Registers an item. Returns the unregister function. */
  registerItem: (
    id: symbol,
    registration: CommandPaletteItemRegistration,
  ) => () => void
  /** Whether any item of `groupId` is on screen. */
  groupHasVisibleItems: (groupId: symbol) => boolean
  /** Reports a pick to the palette, which emits `select` and closes. */
  select: (value: CommandPaletteValue, event: CommandPaletteSelectEvent) => void
}

export interface CommandPaletteGroupContext {
  id: symbol
}

const commandPaletteKey: InjectionKey<CommandPaletteContext> = Symbol(
  'frappe-ui:command-palette',
)

const commandPaletteGroupKey: InjectionKey<CommandPaletteGroupContext> = Symbol(
  'frappe-ui:command-palette-group',
)

// Marks the subtree reka renders as the listbox. It carries nothing: a part
// only needs to know whether it is inside it, because outside it reka never
// collects the row and the arrow keys have nothing to walk.
const commandPaletteListKey: InjectionKey<true> = Symbol(
  'frappe-ui:command-palette-list',
)

export function provideCommandPaletteContext(context: CommandPaletteContext) {
  provide(commandPaletteKey, context)
}

export function useCommandPaletteContext() {
  return inject(commandPaletteKey, null)
}

export function provideCommandPaletteGroupContext(
  context: CommandPaletteGroupContext,
) {
  provide(commandPaletteGroupKey, context)
}

export function useCommandPaletteGroupContext() {
  return inject(commandPaletteGroupKey, null)
}

export function provideCommandPaletteListContext() {
  provide(commandPaletteListKey, true)
}

export function useCommandPaletteListContext() {
  return inject(commandPaletteListKey, null)
}
