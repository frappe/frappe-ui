// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog.vue'
import {
  useKeyboardShortcut,
  type KeyboardShortcutConfig,
} from '../../composables/useKeyboardShortcut'

/**
 * Mounts the dialog next to a shortcut whose `enabled` getter reads a plain
 * variable. Vue cannot track that read, which is the case an app hits with
 * `document.activeElement`.
 */
function mountDialog(
  enabled: () => boolean,
  extra: KeyboardShortcutConfig[] = [],
  dialogProps: Record<string, unknown> = {},
) {
  const open = ref(false)
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(
    defineComponent({
      setup() {
        useKeyboardShortcut([
          {
            combo: 'Mod+K',
            description: 'Open command palette',
            enabled,
            preventDefault: false,
            handler: () => {},
          },
          ...extra,
        ])
        return () =>
          h(KeyboardShortcutsDialog, {
            ...dialogProps,
            open: open.value,
            'onUpdate:open': (value: boolean) => (open.value = value),
          })
      },
    }),
  )
  app.mount(el)

  async function setOpen(value: boolean) {
    open.value = value
    await nextTick()
    await nextTick()
  }

  return {
    setOpen,
    rows: () => document.body.textContent ?? '',
    search: () =>
      document.querySelector<HTMLInputElement>('[data-slot=search] input'),
    unmount() {
      app.unmount()
      el.remove()
    },
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('<KeyboardShortcutsDialog />', () => {
  it('re-reads an untracked enabled getter on every open', async () => {
    let live = false
    const dialog = mountDialog(() => live)

    await dialog.setOpen(true)
    expect(dialog.rows()).not.toContain('Open command palette')

    await dialog.setOpen(false)
    live = true
    await dialog.setOpen(true)
    expect(dialog.rows()).toContain('Open command palette')

    await dialog.setOpen(false)
    live = false
    await dialog.setOpen(true)
    expect(dialog.rows()).not.toContain('Open command palette')

    dialog.unmount()
  })

  it('names the search field, and clears it on close', async () => {
    // The search appears once the row count passes the threshold.
    const extra: KeyboardShortcutConfig[] = [
      {
        combo: 'Mod+S',
        description: 'Save the page',
        preventDefault: false,
        handler: () => {},
      },
    ]
    const dialog = mountDialog(() => true, extra, { searchThreshold: 1 })

    await dialog.setOpen(true)
    const input = dialog.search()
    expect(input?.getAttribute('aria-label')).toBe('Search shortcuts')

    input!.value = 'save'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(dialog.rows()).not.toContain('Open command palette')

    await dialog.setOpen(false)
    await dialog.setOpen(true)
    expect(dialog.search()?.value).toBe('')
    expect(dialog.rows()).toContain('Open command palette')

    dialog.unmount()
  })

  it('searches what the row draws, not only the combo name', async () => {
    const extra: KeyboardShortcutConfig[] = [
      {
        combo: 'Mod+Slash',
        description: 'Toggle the sidebar',
        preventDefault: false,
        handler: () => {},
      },
    ]
    const dialog = mountDialog(() => true, extra, { searchThreshold: 1 })
    await dialog.setOpen(true)

    const input = dialog.search()!
    async function type(value: string) {
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
    }

    // The row draws `Ctrl /`. A reader who sees `/` types `/`.
    await type('/')
    expect(dialog.rows()).toContain('Toggle the sidebar')
    expect(dialog.rows()).not.toContain('Open command palette')

    // The name behind the glyph still matches.
    await type('slash')
    expect(dialog.rows()).toContain('Toggle the sidebar')

    await type('zzz')
    expect(dialog.rows()).toContain('No shortcuts match your search')

    dialog.unmount()
  })
})
