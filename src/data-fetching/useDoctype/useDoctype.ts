import { computed, reactive, ref } from 'vue'
import { useCall } from '../index'
import { docStore } from '../docStore'
import { listStore } from '../useList/listStore'

interface UseDoctypeOptions {
  baseUrl?: string
}

export function useDoctype<T>(
  doctype: string,
  options: UseDoctypeOptions = {},
) {
  const insert = useInsert<T>(doctype, options)
  const delete_ = useDelete(doctype, options)
  const runDocMethod = useRunDocMethod(doctype, options)
  const setValue = useSetValue<T>(doctype, options)

  return reactive({
    insert,
    delete: delete_,
    setValue,
    runDocMethod,
  })
}

function useInsert<T>(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  let out = useCall<T, Partial<T>>({
    url: `/api/v2/document/${doctype}`,
    method: 'POST',
    immediate: false,
    baseUrl,
  })
  return out
}

function useDelete(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  let url = ref(`/api/v2/document/${doctype}/<name>`)
  type DeleteResponse = 'ok'
  type DeleteParams = { name: string }

  let delete_ = useCall<DeleteResponse, DeleteParams>({
    url,
    method: 'DELETE',
    immediate: false,
    baseUrl,
  })

  return reactive({
    ...delete_,
    submit: ({ name }: DeleteParams) => {
      url.value = `/api/v2/document/${doctype}/${name}`
      return delete_.submit({ name })
    },
  })
}

function useRunDocMethod(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  let url = ref(`/api/v2/document/${doctype}/<name>/method/<method>`)

  interface RunDocMethodParams {
    name: string
    method: string
    validate?: () => string | void
    params?: Record<string, any>
  }

  type RunDocMethodReturnValue = ReturnType<typeof useCall> & {
    submit: (params: RunDocMethodParams) => Promise<any>
    isLoading: (name: string, method: string) => boolean
  }

  let runDocMethod = useCall<any, RunDocMethodParams['params']>({
    url,
    method: 'POST',
    immediate: false,
    baseUrl,
  })

  let validateError = ref<Error | null>(null)

  return reactive({
    ...runDocMethod,
    error: computed(() => validateError.value || runDocMethod.error),
    submit: ({ name, method, validate, params }: RunDocMethodParams) => {
      url.value = `/api/v2/document/${doctype}/${name}/method/${method}`
      if (validate) {
        const errorMessage = validate()
        if (errorMessage) {
          validateError.value = new Error(errorMessage)
          return Promise.reject(validateError.value)
        }
      }
      return runDocMethod.submit(params)
    },
    isLoading: (name: string, method: string) => {
      return (
        runDocMethod.loading &&
        url.value === `/api/v2/document/${doctype}/${name}/method/${method}`
      )
    },
  } as RunDocMethodReturnValue)
}

function useSetValue<T>(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  let url = ref(`/api/v2/document/${doctype}/<name>`)

  type SetValueResponse = T & { name: string }
  type SetValueParams = { name: string } & { [K in keyof Partial<T>]: T[K] }

  let setValue = useCall<SetValueResponse, SetValueParams>({
    url,
    method: 'PUT',
    immediate: false,
    baseUrl,
    onSuccess(data) {
      docStore.setDoc({ doctype, ...data })
      listStore.updateRow(doctype, data)
    },
  })

  return {
    ...setValue,
    submit: ({ name, ...values }: SetValueParams) => {
      url.value = `/api/v2/document/${doctype}/${name}`
      return setValue.submit({ name, ...values })
    },
  }
}
