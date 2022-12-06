import { watch } from 'vue'

export default {
  install(app) {
    app.mixin(createMixin())
  },
}

function createMixin() {
  let faviconRef = document.querySelector('link[rel="icon"]')
  let defaultFavIcon = faviconRef.href

  return {
    created() {
      if (this.$options.pageMeta) {
        watch(
          () => {
            try {
              return this.$options.pageMeta.call(this)
            } catch (error) {
              let debugInfo = `${this.$options.name} (${
                this.$options.__file || ''
              })`
              if (process.env.NODE_ENV === 'development') {
                console.warn('Failed to parse pageMeta in', debugInfo)
              }
              return null
            }
          },
          (pageMeta) => {
            if (!pageMeta) return
            if (pageMeta.title) {
              document.title = pageMeta.title
            }
            if (pageMeta.emoji) {
              let href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${pageMeta.emoji}</text></svg>`
              faviconRef.href = href
            } else if (pageMeta.icon) {
              faviconRef.href = pageMeta.icon
            } else {
              faviconRef.href = defaultFavIcon
            }
          },
          {
            immediate: true,
            deep: true,
          }
        )
      }
    },
  }
}
