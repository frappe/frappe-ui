import { computed, effectScope, ref, Ref } from 'vue'
import { useCall } from './useCall/useCall'

export interface UseActionOptions<TResponse, TParams> {
  method: 'POST' | 'PUT' | 'DELETE'
  /** The URL for one submit, built from that submit's own params. */
  url: (params: TParams) => string
  baseUrl?: string
  /** The request body for one submit. Defaults to the params themselves. */
  body?: (params: TParams) => Record<string, any> | undefined
  /**
   * What this submit acts on — a document name, a method name. Two submits with
   * the same key are the same target, which is what `isLoading` reports on.
   */
  key?: (params: TParams) => string
  /** Return a message to reject the submit before any request is sent. */
  validate?: (params: TParams) => string | void
  onSuccess?: (data: TResponse, params: TParams) => void
  onError?: (error: Error, params: TParams) => void
}

/**
 * A write that can run several times at once — delete two rows, save two fields,
 * call one method on two documents.
 *
 * Each submit gets its own request. Sharing one `useCall` across submits does
 * not work: VueUse's fetch aborts the request in flight as soon as the next one
 * starts, and every submit resolves from the same `data` ref, so the first
 * caller silently receives the second one's answer (or `null`).
 *
 * The state left behind is aggregate on purpose. `loading` is true while any
 * submit is in flight, `error` and `data` come from the submit that settled
 * last, and `isLoading(key)` answers for one target so a list can show a
 * spinner on the row it belongs to.
 */
export function useAction<TResponse, TParams extends Record<string, any>>(
  options: UseActionOptions<TResponse, TParams>,
) {
  const { method, url, baseUrl = '', body, key, validate } = options

  const data = ref<TResponse | null>(null) as Ref<TResponse | null>
  const error = ref<Error | null>(null)
  // A count rather than a flag: the same target can be submitted twice.
  const pending = ref(0)
  const pendingKeys = ref(new Map<string, number>())

  const loading = computed(() => pending.value > 0)

  function isLoading(target: string) {
    return (pendingKeys.value.get(target) ?? 0) > 0
  }

  function startPending(target: string | undefined) {
    pending.value += 1
    if (target == null) return
    let next = new Map(pendingKeys.value)
    next.set(target, (next.get(target) ?? 0) + 1)
    pendingKeys.value = next
  }

  function finishPending(target: string | undefined) {
    pending.value -= 1
    if (target == null) return
    let next = new Map(pendingKeys.value)
    let count = (next.get(target) ?? 1) - 1
    if (count > 0) {
      next.set(target, count)
    } else {
      next.delete(target)
    }
    pendingKeys.value = next
  }

  async function submit(params: TParams): Promise<TResponse | null> {
    if (validate) {
      let message = validate(params)
      if (message) {
        let validationError = new Error(message)
        error.value = validationError
        return Promise.reject(validationError)
      }
    }

    let target = key ? key(params) : undefined
    error.value = null
    startPending(target)

    // Detached so the per-submit call is not tied to whichever component
    // happened to call submit, and stopped below so its watchers and computeds
    // do not pile up one set per submit.
    let scope = effectScope(true)
    try {
      let call = scope.run(() =>
        useCall<TResponse, Record<string, any>>({
          url: url(params),
          method,
          baseUrl,
          immediate: false,
          refetch: false,
          onSuccess: options.onSuccess
            ? (response) => options.onSuccess!(response, params)
            : undefined,
          onError: options.onError
            ? (e) => options.onError!(e, params)
            : undefined,
        }),
      )!

      let response = await call.submit(body ? body(params) : params)
      let callError = (call.error ?? null) as Error | null
      if (callError) {
        error.value = callError
        return null
      }
      data.value = response as TResponse
      return response as TResponse
    } finally {
      finishPending(target)
      scope.stop()
    }
  }

  return { data, error, loading, isLoading, submit }
}
