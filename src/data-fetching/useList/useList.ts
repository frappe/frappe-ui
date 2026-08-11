import {
  computed,
  MaybeRefOrGetter,
  reactive,
  readonly,
  Ref,
  ref,
  toValue,
} from 'vue'
import {
  AfterFetchContext,
  OnFetchErrorContext,
  UseFetchOptions,
} from '@vueuse/core'
import { FrappeResponseError, useFrappeFetch } from '../useFrappeFetch'
import { useAction } from '../useAction'
import { parseFilters, makeGetParams, normalizeCacheKey } from '../utils'
import { UseListOptions, UseListResponse } from './types'
import { idbStore } from '../idbStore'
import { listStore } from './listStore'
import { docStore } from '../docStore'

export function useList<T extends { name: string }>(
  options: UseListOptions<T>,
) {
  const {
    doctype,
    fields,
    filters,
    orderBy,
    start,
    limit,
    groupBy,
    parent,
    debug,
    initialData,
    immediate = true,
    refetch = true,
    cacheKey,
    staleOnError = false,
    baseUrl = '',
    url = '',
    transform,
  } = options

  const _start = ref(start || 0)
  const _limit = ref(limit || 20)

  const _url = computed(() => {
    const parsedFilters = filters ? parseFilters(filters) : null
    const _fields = fields ? toValue(fields) : []
    const params = makeGetParams({
      fields: _fields.length ? JSON.stringify(_fields) : null,
      filters: parsedFilters ? JSON.stringify(parsedFilters) : null,
      order_by: toValue(orderBy),
      start: _start.value,
      limit: _limit.value,
      group_by: groupBy,
      parent: parent,
      debug: debug,
    })
    if (url) {
      return `${baseUrl}${url}?${params}`
    }
    return `${baseUrl}/api/v2/document/${doctype}?${params}`
  })

  // `data` is exposed via the `result` computed below, which reads from
  // `allData` (populated in `afterFetch`) — not from the underlying fetch's
  // own `data` ref. Seed `allData` itself, or `initialData` would never
  // surface until the first response lands.
  const allData: Ref<T[] | null> = ref(null)
  if (initialData) {
    allData.value = initialData
  }
  const hasNextPage = ref(true)
  const hasPreviousPage = computed(() => _start.value > 0)

  let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useList')
  let cachedResponse = ref<UseListResponse<T> | null>(
    null,
  ) as Ref<UseListResponse<T> | null>

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    initialData: initialData || null,
    afterFetch: handleAfterFetch<T>({
      ...options,
      allData,
      _start,
      _limit,
      hasNextPage,
      cachedResponse,
    }),
    onFetchError: handleFetchError<T>(options),
  }

  const {
    data,
    error,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    abort,
    execute,
  } = useFrappeFetch<UseListResponse<T>>(_url, fetchOptions).get()

  const result = computed(() => {
    let cachedData = normalizedCacheKey ? cachedResponse.value : null
    if (
      cachedData &&
      canUseCachedFallback(error.value, staleOnError) &&
      (out.loading || !out.isFinished || !allData.value || error.value)
    ) {
      if (transform) {
        let returnValue = transform(cachedData as T[])
        if (returnValue !== undefined) {
          return returnValue
        }
      }
      return cachedData
    }
    return allData.value
  })

  if (normalizedCacheKey) {
    idbStore.get(normalizedCacheKey).then((data) => {
      if (data) {
        cachedResponse.value = data as UseListResponse<T>
      }
    })
  }

  const next = () => {
    _start.value += _limit.value
    if (!refetch) execute()
  }

  const previous = () => {
    _start.value = Math.max(0, _start.value - _limit.value)
    if (!refetch) execute()
  }

  const updateRow = (
    doc: Partial<{ name: string }> & Record<string, unknown>,
  ) => {
    if (allData.value == null) return
    let changed = false
    for (let row of allData.value) {
      if (doc.name && doc.name === row.name) {
        for (let key in doc) {
          if (key in row && doc[key] !== undefined) {
            ;(row as Record<string, unknown>)[key] = doc[key]
            changed = true
          }
        }
        break
      }
    }
    if (changed) {
      allData.value = [...allData.value]
    }
  }

  const removeRow = (name: string) => {
    if (allData.value == null) return
    const index = allData.value.findIndex((row) => row.name === name)
    if (index > -1) {
      allData.value.splice(index, 1)
      allData.value = [...allData.value]
    }
  }

  const insertAction = useAction<T, Partial<T>>({
    url: () => `/api/v2/document/${doctype}`,
    method: 'POST',
    baseUrl,
    onSuccess() {
      if (refetch) execute()
    },
  })

  const insert = reactive({
    data: insertAction.data,
    error: insertAction.error,
    loading: insertAction.loading,
    /**
     * True while an insert is in flight. Takes no target: the row has no name
     * until the server gives it one, so there is nothing to key on. Same answer
     * as `loading`, kept so every write method has `isLoading`.
     */
    isLoading: () => insertAction.loading.value,
    submit: insertAction.submit,
  })

  const setValueAction = useAction<T, Partial<T> & { name: string }>({
    url: ({ name }) => `/api/v2/document/${doctype}/${name}`,
    method: 'PUT',
    baseUrl,
    key: ({ name }) => name,
    onStoreWrite(data, _params, stamp) {
      docStore.setDoc({ doctype, ...data }, stamp)
      listStore.updateRow(doctype, data, stamp)
    },
    onSuccess() {
      // Gated per target: a stale same-row save must not trigger a refetch
      // with an answer a newer save has already replaced. The store writes
      // above are not part of that decision.
      if (refetch) execute()
    },
  })

  const setValue = reactive({
    data: setValueAction.data,
    error: setValueAction.error,
    loading: setValueAction.loading,
    /** True while a save for this row is in flight. */
    isLoading: (name: string) => setValueAction.isLoading(name),
    submit: setValueAction.submit,
  })

  type DeleteResponse = 'ok'
  type DeleteParams = { name: string }

  const deleteAction = useAction<DeleteResponse, DeleteParams>({
    url: ({ name }) => `/api/v2/document/${doctype}/${name}`,
    method: 'DELETE',
    baseUrl,
    key: ({ name }) => name,
    onStoreWrite(_data, { name }) {
      docStore.removeDoc(doctype, name)
      listStore.removeRow(doctype, name)
    },
    onSuccess() {
      if (refetch) execute()
    },
  })

  const delete_ = reactive({
    data: deleteAction.data,
    error: deleteAction.error,
    loading: deleteAction.loading,
    /** True while a delete for this row is in flight. */
    isLoading: (name: string) => deleteAction.isLoading(name),
    submit: deleteAction.submit,
  })

  let out = reactive({
    data: result,
    hasNextPage: readonly(hasNextPage),
    hasPreviousPage,
    start: readonly(_start),
    limit: readonly(_limit),
    error: readonly(error),
    loading: isFetching,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    url: _url,
    abort,
    next,
    previous,
    execute,
    fetch: execute,
    reload: execute,
    updateRow,
    removeRow,
    insert,
    setValue,
    delete: delete_,
  })

  listStore.addList(doctype, out)

  return out
}

function canUseCachedFallback(error: unknown, staleOnError: boolean) {
  return !error || (staleOnError && !(error instanceof FrappeResponseError))
}

function handleAfterFetch<T extends { name: string }>({
  transform,
  onSuccess,
  cacheKey,
  allData,
  _start,
  _limit,
  hasNextPage,
  cachedResponse,
}: UseListOptions<T> & {
  allData: Ref<T[] | null>
  _start: Ref<number>
  _limit: Ref<number>
  hasNextPage: Ref<boolean>
  cachedResponse: Ref<UseListResponse<T> | null>
}) {
  return function (
    ctx: AfterFetchContext<{
      data: UseListResponse<T>
      has_next_page: boolean
    }>,
  ) {
    if (ctx.data) {
      let resultData = ctx.data.data
      if (resultData[0]?.name) {
        for (let row of resultData) {
          row.name = String(row.name)
        }
      }
      if (ctx.data.has_next_page != null) {
        hasNextPage.value = ctx.data.has_next_page
      } else {
        hasNextPage.value = resultData.length < _limit.value ? false : true
      }
      if (transform) {
        const returnValue = transform(resultData)
        if (Array.isArray(returnValue)) {
          resultData = returnValue
        }
      }

      if (_start.value === 0) {
        allData.value = resultData
      } else {
        allData.value = [...(allData.value || []), ...resultData]
      }
      ctx.data.data = allData.value

      let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useList')
      if (normalizedCacheKey) {
        idbStore.set(normalizedCacheKey, ctx.data.data)
        cachedResponse.value = ctx.data.data
      }
      if (onSuccess) {
        try {
          onSuccess(allData.value)
        } catch (e) {
          console.error('Error in onSuccess hook:', e)
        }
      }
    }

    return ctx
  } as UseFetchOptions['afterFetch']
}

function handleFetchError<T>({ onError }: UseListOptions<T>) {
  return function (ctx: OnFetchErrorContext) {
    if (onError) {
      try {
        onError(ctx.error)
      } catch (e) {
        console.error('Error in onError hook:', e)
      }
    }
    return ctx
  } as UseFetchOptions['onFetchError']
}
