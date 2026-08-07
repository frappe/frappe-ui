import type { App } from 'vue'
import resourcesPlugin from '../resources/plugin'

export interface FrappeUIPluginOptions {
  /**
   * Install the v1 resources Options API plugin — the `resources` component
   * option, `this.$resources`, and the `$getResource` family of helpers.
   *
   * Off by default. Composition API code (`createResource`, `useList`, …)
   * needs nothing from this plugin, which is what almost every app writes now.
   *
   * A component that declares a `resources` option while this is off throws.
   * There is no useful way to run such a component, and letting it render with
   * `this.$resources` undefined fails much further downstream.
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

// Globals the plugin used to install and no longer does. Left alone, reading
// one yields `undefined` and the app crashes somewhere else entirely —
// `Cannot read properties of undefined (reading 'on')` inside a realtime
// handler, say. A throwing accessor moves the failure to the read and names
// the fix. Assigning still works, so an app can install its own.
const removedGlobals: Record<string, string> = {
  $socket:
    'The FrappeUI plugin used to open a socket.io connection and assign it here. ' +
    'It no longer does, and the "socketio" option is gone. ' +
    'Create your own connection and assign it: ' +
    "app.config.globalProperties.$socket = io(url, { withCredentials: true }).",
  $call:
    'The FrappeUI plugin used to assign the `call` helper here. It no longer does. ' +
    'Import it instead: import { call } from "frappe-ui".',
}

const RESOURCES_OFF_ADVICE =
  'The v1 resources Options API no longer installs by default. ' +
  'Fix: app.use(FrappeUI, { resources: true }). ' +
  'Or port the component to the Composition API (createResource, useList, …), ' +
  'which needs nothing from this plugin.'

function guardRemovedGlobal(app: App, key: string, advice: string) {
  const globals = app.config.globalProperties as Record<string, unknown>
  // An app that assigns its own before installing the plugin keeps it.
  if (Object.prototype.hasOwnProperty.call(globals, key)) return

  Object.defineProperty(globals, key, {
    configurable: true,
    // Non-enumerable so spreading or logging globalProperties does not trip
    // the getter and turn a debug session into a crash.
    enumerable: false,
    get() {
      throw new Error(`[frappe-ui] this.${key} is not set. ${advice}`)
    },
    set(value: unknown) {
      Object.defineProperty(globals, key, {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      })
    },
  })
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

    for (let key of Object.keys(removedGlobals)) {
      guardRemovedGlobal(app, key, removedGlobals[key]!)
    }

    if (options.resources) {
      app.use(resourcesPlugin, options.resources)
      return
    }

    // Two guards, because neither alone covers both ways this breaks.
    //
    // The mixin catches it earliest and names the component, but Vue routes
    // whatever a lifecycle hook throws through its own error handling — which
    // rethrows in dev and only logs in production. So also guard the read:
    // `this.$resources.todos` in a method or computed throws at the access,
    // straight into the app's own code, in every build.
    guardRemovedGlobal(app, '$resources', RESOURCES_OFF_ADVICE)

    app.mixin({
      created(this: any) {
        if (!this.$options.resources) return
        const name =
          this.$options.name || this.$.type?.__name || 'An anonymous component'
        throw new Error(
          `[frappe-ui] ${name} declares a "resources" component option, but the ` +
            'FrappeUI plugin was installed without it, so nothing reads that ' +
            `option and this.$resources does not exist. ${RESOURCES_OFF_ADVICE}`,
        )
      },
    })
  },
}
