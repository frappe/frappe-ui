import { createFetch } from '@vueuse/core'

export const useFrappeFetch = createFetch({
  options: {
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

      if (import.meta.env.DEV && error.exception) {
        console.log(error.exception)
      }

      ctx.error = frappeError
      return ctx
    },
  },
})

function setHeaders(headers: HeadersInit) {
  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Frappe-Site-Name': window.location.hostname,
  }

  if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
    defaultHeaders['X-Frappe-CSRF-Token'] = window.csrf_token
  }

  return { ...headers, ...defaultHeaders }
}
