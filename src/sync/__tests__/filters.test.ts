import { describe, it, expect } from 'vitest'
import { applyQuery, matches, type Filters } from '../filters'

type Doc = { name: string; [k: string]: any }

const docs: Doc[] = [
  { name: 't1', title: 'Alpha', status: 'Open', priority: 1, owner: 'a@x.com', modified: '2024-01-01' },
  { name: 't2', title: 'Beta', status: 'Closed', priority: 2, owner: 'b@x.com', modified: '2024-02-01' },
  { name: 't3', title: 'Gamma release', status: 'Open', priority: 3, owner: null, modified: '2024-03-01' },
  { name: 't4', title: 'delta', status: 'Open', priority: 2, owner: 'a@x.com', modified: '2024-04-01' },
  { name: 't5', title: null, status: 'Cancelled', priority: null, owner: '', modified: '2024-05-01' },
]

function names(rows: Doc[]) {
  return rows.map((r) => r.name)
}

describe('matches — single-doc predicate', () => {
  it('shorthand equality: { field: value }', () => {
    expect(matches(docs[0], { status: 'Open' })).toBe(true)
    expect(matches(docs[1], { status: 'Open' })).toBe(false)
  })

  it('null matches null', () => {
    expect(matches(docs[4], { title: null })).toBe(true)
    expect(matches(docs[0], { title: null })).toBe(false)
  })

  it('multiple conditions AND together', () => {
    expect(matches(docs[0], { status: 'Open', owner: 'a@x.com' })).toBe(true)
    expect(matches(docs[2], { status: 'Open', owner: 'a@x.com' })).toBe(false)
  })

  it('empty filter matches everything', () => {
    for (const d of docs) expect(matches(d, {})).toBe(true)
    for (const d of docs) expect(matches(d, undefined)).toBe(true)
  })
})

describe('applyQuery — list of docs', () => {
  it('= (via shorthand)', () => {
    expect(names(applyQuery(docs, { filters: { status: 'Open' } }))).toEqual(['t1', 't3', 't4'])
  })

  it('!=', () => {
    expect(names(applyQuery(docs, { filters: { status: ['!=', 'Open'] } }))).toEqual(['t2', 't5'])
  })

  it('<, <=, >, >=', () => {
    expect(names(applyQuery(docs, { filters: { priority: ['>', 1] } }))).toEqual(['t2', 't3', 't4'])
    expect(names(applyQuery(docs, { filters: { priority: ['>=', 2] } }))).toEqual(['t2', 't3', 't4'])
    expect(names(applyQuery(docs, { filters: { priority: ['<', 2] } }))).toEqual(['t1'])
    expect(names(applyQuery(docs, { filters: { priority: ['<=', 2] } }))).toEqual(['t1', 't2', 't4'])
  })

  it('null does not participate in ordered comparisons', () => {
    // priority=null (t5) is excluded from >, <, >=, <=
    expect(names(applyQuery(docs, { filters: { priority: ['>', 0] } }))).toEqual(['t1', 't2', 't3', 't4'])
    expect(names(applyQuery(docs, { filters: { priority: ['<', 999] } }))).toEqual(['t1', 't2', 't3', 't4'])
  })

  it('in / not in', () => {
    expect(names(applyQuery(docs, { filters: { status: ['in', ['Open', 'Cancelled']] } }))).toEqual(['t1', 't3', 't4', 't5'])
    expect(names(applyQuery(docs, { filters: { status: ['not in', ['Open']] } }))).toEqual(['t2', 't5'])
    // empty in → nothing; empty not in → everything
    expect(applyQuery(docs, { filters: { status: ['in', []] } })).toEqual([])
    expect(applyQuery(docs, { filters: { status: ['not in', []] } })).toHaveLength(docs.length)
  })

  it('like — case-insensitive, % is any-run wildcard', () => {
    expect(names(applyQuery(docs, { filters: { title: ['like', '%alpha%'] } }))).toEqual(['t1'])
    expect(names(applyQuery(docs, { filters: { title: ['like', 'Delta'] } }))).toEqual(['t4']) // exact ci-match, no wildcard
    expect(names(applyQuery(docs, { filters: { title: ['like', '%a%'] } }))).toEqual(['t1', 't2', 't3', 't4'])
    // _ matches single char
    expect(names(applyQuery(docs, { filters: { title: ['like', 'delt_'] } }))).toEqual(['t4'])
  })

  it('not like — negation of like, nulls do NOT match', () => {
    // t5 has title=null; per Frappe semantics null doesn't satisfy `not like` unless
    // the engine coalesces. Match Frappe: null → false for both like and not like.
    expect(names(applyQuery(docs, { filters: { title: ['not like', '%a%'] } }))).toEqual([])
  })

  it('between — inclusive both ends', () => {
    expect(names(applyQuery(docs, { filters: { priority: ['between', [2, 3]] } }))).toEqual(['t2', 't3', 't4'])
    expect(names(applyQuery(docs, { filters: { modified: ['between', ['2024-02-01', '2024-03-31']] } }))).toEqual(['t2', 't3'])
  })

  it('is set / is not set', () => {
    // "set" = not-null and not-empty-string (matches Frappe `is set`)
    expect(names(applyQuery(docs, { filters: { owner: ['is', 'set'] } }))).toEqual(['t1', 't2', 't4'])
    expect(names(applyQuery(docs, { filters: { owner: ['is', 'not set'] } }))).toEqual(['t3', 't5'])
  })

  it('order_by asc/desc, default asc', () => {
    expect(names(applyQuery(docs, { orderBy: 'priority' }))).toEqual(['t5', 't1', 't2', 't4', 't3']) // null first (asc)
    expect(names(applyQuery(docs, { orderBy: 'priority asc' }))).toEqual(['t5', 't1', 't2', 't4', 't3'])
    expect(names(applyQuery(docs, { orderBy: 'priority desc' }))).toEqual(['t3', 't2', 't4', 't1', 't5']) // null last (desc)
  })

  it('order_by multi-key', () => {
    // secondary sort
    const out = applyQuery(docs, { orderBy: 'status asc, priority desc' })
    expect(names(out)).toEqual(['t5', 't2', 't3', 't4', 't1'])
  })

  it('limit', () => {
    expect(names(applyQuery(docs, { orderBy: 'name asc', limit: 2 }))).toEqual(['t1', 't2'])
  })

  it('composition: filter + order + limit', () => {
    const out = applyQuery(docs, {
      filters: { status: 'Open' },
      orderBy: 'priority desc',
      limit: 2,
    })
    expect(names(out)).toEqual(['t3', 't4'])
  })
})

describe('unknown operator', () => {
  it('throws a descriptive error', () => {
    expect(() => applyQuery(docs, { filters: { status: ['glorp' as any, 'x'] } })).toThrow(/operator/i)
  })
})
