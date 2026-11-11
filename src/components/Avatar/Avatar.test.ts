/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Avatar from './Avatar.vue'

function mount(props: Record<string, unknown>) {
  const host = document.createElement('div')
  const app = createApp(Avatar, props)
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('Avatar accessibility', () => {
  it('names the initial with the full label', () => {
    const { host, unmount } = mount({ label: 'Jane Cooper' })
    const fallback = host.querySelector('[role="img"]')
    expect(fallback?.getAttribute('aria-label')).toBe('Jane Cooper')
    expect(fallback?.textContent?.trim()).toBe('J')
    unmount()
  })

  it('uses the label as the photo alt text', () => {
    const { host, unmount } = mount({
      label: 'Jane Cooper',
      image: 'https://example.com/jane.png',
    })
    expect(host.querySelector('img')?.getAttribute('alt')).toBe('Jane Cooper')
    unmount()
  })

  it('hides a decorative avatar from screen readers', () => {
    const { host, unmount } = mount({
      label: 'Jane Cooper',
      image: 'https://example.com/jane.png',
      decorative: true,
    })
    const root = host.firstElementChild
    expect(root?.getAttribute('aria-hidden')).toBe('true')
    expect(host.querySelector('img')?.getAttribute('alt')).toBe('')
    unmount()
  })

  it('does not name a decorative initial', () => {
    const { host, unmount } = mount({ label: 'Jane Cooper', decorative: true })
    expect(host.querySelector('[role="img"]')).toBeNull()
    expect(host.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
    unmount()
  })

  it('leaves the root exposed when not decorative', () => {
    const { host, unmount } = mount({ label: 'Jane Cooper' })
    expect(host.firstElementChild?.hasAttribute('aria-hidden')).toBe(false)
    unmount()
  })
})
