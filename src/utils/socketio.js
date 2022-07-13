import { io } from 'socket.io-client'

function initSocket() {
  let host = window.location.hostname
  let port = window.location.port ? ':9000' : ''
  let protocol = port ? 'http' : 'https'
  let url = `${protocol}://${host}${port}`
  return io(url)
}

let socket = initSocket()

export default socket
