import {
  computed,
  reactive,
  readonly,
  Ref,
  MaybeRefOrGetter,
  toValue,
} from 'vue'
import { UseFetchOptions, AfterFetchContext } from '@vueuse/core'
import { getDispatchStamp, useFrappeFetch } from '../useFrappeFetch'
import { LOCAL_WRITE } from '../writeGate'
import { useCall } from '../useCall/useCall'
import { useIsolatedCall } from '../useIsolatedCall'
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
  'url' | 'baseUrl' | 'immediate' | 'refetch'
> {
  name: string
}

/**
 * Members `useDoc()` returns itself. A `methods:` entry is spread on top of
 * them, so a colliding name would replace a built-in and break every caller
 * that reads it — silently, because the object still has the key.
 */
const RESERVED_DOC_MEMBERS = new Set([
  'doc',
  'error',
  'loading',
  'aborted',
  'canAbort',
  'isFetching',
  'isFinished',
  'execute',
  'fetch',
  'reload',
  'abort',
  'setValue',
  'delete',
  'onSuccess',
])

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
        // Stamped with the request's sequence, so a reload that an in-between
        // write has overtaken cannot put the older doc back (#1017). The
        // stamp's `record` is false for this GET: a read is admitted on its
        // sequence but must not record — the server may answer it before an
        // earlier-dispatched save commits, and recording here would gate that
        // save's response out for good.
        let stamp = getDispatchStamp(ctx.response) ?? LOCAL_WRITE
        docStore.setDoc(doc, stamp)
        if (transform) {
          doc = transform(doc)
        }
        listStore.updateRow(doctype, ctx.data.data, stamp)
        triggerSuccessCallbacks(doc)
      }
      return ctx
    },
  }

  const { error, isFetching, isFinished, canAbort, aborted, abort, execute } =
    useFrappeFetch(url, fetchOptions).get()

  // `useIsolatedCall`, not `useCall`: one shared call drops or crosses
  // concurrent submits (#991). Same public shape either way.
  let docMethods: Record<string, ReturnType<typeof useIsolatedCall>> = {}
  if (methods) {
    for (let key in methods) {
      if (RESERVED_DOC_MEMBERS.has(key)) {
        throw new Error(
          `[frappe-ui] useDoc({ doctype: '${doctype}' }) declares a method named "${key}", ` +
            'which is already a member of the object useDoc returns. Rename the method ' +
            `key — the document method it calls keeps its own name through \`{ ${key}: { name: '…' } }\`.`,
        )
      }
      let option: DocMethodOption
      if (typeof methods[key] === 'string') {
        option = {
          name: methods[key] as string,
        }
      } else {
        option = methods[key] as DocMethodOption
      }

      let callOptions: UseCallOptions = {
        method: 'POST',
        ...option,
        baseUrl,
        // After the spread, not before it: a document method fires on
        // `submit()` only. With `refetch: true` the params watcher re-sends
        // the method on every edit to the document and `submit()` sends
        // nothing at all (DAT-Q6).
        immediate: false,
        refetch: false,
        url: computed(
          () =>
            `/api/v2/document/${doctype}/${toValue(name)}/method/${option.name}`,
        ),
      }

      docMethods[key] = readonly(useIsolatedCall(callOptions))
    }
  }

  let setValue = useIsolatedCall<TDoc, Partial<TDoc>>({
    url: computed(() => `/api/v2/document/${doctype}/${toValue(name)}`),
    method: 'PUT',
    baseUrl,
    immediate: false,
    refetch: false,
    onStoreWrite(data, stamp) {
      // Store the untransformed doc; the `doc` computed applies `transform` on
      // read. Transforming here too would run it twice (a bug for any
      // non-idempotent transform). Mirrors afterFetch.
      docStore.setDoc({ ...data, doctype }, stamp)
      listStore.updateRow(doctype, data, stamp)
    },
  })

  // Optimistic, like the legacy `createDocumentResource`: the submitted values
  // land in the stores at once, and the response replaces them through
  // `onStoreWrite`. A failed submit reverts them.
  //
  // The optimistic write and the revert are `LOCAL_WRITE`: neither records a
  // sequence in the gate. Recording would gate out an older save still in
  // flight, and if this submit then fails, the stores would end on a value the
  // server does not hold. The cost: an older response that settles first shows
  // its value until this one lands.
  //
  // The revert is per field. It restores only a field that still holds the
  // submitted value, so it does not undo a newer submit, fetch or realtime
  // update that landed in the meantime.
  //
  // The casts only resolve `submit`'s conditional type, which TypeScript
  // cannot evaluate while `TDoc` is still generic.
  type SetValueSubmit = (values?: Partial<TDoc>) => Promise<TDoc | null>
  const submitSetValue = setValue.submit as SetValueSubmit
  const optimisticSubmit: SetValueSubmit = async (values) => {
    const revert = values ? writeOptimistic(values) : null
    try {
      return await submitSetValue(values)
    } catch (e) {
      revert?.()
      throw e
    }
  }
  setValue.submit = optimisticSubmit as typeof setValue.submit

  function writeOptimistic(submitted: Partial<TDoc>) {
    // A copy: a caller may keep editing the object it submitted (a reactive
    // form), and the revert compares against what was sent.
    const values = { ...submitted }
    const nameStr = toValue(name)?.trim()
    if (!nameStr) return null
    const getStored = () =>
      docStore.getDoc(doctype, nameStr, { staleOnError }).value
    const previous = getStored()
    // Nothing loaded to merge into. The response still lands as before.
    if (!previous) return null
    const docName = previous.name
    docStore.setDoc({ ...previous, ...values, name: docName }, LOCAL_WRITE)
    listStore.updateRow(doctype, { ...values, name: docName }, LOCAL_WRITE)

    return () => {
      const current = getStored()
      if (!current) return
      const reverted: Record<string, unknown> = {}
      for (const key in values) {
        if (key !== 'name' && current[key] === values[key]) {
          reverted[key] = previous[key]
        }
      }
      if (Object.keys(reverted).length === 0) return
      docStore.setDoc({ ...current, ...reverted }, LOCAL_WRITE)
      listStore.updateRow(doctype, { ...reverted, name: docName }, LOCAL_WRITE)
    }
  }

  type DeleteResponse = 'ok'
  const delete_ = useIsolatedCall<DeleteResponse>({
    url: computed(() => `/api/v2/document/${doctype}/${toValue(name)}`),
    method: 'DELETE',
    baseUrl,
    immediate: false,
    refetch: false,
    onStoreWrite() {
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
    const storeRef = docStore.getDoc(doctype, nameStr, {
      staleOnError,
    }) as Ref<TDoc | null>
    let value = storeRef.value
    if (value && transform) {
      try {
        value = transform(value as TDoc & { doctype: string })
      } catch (e) {
        // Invalidate, not remove: the doc broke locally, the server still
        // has it. `removeDoc`'s terminal stamp would reject an in-flight
        // write that should repopulate the store.
        docStore.invalidateDoc(doctype, nameStr)
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
