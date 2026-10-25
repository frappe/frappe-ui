import { it, expect } from 'vitest'
import { makeGetParams } from './utils'

it('makeGetParams sends values other than plain objects and arrays as is', () => {
  const date = new Date('2026-01-02T03:04:05Z')
  const query = makeGetParams({
    doctype: 'ToDo',
    limit: 20,
    debug: true,
    filters: '{"status":"Open"}',
    since: date,
    skippedNull: null,
    skippedUndefined: undefined,
    skippedEmpty: {},
  })
  expect(Object.fromEntries(new URLSearchParams(query))).toEqual({
    doctype: 'ToDo',
    limit: '20',
    debug: 'true',
    filters: '{"status":"Open"}',
    since: String(date),
  })
})
