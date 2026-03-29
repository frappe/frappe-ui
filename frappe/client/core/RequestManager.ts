import type { RequestConfig } from './types'
import { FrappeResponseError } from './FrappeResponseError'

export interface RequestManagerConfig {
  baseUrl?: string
  onRequest?: (config: RequestConfig) => RequestConfig | void
  onError?: (error: FrappeResponseError) => void
  onResponse?: (response: any) => void
}

export interface RequestManager {
  /** Executes an HTTP request and returns the parsed JSON body. */
  fetch(config: RequestConfig): Promise<any>
  /** Fetches a single document. Resolves with the raw API JSON (`.data` holds the doc). */
  fetchDoc(doctype: string, name: string): Promise<any>
}

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export function createRequestManager(
  config: RequestManagerConfig = {},
): RequestManager {
  const { baseUrl = '', onRequest, onError, onResponse } = config
  // Dedup map: key → in-flight promise
  const inflight = new Map<string, Promise<any>>()

  return {
    async fetch(requestConfig: RequestConfig) {
      // Allow onRequest hook to modify config
      if (onRequest) {
        const modified = onRequest(requestConfig)
        if (modified) requestConfig = modified
      }

      const { url, method, body, signal } = requestConfig
      const isMutation = MUTATING_METHODS.has(method)
      const dedupe = requestConfig.dedupe ?? !isMutation

      const fullUrl = baseUrl ? `${baseUrl}${url}` : url

      const headers: Record<string, string> = {
        Accept: 'application/json',
      }

      if (isMutation) {
        headers['X-Frappe-CSRF-Token'] = getCsrfToken()
        if (body) {
          headers['Content-Type'] = 'application/json; charset=utf-8'
        }
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',
        signal,
      }

      // Build the actual URL (GET params vs body)
      let fetchUrl = fullUrl
      if (!isMutation && body) {
        const params = new URLSearchParams()
        for (const [k, v] of Object.entries(body)) {
          if (v !== undefined && v !== null) {
            params.append(
              k,
              typeof v === 'object' ? JSON.stringify(v) : String(v),
            )
          }
        }
        const qs = params.toString()
        if (qs) {
          fetchUrl += (fullUrl.includes('?') ? '&' : '?') + qs
        }
      } else if (isMutation && body) {
        fetchOptions.body = JSON.stringify(body)
      }

      // Dedup key includes the full URL with query params so that GET requests
      // with different query strings (e.g. different filter values) are not
      // incorrectly collapsed into a single in-flight request.
      const dedupeKey = `${method}:${fetchUrl}`

      if (dedupe && inflight.has(dedupeKey)) {
        return inflight.get(dedupeKey)!
      }

      const promise = (async () => {
        try {
          const response = await fetch(fetchUrl, fetchOptions)
          const text = await response.text()
          const json = text ? JSON.parse(text) : {}

          if (!response.ok) {
            let error: FrappeResponseError
            if (json.errors && Array.isArray(json.errors)) {
              const errs = json.errors
              error = new FrappeResponseError({
                title: errs[0]?.title || 'Error',
                type: errs[0]?.type || 'Error',
                messages: errs.map((e: any) => ({
                  type: e.type || 'Error',
                  message: e.message || e.title || '',
                })),
                exception: errs[0]?.exception,
                indicator: errs[0]?.indicator,
                httpStatus: response.status,
              })
            } else {
              error = new FrappeResponseError({
                title: 'HTTP Error',
                type: 'HTTPError',
                messages: [
                  {
                    type: 'HTTPError',
                    message: `HTTP ${response.status}: ${response.statusText}`,
                  },
                ],
                httpStatus: response.status,
              })
            }
            // Defer so that a local onError handler in the call stack can
            // set error._suppressGlobalError = true before this fires.
            setTimeout(() => {
              if (!error._suppressGlobalError) onError?.(error)
            }, 0)
            throw error
          }

          onResponse?.(json)
          return json
        } finally {
          inflight.delete(dedupeKey)
        }
      })()

      if (dedupe) {
        inflight.set(dedupeKey, promise)
      }

      return promise
    },

    fetchDoc(doctype: string, name: string) {
      return this.fetch({
        url: `/api/v2/document/${doctype}/${encodeURIComponent(name)}`,
        method: 'GET',
      })
    },
  }
}
