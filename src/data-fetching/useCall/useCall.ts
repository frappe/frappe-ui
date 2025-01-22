import { computed, reactive, readonly, ref, unref } from 'vue'
import { UseFetchOptions } from '@vueuse/core'
import { useFrappeFetch } from '../useFrappeFetch'
import { unrefObject, makeGetParams, normalizeCacheKey } from '../utils'
import { idbStore } from '../idbStore'
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
    initialData,
    cacheKey,
    transform,
    beforeSubmit,
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
    initialData,
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
    execute: _execute,
    onFetchResponse,
    onFetchError,
  } = result

  function execute(): Promise<TResponse | null> {
    return _execute().then((r) => data.value)
  }

  onFetchResponse(() => {
    resolve()
    promise.value = makePromise()
  })

  onFetchError((error) => {
    resolve()
    promise.value = makePromise()
  })

  let beforeSubmitError = ref<Error | null>(null)

  const submit = async (params?: TParams) => {
    if (beforeSubmit) {
      beforeSubmitError.value = null
      try {
        await beforeSubmit(params)
      } catch (e) {
        console.error('Error in beforeSubmit hook:', e)
        beforeSubmitError.value = e as Error
      }
    }
    if (params != null) {
      submitParams.value = params
    }
    if (!refetch) {
      return execute()
    }
  }

  const reset = () => {
    submitParams.value = null
  }

  let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useCall')
  let cachedResponse = ref<TResponse | null>(null)

  const _data = computed(() => {
    if (normalizedCacheKey && (out.loading || !out.isFinished)) {
      let cachedData = cachedResponse.value as TResponse
      if (transform) {
        let returnValue = transform(cachedData)
        if (returnValue !== undefined) {
          cachedData = returnValue
        }
      }
      return cachedData
    }
    return data.value
  })

  if (normalizedCacheKey) {
    idbStore.get(normalizedCacheKey).then((data) => {
      if (data) {
        cachedResponse.value = data
      }
    })
  }

  let out = reactive({
    data: _data,
    error: readonly(beforeSubmitError.value ? beforeSubmitError : error),
    loading: isFetching,
    isFetching,
    isFinished,
    canAbort,
    aborted,
    url: computedUrl,
    params: computedParams,
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
  cacheKey,
}: UseCallOptions<R, P>) {
  return function (ctx) {
    if (transform) {
      let returnValue = transform(ctx.data)
      if (returnValue !== undefined) {
        ctx.data = returnValue
      }
    }

    let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useCall')
    if (normalizedCacheKey) {
      idbStore.set(normalizedCacheKey, ctx.data)
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
