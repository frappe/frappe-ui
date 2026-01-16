import {
  reactive,
  ref,
  computed,
  watch,
  MaybeRefOrGetter,
  toValue,
  onUnmounted,
} from 'vue'
import { useFrappeFetch } from './useFrappeFetch'
import {
  getDocumentFromCache,
  updateDocumentInCaches,
  updateDocumentInCachesAndNotify,
  removeDocumentFromCaches,
  syncFromDocs,
  watchDocument,
} from './cache'

import { ControllerMethods, MappedDocMethods } from './defineDoctype'

export interface GetDocOptions<
  TDocMethods extends ControllerMethods = ControllerMethods,
> {
  doctype: string
  baseUrl?: string
  docMethods?: TDocMethods
}

export type GetDocResult<
  TDoc,
  TDocMethods extends ControllerMethods = ControllerMethods,
> = {
  doc: TDoc | null
  loading: boolean
  error: any
  reload: () => void
  setValue: {
    submit: (values: Partial<TDoc>) => {
      optimistic: (fn?: (doc: TDoc) => TDoc) => Promise<void>
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
    submit: () => Promise<void>
    loading: boolean
    error: any
  }
} & MappedDocMethods<TDoc, TDocMethods>

export function createGetDoc<
  TDoc extends { name: string },
  TDocMethods extends ControllerMethods = ControllerMethods,
>(options: GetDocOptions<TDocMethods>) {
  const { doctype, baseUrl = '', docMethods } = options

  return function getDoc(
    name: MaybeRefOrGetter<string>,
  ): GetDocResult<TDoc, TDocMethods> {
    const nameValue = computed(() => toValue(name))
    const urlString = computed(
      () => `/api/v2/document/${doctype}/${nameValue.value}`,
    )

    // Source of truth for optimistic/temporary changes
    const optimisticDoc = ref<TDoc | null>(null)
    const cachedData = ref<TDoc | null>(null)

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

    const loadCache = async () => {
      const targetName = nameValue.value
      const cached = await getDocumentFromCache<TDoc>(doctype, targetName)

      // Only apply cache if we're still looking at the same document
      if (nameValue.value === targetName) {
        cachedData.value = cached || null
      }
    }
    loadCache()

    // Subscribe to document updates from cache
    let unwatchDocument: (() => void) | null = null

    const subscribeToDocument = () => {
      unwatchDocument?.() // Unsubscribe from previous
      unwatchDocument = watchDocument(doctype, nameValue.value, (doc) => {
        // Update local state when cache notifies us
        if (result.json) {
          result.json.data = doc
        } else {
          result.json = { data: doc } as any
        }
      })
    }

    subscribeToDocument()

    // Cleanup watcher on unmount to prevent memory leaks
    onUnmounted(() => {
      unwatchDocument?.()
    })

    // Reset local/cached state when name changes
    watch(
      nameValue,
      () => {
        if (result.json) {
          result.json.data = null as any
        }
        cachedData.value = null
        optimisticDoc.value = null
        loadCache() // Race-condition safe now
        subscribeToDocument() // Re-subscribe to new document
      },
      { immediate: false },
    )

    // setValue operation
    const setValueParams = ref<Partial<TDoc> | undefined>(undefined)
    const setValueResult = useFrappeFetch<{ data: TDoc; docs?: any[] }>({
      url: urlString,
      method: 'PATCH',
      params: setValueParams,
      baseUrl,
      immediate: false,
      onSuccess: async (json) => {
        // Sync docs array if present, otherwise sync the data directly
        if (json?.docs) {
          await syncFromDocs(json.docs)
        } else if (json?.data) {
          await updateDocumentInCachesAndNotify(doctype, json.data)
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
        if (result.json) {
          result.json.data = null as any
        }
        await removeDocumentFromCaches(doctype, currentName)
      },
    })

    const mappedDocMethods = {} as MappedDocMethods<TDoc, TDocMethods>

    if (docMethods) {
      for (const [key, methodDef] of Object.entries(docMethods)) {
        const { method, httpMethod = 'POST', args } = methodDef

        const paramsRef = reactive<Record<string, any>>({})

        const methodResult = useFrappeFetch({
          url: computed(
            () =>
              `/api/v2/document/${doctype}/${nameValue.value}/method/${method}`,
          ),
          method: httpMethod,
          baseUrl,
          immediate: false,
          params: () => paramsRef,
          onSuccess: async (json: any) => {
            // Sync all documents from server response
            await syncFromDocs(json?.docs)
          },
        })

        const mappedMethod = reactive({
          submit: (...fnArgs: any[]) => {
            const newParams = args(...fnArgs)
            for (const k in paramsRef) delete paramsRef[k]
            Object.assign(paramsRef, newParams)

            const promise = methodResult.execute()

            return {
              optimistic: (fn: (doc: TDoc) => TDoc) => {
                const currentDoc = resultObject.doc
                if (currentDoc) {
                  optimisticDoc.value = fn({ ...currentDoc } as TDoc)
                }

                // .finally ensures that we clear the override even on error,
                // letting the UI fall back to the last authoritative state.
                return promise.finally(() => {
                  optimisticDoc.value = null
                })
              },
              then: promise.then.bind(promise),
              catch: promise.catch.bind(promise),
              finally: promise.finally.bind(promise),
            }
          },
          get loading() {
            return methodResult.loading
          },
          get error() {
            return methodResult.error
          },
          get data() {
            return methodResult.json
          },
        })

        // @ts-ignore
        mappedDocMethods[key] = mappedMethod
      }
    }

    const resultObject = reactive({
      get doc() {
        // Priority: Optimistic State > Server Data > Cached Data (while loading)
        if (optimisticDoc.value) {
          return optimisticDoc.value
        }
        if (result.json?.data) {
          return result.json.data
        }
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
        submit: (values: Partial<TDoc>) => {
          setValueParams.value = values
          const promise = setValueResult.execute()

          return {
            optimistic: (fn?: (doc: TDoc) => TDoc) => {
              const currentDoc = resultObject.doc
              if (currentDoc) {
                if (fn) {
                  optimisticDoc.value = fn({ ...currentDoc } as TDoc)
                } else {
                  optimisticDoc.value = { ...currentDoc, ...values } as TDoc
                }
              }

              return promise.finally(() => {
                optimisticDoc.value = null
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
        submit: () => deleteResult.execute(),
        get loading() {
          return deleteResult.loading
        },
        get error() {
          return deleteResult.error
        },
      },
      ...mappedDocMethods,
    }) as unknown as GetDocResult<TDoc, TDocMethods>

    return resultObject
  }
}
