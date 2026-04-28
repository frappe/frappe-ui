import {
  ref,
  reactive,
  shallowRef,
  computed,
  watchEffect,
  toValue,
  isRef,
  type MaybeRefOrGetter,
} from 'vue'
import { tryOnScopeDispose, useDebounceFn } from '@vueuse/core'
import type { Doc } from '../core/types'
import type { DocStore } from '../core/DocStore'
import type { RequestManager } from '../core/RequestManager'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import type { Operation } from '../core/Operation'
import type { SocketManager } from '../core/SocketManager'
import { wrapOperation, type ReactiveOperation } from './ReactiveOperation'

/**
 * Filter values can be static values, refs, computed refs, or getter functions.
 * A value of `undefined` from a getter is omitted from the request.
 */
export type ReactiveFilters = Record<string, MaybeRefOrGetter<any>>

/**
 * `filters` can be:
 * - A per-key object: `{ status: 'Open', owner: () => user.name }`
 * - A reactive ref or getter returning the whole filter object:
 *   `() => ({ owner: user.name, ...activeFilters.value })`
 */
export type FiltersOption =
  | ReactiveFilters
  | MaybeRefOrGetter<Record<string, any>>

export interface VueListHandleOptions<TDoc extends Doc> {
  store: DocStore
  requestManager: RequestManager
  doctype: string
  fields?: string[]
  filters?: FiltersOption
  orderBy?: string
  limit?: number
  start?: number
  /** Debounce filter changes by this many ms before refetching. */
  debounce?: number
  enabled?: MaybeRefOrGetter<boolean>
  /** Socket manager injected by createVueClient for automatic realtime row updates. */
  socket?: SocketManager
  transform?: (doc: TDoc) => TDoc
  onSuccess?: (docs: TDoc[]) => void
  onError?: (err: FrappeResponseError) => void
}

import type { FlatOperation } from './vueDocHandle'

/**
 * Controls where a newly inserted doc appears in the list.
 * - `'start'` — prepend (default)
 * - `'end'`   — append
 * - `number`  — zero-based index (clamped to list bounds)
 */
export type InsertPosition = 'start' | 'end' | number

export interface InsertOptions {
  /** Where in the current list to place the new item. Defaults to `'start'`. */
  at?: InsertPosition
}

/**
 * Like FlatOperation but callOptimistic accepts an optional `tempDoc` placeholder
 * instead of a store updater function. Pass `options.at` to control position.
 */
export interface InsertOperation<TDoc extends Doc> {
  call(values: Partial<TDoc>, options?: InsertOptions): Promise<TDoc>
  /**
   * Insert with an optional optimistic placeholder.
   *
   * Pass `tempDoc` to show a temporary item immediately while the request is
   * in flight — it is replaced by the real doc at the same position on
   * success, or removed on failure.
   *
   * Pass `options.at` to control where in the list the item appears.
   */
  callOptimistic(
    values: Partial<TDoc>,
    tempDoc?: Partial<TDoc>,
    options?: InsertOptions,
  ): Promise<TDoc>
  loading: boolean
  error: FrappeResponseError | null
  data: TDoc | null
}

/**
 * Public shape returned by createVueListHandle (or GPTask.getList).
 * All ref/computed properties are automatically unwrapped via reactive().
 */
export interface VueListHandle<TDoc extends Doc> {
  /** Current page of docs — each backed by DocStore. */
  data: TDoc[]
  loading: boolean
  error: FrappeResponseError | null
  hasNextPage: boolean
  hasPreviousPage: boolean
  /** Resolves when the first fetch completes. */
  promise: Promise<void>
  reload(): Promise<void>
  dispose(): void
  next(): Promise<void>
  previous(): Promise<void>
  setValue: FlatOperation<Partial<TDoc> & { name: string }, TDoc>
  delete: FlatOperation<string, void>
  insert: InsertOperation<TDoc>
}

export function createVueListHandle<TDoc extends Doc>(
  options: VueListHandleOptions<TDoc>,
): VueListHandle<TDoc> {
  const {
    store,
    requestManager,
    doctype,
    fields,
    filters,
    orderBy,
    limit = 20,
    start = 0,
    debounce: debounceMs,
    enabled,
    socket,
    transform,
    onSuccess,
    onError,
  } = options

  // List-local ordered names — shallowRef triggers computed update
  const names = shallowRef<string[]>([])
  const hasNextPage = ref(false)
  const hasPreviousPage = ref(false)
  let currentStart = start

  const loading = ref(false)
  const error = ref<FrappeResponseError | null>(null)

  // Unsubscribe doctype listener when done
  let unsubscribeDoctype: () => void = () => {}

  // Unsubscribe realtime list_update listener
  let unsubscribeRealtime: () => void = () => {}

  // When any tracked doc changes in the store, the computed auto-re-derives
  // because `store.get()` is called inside `computed`. However DocStore is not
  // itself Vue-reactive, so we need to trigger `names` to re-assign to
  // invalidate the computed. We use a lightweight version trick:
  // bump a version counter ref to force computed recalculation.
  const _storeVersion = ref(0)

  // Wrap data computed to also depend on _storeVersion.
  // Always shallow-copy store objects so that mutations to the store's
  // internal objects don't bleed into cached computed values after dispose.
  const reactiveData = computed<TDoc[]>(() => {
    // eslint-disable-next-line no-unused-expressions
    _storeVersion.value // track version
    return names.value
      .map((n) => {
        const d = store.get(doctype, n)
        if (!d) return null
        const copy = { ...d } as TDoc
        return transform ? transform(copy) : copy
      })
      .filter((d): d is TDoc => d !== null)
  })

  function subscribeDoctype() {
    unsubscribeDoctype()
    unsubscribeDoctype = store.subscribeDoctype(doctype, (changedName) => {
      if (names.value.includes(changedName)) {
        // Bump version to force reactiveData to recompute
        _storeVersion.value++
      }
    })
  }

  let resolvePromise: () => void = () => {}
  let promiseSettled = false
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve
  })

  function buildActiveFilters(): Record<string, any> | undefined {
    if (!filters) return undefined
    if (isRef(filters) || typeof filters === 'function') {
      // Whole-object mode: ref({...}) or () => ({...})
      const raw =
        toValue(filters as MaybeRefOrGetter<Record<string, any>>) ?? {}
      const result: Record<string, any> = {}
      for (const [key, val] of Object.entries(raw)) {
        if (val !== undefined) result[key] = val
      }
      return Object.keys(result).length ? result : undefined
    }
    // Per-key mode: { status: 'Open', owner: () => user.name }
    const result: Record<string, any> = {}
    let hasFilters = false
    for (const [key, val] of Object.entries(filters)) {
      const resolved = toValue(val)
      if (resolved !== undefined) {
        result[key] = resolved
        hasFilters = true
      }
    }
    return hasFilters ? result : undefined
  }

  async function fetchPage(fetchStart: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const body: Record<string, any> = { start: fetchStart, limit }
      if (fields?.length) body.fields = JSON.stringify(fields)
      const activeFilters = buildActiveFilters()
      if (activeFilters) body.filters = JSON.stringify(activeFilters)
      if (orderBy) body.order_by = orderBy

      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}`,
        method: 'GET',
        body,
      })

      if (json?.data) {
        const docs: any[] = json.data
        store.setMany(docs.map((d: any) => ({ doctype, ...d })))
        names.value = docs.map((d: any) => d.name)
        hasNextPage.value = json.has_next_page ?? false
        hasPreviousPage.value = fetchStart > 0
        currentStart = fetchStart

        if (onSuccess) {
          onSuccess(reactiveData.value)
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

  // Build the fetch trigger — optionally debounced
  const triggerFetch = debounceMs
    ? useDebounceFn(() => fetchPage(0), debounceMs)
    : () => fetchPage(0)

  // watchEffect tracks all reactive filter values and refetches on change
  watchEffect(() => {
    const isEnabled = toValue(enabled) ?? true

    if (!isEnabled) {
      return
    }

    // Evaluate filter values to register reactivity dependencies
    if (filters) {
      if (isRef(filters) || typeof filters === 'function') {
        toValue(filters as MaybeRefOrGetter<Record<string, any>>)
      } else {
        for (const val of Object.values(filters)) {
          toValue(val)
        }
      }
    }

    triggerFetch()
  })

  subscribeDoctype()

  if (socket) {
    unsubscribeRealtime = socket.onDocUpdate(doctype, (name) => {
      if (names.value.includes(name)) {
        // Only this specific doc changed — fetch it individually so the rest
        // of the list stays stable (no flicker, no pagination reset).
        requestManager
          .fetchDoc(doctype, name)
          .then((json) => {
            if (json?.data) store.set({ doctype, ...json.data })
          })
          .catch(() => triggerFetch())
      } else {
        // Unknown name — could be a new insert matching current filters.
        // Use triggerFetch so the debounce config is respected.
        triggerFetch()
      }
    })
  }

  // --- Operations ---

  const setCoreOp: Operation<Partial<TDoc> & { name: string }, TDoc> = {
    async call(values) {
      const { name: docName, ...rest } = values as {
        name: string
      } & Partial<TDoc>
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${docName}`,
        method: 'PATCH',
        body: rest as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
      return store.get(doctype, docName) as TDoc
    },

    async callOptimistic(values, updater, rollback) {
      const { name: docName, ...rest } = values as {
        name: string
      } & Partial<TDoc>
      const existing = store.get(doctype, docName)
      const snapshot = existing ? ({ ...existing } as Doc) : null
      if (updater) {
        updater(store)
      } else {
        // Auto: patch the target doc with provided values
        if (existing) store.set({ ...existing, ...rest })
      }
      try {
        return await setCoreOp.call(values)
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else if (snapshot) {
          store.set(snapshot)
        } else {
          store.remove(doctype, docName)
        }
        throw e
      }
    },
  }

  const deleteCoreOp: Operation<string, void> = {
    async call(docName) {
      await requestManager.fetch({
        url: `/api/v2/document/${doctype}/${docName}`,
        method: 'DELETE',
      })
      store.remove(doctype, docName)
      names.value = names.value.filter((n) => n !== docName)
    },

    async callOptimistic(docName, updater, rollback) {
      const namesBefore = [...names.value]
      const existing = store.get(doctype, docName)
      const snapshot = existing ? ({ ...existing } as Doc) : null
      if (updater) {
        updater(store)
      } else {
        // Auto: remove doc from list and store immediately
        names.value = names.value.filter((n) => n !== docName)
        store.remove(doctype, docName)
      }
      try {
        await deleteCoreOp.call(docName)
      } catch (e) {
        if (rollback) {
          rollback(store)
        } else {
          names.value = namesBefore
          if (snapshot) store.set(snapshot)
        }
        throw e
      }
    },
  }

  const insertCoreOp: Operation<Partial<TDoc>, TDoc> = {
    async call(values) {
      const json = await requestManager.fetch({
        url: `/api/v2/document/${doctype}`,
        method: 'POST',
        body: values as Record<string, any>,
      })
      if (json?.data) {
        store.set({ doctype, ...json.data })
      }
      return store.get(doctype, json.data.name) as TDoc
    },

    async callOptimistic(values, updater, rollback) {
      const namesBefore = [...names.value]
      if (updater) updater(store)
      try {
        return await insertCoreOp.call(values)
      } catch (e) {
        rollback ? rollback(store) : (names.value = namesBefore)
        throw e
      }
    },
  }

  function insertNameAt(name: string, at: InsertPosition = 'start') {
    const arr = [...names.value]
    if (at === 'start') {
      arr.unshift(name)
    } else if (at === 'end') {
      arr.push(name)
    } else {
      arr.splice(Math.max(0, Math.min(at, arr.length)), 0, name)
    }
    names.value = arr
  }

  const setValue = wrapOperation(setCoreOp, { onError })
  const deleteOp = wrapOperation(deleteCoreOp, { onError })

  // Insert gets its own wrapper so callOptimistic can accept a tempDoc
  // placeholder instead of a raw store updater.
  const _insertBase = wrapOperation(insertCoreOp, { onError })
  const insertOp: InsertOperation<TDoc> = {
    loading: _insertBase.loading as unknown as boolean,
    error: _insertBase.error as unknown as FrappeResponseError | null,
    data: _insertBase.data as unknown as TDoc | null,
    async call(values, options) {
      const doc = await _insertBase.call(values)
      insertNameAt(doc.name, options?.at)
      return doc
    },
    async callOptimistic(values, tempDoc, options) {
      const at = options?.at ?? 'start'

      if (!tempDoc) {
        const doc = await _insertBase.call(values)
        insertNameAt(doc.name, at)
        return doc
      }

      const tempName = `__optimistic_${Date.now()}`
      store.set({ doctype, name: tempName, ...tempDoc } as any)
      insertNameAt(tempName, at)

      try {
        const doc = await _insertBase.call(values)
        // Splice real doc in at the same slot the temp occupied
        const idx = names.value.indexOf(tempName)
        const arr = names.value.filter((n) => n !== tempName)
        arr.splice(idx >= 0 ? idx : 0, 0, doc.name)
        names.value = arr
        store.remove(doctype, tempName)
        return doc
      } catch (e) {
        names.value = names.value.filter((n) => n !== tempName)
        store.remove(doctype, tempName)
        throw e
      }
    },
  }

  function dispose() {
    unsubscribeDoctype()
    unsubscribeRealtime()
  }

  tryOnScopeDispose(dispose)

  // Wrap in reactive() so that Ref/ComputedRef properties are auto-unwrapped
  // in Vue templates: tasks.data, tasks.loading, tasks.insert.loading all
  // work without .value.
  return reactive({
    data: reactiveData,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    promise,
    reload: () => fetchPage(currentStart),
    dispose,
    next: () => fetchPage(currentStart + limit),
    previous: () => fetchPage(Math.max(0, currentStart - limit)),
    setValue,
    delete: deleteOp,
    insert: insertOp,
  }) as unknown as VueListHandle<TDoc>
}
