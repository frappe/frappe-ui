import { call, debounce } from 'frappe-ui'
import { reactive, watch } from 'vue'

let cached = {}

function createResource(options, vm, getResource) {
  let cacheKey = null
  if (options.cache) {
    cacheKey = options.cache
    if (typeof cacheKey === 'string') {
      cacheKey = [cacheKey]
    }
    cacheKey = JSON.stringify(cacheKey)
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
    submit: fetchFunction,
    update,
  })

  async function fetch(params) {
    if (params instanceof Event) {
      params = null
    }
    out.params = params || options.params
    out.loading = true
    try {
      let data = await resourceFetcher(options.method, params || options.params)
      out.previousData = out.data || null
      out.data = data
      out.fetched = true
      if (options.onSuccess) {
        options.onSuccess.call(vm, data)
      }
    } catch (error) {
      console.error(error)
      out.error = error
      if (options.onError) {
        options.onError.call(vm, error)
      }
    }
    out.loading = false
  }

  function update({ method, params, auto }) {
    if (method && method !== options.method) {
      options.method = method
    }
    if (params && params !== options.params) {
      options.params = params
    }
    if (auto !== undefined && auto !== out.auto) {
      out.auto = auto
    }
  }

  if (cacheKey && !cached[cacheKey]) {
    cached[cacheKey] = out
  }

  return out
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
                resource = createResource(
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
          let resource = createResource(options, this, mixinOptions.getResource)
          this._resources[key] = resource
          if (resource.auto) {
            resource.fetch()
          }
        }
      }
    }
  },
  methods: {
    $refetchResource(cacheKey) {
      let key = JSON.stringify(cacheKey)
      if (cached[key]) {
        let resource = cached[key]
        resource.fetch()
      }
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
