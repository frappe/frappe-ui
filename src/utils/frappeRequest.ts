import { getConfig } from './config'
import { request, type RequestOptions } from './request'

declare global {
  interface Window {
    csrf_token?: string
  }
}

type ServerMessagesHandler = (messages: string[]) => void

export interface FrappeRequestOptions<TResponse = unknown> extends Omit<
  RequestOptions<TResponse>,
  'transformRequest' | 'transformResponse' | 'transformError'
> {
  onError?: (error: FrappeRequestError) => void
  onServerMessages?: ServerMessagesHandler
}

export interface FrappeRequestError extends Error {
  exc_type?: string
  exc?: string
  response?: Response
  status?: number
  messages: string[]
}

/**
 * One failed request must reach `onError` exactly once.
 *
 * Two paths can report the same failure: `transformResponse` builds and throws
 * the error for a non-ok response, and `transformError` then sees that same
 * error on its way out. Tagging it on the way through is what keeps the count
 * at one, while leaving `transformError` free to report the failures only it
 * sees — a transport error, or an ok response whose body will not parse.
 */
const reported = Symbol('frappe-ui.onErrorReported')

function reportOnce(
  error: unknown,
  onError: ((error: FrappeRequestError) => void) | undefined,
) {
  if (!onError) return
  if (error && typeof error === 'object') {
    const tagged = error as Record<PropertyKey, unknown>
    if (tagged[reported]) return
    tagged[reported] = true
  }
  onError(error as FrappeRequestError)
}

/**
 * `login` is the one endpoint whose whole body the caller needs — it carries
 * `full_name` and `home_page` alongside `message`, and returning `data.message`
 * would throw those away.
 *
 * Matched on the path, not on the whole URL. `transformRequest` prepends
 * `requestBaseUrl` before this runs, so with that config set the URL is
 * absolute (`https://site/api/method/login`) and an equality check against
 * `/api/method/login` silently stops matching. A dotted method that merely ends
 * in `login` (`myapp.auth.login`) becomes `/api/method/myapp.auth.login` and is
 * correctly not matched.
 */
function isLoginUrl(url: string | undefined): boolean {
  if (!url) return false
  const path = url.split(/[?#]/)[0]!.replace(/\/+$/, '')
  return path === '/api/method/login' || path.endsWith('/api/method/login')
}

type FrappeResponseBody = {
  docs?: unknown
  exc?: string
  exc_type?: string
  message?: unknown
  _server_messages?: string
  _error_message?: string
}

export function frappeRequest<TResponse = unknown>(
  options: FrappeRequestOptions<TResponse>,
): Promise<TResponse> {
  const originalOptions = options
  // Both the explicit return type and the explicit type argument matter: with
  // neither, inference widened the result to `Promise<unknown>` and the
  // `TResponse` a caller passed had no effect on what it awaited.
  return request<TResponse>({
    ...options,
    transformRequest: (options) => {
      if (!options.url) {
        throw new Error('[frappeRequest] options.url is required')
      }
      let configHeaders = getConfig('requestHeaders') || {}
      if (typeof configHeaders === 'function') {
        configHeaders = configHeaders()
      }
      let headers = Object.assign(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          // Sent as the local hostname even when requestBaseUrl points at a
          // remote site. Harmless for dev, but pass a `requestHeaders` override
          // if you need the remote site name here.
          'X-Frappe-Site-Name': window.location.hostname,
        },
        configHeaders,
        options.headers || {},
      )
      if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
        headers['X-Frappe-CSRF-Token'] = window.csrf_token
      }
      // Match a real scheme, not the four letters. `startsWith('http')` also
      // matched a dotted method in an app whose name begins with them —
      // `http_utils.api.run` skipped the prefix and was fetched as a relative
      // path. Absolute URLs still pass through untouched.
      if (!options.url.startsWith('/') && !/^https?:\/\//i.test(options.url)) {
        options.url = '/api/method/' + options.url
      }
      // Prepend a configured base URL to relative URLs for local dev against a
      // remote instance. Default to `credentials: 'include'` so cookie-based
      // cross-origin auth works out of the box (the server must then send
      // Access-Control-Allow-Credentials: true and a non-wildcard origin). If
      // you authenticate with a token via `requestHeaders` instead, you usually
      // want cookies omitted — pass `options.credentials: 'omit'` to override.
      let baseUrl = getConfig('requestBaseUrl')
      let credentials = options.credentials
      if (baseUrl && options.url.startsWith('/')) {
        options.url = baseUrl.replace(/\/$/, '') + options.url
        credentials = credentials || 'include'
      }
      return {
        ...options,
        method: options.method || 'POST',
        headers,
        credentials,
      }
    },
    transformResponse: async (response, options) => {
      let url = options.url
      if (response.ok) {
        const data = (await response.json()) as FrappeResponseBody
        if (data.docs || isLoginUrl(url)) {
          return data as TResponse
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

        if (data._server_messages) {
          let onMessageHandler =
            getConfig('serverMessagesHandler') ||
            originalOptions.onServerMessages ||
            null
          if (onMessageHandler) {
            onMessageHandler(JSON.parse(data?._server_messages) || [])
          }
        }

        return data.message as TResponse
      } else {
        let errorResponse = await response.text()
        let error: FrappeResponseBody = {}
        let exception
        try {
          error = JSON.parse(errorResponse)
          // eslint-disable-next-line no-empty
        } catch (e) {}
        let errorParts = [
          [options.url, error?.exc_type, error?._error_message]
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
        let e = new Error(errorParts.join('\n')) as FrappeRequestError
        e.exc_type = error.exc_type
        e.exc = exception
        e.response = response
        e.status = response.status
        e.messages = error._server_messages
          ? JSON.parse(error._server_messages)
          : []
        if (error.message !== undefined) {
          e.messages = e.messages.concat(error.message as any)
        }
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
        reportOnce(e, originalOptions.onError)
        throw e
      }
    },
    transformError: (error) => {
      reportOnce(error, originalOptions.onError)
      throw error
    },
  })
}
