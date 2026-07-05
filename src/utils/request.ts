export interface RequestOptions<TResponse = unknown> {
  url: string
  method?: string
  headers?: HeadersInit
  params?: Record<string, any>
  responseType?: 'json' | 'response'
  signal?: AbortSignal
  credentials?: RequestCredentials
  transformRequest?: (
    options: RequestOptions<TResponse>,
  ) => RequestOptions<TResponse>
  transformResponse?: (
    response: Response,
    options: RequestOptions<TResponse>,
  ) => TResponse | Promise<TResponse>
  transformError?: (error: unknown) => TResponse | Promise<TResponse>
}

export interface RequestError extends Error {
  response?: Response
}

export function request<TResponse = unknown>(
  _options: RequestOptions<TResponse>,
): Promise<TResponse> {
  let options = Object.assign({}, _options)
  if (!options.url) {
    throw new Error('[request] options.url is required')
  }
  if (options.transformRequest) {
    options = options.transformRequest(_options)
  }
  if (!options.responseType) {
    options.responseType = 'json'
  }
  if (!options.method) {
    options.method = 'GET'
  }

  let url = options.url
  let body
  if (options.params) {
    if (options.method === 'GET') {
      let params = new URLSearchParams()
      for (let key in options.params) {
        params.append(key, String(options.params[key]))
      }
      url = options.url + '?' + params.toString()
    } else {
      body = JSON.stringify(options.params)
    }
  }

  return fetch(url, {
    method: options.method || 'GET',
    headers: options.headers,
    body,
    signal: options.signal,
    ...(options.credentials ? { credentials: options.credentials } : {}),
  })
    .then((response) => {
      if (options.transformResponse) {
        return options.transformResponse(response, options)
      }
      if (response.status >= 200 && response.status < 300) {
        if (options.responseType === 'json') {
          return response.json()
        }
        return response
      } else {
        let error: RequestError = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .catch((error) => {
      if (options.transformError) {
        return options.transformError(error)
      }
      throw error
    })
}
