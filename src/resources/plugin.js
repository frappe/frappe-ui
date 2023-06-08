import { reactive, watch } from 'vue'
import { createResource, getCachedResource } from './resources'
import {
  createDocumentResource,
  getCachedDocumentResource,
} from './documentResource'
import { createListResource, getCachedListResource } from './listResource'

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
            (options, oldOptions) => {
              if (!options) {
                return
              }

              let changed =
                !oldOptions ||
                JSON.stringify(options) !== JSON.stringify(oldOptions)

              if (!changed) return
              this._resources[key] = createResourceForOptions(options, this)
            },
            {
              immediate: true,
            }
          )
        } else {
          let resource = createResourceForOptions(options, this)
          this._resources[key] = resource
        }
      }
    }
  },
  methods: {
    $getResource(cacheKey) {
      return getCachedResource(cacheKey)
    },
    $getDocumentResource(doctype, name) {
      return getCachedDocumentResource(doctype, name)
    },
    $getDoc(doctype, name) {
      let resource = this.$getDocumentResource(doctype, name)
      return resource ? resource.doc : null
    },
    $getListResource(cacheKey) {
      return getCachedListResource(cacheKey)
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

function createResourceForOptions(options, vm) {
  if (options.type === 'document') {
    return createDocumentResource(options, vm)
  }
  if (options.type === 'list') {
    return createListResource(options, vm)
  }
  return createResource(options, vm)
}

export default {
  install(app, options) {
    let resourceMixin = createMixin(options)
    app.mixin(resourceMixin)
  },
}
