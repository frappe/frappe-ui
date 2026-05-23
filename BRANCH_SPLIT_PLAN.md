# Branch Split Plan — extract token-independent work off `main`

> **Temporary planning doc.** Goal: carve the token-independent features out of
> `v1/espresso-tokens` into their own branches off `main`, so they can be reviewed/merged
> without waiting on the token refactor. **Plan first — nothing is executed until you approve.**

## Decisions captured from you
- **Commit all WIP first**, then split.
- Groups to extract: **Icon**, **Pill + TabButtons** (one branch), **Docs playground + Builders**.
- **Button/Badge stays on the token branch** — confirmed token-coupled (its `plugin.js` change
  reads `typographyTokens.fontSize`; the work is Figma-alignment + spec/ADRs).
- Each branch **off `main`**; only allowed pairing is Pill+TabButtons together.

## Key facts that shape the plan
- Feature files are extracted from the **pre-WIP commit `002efa1f4`** (current HEAD), whose
  token classes (`bg-surface-white`, `gray-5/6/7`) **exist on main**. The WIP codemods
  (`→ base`, `→ gray-8/9/10`) are NOT carried to the feature branches — those stay token-only.
- **`shadow-base` is refactor-only** — main's `boxShadow` has no `base` key. `Pill.vue` uses it
  (1 line). → must substitute on the Pill branch (see Branch 2).
- **`TabButtons` already exists on main** → Branch 2 *refactors* it, not a clean add.
- `Icon` and `Pill` are absent on main → clean adds.

## Method: content-snapshot extraction (recommended over cherry-pick)
The 22 commits interleave token + feature + docs work (`plugin.js` touched by 6, `Button.vue`
by 4, `src/index.ts` by Icon+Pill). Cherry-picking subsets would conflict repeatedly. Instead,
per branch: `git checkout -b <branch> main` → `git checkout 002efa1f4 -- <paths>` → small fixups
→ one clean commit → `yarn build`. Granular history stays on `v1/espresso-tokens`; the feature
branches get clean, reviewable, main-compatible commits.

---

## Step 0 — Commit the WIP onto `v1/espresso-tokens` (no loss, clean tree)
Four logical commits (all token-side; none of this goes to feature branches):
1. `chore(tokens): adopt refreshed espresso-2.0 export + drift-audit script`
   — `espresso-v2-design-tokens/*`, `tailwind/colors.json`, `tailwind/generated/*`,
   `tailwind/figma-tokens-to-theme.js`, `tailwind/audit-token-drift.cjs`
2. `refactor(tokens): migrate surface-white→base, surface-gray-5/6/7→8/9/10`
   — the codemod hits across `src/`, `docs/`, `frappe/`, `skills/`, `tailwind/plugin.js`
3. `docs: add per-component Builders + Checkbox stories`
   — 22 `*Builder.vue`, `Checkbox/stories/*`, `ComponentPlayground.vue`, theme index
4. `docs: token-refactor planning notes` — `TOKEN_REFACTOR_PLAN.md`, `TOKEN_DIFF_*.md`,
   `BRANCH_SPLIT_PLAN.md`

> Record `002efa1f4` as the extraction source **before** these commits move the tip.

---

## Branch 1 — `feat/icon` (off `main`)  ·  risk: LOW
- **Contents:** `src/components/Icon/**` (Icon.vue, Icon.cy.ts, index.ts) + Icon export line in `src/index.ts`.
- **Source:** commit `984cf763c`.
- **Deps:** none. **Refactor-only tokens:** none (verified).
- **Fixups:** trim `src/index.ts` to add only the Icon export.
- **Verify:** `yarn build`, `Icon.cy.ts`.

## Branch 2 — `feat/pill-tabbuttons` (off `main`)  ·  risk: MEDIUM
- **Contents:** `src/components/Pill/**`, `src/components/TabButtons/**` (overwrites main's TabButtons),
  Pill export in `src/index.ts`, `TabButtons.cy.ts`, stories.
- **Source:** Pill/TabButtons files at `002efa1f4` (captures `feat(pill)`, the underline fix,
  `refactor(tab-buttons)!`, story refresh, dropped old story).
- **Deps:** Pill must land before/with TabButtons (same branch — fine).
- **Refactor-only token fix:** `Pill.vue` `shadow-base` → **`shadow-sm`** (main-compatible). *(decision below)*
- **Excluded:** the elevation commit `7b9c26cf3` (token work) — only its `shadow-base` line matters, handled above.
- **Verify:** `yarn build`, `TabButtons.cy.ts`.

## Branch 3 — `feat/docs-playground` (off `main`)  ·  risk: MEDIUM-HIGH
- **Contents:** `docs/components/Docs/ComponentPlayground.vue` (generic playground infra),
  `docs/.vitepress/config.ts` (shiki fix), theme registration, **and only the Builders whose
  components exist on main** (Alert, Avatar, Breadcrumbs, Checkbox, Combobox, Dialog, Divider,
  Dropdown, ErrorMessage, FormControl, MultiSelect, Password, Progress, Rating, Select, Slider,
  Switch, Tabs, TextInput, Textarea, Tooltip).
- **Excluded from this branch:** `PillBuilder`, `TabButtonsBuilder` (components not on main →
  belong with Branch 2 or added post-merge), `ButtonBuilder`, `BadgeBuilder` (Button/Badge are
  refined on the token branch → their Builders stay there).
- **Source:** `92354320c`, `0fd252c2d`, `3aea83b0b` + the WIP Builder files (from the Step-0 commit).
- **Refactor-only token check:** must confirm `ComponentPlayground.vue` + included Builders use no
  `shadow-base`/`surface-base`/`gray-8-10`; substitute any that do. *(verify during execution)*
- **Verify:** `yarn docs:build`.

---

## Resulting topology
```
main
 ├─ feat/icon                 (Icon renderer)
 ├─ feat/pill-tabbuttons       (Pill + TabButtons refactor)
 └─ feat/docs-playground       (ComponentPlayground + main-compatible Builders)
v1/espresso-tokens             (unchanged: token refactor, foundations docs, focus-ring
                                adoption, Button/Badge Figma alignment, elevation,
                                all WIP codemods/adoption, Pill/TabButtons/Button/Badge Builders)
```

## Decisions to confirm before executing
1. **`shadow-base` on Pill** → substitute to `shadow-sm` (proposed), or `shadow` (DEFAULT), or keep
   `shadow-base` and accept it's a no-op on main?
2. **Branch names** — `feat/icon`, `feat/pill-tabbuttons`, `feat/docs-playground` ok?
3. **Method** — content-snapshot (proposed) vs. cherry-pick preserving granular history?
4. **`docs-playground` builder scope** — confirm Pill/TabButtons/Button/Badge Builders are
   *excluded* (their components aren't on main / are token-refined). They stay on the token branch.
5. **Push/PRs?** — create locally only, or also push + open draft PRs per branch?
