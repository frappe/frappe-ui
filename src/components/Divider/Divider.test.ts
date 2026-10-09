/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Divider from './Divider.vue'

function mount(props: Record<string, unknown>) {
  const host = document.createElement('div')
  const app = createApp(Divider, props)
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('Divider orientation', () => {
  it('marks a vertical rule as vertical for screen readers', () => {
    const { host, unmount } = mount({ orientation: 'vertical' })
    expect(host.querySelector('hr')?.getAttribute('aria-orientation')).toBe(
      'vertical',
    )
    unmount()
  })

  it('leaves a horizontal rule on the native default', () => {
    const { host, unmount } = mount({})
    expect(host.querySelector('hr')?.hasAttribute('aria-orientation')).toBe(
      false,
    )
    unmount()
  })
})
