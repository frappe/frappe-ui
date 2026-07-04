import { io } from 'socket.io-client'

declare global {
  interface Window {
    site_name?: string
  }
}

export interface InitSocketOptions {
  port?: number
}

export default function initSocket(options: InitSocketOptions = {}) {
  let host = window.location.hostname
  let siteName = import.meta.env.DEV ? host : window.site_name
  let socketio_port = options.port || 9000
  let port = window.location.port ? `:${socketio_port}` : ''
  let protocol = port ? 'http' : 'https'
  let url = `${protocol}://${host}${port}/${siteName}`
  let socket = io(url, { withCredentials: true })
  return socket
}
