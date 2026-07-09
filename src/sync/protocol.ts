/**
 * Wire-format types for the sync protocol (spec Part 3).
 * Kept transport-agnostic so the same connection logic can back a socket, HTTP,
 * or a mock in tests.
 */

import type { Doc } from './filters'
import type { Filters } from './filters'
import type { Mutation } from './queue'

export type Query =
  | { kind: 'list'; doctype: string; filters?: Filters; fields?: string[]; orderBy?: string; limit?: number }
  | { kind: 'doc'; doctype: string; name: string }
  | { kind: 'count'; doctype: string; filters?: Filters }
  | { kind: 'view'; view: string; filters?: Filters; orderBy?: string; limit?: number }

export type Change = {
  seq: number
  doctype: string
  name: string
  op: 'create' | 'update' | 'delete' | 'rename'
  newName?: string
}

export type PullRequest = {
  subs: Array<{ id: string; query: Query }>
  cursor?: number
}

export type PullResponse = {
  docs: Record<string, Doc[]> // sub-id → docs
  deletes: Record<string, string[]> // sub-id → deleted names
  renames: Record<string, Array<{ from: string; to: string }>>
  counts: Record<string, number>
  cursor: number
  resync?: true
}

export type PushResult =
  | { id: string; status: 'applied'; doc?: Doc }
  | { id: string; status: 'conflict'; doc?: Doc; error?: { code: string; message: string } }
  | { id: string; status: 'error'; error: { code: string; message: string } }

export type PushResponse = { results: PushResult[] }

// Client → server (socket)
export type ClientMsg =
  | { type: 'sync.sub'; id: string; query: Query }
  | { type: 'sync.unsub'; id: string }

// Server → client (socket)
export type ServerMsg = { type: 'sync.change'; change: Change }

export interface Transport {
  send(msg: ClientMsg): void
  onMessage(fn: (msg: ServerMsg) => void): () => void
  pull(req: PullRequest): Promise<PullResponse>
  push(mutations: Mutation[]): Promise<PushResponse>
  isOnline?(): boolean
  onOnlineChange?(fn: (online: boolean) => void): () => void
}
