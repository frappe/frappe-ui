import resourcesPlugin from '../resources/plugin'
import call from './call'
import initSocket from './socketio'
import { setConfig } from './config'

let defaultOptions = {
  resources: true,
  call: true,
  socketio: true,
}

export default {
  install(app, options = {}) {
    options = Object.assign({}, defaultOptions, options)

    // Declarative app-level config — the preferred way for apps to pass values
    // like resourceFetcher, endpoint overrides, maxFileSize, and timezones in
    // one place at app creation:
    //
    //   app.use(FrappeUI, { config: { maxFileSize: boot.max_file_size, ... } })
    //
    // `setConfig` remains available for values that arrive later (e.g. after a
    // login response). Null/undefined entries are skipped so callers can pass
    // possibly-unset values without clobbering defaults.
    if (options.config) {
      for (let key in options.config) {
        if (options.config[key] != null) {
          setConfig(key, options.config[key])
        }
      }
    }

    options.resources && app.use(resourcesPlugin, options.resources)

    if (options.call) {
      let callFunction = typeof options.call == 'function' ? options.call : call
      app.config.globalProperties.$call = callFunction
    }
    if (options.socketio) {
      app.config.globalProperties.$socket = initSocket(options.socketio)
    }
  },
}
