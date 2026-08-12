// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog.vue'
import { useKeyboardShortcut } from '../../composables/useKeyboardShortcut'

/**
 * Mounts the dialog next to a shortcut whose `enabled` getter reads a plain
 * variable. Vue cannot track that read, which is the case an app hits with
 * `document.activeElement`.
 */
function mountDialog(enabled: () => boolean) {
  const open = ref(false)
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(
    defineComponent({
      setup() {
        useKeyboardShortcut({
          combo: 'Mod+K',
          description: 'Open command palette',
          enabled,
          preventDefault: false,
          handler: () => {},
        })
        return () =>
          h(KeyboardShortcutsDialog, {
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
})
