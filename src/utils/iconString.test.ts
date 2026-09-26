import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, defineAsyncComponent, h } from 'vue'
import {
  isComponentLike,
  warnUnsupportedIconObject,
  _resetWarnUnsupportedIconObject,
} from './iconString'

describe('isComponentLike', () => {
  it('accepts every component shape the library renders', () => {
    expect(isComponentLike(defineComponent({ render: () => h('svg') }))).toBe(
      true,
    )
    expect(isComponentLike({ template: '<svg />' })).toBe(true)
    expect(isComponentLike(() => h('svg'))).toBe(true)
    expect(isComponentLike(defineAsyncComponent(async () => ({})))).toBe(true)
    expect(isComponentLike(h('svg'))).toBe(true)
  })

  it('rejects the removed icon object and other plain values', () => {
    expect(isComponentLike({ name: 'lucide-trash', theme: 'red' })).toBe(false)
    expect(isComponentLike({})).toBe(false)
    expect(isComponentLike('lucide-trash')).toBe(false)
    expect(isComponentLike(null)).toBe(false)
    expect(isComponentLike(undefined)).toBe(false)
  })
})

describe('warnUnsupportedIconObject', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    _resetWarnUnsupportedIconObject()
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  it('warns for the removed { name, theme } object', () => {
    warnUnsupportedIconObject('Dialog', 'icon', {
      name: 'lucide-trash',
      theme: 'red',
    })

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('Dialog.icon')
    expect(warn.mock.calls[0][0]).toContain('{ name, theme }')
  })

  it('warns once per component and prop', () => {
    warnUnsupportedIconObject('Dialog', 'icon', { name: 'a' })
    warnUnsupportedIconObject('Dialog', 'icon', { name: 'b' })

    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('stays quiet for a component, a string, and no icon', () => {
    warnUnsupportedIconObject(
      'Dialog',
      'icon',
      defineComponent({ render: () => h('svg') }),
    )
    warnUnsupportedIconObject('Dialog', 'icon', 'lucide-trash')
    warnUnsupportedIconObject('Dialog', 'icon', undefined)
    warnUnsupportedIconObject('Dialog', 'icon', null)

    expect(warn).not.toHaveBeenCalled()
  })
})
