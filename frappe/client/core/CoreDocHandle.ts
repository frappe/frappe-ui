import type { Doc } from './types'
import type { DocStore } from './DocStore'
import type { RequestManager } from './RequestManager'
import type { Operation } from './Operation'

export interface MethodDef {
  method: string
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Builds the body/params from the call arguments. */
  args?: (...args: any[]) => Record<string, any>
}

export type DocMethods = Record<string, MethodDef>

export type MappedDocMethod<TArgs extends any[], TResult = any> = Operation<
  TArgs extends [] ? void : Parameters<(...a: TArgs) => void>[0],
  TResult
>

export type CoreDocHandleDocMethods<TMethods extends DocMethods> = {
  [K in keyof TMethods]: Operation<any, any>
}

export interface CoreDocHandle<
  TDoc extends Doc,
  TMethods extends DocMethods = {},
> {
  /** Current snapshot from DocStore — updated synchronously via subscription. */
  doc: TDoc | null
  /** Resolves when the initial fetch completes. */
  promise: Promise<void>
  reload(): Promise<void>
  dispose(): void
  setValue: Operation<Partial<TDoc>, TDoc>
  delete: Operation<void, void>
}

export interface CoreDocHandleOptions<TDoc extends Doc> {
  store: DocStore
  requestManager: RequestManager
  doctype: string
  name: string
  docMethods?: DocMethods
}

export function createCoreDocHandle<TDoc extends Doc>(
  options: CoreDocHandleOptions<TDoc>,
): CoreDocHandle<TDoc> & Record<string, any> {
  const { store, requestManager, doctype, name, docMethods } = options

  // Snapshot — shallow copy so mutations to the store's internal object
  // don't bleed into the handle after dispose() removes the subscription.
  function copyDoc(d: ReturnType<DocStore['get']>): TDoc | null {
    return d ? ({ ...d } as TDoc) : null
  }

  let doc: TDoc | null = copyDoc(store.get(doctype, name))

  const unsubscribe = store.subscribe(doctype, name, (updated) => {
    doc = copyDoc(updated)
  })

  let abortController: AbortController | null = null

  const reload = async (): Promise<void> => {
    abortController?.abort()
    abortController = new AbortController()
    try {
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${name}`,
        method: 'GET',
        signal: abortController.signal,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
    } finally {
      abortController = null
    }
  }

  const promise = reload()

  function snapshotDoc(): Doc | null {
    const current = store.get(doctype, name)
    return current ? { ...current } : null
  }

  const setValue: Operation<Partial<TDoc>, TDoc> = {
    async call(values) {
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${name}`,
        method: 'PATCH',
        body: values as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
      return store.get(doctype, name) as TDoc
    },

    async callOptimistic(values, updater, rollback) {
      const snapshot = snapshotDoc()
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

  const deleteOp: Operation<void, void> = {
    async call() {
      await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${name}`,
        method: 'DELETE',
      })
      store.remove(doctype, name)
    },

    async callOptimistic(_, updater, rollback) {
      const snapshot = snapshotDoc()
      updater(store)
      try {
        await deleteOp.call()
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else if (snapshot) {
          store.set(snapshot)
        }
        throw e
      }
    },
  }

  // Map docMethods to operations
  const mappedMethods: Record<string, Operation<any, any>> = {}
  if (docMethods) {
    for (const [key, def] of Object.entries(docMethods)) {
      const { method, httpMethod = 'POST', args } = def
      mappedMethods[key] = {
        async call(params: any) {
          const body = args ? args(params) : (params ?? {})
          const json = await requestManager.fetch({
            url: `/api/v2/document/${doctype}/${name}/method/${method}`,
            method: httpMethod,
            body,
          })
          if (json?.docs?.length) {
            store.setMany(json.docs)
          }
          return json
        },
        async callOptimistic(params, updater, rollback) {
          const snapshot = snapshotDoc()
          updater(store)
          try {
            return await mappedMethods[key].call(params)
          } catch (e) {
            if (rollback) {
              rollback(store)
            } else if (snapshot) {
              store.set(snapshot)
            }
            throw e
          }
        },
      }
    }
  }

  return {
    get doc() {
      return doc
    },
    promise,
    reload,
    dispose() {
      unsubscribe()
      abortController?.abort()
    },
    setValue,
    delete: deleteOp,
    ...mappedMethods,
  }
}
