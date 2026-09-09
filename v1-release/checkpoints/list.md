# Checkpoint — List track (responsive columns)

Branch: `v1/rc-list`
Base: `main` @ `2d65281be8` + PR #1097 merged at `1380a431d3`.

Ticket: `v1-release/rc-implementation-handoff.md` §3 (untracked, owned by the
integration agent).

## Status

Implementation, tests and documentation complete. Every acceptance item in the
ticket is verified below.

## Design

`columns` accepts `string[]` (unchanged) or `{ base, <screen>… }` where every
value is a complete track array.

Resolution is pure CSS, no JS viewport state:

1. `List.vue` writes one inline custom property per supplied breakpoint:
   `--_list-columns-base`, `--_list-columns-md`, … The array form is exactly
   `{ base: array }`.
2. The Tailwind plugin reads the *app's* resolved `theme('screens')` and emits,
   in `addBase`, a reset of every `--_list-columns-<screen>` on
   `[data-slot='list']` plus one `@media (min-width: …)` rule per screen in
   ascending order. Each rule assigns the resolved
   `--_list-columns: var(--_list-columns-<screen>, var(--_list-columns-<lower>, … var(--_list-columns-base)))`.
   Omitted breakpoints therefore fall through to the nearest lower supplied one.
3. Rows and the header read
   `grid-template-columns: var(--_list-columns, auto minmax(0,1fr) auto)`.
   `--_list-columns` is declared on the list root and inherits down, so the
   header and every row are the same template by construction.

The reset on `[data-slot='list']` is what makes every List root own its
configuration, including roots with no `columns` prop: an unset carrier is
`initial` (guaranteed-invalid), so `--_list-columns` computes to the
guaranteed-invalid value on that root and the use-site fallback applies instead
of the ancestor's value.

Specificity note, load-bearing: the plugin's rules use `[data-slot='list']`
(0,1,0) while `style.css` keeps a `:where()` (0,0,0) base tier as a no-plugin
fallback. The two files' source order is not controllable in a consuming app,
and in the dev build the `:where()` block was observed *after* the media rules —
it would have won at every width on order alone. Winning on specificity is
order-proof.

Screens that cannot join a min-width ladder (`raw`, max-only, multi-range) are
skipped; a `columns` key naming one simply never matches. A screen named `base`
is ignored, since `base` is the prop's own reserved tier.

## Revisions to #1097's contract

1. **`--list-columns` is no longer a public hook, and `list-cols-[…]` is
   removed.** #1097 froze three public hooks and documented "an ancestor hook
   overrides a nested List's `columns` prop, opt out with
   `[--list-columns:initial]`". That is exactly the ancestor-inheritance
   contract the ticket says to revise, and it is incompatible with "each nested
   List owns its configuration": a hook inherits, so an inner list could not be
   relied on to keep its own template. The decision brief also says CSS
   variables are an internal rendering mechanism, and lists only gap and
   row-padding as the utilities that stay. Column templates are now prop-only;
   the resolved var is internal (`--_list-columns`).
   **Judgment call, flagged to the orchestrator.** `list-cols-[…]` shipped in
   the betas, so removing it is a real (pre-1.0) break. It is recorded in the
   changelog with the migration (move the value into a `base` tier). Restoring
   it later would be a small diff: one `matchUtilities` entry plus one var in
   the use-site fallback chain.
2. **`--list-gap` and `--list-row-padding-x` are unchanged** — still public
   hooks, still inherited from any ancestor, still with their `list-gap-*` /
   `list-row-px-*` utilities. "Keep CSS variables internal" was read as scoped
   to the columns mechanism, which is the paragraph it sits in; renaming the
   other two would be a gratuitous break with no acceptance criterion behind it.
3. **ADR-0017 rewritten** where it asserted the old contract: rule 3 (carrier
   indirection existed so a class beats the prop → carriers are per-breakpoint
   prop state), rule 4 (attribute specificity now also covers the generated
   rules), rule 5 (new paragraph: a knob each instance must own is a prop, not a
   hook), rule 6 (`list-cols-[…]` dropped), plus two new rejected alternatives
   (the public columns hook; client-side breakpoint resolution) and rewritten
   consequences.
4. **#1097's tests revised**: `lets a --list-columns class beat the columns
   prop` became `keeps the columns prop the only source of the template`; `lets
   an ancestor hook override a descendant List columns prop, with initial as the
   opt-out` was deleted (the rule no longer exists); the ancestor-theming test
   now asserts an ancestor `--list-columns` does *not* reach the list while gap
   and inset do.

## Commits

- `46caf18034` docs(list): start the RC responsive-columns checkpoint
- `bd19cc18a2` feat(list)!: resolve responsive column templates from app breakpoints
- `fbd0edbc10` test(list): pin the responsive-columns ladder, nesting and SSR markup
- docs commit (this one)

## Files changed

- `tailwind/listColumns.js` (new) — breakpoint ladder and rule generation
- `tailwind/listColumns.test.js` (new) — 9 unit tests
- `tailwind/plugin.js` — `addBase(listColumnRules(theme('screens')))`, removed
  the `list-cols` utility
- `src/molecules/list/types.ts` — `ListColumnsByBreakpoint`, `ListColumns`
- `src/molecules/list/List.vue` — per-breakpoint carriers, dev warning on a
  missing `base`
- `src/molecules/list/style.css` — carrier resets, base tier, new use site
- `src/molecules/list/index.ts` — export the two new types
- `src/molecules/list/list-context.ts` — hook list in the comment
- `src/molecules/list/List.cy.ts` — revised hook tests, new responsive block
- `src/molecules/list/List.ssr.test.ts` (new) — 4 SSR tests
- `src/molecules/list/list.md`, `list.api.md` — Responsive columns section,
  rewritten Styling hooks, auto-size caveat in Column mode
- `src/molecules/list/stories/Responsive.vue` (new) — `List-Responsive` preview
- `spec/adr/0017-css-variable-styling-hooks.md`
- `docs/content/docs/changelog.md`

## Verification

Cypress needs `env -u ELECTRON_RUN_AS_NODE`; without it the Electron binary
boots as plain Node and fails to start (environment issue, not a code failure).

```
$ env -u ELECTRON_RUN_AS_NODE npx cypress run --component \
    --spec src/molecules/list/List.cy.ts --config video=false
  33 passing (2s)
  ✔ List.cy.ts   00:02   33   33   -   -   -
  All specs passed!
```

```
$ yarn test
 Test Files  104 passed (104)
      Tests  1683 passed (1683)
```

```
$ yarn type-check
$ vue-tsc --noEmit -p tsconfig.app.json && vue-tsc --noEmit -p tsconfig.node.json
Done in 8.05s.
```

```
$ yarn docs:gen && yarn docs:check
Generated list meta
The committed API tables match the source.
```

`docs:gen` also rewrites three `src/charts/docs/*.api.md` files on this base.
That is pre-existing row-order churn, not caused by this branch — `docs:check`
passes with those files reverted, so they are left untouched (charts are
Saqib's).

Template inference, checked with a scratch SFC under `src/` and
`vue-tsc -p tsconfig.app.json` (file deleted afterwards):

```
__infer-scratch.vue(8,10): error TS2322: Type '{ md: string[]; }' is not assignable to type 'ListColumns | undefined'.
__infer-scratch.vue(10,10): error TS2322: Type '{ base: string; }' is not assignable to type 'ListColumns | undefined'.
    Type 'string' is not assignable to type 'string[]'.
```

`:columns="['a','b']"` and `:columns="{ base: ['a'], md: ['a','b'] }"` both
type-check. A missing `base` and a non-array tier are both rejected.

Browser check (Chrome for Testing on :9222, a scratch page under the Vite dev
server, since deleted). Generated rules read back from `document.styleSheets`:

```
[data-slot="list"] { --_list-columns-base: initial; --_list-columns-sm: initial; --_list-columns-md: initial; --_list-columns-lg: initial; --_list-columns-xl: initial; --_list-columns: var(--_list-columns-base); }
@media (min-width: 640px) { [data-slot="list"] { --_list-columns: var(--_list-columns-sm, var(--_list-columns-base)); } }
@media (min-width: 768px) { [data-slot="list"] { --_list-columns: var(--_list-columns-md, var(--_list-columns-sm, var(--_list-columns-base))); } }
@media (min-width: 1024px) { [data-slot="list"] { --_list-columns: var(--_list-columns-lg, var(--_list-columns-md, var(--_list-columns-sm, var(--_list-columns-base)))); } }
@media (min-width: 1280px) { [data-slot="list"] { --_list-columns: var(--_list-columns-xl, var(--_list-columns-lg, var(--_list-columns-md, var(--_list-columns-sm, var(--_list-columns-base))))); } }
```

Computed values for `{ base: [1fr, 80px, 64px], md: [1fr, 140px, 100px], lg: [2fr, 180px, 120px] }`:

```
500px  resolved="minmax(0, 1fr) 80px 64px"   row="268px 80px 64px"   header="268px 80px 64px"   rowHeight=48px  innerStatic="60px 90px"
900px  resolved="minmax(0, 1fr) 140px 100px" row="572px 140px 100px" header="572px 140px 100px"                 innerStatic="60px 90px"
1440px resolved="minmax(0, 2fr) 180px 120px" row="1052px 180px 120px" header="1052px 180px 120px"                innerStatic="60px 90px"
```

Header and row tracks are identical at every width, and the nested static list
keeps its own template inside a responsive outer one. No console errors or Vue
warnings.

Story check (`stories/Responsive.vue`, `max-md:hidden` on the Role header and
cell): at 1200px `row="840px 144px 128px"` and the Role cells are `flex`; at
500px `row="340px 104px"` and they are `display: none`.

### Screenshots

- `/tmp/rc-list-shots/01-below-md-500px-light.png`
- `/tmp/rc-list-shots/02-md-tier-900px-light.png`
- `/tmp/rc-list-shots/03-lg-tier-1200px-light.png`
- `/tmp/rc-list-shots/04-below-md-500px-dark.png`
- `/tmp/rc-list-shots/05-md-tier-900px-dark.png`
- `/tmp/rc-list-shots/06-lg-tier-1200px-dark.png`
- `/tmp/rc-list-shots/07-story-lg-1200px-light.png`
- `/tmp/rc-list-shots/08-story-below-md-500px-light.png`
- `/tmp/rc-list-shots/09-story-md-900px-light.png`
- `/tmp/rc-list-shots/10-story-md-900px-dark.png`

1–6 include the nested-List case; the shots also carry an on-page readout of the
computed templates.

## Open questions for the orchestrator

1. Removing `list-cols-[…]` / `--list-columns` is the one call the ticket does
   not spell out. Reasoning above; easy to reverse if the maintainer disagrees.
2. Downstream consumers were not swept for `list-cols-` or `[--list-columns:`.
   Both shipped on `main`, so the integration agent should grep CRM, Helpdesk,
   Gameplan and the other frappe-ui dependants before the RC freeze.
3. `yarn docs:build` was not run (disk headroom). The `List-Responsive` preview
   was verified by rendering the story directly, not through VitePress.

## Left to do

Nothing in this track.
