import { io } from 'socket.io-client'

export default function initSocket(options = {}) {
  let host = window.location.hostname
  let socketio_port = options.port || 9000
  let port = window.location.port ? `:${socketio_port}` : ''
  let protocol = port ? 'http' : 'https'
  let url = `${protocol}://${host}${port}`
  let socket = io(url, { withCredentials: true })
  return socket
}
