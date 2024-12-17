import { computed, reactive, readonly, ref } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from './useFrappeFetch'
import { useCall } from './useCall'
import { parseFilters, makeGetParams } from './utils'
import { ListOptions, ListResponse } from './types'

export function useList<T>(options: ListOptions<T>) {
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
    return `/api/v2/document/${doctype}?${params}`
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
  } = useFrappeFetch<ListResponse<T>>(url, fetchOptions).get()

  const result = computed(() => data.value?.result ?? null)
  const hasNextPage = computed(() => data.value?.has_next_page ?? false)
  const hasPreviousPage = computed(() => _start.value > 0)

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

  return reactive({
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
    execute,
    next,
    previous,
    reload: execute,
    insert,
  })
}

function handleAfterFetch<T>({ transform, onSuccess }: ListOptions<T>) {
  return function (ctx) {
    if (transform) {
      const returnValue = transform(ctx.data.result)
      if (Array.isArray(returnValue)) {
        ctx.data.result = returnValue
      }
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

function handleFetchError<T>({ onError }: ListOptions<T>) {
  return function (ctx) {
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
