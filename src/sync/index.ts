/**
 * Public entry for the sync layer. Apps normally import `createClient` from here.
 * The v1 transport binding (HTTP + socket to a frappe site) is provided separately
 * so this module stays framework-agnostic.
 */

export { createClient } from './vue'
export type { Client, ClientOptions, ClientSync, Doctype } from './vue'
export type { Query, Change, Transport, PullRequest, PullResponse, PushResponse, PushResult } from './protocol'
export type { Doc, Filters, FilterValue, FilterOp } from './filters'
export type { Mutation, MutationOp, MutationError, Queue, QueueAdapter } from './queue'
export type { DocStore, StorageAdapter, StoreChange, FieldSet } from './store'
export type { Conflict } from './connection'
export { memoryAdapter } from './store'
export { memoryQueueAdapter } from './queue'
export { idbAdapter } from './idb-adapter'
export { applyQuery, matches } from './filters'
