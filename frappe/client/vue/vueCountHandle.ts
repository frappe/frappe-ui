import { ref, reactive, watchEffect, toValue, isRef, type MaybeRefOrGetter } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import type { Doc } from '../core/types'
import type { DocStore } from '../core/DocStore'
import type { RequestManager } from '../core/RequestManager'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import type { FiltersOption } from './vueListHandle'

export interface GetCountOptions {
  filters?: FiltersOption
  enabled?: MaybeRefOrGetter<boolean>
  onSuccess?: (count: number) => void
  onError?: (err: FrappeResponseError) => void
}

export interface VueCountHandleOptions extends GetCountOptions {
  store: DocStore
  requestManager: RequestManager
  doctype: string
}

export interface VueCountHandle {
  data: number | null
  loading: boolean
  error: FrappeResponseError | null
  /** Resolves when the first fetch completes. */
  promise: Promise<void>
  reload(): Promise<void>
  dispose(): void
}

export function createVueCountHandle(
  options: VueCountHandleOptions,
): VueCountHandle {
  const {
    requestManager,
    doctype,
    filters,
    enabled,
    onSuccess,
    onError,
  } = options

  const count = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<FrappeResponseError | null>(null)

  let resolvePromise: () => void = () => {}
  let promiseSettled = false
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve
  })

  function buildActiveFilters(): Record<string, any> | undefined {
    if (!filters) return undefined
    if (isRef(filters) || typeof filters === 'function') {
      const raw = toValue(filters as MaybeRefOrGetter<Record<string, any>>) ?? {}
      const result: Record<string, any> = {}
      for (const [k, v] of Object.entries(raw)) {
        if (v !== undefined) result[k] = v
      }
      return Object.keys(result).length ? result : undefined
    }
    const result: Record<string, any> = {}
    let hasFilters = false
    for (const [key, val] of Object.entries(filters)) {
      const resolved = toValue(val as MaybeRefOrGetter<any>)
      if (resolved !== undefined) {
        result[key] = resolved
        hasFilters = true
      }
    }
    return hasFilters ? result : undefined
  }

  async function fetchCount(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const body: Record<string, any> = {}
      const activeFilters = buildActiveFilters()
      if (activeFilters) body.filters = JSON.stringify(activeFilters)

      const json = await requestManager.fetch({
        url: `/api/v2/doctype/${doctype}/count`,
        method: 'GET',
        body,
      })

      if (json?.data !== undefined) {
        count.value = json.data as number
        onSuccess?.(json.data)
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

  const stopWatch = watchEffect(() => {
    const isEnabled = toValue(enabled) ?? true
    if (!isEnabled) return

    // Register reactivity on filter values
    if (filters) {
      if (isRef(filters) || typeof filters === 'function') {
        toValue(filters as MaybeRefOrGetter<Record<string, any>>)
      } else {
        for (const val of Object.values(filters)) {
          toValue(val as MaybeRefOrGetter<any>)
        }
      }
    }

    fetchCount()
  })

  function dispose() {
    stopWatch()
  }

  tryOnScopeDispose(dispose)

  return reactive({
    data: count,
    loading,
    error,
    promise,
    reload: fetchCount,
    dispose,
  }) as unknown as VueCountHandle
}
