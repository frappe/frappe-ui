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
const dispatchVersions = new WeakMap<Response, number>()

/**
 * The dispatch version stamped on a Response by the wrapped fetch below.
 * `undefined` for a Response that did not come through it.
 */
export function getDispatchVersion(
  response: Response | null | undefined,
): number | undefined {
  return response ? dispatchVersions.get(response) : undefined
}

export const useFrappeFetch = createFetch({
  options: {
    // Wrapping the global fetch is required for vitest, and stamps each
    // response with its request's dispatch version.
    fetch: (...args) => {
      const version = docStore.nextWriteVersion()
      return fetch(...args).then((response) => {
        dispatchVersions.set(response, version)
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
        let version =
          dispatchVersions.get(ctx.response) ?? docStore.nextWriteVersion()
        docStore.setDocs(responseData.docs, version)
        listStore.updateRows(responseData.docs, version)
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
