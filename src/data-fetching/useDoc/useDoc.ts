import { computed, MaybeRef, reactive, readonly, unref, Ref } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from '../useFrappeFetch'
import { useCall } from '../useCall/useCall'
import { UseCallOptions } from '../useCall/types'
import { docStore } from '../docStore'

// Transform method signatures into useCall return type
type TransformMethods<T> = {
  [K in keyof T]: T[K] extends () => infer R
    ? ReturnType<typeof useCall<R>>
    : T[K] extends (params: infer P) => infer R
      ? P extends object
        ? ReturnType<typeof useCall<R, P>>
        : 'Method must take a single object parameter or no parameters'
      : never
}

interface DocMethodOption<T = any>
  extends Omit<UseCallOptions<T>, 'url' | 'baseUrl'> {
  name: string
}

interface UseDocOptions {
  doctype: string
  name: string | MaybeRef<string>
  baseUrl?: string
  methods?: Record<string, string | DocMethodOption>
  immediate?: boolean
}

export function useDoc<TDoc, TMethods = {}>(options: UseDocOptions) {
  const {
    baseUrl = '',
    doctype,
    name,
    methods = {},
    immediate = true,
  } = options

  const url = computed(
    () => `${baseUrl}/api/v2/document/${doctype}/${unref(name)}`,
  )

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch: true,
    afterFetch(ctx) {
      docStore.setDoc({ doctype, ...ctx.data })
      return ctx
    },
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
  } = useFrappeFetch(url, fetchOptions).get()

  let docMethods: Record<string, ReturnType<typeof useCall>> = {}
  if (methods) {
    for (let key in methods) {
      let option: DocMethodOption
      if (typeof methods[key] === 'string') {
        option = {
          name: methods[key] as string,
        }
      } else {
        option = methods[key] as DocMethodOption
      }

      let callOptions: UseCallOptions = {
        immediate: false,
        refetch: true,
        method: 'POST',
        ...option,
        baseUrl,
        url: computed(
          () =>
            `/api/v2/document/${doctype}/${unref(name)}/method/${option.name}`,
        ),
      }

      docMethods[key] = readonly(useCall(callOptions))
    }
  }

  const doc = docStore.getDoc(doctype, name) as Ref<TDoc | null>

  let out = reactive({
    doc,
    error,
    loading: isFetching,
    aborted,
    canAbort,
    isFetching,
    isFinished,
    execute,
    fetch: execute,
    reload: execute,
    abort,
    ...docMethods,
  })

  return out as typeof out & TransformMethods<TMethods>
}
