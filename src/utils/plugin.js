import resources from './resources'
import call from './call'
import socket from './socketio'

let defaultOptions = {
  resources: true,
  call: true,
  socketio: true,
}

export default {
  install(app, options = {}) {
    options = Object.assign({}, defaultOptions, options)
    options.resources && app.use(resources)

    if (options.call) {
      app.config.globalProperties.$call = call
    }
    if (options.socketio) {
      app.config.globalProperties.$socket = socket
    }
  },
}
