import { createFetch } from '@vueuse/core'
import { docStore } from './docStore'
import { listStore } from './useList/listStore'

export const useFrappeFetch = createFetch({
  options: {
    fetch: (...args) => fetch(...args), // required for vitest
    beforeFetch({ options }) {
      options.headers = setHeaders(options.headers || {})
      return { options }
    },
    afterFetch(ctx) {
      let responseData = JSON.parse(ctx.data)
      if (responseData.debug) {
        let path = ctx.response.url.replace(window.location.origin, '')
        console.group(path)
        for (let d of responseData.debug) {
          console.log(d?.message)
        }
        console.groupEnd()
      }
      if (responseData.docs) {
        let docs = responseData.docs
        for (let doc of docs) {
          doc.name = doc.name.toString()
        }
        docStore.setDocs(docs)
        listStore.updateRows(docs)
      }
      ctx.data = responseData.data
      return ctx
    },
    onFetchError(ctx) {
      type FrappeError = {
        title: string
        message: string
        exception?: string
        type: string
        indicator: string
      }
      let errors: Array<FrappeError> = []
      try {
        errors = JSON.parse(ctx.data).errors
      } catch (e) {
        errors = [
          {
            title: 'Internal Server Error',
            message: 'Internal Server Error',
            type: 'ServerError',
            indicator: 'red',
          },
        ]
      }
      //   debugger
      let error = errors[0] // assuming only one error for now
      let errorDescription = error.message
        ? `: ${error.message}`
        : error.exception
          ? ` (Traceback)`
          : ''
      let frappeError = new Error(`${error.type}${errorDescription}`)
      frappeError.title = error.title
      frappeError.type = error.type
      frappeError.exception = error.exception

      if (import.meta.env.DEV && error.exception) {
        console.log(error.exception)
      }

      ctx.error = frappeError
      return ctx
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
