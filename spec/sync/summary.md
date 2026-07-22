# Frappe Sync — summary

Local-first data layer for Frappe apps. Spec lives at `frappe-ui/spec/sync.md`; this
run implemented Phases 1–3 end-to-end, and started Phase 4 (Gameplan) as far as
proving the server-view path with real demo data.

## What runs green today

- **Phase 1 — frappe-ui client core** — `yarn vitest run` in `frappe-ui/`:
  **72/72 tests pass** across `filters`, `store`, `queue`, `connection`, `vue`.
  All Part 1 public API items in `spec/sync.md` are exercised end-to-end against
  the mock transport.
- **Phase 2 — frappe.sync module** — `bench --site test.localhost run-tests
  --module frappe.sync.test_sync`: **16/16 tests pass** across Sync Log, pull,
  push, view registry, and realtime handlers.
- **Phase 3 — integration** — `SYNC_INTEGRATION_URL=http://test.localhost:8000
  npx vitest run src/sync/__tests__/integration.test.ts`: **2/2 tests pass**
  against a live bench site (pull returns docs; insert via push, subsequent pull
  sees it).
- **Phase 4 — gameplan** — one server view (`gameplan.discussion_feed`) registered
  and wired to opt-in doctypes; validated by curling `frappe.sync.api.pull` with a
  view query and getting enriched rows back. Front-end shadow harness and cypress
  runs are NOT yet done.

## Branches

- `frappe-ui` on `feat/sync-client` at `fbbe8112` — local; not pushed. Contents:
  - `src/sync/filters.ts` — Frappe filter operators + `order_by` + `limit`.
  - `src/sync/store.ts` — normalized DocStore with field-set merge, rename,
    change subs; `memoryAdapter` + `idbAdapter`.
  - `src/sync/queue.ts` — pending mutation queue + `fold(snapshot, pending)`.
  - `src/sync/protocol.ts`, `src/sync/connection.ts` — wire types and client-side
    subscription/pull/push engine.
  - `src/sync/vue.ts` — `createClient` + doctype handles (`list`/`get`/`count`/
    `insert`/`setValue`/`delete`/`draft`/`edit`) + `client.sync` state.
  - `src/sync/http-transport.ts` — HTTP-backed `Transport` for the live bench.
  - `src/sync/index.ts` — public entrypoint.
- `frappe` on `feat/frappe-sync` at `9f1c48d10f` — local; not pushed. Contents:
  - `frappe/sync/` — module: Sync Log doctype, `log.py`, `api.py`, `views.py`,
    `realtime.py`, `test_sync.py`.
  - Small hook points patched in `frappe/model/{document,delete_doc,rename_doc}.py`
    (each try/except wrapped so a bug in sync cannot break primary writes).
  - `frappe/modules.txt` gained `Sync`.
- `gameplan` on `feat/sync-migration` at `ce331f1` — local; not pushed. Contents:
  - `gameplan/sync.py` — one view (`gameplan.discussion_feed`).
  - `gameplan/hooks.py` — `sync_doctypes` opt-in + side-effect import for view
    registration.

`gh auth status` was not attempted; branches remain local until you `git push`.

## Environment notes

- **Python 3.14** installed via `uv python install 3.14` (no sudo). Frappe develop
  refuses Python 3.12.
- **Bench** at `~/frappe-sync/bench`; `apps/frappe` and `apps/gameplan` are
  symlinks into the top-level clones so branch edits are picked up directly.
- **Redis** ports repointed to the single running instance on `:6379` via
  `bench --site test.localhost set-config -g redis_{cache,queue,socketio}
  redis://127.0.0.1:6379/{1,2,3}`.
- **Site** `test.localhost`, using disposable local credentials with
  `allow_tests: true`.
- Demo data seeded via `bench --site test.localhost execute
  gameplan.demo.demo.generate` (55 discussions, 281 comments, 4 communities,
  14 spaces).

## API feedback — spec findings to fold back

1. **Method path collision** — `sync.pull` on the wire is
   `frappe.sync.api.pull`, because Frappe's dispatcher reads `sync.pull` as
   "app `sync`, function `pull`". Spec should either document the underlying
   path or the client transport should encode the short name and re-expand.
   Currently handled in `http-transport.ts`.
2. **View registration timing** — `@view(...)` decorators only fire once the
   module is imported. Frappe's `boot_session` doesn't run at process start.
   In `gameplan/hooks.py` I did a side-effect import (`from gameplan import
   sync as _sync_views`). Spec should mention the recommended registration
   point (either a hook or a helper decorator that registers on first pull).
3. **Push idempotency cache** — currently keyed by user in `frappe.cache()`
   with a 1h TTL. Redis flush → possible double-insert on ack replay. Consider
   persisting applied ids in a small doctype (or the Sync Log itself).
4. **HTTP-only fallback** — without a socket, notification-driven pull becomes
   client-driven polling. The client's `send()` is a no-op for HTTP-only
   deployments; this is fine for reads but means `sync.change` fan-out from
   `notify_change` is invisible. Document the "HTTP-only mode = periodic pull"
   contract explicitly.
5. **`client.sync.error` shape** — implemented as `Ref<{code,message} | null>` of
   the latest error, not a history. Might be worth surfacing as an event stream
   for logging.

None of these changed the Part 1 public API; recorded as items to revisit
during the frappe PR review.

## Precise next steps

1. **Push branches** once `gh auth` is set: `git push -u origin feat/sync-client`
   in frappe-ui, `git push -u origin feat/frappe-sync` in frappe,
   `git push -u origin feat/sync-migration` in gameplan.
2. **Wire the socket transport binding** — add a socket adapter to
   `http-transport.ts` (or a sibling `socket-transport.ts`) that subscribes to
   `sync:{doctype}` rooms and emits `sync.change` messages into `onMessage`.
   Server side already publishes them from `frappe.sync.log.notify_change`.
3. **Gameplan frontend shadow harness** — `frontend/src/sync-shadow.ts` per
   `GAMEPLAN-MIGRATION.md`; then migrate the discussion feed component to use
   `DiscussionFeed.list(...)` behind the `?data_layer=` flag.
4. **Cypress in shadow mode** — the tests exist already
   (`gameplan/frontend/cypress/e2e/`). Run them with the flag defaulted to
   `shadow` and inspect the divergence log; then re-run with `sync` view-by-view.
5. **Puppeteer + Chrome DevTools MCP** — the environment is ready
   (`npx @puppeteer/browsers install chrome@stable`, plus
   `claude mcp add -s user chrome-devtools -- npx -y chrome-devtools-mcp@latest`).
   Two-tab live-update and offline/reconnect verifications should land here.
6. **PR the frappe changes** — `frappe/sync/` is self-contained; the three
   patched hook points (`notify_update`, `delete_doc`, `rename_doc`) are each
   try/except wrapped and cost nothing when no doctypes opt in.
7. **Spec revisions** for the five API-feedback items above.
