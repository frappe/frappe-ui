import { computed, MaybeRef, reactive, readonly, unref } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from '../useFrappeFetch'
import { useCall } from '../useCall/useCall'
import { UseCallOptions } from '../useCall/types'

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

interface UseDocOptions<TMethods = {}> {
  doctype: string
  name: string | MaybeRef<string>
  baseUrl?: string
  methods?: Record<string, string | DocMethodOption>
  immediate?: boolean
}

interface DocTypeMeta {
  name: string
  fields: any[]
  permissions: any
  whitelisted_methods: Array<{
    method: string
    class: string
    app: string
    http_methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE'>
  }>
}

export function useDoc<TDoc, TMethods = {}>(options: UseDocOptions<TMethods>) {
  const {
    baseUrl = '',
    doctype,
    name,
    methods = {},
    immediate = true,
  } = options

  const url = computed(() => {
    let _name = unref(name)
    return `${baseUrl}/api/v2/document/${doctype}/${_name}`
  })

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch: true,
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
  } = useFrappeFetch<TDoc>(url, fetchOptions).get()

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

  let out = reactive({
    doc: data,
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
