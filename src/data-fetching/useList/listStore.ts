import { useList } from './useList'

interface Doc {
  name: string
  [key: string]: any
}

class ListStore {
  byDocType: { [key: string]: Array<ReturnType<typeof useList>> }

  constructor() {
    this.byDocType = {}
  }

  addList(docType: string, list: ReturnType<typeof useList>) {
    if (!this.byDocType[docType]) {
      this.byDocType[docType] = []
    }
    this.byDocType[docType].push(list)
  }

  updateRows(docs: Array<Doc>) {
    for (let doc of docs) {
      this.updateRow(doc.doctype, doc)
    }
  }

  updateRow(doctype: string, doc: Doc) {
    this.byDocType[doctype].forEach((list) => {
      list.updateRow(doc)
    })
  }
}

export const listStore = new ListStore()
