import type { Doc } from './types'
import type { DocStore } from './DocStore'
import type { RequestManager } from './RequestManager'
import type { Operation } from './Operation'

export interface GetListParams {
  fields?: string[]
  filters?: Record<string, any>
  orderBy?: string
  limit?: number
  start?: number
}

export interface CoreListHandle<TDoc extends Doc> {
  /** Current list snapshot — updated via DocStore subscription. */
  data: TDoc[]
  /** Resolves when the initial fetch completes. */
  promise: Promise<void>
  reload(): Promise<void>
  dispose(): void
  next(): Promise<void>
  previous(): Promise<void>
  hasNextPage: boolean
  hasPreviousPage: boolean
  setValue: Operation<Partial<TDoc> & { name: string }, TDoc>
  delete: Operation<string, void>
  insert: Operation<Partial<TDoc>, TDoc>
}

export interface CoreListHandleOptions<TDoc extends Doc> {
  store: DocStore
  requestManager: RequestManager
  doctype: string
  fields?: string[]
  filters?: Record<string, any>
  orderBy?: string
  limit?: number
  start?: number
}

export function createCoreListHandle<TDoc extends Doc>(
  options: CoreListHandleOptions<TDoc>,
): CoreListHandle<TDoc> {
  const {
    store,
    requestManager,
    doctype,
    fields,
    filters,
    orderBy,
    limit = 20,
    start = 0,
  } = options

  // List-local ordered names array
  let names: string[] = []
  let hasNextPage = false
  let hasPreviousPage = false
  let currentStart = start

  // Keep data in sync with DocStore — updated by subscribeDoctype listener
  let data: TDoc[] = []

  function rebuildData() {
    data = names.map((n) => store.get(doctype, n) as TDoc).filter(Boolean)
  }

  // When any doc in this doctype changes, refresh our data snapshot
  const unsubscribeDoctype = store.subscribeDoctype(doctype, (name) => {
    if (names.includes(name)) {
      rebuildData()
    }
  })

  const fetchPage = async (fetchStart: number): Promise<void> => {
    const body: Record<string, any> = { start: fetchStart, limit }
    if (fields?.length) body.fields = JSON.stringify(fields)
    if (filters && Object.keys(filters).length)
      body.filters = JSON.stringify(filters)
    if (orderBy) body.order_by = orderBy

    const json = await requestManager.fetch({
      url: `/api/v2/document/${doctype}`,
      method: 'GET',
      body,
    })

    if (json?.data) {
      const docs: any[] = json.data
      store.setMany(docs.map((d: any) => ({ doctype, ...d })))
      names = docs.map((d: any) => d.name)
      rebuildData()
      hasNextPage = json.has_next_page ?? false
      hasPreviousPage = fetchStart > 0
      currentStart = fetchStart
    }
  }

  const promise = fetchPage(start)

  const setValue: Operation<Partial<TDoc> & { name: string }, TDoc> = {
    async call(values) {
      const { name, ...rest } = values as { name: string } & Partial<TDoc>
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${name}`,
        method: 'PATCH',
        body: rest as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
      return store.get(doctype, name) as TDoc
    },

    async callOptimistic(values, updater, rollback) {
      const { name } = values as { name: string }
      const existing = store.get(doctype, name)
      const snapshot = existing ? ({ ...existing } as Doc) : null
      updater(store)
      try {
        return await setValue.call(values)
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else if (snapshot) {
          store.set(snapshot)
        } else {
          store.remove(doctype, name)
        }
        throw e
      }
    },
  }

  const deleteOp: Operation<string, void> = {
    async call(name) {
      await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${name}`,
        method: 'DELETE',
      })
      store.remove(doctype, name)
      names = names.filter((n) => n !== name)
      rebuildData()
    },

    async callOptimistic(name, updater, rollback) {
      const existing = store.get(doctype, name)
      const snapshot = existing ? ({ ...existing } as Doc) : null
      const namesBefore = [...names]
      updater(store)
      names = names.filter((n) => n !== name)
      rebuildData()
      try {
        await requestManager.fetch({
          url: `/api/v2/document/${doctype}/${name}`,
          method: 'DELETE',
        })
        store.remove(doctype, name)
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else {
          if (snapshot) store.set(snapshot)
          names = namesBefore
          rebuildData()
        }
        throw e
      }
    },
  }

  const insertOp: Operation<Partial<TDoc>, TDoc> = {
    async call(values) {
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}`,
        method: 'POST',
        body: values as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
        names = [json.data.name, ...names]
        rebuildData()
      }
      return store.get(doctype, json.data.name) as TDoc
    },

    async callOptimistic(values, updater, rollback) {
      const namesBefore = [...names]
      updater(store)
      try {
        return await insertOp.call(values)
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else {
          names = namesBefore
          rebuildData()
        }
        throw e
      }
    },
  }

  return {
    get data() {
      return data
    },
    promise,
    reload: () => fetchPage(currentStart),
    dispose() {
      unsubscribeDoctype()
    },
    next: () => fetchPage(currentStart + limit),
    previous: () => fetchPage(Math.max(0, currentStart - limit)),
    get hasNextPage() {
      return hasNextPage
    },
    get hasPreviousPage() {
      return hasPreviousPage
    },
    setValue,
    delete: deleteOp,
    insert: insertOp,
  }
}
