import { computed, effectScope, ref } from 'vue';
import { useCall } from './useCall/useCall';
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
 */
export function useAction(options) {
    const { method, url, baseUrl = '', body, key, validate } = options;
    const data = ref(null);
    const error = ref(null);
    // A count rather than a flag: the same target can be submitted twice.
    const pending = ref(0);
    const pendingKeys = ref(new Map());
    const loading = computed(() => pending.value > 0);
    // The sequence number of the submit that started most recently. Only that
    // submit may write `data` and `error`.
    let lastStarted = 0;
    function isLoading(target) {
        return (pendingKeys.value.get(target) ?? 0) > 0;
    }
    function startPending(target) {
        pending.value += 1;
        if (target == null)
            return;
        let next = new Map(pendingKeys.value);
        next.set(target, (next.get(target) ?? 0) + 1);
        pendingKeys.value = next;
    }
    function finishPending(target) {
        pending.value -= 1;
        if (target == null)
            return;
        let next = new Map(pendingKeys.value);
        let count = (next.get(target) ?? 1) - 1;
        if (count > 0) {
            next.set(target, count);
        }
        else {
            next.delete(target);
        }
        pendingKeys.value = next;
    }
    async function submit(params) {
        // Take a number. Holding the highest one is what earns the right to write
        // `data` and `error`, checked again when this submit settles.
        let sequence = (lastStarted += 1);
        let isNewest = () => sequence === lastStarted;
        if (validate) {
            let message = validate(params);
            if (message) {
                let validationError = new Error(message);
                // `validate` is synchronous, so this submit is still the newest one.
                error.value = validationError;
                throw validationError;
            }
        }
        let target = key ? key(params) : undefined;
        startPending(target);
        // Detached so the per-submit call is not tied to whichever component
        // happened to call submit, and stopped below so its watchers and computeds
        // do not pile up one set per submit.
        let scope = effectScope(true);
        try {
            let call = scope.run(() => useCall({
                url: url(params),
                method,
                baseUrl,
                immediate: false,
                refetch: false,
                onSuccess: options.onSuccess
                    ? (response) => options.onSuccess(response, params)
                    : undefined,
                onError: options.onError
                    ? (e) => options.onError(e, params)
                    : undefined,
            }));
            let response = await call.submit(body ? body(params) : params);
            let callError = (call.error ?? null);
            // A newer submit started while this one was in flight, so this answer is
            // stale. It goes to its own caller and nowhere else — writing it now, or
            // clearing the newer submit's error, would undo a fresher answer.
            if (!isNewest()) {
                if (callError)
                    throw callError;
                return response;
            }
            if (callError) {
                // `data` keeps the last successful response. `error` is what tells a
                // failed submit apart from a successful one.
                error.value = callError;
                throw callError;
            }
            data.value = response;
            error.value = null;
            return response;
        }
        finally {
            finishPending(target);
            scope.stop();
        }
    }
    return { data, error, loading, isLoading, submit };
}
