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

  updateRows(docs: Array<Doc>) {
    for (let doc of docs) {
      this.updateRow(doc.doctype, doc)
    }
  }

  updateRow(doctype: string, doc: Doc) {
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
