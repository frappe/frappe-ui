import { ref, computed, reactive, readonly } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from './useFrappeFetch'
import { makeGetParams } from './common'

export interface CallOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, any> | (() => Record<string, any>)
  cacheKey?: string | Array<string | number | boolean>
  immediate?: boolean
  refetch?: boolean
  transform?: (data: T[]) => T[]
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
}

export function useCall<T>({
  url,
  method = 'GET',
  params,
  cacheKey,
  immediate = true,
  refetch = true,
  transform,
  onSuccess,
  onError,
}: CallOptions<T>) {
  const submitParams = ref<Record<string, any> | null>(null)

  const _params = computed(() => {
    if (submitParams.value) {
      return submitParams.value
    }
    if (typeof params === 'function') {
      return params()
    }
    return params
  })

  const _url = computed(() => {
    if (method === 'GET' && _params.value) {
      return `${url}?${makeGetParams(_params.value)}`
    }
    return url
  })

  let fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    afterFetch(ctx) {
      if (transform) {
        let returnValue = transform(ctx.data)
        if (Array.isArray(returnValue)) {
          ctx.data = returnValue
        }
      }
      if (onSuccess) {
        try {
          onSuccess(ctx.data)
        } catch (e) {
          console.error('Error in onSuccess hook:', e)
        }
      }
      return ctx
    },
    onFetchError(ctx) {
      if (onError) {
        try {
          onError(ctx.error)
        } catch (e) {
          console.error('Error in onError hook:', e)
        }
      }
      return ctx
    },
  }

  let result
  if (method === 'POST') {
    result = useFrappeFetch<T>(_url, fetchOptions).post(_params)
  } else if (method === 'PUT') {
    result = useFrappeFetch<T>(_url, fetchOptions).put(_params)
  } else if (method === 'DELETE') {
    result = useFrappeFetch<T>(_url, fetchOptions).delete(_params)
  } else {
    result = useFrappeFetch<T>(_url, fetchOptions).get()
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
  } = result

  const submit = (params: Record<string, any>) => {
    submitParams.value = params
    execute()
  }

  return reactive({
    data: readonly(data),
    error: readonly(error),
    loading: isFetching,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    url: _url,
    abort,
    execute,
    reload: execute,
    submit,
  })
}
