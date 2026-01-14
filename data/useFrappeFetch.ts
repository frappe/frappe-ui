import { reactive, watch, toValue, MaybeRefOrGetter } from 'vue'

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

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, FrappeResponseError)
    }
  }
}

export interface UseFetchOptions<T = any> {
  url: MaybeRefOrGetter<string>
  method?: MaybeRefOrGetter<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>
  params?: MaybeRefOrGetter<Record<string, any> | undefined>
  headers?: MaybeRefOrGetter<Record<string, string> | undefined>
  baseUrl?: string
  immediate?: boolean
  watch?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export interface UseFetchResult<T> {
  json: T | null
  error: Error | null
  loading: boolean
  execute: () => Promise<void>
  abort: () => void
}

export function useFrappeFetch<T = any>(
  options: UseFetchOptions<T>,
): UseFetchResult<T> {
  const {
    url: urlOption,
    method: methodOption = 'GET',
    params: paramsOption,
    headers: headersOption,
    baseUrl = '',
    immediate = true,
    watch: watchOptions = false,
    onSuccess,
    onError,
  } = options

  let abortController: AbortController | null = null

  const state = reactive({
    json: null as T | null,
    error: null as Error | null,
    loading: false,
    execute: async () => {},
    abort: () => {},
  })

  state.abort = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  state.execute = async () => {
    // Cancel any in-flight request
    state.abort()

    abortController = new AbortController()
    state.loading = true
    state.error = null

    try {
      const url = toValue(urlOption)
      const method = toValue(methodOption)
      const params = toValue(paramsOption)
      const customHeaders = toValue(headersOption) || {}

      let fullUrl = baseUrl ? `${baseUrl}${url}` : url

      // If method is GET and params exist, append to URL
      if (method === 'GET' && params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value))
        })
        const queryString = searchParams.toString()
        const separator = fullUrl.includes('?') ? '&' : '?'
        fullUrl = `${fullUrl}${separator}${queryString}`
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...customHeaders,
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: abortController.signal,
      }

      // If method is not GET and params exist, send as JSON body
      if (method !== 'GET' && params) {
        headers['Content-Type'] = 'application/json; charset=utf-8'
        fetchOptions.body = JSON.stringify(params)
      }

      const response = await fetch(fullUrl, fetchOptions)

      const text = await response.text()
      const json: any = text ? JSON.parse(text) : {}

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

      state.json = json

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(json)
      }
    } catch (e) {
      // Ignore abort errors
      if (e instanceof Error && e.name === 'AbortError') {
        return
      }
      state.error = e instanceof Error ? e : new Error(String(e))
      state.json = null

      // Call onError callback if provided
      if (onError) {
        onError(state.error)
      }
    } finally {
      state.loading = false
      abortController = null
    }
  }

  // Setup watchers for reactive options
  if (watchOptions) {
    // Build watch sources - for each option, create a getter that returns its value
    const watchSources = []

    if (urlOption !== undefined) {
      watchSources.push(
        typeof urlOption === 'function' ? urlOption : () => toValue(urlOption),
      )
    }
    if (methodOption !== undefined) {
      watchSources.push(
        typeof methodOption === 'function'
          ? methodOption
          : () => toValue(methodOption),
      )
    }
    if (paramsOption !== undefined) {
      watchSources.push(
        typeof paramsOption === 'function'
          ? paramsOption
          : () => toValue(paramsOption),
      )
    }
    if (headersOption !== undefined) {
      watchSources.push(
        typeof headersOption === 'function'
          ? headersOption
          : () => toValue(headersOption),
      )
    }

    if (watchSources.length > 0) {
      watch(
        watchSources,
        () => {
          state.execute()
        },
        { deep: true, immediate: false },
      )
    }
  }

  // Auto-execute on creation if immediate is true
  if (immediate) {
    state.execute()
  }

  return state as UseFetchResult<T>
}
