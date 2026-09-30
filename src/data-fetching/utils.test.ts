import { describe, it, expect } from 'vitest'
import { makeGetParams } from './utils'

function parse(query: string) {
  return Object.fromEntries(new URLSearchParams(query))
}

describe('makeGetParams', () => {
  it('sends primitives as they are', () => {
    expect(
      parse(makeGetParams({ doctype: 'ToDo', limit: 20, debug: true })),
    ).toEqual({ doctype: 'ToDo', limit: '20', debug: 'true' })
  })

  it('JSON-encodes an object, not `[object Object]`', () => {
    const query = makeGetParams({ filters: { status: 'Open' } })
    expect(parse(query).filters).toBe('{"status":"Open"}')
  })

  it('JSON-encodes an array, not a comma-joined string', () => {
    const query = makeGetParams({
      fields: ['name', 'title'],
      filters: [['status', '=', 'Open']],
    })
    expect(parse(query)).toEqual({
      fields: '["name","title"]',
      filters: '[["status","=","Open"]]',
    })
  })

  it('leaves an already-encoded string alone', () => {
    const query = makeGetParams({ filters: '{"status":"Open"}' })
    expect(parse(query).filters).toBe('{"status":"Open"}')
  })

  it('skips null, undefined and empty objects', () => {
    expect(makeGetParams({ a: null, b: undefined, c: {}, d: 'x' })).toBe('d=x')
  })
})
