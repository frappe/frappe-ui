import type { App } from 'vue'

declare const resourcesPlugin: {
  install(app: App, options?: any): void
}

export default resourcesPlugin
