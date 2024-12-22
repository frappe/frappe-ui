import { reactive, watch, type Ref, type ComputedRef, unref } from 'vue'

type Doc = {
  doctype: string
  name: string
  [key: string]: any
}

type DocKey = `${string}/${string}`
type SubscriberCallback = (doc: Doc) => void

class DocStore {
  private docs: Map<DocKey, Doc>
  private lastFetched: Map<DocKey, number>
  private subscribers: Map<DocKey, Set<SubscriberCallback>>
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.docs = reactive(new Map<DocKey, Doc>())
    this.lastFetched = new Map()
    this.subscribers = new Map()
  }

  setDoc(doc: Doc) {
    if (!doc?.doctype || !doc?.name) {
      throw new Error('Invalid doc: must have doctype and name')
    }
    const key = this.getKey(doc.doctype, doc.name)
    this.docs.set(key, doc)
    this.lastFetched.set(key, Date.now())

    // Notify subscribers
    const docSubscribers = this.subscribers.get(key)
    if (docSubscribers) {
      docSubscribers.forEach((callback) => callback(doc))
    }
  }

  getDoc(
    doctype: string,
    name: string | Ref<string> | ComputedRef<string>,
  ): Doc | undefined {
    const nameStr = unref(name)
    if (!doctype || !nameStr) {
      throw new Error('doctype and name are required')
    }
    const key = this.getKey(doctype, nameStr)
    if (this.isStale(key)) {
      this.cleanup(key)
      return undefined
    }
    return this.docs.get(key)
  }

  setDocs(docs: Doc[]) {
    docs.forEach((doc) => this.setDoc(doc))
  }

  invalidateDoc(doctype: string, name: string) {
    if (!doctype || !name) return
    const key = this.getKey(doctype, name)
    this.cleanup(key)
  }

  subscribe(
    doctype: string,
    name: string | Ref<string> | ComputedRef<string>,
    callback: SubscriberCallback,
  ): () => void {
    if (typeof name === 'string') {
      return this.subscribeToKey(doctype, name, callback)
    }

    // Handle reactive name
    const stopWatch = watch(
      () => unref(name),
      (newName, oldName) => {
        if (oldName) {
          this.unsubscribe(doctype, oldName, callback)
        }
        this.subscribeToKey(doctype, newName, callback)
      },
      { immediate: true },
    )

    // Return combined cleanup function
    return () => {
      stopWatch()
      this.unsubscribe(doctype, unref(name), callback)
    }
  }

  private subscribeToKey(
    doctype: string,
    name: string,
    callback: SubscriberCallback,
  ): () => void {
    if (!doctype || !name || !callback) {
      throw new Error('doctype, name, and callback are required')
    }
    const key = this.getKey(doctype, name)
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key)?.add(callback)

    return () => {
      this.unsubscribe(doctype, name, callback)
    }
  }

  unsubscribe(doctype: string, name: string, callback: SubscriberCallback) {
    const key = this.getKey(doctype, name)
    this.subscribers.get(key)?.delete(callback)
    if (this.subscribers.get(key)?.size === 0) {
      this.subscribers.delete(key)
    }
    this.lastFetched.delete(key)
  }

  private getKey(doctype: string, name: string): DocKey {
    return `${doctype.trim()}/${name.trim()}` as DocKey
  }

  private isStale(key: DocKey): boolean {
    const fetchTime = this.lastFetched.get(key)
    if (!fetchTime) return true
    return Date.now() - fetchTime > this.cacheTimeout
  }

  private cleanup(key: DocKey) {
    this.docs.delete(key)
    this.lastFetched.delete(key)
    this.subscribers.delete(key)
  }

  clearAll() {
    this.docs.clear()
    this.lastFetched.clear()
    // Cleanup all subscriptions
    this.subscribers.forEach((subscribers) => {
      subscribers.clear()
    })
    this.subscribers.clear()
  }
}

export const docStore = new DocStore()
