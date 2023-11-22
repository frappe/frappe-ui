import { reactive } from 'vue'
import { getCacheKey, createResource } from './resources'
import { saveLocal, getLocal } from './local'
import { onDocUpdate } from './realtime'
import { getConfig } from '../utils/config'

let listCache = reactive({})
let resourcesByDocType = {}

export function createListResource(options, vm) {
  if (!options.doctype) {
    throw new Error('List resource requires doctype')
  }

  let cacheKey = getCacheKey(options.cache)
  if (cacheKey) {
    let cachedResource = listCache[cacheKey]
    if (cachedResource) {
      if (cachedResource.auto) {
        cachedResource.reload()
      }
      return cachedResource
    }
  }

  let defaultListUrl = getConfig('defaultListUrl') || 'frappe.client.get_list'
  let defaultDocInsertUrl =
    getConfig('defaultDocInsertUrl') || 'frappe.client.insert'
  let defaultDocUpdateUrl =
    getConfig('defaultDocUpdateUrl') || 'frappe.client.set_value'
  let defaultDocDeleteUrl =
    getConfig('defaultDocDeleteUrl') || 'frappe.client.delete'
  let defaultRunDocMethodUrl =
    getConfig('defaultRunDocMethodUrl') || 'run_doc_method'

  let out = reactive({
    doctype: options.doctype,
    fields: options.fields,
    filters: options.filters,
    orderBy: options.orderBy,
    start: options.start || 0,
    pageLength: options.pageLength || 20,
    groupBy: options.groupBy,
    parent: options.parent,
    debug: options.debug || 0,
    originalData: null,
    dataMap: {},
    data: null,
    previous,
    hasPreviousPage: false,
    next,
    hasNextPage: true,
    auto: options.auto,
    list: createResource(
      {
        url: options.url || defaultListUrl,
        makeParams() {
          return {
            doctype: out.doctype,
            fields: out.fields,
            filters: out.filters,
            order_by: out.orderBy,
            start: out.start,
            limit: out.pageLength,
            limit_start: out.start,
            limit_page_length: out.pageLength,
            group_by: out.groupBy,
            parent: out.parent,
            debug: out.debug,
          }
        },
        onSuccess(data) {
          out.hasPreviousPage = !!out.start
          if (data.length < out.pageLength) {
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
        url: options.url || defaultListUrl,
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
        url: defaultDocInsertUrl,
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
        url: defaultDocUpdateUrl,
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
        url: defaultDocDeleteUrl,
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
        url: defaultRunDocMethodUrl,
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
          options.runDocMethod?.onSuccess?.call(vm, data)
        },
        onError: options.runDocMethod?.onError,
      },
      vm
    ),
    update,
    fetch,
    reload,
    setData,
    transform,
    getRow,
  })

  function update(updatedOptions) {
    Object.assign(out, updatedOptions)
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
    let _pageLength = out.pageLength
    if (out.start > 0) {
      out.start = 0
      out.pageLength = out.originalData.length
    }
    return out.list.fetch().finally(() => {
      out.start = _start
      out.pageLength = _pageLength
    })
  }

  function fetch() {
    reload()
  }

  function setData(data) {
    out.originalData = data
    if (typeof data === 'function') {
      data = data.call(vm, out.data)
    }
    out.data = transform(data)

    if (Array.isArray(out.data)) {
      out.dataMap = {}
      for (let row of out.data) {
        if (!row.name) continue
        let key = row.name.toString()
        out.dataMap[key] = row
      }
    }
  }

  function previous() {
    out.start = out.start - out.pageLength
    out.list.fetch()
  }

  function next() {
    out.start = out.start + out.pageLength
    out.list.fetch()
  }

  function getRow(name) {
    let key = name.toString()
    return out.dataMap[key]
  }

  if (options.realtime && vm?.$socket) {
    onDocUpdate(vm.$socket, out.doctype, (name) => {
      if (out.originalData?.find((d) => d.name === name)) {
        out.fetchOne.submit(name)
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
        options.onData?.call(vm, data)
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
          delete row._previousData
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
        (row) => row.name.toString() !== docname.toString()
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
