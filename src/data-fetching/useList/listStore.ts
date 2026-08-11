import { docKey, writeGate, type WriteStamp } from '../writeGate'

export interface ListInstanceMethods {
  updateRow: (doc: Partial<{ name: string }> & Record<string, unknown>) => void
  removeRow: (name: string) => void
}

interface Doc {
  name: string
  [key: string]: any
}

class ListStore {
  byDocType: { [key: string]: Array<ListInstanceMethods> }

  constructor() {
    this.byDocType = {}
  }

  addList(doctype: string, list: ListInstanceMethods) {
    this.ensureList(doctype)
    this.byDocType[doctype].push(list)
  }

  /** Same rule as `docStore.setDocs`: the stamp is required, per response. */
  updateRows(docs: Array<Doc>, stamp: WriteStamp) {
    for (let doc of docs) {
      // `doc?.` matches `setDocs`'s guard: a `null` entry in a docs payload
      // must fall through to `updateRow`'s guard, not throw here and reject
      // the whole response.
      this.updateRow(doc?.doctype, doc, stamp)
    }
  }

  /**
   * `stamp` is required for the same reason it is on `docStore.setDoc`: a row
   * update is a write to a document, and the caller has to say which request
   * it came from.
   */
  updateRow(doctype: string, doc: Doc, stamp: WriteStamp) {
    // An entry without doctype or name identifies no row. Skipped, matching
    // `setDocs`'s guard.
    if (!doctype || !doc?.name) return
    // The same gate `docStore` asks, so a row update and the doc write from
    // one response get one answer. Admitting also records, so a row update
    // that arrives without a matching `setDoc` still makes older writes to
    // that document stale — this store no longer relies on `docStore` having
    // been called first. The paired call records the same number, and an
    // equal sequence passes.
    if (!writeGate.admit(docKey(doctype, doc.name), stamp)) return
    this.ensureList(doctype)
    this.byDocType[doctype].forEach((list) => {
      list.updateRow(doc)
    })
  }

  /**
   * Takes no stamp, like `docStore.removeDoc`: a removal is terminal, never
   * gated. Its paired `removeDoc` seals the key, so an in-flight `updateRow`
   * settling afterwards cannot put the row back.
   */
  removeRow(doctype: string, name: string) {
    this.ensureList(doctype)
    this.byDocType[doctype].forEach((list) => {
      list.removeRow(name)
    })
  }

  ensureList(docType: string) {
    if (!this.byDocType[docType]) {
      this.byDocType[docType] = []
    }
  }
}

export const listStore = new ListStore()
