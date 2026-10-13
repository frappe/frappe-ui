import { describe, it, expect } from 'vitest'
import { filterByQuery, rankByQuery } from './suggestion-helpers'

const people = [
  { label: 'Ritvik Sardana' },
  { label: 'Asar Khan' },
  { label: 'Sarah Connor' },
  { label: 'Emily Chen' },
]

describe('rankByQuery', () => {
  it('keeps the same matches as filterByQuery', () => {
    expect(new Set(rankByQuery(people, 'sar', 'label'))).toEqual(
      new Set(filterByQuery(people, 'sar', 'label')),
    )
  })

  it('puts values that start with the query first, then word starts', () => {
    expect(rankByQuery(people, 'sar', 'label').map((p) => p.label)).toEqual([
      'Sarah Connor',
      'Ritvik Sardana',
      'Asar Khan',
    ])
  })

  it('keeps source order between equally ranked matches', () => {
    const list = [{ label: 'Sam B' }, { label: 'Sam A' }]
    expect(rankByQuery(list, 'sam', 'label')).toEqual(list)
  })
})
