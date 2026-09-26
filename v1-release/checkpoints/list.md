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
- `tailwind/listColumns.test.js` (new) — 9 unit tests plus 2 that build the
  preset through postcss against an app config that overrides `md`
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
      Tests  1685 passed (1685)
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

App-customized breakpoints, checked by building the preset through postcss with
`theme.extend.screens = { md: '900px', tablet: '850px' }` (now a test):

```
--_list-columns-tablet: initial;
@media (min-width: 850px) { --_list-columns: var(--_list-columns-tablet, var(--_list-columns-sm, var(--_list-columns-base))); }
@media (min-width: 900px) { --_list-columns: var(--_list-columns-md, var(--_list-columns-tablet, …)); }
```

`tablet` sorts below the overridden `md` even though it was declared after it,
no `768px` rule is emitted, and the `md` tier lands in the same `900px` block as
`.md\:hidden`.

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
2. **`list-cols-[…]` has seven downstream call sites.** `gh search code
   list-cols- --owner frappe` (which truncates silently, so treat this as a
   floor, not a total):

   ```
   frappe/gameplan  frontend/src/pages/Configure/CommunitySpacesList.vue   max-md:list-cols-[minmax(0,1fr)_auto]
   frappe/gameplan  frontend/src/pages/Configure/CommunityMembersList.vue  max-md:list-cols-[1.25rem_minmax(0,1fr)]
   frappe/gameplan  frontend/src/pages/Configure/CommunitiesList.vue       max-md:list-cols-[minmax(0,1fr)]
   frappe/gameplan  frontend/src/pages/Configure/CommunityGuestsList.vue   max-md:list-cols-[1.25rem_minmax(0,1fr)_2rem]
   frappe/wiki      frontend/src/pages/Overview.vue                        max-sm:list-cols-[auto_minmax(0,1fr)_auto]
   frappe/wiki      frontend/src/pages/Overview.vue                        list-cols-[minmax(0,1fr)_7rem_4.5rem_8rem]
   frappe/wiki      frontend/src/components/ContributionsPanel.vue         max-sm:list-cols-[minmax(0,1fr)_auto]
   ```

   No `[--list-columns:` usage was found. Every hit is a `max-<screen>:`
   variant, so each migrates exactly: `max-md:list-cols-[X]` with
   `:columns="[Y]"` becomes `:columns="{ base: [X], md: [Y] }"` — `max-md` is
   `< md` and the `md` tier is `>= md`, so the two are complementary with no
   gap or overlap. Mechanical, but it is a real cross-repo edit the maintainer
   should agree to before the freeze. This is the escalation for option 1
   above; the alternative that keeps every call site working is to keep the
   utility and instead reset `--list-columns: initial` at each list root, which
   also satisfies "each nested List owns its configuration" but leaves two
   responsive mechanisms and the class-beats-prop precedence in place.
3. `yarn docs:build` was not run (disk headroom). The `List-Responsive` preview
   was verified by rendering the story directly, not through VitePress.

## Left to do

Nothing in this track.

## Review round — bounded screens (PR #1133)

### The finding

Greptile, P1 on `tailwind/listColumns.js`: a `{ min: '700px', max: '900px' }`
screen kept only its `min`, so the tier was emitted under an unbounded
`min-width: 700px`. Above 900px the `band:` visibility utilities switch off
while the list keeps that tier's tracks — cells and tracks disagreeing, which
is the acceptance item ("an app-customized `md` agrees with that app's `md`
visibility utilities") the file exists to satisfy. Real, and reproduced before
fixing: built through postcss, `.band\:hidden` landed under
`(min-width: 700px) and (max-width: 900px)` and the columns rule under
`(min-width: 700px)`.

The reviewer named the bounded case only. Auditing every shape `theme('screens')
can hold turned up two more:

- `{ max }` and `{ raw }` screens, and arrays (multi-range screens), were
  dropped from the ladder entirely, so a `columns` key naming one silently did
  nothing while `narrow:hidden` worked. Documented as deliberate, but it is the
  same defect wearing a different hat: the key looks live and is not.
- Mixed-unit screens (`{ tablet: '40rem', phone: '380px' }`) were sorted on a
  px scale. Tailwind refuses to sort screens whose units differ and falls back
  to declaration order, so the tier that won was not the one whose utilities
  won.

### The fix: preserve the range, for every shape

Rejecting bounded screens was the other option Greptile offered. Not taken —
the cascade can be made coherent, so rejecting would give up an acceptance
criterion for nothing.

Each tier now rides `--_list-tier-<screen>`, declared in one media rule under
the same condition Tailwind's own variant for that screen emits (a mirror of
its `normalizeScreens` + `buildMediaQuery`, ~25 lines, no internal imports).
The root rule holds a single `var()` chain over the tier vars down to `base`.
Outside its screen nothing declares a tier var, so it stays guaranteed-invalid
and the chain falls through as if that tier had never been supplied.

That is what makes a tier able to *end*. The old shape could not: it wrote the
resolved `--_list-columns` inside each media rule and leaned on source order,
which only works while every screen is an unbounded min-width, each one's
region containing every region below it. With the tier vars, priority lives in
the nesting of the chain instead of in source order, and screens may overlap in
any way — the chain picks the highest live tier at every width.

Order is Tailwind's own rule, mirrored: sort by min-width when every screen is
a plain string in one unit (`areSimpleScreens && screensUseConsistentUnits`),
otherwise keep declaration order. So where two screens match at once, the tier
that wins is the one whose utilities win. This is the mixed-unit change above,
and it is a behaviour change from the merged branch: `{ tablet: '40rem',
phone: '380px' }` used to order by px, now by declaration, because that is what
the app's own variants do.

`raw` screens are supported rather than special-cased. A raw query is not a
width range, so "applies upward until the next breakpoint" says nothing about
it — but the contract that actually matters generalises cleanly: a tier is live
in exactly the same places as that screen's variants. `{ raw: '(max-height:
600px)' }` gives a tier that matches wherever `short:hidden` matches. Dropping
raw would leave the silent-no-op bug in place for it.

Nothing supported before was dropped. The only screens without a tier are the
reserved names (`base`, `DEFAULT`) and a screen with no condition at all
(`{}`), which Tailwind itself would emit as a broken `@media`.

Not fixed, and out of scope: Tailwind disables the `min-*` and `max-*` variants
altogether for a config containing object screens (it warns
`complex-screen-config`). An app using a bounded screen therefore cannot write
`max-band:hidden` — that is Tailwind's limit, not ours, and the named-screen
variants it does emit agree with the tiers.

### Verified

- `tailwind/listColumns.test.js` — 18 tests, up from 11. Unit coverage for
  string, `{ min }`, `{ min, max }`, `{ max }`, `{ raw }`, array, two screens
  sharing one condition, reserved names and an empty screen; plus five built
  through postcss against an app config, which compare the media conditions of
  the tier rule and of that screen's own `hidden` utility with a postcss walk
  rather than by eye. The bounded test was run against the pre-fix file first
  and fails there (`(min-width: 700px)` vs `(min-width: 700px) and (max-width:
  900px)`); it passes after.
- `yarn type-check` clean. `yarn test` 104 files / 1696 tests passed.
- `yarn docs:gen` + `yarn docs:check` — "The committed API tables match the
  source." (`docs:gen` also reorders rows in `src/charts/docs/*.api.md`;
  pre-existing drift, reverted.)
- `env -u ELECTRON_RUN_AS_NODE yarn cypress run --component --spec
  src/molecules/list/List.cy.ts --config video=false` — 33 passing. This is the
  real-browser check on the extra indirection: `--_list-tier-x:
  var(--_list-columns-x)` has to compute to guaranteed-invalid when the carrier
  is `initial`, which is what the ladder, the omitted-tier fallthrough and the
  nested-list containment tests all depend on. A throwaway spec confirmed the
  Cypress bundle really serves the regenerated rules (`--_list-tier-md` present
  in the document stylesheets), so the pass is not a stale build.

Docs updated to match: `list.md` (a paragraph on the non-width screen shapes
and the overlap rule), `types.ts`, ADR-0017 rule 3 and its consequences, and
the changelog entry.
