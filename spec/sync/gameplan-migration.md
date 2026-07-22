# Gameplan migration — side-by-side validation plan

Goal: migrate Gameplan to the sync layer **view by view**, with the old (`useList`/`useDoc`)
and new (sync) paths running side by side so every difference is observed before users are
exposed to it. The migration doubles as the API's real-world test: friction in app code is a
spec finding, not something to silently work around.

## Mechanism: a data-layer flag + shadow mode

One runtime flag, read at app start (localStorage `gameplan:data_layer`, overridable via
`?data_layer=` query param):

- `legacy` (default) — current behavior, zero risk.
- `shadow` — render from the legacy layer, but ALSO run the equivalent sync-layer
  subscription for the same view, and continuously diff the two results.
- `sync` — render from the sync layer.

### The shadow harness

A small module in gameplan (`frontend/src/sync-shadow.ts`):

- `shadow(name, legacyHandle, syncHandle, compare)` — registered per migrated view.
- On every settle of either side (legacy `onSuccess` / sync store change, debounced), run
  `compare`: doc count, name sets, then field-by-field on shared fields.
- Divergences logged as structured records: `{ view, kind, names, fields, legacy, sync, ts }`
  → console + POSTed to a dev-only whitelisted endpoint that appends to a Divergence Log
  (JSON file or doctype) so runs are inspectable after the fact.
- Expected-divergence allowlist (e.g. fields the legacy endpoint computes that the view
  computes differently) so the log stays high-signal.

Shadow mode costs double reads — it is a development/validation tool, never a production
default.

## Migration order (increasing risk, each step validates something new)

1. **Discussion feed** (`useDiscussions` → `DiscussionFeed.list`) — validates **views**
   (server-enriched query with `depends_on`), reactive filters, pagination via `loadMore`,
   and live updates replacing the tab-visibility reload hack.
   Requires: `gameplan/sync.py` view `gameplan.discussion_feed` wrapping the logic of
   `api.get_discussions`, `depends_on=["GP Discussion", "GP Comment", "GP Poll", "GP Project"]`.
2. **Discussion page** (`useDiscussion` → `Discussion.get`) — validates doc subscription,
   partial→full doc merge (feed row vs full doc), doc methods (`trackVisit`).
3. **Comments list** — validates live insert propagation between two clients (open two
   browser contexts in the e2e test), ordering, and count.
4. **Task board** — validates optimistic `setValue` (status changes, kanban drag), where
   instant local application is most visible.
5. **New discussion / new comment forms** — validates `draft()` + `insert()`, temp names
   (navigate-after-await rule), and offline queueing of posts.
6. **Offline pass** — with everything above on `sync`: load app, go offline (devtools),
   browse cached views, write comments, reconnect, verify convergence and the divergence log
   stays clean.

## Validation gates

- **Gate A (per view):** shadow mode runs clean (no unexpected divergences) across manual
  usage + the Cypress specs touching that view.
- **Gate B (per view):** Cypress e2e passes with the flag set to `sync` for that view.
  On the server bench this is safe (dedicated test site); never run Cypress against a real
  site — specs call `clear_data`.
- **Gate C (exit):** full Cypress suite green in `sync` mode; divergence log empty or fully
  allowlisted; the deferred spec decisions (conflict UX) revisited with the real cases
  collected in the log.

## What to record

In PROGRESS.md under "API feedback", for every migrated view:

- Lines of code before/after.
- Anything that needed a workaround or an escape hatch — each is a spec finding.
- Any place the old code's behavior was *better* (e.g. server-computed fields the view
  model handles awkwardly).
- Real conflict/temp-name/offline cases encountered → feeds the deferred decisions in
  `spec/sync.md`.
