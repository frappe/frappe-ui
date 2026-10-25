import { describe, it, expect } from 'vitest'
import { filterByQuery, rankByQuery } from './suggestion-helpers'

const people = [
  { label: 'Ritvik Sardana' },
  { label: 'Asar Khan' },
  { label: 'Sarah Connor' },
  { label: 'Emily Chen' },
  { label: 'Sar' },
]

describe('rankByQuery', () => {
  it('keeps the same matches as filterByQuery', () => {
    expect(new Set(rankByQuery(people, 'sar', 'label'))).toEqual(
      new Set(filterByQuery(people, 'sar', 'label')),
    )
  })

  it('orders exact match, then prefix, then word start, then the rest', () => {
    expect(rankByQuery(people, 'sar', 'label').map((p) => p.label)).toEqual([
      'Sar',
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
