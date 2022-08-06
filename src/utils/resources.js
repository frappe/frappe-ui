import { call, debounce } from 'frappe-ui'
import { reactive, watch } from 'vue'

let cached = {}
let documentCache = reactive({})
let listCache = reactive({})
let listResources = {}

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

export function createDocumentResource(options, vm) {
  if (!(options.doctype && options.name)) return

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
    beforeSubmit(params) {
      out.previousDoc = JSON.stringify(out.doc)
      Object.assign(out.doc, params.fieldname || {})
      // update data in list resources
      updateRowInListResource(out.doctype, out.doc)
    },
    onSuccess(data) {
      out.doc = transform(data)
      options.setValue?.onSuccess?.call(vm, data)
    },
    onError(error) {
      out.doc = JSON.parse(out.previousDoc)
      options.setValue?.onError?.call(vm, error)
      // revert data in list resource
      revertRowInListResource(out.doctype, out.doc)
    },
  }

  let out = reactive({
    doctype: options.doctype,
    name: options.name,
    doc: null,
    get: createResource(
      {
        method: 'frappe.client.get',
        makeParams() {
          return {
            doctype: out.doctype,
            name: out.name,
          }
        },
        onSuccess(data) {
          out.doc = transform(data)
          options.onSuccess?.call(vm, out.doc)
        },
        onError: options.onError,
      },
      vm
    ),
    setValue: createResource(setValueOptions, vm),
    setValueDebounced: createResource(
      {
        ...setValueOptions,
        debounce: options.debounce || 500,
      },
      vm
    ),
    delete: createResource(
      {
        method: 'frappe.client.delete',
        makeParams() {
          return {
            doctype: out.doctype,
            name: out.name,
          }
        },
        onSuccess() {
          out.doc = null
          options.delete?.onSuccess?.call(vm, data)
        },
        onError: options.delete?.onError,
      },
      vm
    ),
    update,
    reload,
  })

  for (let method in options.whitelistedMethods) {
    let methodName = options.whitelistedMethods[method]
    out[method] = createResource(
      {
        method: 'run_doc_method',
        makeParams(values) {
          return {
            dt: out.doctype,
            dn: out.name,
            method: methodName,
            args: JSON.stringify(values),
          }
        },
        onSuccess(data) {
          if (data.docs) {
            for (let doc of data.docs) {
              if (doc.doctype === out.doctype && doc.name === out.name) {
                out.doc = transform(doc)
                break
              }
            }
          }
        },
      },
      vm
    )
  }

  function update(updatedOptions) {
    out.doctype = updatedOptions.doctype
    out.name = updatedOptions.name
    out.get.fetch()
  }

  function reload() {
    return out.get.fetch()
  }

  function transform(doc) {
    if (options.transform) {
      let returnValue = options.transform.call(vm, doc)
      if (typeof returnValue === 'object') {
        return returnValue
      }
    }
    return doc
  }

  // fetch the doc
  out.get.fetch()
  // cache
  documentCache[cacheKey] = out
  return out
}

export function createListResource(options, vm, getResource) {
  if (!options.doctype) return

  let cacheKey = getCacheKey(options.cache)
  if (cacheKey) {
    if (listCache[cacheKey]) {
      return listCache[cacheKey]
    }
  }

  let out = reactive({
    doctype: options.doctype,
    fields: options.fields,
    filters: options.filters,
    order_by: options.order_by,
    start: options.start || 0,
    limit: options.limit || 20,
    originalData: null,
    data: null,
    next,
    hasNextPage: true,
    list: createResource(
      {
        method: 'frappe.client.get_list',
        makeParams() {
          return {
            doctype: out.doctype,
            fields: out.fields,
            filters: out.filters,
            order_by: out.order_by,
            limit_start: out.start,
            limit_page_length: out.limit,
          }
        },
        onSuccess(data) {
          if (data.length < out.limit) {
            out.hasNextPage = false
          }
          if (!out.start || out.start == 0) {
            out.originalData = data
          } else if (out.start > 0) {
            out.originalData = out.originalData.concat(data)
          }
          out.data = transform(out.originalData)
          options.onSuccess?.call(vm, out.data)
        },
        onError: options.onError,
      },
      vm
    ),
    fetchOne: createResource(
      {
        method: 'frappe.client.get_list',
        makeParams(name) {
          return {
            doctype: out.doctype,
            fields: out.fields,
            filters: { name },
          }
        },
        onSuccess(data) {
          if (data.length > 0 && out.originalData) {
            let doc = data[0]
            let index = out.originalData.findIndex((d) => d.name === doc.name)
            out.originalData = out.originalData.filter(
              (d) => d.name !== doc.name
            )
            out.originalData = [
              out.originalData.slice(0, index),
              data,
              out.originalData.slice(index),
            ].flat()
          }

          out.data = transform(out.originalData)
          options.fetchOne?.onSuccess?.call(vm, out.data)
        },
        onError: options.fetchOne?.onError,
      },
      vm
    ),
    insert: createResource(
      {
        method: 'frappe.client.insert',
        makeParams(values) {
          return {
            doc: {
              doctype: out.doctype,
              ...values,
            },
          }
        },
        onSuccess(data) {
          out.list.fetch()
          options.insert?.onSuccess?.call(vm, data)
        },
        onError: options.insert?.onError,
      },
      vm
    ),
    setValue: createResource(
      {
        method: 'frappe.client.set_value',
        makeParams(options) {
          let { name, ...values } = options
          return {
            doctype: out.doctype,
            name: name,
            fieldname: values,
          }
        },
        onSuccess(data) {
          out.list.fetch()
          options.setValue?.onSuccess?.call(vm, data)
        },
        onError: options.setValue?.onError,
      },
      vm
    ),
    delete: createResource(
      {
        method: 'frappe.client.delete',
        makeParams(name) {
          return {
            doctype: out.doctype,
            name,
          }
        },
        onSuccess(data) {
          out.list.fetch()
          options.delete?.onSuccess?.call(vm, data)
        },
        onError: options.delete?.onError,
      },
      vm
    ),
    update,
    reload,
    setData,
    transform,
  })

  function update(updatedOptions) {
    out.doctype = updatedOptions.doctype
    out.fields = updatedOptions.fields
    out.filters = updatedOptions.filters
    out.order_by = updatedOptions.order_by
    out.start = updatedOptions.start
    out.limit = updatedOptions.limit
    out.list.fetch()
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

  function reload() {
    out.start = 0
    return out.list.fetch()
  }

  function setData(data) {
    if (typeof data === 'function') {
      data = data.call(vm, out.data)
    }
    out.data = data
  }

  function next() {
    out.start = out.start + out.limit
    out.list.fetch()
  }

  // fetch list
  out.list.fetch()

  if (cacheKey) {
    // cache
    listCache[cacheKey] = out
  }

  listResources[out.doctype] = listResources[out.doctype] || []
  listResources[out.doctype].push(out)

  return out
}

function updateRowInListResource(doctype, doc) {
  let resources = listResources[doctype] || []
  for (let resource of resources) {
    if (resource.originalData) {
      for (let row of resource.originalData) {
        if (row.name && row.name == doc.name) {
          let previousRowData = JSON.stringify(row)
          for (let key in row) {
            if (key in doc) {
              row[key] = doc[key]
            }
          }
          row._previousData = previousRowData
        }
      }
      resource.data = resource.transform(resource.originalData)
    }
  }
}

function revertRowInListResource(doctype, doc) {
  let resources = listResources[doctype] || []
  for (let resource of resources) {
    if (resource.originalData) {
      for (let row of resource.originalData) {
        if (row.name && row.name == doc.name) {
          let previousRowData = JSON.parse(row._previousData)
          for (let key in row) {
            row[key] = previousRowData[key]
          }
          delete row._previousData
        }
      }
      resource.data = resource.transform(resource.originalData)
    }
  }
}

function createResourceForOptions(options, vm, getResource) {
  if (options.type === 'document') {
    return createDocumentResource(options, vm, getResource)
  }
  if (options.type === 'list') {
    return createListResource(options, vm, getResource)
  }
  return createResource(options, vm, getResource)
}

function getCacheKey(cacheKey) {
  if (!cacheKey) {
    return null
  }
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
            () => {
              try {
                return options.call(this)
              } catch (error) {
                console.warn('Failed to get resource options\n\n', error)
                return null
              }
            },
            (updatedOptions, oldVal) => {
              if (!updatedOptions) {
                return
              }

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
              if (resource && resource.auto) {
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
    $getDocumentResource(doctype, name) {
      let cacheKey = getCacheKey([doctype, name])
      return documentCache[cacheKey] || null
    },
    $getListResource(cache) {
      let cacheKey = getCacheKey(cache)
      return listCache[cacheKey] || null
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
