/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import SplitButton from './SplitButton.vue'

const options = [
  { label: 'Publish to staging', onClick: () => {} },
  { label: 'Unpublish', onClick: () => {} },
]

let cleanup: (() => void) | undefined
afterEach(() => cleanup?.())

function mount(props: Record<string, unknown>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () => h(SplitButton, { label: 'Publish', options, ...props }),
  })
  // Menu items can take a `route`, so an open menu looks for a router.
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })
  router.push('/')
  app.use(router)
  app.mount(host)
  cleanup = () => {
    app.unmount()
    host.remove()
  }
  const [action, chevron] = Array.from(host.querySelectorAll('button'))
  return { host, action, chevron }
}

describe('SplitButton', () => {
  it('renders the action and a chevron that opens a menu', () => {
    const { action, chevron } = mount({})
    expect(action.textContent).toContain('Publish')
    expect(chevron.getAttribute('aria-haspopup')).toBe('menu')
    expect(chevron.getAttribute('aria-expanded')).toBe('false')
  })

  it('names the chevron "More options", or menuLabel when set', () => {
    expect(mount({}).chevron.getAttribute('aria-label')).toBe('More options')
    cleanup?.()
    const { chevron } = mount({ menuLabel: 'More ways to publish' })
    expect(chevron.getAttribute('aria-label')).toBe('More ways to publish')
  })

  it('emits click from the action, not from the chevron', async () => {
    const onClick = vi.fn()
    const { action, chevron } = mount({ onClick })
    action.click()
    chevron.click()
    await nextTick()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('disables both halves when disabled', () => {
    const { action, chevron } = mount({ disabled: true })
    expect(action.disabled).toBe(true)
    expect(chevron.disabled).toBe(true)
  })

  it('disables both halves while loading, and marks the action busy', () => {
    const { action, chevron } = mount({ loading: true })
    expect(action.disabled).toBe(true)
    expect(action.getAttribute('aria-busy')).toBe('true')
    expect(chevron.disabled).toBe(true)
  })

  it('squares the inner corners so the halves read as one control', () => {
    const { action, chevron } = mount({})
    expect(action.className).toContain('rounded-r-none')
    expect(chevron.className).toContain('rounded-l-none')
  })

  it('overlaps outline halves by one border instead of leaving a gap', () => {
    const { host, chevron } = mount({ variant: 'outline' })
    const root = host.querySelector('[data-slot="root"]')!
    expect(root.className).not.toContain('gap-px')
    expect(chevron.className).toContain('-ml-px')
  })

  it('passes variant, theme and size to both halves and the root', () => {
    const { host, action, chevron } = mount({
      variant: 'solid',
      theme: 'red',
      size: 'md',
    })
    const root = host.querySelector('[data-slot="root"]')!
    expect(root.getAttribute('data-variant')).toBe('solid')
    expect(root.getAttribute('data-color')).toBe('red')
    expect(root.getAttribute('data-size')).toBe('md')
    for (const half of [action, chevron]) {
      expect(half.className).toContain('bg-surface-red-7')
      expect(half.className).toContain('h-8')
    }
  })
})
