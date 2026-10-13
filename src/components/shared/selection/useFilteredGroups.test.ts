import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useFilteredGroups } from './useFilteredGroups'
import { rankByLabel } from './utils'

type Item = { label: string; custom?: boolean }

function filtered(options: Item[], query: string) {
  const groups = useFilteredGroups<Item, { options: Item[] }>({
    groups: ref([{ options }]),
    open: ref(true),
    hasTypedSinceOpen: ref(true),
    query: ref(query),
    matches: (item, q) => item.label.toLowerCase().includes(q.toLowerCase()),
    rank: (item, q) => (item.custom ? null : rankByLabel(item, q)),
  })
  return groups.value[0].options.map((item) => item.label)
}

describe('useFilteredGroups ranking', () => {
  const fields: Item[] = [
    { label: 'Approximate No. of SKUs' },
    { label: 'Frappe HR' },
    { label: 'Frappe CRM' },
    { label: 'App' },
  ]

  it('lists the best matches first while typing', () => {
    expect(filtered(fields, 'app')).toEqual([
      'App',
      'Approximate No. of SKUs',
      'Frappe HR',
      'Frappe CRM',
    ])
  })

  it('keeps unranked items, like custom action rows, in their place', () => {
    const options: Item[] = [
      { label: 'Create "app"', custom: true },
      { label: 'Frappe HR' },
      { label: 'App' },
    ]
    expect(filtered(options, 'app')).toEqual([
      'Create "app"',
      'App',
      'Frappe HR',
    ])
  })
})
