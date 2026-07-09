/**
 * Local query engine — mirrors Frappe's filter operators over an in-memory doc set.
 *
 * Filter shape:
 *   { fieldname: value }                 // shorthand for ['=', value]
 *   { fieldname: [op, value] }           // e.g. ['like', '%foo%'], ['in', ['a','b']]
 *   { fieldname: ['is', 'set' | 'not set'] }
 *
 * Semantics match `frappe/model/db_query.py` where practical:
 *   - `like` / `not like` are case-insensitive; `%` matches any run, `_` matches a single char.
 *   - `null` values do not satisfy ordered comparisons (>, <, >=, <=) or (not) like.
 *   - `in`/`not in` with empty list: in → nothing, not in → everything.
 *   - `is set` = value not null AND not empty string.
 *
 * Local evaluation is a UX affordance — the server independently re-evaluates every
 * subscription with full permissions and its result overwrites any local guess.
 */

export type Doc = { name: string; [k: string]: any }

export type FilterOp =
  | '='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>='
  | 'in'
  | 'not in'
  | 'like'
  | 'not like'
  | 'between'
  | 'is'

export type FilterValue = any | [FilterOp, any] | [FilterOp, any, any]

export type Filters = Record<string, FilterValue>

export type QueryOptions = {
  filters?: Filters
  orderBy?: string
  limit?: number
}

const ORDERED_OPS = new Set(['<', '>', '<=', '>='])

function parseCondition(raw: FilterValue): [FilterOp, any] {
  if (Array.isArray(raw) && raw.length >= 2 && typeof raw[0] === 'string') {
    return [raw[0] as FilterOp, raw[1]]
  }
  return ['=', raw]
}

function likeToRegex(pattern: string): RegExp {
  // Escape regex specials except our wildcards, then replace % and _.
  let re = ''
  for (const ch of pattern) {
    if (ch === '%') re += '.*'
    else if (ch === '_') re += '.'
    else re += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp('^' + re + '$', 'i')
}

function compare(a: any, b: any): number {
  if (a === b) return 0
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a) < String(b) ? -1 : 1
}

function evaluate(fieldValue: any, op: FilterOp, target: any): boolean {
  switch (op) {
    case '=':
      return fieldValue === target || (fieldValue == null && target == null)
    case '!=':
      if (fieldValue == null && target == null) return false
      return fieldValue !== target
    case '<':
    case '>':
    case '<=':
    case '>=': {
      if (fieldValue == null || target == null) return false
      const c = compare(fieldValue, target)
      if (op === '<') return c < 0
      if (op === '>') return c > 0
      if (op === '<=') return c <= 0
      return c >= 0
    }
    case 'in': {
      const arr = Array.isArray(target) ? target : []
      return arr.some((v) => v === fieldValue || (v == null && fieldValue == null))
    }
    case 'not in': {
      const arr = Array.isArray(target) ? target : []
      return !arr.some((v) => v === fieldValue || (v == null && fieldValue == null))
    }
    case 'like': {
      if (fieldValue == null) return false
      return likeToRegex(String(target)).test(String(fieldValue))
    }
    case 'not like': {
      if (fieldValue == null) return false
      return !likeToRegex(String(target)).test(String(fieldValue))
    }
    case 'between': {
      if (!Array.isArray(target) || target.length !== 2) {
        throw new Error(`'between' expects [low, high]`)
      }
      if (fieldValue == null) return false
      return compare(fieldValue, target[0]) >= 0 && compare(fieldValue, target[1]) <= 0
    }
    case 'is': {
      const s = String(target)
      if (s === 'set') return fieldValue != null && fieldValue !== ''
      if (s === 'not set') return fieldValue == null || fieldValue === ''
      throw new Error(`'is' expects 'set' or 'not set', got ${JSON.stringify(target)}`)
    }
    default:
      throw new Error(`unknown filter operator: ${op}`)
  }
}

export function matches(doc: Doc, filters?: Filters): boolean {
  if (!filters) return true
  for (const field of Object.keys(filters)) {
    const [op, target] = parseCondition(filters[field])
    if (!evaluate(doc[field], op, target)) return false
  }
  return true
}

type SortKey = { field: string; dir: 1 | -1 }

function parseOrderBy(orderBy: string): SortKey[] {
  return orderBy
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((clause) => {
      const [field, dir] = clause.split(/\s+/)
      return { field, dir: (dir || 'asc').toLowerCase() === 'desc' ? -1 : 1 } as SortKey
    })
}

export function applyQuery<T extends Doc>(docs: T[], opts: QueryOptions = {}): T[] {
  let out = opts.filters ? docs.filter((d) => matches(d, opts.filters)) : docs.slice()
  if (opts.orderBy) {
    const keys = parseOrderBy(opts.orderBy)
    out.sort((a, b) => {
      for (const k of keys) {
        const c = compare(a[k.field], b[k.field])
        if (c !== 0) return c * k.dir
      }
      return 0
    })
  }
  if (opts.limit != null) out = out.slice(0, opts.limit)
  return out
}
