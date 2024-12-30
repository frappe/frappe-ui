import { computed, reactive, readonly, ref } from 'vue'
import {
  AfterFetchContext,
  OnFetchErrorContext,
  UseFetchOptions,
} from '@vueuse/core'
import { useFrappeFetch } from '../useFrappeFetch'
import { useCall } from '../useCall/useCall'
import { parseFilters, makeGetParams, normalizeCacheKey } from '../utils'
import { UseListOptions, UseListResponse } from './types'
import { idbStore } from '../idbStore'

export function useList<T>(options: UseListOptions<T>) {
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
    baseUrl = '',
    transform,
  } = options

  const _start = ref(start || 0)
  const _limit = ref(limit || 20)

  const url = computed(() => {
    const parsedFilters = parseFilters(filters || {})
    const params = makeGetParams({
      fields: fields?.length ? JSON.stringify(fields) : null,
      filters: parsedFilters ? JSON.stringify(parsedFilters) : null,
      order_by: orderBy,
      start: _start.value,
      limit: _limit.value,
      group_by: groupBy,
      parent: parent,
      debug: debug,
    })
    return `${baseUrl}/api/v2/document/${doctype}?${params}`
  })

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    initialData: initialData
      ? { result: initialData, has_next_page: false }
      : null,
    afterFetch: handleAfterFetch<T>(options),
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
  } = useFrappeFetch<UseListResponse<T>>(url, fetchOptions).get()

  let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useList')
  let cachedResponse = ref<UseListResponse<T> | null>(null)

  const result = computed(() => {
    if (normalizedCacheKey && (out.loading || !out.isFinished)) {
      let data = cachedResponse.value
      if (data) {
        if (transform) {
          let returnValue = transform(data.result as T[])
          if (returnValue !== undefined) {
            return returnValue
          }
        }
        return data.result
      }
    }
    return data.value?.result ?? null
  })
  const hasNextPage = computed(() => {
    if (normalizedCacheKey && (out.loading || !out.isFinished)) {
      let data = cachedResponse.value
      return data?.has_next_page ?? false
    }
    return data.value?.has_next_page ?? false
  })
  const hasPreviousPage = computed(() => _start.value > 0)

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

  const insert = useCall({
    url: `/api/v2/document/${doctype}`,
    method: 'POST',
    immediate: false,
    refetch: false,
    onSuccess() {
      if (refetch) execute()
    },
  })

  let out = reactive({
    data: result,
    hasNextPage,
    hasPreviousPage,
    start: readonly(_start),
    limit: readonly(_limit),
    error: readonly(error),
    loading: isFetching,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    url,
    abort,
    next,
    previous,
    execute,
    fetch: execute,
    reload: execute,
    insert,
  })

  return out
}

function handleAfterFetch<T>({
  transform,
  onSuccess,
  cacheKey,
}: UseListOptions<T>) {
  return function (ctx: AfterFetchContext) {
    if (transform) {
      const returnValue = transform(ctx.data.result)
      if (Array.isArray(returnValue)) {
        ctx.data.result = returnValue
      }
    }

    let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useList')
    if (normalizedCacheKey) {
      idbStore.set(normalizedCacheKey, ctx.data)
    }

    if (onSuccess) {
      try {
        onSuccess(ctx.data.result)
      } catch (e) {
        console.error('Error in onSuccess hook:', e)
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
