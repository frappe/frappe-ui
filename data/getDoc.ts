import { reactive, ref, computed, watch, MaybeRefOrGetter, toValue } from 'vue'
import { useFrappeFetch } from './useFrappeFetch'
import {
  getDocumentFromCache,
  updateDocumentInCaches,
  removeDocumentFromCaches,
} from './cache'

export interface GetDocOptions {
  doctype: string
  baseUrl?: string
}

export interface GetDocResult<TDoc> {
  doc: TDoc | null
  loading: boolean
  error: any
  reload: () => void
  setValue: {
    submit: (values: Partial<TDoc>) => Promise<void>
    loading: boolean
    error: any
    data: TDoc | null
  }
  delete: {
    submit: () => Promise<void>
    loading: boolean
    error: any
  }
}

export function createGetDoc<TDoc extends { name: string }>(
  options: GetDocOptions,
) {
  const { doctype, baseUrl = '' } = options

  return function getDoc(name: MaybeRefOrGetter<string>): GetDocResult<TDoc> {
    // State to hold cached data
    const cachedData = ref<TDoc | null>(null)

    // Computed values that react to name changes
    const nameValue = computed(() => toValue(name))
    const urlString = computed(
      () => `/api/v2/document/${doctype}/${nameValue.value}`,
    )
    const cacheKey = computed(() => `getDoc::${doctype}::${nameValue.value}`)

    // Function to load cache for current name
    const loadCache = async () => {
      const cached = await getDocumentFromCache<TDoc>(doctype, nameValue.value)
      if (cached) {
        cachedData.value = cached
      } else {
        cachedData.value = null
      }
    }

    // Load cached data initially
    loadCache()

    const result = useFrappeFetch<{ data: TDoc }>({
      url: urlString,
      baseUrl,
      watch: true,
      onSuccess: async (json) => {
        if (json?.data) {
          await updateDocumentInCaches(doctype, json.data)
        }
      },
    })

    // Watch for name changes and load cache
    watch(
      nameValue,
      () => {
        loadCache()
      },
      { immediate: false },
    )

    // setValue operation
    const setValueParams = ref<Partial<TDoc> | undefined>(undefined)
    const setValueResult = useFrappeFetch<{ data: TDoc }>({
      url: urlString,
      method: 'PATCH',
      params: setValueParams,
      baseUrl,
      immediate: false,
      onSuccess: async (json) => {
        if (json?.data) {
          // Update main result data
          if (result.json) {
            result.json.data = json.data
          }

          // Sync with all caches (getDoc + getList)
          await updateDocumentInCaches(doctype, json.data)
        }
      },
    })

    // delete operation
    const deleteResult = useFrappeFetch({
      url: urlString,
      method: 'DELETE',
      baseUrl,
      immediate: false,
      onSuccess: async () => {
        const currentName = nameValue.value

        // Clear result data
        if (result.json) {
          result.json.data = null as any
        }

        // Sync with all caches (getDoc + getList)
        await removeDocumentFromCaches(doctype, currentName)
      },
    })

    return reactive({
      get doc() {
        // Return fresh data if available
        if (result.json?.data) {
          return result.json.data
        }
        // Return cached data while loading
        if (cachedData.value && result.loading) {
          return cachedData.value
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
      setValue: {
        submit: async (values: Partial<TDoc>) => {
          setValueParams.value = values
          await setValueResult.execute()
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
        submit: async () => {
          await deleteResult.execute()
        },
        get loading() {
          return deleteResult.loading
        },
        get error() {
          return deleteResult.error
        },
      },
    }) as GetDocResult<TDoc>
  }
}
