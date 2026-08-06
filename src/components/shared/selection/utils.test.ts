import { describe, expect, it } from 'vitest'
import { readGroupOptions } from './utils'

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
