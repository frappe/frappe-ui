import { describe, expect, it } from 'vitest'
import { hexToOklch, toOklch } from './figma-tokens-to-theme.js'

describe('hexToOklch', () => {
  it('converts a 6-digit hex', () => {
    expect(hexToOklch('#ffffff')).toBe('oklch(1 0 0)')
  })

  it('converts an 8-digit hex with alpha', () => {
    expect(hexToOklch('#00000080')).toBe('oklch(0 0 0 / 0.502)')
  })

  it('throws on shorthand hex instead of emitting NaN', () => {
    expect(() => hexToOklch('#fff')).toThrow(/#rrggbb/)
  })
})

describe('toOklch', () => {
  it('passes alias references through untouched', () => {
    expect(toOklch('{light.gray.50}')).toBe('{light.gray.50}')
  })
})
