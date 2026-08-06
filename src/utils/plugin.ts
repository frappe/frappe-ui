import type { App } from 'vue'
import resourcesPlugin from '../resources/plugin'

export interface FrappeUIPluginOptions {
  /**
   * Install the v1 resources Options API plugin — the `resources` component
   * option, `this.$resources`, and the `$getResource` family of helpers.
   *
   * Off by default. Composition API code (`createResource`, `useList`, …)
   * needs nothing from this plugin, which is what almost every app writes now.
   */
  resources?: boolean | Record<string, any>
}

const knownOptions = ['resources'] as const

// Options this plugin used to accept. Dropping them is silent — an app keeps
// passing `config: { … }` and simply stops getting its config applied — so say
// so at install time rather than letting the values evaporate.
const removedOptions: Record<string, string> = {
  config:
    'Call setConfig(key, value) for each entry instead — it is the only entry point now.',
  call: 'The $call global is gone. Import { call } from "frappe-ui" where you need it.',
  socketio:
    'initSocket is gone. Create your own socket.io connection and provide it however your app prefers.',
}

export default {
  install(app: App, options: FrappeUIPluginOptions = {}) {
    if (import.meta.env.DEV) {
      for (let key of Object.keys(options)) {
        if ((knownOptions as readonly string[]).includes(key)) continue
        const advice = removedOptions[key]
        console.warn(
          advice
            ? `[frappe-ui] app.use(FrappeUI) no longer accepts the "${key}" option, and it is being ignored. ${advice}`
            : `[frappe-ui] app.use(FrappeUI) does not accept the "${key}" option, and it is being ignored. It accepts: ${knownOptions.join(', ')}.`,
        )
      }
    }

    if (options.resources) {
      app.use(resourcesPlugin, options.resources)
    }
  },
}
