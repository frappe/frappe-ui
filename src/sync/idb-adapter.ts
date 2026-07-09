/**
 * IndexedDB StorageAdapter, built on idb-keyval.
 *
 * Layout: a single custom store per client-name; keys are `${doctype} ${name}` and
 * values are `{ doctype, name, doc, fields }`. Kept intentionally simple — the query
 * engine lives in `filters.ts` and evaluates over the in-memory table, so IDB is
 * durable storage, not a query surface.
 */

import { createStore as createIdbStore, entries, setMany, delMany, clear } from 'idb-keyval'
import type { StorageAdapter } from './store'
import type { Doc } from './filters'
import type { FieldSet } from './store'

type Row = { doctype: string; name: string; doc: Doc; fields: FieldSet }

export function idbAdapter(dbName: string, storeName = 'docs'): StorageAdapter {
  const store = createIdbStore(dbName, storeName)
  const key = (dt: string, n: string) => `${dt} ${n}`
  return {
    async loadAll() {
      const rows = (await entries<string, Row>(store)) as Array<[string, Row]>
      return rows.map(([, v]) => v)
    },
    async save(rows) {
      await setMany(
        rows.map((r) => [key(r.doctype, r.name), r] as [IDBValidKey, Row]),
        store,
      )
    },
    async remove(rows) {
      await delMany(rows.map((r) => key(r.doctype, r.name)) as IDBValidKey[], store)
    },
    async clear() {
      await clear(store)
    },
  }
}
