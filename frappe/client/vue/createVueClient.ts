import { createDocStore, type DocStore } from '../core/DocStore'
import {
  createRequestManager,
  type RequestManagerConfig,
} from '../core/RequestManager'
import {
  createNoopSocketManager,
  createSocketManager,
  type SocketManager,
} from '../core/SocketManager'
import type { Doc } from '../core/types'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import type { DocMethods } from '../core/CoreDocHandle'
import { wrapOperation, type ReactiveOperation } from './ReactiveOperation'
import {
  createVueDocHandle,
  type VueDocHandle,
  type VueDocHandleOptions,
} from './vueDocHandle'
import {
  createVueListHandle,
  type VueListHandle,
  type VueListHandleOptions,
  type ReactiveFilters,
} from './vueListHandle'
import type { MaybeRefOrGetter } from 'vue'

export interface CreateVueClientOptions {
  baseUrl?: string
  realtime?: boolean | { socketIo: any }
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
  'store' | 'requestManager' | 'doctype'
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
  if (realtime && typeof realtime === 'object' && realtime.socketIo) {
    socket = createSocketManager(store, realtime.socketIo)
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
        ReactiveOperation<any, any>
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
              updater(store)
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

      return {
        // Controller methods spread first so built-ins below always win
        ...mappedControllerMethods,

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
            ...listOptions,
          })
        },
      }
    }
  }

  return { defineDoctype, store, socket }
}
