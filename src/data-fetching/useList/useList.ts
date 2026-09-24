import {
  computed,
  MaybeRefOrGetter,
  reactive,
  readonly,
  Ref,
  ref,
  toRaw,
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

  // Every row loaded so far, as the server sent it. This is the one copy that
  // changes: pages and row updates land here, and IndexedDB stores it.
  // `initialData` has the same shape, so the rows start from a copy of it.
  let rawRows: T[] | null = initialData ? unwrapDeep(initialData) : null
  // Rows are saved only after the first response, so `initialData` rows,
  // changed or not, never replace rows that a real response cached.
  let hasResponse = false
  // The rows `data` shows: `rawRows` after `transform`. `data` is exposed via
  // the `result` computed below, which reads from `allData`, not from the
  // underlying fetch's own `data` ref.
  const allData: Ref<T[] | null> = ref(null)
  if (rawRows) {
    allData.value = transformRows(rawRows)
  }
  const hasNextPage = ref(true)
  const hasPreviousPage = computed(() => _start.value > 0)

  let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useList')
  // Rows ready to show, already transformed. IndexedDB holds them untransformed.
  let cachedResponse = ref<UseListResponse<T> | null>(
    null,
  ) as Ref<UseListResponse<T> | null>

  // Replaces the raw rows, shows them and saves them. `transform` runs on all
  // of them at once, so a list read back from the cache shows the same result
  // as a fresh one, even for a transform that sorts or groups the whole list.
  function setRows(rows: T[]) {
    rawRows = rows
    allData.value = transformRows(rows)
    if (normalizedCacheKey && hasResponse) {
      // Shown while the list reloads, so it keeps up with row changes too.
      cachedResponse.value = allData.value
      // Transformed rows may not survive JSON, and `transform` runs again
      // when the cache is read, so the cache holds the raw rows.
      idbStore.set(normalizedCacheKey, rows)
    }
    return allData.value
  }

  // `transform` may change the rows in place, so it gets a copy. With no
  // `transform`, `data` holds the raw rows themselves.
  function transformRows(rows: T[]) {
    return transform ? applyTransform(structuredClone(rows), transform) : rows
  }

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    initialData: initialData || null,
    afterFetch: handleAfterFetch<T>({
      ...options,
      getRawRows: () => rawRows,
      setRows(rows) {
        hasResponse = true
        return setRows(rows)
      },
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

  const result = computed(() => {
    let cachedData = normalizedCacheKey ? cachedResponse.value : null
    if (
      cachedData &&
      canUseCachedFallback(error.value, staleOnError) &&
      (out.loading || !out.isFinished || !allData.value || error.value)
    ) {
      return cachedData
    }
    return allData.value
  })

  if (normalizedCacheKey) {
    idbStore.get(normalizedCacheKey).then((data) => {
      if (data) {
        // Stored rows are as the server sent them. Transform them once, here,
        // the same as a fresh response.
        cachedResponse.value = applyTransform(data as T[], transform)
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

  // Row changes apply to the raw rows, which have the shape `doc` has, and
  // `transform` runs again on the result. Rows from `initialData` change too.
  // Rows shown from the cache before the first response do not.
  const updateRow = (
    doc: Partial<{ name: string }> & Record<string, unknown>,
  ) => {
    if (rawRows == null) return
    let changed = false
    for (let row of rawRows) {
      if (doc.name && doc.name === row.name) {
        // Through `reactive`, so that with no `transform` a component that
        // shows this row object sees the change.
        let reactiveRow = reactive(row) as Record<string, unknown>
        let values = row as Record<string, unknown>
        for (let key in doc) {
          // A key that already has this value is not a change, so an update
          // that changes nothing does not run `transform` again.
          if (
            key in row &&
            doc[key] !== undefined &&
            values[key] !== doc[key]
          ) {
            reactiveRow[key] = doc[key]
            changed = true
          }
        }
        break
      }
    }
    if (changed) {
      setRows([...rawRows])
    }
  }

  const removeRow = (name: string) => {
    if (rawRows == null) return
    const index = rawRows.findIndex((row) => row.name === name)
    if (index > -1) {
      setRows(rawRows.filter((_, i) => i !== index))
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

// A copy of `value` with no Vue proxy at any depth. `initialData` may hold
// proxies, even inside a row, and `structuredClone` in `transformRows` cannot
// copy them. Only arrays and plain objects are copied; other values are
// unwrapped where they are.
function unwrapDeep<V>(value: V): V {
  let raw = toRaw(value)
  if (Array.isArray(raw)) {
    return raw.map((item) => unwrapDeep(item)) as V
  }
  if (raw && Object.getPrototypeOf(raw) === Object.prototype) {
    let entries = Object.entries(raw as Record<string, unknown>)
    return Object.fromEntries(
      entries.map(([key, item]) => [key, unwrapDeep(item)]),
    ) as V
  }
  return raw
}

function canUseCachedFallback(error: unknown, staleOnError: boolean) {
  return !error || (staleOnError && !(error instanceof FrappeResponseError))
}

function handleAfterFetch<T extends { name: string }>({
  onSuccess,
  getRawRows,
  setRows,
  _start,
  _limit,
  hasNextPage,
}: UseListOptions<T> & {
  getRawRows: () => T[] | null
  setRows: (rows: T[]) => T[]
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

      let rawRows =
        _start.value === 0
          ? resultData
          : [...(getRawRows() || []), ...resultData]
      let rows = setRows(rawRows)
      ctx.data.data = rows
      if (onSuccess) {
        try {
          onSuccess(rows)
        } catch (e) {
          console.error('Error in onSuccess hook:', e)
        }
      }
    }

    return ctx
  } as UseFetchOptions['afterFetch']
}

function applyTransform<T>(rows: T[], transform?: (data: T[]) => T[]) {
  if (!transform) return rows
  const returnValue = transform(rows)
  return Array.isArray(returnValue) ? returnValue : rows
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
