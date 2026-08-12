import {
  computed,
  effectScope,
  reactive,
  readonly,
  ref,
  Ref,
  unref,
  watch,
} from 'vue'
import {
  canUseCachedFallback,
  useCall,
  type StoreWritingCallOptions,
} from './useCall/useCall'
import { idbStore } from './idbStore'
import { makeGetParams, normalizeCacheKey, unrefObject } from './utils'
import { BasicParams } from './useCall/types'

/**
 * A `useCall`-shaped object whose every `submit()` runs its own request.
 *
 * Not exported from any entry point — internal, like `useAction`. It exists
 * for the write members that froze with the full `useCall` surface
 * (`useDoc().setValue`, `useDoc().delete`, `useDoc()`'s `methods:` entries,
 * `useNewDoc()`), so `useAction`'s narrower shape is not available to them.
 *
 * Sharing one `useCall` across submits does not work: VueUse's fetch aborts
 * the request in flight as soon as the next one starts, and every submit
 * resolves from the same `data` ref, so the first caller silently receives
 * the second one's answer (or `null`). Here each submit builds a private
 * `useCall` in a detached scope, sends one request through it, and answers
 * its own caller. See #991.
 *
 * The shared refs follow `useAction`'s newest-wins rule: `data` and `error`
 * belong to the submit that started last. A submit that is no longer the
 * newest when it settles only answers its own caller: it does not write
 * `data` or `error`, does not fire the `onSuccess`/`onError` hooks, and does
 * not write the idb cache. `loading` is true while any submit is in flight.
 *
 * Store writes do NOT follow that rule — they go through `onStoreWrite`,
 * which fires for every successful submit. `docStore`/`listStore` gate
 * themselves: every write carries its request's sequence number, and the
 * stores reject a write for a document a later-dispatched request has
 * already written (#1017). That gate is per document and knows whether the
 * newer request actually landed, which this instance-wide rule does not: it
 * would drop the insert of an overtaken submit for a different document,
 * and drop an older success whose newer submit failed.
 *
 * `submit()` keeps `useCall`'s outcome contract: it resolves with the
 * response, resolves `null` on a failed request (read `error`), and rejects
 * only when `beforeSubmit` throws.
 *
 * One default differs from `useCall`: `immediate` is `false` here, because
 * every consumer is a write member that must only fire on `submit()`.
 */
// Options are `useCall`'s, including its internal `onStoreWrite` seam, which
// this composable passes straight through: `useDoc` and `useNewDoc` use it to
// write the shared stores, and it carries the response's `WriteStamp` because
// the stores will not take a write without one.
export function useIsolatedCall<
  TResponse,
  TParams extends BasicParams = undefined,
>(options: StoreWritingCallOptions<TResponse, TParams>) {
  const {
    url,
    method = 'GET',
    params,
    immediate = false,
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

  // Same shape as `useCall`'s `params`: the last submit's params, falling
  // back to the `params` option.
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

  const submitData = ref(initialData ?? null) as Ref<TResponse | null>
  // `any` on purpose — `useCall` exposes the VueUse error ref, which is `any`.
  const error = ref<any>(null)
  // A count rather than a flag: two submits can be in flight at once.
  const pending = ref(0)
  const settledOnce = ref(false)
  const aborted = ref(false)

  const loading = computed(() => pending.value > 0)
  const isFinished = computed(() => settledOnce.value && pending.value === 0)
  const canAbort = computed(() => pending.value > 0)

  const normalizedCacheKey = normalizeCacheKey(cacheKey, 'useCall')

  // The sequence number of the submit that started most recently. Only that
  // submit may write `data` and `error`.
  let lastStarted = 0
  const inflight = new Set<{ abort: () => void }>()

  // `useCall` resolves and replaces `promise` every time a request settles.
  let resolvePromise: (value?: any) => void
  let makePromise = () =>
    new Promise((res) => {
      resolvePromise = res
    })
  let promise = ref<Promise<any>>(makePromise())

  async function run(
    effectiveParams: Record<string, any>,
  ): Promise<TResponse | null> {
    // Take a number. Holding the highest one is what earns the right to
    // write `data` and `error`, checked again when this submit settles.
    let sequence = (lastStarted += 1)
    let isNewest = () => sequence === lastStarted

    pending.value += 1
    aborted.value = false
    // A starting submit is the newest by definition, so the previous error
    // no longer describes the current state. `useCall` behaves the same:
    // VueUse's fetch nulls `error` on every `execute()`.
    error.value = null

    // Detached so the per-submit call is not tied to whichever component
    // happened to call submit, and stopped below so its watchers and
    // computeds do not pile up one set per submit.
    let scope = effectScope(true)
    let call: ReturnType<
      typeof useCall<TResponse, Record<string, any>>
    > | null = null
    try {
      call = scope.run(() =>
        useCall<TResponse, Record<string, any>>({
          url: unref(url),
          method,
          baseUrl,
          immediate: false,
          refetch: false,
          staleOnError,
          transform,
          // Passed straight through, ungated: store writes run for every
          // successful submit, carrying this request's stamp, and the stores
          // reject the stale ones per document — a finer and better-informed
          // rule than the newest-started gate below.
          onStoreWrite,
          onSuccess: (data: TResponse) => {
            // The consumer hooks and the cache write are shared side
            // effects, so they keep the newest-wins gate that `data` and
            // `error` use: a stale response must not overwrite a fresher
            // one in idb, nor report itself as the current outcome.
            if (!isNewest()) return
            if (normalizedCacheKey) {
              idbStore.set(normalizedCacheKey, data)
            }
            onSuccess?.(data)
          },
          onError: (error: Error) => {
            if (!isNewest()) return
            onError?.(error)
          },
        }),
      )!
      inflight.add(call)

      // Resolves with the response, or `null` on a failed request — the same
      // contract `submit()` keeps toward its own caller.
      let response = (await call.submit(effectiveParams)) ?? null
      let callError = (call.error ?? null) as Error | null

      // A newer submit started while this one was in flight, so this answer
      // is stale. It goes to its own caller and nowhere else — writing it
      // now, or clearing the newer submit's error, would undo a fresher
      // answer.
      if (isNewest()) {
        if (callError) {
          // `data` keeps the last successful response. `error` is what tells
          // a failed submit apart from a successful one.
          error.value = callError
        } else {
          submitData.value = response
          error.value = null
        }
      }
      return response
    } finally {
      pending.value -= 1
      settledOnce.value = true
      if (call) inflight.delete(call)
      scope.stop()
      resolvePromise()
      promise.value = makePromise()
    }
  }

  const submit = async (params?: TParams) => {
    if (beforeSubmit) {
      // A throw cancels the submit: the request is not sent and submit() rejects (#990)
      await beforeSubmit(params)
    }
    if (params != null) {
      submitParams.value = params
    }
    if (!refetch) {
      return run(computedParams.value)
    }
  }

  // Like `useCall.execute`: re-sends with the current params, without
  // running `beforeSubmit`.
  function execute(): Promise<TResponse | null> {
    return run(computedParams.value)
  }

  const reset = () => {
    submitParams.value = null
  }

  function abort() {
    if (inflight.size === 0) return
    for (let call of inflight) {
      call.abort()
    }
    aborted.value = true
  }

  // Cached fallback, same rules as `useCall`'s `_data`.
  let cachedResponse = ref<TResponse | null>(null)

  const data = computed(() => {
    if (
      normalizedCacheKey &&
      cachedResponse.value != null &&
      canUseCachedFallback(error.value, staleOnError) &&
      (loading.value ||
        !isFinished.value ||
        submitData.value == null ||
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
    return submitData.value
  })

  if (normalizedCacheKey) {
    idbStore.get(normalizedCacheKey).then((data) => {
      if (data) {
        cachedResponse.value = data
      }
    })
  }

  if (immediate) {
    execute()
  }
  if (refetch) {
    watch([computedUrl, computedParams], () => execute())
  }

  let out = reactive({
    data,
    error: readonly(error),
    loading,
    isFetching: loading,
    isFinished,
    canAbort,
    aborted,
    url: computedUrl,
    params: computedParams,
    promise,
    abort,
    execute,
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
