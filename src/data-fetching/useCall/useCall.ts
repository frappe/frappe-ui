import { computed, reactive, readonly, ref, unref } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from '../useFrappeFetch'
import { unrefObject, makeGetParams } from '../utils'
import { BasicParams, UseCallOptions } from './types'

export function useCall<TResponse, TParams extends BasicParams = undefined>(
  options: UseCallOptions<TResponse, TParams>,
) {
  const {
    url,
    method = 'GET',
    params,
    immediate = true,
    refetch = false,
    baseUrl = '',
  } = options

  let submitParams = ref<TParams | null | undefined>(null)

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
      return {}
    }
    return unrefObject(out)
  })

  const computedUrl = computed(() => {
    const base = `${baseUrl}${unref(url)}`
    if (method === 'GET' && computedParams.value) {
      return `${base}?${makeGetParams(computedParams.value)}`
    }
    return base
  })

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    afterFetch: handleAfterFetch<TResponse, TParams>(options),
    onFetchError: handleFetchError<TResponse, TParams>(options),
  }

  let result
  if (method === 'POST') {
    result = useFrappeFetch<TResponse>(computedUrl, fetchOptions).post(
      computedParams,
    )
  } else if (method === 'PUT') {
    result = useFrappeFetch<TResponse>(computedUrl, fetchOptions).put(
      computedParams,
    )
  } else if (method === 'DELETE') {
    result = useFrappeFetch<TResponse>(computedUrl, fetchOptions).delete(
      computedParams,
    )
  } else {
    result = useFrappeFetch<TResponse>(computedUrl, fetchOptions).get()
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

  const submit = async (params?: TParams) => {
    submitParams.value = params
    if (!refetch) {
      execute()
    }
  }

  const reset = () => {
    submitParams.value = null
  }

  let out = reactive({
    data: data,
    error: readonly(error),
    loading: isFetching,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    url: computedUrl,
    promise,
    abort,
    execute: execute,
    fetch: execute,
    reload: execute,
    reset,
    submit,
  })

  return out as Omit<typeof out, 'submit'> & {
    submit: TParams extends undefined
      ? (params?: never) => Promise<void>
      : (params: TParams) => Promise<void>
  }
}

function handleAfterFetch<R, P extends BasicParams>({
  transform,
  onSuccess,
}: UseCallOptions<R, P>) {
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

function handleFetchError<R, P extends BasicParams>({
  onError,
}: UseCallOptions<R, P>) {
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
