import { watch, getCurrentInstance, onBeforeUnmount } from 'vue'

let faviconRef = null
let defaultFavIcon = null

function initializeFavicon() {
  if (typeof window !== 'undefined' && !faviconRef) {
    faviconRef = document.querySelector('link[rel="icon"]')
    defaultFavIcon = faviconRef?.href
  }
}

export function usePageMeta(fn) {
  // Initialize favicon if we're on the client
  if (typeof window !== 'undefined') {
    initializeFavicon()
  }

  const stopWatcher = watch(
    () => {
      try {
        return fn()
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to parse pageMeta in', fn)
          console.error(error)
        }
        return null
      }
    },
    (pageMeta) => {
      // Only execute on client side
      if (typeof window === 'undefined') return
      if (!pageMeta) return

      if (pageMeta.title) {
        document.title = pageMeta.title
      }

      // Ensure favicon ref is initialized
      if (!faviconRef) initializeFavicon()

      if (pageMeta.emoji) {
        let href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${pageMeta.emoji}</text></svg>`
        if (faviconRef) faviconRef.href = href
      } else if (pageMeta.icon) {
        if (faviconRef) faviconRef.href = pageMeta.icon
      } else {
        if (faviconRef && defaultFavIcon) faviconRef.href = defaultFavIcon
      }
    },
    {
      immediate: true,
      deep: true,
    },
  )

  // Auto-cleanup if called within a component (like <script setup>)
  const instance = getCurrentInstance()
  if (instance) {
    console.log('cleaning up usePageMeta', stopWatcher)
    onBeforeUnmount(stopWatcher)
  }

  return stopWatcher
}

export default {
  install(app) {
    app.mixin(createMixin())
  },
}

function createMixin() {
  return {
    mounted() {
      if (this.$options.pageMeta) {
        let fn = this.$options.pageMeta.bind(this)
        this._pageMetaStopWatcher = usePageMeta(fn)
      }
    },
    beforeUnmount() {
      if (this._pageMetaStopWatcher) {
        this._pageMetaStopWatcher()
        this._pageMetaStopWatcher = null
      }
    },
  }
}
