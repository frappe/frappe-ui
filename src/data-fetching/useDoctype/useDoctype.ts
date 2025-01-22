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

function useInsert<T>(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  let out = useCall<T, Partial<T>>({
    url: `/api/v2/document/${doctype}`,
    method: 'POST',
    immediate: false,
    baseUrl,
  })

  return {
    ...out,
    submit: (params: Partial<T>) => out.submit(params).then(() => out.data),
  }
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
    onSuccess() {
      if (delete_.params.name) {
        let { name } = delete_.params
        docStore.removeDoc(doctype, name)
        listStore.removeRow(doctype, name)
      }
    },
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
        } else {
          validateError.value = null
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

function useRunMethod(doctype: string, options: UseDoctypeOptions = {}) {
  let { baseUrl = '' } = options
  let url = ref(`/api/v2/method/${doctype}/<method>`)

  interface RunMethodParams {
    method: string
    validate?: () => string | void
    params?: Record<string, any>
  }

  type RunMethodReturnValue = ReturnType<typeof useCall> & {
    submit: (params: RunMethodParams) => Promise<any>
    isLoading: (method: string) => boolean
  }

  let runMethod = useCall<any, RunMethodParams['params']>({
    url,
    method: 'POST',
    immediate: false,
    baseUrl,
  })

  let validateError = ref<Error | null>(null)

  return reactive({
    ...runMethod,
    error: computed(() => validateError.value || runMethod.error),
    submit: ({ method, validate, params }: RunMethodParams) => {
      url.value = `/api/v2/method/${doctype}/${method}`
      if (validate) {
        const errorMessage = validate()
        if (errorMessage) {
          validateError.value = new Error(errorMessage)
          return Promise.reject(validateError.value)
        } else {
          validateError.value = null
        }
      }
      return runMethod.submit(params)
    },
    isLoading: (method: string) => {
      return (
        runMethod.loading && url.value === `/api/v2/method/${doctype}/${method}`
      )
    },
  } as RunMethodReturnValue)
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
