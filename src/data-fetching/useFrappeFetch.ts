import { createFetch } from '@vueuse/core'

const useFrappeFetch = createFetch({
  options: {
    beforeFetch({ options }) {
      options.headers = setHeaders(options.headers || {})
      return { options }
    },
    afterFetch(ctx) {
      console.log('afterFetch', ctx)
      let data = JSON.parse(ctx.data).data
      ctx.data = data
      return ctx
    },
    onFetchError(ctx) {
      type FrappeError = {
        title: string
        message: string
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
      let error = errors[0] // assuming only one error for now
      let frappeError = new Error(`${error.type}: ${error.message}`)
      // e.type = error.type
      // e.exception = exception

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

export default useFrappeFetch
