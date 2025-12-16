# Crema (Spec)

Crema is a typed, Vue-3-friendly client for working with Frappe DocTypes over **`/api/v2` only**.

It provides:

- A **live in-memory identity map** (single canonical instance per `{ doctype, name }`)
- Reactive docs and lists that stay in sync across the app
- A **draft/dirty** workflow (`set()` creates a full local copy; `save()` commits and returns to canonical)
- Typed access to fields, filters, list results, and custom controller methods
- Optional realtime updates via socket.io

This document is the API and behavior specification (no implementation details).

---

## Goals

- Ergonomic, typed API for common CRUD:
  - `getDoc(name)`, `insertDoc(values)`, `save()`, `delete()`
  - `getList(query)`, pagination (`next()`), and `update(name, patch)`
- **Live object** guarantees:
  - If a document is updated anywhere (save, list update, realtime), all references update.
- Vue 3 integration:
  - `doc` and list `data` are reactive and safe to use directly in templates.
- Strict `/api/v2` only.
- Export everything from **`frappe-ui/crema`**.

## Non-goals

- Reusing the existing `resources/` or `data-fetching/` modules.
- Supporting `/api/method/*` or v1 endpoints.
- Providing a UI layer (dialogs, forms, etc.).
- Offline-first or persistent caching (can be added later).

---

## Key Concepts

### Canonical vs Draft

Crema maintains two representations:

- **Canonical doc**: the single live object for `{doctype,name}` in the identity map.
- **Draft doc**: a full deep copy created on first mutation via `set()` (or `draft()`), used only by that handle.

Rules:

- When `dirty === false`, `handle.doc` points to the canonical object.
- When `dirty === true`, `handle.doc` points to the draft object.
- Calling `save()`:
  - Sends the draft to the server
  - Updates the canonical object with the server result
  - Discards the draft
  - `dirty` becomes `false` and `handle.doc` points back to canonical

This model ensures:

- Lists can safely expose `TDoc[]` pointing at canonical docs.
- A dirty edit does not mutate canonical data until a successful save.

### Identity Map (Live Store)

- There is exactly one canonical instance per `{doctype, name}`.
- `Crema` updates canonical objects **in-place** (preserving object identity) so Vue reactivity updates everywhere.

### Strict v2 Contract

Crema assumes **only** Frappe `/api/v2` endpoints.

- Document fetch: `GET /api/v2/document/{doctype}/{name}`
- Document create: `POST /api/v2/document/{doctype}`
- Document update/save: `PATCH /api/v2/document/{doctype}/{name}` (Crema standardizes on `PATCH`)
- Document delete: `DELETE /api/v2/document/{doctype}/{name}`
- List fetch: `GET /api/v2/document/{doctype}` with query params (filters, fields, limit, start, order_by)

Crema uses the v2 document-method endpoints for doctype controller methods (see below).

---

## Package & Entry Points

All exports come from:

```ts
import { createCremaClient, defineDoctype } from 'frappe-ui/crema'
```

### Configuration

Crema is initialized with a client, which carries:

- Base URL / site path (optional if same-origin)
- Auth strategy (cookies/CSRF header expectations)
- Optional realtime adapter (socket.io)
- Default list paging size

```ts
const crema = createCremaClient({
  baseURL: 'https://example.com',
  defaultPageSize: 20,
  realtime: {
    enabled: true,
  },
})
```

---

## Choosing the API Style: `ToDo.get()` vs `client.doctype('ToDo')`

Crema can support both; the best TypeScript experience depends on how you want typing to be wired.

### Option A (recommended default): `defineDoctype()` → `ToDo.getDoc()`

This yields the best autocompletion with the least TypeScript setup.

- No module augmentation required
- No stringly-typed doctype calls scattered across the app
- Easy to codegen one file per DocType

```ts
import type { ToDoDoc } from './__generated__/doctypes'

export const ToDo = defineDoctype<ToDoDoc>()('ToDo', {
  methods: {
    setStatus: {
      method: 'set_status',
      httpMethod: 'POST',
      args: (status: 'Open' | 'Closed') => ({ status }),
    },
  },
})

const todo = ToDo.getDoc('TODO-0001')
```

### Option B: `client.doctype('ToDo')`

This is great when you want a single configured client and dynamic doctype selection.

However, to get *full* typing from a string (`'ToDo'`) you typically need a generated doctype map or TypeScript module augmentation.

```ts
const ToDo = crema.doctype('ToDo')
const todo = ToDo.getDoc('TODO-0001')
```

Spec requirement:

- Crema should offer **both** APIs.
- `defineDoctype()` is the primary, “no-magic” path.
- `client.doctype(name)` becomes fully typed when a doctype map is present.

---

## API: Doctype Client

A Doctype client provides operations scoped to a single doctype.

### `getDoc(name)`

- Returns a `DocHandle<TDoc, TMethods>`.
- `handle.doc` is immediately usable (may be a placeholder until loaded).
- `handle.loading` indicates the initial fetch.

```ts
const todo = ToDo.getDoc('TODO-0001')

watchEffect(() => {
  if (!todo.loading) {
    console.log(todo.doc.name, todo.doc.description)
  }
})
```

### `insertDoc(values)`

Creates a document on the server and returns a live handle.

```ts
const todo = await ToDo.insertDoc({ description: 'Buy coffee' })
console.log(todo.doc.name) // assigned by server
```

### `call(method, args?)` (RPC)

Runs a whitelisted doctype-scoped RPC method via v2 RPC routes.

Use this for whitelisted methods that are **scoped to a doctype** but are **not bound to a specific document**.

```ts
const result = await ToDo.call('custom_rpc_method', { foo: 1 })
```

### `deleteDoc(name)`

Deletes a document by name.

```ts
await ToDo.deleteDoc('TODO-0001')
```

### `getList(query)`

Returns a `DocList<TDoc>` where `data: TDoc[]` are canonical live objects.

```ts
const todos = ToDo.getList({
  fields: ['name', 'status', 'description'],
  filters: { status: 'Open' },
  orderBy: 'modified desc',
  pageSize: 20,
})

watchEffect(() => {
  console.log(todos.data.length)
  console.log(todos.data[0]?.name)
})

await todos.next()
```

---

## API: `DocHandle<TDoc, TMethods>`

### Core fields

- `doc: TDoc` (reactive)
- `dirty: boolean`
- `loading: boolean` (initial fetch)
- `saving: boolean`
- `deleting: boolean`
- `error: unknown | null`

### `set(field, value)` / `set(patch)`

On first call:

- Creates a **full draft copy** of the current canonical doc
- Switches `doc` to point at the draft
- Sets `dirty = true`

```ts
const todo = ToDo.getDoc('TODO-0001')
await todo.ready()

todo.set('description', 'test')
console.log(todo.dirty) // true

todo.set({ status: 'Closed' })
```

### `save()`

- Requires `dirty === true` OR a new unsaved doc.
- Sends the draft (or unsaved doc) to the server.
- On success:
  - Updates canonical doc in-place
  - Discards draft
  - `dirty = false`

```ts
await todo.save()
console.log(todo.dirty) // false
```

### `delete()`

Deletes the current document.

```ts
await todo.delete()
```

### `reset()`

- Discards the draft and returns to canonical.

```ts
todo.reset()
```

### `reload()`

- Fetches latest from server and updates canonical.
- If `dirty === true`, this is an explicit action: **discard the draft**, reload canonical, and set `dirty = false`.

### `call(method, args?)` (Doc-bound method)

Runs a whitelisted **doc-bound** method on the server for this specific document.

```ts
const result = await todo.call('set_status', { status: 'Closed' })
```

---

## API: Custom Controller Methods (Typed)

Crema supports typed, doctype-scoped custom calls.

### Desired experience

```ts
await todo.setStatus('Closed')
```

Spec:

- Methods are declared when defining the doctype.
- Method calls may:
  - return data only
  - return `{ doc }` to update canonical doc
  - return `{ docs }` to hydrate multiple docs

Example:

```ts
await todo.setStatus('Closed')
// if response returns updated doc, canonical updates everywhere
```

### v2 endpoint mapping (from `frappe/api/v2.py`)

For doc-bound controller methods, Crema uses:

- `POST /api/v2/document/{doctype}/{name}/method/{method}/`

Where:

- `method` is the DocType controller method name (e.g. `set_status`)
- request body / query is treated as `frappe.form_dict`
- the server will append the modified document to the response docs (allowing Crema to hydrate canonical)

For RPC calls, Crema uses:

- Global RPC: `POST /api/v2/method/{method}`
- Doctype-scoped RPC: `POST /api/v2/method/{doctype}/{method}`

In v2.py these are routed to `handle_rpc_call(method, doctype?)`.

### Which one should I use?

- `crema.call(method, args?)` → global whitelisted method (not tied to a doctype)
- `ToDo.call(method, args?)` → whitelisted method scoped to the **ToDo doctype**, but not tied to a specific doc
- `todo.call(method, args?)` → whitelisted method executed **on a specific document instance**

Rule of thumb:

- If the method conceptually “acts on the record” (submit/cancel/set_status/etc), prefer `todo.call(...)`.
- If the method is “query/utility” scoped to a doctype (bulk ops, custom list endpoints, analytics), prefer `ToDo.call(...)`.
- If it’s truly global (auth, utilities, cross-doctype), use `crema.call(...)`.

### Response envelope expectations

Crema treats v2 responses as an envelope and may hydrate docs when present.

- `data`: main return value
- `docs` (optional): one or more documents to hydrate into the canonical store
- `has_next_page` (lists only)

Examples:

```json
{
  "data": {"ok": true},
  "docs": [
    {"doctype": "ToDo", "name": "TODO-0001", "status": "Closed"}
  ]
}
```

For list:

```json
{
  "data": [
    {"doctype": "ToDo", "name": "TODO-0001", "status": "Open"}
  ],
  "has_next_page": false
}
```

---

## API: `DocList<TDoc>`

### Core fields

- `data: TDoc[]` (reactive array of canonical docs)
- `loading: boolean`
- `error: unknown | null`
- `pageSize: number`
- `hasNextPage: boolean`

### `next()`

Fetches the next page and appends to `data`.

### `reload()`

Refetches from the first page and replaces `data`.

### `update(name, patch)`

- Sends an update for a single doc.
- On success, updates canonical store for that doc.
- If the doc is present in `data`, it updates automatically (same object).

```ts
await todos.update('TODO-0001', { status: 'Closed' })
```

### `remove(name)`

- Deletes a doc and removes it from list (and canonical store).

---

## Typing Model

Crema expects `TDoc` to be the doctype interface.

Example shape (Frappe-ish):

- `name: string`
- `doctype: string`
- `owner?: string`
- `creation?: string`
- `modified?: string`
- doctype fields...

### Filters typing

For MVP, filters are typed as:

- `filters: Partial<Record<keyof TDoc, unknown>>`

Later: support a richer filter DSL (operators like `['in', ...]`, between, like, etc.).

---

## Live Sync Guarantees

Crema must ensure:

- If `todo.save()` updates `ToDo/TODO-0001`, then any list containing that record reflects the changes immediately.
- If `todos.update('TODO-0001', ...)` updates a record, then any active `ToDo.get('TODO-0001')` handle reflects the changes.
- Canonical objects are updated in-place (do not replace object identity).

Draft behavior guarantee:

- If a handle is dirty, it uses a private draft and must not mutate canonical.
- If canonical updates while a handle is dirty (from realtime or other saves): **keep the draft and allow save (last write wins)**.
- Crema may optionally expose a flag like `remoteChangedWhileDirty: boolean` for UI warnings, but it must not block save.

---

## Errors

- Network errors and server errors populate `error` on handles/lists.
- `save()` should throw (reject) while also setting `error`.
- Errors should preserve server messages when available.

---

## Realtime (socket.io) (Optional)

Crema can subscribe to server-side doc events.

### Events

Minimum set:

- `doc_update`: `{ doctype, name, doc? }`
- `doc_delete`: `{ doctype, name }`
- `list_update`: `{ doctype }` (optional)

### Strategies

- **Patch**: if payload includes `doc`, hydrate canonical immediately.
- **Invalidate**: mark doc stale and refetch on next access.

---

## Open Questions (to resolve before implementation)

### Wire protocol (/api/v2)

1. How exactly should list query params be encoded?
  - `filters`: JSON string? support both dict and list filter formats?
  - `fields`: JSON string? (supported for list only)
  - `order_by`, `group_by`, `as_dict`, `debug`: which ones are supported/exposed?
2. Pagination contract:
  - Use only `start/limit` (as in v2), or support cursor pagination too?
  - How is `has_next_page` computed/consumed?
  - What happens if `next()` is called concurrently?
3. Update payload policy for `PATCH /document/{doctype}/{name}`:
  - Send only changed keys, or send the full draft?
  - How are child tables represented in patches?

### Loading & lifecycle

4. Is `getDoc(name)` eager (starts fetch immediately) or lazy (fetches on `ready()` / first access)?
5. What does `handle.doc` contain before initial load?
  - Must `doctype` and `name` always exist on the placeholder?
6. How should `ready()` behave?
  - Does it resolve when the first fetch completes successfully, or when the doc exists (even if error)?

### Concurrency & consistency

7. Concurrent saves:
  - If `save()` is called twice quickly, do we queue, dedupe, or last-call-wins?
8. Error handling contract:
  - On `save()` failure, draft should remain; canonical must remain unchanged — any additional rules?
9. When a draft exists and canonical changes remotely, we keep the draft and allow save (last write wins).
  - Should Crema expose a warning flag (e.g. `remoteChangedWhileDirty`) and when is it set/cleared?

### Deletion semantics

10. What should happen to a `DocHandle` after `delete()`?
   - Tombstone state? `exists=false`? does `doc` remain readable?
11. How should lists react to deletes?
   - Remove rows immediately vs mark deleted until next reload

### Custom methods & typing

12. RPC HTTP methods:
   - For v2 RPC routes, should we support both `POST` and `GET`, or standardize on `POST`?
13. Typing for method calls:
   - How are typed returns declared for `todo.call`, `ToDo.call`, `crema.call`?
   - How do method definitions declare “hydrates docs” vs “data-only” results?

### Realtime

14. Do we want first-class `subscribe()` helpers for realtime, or only automatic hydration when enabled globally?
15. If a realtime event arrives for a doc not in memory yet, do we ignore it, create a canonical stub, or fetch immediately?

### Memory management

16. Eviction policy:
   - Are canonical docs kept forever, or do we need LRU/manual dispose?

## Explicit Decisions

- `getDoc()` does **not** support `fields` selection; it always fetches a full document.
- Updates use `PATCH`.
- `reload()` discards draft and resets dirty state.
- RPC calls are supported via v2 `/api/v2/method/*` routes.
- `insertDoc()` returns a `DocHandle`.
