class ListStore {
    byDocType;
    constructor() {
        this.byDocType = {};
    }
    addList(doctype, list) {
        this.ensureList(doctype);
        this.byDocType[doctype].push(list);
    }
    updateRows(docs) {
        for (let doc of docs) {
            this.updateRow(doc.doctype, doc);
        }
    }
    updateRow(doctype, doc) {
        this.ensureList(doctype);
        this.byDocType[doctype].forEach((list) => {
            list.updateRow(doc);
        });
    }
    removeRow(doctype, name) {
        this.ensureList(doctype);
        this.byDocType[doctype].forEach((list) => {
            list.removeRow(name);
        });
    }
    ensureList(docType) {
        if (!this.byDocType[docType]) {
            this.byDocType[docType] = [];
        }
    }
}
export const listStore = new ListStore();
