import { computed, nextTick, reactive, readonly, ref, unref, watch } from 'vue'
import { AfterFetchContext, UseFetchOptions } from '@vueuse/core'
import {
  currentDispatchSeq,
  FrappeResponseError,
  getDispatchStamp,
  getRequestDispatchSeq,
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

  // The dispatch number of the newest request this call has sent, whoever
  // sent it: this call's `execute`, or `useFetch`'s parameter watcher under
  // `refetch: true`. `submit` compares it with the number it read before it
  // waited. The number itself is minted in `useFrappeFetch`, at the top of
  // `execute`; counting here instead would be a tick late, because
  // `createFetch` chains a per-call `beforeFetch` after the factory's, and a
  // submit in the same tick would have taken its reading by then.
  let lastDispatch = 0

  const fetchOptions: UseFetchOptions = {
    immediate,
    refetch,
    beforeFetch({ options }) {
      const seq = getRequestDispatchSeq(options)
      if (seq !== undefined && seq > lastDispatch) {
        lastDispatch = seq
      }
    },
    // `data` is read back out as `data.value?.data` below (the raw fetch
    // response is `{ data: TResponse }`), so the seed value has to be
    // wrapped the same way — an unwrapped `initialData` would read as
    // `undefined` on that `.data` lookup and fall through to `null`.
    initialData: initialData !== undefined ? { data: initialData } : undefined,
    afterFetch(ctx: AfterFetchContext<FrappeResponse<TResponse>>) {
      if (ctx.data) {
        // The cache holds the response as the server sent it: transformed
        // data may not survive JSON, and `transform` runs again when the
        // cache is read. Copied first, because `transform` may change the
        // response in place.
        let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useCall')
        if (normalizedCacheKey) {
          idbStore.set(
            normalizedCacheKey,
            transform ? structuredClone(ctx.data.data) : ctx.data.data,
          )
        }

        if (transform) {
          let returnValue = transform(ctx.data.data)
          if (returnValue !== undefined) {
            ctx.data.data = returnValue
          }
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
    // This response succeeded, so the call is not in error. `execute` clears
    // `error` when it starts, but a request this one superseded rejects with
    // its abort *after* that, and nothing put the ref back. Two overlapping
    // submits ended with the newer one rejecting on the older one's abort.
    // `data` is already overwritten by whichever response settled last; the
    // error half has to follow the same rule.
    error.value = null
    resolve()
    promise.value = makePromise()
  })

  onFetchError((error) => {
    resolve()
    promise.value = makePromise()
  })

  /**
   * Resolves when the request that is in flight right now has settled.
   * `isFetching` is the only signal that tracks the *newest* request:
   * `useFetch` clears it in a `finally` that a superseded request skips, so
   * a submit waiting here cannot be answered by an older request the new one
   * aborted. The response events cannot tell the two apart.
   */
  function whenSettled(): Promise<void> {
    if (!isFetching.value) return Promise.resolve()
    return new Promise<void>((res) => {
      const stop = watch(
        isFetching,
        (fetching) => {
          if (fetching) return
          stop()
          res()
        },
        { flush: 'sync' },
      )
    })
  }

  const submit = async (params?: TParams) => {
    if (beforeSubmit) {
      // A throw cancels the submit: the request is not sent and submit() rejects (#990)
      await beforeSubmit(params)
    }
    if (params != null) {
      submitParams.value = params
    }
    if (refetch) {
      // `refetch: true` gives `useFetch`'s parameter watcher the chance to
      // send this request. Whether it takes it cannot be read off the
      // argument: the watcher compares the URL (always) and the payload ref
      // (body methods only), and `submitParams.value` is a reactive proxy, so
      // no identity test on the argument can answer it. Ask the requests
      // instead. Every request reads the url and the payload at the top of
      // `execute`, which is also where it takes its dispatch number, so any
      // request numbered above this reading carries the params assigned
      // above and is this submit's request. One numbered below it is not,
      // even if it is still in flight.
      const sentBefore = currentDispatchSeq()
      await nextTick()
      await whenSettled()
      if (lastDispatch > sentBefore) {
        if (error.value) throw error.value
        return data.value?.data ?? null
      }
      // Nothing went out with these params. Fall through and send it here,
      // the same way a submit without `refetch` does.
    }
    const response = await execute()
    // Actions reject, reads resolve. `submit()` writes, so a caller that
    // does not handle failure must not run its success path (DAT-Q1).
    // `execute`/`fetch`/`reload` keep resolving; read `error` after them.
    if (error.value) throw error.value
    return response
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
      return cachedResponse.value as TResponse
    }
    return data.value?.data ?? null
  })

  if (normalizedCacheKey) {
    idbStore.get(normalizedCacheKey).then((data) => {
      if (data) {
        cachedResponse.value = transformCached(data as TResponse, transform)
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

// Runs `transform` on a response read from the cache, once, the same as on a
// fresh response: the cache stores it as the server sent it. Shared with
// `useIsolatedCall`.
export function transformCached<TResponse>(
  data: TResponse,
  transform?: (data: TResponse) => TResponse,
) {
  if (!transform) return data
  let returnValue = transform(data)
  return returnValue !== undefined ? returnValue : data
}

// Shared with `useIsolatedCall`, which replicates the cached-fallback rules.
export function canUseCachedFallback(error: unknown, staleOnError: boolean) {
  return !error || (staleOnError && !(error instanceof FrappeResponseError))
}
