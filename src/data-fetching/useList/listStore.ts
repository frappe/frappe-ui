import { docStore } from '../docStore'

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

  updateRows(docs: Array<Doc>, version?: number) {
    for (let doc of docs) {
      this.updateRow(doc.doctype, doc, version)
    }
  }

  updateRow(doctype: string, doc: Doc, version?: number) {
    // An entry without doctype or name identifies no row. Skipped, matching
    // `setDocs`'s guard — reaching `admitsWrite` with it would throw on
    // `doctype.trim()` and reject the whole response it rode in on.
    if (!doctype || doc.name == null) return
    // Same freshness domain as the doc store (#1017): a row update from a
    // request that a later-dispatched request has already overtaken for this
    // document is dropped. `docStore` is the bookkeeper; the matching
    // `docStore.setDoc`/`setDocs` call recorded this write's version, so an
    // equal version passes.
    if (!docStore.admitsWrite(doctype, doc.name, version)) {
      return
    }
    this.ensureList(doctype)
    this.byDocType[doctype].forEach((list) => {
      list.updateRow(doc)
    })
  }

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
