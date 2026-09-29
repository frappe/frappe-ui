/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp, h } from 'vue'
import Badge from './Badge.vue'

function mount(props: Record<string, unknown>, slots = {}) {
  const host = document.createElement('div')
  const app = createApp({ render: () => h(Badge, props, slots) })
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('Badge markup', () => {
  it('renders spans only, so it is valid inside text', () => {
    const { host, unmount } = mount(
      { label: 'Open' },
      { prefix: () => h('i'), suffix: () => h('i') },
    )
    expect(host.firstElementChild?.tagName).toBe('SPAN')
    expect(host.querySelectorAll('div')).toHaveLength(0)
    unmount()
  })

  it('wraps the label in a truncating span', () => {
    const { host, unmount } = mount({ label: 'Overdue by 3 days' })
    const label = host.querySelector('.truncate')
    expect(label?.textContent).toBe('Overdue by 3 days')
    expect(label?.classList.contains('min-w-0')).toBe(true)
    unmount()
  })

  it('truncates default slot content the same way', () => {
    const { host, unmount } = mount({}, { default: () => 'May 16, Friday' })
    expect(host.querySelector('.truncate')?.textContent).toBe('May 16, Friday')
    unmount()
  })
})
