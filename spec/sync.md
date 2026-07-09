# Frappe Sync — a local-first data layer for Frappe apps

Status: **draft for discussion** · Supersedes: resources (v1), data-fetching (v2), frappe/client PR #610 (v3)

## Why another iteration

v1–v3 all model *requests*. Every handle carries `loading`/`error`/`reload`, every mutation
is an operation object, and optimistic updates, realtime, and caching each show up as extra
API surface (`callOptimistic`, `onUpdate`, cache adapters). The surface grows multiplicatively.

This design changes the unit of abstraction from **request** to **replica**: the client owns a
local, persisted subset of the site's data, kept live by the server. Then:

- Reads are queries against local data — instant, offline-capable, always live.
- Writes apply locally first, always — "optimistic" stops being a mode.
- Realtime stops being an API — it is how the replica behaves.
- `reload()` and cache keys disappear — the server pushes; there is nothing to invalidate.

The public API gets smaller *because* the machinery underneath does more.

## Goals

1. The best-feeling data API of any Frappe frontend, and competitive with anything outside Frappe.
2. Offline-first: reads and writes work without a connection and converge on reconnect.
3. Push-based: no polling, no stale-tab hacks, no manual invalidation.
4. Full permission fidelity: the server re-evaluates everything; the client is never trusted.
5. Typed end-to-end via codegen from DocType metadata.

## Non-goals

- CRDT / multiplayer text editing (child tables and controller hooks make server-authoritative
  the right model; last-writer-wins per doc, conflicts surfaced).
- Syncing entire doctypes to the client. The replica holds only what queries subscribe to.
- Replacing whitelisted methods, reports, and aggregates — they keep an escape hatch.

---

# Part 1 — The public API

Everything in this part is the whole surface an app developer touches. If a concept is not
here, it is not public.

## Setup — once per app

```ts
// src/client.ts
import { createClient } from 'frappe-ui/sync'

export const client = createClient({
  name: 'gameplan', // IndexedDB database name
})
```

Offline persistence and realtime are on by default — turning them off is the option, not
turning them on. Other options (all optional): `url`, `offline: false`, `onError`.

## Doctypes — generated, typed

A bench command generates one module from DocType metadata (types, doc methods). You never
write this by hand:

```ts
// src/doctypes.ts — generated
import { client } from './client'
import type { GPDiscussion, GPTask } from './types'

export const Discussion = client.doctype<GPDiscussion>('GP Discussion', {
  methods: { trackVisit: 'track_visit', moveToProject: 'move_to_project' },
})
export const Task = client.doctype<GPTask>('GP Task', {
  methods: { markDone: 'mark_done' },
})
```

## Reading

One primitive: a live query. It is always cached, always offline-persisted, always updated by
local writes and server pushes. There is no `reload()`, no cache key, no realtime opt-in.

```ts
const tasks = Task.list({
  filters: { status: 'Open', assigned_to: () => user.value }, // refs/getters are reactive
  orderBy: 'modified desc',
  limit: 50,
})

tasks.docs      // GPTask[] — reactive, live
tasks.loading   // boolean — true only while the local store has nothing for this query yet
tasks.hasMore
tasks.loadMore()
```

```ts
const task = Task.get(() => route.params.id)

task.doc        // GPTask | null — reactive, live, includes child tables
task.loading
```

```ts
const openCount = Task.count({ filters: { status: 'Open' } })

openCount.value // number | null — reactive, live
```

Notes on feel:

- Results are named for what they are: `docs`, `doc`, `value` — not a generic `data`.
- Handles deliberately avoid a `status` property — `status` and `docstatus` are loaded terms
  in Frappe doctypes, and `task.status` vs `task.doc.status` would invite confusion.
- `loading` is almost always `false` on revisit: the store hydrates from IndexedDB before the
  network is touched. Loading states become a first-visit concern, not an every-render concern.
- Identical queries in different components share one subscription and one store entry.
- Handles created inside `setup()` are released on unmount; module-level handles live for the
  app's lifetime (deliberate, for app-level data like the session user).

## Writing

Writes are top-level functions. They apply to the local store synchronously — every open query
updates in the same tick — and return a promise that resolves when the server confirms.

```ts
Task.insert({ title: 'New task', project })     // → Promise<GPTask>
Task.setValue(name, { status: 'Done' })         // → Promise<void>
Task.delete(name)                               // → Promise<void>
```

There is no `.call()` vs `.callOptimistic()`. Await the promise if you need confirmation or
the server-assigned name; don't if you don't:

```ts
// fire-and-forget in a template
<Checkbox @change="Task.setValue(task.name, { status: 'Done' })" />

// need the real name (e.g. to navigate)
const doc = await Task.insert({ title })
router.push({ name: 'Task', params: { id: doc.name } })
```

Until the server acks an insert, the doc exists locally under a temporary name and appears in
matching lists. Awaiting `insert` is the rule when the real name matters (routing, sharing).

### Doc methods

Generated from the controller, callable at the doctype level or on a doc handle:

```ts
Discussion.trackVisit(name)
Discussion.moveToProject(name, { project: 'PROJ-001' })

const discussion = Discussion.get(name)
discussion.trackVisit() // bound sugar — same thing
```

Doc methods run through the same ordered mutation queue as writes, so an offline sequence like
*setValue → markDone → setValue* replays on the server in order. Their effects are not locally
predictable, so nothing changes optimistically; the server ack returns the updated doc and the
store converges.

## Forms and drafts

Synced docs are read-only. Editing goes through an explicit draft — a local, mutable copy that
is `v-model`-friendly:

```ts
// new document
const draft = Task.draft({ project: props.projectId })
draft.doc.title = '...'
await draft.insert()

// edit existing
const edit = task.edit()
edit.doc.title = '...'
edit.isDirty     // boolean
await edit.save() // sends only the diff, as a setValue
edit.reset()
```

This keeps two-way binding out of the synced store (no accidental writes from a stray
`v-model`) while staying close to the Desk form mental model.

## Server views — enriched queries

Real list views are often not plain doctype queries. Gameplan's feed endpoint
(`get_discussions`) joins in `project_title`, `unread`, `last_comment_content`. These become
**views**: server-defined queries that declare which doctypes they depend on.

```py
# gameplan/sync.py
from frappe.sync import view

@view("gameplan.discussion_feed", depends_on=["GP Discussion", "GP Comment", "GP Poll Vote"])
def discussion_feed(filters=None, order_by=None, start=0, limit=20):
    # any query you can write — joins, subqueries, computed fields.
    # must return rows with a `name` key.
    ...
```

```ts
// generated
export const DiscussionFeed = client.view<DiscussionFeedRow>('gameplan.discussion_feed')

// used exactly like a list
const feed = DiscussionFeed.list({ filters: { project: () => props.spaceId }, limit: 50 })
feed.docs
```

Views are always evaluated on the server (they are not incrementally maintained). They stay
live because any change to a `depends_on` doctype notifies subscribers, and the client re-pulls
(debounced). Results are cached in the store, so revisits and offline reads work the same as
plain lists.

## Sync state — one global object

Per-handle `error` mostly disappears. The app observes sync health in one place:

```ts
client.sync.online     // Ref<boolean>
client.sync.pending    // Ref<number> — mutations waiting for server ack
client.sync.conflicts  // Ref<Conflict[]>
client.sync.error      // Ref<SyncError | null>
```

Enough to build the standard affordances: an offline badge, an "n unsaved changes" indicator, a
conflict toast. First-load failures still surface on the handle (`loading` + a handle-level
`error`) since that is where the developer can render them.

## Escape hatch

```ts
const result = await client.call('gameplan.api.get_onboarding_status')
```

A plain typed promise. No caching, no reactivity — if you want a cached, live, offline-capable
read, that is a view. The escape hatch stays small on purpose.

## Before / after — real Gameplan code

Today (`frontend/src/data/discussions.ts`, condensed):

```ts
export function useDiscussions(options: UseDiscussionOptions) {
  let lastLoadedAt = Date.now()
  const discussions = useList<Discussion>({
    url: '/api/v2/method/gameplan...api.get_discussions',
    doctype: 'GP Discussion',
    cacheKey: options.cacheKey ? ['Discussions', options.cacheKey] : undefined,
    filters: options.filters,
    limit: options.limit || 50,
    onSuccess() { lastLoadedAt = Date.now() },
  })
  // reload stale feed when the tab becomes visible again
  const visibility = useDocumentVisibility()
  watch(visibility, (state) => {
    if (state !== 'visible') return
    if (discussions.loading || !discussions.data) return
    if (Date.now() - lastLoadedAt < STALE_RELOAD_THRESHOLD) return
    discussions.reload()
  })
  return discussions
}

let discussionsCache: Record<string, ReturnType<typeof useDoc>> = {}
```

After:

```ts
const feed = DiscussionFeed.list({
  filters: { project: () => props.spaceId },
  limit: 50,
})
```

The visibility watcher is gone (the replica catches up via its cursor whenever the connection
resumes — a background tab is just a client that reconnects). The cache key is gone (the store
is the cache). The module-level doc cache is gone (the store is normalized). The custom URL is
gone (the enrichment is a declared view).

---

# Part 2 — The mental model

```
 local view  =  server snapshot  +  pending mutations, folded on top
```

- **Server snapshot**: normalized store, `(doctype, name) → doc`, persisted in IndexedDB.
  Only ever written by server-confirmed data.
- **Pending mutations**: an ordered, IndexedDB-persisted queue of `{id, op, ...}` records.
  The view layer folds them over the snapshot to produce what queries see.

This is **rebase, not rollback**. When the server confirms a mutation, it leaves the queue and
its authoritative result lands in the snapshot — the view recomputes and converges. When the
server rejects one, it leaves the queue and the view simply reverts — there is no inverse-
operation bookkeeping, and interleaved mutations cannot corrupt state. Offline replay, optimism,
and conflict recovery are one code path.

**Local queries**: plain `list`/`get`/`count` are evaluated client-side by a small engine that
implements Frappe's filter operators (`=`, `!=`, `in`, `like`, `>`, `between`, …) plus
`order_by`/`limit` over the store. This is what makes reads instant and offline. Local
evaluation is UX-only — the server independently evaluates every subscription with full
permissions, and server results overwrite local guesses.

**Multi-tab**: the store and queue live in IndexedDB, shared across tabs. One tab holds the
socket and drains the mutation queue (leader election via Web Locks); others observe through
BroadcastChannel. App code is unaware of this.

---

# Part 3 — The protocol

Transport-agnostic messages. v1 binding: the socket carries the session, subscriptions, and
change notifications; snapshots and mutations go over HTTP to normal web workers (pooling,
scaling, middleware for free). Moving mutations onto the socket later is a binding change, not
an API change.

## Types

```ts
type Query =
  | { kind: 'list'; doctype: string; filters?: Filters; fields?: string[]
      orderBy?: string; limit?: number }
  | { kind: 'doc'; doctype: string; name: string }
  | { kind: 'count'; doctype: string; filters?: Filters }
  | { kind: 'view'; view: string; filters?: Filters; orderBy?: string; limit?: number }

type Mutation = {
  id: string                  // client-generated uuid — idempotency key
  op: 'insert' | 'set_value' | 'delete' | 'rename' | 'run_doc_method'
  doctype: string
  name?: string               // absent for insert
  values?: Record<string, any>
  method?: string; args?: any // run_doc_method only
  base?: string               // doc.modified the client applied against
}

type Change = { seq: number; doctype: string; name: string
                op: 'create' | 'update' | 'delete' | 'rename'; newName?: string }
```

## Messages

Client → server (socket):

- `sync.sub { id, query }` — subscribe; server permission-checks and joins notify rooms.
- `sync.unsub { id }`

Server → client (socket):

- `sync.change (Change)` — **notify-then-fetch**: only `{seq, doctype, name, op}` is pushed,
  never field data. Clients that care pull the docs through the permission-checked path, so
  field-level permissions (permlevel) can never leak via push. Cost: an existence signal to
  doctype subscribers — the same exposure as core's `list_update` event today. Per-user
  server-side subscription evaluation can be added later for sensitive doctypes.

Client → server (HTTP, web workers):

- `sync.pull { subs: Query[], cursor?: number }` →
  `{ docs, deletes, renames, counts, cursor, resync?: true }`
  One operation serves initial snapshot (no cursor), reconnect catch-up, and change-triggered
  refresh. If the cursor predates the retained log, the server answers `resync: true` and the
  client rebuilds its snapshot from a fresh pull.
- `sync.push { mutations: Mutation[] }` →
  `{ results: Array<{ id, status: 'applied' | 'conflict' | 'error', doc?, error? }> }`
  Applied **in order**; processing stops at the first failure so later mutations never run on
  top of a rejected one (they are returned as errors and dropped client-side, surfaced via
  `client.sync.conflicts`). Mutation ids already applied are acked without re-running —
  replaying a queue after a dropped response is safe.

## Mutation lifecycle

```
draft ──insert/setValue──▶ pending (IDB) ──leader drains──▶ inflight ──▶ applied → snapshot
                                                              │
                                                              ├──▶ conflict (base mismatch)
                                                              └──▶ error (validation, perms)
```

Conflict default: server wins. The rejected mutation is dropped, the latest server doc lands in
the snapshot, and a `Conflict` record (with the local values) is emitted so the app can offer
"reapply your change". No silent data loss, no automatic merges in v1.

---

# Part 4 — Server pieces (`frappe.sync`, PR to frappe/frappe)

**Sync Log doctype.** The backbone of cursors is a regular doctype — **Sync Log** — with
`naming_rule: Autoincrement`, so `name` is a monotonically increasing BIGINT that serves
directly as the cursor. Fields:

| Field          | Type | Notes                                  |
| -------------- | ---- | -------------------------------------- |
| `ref_doctype`  | Link | indexed together with `name`           |
| `ref_name`     | Data | document name                          |
| `op`           | Select | create / update / delete / rename    |
| `new_name`     | Data | rename only                            |

Being a doctype keeps it inspectable with standard tooling (list view, report, permissions).
Rows are written with a direct `frappe.qb` insert on the same code path where
`Document.notify_update()` fires today (after commit) — not via `frappe.get_doc(...).insert()`,
which would be too heavy for a row per save. Doctypes opt in via `sync_doctypes` in hooks.py.
A scheduled job prunes rows older than N days; a cursor older than the retained window
triggers `resync`.

**Endpoints.** `sync.pull` / `sync.push` as whitelisted methods running in web workers with the
full permission machinery — `pull` uses the same query path as `get_list` (row + field
permissions), `push` calls real `doc.insert()` / `doc.save()` / controller methods, so every
hook, validation, and notification behaves exactly as it does today. Applied mutation ids are
recorded (keyed by user) for idempotent replay.

**Socket handlers.** Registered via the new Python realtime server's registry:

```py
# frappe/sync/realtime.py
@realtime.on("sync.sub")
def sync_sub(socket, sub_id, query):
    if socket.has_permission(query["doctype"]):
        socket.join(f"sync:{query['doctype']}")
```

Change fan-out is `publish_to_room(f"sync:{doctype}", "sync.change", change)` from the web
process — no Frappe context needed in the realtime process for the hot path.

**Views registry.** `@frappe.sync.view(name, depends_on=[...])` — a whitelisted query function
with declared dependencies; `depends_on` doctypes are auto-added to `sync_doctypes`.

---

# Part 5 — Hard edges (known, not hand-waved)

- **Partial vs full docs.** A list subscribes to 5 fields; a doc view holds all fields + child
  tables. The store tracks which field set each entry holds and merges upward — a partial
  result must never clobber a fuller doc. Solved once, in the store, with tests.
- **Temp names.** Inserts get `local:<uuid>` names until acked; the ack renames the store entry
  and notifies open queries. Rule of thumb in app code: `await insert` when the name escapes
  the UI (routing, links).
- **Deletes/renames while offline** ride the sync log (`op` column), so pull can reconcile them.
- **Auth expiry.** A 401 on pull/push parks the queue (nothing is dropped) and surfaces
  `client.sync.error = 'auth'`; the app decides how to re-login.
- **Views are re-run, not diffed.** A hot doctype with many view subscribers means repeated
  query evaluation server-side. Debounce + doctype-level notify keeps it bounded; incremental
  maintenance is explicitly out of scope for v1.
- **Pagination windows.** `loadMore()` grows the subscribed window (`limit` increases, offset
  stays 0), so a feed is one subscription, not N pages that can shear against live inserts.

# Part 6 — Rollout

1. **This spec** — iterate until the API feels right (this document's Part 1 is the contract).
2. **frappe PR**: `frappe.sync` module — log, pull/push, socket handlers, views registry.
3. **frappe-ui**: framework-agnostic core (store, query engine, queue — pure logic, heavily
   unit-tested) + thin Vue adapter + doctype codegen.
4. **Dogfood in Gameplan**: discussion feed + discussion page first — they exercise views,
   optimistic posting, live updates, and offline reading in one flow.
5. Later: WS-RPC mutations, per-user subscription evaluation, field-level conflict merge,
   svelte/react adapters over the same core.

# Decisions log

- **`setValue`** for the field-patch write — Frappe vocabulary wins.
- **`docs` / `doc` / `value`** for read results; `value` on count is deliberately close to Vue
  ref semantics. No generic `.data`.
- **No `status` on handles** — avoids collision with `status` fields and `docstatus`.
  Handles expose `loading: boolean` instead.
- **Sync Log is a doctype** (autoincrement naming → `name` is the cursor), written via direct
  `frappe.qb` inserts for cheapness, inspectable via standard tooling.
- **Existence-signal push is the v1 default** — same exposure as core's `list_update` today.
  Per-user subscription evaluation is a later opt-in for sensitive doctypes.
- **Generated doctype modules import the app's client** (v3 style). The generator takes the
  client's import path as config; one line of coupling in generated code beats per-app
  registration boilerplate.

# Deferred until dogfooding

Decide these against real Gameplan use cases during implementation, not on paper:

- Conflict UX default — drop-and-surface vs auto-retry when rejected fields don't overlap the
  server's changes. v1 implements drop-and-surface (the conservative primitive that auto-retry
  can be built on) and we revisit once real conflicts show up.
