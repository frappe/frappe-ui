export function request(_options) {
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
        params.append(key, options.params[key])
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
  }).then((response) => {
    if (options.transformResponse) {
      return options.transformResponse(response, options)
    }
    if (response.status >= 200 && response.status < 300) {
      if (options.responseType === 'json') {
        return response.json()
      }
      return response
    } else {
      let error = new Error(response.statusText)
      error.response = response
      throw error
    }
  })
}
