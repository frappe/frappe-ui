import { call, debounce } from 'frappe-ui'
import { reactive } from 'vue'

let cached = {}

export function createResource(options, vm, getResource) {
  let cacheKey = null
  if (options.cache) {
    cacheKey = getCacheKey(options.cache)
    if (cached[cacheKey]) {
      return cached[cacheKey]
    }
  }

  if (typeof options == 'string') {
    options = {
      method: options,
      auto: true,
    }
  }

  let resourceFetcher = getResource || call
  let fetchFunction = options.debounce
    ? debounce(fetch, options.debounce)
    : fetch

  let out = reactive({
    data: options.initialData || null,
    previousData: null,
    loading: false,
    fetched: false,
    error: null,
    auto: options.auto,
    params: null,
    fetch: fetchFunction,
    reload: fetchFunction,
    submit: fetchFunction,
    reset,
    update,
    setData,
  })

  async function fetch(params, tempOptions = {}) {
    if (params instanceof Event) {
      params = null
    }
    params = params || out.params
    if (options.makeParams) {
      params = options.makeParams.call(vm, params)
    }
    out.params = params
    out.previousData = out.data ? JSON.parse(JSON.stringify(out.data)) : null
    out.loading = true

    if (options.onFetch) {
      options.onFetch.call(vm, out.params)
    }

    if (options.beforeSubmit) {
      options.beforeSubmit.call(vm, out.params)
    }

    let validateFunction = tempOptions.validate || options.validate
    let errorFunctions = [options.onError, tempOptions.onError]
    let successFunctions = [options.onSuccess, tempOptions.onSuccess]

    if (validateFunction) {
      let invalidMessage
      try {
        invalidMessage = await validateFunction.call(vm, out.params)
        if (invalidMessage && typeof invalidMessage == 'string') {
          out.loading = false
          let error = new Error(invalidMessage)
          handleError(error, errorFunctions)
          return
        }
      } catch (error) {
        out.loading = false
        handleError(error, errorFunctions)
        return
      }
    }

    try {
      let data = await resourceFetcher(options.method, params || options.params)
      out.data = transform(data)
      out.fetched = true
      for (let fn of successFunctions) {
        if (fn) {
          fn.call(vm, data)
        }
      }
    } catch (error) {
      handleError(error, errorFunctions)
    }
    out.loading = false
    return out.data
  }

  function update({ method, params, auto }) {
    if (method && method !== options.method) {
      out.method = method
    }
    if (params && params !== options.params) {
      out.params = params
    }
    if (auto !== undefined && auto !== out.auto) {
      out.auto = auto
    }
  }

  function reset() {
    out.data = options.initialData || null
    out.previousData = null
    out.loading = false
    out.fetched = false
    out.error = null
    out.params = null
    out.auto = options.auto
  }

  function handleError(error, errorFunctions) {
    if (out.previousData) {
      out.data = out.previousData
    }
    out.error = error
    for (let fn of errorFunctions) {
      if (fn) {
        fn.call(vm, error)
      }
    }
    throw error
  }

  // usage:
  // setData(newData) or
  // setData(data => data.filter(d => !d.deleted))
  function setData(data) {
    if (typeof data === 'function') {
      data = data.call(vm, out.data)
    }
    out.data = transform(data)
  }

  function transform(data) {
    if (options.transform) {
      let returnValue = options.transform.call(vm, data)
      if (typeof returnValue != null) {
        return returnValue
      }
    }
    return data
  }

  if (cacheKey && !cached[cacheKey]) {
    cached[cacheKey] = out
  }

  return out
}

export function getCacheKey(cacheKey) {
  if (!cacheKey) {
    return null
  }
  if (typeof cacheKey === 'string') {
    cacheKey = [cacheKey]
  }
  return JSON.stringify(cacheKey)
}
