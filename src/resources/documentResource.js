import { reactive } from 'vue'
import { getCacheKey, createResource } from './resources'
import {
  updateRowInListResource,
  deleteRowInListResource,
  revertRowInListResource,
} from './listResource'
import { getLocal, saveLocal } from './local'
import { onDocUpdate } from './realtime'

let documentCache = reactive({})

export function createDocumentResource(options, vm) {
  if (!(options.doctype && options.name)) return

  let cacheKey = getCacheKey([options.doctype, options.name])
  let cachedResource = documentCache[cacheKey]
  if (cachedResource) {
    if (cachedResource.auto) {
      cachedResource.reload()
    }
    return cachedResource
  }

  let setValueOptions = {
    url: 'frappe.client.set_value',
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

  const autoPropIsPassed = options.auto !== undefined

  let out = reactive({
    doctype: options.doctype,
    name: options.name,
    doc: null,
    auto: autoPropIsPassed ? options.auto : true,
    get: createResource(
      {
        url: 'frappe.client.get',
        makeParams() {
          return {
            doctype: out.doctype,
            name: out.name,
          }
        },
        onSuccess(data) {
          saveLocal(cacheKey, data)
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
        url: 'frappe.client.delete',
        makeParams() {
          return {
            doctype: out.doctype,
            name: out.name,
          }
        },
        onSuccess() {
          out.doc = null
          options.delete?.onSuccess?.call(vm)
          // delete from list resources
          deleteRowInListResource(out.doctype, out.name)
        },
        onError: options.delete?.onError,
      },
      vm
    ),
    reload,
    setDoc,
  })

  for (let methodKey in options.whitelistedMethods) {
    let methodOptions = options.whitelistedMethods[methodKey]
    if (typeof methodOptions == 'string') {
      methodOptions = {
        method: methodOptions,
      }
    }
    let { method, onSuccess, ...otherOptions } = methodOptions
    out[methodKey] = createResource(
      {
        url: 'run_doc_method',
        makeParams(values) {
          return {
            dt: out.doctype,
            dn: out.name,
            method: method,
            args: values,
          }
        },
        onSuccess(data) {
          if (data.docs) {
            for (let doc of data.docs) {
              if (
                doc.doctype === out.doctype &&
                doc.name.toString() === out.name.toString()
              ) {
                out.doc = transform(doc)
                // update data in list resources
                updateRowInListResource(out.doctype, out.doc)
                break
              }
            }
          }
          onSuccess?.call(vm, data.message)
        },
        ...otherOptions,
      },
      vm
    )
  }

  function reload() {
    return out.get.fetch()
  }

  function setDoc(doc) {
    if (typeof doc === 'function') {
      doc = doc.call(vm, out.doc)
    }
    out.doc = transform(doc)
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

  if (options.realtime && vm.$socket) {
    onDocUpdate(vm.$socket, out.doctype, (name) => {
      if (name == out.name) {
        out.get.fetch()
      }
    })
  }

  // cache
  documentCache[cacheKey] = out
  // offline
  getLocal(cacheKey).then((data) => {
    if ((out.get.loading || !out.get.fetched) && data) {
      out.doc = transform(data)
    }
  })

  if (out.auto) {
    out.get.fetch()
  }

  return out
}

export function getCachedDocumentResource(doctype, name) {
  let cacheKey = getCacheKey([doctype, name])
  return documentCache[cacheKey] || null
}
