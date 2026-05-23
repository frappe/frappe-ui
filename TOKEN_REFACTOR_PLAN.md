# Espresso Token Refactor — Working Plan

> **Temporary planning doc.** Tracks the token migration on `v1/espresso-tokens`.
> Delete before merge. Each phase is **gated**: I stop and wait for your explicit
> approval before starting the next one.

## Strategy (decided)

Legacy semantic classes (e.g. `bg-surface-white`) are migrated with a **back-compat
window**:

1. **Alias** each legacy token to its true Figma successor (`surface.white → surface.base`).
   Non-breaking; corrects the value immediately; the alias can never silently drift
   from its successor again.
2. **Codemod frappe-ui's own `src/`** to use the canonical names.
3. **Keep the aliases** (marked deprecated) so external app authors migrate on their
   own schedule. **Do not remove them in this branch.**

## Source of truth & pipeline

- **Canonical token set** = Figma export in `espresso-v2-design-tokens/`
  (`Styles.Light.tokens.json`, `Styles.Dark.tokens.json`).
- **Generator** = `tailwind/figma-tokens-to-theme.js` (`yarn sync-tokens`). It reads
  the Figma export and emits the themed token JSON.
- **Legacy tokens are intentional shims**, hand-maintained in the generator:
  - `ALIASES` — legacy name tracks a current Figma name (e.g. `gray-modals → gray-modal`).
  - `LEGACY_ENTRIES` — legacy name pinned to a raw primitive (where no successor was
    chosen yet). Our migration **moves the 8 used tokens from `LEGACY_ENTRIES` → `ALIASES`.**
- **Audit engine** = `tailwind/audit-token-drift.cjs` — re-runnable 3-bucket report.
  Run any time: `node tailwind/audit-token-drift.cjs`

> ⚠️ **Wiring gap (fix in Phase 1):** `yarn sync-tokens` writes only
> `tailwind/generated/colors.json`, but the plugin imports the top-level
> `tailwind/colors.json`. They are kept in sync by a **manual copy** today. Phase 1
> closes this so `yarn sync-tokens` is the single reproducible source.

> 🚨 **Stale export (blocks Phase 2):** the repo's `espresso-v2-design-tokens/` is
> **behind live Figma**. Live Figma defines tokens the export lacks — confirmed via the
> Helpdesk reference frame (node `26986-45575`): `ink/white`, `surface/sidebar`,
> `surface/gray-9`, `surface/gray-10`, `surface/elevation-3`. Consequence: the Bucket-3
> "legacy" list is **contaminated** — e.g. `ink.white` was flagged legacy only because it
> was missing from the stale export, but it's a *live* token. **Phase 2 must start by
> re-exporting tokens from live Figma**, then re-running `yarn sync-tokens` + the audit.
> The migration is also **additive** (adopt `surface.sidebar`, `surface.gray-9/10`,
> `surface.elevation-3`), not only deprecation.

## The three buckets (audit model)

| Bucket | What | Risk | Owner |
| --- | --- | --- | --- |
| **1. Build-breaking** | ref → shade that no longer exists | loud | script |
| **2. Silent drift** | token kept, resolved hex changed | dangerous | script flags, **you eyeball** flips |
| **3. Legacy** | token in code, absent from Figma | fuzzy | **Figma decides**, script applies |

Current headline: **Bucket 1 = 0**, Bucket 2 = 79 (mostly intended re-tunes),
Bucket 3 = 19 legacy (8 used in `src/`, 11 unused).

---

## Phase 0 — Tooling & baseline ✅ (done, for your review)

**Goal:** a re-runnable audit so "find all the quirks" and "is it done" are mechanical.

- [x] `tailwind/audit-token-drift.cjs` written, runs clean, reproduces the
      `surface-white` quirk you found by hand
- [x] Confirmed Figma export is the source of truth; legacy tokens are generator shims
- [x] Baseline = tag `v0.1.278`

**How to review:** run the audit; spot-check that it reproduces a known case (see the
validation we ran). The decision: *do you trust this as the find-everything / done instrument?*
**Gate:** approve the approach → Phase 1.

---

## Phase 1 — Fix wiring + delete dead tokens (zero visual risk)

**Goal:** make the generator the single source, then drop the 11 unused legacy tokens.

**What I do:**
- Close the wiring gap: `yarn sync-tokens` writes (or copies to) the consumed
  `tailwind/colors.json` — no more manual copy.
- Remove the 11 **zero-use** legacy entries from `LEGACY_ENTRIES`:
  `surface.{cards,cyan-1,pink-1,orange-1,violet-1}`, `ink.{cyan-1,pink-1}`,
  `outline.{white,green-1,amber-1,orange-1}`.
- Re-run `yarn sync-tokens`.

**What changes:** `figma-tokens-to-theme.js`, `package.json` (sync script), regenerated
`colors.json`. **No component touched. No render change** (these tokens have 0 usages).

**How to review:**
- Diff the generator + `colors.json` (pure deletions of the listed keys).
- Re-run audit → Bucket 3 drops 19 → 8, all remaining have uses > 0.

**Gate:** approve → Phase 2.

---

## Phase 2 — Refresh export, re-classify, resolve successors (no `src/` change)

**Goal:** rebuild a trustworthy token set from live Figma, then resolve successors for
whatever is *genuinely* legacy after the refresh.

**Step 2a — Re-export from live Figma (prerequisite).** Re-run the Figma token export
into `espresso-v2-design-tokens/`, then `yarn sync-tokens` + audit. This removes the
stale-export contamination before any classification is trusted.

**Step 2b — Re-classify.** Re-run `audit-token-drift.cjs`. The fresh Bucket 3 is the real
legacy list. Expect it to *shrink* (tokens like `ink.white` reclassify as live).

**Step 2a status:** ✅ **ADOPTED.** Refreshed export (`design-tokens-new.zip`) copied into
`espresso-v2-design-tokens/`, `yarn sync-tokens` run, library build green.
Audit vs `v0.1.278`: **Bucket 1 = 0** (no breakage), Bucket 2 = 89, Bucket 3 = 20.

Generator changes made during adoption (`tailwind/figma-tokens-to-theme.js`):
- **Wiring fix** — `sync-tokens` now copies `colors.json` to the consumed top-level path
  (no more manual copy; the footgun is closed).
- **`neutral.transparent`** primitive now propagated (new `surface.sidebar` dark refs it).
- **Non-regressive legacy pins** for tokens the refresh removed but `src/` still uses:
  `surface.menu-bar` (pinned to current `gray/50` / `gray/950`), `outline.gray-modals`
  (pinned to current `gray/200` / `gray/600`), `surface.gray-2-contrast` (pinned to current
  `white` / `gray/600`). These keep rendering identical; their *Figma successors*
  (`menu-bar→sidebar`, `gray-modals→gray-1`) are deferred to Phase 3/4 because the
  successor behavior differs (e.g. `sidebar` is transparent in dark mode).

Verification done: every `surface/ink/outline` class used in `src/` still resolves;
new additive tokens present (`base`, `sidebar`, `gray-8/9/10`, `elevation-1/2/3`, …);
`vite build` succeeds and the classes appear in the compiled CSS.

**Pre-existing dead classes found (NOT adoption-caused, left for separate cleanup):**
`text-ink-blue-600` (MemberPicker story → should be `ink-blue-3`), `text-ink-gray-700`
(LinkPopup → `ink-gray-7`), `border-outline-gray-8` (Checkbox → no such token). These never
resolved, even before this branch.

**Step 2c — Adopt new tokens** (added by the refresh): surface `gray-8/9/10`, `sidebar`,
`elevation-1/2/3`; ink `gray-9`; outline `gray-6/7`, `elevation-1/2`.

**New removals introduced by the refresh** (migrate these — successors found):

| removed token | uses | successor → | note |
| --- | --- | --- | --- |
| `surface.menu-bar` | 3 | `surface.sidebar` | light exact (`gray.50`); **dark → `transparent`** — verify |
| `outline.gray-modals` | 10 | `outline.gray-1` | exact `#ededed` (matches live frame) |
| `surface.{base,gray-1,gray-2}-contrast`, `outline.gray-1-contrast` | ≤1 | drop | negligible usage |

**New silent drift introduced by the refresh** — surface gray ramp lightened (top visual risk):
`light surface.gray-5/6/7` = `gray.700/800/900 → gray.400/500/600` (~38 uses);
`dark surface.gray-1/5/6/7` re-tuned; `dark ink.gray-4` `450 → 400`.

**Step 2d — Successor table** (white/ink-white reconfirmed legacy after refresh):

| legacy token | uses | successor → | status |
| --- | --- | --- | --- |
| `surface.white` | 47 | `surface.base` | ✅ confirmed (frame + fresh export) |
| `ink.white` | 39 | `ink.base`? | confirmed legacy; successor needs Figma |
| `ink.gray-9` | 34 | `ink.gray-8`? | now also a real token (`ink.gray-9` added) — recheck intent |
| `surface.modal` | 18 | ? | needs Figma |
| `outline.gray-modals` | 10 | `outline.gray-1` | ✅ exact match |
| `surface.menu-bar` | 3 | `surface.sidebar` | ✅ (verify dark) |
| `outline.blue-1` | 2 | ? | needs Figma |
| `outline.red-1` | 2 | ? | needs Figma |
| `surface.selected` | 1 | ? | needs Figma |

**Next action:** adopt the refreshed export into `espresso-v2-design-tokens/`, re-run
`yarn sync-tokens` + audit to regenerate authoritative buckets, then finalize the remaining
`?` successors against Figma.

**What changes:** `espresso-v2-design-tokens/` (refreshed) + regenerated `colors.json` +
this table. No `src/` edits.
**How to review:** confirm the rebuilt Bucket 3 + the completed successor table.
**Gate:** approve the table → Phase 3.

---

## Phase 3 — Alias the 8 used tokens (non-breaking value correction)

**Goal:** move the 8 from `LEGACY_ENTRIES` → `ALIASES`, pointing at their successors.
Old classes keep working but now track the correct successor value.

**What I do:** edit the generator's `ALIASES`/`LEGACY_ENTRIES`, re-sync.

**What changes:** `figma-tokens-to-theme.js` + regenerated `colors.json`.
**`src/` is NOT touched yet** — every existing `bg-surface-white` still renders, just
with the corrected value (e.g. dark `#1f1f1f → #171717`).

**How to review:**
- Audit Bucket 2 now shows the legacy tokens snapping to successor values.
- **Visual:** I build docs; you confirm light + dark for components using these tokens.

**Gate:** your visual approval → Phase 4.

---

## Phase 4 — Codemod frappe-ui `src/` to canonical names

**Goal:** rewrite frappe-ui's own usages to the canonical names. **Aliases stay** as the
public back-compat surface for app authors.

**What I do:**
- Write `tailwind/migrate-legacy-tokens.cjs` from the approved table.
- Rewrite class usages across `src/` (`bg-surface-white → bg-surface-base`, …).
- Leave the `ALIASES` entries in place (deprecated, still emitted).

**What changes:** ~120 usages across `src/`. No `colors.json` change (aliases remain).

**How to review:**
- Diff is mechanical renames — spot-check a few components.
- Audit: legacy names have **0 internal uses**, but aliases are **still defined**.
- **Visual:** light + dark for touched components.

**Gate:** your visual approval → commit. Proceed to Phase 5.

---

## Phase 5 — Deprecation comms, silent-drift triage, reconcile

**Goal:** signal the deprecation to app authors, confirm Bucket 2, and finalize.

**What I do:**
- Mark the aliases deprecated (comment in generator + a note in docs/changelog so app
  authors know `bg-surface-white` etc. are kept temporarily and what to use instead).
- Triage the 79 Bucket-2 drifts: split "trivial re-tune" vs "role-flip"; surface the
  flips with before/after swatches; cross-check against Figma. High-impact flips to verify:
  `light/dark surface.{green,blue,amber}-3`, `dark.ink.violet-1 → white`.

**Done =**
- [ ] Bucket 1 stays at `0`
- [ ] Bucket 3 **internal** uses = `0` (aliases retained for app authors)
- [ ] Bucket 2 fully triaged (every change intended)
- [ ] Aliases documented as deprecated, with migration guidance for app authors
- [ ] Docs render correctly light + dark for all touched components
- [ ] Separate the in-flight **docs Builders** thread into its own commit(s)
- [ ] Delete this plan + `TOKEN_DIFF_*.md` scratch docs

**Gate:** your sign-off → branch ready for review/merge.

---

## Out of scope / parked

- The 21 `*Builder.vue` docs components + `.md` edits + new Checkbox stories — a separate,
  mostly-additive thread; committed on its own at the end, not entangled with token work.
- `borderRadius`, `boxShadow`, `fontSize`, focus-ring utilities — landed in earlier
  commits; not part of this color sweep unless the audit surfaces an issue.
- **Removing the aliases** — explicitly deferred. App authors get a migration window;
  removal is a future breaking change, not this branch.
