import { computed, effectScope, ref, Ref } from 'vue'
import { useCall } from './useCall/useCall'
import type { WriteStamp } from './writeGate'

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
  /**
   * Where a submit writes the shared stores — `useCall`'s internal seam,
   * carrying this response's `WriteStamp`, which `docStore`/`listStore`
   * require.
   *
   * Fires for EVERY successful submit, never filtered by the per-target check
   * below. `key` happens to be the document name for every action today, so
   * filtering store writes on it would agree with the gate by coincidence;
   * key `setValue` by anything finer later (`name/fieldname`, say) and two
   * saves to one document stop sharing a target, and the check would start
   * dropping writes the store would have kept. Freshness of a store write is
   * the store's decision, not this instance's.
   */
  onStoreWrite?: (data: TResponse, params: TParams, stamp: WriteStamp) => void
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
 * submit is in flight, and `isLoading(key)` answers for one target so a list
 * can show a spinner on the row it belongs to.
 *
 * `data` and `error` belong to the newest submit, not the one that settled
 * last. Every submit takes a sequence number, and only the submit holding the
 * highest number may write them. An older submit that comes back late is
 * dropped whole: it writes no `data`, writes no `error` and clears nothing. It
 * still answers its own caller with its own outcome.
 *
 * The winning submit writes both refs together, so they never disagree: on
 * success `data` is the response and `error` is null, on failure `error` is set
 * and `data` keeps the last successful response. `data` is never reset to null
 * by a failure — read `error` to tell a failed submit from a successful one.
 *
 * `submit()` has one outcome channel: it resolves with the response, or rejects
 * with the error. A failed `validate` and a failed request both reject. `null`
 * is a response like any other — a server that answers with `null` resolves.
 * A stale submit rejects its own caller too, but writes no `error`.
 *
 * The `onSuccess`/`onError` hooks are gated per target, not per action: they
 * fire unless a newer submit with the same `key` already succeeded. A stale
 * same-target submit firing its hooks would re-run their side effects (for
 * `useList`, a needless refetch) with a stale response. The gate is on
 * success, not on start: a newer submit that fails writes nothing on the
 * server, so it must not block the older success from landing — the server
 * holds the older submit's value in that case. Submits with different keys
 * (or no key) are independent writes, and every one of them fires its hooks.
 *
 * This gate only decides which CONSUMER hooks fire, and only within this
 * instance. Store writes go through `onStoreWrite`, which it never filters:
 * every store write carries its request's sequence number and
 * `docStore`/`listStore` reject the ones a later-dispatched request has
 * overtaken, across instances and across the docs side channel (#1017).
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

  // The sequence number of the submit that started most recently. Only that
  // submit may write `data` and `error`.
  let lastStarted = 0
  // Per target, for the hooks: the sequence number of the newest submit that
  // succeeded. Hooks only conflict between submits that act on the same
  // target, and only a submit that succeeded can make an older answer stale —
  // a newer submit that failed wrote nothing on the server, so it blocks
  // nothing. Entries only matter while submits for the target overlap: a
  // future submit always takes a higher sequence, so `finishPending` drops
  // the entry when the target goes idle and the map does not grow.
  const lastWrittenByTarget = new Map<string, number>()

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
      // No submit for this target is in flight, so nothing can settle stale:
      // the record has done its job. Hooks run inside `call.submit` (before
      // this `finally`), so no gate check reads the map after this delete.
      lastWrittenByTarget.delete(target)
    }
    pendingKeys.value = next
  }

  async function submit(params: TParams): Promise<TResponse | null> {
    // Take a number. Holding the highest one is what earns the right to write
    // `data` and `error`, checked again when this submit settles.
    let sequence = (lastStarted += 1)
    let isNewest = () => sequence === lastStarted

    if (validate) {
      let message = validate(params)
      if (message) {
        let validationError = new Error(message)
        // `validate` is synchronous, so this submit is still the newest one.
        error.value = validationError
        throw validationError
      }
    }

    let target = key ? key(params) : undefined
    // Whether the hooks may fire: no newer same-target submit has handed its
    // response to `onSuccess` yet. Without a key there is no target to
    // conflict on — two keyless submits (two inserts) are always independent
    // writes, and gating them would drop the first one's hook.
    let isFreshForTarget = () =>
      target != null ? sequence > (lastWrittenByTarget.get(target) ?? 0) : true
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
          // Ungated, and the only route to the shared stores from here.
          onStoreWrite: options.onStoreWrite
            ? (response, stamp) =>
                options.onStoreWrite!(response, params, stamp)
            : undefined,
          // Gated: a stale same-target submit must not re-run a consumer's
          // side effects (for `useList`, a needless refetch) with an answer
          // a newer submit has already replaced.
          // Always wrapped, even without a consumer hook: a success must be
          // recorded either way, or it could not make older answers stale.
          onSuccess: (response) => {
            if (!isFreshForTarget()) return
            if (target != null) lastWrittenByTarget.set(target, sequence)
            options.onSuccess?.(response, params)
          },
          onError: options.onError
            ? (e) => {
                // Gated by the same check, but an error records no write —
                // a failed submit must not make an older success stale.
                if (!isFreshForTarget()) return
                options.onError!(e, params)
              }
            : undefined,
        }),
      )!

      let response = await call.submit(body ? body(params) : params)
      let callError = (call.error ?? null) as Error | null

      // A newer submit started while this one was in flight, so this answer is
      // stale. It goes to its own caller and nowhere else — writing it now, or
      // clearing the newer submit's error, would undo a fresher answer.
      if (!isNewest()) {
        if (callError) throw callError
        return response as TResponse | null
      }

      if (callError) {
        // `data` keeps the last successful response. `error` is what tells a
        // failed submit apart from a successful one.
        error.value = callError
        throw callError
      }
      data.value = response as TResponse | null
      error.value = null
      return response as TResponse | null
    } finally {
      finishPending(target)
      scope.stop()
    }
  }

  return { data, error, loading, isLoading, submit }
}
