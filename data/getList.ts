import {
  reactive,
  ref,
  shallowRef,
  MaybeRefOrGetter,
  toValue,
  watch,
} from 'vue'
import { useFrappeFetch } from './useFrappeFetch'
import {
  getCache,
  setCache,
  updateDocumentInCaches,
  removeDocumentFromCaches,
} from './cache'

export interface GetListOptions {
  fields?: MaybeRefOrGetter<string[] | undefined>
  filters?: MaybeRefOrGetter<Record<string, any> | undefined>
  orderBy?: MaybeRefOrGetter<string | undefined>
  limit?: MaybeRefOrGetter<number | undefined>
  start?: MaybeRefOrGetter<number | undefined>
  debounce?: number
  cache?: string
}

export interface GetListResult<TDoc extends { name: string }> {
  data: TDoc[]
  loading: boolean
  error: any
  hasNextPage: boolean
  reload: () => void
  next: () => void
  setValue: {
    submit: (values: Partial<TDoc> & { name: string }) => {
      optimistic: (fn?: (items: TDoc[]) => TDoc[]) => Promise<void>
      then: <T>(
        onfulfilled?: ((value: void) => T | PromiseLike<T>) | null,
        onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
      ) => Promise<T>
      catch: <T>(
        onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
      ) => Promise<T>
      finally: (onfinally?: (() => void) | null) => Promise<void>
    }
    loading: boolean
    error: any
    data: TDoc | null
  }
  delete: {
    submit: (name: string) => {
      optimistic: (fn?: (items: TDoc[]) => TDoc[]) => Promise<void>
      then: <T>(
        onfulfilled?: ((value: void) => T | PromiseLike<T>) | null,
        onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
      ) => Promise<T>
      catch: <T>(
        onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
      ) => Promise<T>
      finally: (onfinally?: (() => void) | null) => Promise<void>
    }
    loading: boolean
    error: any
  }
  insert: {
    submit: (values: Partial<TDoc>) => {
      optimistic: (fn: (items: TDoc[]) => TDoc[]) => Promise<void>
      then: <T>(
        onfulfilled?: ((value: void) => T | PromiseLike<T>) | null,
        onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
      ) => Promise<T>
      catch: <T>(
        onrejected?: ((reason: any) => T | PromiseLike<T>) | null,
      ) => Promise<T>
      finally: (onfinally?: (() => void) | null) => Promise<void>
    }
    loading: boolean
    error: any
    data: TDoc | null
  }
}

export interface CreateGetListOptions {
  doctype: string
  baseUrl?: string
}

export function createGetList<TDoc extends { name: string }>(
  options: CreateGetListOptions,
) {
  const { doctype, baseUrl = '' } = options

  return function getList(
    listOptions: GetListOptions = {},
  ): GetListResult<TDoc> {
    const {
      fields: fieldsOption,
      filters: filtersOption,
      orderBy: orderByOption,
      limit: limitOption,
      start: startOption,
      debounce: debounceMs = 0,
      cache: cacheKey,
    } = listOptions

    // Internal state for list items
    const items = shallowRef<TDoc[]>([])

    // Create reactive refs for all options
    const limitRef = ref(toValue(limitOption) || 20)
    const startRef = ref(toValue(startOption) || 0)

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    // Load cached data if cache key is provided and set items
    const loadCache = async () => {
      if (cacheKey) {
        const fullCacheKey = `getList::${cacheKey}`
        const cached = await getCache<TDoc[]>(fullCacheKey)
        if (cached) {
          items.value = cached
        }
      }
    }

    loadCache()

    // Use useFrappeFetch with reactive params (but no auto-watch to handle debouncing ourselves)
    const result = useFrappeFetch<{ data: TDoc[]; has_next_page: boolean }>({
      url: `/api/v2/document/${doctype}`,
      baseUrl,
      params: () => {
        const params: Record<string, any> = {
          start: startRef.value,
          limit: limitRef.value,
        }
        const fields = toValue(fieldsOption)
        const filters = toValue(filtersOption)
        const orderBy = toValue(orderByOption)

        if (fields) {
          params.fields = JSON.stringify(fields)
        }
        if (filters) {
          params.filters = JSON.stringify(filters)
        }
        if (orderBy) {
          params.order_by = orderBy
        }
        return params
      },
      watch: false, // We handle watching manually for debouncing
      onSuccess: (json) => {
        if (json?.data) {
          // Update items with fresh data
          items.value = [...json.data]

          // Save to cache if enabled
          if (cacheKey) {
            setCache(`getList::${cacheKey}`, json.data)
          }
        }
      },
    })

    // setValue operation
    const setValueParams = ref<Partial<TDoc> | undefined>(undefined)
    const setValueName = ref<string>('')
    const setValueResult = useFrappeFetch<{ data: TDoc }>({
      url: () => `/api/v2/document/${doctype}/${setValueName.value}`,
      method: 'PATCH',
      params: setValueParams,
      baseUrl,
      immediate: false,
      onSuccess: async (json) => {
        if (json?.data) {
          // Update with server response
          const index = items.value.findIndex(
            (item) => item.name === json.data.name,
          )
          if (index !== -1) {
            items.value = [
              ...items.value.slice(0, index),
              json.data,
              ...items.value.slice(index + 1),
            ]

            // Update cache
            if (cacheKey) {
              await setCache(`getList::${cacheKey}`, items.value)
            }
          }

          // Sync with getDoc cache
          await updateDocumentInCaches(doctype, json.data)
        }
      },
    })

    // delete operation
    const deleteName = ref<string>('')
    const deleteResult = useFrappeFetch({
      url: () => `/api/v2/document/${doctype}/${deleteName.value}`,
      method: 'DELETE',
      baseUrl,
      immediate: false,
      onSuccess: async () => {
        // Remove the item from the list
        items.value = items.value.filter(
          (item) => item.name !== deleteName.value,
        )

        // Update cache
        if (cacheKey) {
          await setCache(`getList::${cacheKey}`, items.value)
        }

        // Sync with getDoc cache
        await removeDocumentFromCaches(doctype, deleteName.value)
      },
    })

    // insert operation
    const insertParams = ref<Partial<TDoc> | undefined>(undefined)
    let insertOptimisticApplied = false
    const insertResult = useFrappeFetch<{ data: TDoc }>({
      url: `/api/v2/document/${doctype}`,
      method: 'POST',
      params: insertParams,
      baseUrl,
      immediate: false,
      onSuccess: (json) => {
        if (json?.data) {
          if (insertOptimisticApplied) {
            // Replace first item (optimistic one) with server response
            items.value = [json.data, ...items.value.slice(1)]
            insertOptimisticApplied = false
          } else {
            // Add to beginning of list
            items.value = [json.data, ...items.value]
          }
        }
      },
    })

    // Debounced execute wrapper
    const debouncedExecute = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      if (debounceMs > 0) {
        debounceTimeout = setTimeout(() => {
          result.execute()
        }, debounceMs)
      } else {
        result.execute()
      }
    }

    // Setup watchers for reactive options to trigger debounced fetch
    const watchOptions = [
      {
        option: fieldsOption,
        onChange: () => debouncedExecute(),
      },
      {
        option: filtersOption,
        onChange: () => debouncedExecute(),
      },
      {
        option: orderByOption,
        onChange: () => debouncedExecute(),
      },
      {
        option: limitOption,
        onChange: (newVal: any) => {
          limitRef.value = newVal || 20
          debouncedExecute()
        },
      },
      {
        option: startOption,
        onChange: (newVal: any) => {
          startRef.value = newVal || 0
          debouncedExecute()
        },
      },
    ]

    watchOptions.forEach(({ option, onChange }) => {
      if (option !== undefined && typeof option === 'function') {
        watch(() => toValue(option), onChange, { deep: true, immediate: false })
      }
    })

    return reactive({
      get data() {
        return items.value
      },
      get loading() {
        return result.loading
      },
      get error() {
        return result.error
      },
      get hasNextPage() {
        return result.json?.has_next_page || false
      },
      reload: () => result.execute(),
      next: () => {
        if (result.json?.has_next_page) {
          startRef.value += limitRef.value
          debouncedExecute()
        }
      },
      setValue: {
        submit: (values: Partial<TDoc> & { name: string }) => {
          const { name, ...fields } = values
          setValueName.value = name
          setValueParams.value = fields

          const promise = setValueResult.execute()

          return {
            optimistic: (fn?: (items: TDoc[]) => TDoc[]) => {
              const previousItems = items.value.slice()

              if (fn) {
                // Custom optimistic update
                items.value = fn(items.value)
              } else {
                // Default: update the matching item
                const index = items.value.findIndex(
                  (item) => item.name === name,
                )
                if (index !== -1) {
                  const currentItem = items.value[index] as any
                  items.value = [
                    ...items.value.slice(0, index),
                    { ...currentItem, ...fields } as TDoc,
                    ...items.value.slice(index + 1),
                  ]
                }
              }

              // Revert on error
              return promise.catch((err) => {
                items.value = previousItems
                throw err
              })
            },
            then: promise.then.bind(promise),
            catch: promise.catch.bind(promise),
            finally: promise.finally.bind(promise),
          }
        },
        get loading() {
          return setValueResult.loading
        },
        get error() {
          return setValueResult.error
        },
        get data() {
          return setValueResult.json?.data || null
        },
      },
      delete: {
        submit: (name: string) => {
          deleteName.value = name

          const promise = deleteResult.execute()

          return {
            optimistic: (fn?: (items: TDoc[]) => TDoc[]) => {
              const previousItems = items.value.slice()

              if (fn) {
                // Custom optimistic update
                items.value = fn(items.value)
              } else {
                // Default: remove the item
                items.value = items.value.filter((item) => item.name !== name)
              }

              // Revert on error
              return promise.catch((err) => {
                items.value = previousItems
                throw err
              })
            },
            then: promise.then.bind(promise),
            catch: promise.catch.bind(promise),
            finally: promise.finally.bind(promise),
          }
        },
        get loading() {
          return deleteResult.loading
        },
        get error() {
          return deleteResult.error
        },
      },
      insert: {
        submit: (values: Partial<TDoc>) => {
          insertParams.value = values

          const promise = insertResult.execute()

          return {
            optimistic: (fn: (items: TDoc[]) => TDoc[]) => {
              const previousItems = items.value.slice()
              items.value = fn(items.value)
              insertOptimisticApplied = true

              // Revert on error
              return promise.catch((err) => {
                items.value = previousItems
                insertOptimisticApplied = false
                throw err
              })
            },
            then: promise.then.bind(promise),
            catch: promise.catch.bind(promise),
            finally: promise.finally.bind(promise),
          }
        },
        get loading() {
          return insertResult.loading
        },
        get error() {
          return insertResult.error
        },
        get data() {
          return insertResult.json?.data || null
        },
      },
    }) as GetListResult<TDoc>
  }
}
