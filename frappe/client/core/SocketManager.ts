import type { DocStore } from './DocStore'

export interface SocketManager {
  connect(): void
  disconnect(): void
  /** Subscribe to a socket event. Returns an unsubscribe function. */
  on(event: string, handler: (...args: any[]) => void): () => void
}

/** No-op implementation for environments without Socket.IO. */
export function createNoopSocketManager(): SocketManager {
  return {
    connect() {},
    disconnect() {},
    on(_event, _handler) {
      return () => {}
    },
  }
}

/**
 * Creates a SocketManager that bridges Socket.IO events to the DocStore.
 *
 * `doc_update` payload: `{ docs: Doc[] }` — merged into DocStore.
 * `doc_rename` payload: `{ doctype, old_name, new_name, doc }` — old entry
 * removed, new entry added.
 */
export function createSocketManager(
  store: DocStore,
  socketIo: any,
): SocketManager {
  const handlers = new Map<string, Set<(...args: any[]) => void>>()

  function emit(event: string, ...args: any[]) {
    handlers.get(event)?.forEach((h) => h(...args))
  }

  socketIo.on('doc_update', (payload: { docs: any[] }) => {
    if (payload?.docs?.length) {
      store.setMany(payload.docs)
    }
    emit('doc_update', payload)
  })

  socketIo.on(
    'doc_rename',
    (payload: { doctype: string; old_name: string; doc: any }) => {
      if (payload?.doctype && payload?.old_name) {
        store.remove(payload.doctype, payload.old_name)
      }
      if (payload?.doc) {
        store.set(payload.doc)
      }
      emit('doc_rename', payload)
    },
  )

  return {
    connect() {
      socketIo.connect?.()
    },
    disconnect() {
      socketIo.disconnect?.()
    },
    on(event, handler) {
      let set = handlers.get(event)
      if (!set) {
        set = new Set()
        handlers.set(event, set)
      }
      set.add(handler)
      return () => {
        handlers.get(event)?.delete(handler)
      }
    },
  }
}
