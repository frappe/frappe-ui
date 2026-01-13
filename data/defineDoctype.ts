import {
  computed,
  reactive,
  ref,
  Ref,
  MaybeRefOrGetter,
  toValue,
  watch,
} from 'vue'
import { useFrappeFetch } from './useFrappeFetch'

export interface DoctypeOptions {
  baseUrl?: string
}

export interface GetDocResult<TDoc> {
  doc: TDoc | null
  loading: boolean
  error: any
  reload: () => void
}

export interface GetListOptions {
  fields?: MaybeRefOrGetter<string[] | undefined>
  filters?: MaybeRefOrGetter<Record<string, any> | undefined>
  orderBy?: MaybeRefOrGetter<string | undefined>
  limit?: MaybeRefOrGetter<number | undefined>
  start?: MaybeRefOrGetter<number | undefined>
  debounce?: number
}

export interface GetListResult<TDoc> {
  data: TDoc[]
  loading: boolean
  error: any
  hasNextPage: boolean
  reload: () => void
  next: () => void
}

export function defineDoctype<TDoc extends { name: string }>(
  doctype: string,
  options: DoctypeOptions = {},
) {
  const { baseUrl = '' } = options

  function getDoc(name: MaybeRefOrGetter<string>): GetDocResult<TDoc> {
    const nameValue = toValue(name)
    const urlString = `/api/v2/document/${doctype}/${nameValue}`

    const result = useFrappeFetch({ url: urlString, baseUrl })

    return reactive({
      get doc() {
        if (result.json?.data) {
          return result.json.data as TDoc
        }
        return null
      },
      get loading() {
        return result.loading
      },
      get error() {
        return result.error
      },
      reload: result.execute,
    }) as GetDocResult<TDoc>
  }

  function getList(listOptions: GetListOptions = {}): GetListResult<TDoc> {
    const {
      fields: fieldsOption,
      filters: filtersOption,
      orderBy: orderByOption,
      limit: limitOption,
      start: startOption,
      debounce: debounceMs = 0,
    } = listOptions

    // Create reactive refs for all options
    const fieldsRef = ref(toValue(fieldsOption))
    const filtersRef = ref(toValue(filtersOption))
    const orderByRef = ref(toValue(orderByOption))
    const limitRef = ref(toValue(limitOption) || 20)
    const startRef = ref(toValue(startOption) || 0)

    const state = reactive({
      data: [] as TDoc[],
      loading: false,
      error: null as any,
      hasNextPage: false,
    })

    let abortController: AbortController | null = null
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    const fetchList = async () => {
      // Cancel any in-flight request
      if (abortController) {
        abortController.abort()
      }

      // Clear any pending debounced call
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
        debounceTimeout = null
      }

      abortController = new AbortController()
      state.loading = true
      state.error = null

      try {
        const params: Record<string, any> = {
          start: startRef.value,
          limit: limitRef.value,
        }
        if (fieldsRef.value) {
          params.fields = JSON.stringify(fieldsRef.value)
        }
        if (filtersRef.value) {
          params.filters = JSON.stringify(filtersRef.value)
        }
        if (orderByRef.value) {
          params.orderBy = orderByRef.value
        }

        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value))
        })

        const url = `/api/v2/document/${doctype}`
        const fullUrl = `${baseUrl}${url}?${searchParams.toString()}`
        const response = await fetch(fullUrl, {
          signal: abortController.signal,
        })

        const json = await response.json()

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        state.data = (json.data || []) as any
        state.hasNextPage = json.has_next_page || false
      } catch (e) {
        // Ignore abort errors
        if (e instanceof Error && e.name === 'AbortError') {
          return
        }
        state.error = e instanceof Error ? e : new Error(String(e))
        state.data = []
      } finally {
        state.loading = false
        abortController = null
      }
    }

    const debouncedFetch = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      if (debounceMs > 0) {
        debounceTimeout = setTimeout(() => {
          fetchList()
        }, debounceMs)
      } else {
        fetchList()
      }
    }

    // Setup watchers for reactive options
    const watchOptions = [
      { option: fieldsOption, target: fieldsRef, transform: (v: any) => v },
      {
        option: filtersOption,
        target: filtersRef,
        transform: (v: any) => v,
        deep: true,
      },
      { option: orderByOption, target: orderByRef, transform: (v: any) => v },
      {
        option: limitOption,
        target: limitRef,
        transform: (v: any) => v || 20,
      },
      {
        option: startOption,
        target: startRef,
        transform: (v: any) => v || 0,
      },
    ]

    watchOptions.forEach(({ option, target, transform, deep }) => {
      if (option !== undefined && typeof option === 'function') {
        watch(
          () => toValue(option),
          (newVal) => {
            target.value = transform(newVal)
            debouncedFetch()
          },
          { deep, immediate: false },
        )
      }
    })

    // Initial fetch
    fetchList()

    return reactive({
      get data() {
        return state.data
      },
      get loading() {
        return state.loading
      },
      get error() {
        return state.error
      },
      get hasNextPage() {
        return state.hasNextPage
      },
      reload: fetchList,
      next: () => {
        if (state.hasNextPage) {
          startRef.value += limitRef.value
          debouncedFetch()
        }
      },
    }) as GetListResult<TDoc>
  }

  return {
    getDoc,
    getList,
  }
}
