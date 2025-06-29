import {
  watch,
  getCurrentInstance,
  onBeforeUnmount,
  type App,
  type WatchStopHandle,
} from 'vue'

interface PageMeta {
  title?: string
  emoji?: string
  icon?: string
}

type PageMetaFunction = () => PageMeta | null | undefined
type StopWatcherFunction = () => void

let faviconRef: HTMLLinkElement | null = null
let defaultFavIcon: string | null = null

function initializeFavicon(): void {
  if (typeof window !== 'undefined' && !faviconRef) {
    faviconRef = document.querySelector('link[rel="icon"]')
    defaultFavIcon = faviconRef?.href || null
  }
}

export function usePageMeta(fn: PageMetaFunction): StopWatcherFunction {
  // Initialize favicon if we're on the client
  if (typeof window !== 'undefined') {
    initializeFavicon()
  }

  const stopWatcher: WatchStopHandle = watch(
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
    (pageMeta: PageMeta | null | undefined) => {
      // Only execute on client side
      if (typeof window === 'undefined') return
      if (!pageMeta) return

      if (pageMeta.title) {
        document.title = pageMeta.title
      }

      // Ensure favicon ref is initialized
      if (!faviconRef) initializeFavicon()

      if (pageMeta.emoji) {
        const href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${pageMeta.emoji}</text></svg>`
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
    onBeforeUnmount(stopWatcher)
  }

  return stopWatcher
}

interface PageMetaPlugin {
  install(app: App): void
}

export default {
  install(app: App): void {
    app.mixin(createMixin())
  },
} as PageMetaPlugin

interface ComponentWithPageMeta {
  $options: {
    pageMeta?: PageMetaFunction
  }
  _pageMetaStopWatcher?: StopWatcherFunction
}

function createMixin() {
  return {
    mounted(this: ComponentWithPageMeta): void {
      if (this.$options.pageMeta) {
        const fn = this.$options.pageMeta.bind(this)
        this._pageMetaStopWatcher = usePageMeta(fn)
      }
    },
    beforeUnmount(this: ComponentWithPageMeta): void {
      if (this._pageMetaStopWatcher) {
        this._pageMetaStopWatcher()
        this._pageMetaStopWatcher = undefined
      }
    },
  }
}
