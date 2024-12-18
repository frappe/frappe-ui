import { computed, reactive, readonly, ref } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from './useFrappeFetch'
import { unrefObject, makeGetParams } from './utils'

type BasicObject = Record<string, any>

export interface CallOptions<
  TResponse,
  TParams extends BasicObject = BasicObject,
> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: TParams | (() => TParams)
  cacheKey?: string | Array<string | number | boolean>
  immediate?: boolean
  refetch?: boolean
  transform?: (data: TResponse) => TResponse
  onSuccess?: (data: TResponse) => void
  onError?: (error: Error) => void
}

export function useCall<TResponse, TParams extends BasicObject = BasicObject>(
  options: CallOptions<TResponse, TParams>,
) {
  const {
    url,
    method = 'GET',
    params,
    immediate = true,
    refetch = false,
  } = options

  let submitParams = ref<TParams | null>(null)

  let resolve: (value?: any) => void
  let reject: (reason?: any) => void
  let makePromise = () =>
    new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
  let promise = ref<Promise<any>>(makePromise())

  const computedParams = computed(() => {
    let out
    if (submitParams.value) {
      out = submitParams.value
    } else if (typeof params === 'function') {
      out = params()
    } else {
      out = params
    }
    if (out === undefined) {
      return null
    }
    return unrefObject(out)
  })

  const urlForGet = computed(() => {
    if (method === 'GET' && computedParams.value) {
      return `${url}?${makeGetParams(computedParams.value)}`
    }
    return url
  })

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    afterFetch: handleAfterFetch<TResponse, TParams>(options),
    onFetchError: handleFetchError<TResponse, TParams>(options),
  }

  let result
  if (method === 'POST') {
    result = useFrappeFetch<TResponse>(url, fetchOptions).post(computedParams)
  } else if (method === 'PUT') {
    result = useFrappeFetch<TResponse>(url, fetchOptions).put(computedParams)
  } else if (method === 'DELETE') {
    result = useFrappeFetch<TResponse>(url, fetchOptions).delete(computedParams)
  } else {
    result = useFrappeFetch<TResponse>(urlForGet, fetchOptions).get()
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
    onFetchResponse,
    onFetchError,
  } = result

  onFetchResponse(() => {
    resolve()
    promise.value = makePromise()
  })

  onFetchError((error) => {
    resolve()
    promise.value = makePromise()
  })

  const submit = async (params: TParams) => {
    submitParams.value = params
    if (!refetch) {
      execute()
    }
  }

  const reset = () => {
    submitParams.value = null
  }

  return reactive({
    data: data,
    error: readonly(error),
    loading: isFetching,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    url: urlForGet,
    promise,
    abort,
    execute: execute,
    fetch: execute,
    reload: execute,
    reset,
    submit,
  })
}

function handleAfterFetch<R, P extends BasicObject>({
  transform,
  onSuccess,
}: CallOptions<R, P>) {
  return function (ctx) {
    if (transform) {
      let returnValue = transform(ctx.data)
      if (returnValue !== undefined) {
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
  } as UseFetchOptions['afterFetch']
}

function handleFetchError<R, P extends BasicObject>({
  onError,
}: CallOptions<R, P>) {
  return function (ctx) {
    if (onError) {
      try {
        onError(ctx.error)
      } catch (e) {
        console.error('Error in onError hook:', e)
      }
    }
    return ctx
  } as UseFetchOptions['onFetchError']
}
