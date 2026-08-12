import { reactive } from 'vue'
import { useAction } from '../useAction'
import { docStore } from '../docStore'
import { listStore } from '../useList/listStore'

interface UseDoctypeOptions {
  baseUrl?: string
}

export function useDoctype<T extends Record<string, any>>(
  doctype: string,
  options: UseDoctypeOptions = {},
) {
  const insert = useInsert<T>(doctype, options)
  const delete_ = useDelete(doctype, options)
  const setValue = useSetValue<T>(doctype, options)
  const runDocMethod = useRunDocMethod(doctype, options)
  const runMethod = useRunMethod(doctype, options)

  return reactive({
    insert,
    delete: delete_,
    setValue,
    runDocMethod,
    runMethod,
  })
}

function useInsert<T extends Record<string, any>>(
  doctype: string,
  options: UseDoctypeOptions = {},
) {
  let { baseUrl = '' } = options
  let action = useAction<T, Partial<T>>({
    url: () => `/api/v2/document/${doctype}`,
    method: 'POST',
    baseUrl,
  })

  return reactive({
    data: action.data,
    error: action.error,
    loading: action.loading,
    /**
     * True while an insert is in flight. Takes no target: the document has no
     * name until the server gives it one, so there is nothing to key on. Same
     * answer as `loading`, kept so every write method has `isLoading`.
     */
    isLoading: () => action.loading.value,
    submit: action.submit,
  })
}

function useDelete(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  type DeleteResponse = 'ok'
  type DeleteParams = { name: string }

  let action = useAction<DeleteResponse, DeleteParams>({
    url: ({ name }) => `/api/v2/document/${doctype}/${name}`,
    method: 'DELETE',
    baseUrl,
    key: ({ name }) => name,
    onStoreWrite(_data, { name }) {
      docStore.removeDoc(doctype, name)
      listStore.removeRow(doctype, name)
    },
  })

  return reactive({
    data: action.data,
    error: action.error,
    loading: action.loading,
    /** True while a delete for this document name is in flight. */
    isLoading: (name: string) => action.isLoading(name),
    submit: action.submit,
  })
}

function useRunDocMethod(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options

  interface RunDocMethodParams {
    name: string
    method: string
    validate?: () => string | void
    params?: Record<string, any>
  }

  let action = useAction<any, RunDocMethodParams>({
    url: ({ name, method }) =>
      `/api/v2/document/${doctype}/${name}/method/${method}`,
    method: 'POST',
    baseUrl,
    key: ({ name, method }) => `${name}/${method}`,
    body: ({ params }) => params,
    validate: ({ validate }) => validate?.(),
  })

  return reactive({
    data: action.data,
    error: action.error,
    loading: action.loading,
    /** True while this method is running on this document. */
    isLoading: (name: string, method: string) =>
      action.isLoading(`${name}/${method}`),
    submit: action.submit,
  })
}

function useRunMethod(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options

  interface RunMethodParams {
    method: string
    validate?: () => string | void
    params?: Record<string, any>
  }

  let action = useAction<any, RunMethodParams>({
    url: ({ method }) => `/api/v2/method/${doctype}/${method}`,
    method: 'POST',
    baseUrl,
    key: ({ method }) => method,
    body: ({ params }) => params,
    validate: ({ validate }) => validate?.(),
  })

  return reactive({
    data: action.data,
    error: action.error,
    loading: action.loading,
    /** True while this method is running. */
    isLoading: (method: string) => action.isLoading(method),
    submit: action.submit,
  })
}

function useSetValue<T extends Record<string, any>>(
  doctype: string,
  options: UseDoctypeOptions = {},
) {
  let { baseUrl = '' } = options

  type SetValueResponse = T & { name: string }
  type SetValueParams = { name: string } & { [K in keyof Partial<T>]: T[K] }

  let action = useAction<SetValueResponse, SetValueParams>({
    url: ({ name }) => `/api/v2/document/${doctype}/${name}`,
    method: 'PUT',
    baseUrl,
    key: ({ name }) => name,
    onStoreWrite(data, _params, stamp) {
      docStore.setDoc({ doctype, ...data }, stamp)
      listStore.updateRow(doctype, data, stamp)
    },
  })

  return reactive({
    data: action.data,
    error: action.error,
    loading: action.loading,
    /** True while a save for this document name is in flight. */
    isLoading: (name: string) => action.isLoading(name),
    submit: action.submit,
  })
}
