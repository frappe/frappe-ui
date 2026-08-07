/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Button from './Button.vue'

describe('Button', () => {
  it('preserves a caller-provided accessible name', () => {
    const host = document.createElement('div')
    const app = createApp(Button, {
      icon: 'lucide-x',
      'aria-label': 'Close',
    })
    app.mount(host)

    expect(host.querySelector('button')?.getAttribute('aria-label')).toBe(
      'Close',
    )

    app.unmount()
  })

  it('swaps the resting background for the pressed one when data-state is active', () => {
    const render = (props: Record<string, unknown>) => {
      const host = document.createElement('div')
      const app = createApp(Button, { label: 'Options', ...props })
      app.mount(host)
      const className = host.querySelector('button')?.className ?? ''
      app.unmount()
      return className
    }

    const resting = render({})
    expect(resting).toContain('bg-surface-gray-2')

    const active = render({ 'data-state': 'active' })
    expect(active).toContain('bg-surface-gray-4')
    expect(active).not.toContain('bg-surface-gray-2')
    // No hover override, so the cursor can't lighten an open menu's trigger.
    expect(active).not.toContain('hover:bg-')

    // `disabled` outranks the active look.
    const disabled = render({ 'data-state': 'active', disabled: true })
    expect(disabled).toContain('text-ink-gray-4')
    expect(disabled).not.toContain('bg-surface-gray-4')
  })
})
