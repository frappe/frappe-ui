# Checkpoint — Rail track (RC handoff §1, decision D1, issue #1116)

Branch: `v1/rc-rail`
Base: `2d65281be8` (`v1.0.0-beta.62`), branched from `main`
Worktree: `/Users/netchampfaris/Projects/worktrees/rc-rail`

## Status

Done. Rename implemented, documented and verified. Nothing pushed, no PR, no
issue comment posted.

Commits on the branch:

- `47567d9b91` `refactor(rail)!: rename Rail to SidebarRail and RailItem to SidebarRailItem`
- `439a4dfb8b` `docs(rail): record the SidebarRail rename and its styling-hook break`
- this checkpoint

## What changed

`src/components/Rail/` moved to `src/components/SidebarRail/` with `git mv`, so
the history follows each file:

| Before | After |
| --- | --- |
| `Rail.vue` | `SidebarRail.vue` |
| `RailItem.vue` | `SidebarRailItem.vue` |
| `RailItemBadge.vue` | `SidebarRailItemBadge.vue` |
| `Rail.cy.ts` / `Rail.md` / `Rail.api.md` | `SidebarRail.cy.ts` / `SidebarRail.md` / `SidebarRail.api.md` |
| `RailItemProps` | `SidebarRailItemProps` |
| `data-slot="rail"` | `data-slot="sidebar-rail"` |
| `data-slot="rail-item"` | `data-slot="sidebar-rail-item"` |
| `data-slot="rail-item-indicator"` | `data-slot="sidebar-rail-item-indicator"` |
| `data-slot="rail-item-badge-dot"` | `data-slot="sidebar-rail-item-badge-dot"` |

Everything else about the family is untouched: props, slots, events, classes,
tooltip provider, badge teleport, the 50px frame.

Files touched outside the family:

- `src/index.ts` — the barrel entry moved next to `Sidebar`.
- `src/composables/usePortalTarget.spec.ts` — import, component name, and the
  `rail-portal` fixture id.
- `src/components/DesktopShell/` — `DesktopShell.vue` slot description,
  `DesktopShell.md`, `stories/Default.vue`, regenerated `DesktopShell.api.md`.
- `docs/components/recipes/DiscussionsDesktop.vue`, `docs/components/recipes/index.ts`.
- `docs/.vitepress/theme/index.ts` — comment only.
- `docs/content/docs/changelog.md` — new Unreleased entry, plus a correction to
  the "App shell family — brought to bar" entry, which still claimed the rail
  keeps its name.
- `skills/frappe-ui/CORE.md` — the app-shell component list.

## Decisions taken here (with reasons)

1. **New directory `src/components/SidebarRail/`, not a merge into
   `src/components/Sidebar/`.** The docs sidebar is generated from component
   folders that ship a story plus a colocated page
   (`docs/.vitepress/utils.ts`), so a separate folder gives `SidebarRail` its
   own page and lands it directly under `Sidebar` in the nav, which is the
   grouping D1 asks for. Folding the files into `Sidebar/` would delete the
   rail's docs page and imply that `Sidebar` owns the rail, which D1 forbids.
2. **`data-slot` values carry the new name.** PHILOSOPHY.md P10 makes
   `data-slot` a public styling contract, and the Sidebar family already
   mirrors component names in it (`sidebar`, `sidebar-item`, `sidebar-header`).
   Leaving `rail-item` behind would have been the only part of the family still
   named for the old component. This is the silent half of the break and is
   called out as such in the changelog.
3. **`SidebarRailItemProps` is now exported from the barrel.** It existed
   before but was not exported, unlike every other member of the Sidebar
   family (`SidebarItemProps` and friends are). A family that is now named for
   Sidebar should export its item props the same way. Additive; revert is one
   line if the orchestrator disagrees.
4. **`DesktopShell`'s `#rail` slot keeps its name.** It names a layout region,
   not the component placed in it — the same way `#sidebar` would still be
   right if `Sidebar` were renamed. Renaming it would be a second, gratuitous
   silent break.
5. **No codemod.** `migration.md` states the repo's rule outright: only the
   Tailwind tokens (`tokens-v2`) and the shortcut config (`shortcuts-v1`) have
   codemods, and "every other component, prop and slot rename is a hand edit".
   Both existing codemods exist because a grep is unsafe there (arbitrary class
   strings; `+` as both a combo separator and a key). `Rail` to `SidebarRail`
   is a loud break — the import fails and the compiler names every call site.
   The rule is written down, so this is not a guess and did not need an
   escalation.
6. **No migration-guide section.** `docs/content/docs/migration.md` is the v0
   to v1 guide. `Rail` was added during the v1 betas (`30bb37bbf9`) and does
   not exist in `v0.1.278`, so a v0 app has nothing to rewrite. The guide's own
   rule sends loud breaks to the changelog and admits them to the guide only
   when the replacement needs explaining. It does not.
7. **No reformatting.** The renamed files were already not prettier-clean
   before the rename and CI has no format gate, so only the comment lines whose
   wrapping the rename actually broke were rewrapped.

## Verification (every command run, with its result)

Run from `/Users/netchampfaris/Projects/worktrees/rc-rail`.

| Command | Result |
| --- | --- |
| `yarn type-check` **at base `2d65281be8`, before any edit** | `Done in 10.45s.`, exit 0 — the "green on main" claim checks out |
| `yarn type-check` after the rename | `Done in 8.36s.`, exit 0 |
| `yarn docs:gen` | regenerated, incl. `Generated SidebarRail meta` |
| `yarn docs:check` | `The committed API tables match the source.` |
| `yarn test src/composables/usePortalTarget.spec.ts` | `Test Files 1 passed (1)`, `Tests 10 passed (10)` |
| `env -u ELECTRON_RUN_AS_NODE ./node_modules/.bin/cypress run --component --spec src/components/SidebarRail/SidebarRail.cy.ts --config video=false` | `All specs passed! 7 7 - - -` |
| `env -u ELECTRON_RUN_AS_NODE ./node_modules/.bin/cypress run --component --spec src/components/DesktopShell/DesktopShell.cy.ts --config video=false` | `All specs passed! 3 3 - - -` |

Note for whoever runs Cypress next: plain `yarn cypress run` fails in this
agent environment with `Cannot find module .../Cypress.app/Contents/MacOS/Contents/Resources/app/index.js`.
The cause is an inherited `ELECTRON_RUN_AS_NODE=1`, which makes the Cypress
Electron binary start as plain Node. `env -u ELECTRON_RUN_AS_NODE` in front of
the command fixes it. Nothing to do with this change.

`yarn docs:gen` also reordered emit rows in `src/charts/docs/{Area,Bar,Line}Chart.api.md`.
That drift predates this branch and `docs:check` ignores row order, so it was
reverted rather than committed here.

Cypress artifacts (`.nyc_output/`, `coverage/`, `cypress/screenshots/`) were
deleted after each run. No build (`yarn build`, `yarn docs:build`) was run —
disk pressure.

## Visual verification

Docs site on `http://localhost:5199` (`yarn docs:dev --port 5199`), shared
headless Chrome, 1440x1000. Screenshots are not committed:

- `/tmp/rc-rail-shots/01-sidebarrail-standalone-light.png` — `/docs/components/sidebarrail`
- `/tmp/rc-rail-shots/02-sidebarrail-standalone-dark.png`
- `/tmp/rc-rail-shots/03-rail-plus-sidebar-light.png` — `/docs/components/desktopshell`
- `/tmp/rc-rail-shots/04-rail-plus-sidebar-dark.png`

Both layouts render as before in both themes: tile items with the active
indicator bar, ghost items, the dot badge and the count pill. The docs nav
lists `SidebarRail` immediately after `Sidebar`, and the route is
`/docs/components/sidebarrail`.

## Left undone / open questions

- Consumer apps (CRM, Helpdesk, Gameplan) were not checked or migrated. The
  break is loud, so their builds will name the call sites, but the `data-slot`
  half is silent and needs a grep for `data-slot="rail` and `[data-slot=rail`
  in each app's CSS.
- `skills/frappe-ui/evals/findings-2026-08.md` still cites
  `src/components/Rail/RailItem.vue:126`. Left alone on purpose: it is a dated
  record of an audit, not live documentation.
- Decision 3 (exporting `SidebarRailItemProps`) is the only addition to the
  public surface here. Flagged for the orchestrator.

## Draft comment for #1116 — NOT POSTED, the orchestrator posts it

---

**D1 is implemented on `v1/rc-rail`. The rail joins the Sidebar family by name.**

Accepted names:

| Before | After |
| --- | --- |
| `Rail` | `SidebarRail` |
| `RailItem` | `SidebarRailItem` |
| `RailItemProps` | `SidebarRailItemProps`, now exported from the root the way `SidebarItemProps` is |
| `data-slot="rail"` | `data-slot="sidebar-rail"` |
| `data-slot="rail-item"`, `"rail-item-indicator"`, `"rail-item-badge-dot"` | the same three with a `sidebar-` prefix |

The boundary does not move. `SidebarRail` is still a bare frame, it renders on
its own or beside `Sidebar`, `Sidebar` does not own the rail layout, and the
rail is not `Sidebar`'s collapsed mode. Props, slots and events are unchanged.
`DesktopShell`'s `#rail` slot keeps its name, because it names a layout region
rather than the component placed in it.

Migration is a rename of the import and the tags. There is no alias export, so
the import fails and the build names every call site. The `data-slot` values
are the silent half: a stylesheet rule written against an old value still
parses, it just stops matching, so grep app CSS for `data-slot="rail` as well.
This is in the changelog. No codemod: the repo reserves those for changes a
grep cannot make safely (`tokens-v2`, `shortcuts-v1`), and every other
component rename in v1 is a hand edit.

Retained as they are, no work needed: `PageHeader`, `Duration`, `TimePicker`,
the typed `Divider.action`, and the renderless `Editor`.

Three premises in the parity review do not hold against current `main`, so
nothing was built for them:

- `Button.icon` is not a boolean. It is `string | Component`, the same type as
  `iconLeft` and `iconRight` (`src/components/Button/types.ts`).
- `Spinner` already ships, with its own docs page, story and tests.
  `LoadingIndicator` is a thin wrapper around it that scales by percentage.
- There is no missing password input. `Password` is built on `TextInput`,
  toggling its `type` between `password` and `text`.

---
