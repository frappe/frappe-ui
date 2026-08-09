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

// The `docs` writes in `afterFetch` below are versioned so a stale response
// cannot overwrite a fresh document. Every request takes a number when it is
// dispatched, carried to `afterFetch` on its Response. A response may write a
// document only if no response from a later-dispatched request has written it
// already — without this, two concurrent writes to one document leave the
// store on whichever response settled last (#1017). The composable-level
// newest-wins gates (`useAction`, `useDoc`'s write members) cannot cover this
// path: this hook runs before any per-call hook they can gate.
let dispatchCounter = 0
const dispatchSeq = new WeakMap<Response, number>()
const lastDocsWrite = new Map<string, number>()

export const useFrappeFetch = createFetch({
  options: {
    // Wrapping the global fetch is required for vitest, and stamps each
    // response with its request's dispatch number.
    fetch: (...args) => {
      const seq = ++dispatchCounter
      return fetch(...args).then((response) => {
        dispatchSeq.set(response, seq)
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
        // A missing number means the response did not come from the wrapped
        // fetch; treat it as the newest.
        let seq = dispatchSeq.get(ctx.response) ?? ++dispatchCounter
        let docs = []
        for (let doc of responseData.docs) {
          doc.name = doc.name.toString()
          let key = `${doc.doctype}/${doc.name}`
          // Stale per document, not per response: one response can carry a
          // fresh doc next to one that a newer request already wrote.
          if (seq < (lastDocsWrite.get(key) ?? 0)) continue
          lastDocsWrite.set(key, seq)
          docs.push(doc)
        }
        if (docs.length) {
          docStore.setDocs(docs)
          listStore.updateRows(docs)
        }
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
