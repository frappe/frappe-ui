import { request } from './request'

export function frappeRequest(options) {
  return request({
    ...options,
    transformRequest: (options = {}) => {
      if (!options.url) {
        throw new Error('[frappeRequest] options.url is required')
      }
      let headers = Object.assign(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'X-Frappe-Site-Name': window.location.hostname,
        },
        options.headers || {}
      )
      if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
        headers['X-Frappe-CSRF-Token'] = window.csrf_token
      }
      if (!options.url.startsWith('/') && !options.url.startsWith('http')) {
        options.url = '/api/method/' + options.url
      }
      return {
        ...options,
        method: options.method || 'POST',
        headers,
      }
    },
    transformResponse: async (response, options) => {
      let url = options.url
      if (response.ok) {
        const data = await response.json()
        if (data.docs || url === 'login') {
          return data
        }
        if (data.exc) {
          try {
            console.groupCollapsed(url)
            console.log(options)
            let warning = JSON.parse(data.exc)
            for (let text of warning) {
              console.log(text)
            }
            console.groupEnd()
          } catch (e) {
            console.warn('Error printing debug messages', e)
          }
        }
        return data.message
      } else {
        let errorResponse = await response.text()
        let error, exception
        try {
          error = JSON.parse(errorResponse)
          // eslint-disable-next-line no-empty
        } catch (e) {}
        let errorParts = [
          [options.url, error.exc_type, error._error_message]
            .filter(Boolean)
            .join(' '),
        ]
        if (error.exc) {
          exception = error.exc
          try {
            exception = JSON.parse(exception)[0]
            console.log(exception)
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        let e = new Error(errorParts.join('\n'))
        e.exc_type = error.exc_type
        e.exc = exception
        e.response = response
        e.status = errorResponse.status
        e.messages = error._server_messages
          ? JSON.parse(error._server_messages)
          : []
        e.messages = e.messages.concat(error.message)
        e.messages = e.messages.map((m) => {
          try {
            return JSON.parse(m).message
          } catch (error) {
            return m
          }
        })
        e.messages = e.messages.filter(Boolean)
        if (!e.messages.length) {
          e.messages = error._error_message
            ? [error._error_message]
            : ['Internal Server Error']
        }
        options.onError && options.onError(e)
        throw e
      }
    },
  })
}
