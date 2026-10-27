import { describe, expect, it } from 'vitest'
import { menuClasses } from './utils'

describe('menuClasses.content', () => {
  // Without the cap, a long Dropdown or ContextMenu runs off the viewport and
  // its last items can't be reached.
  it('caps the menu to the available height and scrolls', () => {
    expect(menuClasses.content).toContain(
      'max-h-[var(--reka-popper-available-height)]',
    )
    expect(menuClasses.content).toContain('overflow-y-auto')
  })
})
