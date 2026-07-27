/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  it('emits one model update per toggle', async () => {
    const updates: boolean[] = []
    const host = document.createElement('div')
    const app = createApp(Checkbox, {
      modelValue: false,
      'onUpdate:modelValue': (value: boolean) => updates.push(value),
    })
    app.mount(host)

    const input = host.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement
    input.checked = true
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()

    expect(updates).toEqual([true])
    app.unmount()
  })
})
