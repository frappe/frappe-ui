/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import Dialog from './Dialog.vue'

async function openDialog(
  props: Record<string, unknown>,
  { body = true } = {},
) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const slots = body ? { default: () => h('p', 'Body') } : {}
  const app = createApp({
    render: () => h(Dialog, { open: true, ...props }, slots),
  })
  app.mount(host)
  await nextTick()
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
  const content = document.querySelector('[data-slot="content"]')
  return { app, content }
}

describe('Dialog description', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  // Most custom dialogs have no `message`. Pointing aria-describedby at a
  // description that never renders is a dangling reference, and reka warns
  // about it every time such a dialog opens.
  it('has no dangling description without a message', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { app, content } = await openDialog({ title: 'Rename' })
    const id = content?.getAttribute('aria-describedby')
    if (id) expect(document.getElementById(id)).not.toBeNull()
    const missing = warn.mock.calls.filter((a) =>
      String(a[0]).includes('Missing `Description`'),
    )
    expect(missing).toEqual([])
    app.unmount()
  })

  it('links the message as the description', async () => {
    const { app, content } = await openDialog(
      { title: 'Delete project', message: 'This cannot be undone.' },
      { body: false },
    )
    const id = content?.getAttribute('aria-describedby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)?.textContent).toContain(
      'This cannot be undone.',
    )
    app.unmount()
  })

  // The default slot replaces the message block, so a dialog with both
  // renders no description either.
  it('has no dangling description when a slot replaces the message', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { app, content } = await openDialog({
      title: 'Rename',
      message: 'Replaced by the slot',
    })
    const id = content?.getAttribute('aria-describedby')
    if (id) expect(document.getElementById(id)).not.toBeNull()
    expect(
      warn.mock.calls.some((a) =>
        String(a[0]).includes('Missing `Description`'),
      ),
    ).toBe(false)
    app.unmount()
  })
})
