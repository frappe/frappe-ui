import {
  computed,
  reactive,
  readonly,
  Ref,
  MaybeRefOrGetter,
  toValue,
} from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from '../useFrappeFetch'
import { useCall } from '../useCall/useCall'
import { UseCallOptions } from '../useCall/types'
import { docStore } from '../docStore'
import { listStore } from '../useList/listStore'

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
  name: MaybeRefOrGetter<string>
  baseUrl?: string
  methods?: Record<string, string | DocMethodOption>
  immediate?: boolean
}

export function useDoc<TDoc extends { name: string }, TMethods = {}>(
  options: UseDocOptions,
) {
  const {
    baseUrl = '',
    doctype,
    name,
    methods = {},
    immediate = true,
  } = options

  const url = computed(
    () => `${baseUrl}/api/v2/document/${doctype}/${toValue(name)}`,
  )

  type SuccessCallback = (doc: TDoc) => void
  const successCallbacks: SuccessCallback[] = []
  const triggerSuccessCallbacks = (doc: TDoc) => {
    for (let cb of successCallbacks) {
      try {
        cb(doc)
      } catch (e) {
        console.error('Error in onSuccess hook:', e)
      }
    }
  }

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch: true,
    afterFetch(ctx) {
      let doc = { doctype, ...ctx.data, name: String(ctx.data.name) }
      docStore.setDoc(doc)
      listStore.updateRow(doctype, ctx.data)
      triggerSuccessCallbacks(doc)
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
        refetch: false,
        method: 'POST',
        ...option,
        baseUrl,
        url: computed(
          () =>
            `/api/v2/document/${doctype}/${toValue(name)}/method/${option.name}`,
        ),
      }

      docMethods[key] = readonly(useCall(callOptions))
    }
  }

  let setValue = useCall<TDoc, Partial<TDoc>>({
    url: computed(() => `/api/v2/document/${doctype}/${toValue(name)}`),
    method: 'PUT',
    baseUrl,
    immediate: false,
    refetch: false,
    onSuccess(data) {
      docStore.setDoc({ doctype, ...data })
      listStore.updateRow(doctype, data)
    },
  })

  type DeleteResponse = 'ok'
  const delete_ = useCall<DeleteResponse>({
    url: computed(() => `/api/v2/document/${doctype}/${toValue(name)}`),
    method: 'DELETE',
    baseUrl,
    immediate: false,
    refetch: false,
    onSuccess() {
      docStore.removeDoc(doctype, toValue(name))
      listStore.removeRow(doctype, toValue(name))
    },
  })

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
    setValue,
    delete: delete_,
    onSuccess: (callback: SuccessCallback) => {
      successCallbacks.push(callback)
      return () => {
        // unsubscribe function
        const index = successCallbacks.indexOf(callback)
        if (index > -1) {
          successCallbacks.splice(index, 1)
        }
      }
    },
    ...docMethods,
  })

  return out as typeof out & TransformMethods<TMethods>
}
