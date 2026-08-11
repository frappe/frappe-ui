import { computed, reactive, readonly, ref, unref } from 'vue'
import { AfterFetchContext, UseFetchOptions } from '@vueuse/core'
import {
  FrappeResponseError,
  getDispatchStamp,
  useFrappeFetch,
} from '../useFrappeFetch'
import { LOCAL_WRITE, type WriteStamp } from '../writeGate'
import { unrefObject, makeGetParams, normalizeCacheKey } from '../utils'
import { idbStore } from '../idbStore'
import { BasicParams, UseCallOptions } from './types'

/**
 * `onStoreWrite` is internal. It is deliberately not on `UseCallOptions`, and
 * `index.ts` re-exports `useCall` narrowed to `UseCallOptions`, so the seam is
 * unreachable from the package (ADR-0012) while `useDoc`, `useList`,
 * `useDoctype` and `useNewDoc` write the shared stores through it.
 *
 * It exists because it is the only hook handed the response's `WriteStamp`,
 * and `docStore`/`listStore` will not take a write without one. That is the
 * seam: store writes can only be made from here, and the consumer-facing
 * `onSuccess` cannot reach the stores even by accident.
 *
 * Unlike `onSuccess`, it is never gated by a caller's newest-wins rule — the
 * gate decides per document, which is finer and better informed than any
 * per-instance or per-target check a composable can make.
 */
export type StoreWritingCallOptions<
  TResponse,
  TParams extends BasicParams,
> = UseCallOptions<TResponse, TParams> & {
  onStoreWrite?: (data: TResponse, stamp: WriteStamp) => void
}

export function useCall<TResponse, TParams extends BasicParams = undefined>(
  options: StoreWritingCallOptions<TResponse, TParams>,
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
    staleOnError = false,
    transform,
    beforeSubmit,
    onSuccess,
    onError,
    onStoreWrite,
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

  type FrappeResponse<T> = { data: T }

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    // `data` is read back out as `data.value?.data` below (the raw fetch
    // response is `{ data: TResponse }`), so the seed value has to be
    // wrapped the same way — an unwrapped `initialData` would read as
    // `undefined` on that `.data` lookup and fall through to `null`.
    initialData: initialData !== undefined ? { data: initialData } : undefined,
    afterFetch(ctx: AfterFetchContext<FrappeResponse<TResponse>>) {
      if (ctx.data) {
        if (transform) {
          let returnValue = transform(ctx.data.data)
          if (returnValue !== undefined) {
            ctx.data.data = returnValue
          }
        }

        let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useCall')
        if (normalizedCacheKey) {
          idbStore.set(normalizedCacheKey, ctx.data.data)
        }

        if (onStoreWrite) {
          try {
            // The stamp is handed over, not made ambient. An ambient stamp
            // only covers writes made before the hook's first `await` — a
            // rule the hook has to remember, and the store cannot check.
            // A parameter travels with the write wherever it goes.
            // A response that never went through the wrapped fetch has no
            // dispatch order to place it in: `LOCAL_WRITE`.
            onStoreWrite(
              ctx.data.data,
              getDispatchStamp(ctx.response) ?? LOCAL_WRITE,
            )
          } catch (e) {
            console.error('Error in onStoreWrite hook:', e)
          }
        }

        if (onSuccess) {
          try {
            onSuccess(ctx.data.data)
          } catch (e) {
            console.error('Error in onSuccess hook:', e)
          }
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
    result = useFrappeFetch<FrappeResponse<TResponse>>(
      computedUrl,
      fetchOptions,
    ).post(computedParams)
  } else if (method === 'PUT') {
    result = useFrappeFetch<FrappeResponse<TResponse>>(
      computedUrl,
      fetchOptions,
    ).put(computedParams)
  } else if (method === 'DELETE') {
    result = useFrappeFetch<FrappeResponse<TResponse>>(
      computedUrl,
      fetchOptions,
    ).delete(computedParams)
  } else {
    result = useFrappeFetch<FrappeResponse<TResponse>>(
      computedUrl,
      fetchOptions,
    ).get()
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
    return _execute().then((r) => data.value?.data ?? null)
  }

  onFetchResponse(() => {
    resolve()
    promise.value = makePromise()
  })

  onFetchError((error) => {
    resolve()
    promise.value = makePromise()
  })

  const submit = async (params?: TParams) => {
    if (beforeSubmit) {
      // A throw cancels the submit: the request is not sent and submit() rejects (#990)
      await beforeSubmit(params)
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
    if (
      normalizedCacheKey &&
      cachedResponse.value != null &&
      canUseCachedFallback(error.value, staleOnError) &&
      (out.loading ||
        !out.isFinished ||
        data.value?.data == null ||
        error.value)
    ) {
      let cachedData = cachedResponse.value as TResponse
      if (transform) {
        let returnValue = transform(cachedData)
        if (returnValue !== undefined) {
          cachedData = returnValue
        }
      }
      return cachedData
    }
    return data.value?.data ?? null
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
    error: readonly(error),
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
      ? (params?: never) => Promise<TResponse | null>
      : (params?: TParams) => Promise<TResponse | null>
  }
}

// Shared with `useIsolatedCall`, which replicates the cached-fallback rules.
export function canUseCachedFallback(error: unknown, staleOnError: boolean) {
  return !error || (staleOnError && !(error instanceof FrappeResponseError))
}
