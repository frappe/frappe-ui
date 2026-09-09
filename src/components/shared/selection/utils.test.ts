import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  inputFontSizeClasses,
  itemRootSizeClasses,
  readGroupOptions,
  toItemListSize,
  triggerSizeClasses,
} from './utils'
import { _resetResolvePropValue } from '../../../utils/resolvePropValue'

describe('readGroupOptions', () => {
  it('returns the group children', () => {
    const options = [{ label: 'One', value: '1' }]
    expect(readGroupOptions({ group: 'Numbers', options }, 'Combobox')).toBe(
      options,
    )
  })

  it('returns an empty group as-is rather than treating it as malformed', () => {
    expect(
      readGroupOptions({ group: 'Numbers', options: [] }, 'Combobox'),
    ).toEqual([])
  })

  // `Autocomplete` called this key `items`. Reaching straight for
  // `option.options.map(…)` threw from inside `map` and named neither the
  // group nor the rename, which is a loud break that tells you nothing.
  it("names the items -> options rename when a group still uses Autocomplete's key", () => {
    expect(() =>
      readGroupOptions(
        { group: 'Numbers', items: [{ label: 'One', value: '1' }] } as never,
        'Combobox',
      ),
    ).toThrow(/\[Combobox\] grouped option "Numbers".*`items`.*`options`/s)
  })

  it('names the component it was called from', () => {
    expect(() =>
      readGroupOptions({ group: 'People', items: [] } as never, 'MultiSelect'),
    ).toThrow(/^\[MultiSelect\]/)
  })

  it('still reports a group that has neither key', () => {
    expect(() =>
      readGroupOptions({ group: 'Numbers' } as never, 'Combobox'),
    ).toThrow(/needs an `options` array/)
  })
})

describe('selection size maps', () => {
  afterEach(() => {
    _resetResolvePropValue()
    vi.restoreAllMocks()
  })

  it('covers the whole accepted scale', () => {
    for (const size of ['xs', 'sm', 'md', 'lg'] as const) {
      expect(triggerSizeClasses(size)).toBeTruthy()
      expect(inputFontSizeClasses(size)).toBeTruthy()
      expect(itemRootSizeClasses(size)).toBeTruthy()
      expect(toItemListSize(size)).toBe(size)
    }
  })

  it('maps each size to its accepted minimum height', () => {
    expect(triggerSizeClasses('xs')).toContain('min-h-6')
    expect(triggerSizeClasses('sm')).toContain('min-h-7')
    expect(triggerSizeClasses('md')).toContain('min-h-8')
    expect(triggerSizeClasses('lg')).toContain('min-h-10')
  })

  // Before this, a stale `xl` indexed to `undefined` and the trigger shipped
  // with no height, radius or padding class and no warning at all.
  it('falls back to sm for a size outside the union', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(triggerSizeClasses('xl' as never)).toBe(triggerSizeClasses('sm'))
    expect(inputFontSizeClasses('xl' as never)).toBe(inputFontSizeClasses('sm'))
    expect(itemRootSizeClasses('xl' as never)).toBe(itemRootSizeClasses('sm'))
    expect(toItemListSize('xl' as never)).toBe('sm')

    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('size="xl"')
    expect(warn.mock.calls[0][0]).toContain('xs, sm, md, lg')
  })

  // `ItemListRow` has the same scale and the same fallback, so forwarding the
  // raw value would make one stale call site warn twice.
  it('hands ItemListRow a resolved size, not the raw one', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(toItemListSize('xl' as never)).toBe('sm')
  })
})
