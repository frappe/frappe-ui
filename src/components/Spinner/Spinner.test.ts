/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Spinner from './Spinner.vue'
import LoadingText from '../LoadingText/LoadingText.vue'

function mount(component: any, props: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  const app = createApp(component, props)
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('Spinner label', () => {
  it('announces "Loading" by default', () => {
    const { host, unmount } = mount(Spinner)
    const svg = host.querySelector('svg')
    expect(svg?.getAttribute('role')).toBe('status')
    expect(svg?.getAttribute('aria-label')).toBe('Loading')
    unmount()
  })

  it('announces a custom or translated label', () => {
    const { host, unmount } = mount(Spinner, { label: 'Syncing' })
    expect(host.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'Syncing',
    )
    unmount()
  })

  it('hides from screen readers with an empty label', () => {
    const { host, unmount } = mount(Spinner, { label: '' })
    const svg = host.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.hasAttribute('role')).toBe(false)
    expect(svg?.hasAttribute('aria-label')).toBe(false)
    unmount()
  })
})

describe('LoadingText', () => {
  it('announces its text once, with a decorative spinner', () => {
    const { host, unmount } = mount(LoadingText, { text: 'Syncing' })
    const status = host.querySelectorAll('[role="status"]')
    expect(status).toHaveLength(1)
    expect(status[0].textContent?.trim()).toBe('Syncing')
    expect(host.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    unmount()
  })
})
