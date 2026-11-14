/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import Button, { _resetUnlabeledIconWarning } from './Button.vue'

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

describe('Button accessible name', () => {
  function mount(props: Record<string, unknown>) {
    const host = document.createElement('div')
    const app = createApp(Button, props)
    app.mount(host)
    return {
      button: host.querySelector('button'),
      unmount: () => app.unmount(),
    }
  }

  it('names an icon-only button from its tooltip when it has no label', () => {
    const { button, unmount } = mount({ icon: 'lucide-bold', tooltip: 'Bold' })
    expect(button?.getAttribute('aria-label')).toBe('Bold')
    unmount()
  })

  it('prefers label over tooltip', () => {
    const { button, unmount } = mount({
      icon: 'lucide-bold',
      label: 'Toggle bold',
      tooltip: 'Bold (Cmd+B)',
    })
    expect(button?.getAttribute('aria-label')).toBe('Toggle bold')
    unmount()
  })

  it('does not use the tooltip as the name of a text button', () => {
    const { button, unmount } = mount({
      label: 'Save',
      tooltip: 'Saves the draft',
    })
    expect(button?.getAttribute('aria-label')).toBe('Save')
    unmount()
  })

  it('warns once per icon for an icon-only button with no name', () => {
    _resetUnlabeledIconWarning()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount({ icon: 'lucide-bold' }).unmount()
    mount({ icon: 'lucide-bold' }).unmount()
    const calls = warn.mock.calls.filter((a) =>
      String(a[0]).includes('no label'),
    )
    expect(calls).toHaveLength(1)
    expect(String(calls[0][0])).toContain('lucide-bold')
    warn.mockRestore()
  })

  it('does not warn when an icon-only button has a label or tooltip', () => {
    _resetUnlabeledIconWarning()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount({ icon: 'lucide-bold', label: 'Bold' }).unmount()
    mount({ icon: 'lucide-italic', tooltip: 'Italic' }).unmount()
    mount({ icon: 'lucide-link', 'aria-label': 'Link' }).unmount()
    expect(warn.mock.calls.some((a) => String(a[0]).includes('no label'))).toBe(
      false,
    )
    warn.mockRestore()
  })
})
