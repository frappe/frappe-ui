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
})
