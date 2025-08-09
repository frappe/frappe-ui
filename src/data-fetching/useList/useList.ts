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
import { useFrappeFetch } from '../useFrappeFetch'
import { useCall } from '../useCall/useCall'
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

  const allData: Ref<T[] | null> = ref(null)
  const hasNextPage = ref(true)
  const hasPreviousPage = computed(() => _start.value > 0)

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

  let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useList')
  let cachedResponse = ref<UseListResponse<T> | null>(null)

  const result = computed(() => {
    if (normalizedCacheKey && (out.loading || !out.isFinished)) {
      let data = cachedResponse.value
      if (data) {
        if (transform) {
          let returnValue = transform(data as T[])
          if (returnValue !== undefined) {
            return returnValue
          }
        }
        return data
      }
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

  const insert = useCall<T, Partial<T>>({
    url: `/api/v2/document/${doctype}`,
    method: 'POST',
    immediate: false,
    refetch: false,
    onSuccess() {
      if (refetch) execute()
    },
  })

  const setValueUrl = ref(`/api/v2/document/${doctype}/<name>`)

  const setValue = useCall<T, Partial<T>>({
    url: setValueUrl,
    method: 'PUT',
    baseUrl,
    immediate: false,
    refetch: false,
    beforeSubmit(params) {
      if (params?.name) {
        setValueUrl.value = `/api/v2/document/${doctype}/${params.name}`
      }
    },
    onSuccess(data) {
      docStore.setDoc({ doctype, ...data })
      listStore.updateRow(doctype, data)
      if (refetch) execute()
    },
  })

  let deleteUrl = ref(`/api/v2/document/${doctype}/<name>`)
  type DeleteResponse = 'ok'
  type DeleteParams = { name: string }
  const delete_ = useCall<DeleteResponse, DeleteParams>({
    url: deleteUrl,
    method: 'DELETE',
    immediate: false,
    refetch: false,
    beforeSubmit(params) {
      if (params?.name) {
        deleteUrl.value = `/api/v2/document/${doctype}/${params.name}`
      }
    },
    onSuccess() {
      if (refetch) {
        execute()
      }
      if (delete_.params.name) {
        let { name } = delete_.params
        docStore.removeDoc(doctype, name)
        listStore.removeRow(doctype, name)
      }
    },
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

function handleAfterFetch<T extends { name: string }>({
  transform,
  onSuccess,
  cacheKey,
  allData,
  _start,
  _limit,
  hasNextPage,
}: UseListOptions<T> & {
  allData: Ref<T[] | null>
  _start: Ref<number>
  _limit: Ref<number>
  hasNextPage: Ref<boolean>
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
