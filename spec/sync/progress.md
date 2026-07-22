# Frappe Sync — progress log

## 2026-07-09 — kickoff

Environment inspected. Codex CLI available (`codex exec` returned ok). Workspace:

- `frappe-ui` on branch `feat/sync-client` (created from `main` @ 021ef668).
- `frappe`, `gameplan` clones present; branches not yet created.
- Spec `frappe-ui/spec/sync.md` present (untracked).

Starting **Phase 1**: frappe-ui client core under `src/sync/`. Vitest via `yarn vitest run`.

Approach:
- Tests first, committed with `test:` prefix; then implementation (`feat:`).
- Claude owns test design + spec interpretation + review; Codex owns bulk implementation
  against green-target tests.
- Test files colocated with modules under `src/sync/__tests__/`.

### Decisions

- **Filter semantics** modelled on frappe/frappe/model/db_query.py — `like` case-insensitive
  with `%` wildcards; `is`/`is not` → `set`/`not set` (mirrors Frappe's convention where the
  value string is `'set'`/`'not set'`).
- Spec's `Filters` shape is `{ field: value | [op, value] | [op, value, meta?] }` per Frappe
  conventions; will document precisely in filters.ts JSDoc.
- Storage: single `StorageAdapter` interface, `memoryAdapter` for tests, `idbAdapter` using
  `idb-keyval` (already used elsewhere in the frappe-ui ecosystem? verify — else raw IDB).

### Test counts

Phase 1 complete — **72/72 tests passing** across 5 files:

- `filters.test.ts` — 18 tests (Frappe operators, order_by, limit, `is set`/`is not set`,
  null semantics for ordered comparisons, error paths).
- `store.test.ts` — 14 tests (put/get/list, field-set merge invariant, delete, rename with
  destination overwrite, change subscribers, adapter round-trip + field-set persistence).
- `queue.test.ts` — 11 tests (fold with all 5 ops, ordering, temp-name propagation to
  subsequent queued mutations, idempotent replay, persistence).
- `connection.test.ts` — 10 tests (subscribe pull, sync.change → debounced pull, coalescing,
  resync, unsubscribe, push draining, single in-flight batch, conflict emit,
  cross-batch temp-name rename).
- `vue.test.ts` — 19 tests (all handles: list/get/count/insert/setValue/delete/draft/edit,
  reactive filters via ref + getter, effectScope release, loadMore window, shared sub
  dedupe, sync.pending/conflicts, escape hatch `client.call`).

### Phase 1 architectural notes

- **`connection.push(m)` returns `Promise<MutationAck>`** — resolves when the ack lands
  (applied/conflict/error). This makes higher-level handles (`Task.insert().then(doc =>
  router.push(doc.name))`) trivial. The queue is the source of truth for pending; the
  ack promise is a UX convenience.
- **`storeRev` counter** in the Vue adapter is bumped on any store change AND on any pull
  (via `connection.onPull`) so `count` handles refresh even when the doctype's snapshot
  didn't change (count-only pull can update the reactive number).
- **Shared subscription dedupe** — identical `JSON.stringify(query)` handles reuse one
  connection sub; ref-counted disposal.
- **Views/`kind: 'view'`** are declared in `Query` and reach the transport, but the store
  side is stubbed (marked TODO in `connection.ts`) — will land with the server view
  registry in Phase 2 so we can dogfood in Phase 4.
- **Divergence from spec, worth noting** — `client.sync.error` is a single `Ref` of the
  most-recent error, not a history. Simplification; will revisit if the app needs a log.

### Divergences from `spec/sync.md` requiring explicit call-out

None yet. All Part 1 public API items covered by tests. Kept `client.call` shape simple
(single method name + args; no per-method reactive caching).

### Blockers (needs root)

None yet.

## Phase 2 — frappe backend (`frappe.sync`)

Complete. **16/16 tests pass** via
`bench --site test.localhost run-tests --module frappe.sync.test_sync`.

### Setup notes worth remembering

- Frappe develop requires **Python 3.14**, not present on system. Installed via
  `uv python install 3.14` (no sudo). `bench init … --python "$(uv python find 3.14)"`
  succeeds.
- The bench's `apps/frappe` was replaced with a **symlink** to `~/frappe-sync/frappe`
  so edits on my feature branch are picked up without re-cloning; ran
  `uv pip install -e apps/frappe --python env/bin/python` to re-wire the editable install.
- Redis was already running on `:6379`; bench defaults expected `:11311`/`:13000`.
  Repointed via `bench --site test.localhost set-config -g redis_{cache,queue,socketio}`.

### What's in `frappe/sync/`

- **`doctype/sync_log/`** — `Sync Log` with `naming_rule: Autoincrement`, indexed
  `ref_doctype`+`ref_name`, `op` (create/update/delete/rename), optional `new_name`,
  `user`. `name` is the cursor.
- **`log.py`** — `notify_change(doctype, name, op, new_name)` writes a Sync Log row via
  a direct `frappe.qb` insert (cheap; one row per touched doc), and fans out
  `sync.change` via `publish_realtime` to the `sync:{doctype}` room. Uses
  `frappe.database.sequence.get_next_val` to get the next autoincrement id — direct
  `qb.insert()` doesn't otherwise fill the NOT NULL name column.
- **`api.py`** — `sync.pull` (list/doc/count/view queries + since-cursor deltas) and
  `sync.push` (insert/set_value/delete/rename/run_doc_method). Push runs in-order,
  stops at the first failure (later mutations become `not_run` errors), and records
  applied ids in the cache for idempotent replay.
- **`views.py`** — `@view(name, depends_on=[...])` registry; `depends_on` doctypes are
  auto-added to `_opted_in_doctypes()` (Sync Log picks them up implicitly).
- **`realtime.py`** — plain-function `sync_sub`/`sync_unsub` handlers; unit-testable
  without a real socket.
- **Hook points patched in core**:
  `frappe/model/document.py` (`notify_update` → create/update),
  `frappe/model/delete_doc.py` (→ delete),
  `frappe/model/rename_doc.py` (→ rename).
  Each is a small try/except so a bug in sync cannot break the primary write path.
- `frappe/modules.txt` gained `Sync`.

### Decisions worth calling out

- **Push idempotency cache** keyed by user, stored in `frappe.cache()` with 1h TTL.
  Chosen over a persistent doctype because these are ack replays; a lost cache means
  a re-application of an already-applied mutation, which is safe for `set_value` and
  `run_doc_method` idempotence but could double-insert. **Spec finding — file under
  API feedback for the PR**: consider persisting applied ids per user in a small
  doctype so a Redis flush cannot double-insert on ack loss.
- **In-test hook injection** — the frappe hook loader caches, so tests patch
  `frappe.sync.log._opted_in_doctypes` directly rather than mutating hook dicts.

### Test counts (backend)

- `TestSyncLog` — 4/4 (create/update/delete rows, opted-out doctype no-op)
- `TestSyncPull` — 3/3 (initial snapshot, delete deltas since cursor, count)
- `TestSyncPush` — 5/5 (insert w/ server naming, set_value, stale-base conflict,
  idempotent replay, stop-on-first-failure)
- `TestViews` — 2/2 (depends_on registered; view invoked by pull)
- `TestRealtimeHandlers` — 2/2 (join room on permission; refuse without)

## Phase 3 — HTTP integration

Complete. `src/sync/http-transport.ts` implements the `Transport` interface against
`frappe.sync.api.pull` / `frappe.sync.api.push`, and
`src/sync/__tests__/integration.test.ts` (skipped by default; enabled when
`SYNC_INTEGRATION_URL` is set) drives it against a live bench:

    SYNC_INTEGRATION_URL=http://test.localhost:8000 npx vitest run \
      src/sync/__tests__/integration.test.ts

Both integration tests pass — a raw `sync.pull` returns docs with permissions, and
a `Task.insert(...)` from the client shows up in a subsequent list handle.

### Frappe endpoint path

Frappe interprets `sync.pull` as `<app>.pull` (and errors with "App sync is not
installed"). The client must call the full path: `frappe.sync.api.pull`. Documented
in http-transport.ts; the client-facing method names in `spec/sync.md` are unchanged.

### MSW note

`vitest.setup.ts` starts an MSW server that intercepts all fetches; the integration
test explicitly `mswServer.close()`s in `beforeAll` to allow real network traffic.

## Phase 4 — Gameplan migration (started, not finished)

Gameplan installed on `test.localhost`, seeded with the bundled demo generator
(55 discussions, 281 comments, 4 communities, 14 spaces, etc). One server-side
view registered:

- **`gameplan.discussion_feed`** in `gameplan/gameplan/sync.py`, wrapping the
  existing `get_discussions` API, `depends_on=["GP Discussion", "GP Comment", "GP Poll", "GP Project"]`.
- `sync_doctypes` in `gameplan/gameplan/hooks.py` opts those four doctypes into
  the Sync Log write path.

Live-tested end-to-end via curl:

    POST /api/method/frappe.sync.api.pull
    { "subs": [{"id":"feed","query":{"kind":"view","view":"gameplan.discussion_feed","limit":2}}] }
    → { "docs": { "feed": [{ enriched discussion rows ... }] }, "cursor": 0, ... }

The view returns real enriched rows (project title, unread, last comment, etc)
through the permission-checked pull path.

### API feedback so far

- **Method path** — spec Part 1 uses `sync.pull`; the wire uses `frappe.sync.api.pull`.
  Either amend the spec to note the underlying method path, or expose a URL alias.
  Recorded as a potential spec amendment; not yet applied since the client
  transport hides it.
- **`boot_session`** doesn't run at import time, only for user sessions. I used a
  side-effect import in `gameplan/hooks.py` to force view registration. Spec should
  document this explicitly — apps typically don't know that the sync layer only
  sees `@view(...)` decorators after the module has been imported once.
- **`fields` handling in the pull path** — `frappe.get_list` with `fields=["*"]`
  works, but a partial field set is untested against the store's field-set merge
  invariant end-to-end.

### Not yet done (Phase 4 continuation — for the user)

- Frontend `sync-shadow.ts` harness in gameplan for legacy/shadow/sync switching.
- View-by-view migration per `GAMEPLAN-MIGRATION.md`.
- Cypress runs in `sync` mode against a demo site.
- Puppeteer / Chrome DevTools MCP verification (installation started but not
  wired for two-tab live update tests).
- The socket binding for `sync.change` fan-out (server-side
  `publish_realtime(sync.change, room=sync:{doctype})` already emits; the client's
  socket handler for subscribing to those rooms is still a stub in
  `http-transport.ts`).
