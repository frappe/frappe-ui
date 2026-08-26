/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from 'vitest'
import { onDocUpdate } from './realtime'
import type { Socket } from 'socket.io-client'

// Minimal socket.io-client Socket stub that captures emitted events and lets
// tests fire `connect` manually, as socket.io does on (re)connect.
function makeSocket() {
  const handlers: Record<string, Array<(...args: any[]) => void>> = {}
  const emits: Array<[string, ...any[]]> = []
  const socket = {
    emit: vi.fn((event: string, ...args: any[]) => {
      emits.push([event, ...args])
    }),
    on: vi.fn((event: string, cb: (...args: any[]) => void) => {
      ;(handlers[event] ||= []).push(cb)
    }),
    // test helper: fire a connect event
    _connect() {
      for (const cb of handlers['connect'] || []) cb()
    },
    _emits: emits,
  }
  return socket as unknown as Socket & {
    _connect: () => void
    _emits: Array<[string, ...any[]]>
  }
}

describe('onDocUpdate', () => {
  it('subscribes to a doctype once per socket', () => {
    const socket = makeSocket()
    const cb = vi.fn()
    onDocUpdate(socket, 'CRM Deal', cb)
    onDocUpdate(socket, 'CRM Deal', cb)

    const subscribeEmits = socket._emits.filter(
      ([ev]) => ev === 'doctype_subscribe',
    )
    expect(subscribeEmits).toHaveLength(1)
    expect(subscribeEmits[0]).toEqual(['doctype_subscribe', 'CRM Deal'])
  })

  it('re-emits the full subscription set on reconnect', () => {
    const socket = makeSocket()
    const cb = vi.fn()
    onDocUpdate(socket, 'CRM Deal', cb)
    onDocUpdate(socket, 'ToDo', cb)

    // Before reconnect: two distinct doctypes emitted once each.
    expect(
      socket._emits.filter(([ev]) => ev === 'doctype_subscribe'),
    ).toHaveLength(2)

    // Drop the "connection" and reconnect — socket.io drops server-side rooms.
    socket._emits.length = 0
    socket._connect()

    const reEmits = socket._emits.filter(([ev]) => ev === 'doctype_subscribe')
    expect(reEmits).toHaveLength(2)
    expect(reEmits.map(([, dt]) => dt).sort()).toEqual(['CRM Deal', 'ToDo'])
  })

  it('does not re-subscribe a fresh socket to a doctype another socket joined', () => {
    const socketA = makeSocket()
    const socketB = makeSocket()
    onDocUpdate(socketA, 'CRM Deal', vi.fn())

    // A brand-new socket (re-login, second app instance) must emit its own
    // subscribe even for the same doctype — it is a different server-side room.
    onDocUpdate(socketB, 'CRM Deal', vi.fn())
    expect(
      socketB._emits.filter(([ev]) => ev === 'doctype_subscribe'),
    ).toHaveLength(1)
  })

  it('fires the callback only for the matching doctype', () => {
    const socket = makeSocket()
    const cb = vi.fn()
    onDocUpdate(socket, 'CRM Deal', cb)
    onDocUpdate(socket, 'ToDo', vi.fn())

    // Reach into the list_update handler registered by onDocUpdate
    const handlers = (socket.on as ReturnType<typeof vi.fn>).mock.calls
    const updateHandler = handlers.find(
      ([ev]) => ev === 'list_update',
    )![1] as any
    updateHandler({ doctype: 'CRM Deal', name: 'DEAL-0002' })
    expect(cb).toHaveBeenCalledWith('DEAL-0002')
  })
})
