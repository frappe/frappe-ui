/**
 * HTTP transport — talks to `sync.pull` / `sync.push` on a Frappe bench site.
 *
 * v1 binding: the socket carries subscriptions and change notifications; snapshots
 * and mutations go over HTTP. This module implements only the HTTP half; the socket
 * side is a separate binding (or a no-op stub, when only HTTP pull is available).
 *
 * Auth: relies on the browser's session cookies for a same-origin site, or a
 * caller-provided `fetch` (e.g. node fetch with a Cookie header) for tests.
 */

import type {
  ClientMsg,
  PullRequest,
  PullResponse,
  PushResponse,
  ServerMsg,
  Transport,
} from './protocol'
import type { Mutation } from './queue'

export type HttpTransportOptions = {
  url: string // e.g. 'http://test.localhost:8000'
  fetch?: typeof fetch
  headers?: Record<string, string>
  csrfToken?: string
  onChange?: (fn: (msg: ServerMsg) => void) => () => void
  onOnlineChange?: (fn: (online: boolean) => void) => () => void
  isOnline?: () => boolean
}

export function createHttpTransport(opts: HttpTransportOptions): Transport {
  const fetchFn = opts.fetch ?? fetch
  const changeListeners = new Set<(msg: ServerMsg) => void>()

  async function callMethod<T>(method: string, body: any): Promise<T> {
    const url = `${opts.url.replace(/\/$/, '')}/api/method/${method}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Frappe-CSRF-Token': opts.csrfToken ?? 'None',
      ...(opts.headers ?? {}),
    }
    const res = await fetchFn(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include' as RequestCredentials,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`${method} → ${res.status}: ${text.slice(0, 200)}`)
    }
    const json = (await res.json()) as { message: T }
    return json.message
  }

  const external =
    opts.onChange?.((msg) => {
      for (const l of changeListeners) l(msg)
    })

  return {
    send(_msg: ClientMsg) {
      // No-op: real socket binding delivers sync.sub / sync.unsub. For an
      // HTTP-only setup, subscriptions are implicit — pull is driven by the
      // client from `sub` state and notifications come from onChange().
    },
    onMessage(fn) {
      changeListeners.add(fn)
      return () => {
        changeListeners.delete(fn)
        external?.()
      }
    },
    async pull(req: PullRequest) {
      return callMethod<PullResponse>('frappe.sync.api.pull', {
        subs: req.subs,
        cursor: req.cursor ?? null,
      })
    },
    async push(mutations: Mutation[]) {
      return callMethod<PushResponse>('frappe.sync.api.push', { mutations })
    },
    isOnline: opts.isOnline,
    onOnlineChange: opts.onOnlineChange,
  }
}
