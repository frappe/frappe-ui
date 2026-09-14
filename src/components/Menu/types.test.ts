import { describe, expectTypeOf, it } from 'vitest'
import type { ContextMenuSlots } from '../ContextMenu/types'
import type { DropdownSlots } from '../Dropdown/types'
import type { MenuItemSlotProps, MenuSlots } from './types'

const renderItem = (props: MenuItemSlotProps) => props.item.label

const menuSlots: MenuSlots = {
  item: renderItem,
  'item-prefix': renderItem,
  'item-project': renderItem,
}

const dropdownSlots: DropdownSlots = {
  trigger: ({ open, disabled, setOpen, close }) => {
    setOpen(!open)
    if (disabled) close()
  },
  'item-project': renderItem,
}

const contextMenuSlots: ContextMenuSlots = {
  trigger: ({ open, setOpen, close }) => {
    setOpen(!open)
    close()
  },
  'item-project': renderItem,
}

// @ts-expect-error Misspelled fixed slots must not be accepted.
const invalidMenuSlots: MenuSlots = { itemPrefix: renderItem }

// @ts-expect-error Dynamic item slots require the `item-` prefix.
const invalidDropdownSlots: DropdownSlots = { project: renderItem }

// @ts-expect-error ContextMenu has the same closed slot vocabulary.
const invalidContextMenuSlots: ContextMenuSlots = { groupLabel: renderItem }

void invalidMenuSlots
void invalidDropdownSlots
void invalidContextMenuSlots

describe('menu-family slot types', () => {
  it('keep fixed and item-prefixed dynamic slots', () => {
    expectTypeOf(menuSlots).toMatchTypeOf<MenuSlots>()
    expectTypeOf(dropdownSlots).toMatchTypeOf<DropdownSlots>()
    expectTypeOf(contextMenuSlots).toMatchTypeOf<ContextMenuSlots>()
  })
})
