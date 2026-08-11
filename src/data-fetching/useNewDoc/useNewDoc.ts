import { reactive, unref } from 'vue'
import { useIsolatedCall } from '../useIsolatedCall'
import { UseCallOptions } from '../useCall/types'
import { docStore } from '../docStore'

type UseNewDocOptions<T> = Omit<
  UseCallOptions<any, Partial<T>>,
  'url' | 'method' | 'params' | 'immediate'
>

type NewDoc<T> = Partial<
  Omit<T, 'creation' | 'modified' | 'owner' | 'modified_by'>
>

export function useNewDoc<T extends object>(
  doctype: string,
  initialValues: NewDoc<T> = {},
  options: UseNewDocOptions<T> = {},
) {
  let doc = reactive<NewDoc<T>>(initialValues)

  type DocResponse = T & {
    name: string
  }

  // `useIsolatedCall`, not `useCall`: with one shared call a second submit
  // aborts the first mid-flight and both resolve off the same ref (#991).
  const out = useIsolatedCall<DocResponse, Partial<T>>({
    url: `/api/v2/document/${doctype}`,
    method: 'POST',
    params() {
      let payload: Partial<T> = {}
      for (let key in doc) {
        const typedKey = key as keyof T
        const value = (doc as Partial<T>)[typedKey]
        payload[typedKey] = unref(value)
      }
      return payload
    },
    immediate: false,
    ...options,
    // The store write lives here, not in `submit()`'s `.then`: this hook is
    // handed the POST's stamp, so the write records. In the `.then` there is
    // no stamp to hand it — it would have to claim `LOCAL_WRITE` and never
    // record, the one store write outside the gate (#1017). Matters when the
    // caller supplies `name`: a stale earlier-dispatched response for the
    // same document must not overwrite the insert.
    onStoreWrite(created: DocResponse, stamp) {
      docStore.setDoc({ doctype, ...created }, stamp)
    },
  })

  // Captured before `out.submit` is overwritten below — the new `submit`
  // calls this one, not `out.submit` (which would then call itself).
  const callSubmit = out.submit

  function submit() {
    return callSubmit().then((created) => {
      const response = created as DocResponse | null
      if (!response?.name) {
        // A failed request resolves `null` (`useIsolatedCall`'s contract
        // toward its own caller); `submit()` keeps rejecting instead.
        throw (
          (out.error as Error | null) ?? new Error(`insert ${doctype} failed`)
        )
      }
      // The caller's own response, never the store's copy. The two only
      // differ when another request's write won the store for this name —
      // and then the store holds the OTHER caller's document, which is
      // exactly what this caller must not receive. The store keeps the
      // winning write; each caller resolves with the doc it created.
      // `doctype` is merged the same way `onSuccess` merges it for the
      // store, so the resolved doc keeps the shape callers had before.
      return { doctype, ...response } as T
    })
  }

  // Extend `out` in place rather than spreading it into a new `reactive()`.
  // `out.data`/`.error`/`.loading`/etc. are refs and computeds that
  // `reactive()` auto-unwraps on read — `{ ...out }` reads each one once and
  // freezes it at that value, which silently drops reactivity for the whole
  // useCall surface this composable re-exposes.
  return Object.assign(out, { submit, doc }) as Omit<typeof out, 'submit'> & {
    submit: () => Promise<T>
    doc: NewDoc<T>
  }
}
