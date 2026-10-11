/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from 'vitest'
import { onDocUpdate } from './realtime'
import type { Socket } from 'socket.io-client'

// Minimal socket.io-client Socket stub. Like socket.io, it buffers emits while
// disconnected and sends them before firing `connect`.
type Handler = (...args: unknown[]) => void

function makeSocket() {
  const handlers: Record<string, Handler[]> = {}
  const buffer: unknown[][] = []
  const emits: unknown[][] = []
  const socket = {
    connected: false,
    emit: vi.fn((...args: unknown[]) => {
      ;(socket.connected ? emits : buffer).push(args)
    }),
    on: vi.fn((event: string, cb: Handler) => {
      ;(handlers[event] ||= []).push(cb)
    }),
    // test helpers
    _connect() {
      socket.connected = true
      emits.push(...buffer.splice(0))
      for (const cb of handlers['connect'] || []) cb()
    },
    _disconnect() {
      socket.connected = false
    },
    _emits: emits,
  }
  return socket as unknown as Socket & {
    _connect: () => void
    _disconnect: () => void
    _emits: unknown[][]
  }
}

function subscribes(socket: { _emits: unknown[][] }) {
  return socket._emits
    .filter(([ev]) => ev === 'doctype_subscribe')
    .map(([, doctype]) => doctype)
}

describe('onDocUpdate', () => {
  it('subscribes to a doctype once per socket', () => {
    const socket = makeSocket()
    socket._connect()
    const cb = vi.fn()
    onDocUpdate(socket, 'CRM Deal', cb)
    onDocUpdate(socket, 'CRM Deal', cb)

    expect(subscribes(socket)).toEqual(['CRM Deal'])
  })

  it('subscribes once on the first connect and again on every reconnect', () => {
    const socket = makeSocket()
    onDocUpdate(socket, 'CRM Deal', vi.fn())
    onDocUpdate(socket, 'ToDo', vi.fn())

    socket._connect()
    expect(subscribes(socket).sort()).toEqual(['CRM Deal', 'ToDo'])

    // socket.io drops server-side rooms on disconnect.
    socket._disconnect()
    onDocUpdate(socket, 'Note', vi.fn())
    socket._emits.length = 0
    socket._connect()
    expect(subscribes(socket).sort()).toEqual(['CRM Deal', 'Note', 'ToDo'])
  })

  it('does not re-subscribe a fresh socket to a doctype another socket joined', () => {
    const socketA = makeSocket()
    const socketB = makeSocket()
    socketA._connect()
    onDocUpdate(socketA, 'CRM Deal', vi.fn())

    // A brand-new socket (re-login, second app instance) must emit its own
    // subscribe even for the same doctype — it is a different server-side room.
    socketB._connect()
    onDocUpdate(socketB, 'CRM Deal', vi.fn())
    expect(subscribes(socketB)).toEqual(['CRM Deal'])
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
