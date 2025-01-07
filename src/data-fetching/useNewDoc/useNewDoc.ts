import { reactive, unref } from 'vue'
import { useCall } from '../useCall/useCall'
import { UseCallOptions } from '../useCall/types'
import { docStore } from '../docStore'

type UseNewDocOptions = Omit<
  UseCallOptions,
  'url' | 'method' | 'params' | 'immediate'
>

type NewDoc<T> = Partial<
  Omit<T, 'creation' | 'modified' | 'owner' | 'modified_by'>
>

export function useNewDoc<T extends object>(
  doctype: string,
  initialValues: NewDoc<T> = {},
  options: UseNewDocOptions = {},
) {
  let doc = reactive<NewDoc<T>>(initialValues)

  type DocResponse = T & {
    name: string
  }

  const out = useCall<DocResponse>({
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
  })

  function submit() {
    return out
      .submit()
      .then((doc) =>
        docStore
          .setDoc({ doctype, ...(doc as DocResponse) })
          .then(() => docStore.getDoc(doctype, doc.name.toString()).value as T),
      )
  }

  return reactive({
    ...out,
    submit,
    doc,
  })
}
