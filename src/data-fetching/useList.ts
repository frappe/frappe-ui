import { computed, Reactive, reactive, readonly, ref, unref } from 'vue'
import { isEmptyObject, makeGetParams } from './common'
import { useFrappeFetch } from './useFrappeFetch'
import { useCall } from './useCall'

type Field = string

type ChildTableField = {
  [key: string]: Field[]
}

type FilterValue =
  | string
  | number
  | boolean
  | [string, string | number | boolean]

export interface ListFilters {
  [key: Field]: FilterValue
}

type OrderBy =
  | `${Field} ASC`
  | `${Field} DESC`
  | `${Field} asc`
  | `${Field} desc`

export interface ListOptions<T> {
  doctype: string
  fields?: Array<keyof T | ChildTableField>
  filters?: Reactive<ListFilters>
  orderBy?: OrderBy
  start?: number
  limit?: number
  groupBy?: Field
  parent?: string
  debug?: boolean
  cacheKey?: string | Array<string | number | boolean>
  immediate?: boolean
  refetch?: boolean
  transform?: (data: T[]) => T[]
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
}

export function useList<T>({
  doctype,
  fields,
  filters,
  orderBy,
  start,
  limit,
  groupBy,
  parent,
  debug,
  cacheKey,
  immediate = true,
  refetch = true,
  transform,
  onSuccess,
  onError,
}: ListOptions<T>) {
  const _start = ref(start || 0)
  const _limit = ref(limit || 20)

  const url = computed(() => {
    let parsedFilters = parseFilters(filters || {})

    let params = makeGetParams({
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

  type ListResponse = {
    result: T[]
    has_next_page: boolean
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
  } = useFrappeFetch<ListResponse>(url, {
    immediate,
    refetch,
    afterFetch(ctx) {
      if (transform) {
        let returnValue = transform(ctx.data.result)
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
    },
    onFetchError(ctx) {
      if (onError) {
        try {
          onError(ctx.error)
        } catch (e) {
          console.error('Error in onError hook:', e)
        }
      }
      return ctx
    },
  })

  const result = computed(() => (data.value ? data.value.result : null))
  const hasNextPage = computed(() =>
    data.value ? data.value.has_next_page : false,
  )
  const hasPreviousPage = computed(() => _start.value > 0)

  const next = () => {
    _start.value += _limit.value
    if (!refetch) {
      execute()
    }
  }

  const previous = () => {
    _start.value -= _limit.value
    if (_start.value < 0) {
      _start.value = 0
    }
    if (!refetch) {
      execute()
    }
  }

  const insert = useCall({
    url: `/api/v2/document/${doctype}`,
    method: 'POST',
    immediate: false,
    refetch: false,
    onSuccess() {
      if (refetch) {
        execute()
      }
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

export function parseFilters(filters: ListFilters): ListFilters | null {
  let parsedFilters: ListFilters = {}
  for (let key in filters) {
    let value = filters[key]
    if (Array.isArray(value)) {
      let [operator, actualValue] = value
      operator = unref(operator)
      actualValue = unref(actualValue)
      if (operator === 'like') {
        if (typeof actualValue != 'string') {
          actualValue = String(actualValue)
        }
        if (actualValue == null || actualValue == '') {
          continue
        }
        if (!actualValue.includes('%')) {
          actualValue = `%${actualValue}%`
        }
      }
      parsedFilters[key] = [operator, actualValue]
    } else {
      parsedFilters[key] = unref(value)
    }
  }
  if (isEmptyObject(parsedFilters)) {
    return null
  }
  return parsedFilters
}
