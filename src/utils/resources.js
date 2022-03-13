import { call, debounce } from 'frappe-ui'
import { reactive, watch } from 'vue'

let cached = {}
let documentCache = {}

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

  async function fetch(params) {
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

    if (options.validate) {
      let invalidMessage
      try {
        invalidMessage = await options.validate.call(vm, out.params)
        if (invalidMessage && typeof invalidMessage == 'string') {
          let error = new Error(invalidMessage)
          handleError(error)
          out.loading = false
          return
        }
      } catch (error) {
        handleError(error)
        out.loading = false
        return
      }
    }

    try {
      let data = await resourceFetcher(options.method, params || options.params)
      out.data = data
      out.fetched = true
      if (options.onSuccess) {
        options.onSuccess.call(vm, data)
      }
    } catch (error) {
      handleError(error)
    }
    out.loading = false
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

  function handleError(error) {
    console.error(error)
    if (out.previousData) {
      out.data = out.previousData
    }
    out.error = error
    if (options.onError) {
      options.onError.call(vm, error)
    }
  }

  // usage:
  // setData(newData) or
  // setData(data => data.filter(d => !d.deleted))
  function setData(data) {
    if (typeof data === 'function') {
      data = data.call(vm, out.data)
    }
    out.data = data
  }

  if (cacheKey && !cached[cacheKey]) {
    cached[cacheKey] = out
  }

  return out
}

export function createDocumentResource(options, vm) {
  let cacheKey = getCacheKey([options.doctype, options.name])
  if (documentCache[cacheKey]) {
    return documentCache[cacheKey]
  }

  let setValueOptions = {
    method: 'frappe.client.set_value',
    makeParams(values) {
      return {
        doctype: out.doctype,
        name: out.name,
        fieldname: values,
      }
    },
    onSuccess(data) {
      out.doc = data
    },
  }

  let out = reactive({
    doctype: options.doctype,
    name: options.name,
    doc: null,
    get: createResource({
      method: 'frappe.client.get',
      makeParams() {
        return {
          doctype: out.doctype,
          name: out.name,
        }
      },
      onSuccess(data) {
        out.doc = data
      },
    }),
    setValue: createResource(setValueOptions),
    setValueDebounced: createResource({
      ...setValueOptions,
      debounce: options.debounce || 500,
    }),
    delete: createResource({
      method: 'frappe.client.delete',
      makeParams() {
        return {
          doctype: out.doctype,
          name: out.name,
        }
      },
      onSuccess() {
        out.doc = null
      },
    }),
    update,
  })

  function update(updatedOptions) {
    out.doctype = updatedOptions.doctype
    out.name = updatedOptions.name
    out.get.fetch()
  }

  // fetch the doc
  out.get.fetch()
  // cache
  documentCache[cacheKey] = out
  return out
}

function createResourceForOptions(options, vm, getResource) {
  if (options.type === 'document') {
    return createDocumentResource(options, vm, getResource)
  }
  return createResource(options, vm, getResource)
}

function getCacheKey(cacheKey) {
  if (typeof cacheKey === 'string') {
    cacheKey = [cacheKey]
  }
  return JSON.stringify(cacheKey)
}

let createMixin = (mixinOptions) => ({
  created() {
    if (this.$options.resources) {
      this._resources = reactive({})
      for (let key in this.$options.resources) {
        let options = this.$options.resources[key]

        if (typeof options == 'function') {
          watch(
            () => options.call(this),
            (updatedOptions, oldVal) => {
              let changed =
                !oldVal ||
                JSON.stringify(updatedOptions) !== JSON.stringify(oldVal)

              if (!changed) return

              let resource = this._resources[key]
              if (!resource) {
                resource = createResourceForOptions(
                  updatedOptions,
                  this,
                  mixinOptions.getResource
                )
                this._resources[key] = resource
              } else {
                resource.update(updatedOptions)
              }
              if (resource.auto) {
                resource.fetch()
              }
            },
            {
              immediate: true,
            }
          )
        } else {
          let resource = createResourceForOptions(
            options,
            this,
            mixinOptions.getResource
          )
          this._resources[key] = resource
          if (resource.auto) {
            resource.fetch()
          }
        }
      }
    }
  },
  methods: {
    $getResource(cache) {
      let cacheKey = getCacheKey(cache)
      return cached[cacheKey] || null
    },
    $refetchResource(cache) {
      let resource = this.$getResource(cache)
      resource && resource.fetch()
    },
  },
  computed: {
    $resources() {
      return this._resources
    },
  },
})

export default {
  install(app, options) {
    let resourceMixin = createMixin(options)
    app.mixin(resourceMixin)
  },
}
