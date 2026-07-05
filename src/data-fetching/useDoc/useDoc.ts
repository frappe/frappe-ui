import {
  computed,
  reactive,
  readonly,
  Ref,
  MaybeRefOrGetter,
  toValue,
} from 'vue'
import { UseFetchOptions, AfterFetchContext } from '@vueuse/core'
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

interface DocMethodOption<T = any> extends Omit<
  UseCallOptions<T>,
  'url' | 'baseUrl'
> {
  name: string
}

interface UseDocOptions<TDoc> {
  doctype: string
  name: MaybeRefOrGetter<string>
  baseUrl?: string
  url?: string
  methods?: Record<string, string | DocMethodOption>
  immediate?: boolean
  staleOnError?: boolean
  transform?: (doc: TDoc & { doctype: string }) => TDoc & { doctype: string }
}

export function useDoc<TDoc extends { name: string }, TMethods = {}>(
  options: UseDocOptions<TDoc>,
) {
  const {
    baseUrl = '',
    doctype,
    name,
    url: customUrl = '',
    methods = {},
    immediate = true,
    staleOnError = false,
    transform,
  } = options

  const url = computed(() => {
    if (customUrl) {
      return `${baseUrl}${customUrl}`
    }
    return `${baseUrl}/api/v2/document/${doctype}/${toValue(name)}`
  })

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
    // Don't fire the initial GET while the name is still unresolved (it would
    // hit the malformed `/api/v2/document/<doctype>/` URL). refetch:true makes
    // the request fire automatically once the name resolves and the URL changes.
    immediate: immediate && Boolean(toValue(name)?.trim()),
    refetch: true,
    afterFetch(ctx: AfterFetchContext<{ data: TDoc }>) {
      if (ctx.data) {
        let doc = {
          ...ctx.data.data,
          doctype,
          name: String(ctx.data.data.name),
        }
        docStore.setDoc(doc)
        if (transform) {
          doc = transform(doc)
        }
        listStore.updateRow(doctype, ctx.data.data)
        triggerSuccessCallbacks(doc)
      }
      return ctx
    },
  }

  const { error, isFetching, isFinished, canAbort, aborted, abort, execute } =
    useFrappeFetch(url, fetchOptions).get()

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
      // Store the untransformed doc; the `doc` computed applies `transform` on
      // read. Transforming here too would run it twice (a bug for any
      // non-idempotent transform). Mirrors afterFetch.
      docStore.setDoc({ ...data, doctype })
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

  // Bind reactively to the document keyed by the *current* name. Resolving the
  // name once at setup would statically bind to whatever it was then — if the
  // name resolves after setup (e.g. while the GET is still in flight) the ref
  // would never re-point to the real cache slot. A computed re-evaluates when
  // the name resolves and when the store ref is populated.
  const doc = computed<TDoc | null>(() => {
    const nameStr = toValue(name)?.trim()
    if (!nameStr) return null
    const storeRef = docStore.getDoc(doctype, nameStr, transform as any, {
      staleOnError,
    }) as Ref<TDoc | null>
    let value = storeRef.value
    if (value && transform) {
      try {
        value = transform(value as TDoc & { doctype: string })
      } catch (e) {
        docStore.removeDoc(doctype, nameStr)
        return null
      }
    }
    return value
  })
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
