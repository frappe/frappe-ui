import { reactive } from 'vue'
import { wrapOperation } from './ReactiveOperation'
import type { Doc } from '../core/types'
import type { DocStore } from '../core/DocStore'
import type { RequestManager } from '../core/RequestManager'
import type { FrappeResponseError } from '../core/FrappeResponseError'

export interface VueNewDocHandleOptions<TDoc extends Doc> {
  store: DocStore
  requestManager: RequestManager
  doctype: string
  defaults?: Partial<TDoc>
  /** Called when insert errors. When provided, suppresses the global onError handler. */
  onError?: (err: FrappeResponseError) => void
}

export interface VueNewDocHandle<TDoc extends Doc> {
  /** Mutable reactive doc — bind directly to form inputs. */
  doc: Partial<TDoc>
  insert: {
    call(extraValues?: Partial<TDoc>): Promise<TDoc>
    loading: boolean
    error: FrappeResponseError | null
    data: TDoc | null
  }
}

export function createVueNewDocHandle<TDoc extends Doc>(
  options: VueNewDocHandleOptions<TDoc>,
): VueNewDocHandle<TDoc> {
  const { store, requestManager, doctype, defaults = {}, onError } = options

  // Mutable reactive doc — not stored in DocStore until insert succeeds.
  const doc = reactive<Partial<TDoc>>({ ...defaults }) as Partial<TDoc>

  const insertCoreOp = {
    async call(extraValues?: Partial<TDoc>) {
      const body = { ...(doc as object), ...(extraValues ?? {}) }
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}`,
        method: 'POST',
        body: body as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
        // Reflect server-assigned fields (name, creation, etc.) back into doc
        Object.assign(doc as object, json.data)
      }
      return store.get(doctype, json.data.name) as TDoc
    },

    // newDoc.insert doesn't support optimistic — just call normally
    async callOptimistic(extraValues?: Partial<TDoc>) {
      return insertCoreOp.call(extraValues)
    },
  }

  const insert = wrapOperation(insertCoreOp, { onError })

  return reactive({ doc, insert }) as unknown as VueNewDocHandle<TDoc>
}
