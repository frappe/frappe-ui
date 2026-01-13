import { reactive } from 'vue'

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

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FrappeResponseError)
    }
  }
}

type FrappeError = {
  title: string
  message: string
  exception?: string
  type: string
  indicator: string
}

export interface UseFetchOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, any>
  headers?: Record<string, string>
  baseUrl?: string
  immediate?: boolean
}

export interface UseFetchResult<T> {
  data: T | null
  error: Error | null
  loading: boolean
  execute: () => Promise<void>
}

export function useFrappeFetch<T = any>(
  options: UseFetchOptions,
): UseFetchResult<T> {
  const {
    url,
    method = 'GET',
    params,
    headers: customHeaders = {},
    baseUrl = '',
    immediate = true,
  } = options

  const state = reactive({
    data: null as T | null,
    error: null as Error | null,
    loading: false,
    execute: async () => {},
  })

  state.execute = async () => {
    state.loading = true
    state.error = null

    try {
      let fullUrl = baseUrl ? `${baseUrl}${url}` : url

      // If method is GET and params exist, append to URL
      if (method === 'GET' && params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value))
        })
        const queryString = searchParams.toString()
        fullUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${queryString}`
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...customHeaders,
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      }

      // If method is not GET and params exist, send as JSON body
      if (method !== 'GET' && params) {
        headers['Content-Type'] = 'application/json; charset=utf-8'
        fetchOptions.body = JSON.stringify(params)
      }

      const response = await fetch(fullUrl, fetchOptions)

      const text = await response.text()
      const json = text ? JSON.parse(text) : {}

      if (!response.ok) {
        if (json.errors && Array.isArray(json.errors)) {
          const err = json.errors[0]
          const errorDescription = err.message
            ? `: ${err.message}`
            : err.exception
              ? ` (Traceback)`
              : ''
          throw new FrappeResponseError(`${err.type}${errorDescription}`, {
            title: err.title,
            type: err.type,
            exception: err.exception,
            indicator: err.indicator,
          })
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      state.data = json as any
    } catch (e) {
      state.error = e instanceof Error ? e : new Error(String(e))
      state.data = null
    } finally {
      state.loading = false
    }
  }

  // Auto-execute on creation if immediate is true
  if (immediate) {
    state.execute()
  }

  return state as UseFetchResult<T>
}
