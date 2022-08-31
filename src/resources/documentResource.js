import { reactive } from 'vue'
import { getCacheKey, createResource } from './resources'
import {
  updateRowInListResource,
  deleteRowInListResource,
  revertRowInListResource,
} from './listResource'

let documentCache = reactive({})

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
    auto: true,
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
          // delete from list resources
          deleteRowInListResource(out.doctype, out.name)
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

  // cache
  documentCache[cacheKey] = out
  return out
}

export function getCachedDocumentResource(doctype, name) {
  let cacheKey = getCacheKey([doctype, name])
  return documentCache[cacheKey] || null
}
