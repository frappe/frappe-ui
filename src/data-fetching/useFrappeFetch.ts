import { createFetch } from '@vueuse/core'
import { docStore } from './docStore'
import { listStore } from './useList/listStore'
import { LOCAL_WRITE, writeGate, type DispatchStamp } from './writeGate'

export class FrappeResponseError extends Error {
  title: string
  type: string
  exception?: string
  indicator?: string

  constructor(
    message: string,
    options: {
      title: string
      type: string
      exception?: string
      indicator?: string
    },
  ) {
    super(message)
    this.name = 'FrappeResponseError'
    this.title = options.title
    this.type = options.type
    this.exception = options.exception
    this.indicator = options.indicator

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    const captureStackTrace = (
      Error as ErrorConstructor & {
        captureStackTrace?: (target: object, constructor?: Function) => void
      }
    ).captureStackTrace
    if (captureStackTrace) {
      captureStackTrace(this, FrappeResponseError)
    }
  }
}

// This is where a request takes its sequence number: every request stamped on
// dispatch, the stamp carried on its Response, and the stores gate their
// writes on it. See `writeGate` for the rule — this module is only the place
// the number is minted and the place it is read back off the response.
export type { DispatchStamp } from './writeGate'

const dispatchStamps = new WeakMap<Response, DispatchStamp>()

/**
 * The stamp put on a Response by the wrapped fetch below. The single source
 * for both halves of the write-gate rule: the dispatch version and whether
 * the response may record it. `undefined` for a Response that did not come
 * through the wrapped fetch.
 */
export function getDispatchStamp(
  response: Response | null | undefined,
): DispatchStamp | undefined {
  return response ? dispatchStamps.get(response) : undefined
}

export const useFrappeFetch = createFetch({
  options: {
    // Wrapping the global fetch is required for vitest, and stamps each
    // response with its request's dispatch version.
    fetch: (input, init) => {
      // The sequence is taken here, before the request goes out — dispatch
      // order, not settle order, is what the gate compares. `record` is the
      // one place the mutating/read rule is decided, so no other module has
      // to re-derive it from a method string.
      const stamp = writeGate.next(
        (init?.method ?? 'GET').toUpperCase() !== 'GET',
      )
      return fetch(input, init).then((response) => {
        dispatchStamps.set(response, stamp)
        return response
      })
    },
    beforeFetch({ options }) {
      options.headers = setHeaders(options.headers || {})
      return { options }
    },
    afterFetch(ctx) {
      let responseData = JSON.parse(ctx.data)
      ctx.data = responseData
      if (responseData.debug) {
        let path = ctx.response.url.replace(window.location.origin, '')
        console.group(path)
        for (let d of responseData.debug) {
          console.log(d?.message)
        }
        console.groupEnd()
      }
      if (responseData.docs) {
        // A response with no stamp did not come from the wrapped fetch above,
        // so there is no dispatch order to place it in: `LOCAL_WRITE` — the
        // one answer every store write gives to "no stamp". Unreachable
        // today; every call site goes through the wrapped fetch. Both stores
        // get the same stamp, so the docs and the rows of one response are
        // gated as one write per document.
        let stamp = getDispatchStamp(ctx.response) ?? LOCAL_WRITE
        docStore.setDocs(responseData.docs, stamp)
        listStore.updateRows(responseData.docs, stamp)
      }
      return ctx
    },
    onFetchError(ctx) {
      if (ctx.response?.ok && ctx.error) {
        // if response is ok and there is an error, it's a client side programming error
        console.error(
          'Fetch request succeeded but there was a programming error:\n\n',
          ctx.error,
        )
        return ctx
      }

      type FrappeError = {
        title: string
        message: string
        exception?: string
        type: string
        indicator: string
      }
      try {
        if (!ctx.data) {
          return ctx
        }

        let errorResponse = JSON.parse(ctx.data)
        let errors: Array<FrappeError> | undefined = errorResponse.errors
        let error = errors?.[0] // assuming only one error for now
        if (!error) {
          return ctx
        }

        let errorDescription = error.message
          ? `: ${error.message}`
          : error.exception
            ? ` (Traceback)`
            : ''
        let frappeError = new FrappeResponseError(
          `${error.type}${errorDescription}`,
          {
            title: error.title,
            type: error.type,
            exception: error.exception,
            indicator: error.indicator,
          },
        )

        if (import.meta.env.DEV && error.exception) {
          console.log(error.exception)
        }

        ctx.error = frappeError
        return ctx
      } catch (e) {
        console.log('Error parsing error response:', e)
        return ctx
      }
    },
  },
})

function setHeaders(headers: HeadersInit) {
  // handle case where this could run in node environment (vitest)
  let siteName = null
  let csrfToken = null
  if (typeof window !== 'undefined') {
    siteName = window.location.hostname
    csrfToken =
      window.csrf_token !== '{{ csrf_token }}' ? window.csrf_token : null
  }

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  }
  if (siteName) {
    defaultHeaders['X-Frappe-Site-Name'] = siteName
  }
  if (csrfToken) {
    defaultHeaders['X-Frappe-CSRF-Token'] = csrfToken
  }

  return { ...headers, ...defaultHeaders }
}
