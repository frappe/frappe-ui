/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import FormControl from './FormControl.vue'

function mount(props: Record<string, unknown>) {
  const host = document.createElement('div')
  const app = createApp(FormControl, props)
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('FormControl type="password"', () => {
  it('renders Password, with its show/hide toggle', () => {
    const { host, unmount } = mount({ type: 'password', label: 'Password' })
    const input = host.querySelector('input')
    expect(input?.getAttribute('type')).toBe('password')
    expect(
      host.querySelector('button[aria-label="Show password"]'),
    ).not.toBeNull()
    unmount()
  })

  it('lets the toggle reveal the value', async () => {
    const { host, unmount } = mount({ type: 'password', modelValue: 'secret' })
    host.querySelector<HTMLButtonElement>('button[aria-label]')!.click()
    await nextTick()
    expect(host.querySelector('input')?.getAttribute('type')).toBe('text')
    unmount()
  })

  it('still renders other text types as TextInput', () => {
    const { host, unmount } = mount({ type: 'email' })
    expect(host.querySelector('input')?.getAttribute('type')).toBe('email')
    expect(host.querySelector('button')).toBeNull()
    unmount()
  })
})
