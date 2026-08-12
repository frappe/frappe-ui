import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { resolvePropValue, _resetResolvePropValue } from './resolvePropValue'

const table = {
  gray: 'is-gray',
  blue: 'is-blue',
  amber: 'is-amber',
}

const context = { component: 'Badge', prop: 'theme' }

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  _resetResolvePropValue()
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
  vi.unstubAllEnvs()
})

describe('resolvePropValue', () => {
  it('returns the mapped value for a supported key', () => {
    expect(resolvePropValue(table, 'blue', 'gray', context)).toBe('is-blue')
    expect(warn).not.toHaveBeenCalled()
  })

  it('falls back to the default for an unsupported value', () => {
    expect(resolvePropValue(table, 'orange', 'gray', context)).toBe('is-gray')
  })

  it('falls back silently when the prop was not passed at all', () => {
    // `undefined` means "no prop", which `withDefaults` normally covers.
    // Reporting it would warn on ordinary usage.
    expect(resolvePropValue(table, undefined, 'gray', context)).toBe('is-gray')
    expect(warn).not.toHaveBeenCalled()
  })

  it('ignores inherited Object.prototype keys', () => {
    // A plain `value in table` guard would accept these and return a
    // function where a class name belongs.
    expect(resolvePropValue(table, 'toString', 'gray', context)).toBe('is-gray')
    expect(resolvePropValue(table, 'constructor', 'gray', context)).toBe(
      'is-gray',
    )
  })

  it('names the component, prop, value, fallback and supported set', () => {
    resolvePropValue(table, 'orange', 'gray', context)

    expect(warn).toHaveBeenCalledOnce()
    const message = warn.mock.calls[0][0] as string
    expect(message).toContain('[frappe-ui]')
    expect(message).toContain('Badge.theme="orange"')
    expect(message).toContain('falling back to "gray"')
    expect(message).toContain('gray, blue, amber')
  })

  it('warns once for repeated calls with the same value', () => {
    // These fire from computeds, so a per-render warning would flood.
    resolvePropValue(table, 'orange', 'gray', context)
    resolvePropValue(table, 'orange', 'gray', context)
    resolvePropValue(table, 'orange', 'gray', context)

    expect(warn).toHaveBeenCalledOnce()
  })

  it('warns once per distinct value, not once per component and prop', () => {
    // Guards the `=${value}` part of the dedup key. Without it, the second
    // and third bad values here would be swallowed and an app fixing one
    // typo would never hear about the next.
    resolvePropValue(table, 'orange', 'gray', context)
    resolvePropValue(table, 'yellow', 'gray', context)
    resolvePropValue(table, 'purple', 'gray', context)

    expect(warn).toHaveBeenCalledTimes(3)
    const messages = warn.mock.calls.map((call) => call[0] as string)
    expect(messages[0]).toContain('"orange"')
    expect(messages[1]).toContain('"yellow"')
    expect(messages[2]).toContain('"purple"')
  })

  it('keeps the dedup key scoped to the component and prop', () => {
    resolvePropValue(table, 'orange', 'gray', context)
    resolvePropValue(table, 'orange', 'gray', {
      component: 'Badge',
      prop: 'variant',
    })
    resolvePropValue(table, 'orange', 'gray', {
      component: 'Alert',
      prop: 'theme',
    })

    expect(warn).toHaveBeenCalledTimes(3)
  })

  it('stays silent in production but still falls back', () => {
    vi.stubEnv('PROD', true)

    expect(resolvePropValue(table, 'orange', 'gray', context)).toBe('is-gray')
    expect(warn).not.toHaveBeenCalled()
  })

  it('does not burn the dedup entry while silenced in production', () => {
    // The PROD gate sits after the dedup set is consulted, so a value first
    // seen in prod must still warn in dev.
    vi.stubEnv('PROD', true)
    resolvePropValue(table, 'orange', 'gray', context)
    expect(warn).not.toHaveBeenCalled()

    vi.unstubAllEnvs()
    resolvePropValue(table, 'orange', 'gray', context)
    expect(warn).toHaveBeenCalledOnce()
  })
})
