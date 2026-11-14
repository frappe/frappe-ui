/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Password from './Password.vue'

function eyeVisible(modelValue: string) {
  const host = document.createElement('div')
  const app = createApp(Password, { modelValue })
  app.mount(host)
  const eye = host.querySelector('button[aria-label]') as HTMLElement | null
  const visible = !!eye && eye.style.display !== 'none'
  app.unmount()
  return visible
}

describe('Password eye toggle', () => {
  it('stays visible when a real password contains an asterisk', () => {
    expect(eyeVisible('Summer*2026')).toBe(true)
  })

  it('hides for a fully masked value from the server', () => {
    expect(eyeVisible('********')).toBe(false)
  })

  it('shows for an empty field', () => {
    expect(eyeVisible('')).toBe(true)
  })
})
