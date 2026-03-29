import { createDocStore, type DocStore } from './DocStore'
import {
  createRequestManager,
  type RequestManagerConfig,
} from './RequestManager'
import {
  createNoopSocketManager,
  createSocketManager,
  type SocketManager,
} from './SocketManager'
import { createCoreDocHandle, type DocMethods } from './CoreDocHandle'
import { createCoreListHandle, type GetListParams } from './CoreListHandle'
import type { Doc } from './types'
import type { FrappeResponseError } from './FrappeResponseError'
import type { RequestConfig } from './types'

export interface CreateCoreClientOptions {
  baseUrl?: string
  realtime?: boolean | { socketIo: any }
  onRequest?: RequestManagerConfig['onRequest']
  onError?: (error: FrappeResponseError) => void
  onResponse?: (response: any) => void
}

export interface DoctypeDefinition<
  TControllerMethods extends Record<string, MethodDef> = {},
  TDocMethods extends DocMethods = {},
> {
  doctype: string
  docMethods?: TDocMethods
  controllerMethods?: TControllerMethods
}

export interface MethodDef {
  method: string
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  args?: (...args: any[]) => Record<string, any>
}

export type ControllerMethods = Record<string, MethodDef>

export interface CoreClientResult {
  /** Curried factory for creating doctype-bound handles. */
  defineDoctype: <TDoc extends Doc>() => <
    TControllerMethods extends ControllerMethods = {},
    TDocMethods extends DocMethods = {},
  >(
    definition: DoctypeDefinition<TControllerMethods, TDocMethods>,
  ) => DoctypeInstance<TDoc, TControllerMethods, TDocMethods>
  store: DocStore
  socket: SocketManager
}

export interface DoctypeInstance<
  TDoc extends Doc,
  TControllerMethods extends ControllerMethods = {},
  TDocMethods extends DocMethods = {},
> {
  getDoc(name: string): ReturnType<typeof createCoreDocHandle<TDoc>>
  getList(params?: GetListParams): ReturnType<typeof createCoreListHandle<TDoc>>
  // Controller-level methods exposed as Operations
  [key: string]: any
}

export function createCoreClient(
  options: CreateCoreClientOptions = {},
): CoreClientResult {
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
    ): DoctypeInstance<TDoc, TControllerMethods, TDocMethods> {
      const { doctype, docMethods, controllerMethods } = definition

      // Map controller-level methods (not per-doc)
      const mappedControllerMethods: Record<string, any> = {}
      if (controllerMethods) {
        for (const [key, def] of Object.entries(controllerMethods)) {
          const { method, httpMethod = 'POST', args } = def
          mappedControllerMethods[key] = {
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
          }
        }
      }

      return {
        getDoc(name: string) {
          return createCoreDocHandle<TDoc>({
            store,
            requestManager,
            doctype,
            name,
            docMethods,
          })
        },
        getList(params?: GetListParams) {
          return createCoreListHandle<TDoc>({
            store,
            requestManager,
            doctype,
            ...params,
          })
        },
        ...mappedControllerMethods,
      }
    }
  }

  return { defineDoctype, store, socket }
}
