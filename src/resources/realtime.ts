import { Socket } from 'socket.io-client'

/**
 * Read `$socket` off a component instance, treating "not set" as "no socket".
 *
 * The FrappeUI plugin installs a throwing accessor for `$socket` so an app that
 * reads it gets a message naming the fix instead of an undefined-property crash
 * later. These call sites are the exception: `realtime: true` without a socket
 * has always degraded to a non-realtime resource, and that stays true.
 */
export function readSocket(vm: any): Socket | undefined {
  try {
    return vm?.$socket
  } catch {
    return undefined
  }
}

export function onDocUpdate(
  socket: Socket,
  doctype: string,
  callback: (name: string) => void,
): void {
  subscribe(socket, doctype)
  socket.on('list_update', (data) => {
    if (data.doctype == doctype) {
      callback(data.name)
    }
  })
}

let subscribed: Record<string, boolean> = {}
function subscribe(socket: Socket, doctype: string): void {
  if (subscribed[doctype]) return
  socket.emit('doctype_subscribe', doctype)
  subscribed[doctype] = true
}
