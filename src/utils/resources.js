import call from './call'
import { onMounted, reactive, watchEffect } from 'vue'

let cached = {}

function createResource(options, vm) {
  if (options.cache && cached[options.cache]) {
    return cached[options.cache]
  }

  if (typeof options == 'string') {
    options = {
      method: options,
      auto: true,
    }
  }

  let out = reactive({
    data: options.initialData || null,
    loading: false,
    fetched: false,
    error: null,
    params: null,
    fetch,
    submit,
  })

  if (typeof options.params == 'function') {
    watchEffect(() => {
      out.params = options.params(vm)
      if (options.auto) {
        fetch()
      }
    })
  } else {
    out.params = options.params
  }

  onMounted(() => {
    if (options.auto) {
      fetch()
    }
  })

  async function fetch() {
    out.loading = true
    out.data = options.initialData || null
    try {
      let data = await call(options.method, out.params)
      out.data = data
      out.fetched = true
      if (options.onSuccess) {
        options.onSuccess.call(vm, data)
      }
    } catch (error) {
      out.error = error
      if (options.onError) {
        options.onError.call(vm, error)
      }
    }
    out.loading = false
  }

  function submit(params) {
    out.params = params
    return fetch()
  }

  if (options.cache && !cached[options.cache]) {
    cached[options.cache] = out
  }

  return out
}

let Resources = {
  created() {
    if (this.$options.resources) {
      this._resources = {}
      for (let key in this.$options.resources) {
        this._resources[key] = createResource(
          this.$options.resources[key],
          this
        )
      }
    }
  },
  methods: {
    $resource(key) {
      return this._resources[key]
    },
  },
  computed: {
    $resources() {
      return this._resources
    },
  },
}

export default {
  install(app, options) {
    app.mixin(Resources)
  },
}
