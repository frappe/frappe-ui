/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import Breadcrumbs from './Breadcrumbs.vue'

function mount(items: Record<string, unknown>[]) {
  const host = document.createElement('div')
  const app = createApp(Breadcrumbs, { items })
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('Breadcrumbs current page', () => {
  it('marks only the last crumb as the current page', () => {
    const { host, unmount } = mount([
      { label: 'Home', href: '/home' },
      { label: 'Library', onClick: () => {} },
      { label: 'Data' },
    ])
    const current = host.querySelectorAll('[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0].textContent?.trim()).toBe('Data')
    unmount()
  })

  it('updates a trail whose crumbs share a label', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const items = ref([
      { label: 'frappe', href: '/org' },
      { label: 'frappe' },
      { label: 'Settings' },
    ])
    const host = document.createElement('div')
    const app = createApp({
      render: () => h(Breadcrumbs, { items: items.value }),
    })
    app.mount(host)

    // Vue compares keys only when it has to match items in the middle of a
    // list, so change both ends of the trail.
    items.value = [
      { label: 'Home', href: '/' },
      { label: 'frappe', href: '/org' },
      { label: 'frappe' },
    ]
    await nextTick()

    expect(host.querySelectorAll('a, button')).toHaveLength(3)
    const duplicateKey = warn.mock.calls.some((args) =>
      String(args[0]).includes('Duplicate keys'),
    )
    expect(duplicateKey).toBe(false)
    warn.mockRestore()
    app.unmount()
  })
})
