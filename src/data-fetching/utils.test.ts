/** @vitest-environment node */

import { computed, ref } from 'vue'
import { makeGetParams, parseFilters } from './utils'
import type { Filters } from './useList/types'

describe('parseFilters', () => {
  it('preserves multiple conditions on the same field in request parameters', () => {
    const filters: Filters = [
      ['amount', '>', 100],
      ['amount', '<', 500],
    ]
    const params = new URLSearchParams(
      makeGetParams({ filters: JSON.stringify(parseFilters(filters)) }),
    )
    expect(JSON.parse(params.get('filters')!)).toEqual(filters)
  })

  it('resolves reactive tuple values without changing the input', () => {
    const minimum = ref(100)
    const filters: Filters = [
      ['amount', '>', minimum],
      ['amount', '<', () => minimum.value + 400],
      ['status', 'in', ['Open', 'Pending']],
    ]
    const parsed = computed(() => parseFilters(filters))
    expect(parsed.value).toEqual([
      ['amount', '>', 100],
      ['amount', '<', 500],
      ['status', 'in', ['Open', 'Pending']],
    ])
    minimum.value = 200
    expect(parsed.value).toEqual([
      ['amount', '>', 200],
      ['amount', '<', 600],
      ['status', 'in', ['Open', 'Pending']],
    ])
    expect(filters[0][2]).toBe(minimum)
  })

  it('accepts refs and getters for the complete filter list', () => {
    const filters = ref<Filters>([['amount', '>', 0]])
    expect(parseFilters(filters)).toEqual([['amount', '>', 0]])
    expect(parseFilters(() => filters.value)).toEqual([['amount', '>', 0]])
    filters.value = [['enabled', '=', false]]
    expect(parseFilters(filters)).toEqual([['enabled', '=', false]])
  })

  it('applies the existing like normalization to list filters', () => {
    expect(
      parseFilters([
        ['name', 'like', 'alice'],
        ['name', 'like', 'a%'],
        ['name', 'like', ''],
        ['amount', 'like', 0],
      ]),
    ).toEqual([
      ['name', 'like', '%alice%'],
      ['name', 'like', 'a%'],
      ['amount', 'like', '%0%'],
    ])
  })

  it('omits empty filters in either form', () => {
    expect(parseFilters({})).toBeNull()
    expect(parseFilters([])).toBeNull()
    expect(parseFilters([['name', 'like', '']])).toBeNull()
  })

  it('preserves the object form and its reactive values', () => {
    expect(
      parseFilters({
        enabled: ref(false),
        amount: ['>', () => 0],
        status: ['in', ['Open', 'Pending']],
        name: ['like', 'alice'],
        empty: ['like', ''],
      }),
    ).toEqual({
      enabled: false,
      amount: ['>', 0],
      status: ['in', ['Open', 'Pending']],
      name: ['like', '%alice%'],
    })
  })
})
