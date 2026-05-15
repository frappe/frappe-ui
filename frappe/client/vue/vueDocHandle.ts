import {
  ref,
  reactive,
  shallowRef,
  computed,
  watchEffect,
  nextTick,
  toValue,
  type MaybeRefOrGetter,
} from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import type { Doc } from '../core/types'
import type { DocStore } from '../core/DocStore'
import type { RequestManager } from '../core/RequestManager'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import type { Operation } from '../core/Operation'
import type { DocMethods } from '../core/CoreDocHandle'
import { wrapOperation, type ReactiveOperation } from './ReactiveOperation'

export interface VueDocHandleOptions<TDoc extends Doc> {
  store: DocStore
  requestManager: RequestManager
  doctype: string
  name: MaybeRefOrGetter<string>
  docMethods?: DocMethods
  enabled?: MaybeRefOrGetter<boolean>
  transform?: (doc: TDoc) => TDoc
  onSuccess?: (doc: TDoc) => void
  onError?: (err: FrappeResponseError) => void
}

/** Flat shape of a reactive operation after reactive() unwrapping. */
export interface FlatOperation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(
    params: TParams,
    updater?: (store: DocStore) => void,
    rollback?: (store: DocStore) => void,
  ): Promise<TResult>
  loading: boolean
  error: FrappeResponseError | null
  data: TResult | null
}

/**
 * Public shape returned by createVueDocHandle (or GPTask.getDoc).
 * All ref/computed properties are automatically unwrapped via reactive().
 */
export interface VueDocHandle<TDoc extends Doc> {
  /** Current doc — null while loading or when not found. */
  doc: TDoc | null
  loading: boolean
  error: FrappeResponseError | null
  /** Resolves when the first fetch completes. */
  promise: Promise<void>
  reload(): Promise<void>
  dispose(): void
  setValue: FlatOperation<Partial<TDoc>, TDoc>
  delete: FlatOperation<void, void>
  [key: string]: any
}

export function createVueDocHandle<TDoc extends Doc>(
  options: VueDocHandleOptions<TDoc>,
): VueDocHandle<TDoc> {
  const {
    store,
    requestManager,
    doctype,
    name,
    docMethods,
    enabled,
    transform,
    onSuccess,
    onError,
  } = options

  const _doc = shallowRef<TDoc | null>(null)
  const loading = ref(false)
  const error = ref<FrappeResponseError | null>(null)

  // Track current name for use in operations (which close over it)
  let currentName = ''

  let unsubscribeDoc: () => void = () => {}

  let resolvePromise: () => void = () => {}
  let promiseSettled = false
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve
  })

  async function fetchDoc(n: string): Promise<void> {
    if (!n) return
    loading.value = true
    error.value = null
    try {
      const json = await requestManager.fetchDoc(doctype, n)
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
      if (onSuccess) {
        // Use the freshly-stored value rather than _doc (which updates async via nextTick)
        const fresh = store.get(doctype, n) as TDoc | null
        if (fresh) {
          const result = transform
            ? transform({ ...fresh })
            : ({ ...fresh } as TDoc)
          onSuccess(result)
        }
      }
    } catch (e) {
      const err = e as FrappeResponseError
      if (onError) {
        err._suppressGlobalError = true
        onError(err)
      }
      error.value = err
    } finally {
      loading.value = false
      if (!promiseSettled) {
        promiseSettled = true
        resolvePromise()
      }
    }
  }

  watchEffect(() => {
    const n = toValue(name)
    const isEnabled = toValue(enabled) ?? true

    unsubscribeDoc()

    if (!isEnabled || !n) {
      _doc.value = null
      currentName = n || ''
      return
    }

    currentName = n

    // Sync cached value immediately — shallow copy so mutations to the
    // store's internal object don't bleed into _doc after unsubscribe.
    const cached = store.get(doctype, n)
    _doc.value = cached ? ({ ...cached } as TDoc) : null

    // Subscribe to future store updates — shallow copy + batch via nextTick
    unsubscribeDoc = store.subscribe(doctype, n, (updated) => {
      nextTick(() => {
        // Only update if name hasn't changed since subscription was created
        if (currentName === n) {
          _doc.value = updated ? ({ ...updated } as TDoc) : null
        }
      })
    })

    fetchDoc(n)
  })

  const doc = computed<TDoc | null>(() => {
    if (transform && _doc.value) {
      return transform(_doc.value)
    }
    return _doc.value
  })

  function snapshotDoc(): Doc | null {
    const current = store.get(doctype, currentName)
    return current ? { ...current } : null
  }

  const setCoreOp: Operation<Partial<TDoc>, TDoc> = {
    async call(values) {
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${currentName}`,
        method: 'PATCH',
        body: values as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
      return store.get(doctype, currentName) as TDoc
    },

    async callOptimistic(values, updater, rollback) {
      const snapshot = snapshotDoc()
      if (updater) {
        updater(store)
      } else {
        // Auto: patch current doc with the provided values
        const current = store.get(doctype, currentName)
        if (current) store.set({ ...current, ...(values as object) })
      }
      try {
        return await setCoreOp.call(values)
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else if (snapshot) {
          store.set(snapshot)
        } else {
          store.remove(doctype, currentName)
        }
        throw e
      }
    },
  }

  const deleteCoreOp: Operation<void, void> = {
    async call() {
      await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${currentName}`,
        method: 'DELETE',
      })
      store.remove(doctype, currentName)
    },

    async callOptimistic(_, updater, rollback) {
      const snapshot = snapshotDoc()
      if (updater) {
        updater(store)
      } else {
        store.remove(doctype, currentName)
      }
      try {
        await deleteCoreOp.call()
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

  const setValue = wrapOperation(setCoreOp, { onError })
  const deleteOp = wrapOperation(deleteCoreOp, { onError })

  // Map docMethods to reactive operations
  const mappedMethods: Record<string, ReactiveOperation<any, any>> = {}
  if (docMethods) {
    for (const [key, def] of Object.entries(docMethods)) {
      const { method, httpMethod = 'POST', args } = def
      const coreOp: Operation<any, any> = {
        async call(params: any) {
          const body = args ? args(params) : (params ?? {})
          const json = await requestManager.fetch({
            url: `/api/v2/document/${doctype}/${currentName}/method/${method}`,
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
            return await coreOp.call(params)
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
      mappedMethods[key] = wrapOperation(coreOp, { onError })
    }
  }

  function dispose() {
    unsubscribeDoc()
  }

  tryOnScopeDispose(dispose)

  // Wrap in reactive() so that Ref/ComputedRef properties are auto-unwrapped
  // in Vue templates: task.doc, task.loading, task.setValue.loading all work
  // without .value.
  return reactive({
    doc,
    loading,
    error,
    promise,
    reload: () => fetchDoc(currentName),
    dispose,
    setValue,
    delete: deleteOp,
    ...mappedMethods,
  }) as unknown as VueDocHandle<TDoc>
}
