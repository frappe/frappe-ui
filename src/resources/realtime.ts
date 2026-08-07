// `import type`, not a value import used only in type position: this is the
// last mention of `socket.io-client` at root, and ADR-0010 leans on it being
// erased. Elision by the bundler is an implementation detail; this is a
// guarantee.
import type { Socket } from 'socket.io-client'

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
