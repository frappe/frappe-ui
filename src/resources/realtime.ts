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

// Track subscriptions per socket instance. Keying by the Socket (via WeakMap)
// means a brand-new Socket (re-login, a second app on the same page) is never
// assumed to already be subscribed to a doctype it has never joined. The set
// holds the doctypes this socket has subscribed to, so they can be re-emitted
// after the underlying connection drops and reconnects.
const subscribed = new WeakMap<Socket, Set<string>>()

function subscribe(socket: Socket, doctype: string): void {
  let doctypes = subscribed.get(socket)
  if (!doctypes) {
    doctypes = new Set()
    subscribed.set(socket, doctypes)
    // Server-side rooms are per-socket and dropped on disconnect. Re-emit the
    // full subscription set whenever the socket (re)connects, so a reconnected
    // socket re-joins every room it had before. Listening on `connect` rather
    // than socket.io's `reconnect` also covers the initial connect, and any
    // subscribe() that ran while the socket was still connecting.
    const current = doctypes
    socket.on('connect', () => {
      for (const type of current) {
        socket.emit('doctype_subscribe', type)
      }
    })
  }
  if (doctypes.has(doctype)) return
  doctypes.add(doctype)
  socket.emit('doctype_subscribe', doctype)
}
