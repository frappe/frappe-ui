import { io } from 'socket.io-client'

// Injected by the frappeProxy Vite plugin from common_site_config.json.
// Falls back to 9000 if the plugin is not used (e.g. in tests).
declare const __FRAPPE_SOCKETIO_PORT__: number | undefined

/**
 * Creates a Socket.IO connection to the Frappe backend using the standard
 * Frappe socket URL convention:
 *   - Dev  (port in URL): http://{host}:{socketio_port}/{site_name}
 *   - Prod (no port):     https://{host}/{site_name}
 *
 * `socketio_port` is read from the `__FRAPPE_SOCKETIO_PORT__` constant
 * injected by the frappe-ui Vite plugin through `common_site_config.json`.
 */
export function initFrappeSocket() {
  const socketioPort =
    typeof __FRAPPE_SOCKETIO_PORT__ !== 'undefined'
      ? __FRAPPE_SOCKETIO_PORT__
      : 9000
  const host = window.location.hostname
  const siteName = (window as any).site_name
  const urlPort = window.location.port ? `:${socketioPort}` : ''
  const protocol = urlPort ? 'http' : 'https'
  const url = `${protocol}://${host}${urlPort}/${siteName}`
  return io(url, {
    withCredentials: true,
    reconnectionAttempts: 5,
  })
}
