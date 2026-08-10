import { createFetch } from '@vueuse/core'
import { docStore } from './docStore'
import { listStore } from './useList/listStore'

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

// Every request takes a dispatch version from `docStore` when it is
// dispatched, carried on its Response. The stores gate their writes on it: a
// document is written only if no later-dispatched request has written it
// already — without this, two concurrent writes to one document leave the
// store on whichever response settled last (#1017). The bookkeeping lives in
// `docStore`, so the docs side channel below and every store-writing hook
// share one freshness domain.
// `record` is whether the request mutates the server (anything but GET): only
// mutating responses record their version in the store, a read is admitted on
// its version but must not make an earlier-dispatched save stale.
export type DispatchStamp = { version: number; record: boolean }

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
      const version = docStore.nextWriteVersion()
      const record = (init?.method ?? 'GET').toUpperCase() !== 'GET'
      return fetch(input, init).then((response) => {
        dispatchStamps.set(response, { version, record })
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
        // A missing version means the response did not come from the wrapped
        // fetch; treat it as the newest. The stores gate per document.
        // `setDocs` runs synchronously up to its IDB write, so its records
        // are in place when `updateRows` checks them.
        let stamp = dispatchStamps.get(ctx.response) ?? {
          version: docStore.nextWriteVersion(),
          record: true,
        }
        docStore.setDocs(responseData.docs, stamp.version, stamp.record)
        listStore.updateRows(responseData.docs, stamp.version)
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
