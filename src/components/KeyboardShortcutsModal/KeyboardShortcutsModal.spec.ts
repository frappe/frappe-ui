// @vitest-environment jsdom
/**
 * Unit tests for KeyboardShortcutsModal behaviour.
 *
 * The modal's grouping and merge-identity rendering is entirely driven by
 * `getActiveShortcuts()`. These tests verify that composable's output so we
 * can assert the modal will display the right data without needing to render
 * the full dialog in jsdom.
 *
 * Search-threshold and full-DOM rendering are covered by Cypress e2e tests.
 */
import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, nextTick } from 'vue'
import {
  getActiveShortcuts,
  useShortcut,
  type ShortcutConfig,
} from '../../composables/useShortcut'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function registerShortcuts(
  shortcuts: ShortcutConfig | ShortcutConfig[],
): { unmount: () => void } {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(
    defineComponent({
      setup() {
        useShortcut(shortcuts)
      },
      template: '<div/>',
    }),
  )
  app.mount(el)
  return {
    unmount() {
      app.unmount()
      el.remove()
    },
  }
}

// ---------------------------------------------------------------------------
// Grouping — shortcuts appear under the correct group name
// ---------------------------------------------------------------------------

describe('KeyboardShortcutsModal — grouping (via getActiveShortcuts)', () => {
  it('groups shortcuts by their group name', async () => {
    const active = getActiveShortcuts()
    const { unmount } = registerShortcuts([
      { key: 'a', description: 'Action A', group: 'Alpha', handler: () => {} },
      { key: 'b', description: 'Action B', group: 'Beta', handler: () => {} },
      { key: 'c', description: 'Action C', group: 'Alpha', handler: () => {} },
    ])
    await nextTick()

    const alphaShortcuts = active.value.filter((s) => s.group === 'Alpha')
    const betaShortcuts = active.value.filter((s) => s.group === 'Beta')
    expect(alphaShortcuts).toHaveLength(2)
    expect(betaShortcuts).toHaveLength(1)

    unmount()
  })

  it('defaults to "General" when no group is specified', async () => {
    const active = getActiveShortcuts()
    const { unmount } = registerShortcuts({
      key: 'g',
      description: 'Ungrouped action',
      handler: () => {},
    })
    await nextTick()

    const entry = active.value.find((s) => s.description === 'Ungrouped action')
    expect(entry).toBeDefined()
    expect(entry!.group).toBe('General')

    unmount()
  })
})

// ---------------------------------------------------------------------------
// Merge identity — two shortcuts with the same group/description/modifiers
// are collapsed into a single entry with multiple keys (shown as alt combos).
// ---------------------------------------------------------------------------

describe('KeyboardShortcutsModal — merge identity (via getActiveShortcuts)', () => {
  it('merges two shortcuts with the same identity into one entry with both keys', async () => {
    const active = getActiveShortcuts()
    const { unmount } = registerShortcuts([
      {
        key: 'ArrowUp',
        description: 'Move selection up',
        group: 'Canvas',
        handler: () => {},
      },
      {
        key: 'k',
        description: 'Move selection up',
        group: 'Canvas',
        handler: () => {},
      },
    ])
    await nextTick()

    const merged = active.value.find((s) => s.description === 'Move selection up')
    expect(merged).toBeDefined()
    expect(merged!.keys).toHaveLength(2)
    expect(merged!.keys).toContain('ArrowUp')
    expect(merged!.keys).toContain('k')

    unmount()
  })

  it('does not merge shortcuts with different modifier keys', async () => {
    const active = getActiveShortcuts()
    const { unmount } = registerShortcuts([
      { key: 'z', ctrl: true, description: 'Undo', group: 'Edit', handler: () => {} },
      { key: 'z', ctrl: true, shift: true, description: 'Undo', group: 'Edit', handler: () => {} },
    ])
    await nextTick()

    const undos = active.value.filter((s) => s.description === 'Undo')
    // Shift modifier differs -> two separate entries
    expect(undos).toHaveLength(2)

    unmount()
  })

  it('does not merge shortcuts in different groups even if description matches', async () => {
    const active = getActiveShortcuts()
    const { unmount } = registerShortcuts([
      { key: 'x', description: 'Cut', group: 'Edit', handler: () => {} },
      { key: 'x', description: 'Cut', group: 'Canvas', handler: () => {} },
    ])
    await nextTick()

    const cuts = active.value.filter((s) => s.description === 'Cut')
    expect(cuts).toHaveLength(2)

    unmount()
  })
})
