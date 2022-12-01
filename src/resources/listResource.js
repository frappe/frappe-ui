import { reactive } from 'vue'
import { getCacheKey, createResource } from './resources'
import { saveLocal, getLocal } from './local'

let listCache = reactive({})
let resourcesByDocType = {}

export function createListResource(options, vm) {
  if (!options.doctype) {
    throw new Error('List resource requires doctype')
  }

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
    parent: options.parent,
    debug: options.debug || 0,
    originalData: null,
    data: null,
    next,
    hasNextPage: true,
    auto: options.auto,
    list: createResource(
      {
        url: options.url || 'frappe.client.get_list',
        makeParams() {
          return {
            doctype: out.doctype,
            fields: out.fields,
            filters: out.filters,
            order_by: out.order_by,
            start: out.start,
            limit: out.limit,
            limit_start: out.start,
            limit_page_length: out.limit,
            parent: out.parent,
            debug: out.debug,
          }
        },
        onSuccess(data) {
          if (data.length < out.limit) {
            out.hasNextPage = false
          }
          let pagedData
          if (!out.start || out.start == 0) {
            pagedData = data
          } else if (out.start > 0) {
            pagedData = out.originalData.concat(data)
          }
          saveLocal(cacheKey, pagedData)
          setData(pagedData)
          options.onSuccess?.call(vm, out.data)
        },
        onError: options.onError,
      },
      vm
    ),
    fetchOne: createResource(
      {
        url: 'frappe.client.get_list',
        makeParams(name) {
          return {
            doctype: out.doctype,
            fields: out.fields || '*',
            filters: { name },
          }
        },
        onSuccess(data) {
          if (data.length > 0 && out.originalData) {
            let doc = data[0]
            updateRowInListResource(out.doctype, doc)
          }

          options.fetchOne?.onSuccess?.call(vm, out.data)
        },
        onError: options.fetchOne?.onError,
      },
      vm
    ),
    insert: createResource(
      {
        url: 'frappe.client.insert',
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
        url: 'frappe.client.set_value',
        makeParams(options) {
          let { name, ...values } = options
          return {
            doctype: out.doctype,
            name: name,
            fieldname: values,
          }
        },
        onSuccess(doc) {
          updateRowInListResource(out.doctype, doc)
          options.setValue?.onSuccess?.call(vm, doc)
        },
        onError: options.setValue?.onError,
      },
      vm
    ),
    delete: createResource(
      {
        url: 'frappe.client.delete',
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
    runDocMethod: createResource(
      {
        url: 'run_doc_method',
        makeParams({ method, name, ...values }) {
          return {
            dt: out.doctype,
            dn: name,
            method: method,
            args: JSON.stringify(values),
          }
        },
        onSuccess(data) {
          if (data.docs) {
            for (let doc of data.docs) {
              updateRowInListResource(doc.doctype, doc)
            }
          }
        },
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
  }

  function transform(data) {
    if (options.transform) {
      let returnValue = options.transform.call(vm, data)
      if (returnValue != null) {
        return returnValue
      }
    }
    return data
  }

  function reload() {
    let _start = out.start
    let _limit = out.limit
    if (out.start > 0) {
      out.start = 0
      out.limit = out.originalData.length
    }
    return out.list.fetch().finally(() => {
      out.start = _start
      out.limit = _limit
    })
  }

  function setData(data) {
    out.originalData = data
    if (typeof data === 'function') {
      data = data.call(vm, out.data)
    }
    out.data = transform(data)
  }

  function next() {
    out.start = out.start + out.limit
    out.list.fetch()
  }

  if (options.realtime && vm.$socket) {
    vm.$socket.on('list_update', (data) => {
      if (
        data.doctype === out.doctype &&
        out.originalData?.find((d) => d.name === data.name)
      ) {
        out.fetchOne.submit(data.name)
      }
    })
  }

  if (cacheKey) {
    // cache
    listCache[cacheKey] = out
    // offline
    getLocal(cacheKey).then((data) => {
      if ((out.list.loading || !out.list.fetched) && data) {
        setData(data)
      }
    })
  }

  if (options.auto) {
    out.list.fetch()
  }

  resourcesByDocType[out.doctype] = resourcesByDocType[out.doctype] || []
  resourcesByDocType[out.doctype].push(out)

  return out
}

export function getCachedListResource(cacheKey) {
  cacheKey = getCacheKey(cacheKey)
  return listCache[cacheKey] || null
}

export function updateRowInListResource(doctype, doc) {
  if (!doc.name) return
  let resources = resourcesByDocType[doctype] || []
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

export function deleteRowInListResource(doctype, docname) {
  let resources = resourcesByDocType[doctype] || []
  for (let resource of resources) {
    if (resource.originalData) {
      resource.originalData = resource.originalData.filter(
        (row) => row.name.toString() !== docname
      )
      resource.data = resource.transform(resource.originalData)
    }
  }
}

export function revertRowInListResource(doctype, doc) {
  let resources = resourcesByDocType[doctype] || []
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
