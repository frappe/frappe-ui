import { reactive, type MaybeRefOrGetter } from 'vue'
import { createDocStore, type DocStore } from '../core/DocStore'
import {
  createRequestManager,
  type RequestManagerConfig,
} from '../core/RequestManager'
import {
  createNoopSocketManager,
  createLazySocketManager,
  type SocketManager,
} from '../core/SocketManager'
import type { Doc } from '../core/types'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import type { DocMethods } from '../core/CoreDocHandle'
import { wrapOperation } from './ReactiveOperation'
import {
  createVueDocHandle,
  type VueDocHandle,
  type VueDocHandleOptions,
  type FlatOperation,
} from './vueDocHandle'
import {
  createVueListHandle,
  type VueListHandle,
  type VueListHandleOptions,
  type ReactiveFilters,
} from './vueListHandle'
import { createVueNewDocHandle, type VueNewDocHandle } from './vueNewDocHandle'
import {
  createVueCountHandle,
  type VueCountHandle,
  type GetCountOptions,
} from './vueCountHandle'
import { initFrappeSocket } from './frappe-socket'

export interface CreateVueClientOptions {
  baseUrl?: string
  realtime?: boolean
  onRequest?: RequestManagerConfig['onRequest']
  onError?: (error: FrappeResponseError) => void
  onResponse?: (response: any) => void
}

export interface MethodDef {
  method: string
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  args?: (...args: any[]) => Record<string, any>
}

export type ControllerMethods = Record<string, MethodDef>

export interface DoctypeDefinition<
  TControllerMethods extends ControllerMethods = {},
  TDocMethods extends DocMethods = {},
> {
  doctype: string
  docMethods?: TDocMethods
  controllerMethods?: TControllerMethods
}

/** Options for getDoc, minus the wiring that createVueClient provides. */
export type GetDocOptions<TDoc extends Doc> = Omit<
  VueDocHandleOptions<TDoc>,
  'store' | 'requestManager' | 'doctype' | 'name'
>

/** Options for getList, minus the wiring that createVueClient provides. */
export type GetListOptions<TDoc extends Doc> = Omit<
  VueListHandleOptions<TDoc>,
  'store' | 'requestManager' | 'doctype' | 'socket'
>

export interface VueDoctypeInstance<
  TDoc extends Doc,
  TControllerMethods extends ControllerMethods = {},
> {
  getDoc(
    name: MaybeRefOrGetter<string>,
    options?: GetDocOptions<TDoc>,
  ): VueDocHandle<TDoc>
  getList(options?: GetListOptions<TDoc>): VueListHandle<TDoc>
  /** Create a local-only reactive draft doc for form-based create flows. */
  newDoc(defaults?: Partial<TDoc>): VueNewDocHandle<TDoc>
  /** Reactive doc count with optional filters. */
  getCount(options?: GetCountOptions): VueCountHandle
  /** Bulk delete — removes docs from server and DocStore. */
  bulkDelete: FlatOperation<string[], void>
  /** Bulk update — patches multiple docs; DocStore auto-updated. */
  bulkUpdate: FlatOperation<Array<{ name: string } & Partial<TDoc>>, TDoc[]>
  /** Subscribe to realtime doc_update events for this doctype. Returns unsubscribe fn. */
  onUpdate(callback: (name: string) => void): () => void
  /** Subscribe to realtime doc_rename events for this doctype. Returns unsubscribe fn. */
  onRename(callback: (newName: string, oldName: string) => void): () => void
  [key: string]: any
}

export interface VueClientResult {
  defineDoctype: <TDoc extends Doc>() => <
    TControllerMethods extends ControllerMethods = {},
    TDocMethods extends DocMethods = {},
  >(
    definition: DoctypeDefinition<TControllerMethods, TDocMethods>,
  ) => VueDoctypeInstance<TDoc, TControllerMethods>
  store: DocStore
  socket: SocketManager
}

export function createClient(
  options: CreateVueClientOptions = {},
): VueClientResult {
  const { baseUrl = '', realtime, onRequest, onError, onResponse } = options

  const store = createDocStore()
  const requestManager = createRequestManager({
    baseUrl,
    onRequest,
    onError,
    onResponse,
  })

  let socket: SocketManager

  if (realtime) {
    socket = createLazySocketManager(store, initFrappeSocket)
  } else {
    socket = createNoopSocketManager()
  }

  function defineDoctype<TDoc extends Doc>() {
    return function <
      TControllerMethods extends ControllerMethods = {},
      TDocMethods extends DocMethods = {},
    >(
      definition: DoctypeDefinition<TControllerMethods, TDocMethods>,
    ): VueDoctypeInstance<TDoc, TControllerMethods> {
      const { doctype, docMethods, controllerMethods } = definition

      // Map controller-level methods as reactive operations
      const mappedControllerMethods: Record<
        string,
        ReturnType<typeof wrapOperation>
      > = {}
      if (controllerMethods) {
        for (const [key, def] of Object.entries(controllerMethods)) {
          const { method, httpMethod = 'POST', args } = def
          mappedControllerMethods[key] = wrapOperation({
            async call(params: any) {
              const body = args ? args(params) : (params ?? {})
              const json = await requestManager.fetch({
                url: `/api/v2/method/${doctype}/${method}`,
                method: httpMethod,
                body,
              })
              if (json?.docs?.length) {
                store.setMany(json.docs)
              }
              return json
            },
            async callOptimistic(params, updater, rollback) {
              if (updater) updater(store)
              try {
                return await mappedControllerMethods[key].call(params)
              } catch (e) {
                if (rollback) rollback(store)
                throw e
              }
            },
          })
        }
      }

      // Bulk delete — POST /api/v2/document/{doctype}/bulk_delete with body { names }
      const bulkDelete = wrapOperation({
        async call(names: string[]) {
          await requestManager.fetch({
            url: `/api/v2/document/${doctype}/bulk_delete`,
            method: 'POST',
            body: { names },
          })
          names.forEach((n) => store.remove(doctype, n))
        },
        async callOptimistic(names: string[], updater, rollback) {
          const snapshots = names.map((n) => {
            const doc = store.get(doctype, n)
            return doc ? { ...doc } : null
          })
          if (updater) {
            updater(store)
          } else {
            names.forEach((n) => store.remove(doctype, n))
          }
          try {
            await bulkDelete.call(names)
          } catch (e) {
            if (rollback) {
              rollback(store)
            } else {
              snapshots.forEach((snap) => {
                if (snap) store.set(snap)
              })
            }
            throw e
          }
        },
      })

      // Bulk update — POST /api/v2/document/{doctype}/bulk_update with body { docs }
      type BulkUpdateRow = { name: string } & Record<string, any>
      async function bulkUpdateCall(rows: BulkUpdateRow[]): Promise<TDoc[]> {
        const json = await requestManager.fetch({
          url: `/api/v2/document/${doctype}/bulk_update`,
          method: 'POST',
          body: { docs: rows },
        })
        if (json?.docs?.length) {
          store.setMany(json.docs)
        } else {
          // Optimistically apply patches if server returns no docs
          rows.forEach((row) => {
            const { name, ...rest } = row
            const existing = store.get(doctype, name)
            if (existing) store.set({ ...existing, ...rest })
          })
        }
        return (json?.docs ?? []) as TDoc[]
      }
      const bulkUpdate = wrapOperation({
        call: bulkUpdateCall,
        async callOptimistic(rows: BulkUpdateRow[], updater, rollback) {
          const snapshots = rows.map((row) => {
            const doc = store.get(doctype, row.name)
            return doc ? { ...doc } : null
          })
          if (updater) {
            updater(store)
          } else {
            rows.forEach((row) => {
              const { name, ...rest } = row
              const existing = store.get(doctype, name)
              if (existing) store.set({ ...existing, ...rest })
            })
          }
          try {
            return await bulkUpdateCall(rows)
          } catch (e) {
            if (rollback) {
              rollback(store)
            } else {
              snapshots.forEach((snap) => {
                if (snap) store.set(snap)
              })
            }
            throw e
          }
        },
      })

      function onUpdate(callback: (name: string) => void): () => void {
        return socket.onDocUpdate(doctype, callback)
      }

      function onRename(
        callback: (newName: string, oldName: string) => void,
      ): () => void {
        return socket.onDocRename(doctype, callback)
      }

      // Wrap in reactive() so nested ReactiveOperation Refs auto-unwrap:
      // ToDo.bulkDelete.loading → boolean (not Ref<boolean>)
      return reactive({
        // Controller methods spread first so built-ins below always win
        ...mappedControllerMethods,
        bulkDelete,
        bulkUpdate,
        onUpdate,
        onRename,

        getDoc(
          name: MaybeRefOrGetter<string>,
          docOptions?: GetDocOptions<TDoc>,
        ): VueDocHandle<TDoc> {
          return createVueDocHandle<TDoc>({
            store,
            requestManager,
            doctype,
            name,
            docMethods,
            ...docOptions,
          })
        },

        getList(listOptions?: GetListOptions<TDoc>): VueListHandle<TDoc> {
          return createVueListHandle<TDoc>({
            store,
            requestManager,
            doctype,
            socket,
            ...listOptions,
          })
        },

        newDoc(defaults?: Partial<TDoc>): VueNewDocHandle<TDoc> {
          return createVueNewDocHandle<TDoc>({
            store,
            requestManager,
            doctype,
            defaults,
          })
        },

        getCount(countOptions?: GetCountOptions): VueCountHandle {
          return createVueCountHandle({
            store,
            requestManager,
            doctype,
            ...countOptions,
          })
        },
      }) as unknown as VueDoctypeInstance<TDoc, TControllerMethods>
    }
  }

  return { defineDoctype, store, socket }
}
