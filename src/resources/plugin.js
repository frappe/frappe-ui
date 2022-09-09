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
                resource.reload()
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
          if (resource && resource.auto) {
            resource.reload()
          }
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

function createResourceForOptions(options, vm, getResource) {
  if (options.type === 'document') {
    return createDocumentResource(options, vm, getResource)
  }
  if (options.type === 'list') {
    return createListResource(options, vm, getResource)
  }
  return createResource(options, vm, getResource)
}

export default {
  install(app, options) {
    let resourceMixin = createMixin(options)
    app.mixin(resourceMixin)
  },
}
