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

// Doctypes subscribed per socket, so each new Socket subscribes on its own and
// a closed one can be garbage collected.
const subscribed = new WeakMap<Socket, Set<string>>()

function subscribe(socket: Socket, doctype: string): void {
  const doctypes = subscribed.get(socket) ?? new Set<string>()
  if (!subscribed.has(socket)) {
    subscribed.set(socket, doctypes)
    // Server-side rooms are per-socket and dropped on disconnect. This handler
    // subscribes to every doctype on the first connect and on each reconnect.
    socket.on('connect', () => {
      for (const type of doctypes) {
        socket.emit('doctype_subscribe', type)
      }
    })
  }
  if (doctypes.has(doctype)) return
  doctypes.add(doctype)
  // socket.io buffers emits while disconnected and flushes them before
  // `connect`, so emit directly only on a connected socket.
  if (socket.connected) socket.emit('doctype_subscribe', doctype)
}
