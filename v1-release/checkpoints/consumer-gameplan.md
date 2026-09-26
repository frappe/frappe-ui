# Checkpoint — consumer validation, gameplan on a real bench

Candidate: `v1/rc-api` @ `2a7111e3c6`, worktree `/Users/netchampfaris/Projects/worktrees/rc-integration`.
Bench: `/Users/netchampfaris/Projects/benches/frappe-bench`, app `apps/gameplan`, site `gameplan-demo.test`.
Date: 2026-09-09.

This is the check `rc-progress.md` recorded as unverified: "CRM, Helpdesk and Gameplan were not
built or booted against the candidate." Gameplan is now built **and booted**. CRM and Helpdesk
are still unverified.

## Bench state before any change

Recorded before touching anything.

| Thing | Value |
| --- | --- |
| `apps/gameplan/frontend/node_modules/frappe-ui` | symlink → `../../frappe-ui` |
| ...which resolves to | `apps/gameplan/frappe-ui`, version `1.0.0-beta.46` |
| `apps/gameplan/frappe-ui` git | branch `main`, `73f9a49f2c0f84c23001bde32a37ae4c0cbf8afb`, **clean** |
| `apps/frappe-ui` | symlink → `/Users/netchampfaris/Projects/frappe-ui` (the user's primary checkout) |
| `apps/gameplan` git | branch `fix/no-gameplan-role-access`, `c1327e1da41abf31af838f56c77549d513c2c7be` |
| `apps/gameplan` git status | ` M frontend/src/components/AppSidebar.vue` plus three untracked `frappe-ui-*` dirs |
| `apps/gameplan` skip-worktree | `S frappe-ui` |
| `apps/gameplan/gameplan/public/frontend` | 100 files, all dated 27 Aug 21:36 |
| `apps/gameplan/gameplan/www/g.html` | 12872 bytes, sha1 `9f7de27c595de8dbe3e3f6c3e4a19d32080b5e54` |

`AppSidebar.vue` was **already modified before this run**. It is somebody else's work in progress
and was never touched.

## What was changed, and the restore

Changed, in order:

1. `node_modules/frappe-ui` repointed three times (baseline worktree → candidate → bench checkout).
   `apps/gameplan/frappe-ui` was never checked out to another branch, and `apps/frappe-ui` was never
   touched.
2. `gameplan/public/frontend` and `gameplan/www/g.html` were overwritten by `vite build`. Both were
   copied to `/tmp/rc-gameplan-backup/` first.
3. `frontend/src/components/AppRail/AppRail.vue` was patched temporarily, and only after the build
   failure below had already been recorded verbatim. Reason: the rail rename is a hard build error,
   so nothing downstream of it can be measured until the import is migrated. The patch is the
   migration the release notes already prescribe. Backup at `/tmp/rc-gameplan-backup/AppRail.vue.orig`.
4. A `bench serve` process on port 8901, started with `DEV_SERVER=1`, killed afterwards.

No commit, no stage, no push, no `git stash`, no `gh` command, no migration, no destructive site
command anywhere in the bench.

**Restore, re-read after the fact:**

| Thing | After |
| --- | --- |
| `node_modules/frappe-ui` | symlink → `../../frappe-ui`, resolves to `1.0.0-beta.46` — matches |
| `apps/frappe-ui` | symlink → `/Users/netchampfaris/Projects/frappe-ui`, mtime still `Aug 30 2025` — untouched |
| `apps/gameplan/frappe-ui` | `main`, `73f9a49f2c0f84c23001bde32a37ae4c0cbf8afb`, clean — matches |
| `apps/gameplan` | `c1327e1da41abf31af838f56c77549d513c2c7be`, `fix/no-gameplan-role-access` — matches |
| `apps/gameplan` git status | ` M frontend/src/components/AppSidebar.vue` + the same three untracked dirs — matches |
| `AppRail.vue` | sha1 `c3ea0c908b9a17586f08198d7b2df79b87a7c27a`, the pre-run value — byte-exact |
| `public/frontend` | 100 files, timestamps back to 27 Aug 21:36 |
| `www/g.html` | sha1 `9f7de27c595de8dbe3e3f6c3e4a19d32080b5e54` — matches |
| port 8901 | free |

The bench is in its original state. The one thing not reverted is session rows on
`gameplan-demo.test` from logging in, which is ordinary use of a test site.

## Choice of baseline

The bench ships `beta.46`. Comparing `beta.46` against the candidate would mix 16 betas of unrelated
change into every difference. The A/B below therefore uses **`main` @ `2d65281be8` (`beta.62`)** — the
RC's own base — from the worktree at
`/Users/netchampfaris/Projects/frappe-ui/.claude/worktrees/agent-a47f898eabb187fe2`. Every "before"
number is `beta.62` unless it says otherwise. `beta.46` is used once, to date the settings-dialog
regression in §5.

## 1. Build

Command: `yarn build` in `apps/gameplan/frontend` (plain `vite build`; **not** `yarn dev`, which runs
`unlink-frappe-ui.mjs` and would have reinstalled the published package over the symlink).

**Baseline, `main` @ `2d65281be8`:** exit 0.

```
✓ built in 3.69s
Done in 5.16s.
```

**Candidate, `v1/rc-api` @ `2a7111e3c6`, gameplan source untouched:** exit 1.

```
✗ Build failed in 2.87s
error during build:
Build failed with 2 errors:

[MISSING_EXPORT] "Rail" is not exported by "../../../../../worktrees/rc-integration/src/index.ts".
    ╭─[ src/components/AppRail/AppRail.vue?vue&type=script&setup=true&lang.ts:20:10 ]
 20 │ import { Rail, RailItem } from "frappe-ui";
   │          ──┬─
   │            ╰─── Missing export

[MISSING_EXPORT] "RailItem" is not exported by "../../../../../worktrees/rc-integration/src/index.ts".
    ╭─[ src/components/AppRail/AppRail.vue?vue&type=script&setup=true&lang.ts:20:16 ]
 20 │ import { Rail, RailItem } from "frappe-ui";
   │                ────┬───
   │                    ╰───── Missing export
```

**Candidate with `AppRail.vue` migrated (the temporary patch):** exit 0.

```
✓ built in 3.49s
Done in 4.45s.
```

Two things follow. The rail rename is loud, as intended — gameplan cannot build at all against the
candidate until one file is edited. And the other two breaks are confirmed silent: with the rail
import fixed, the build is clean while both the `list-cols` removal and the `FormLabel.size` removal
are live in the tree.

One operational note that belongs to the bench and not to frappe-ui: `frappe-ui/vite`'s
`buildConfig` sets `emptyOutDir: true`, so the failed build **wiped**
`gameplan/public/frontend` down to two files before erroring. A consumer who hits this break on a
deployed bench loses the served frontend, not just the build. Restored from backup here.

## 2. Rail rename — observed

The import break is above. The `data-slot` half was read out of the live DOM on the discussions
screen, on both arms, by counting every `data-slot` value on the page:

| Arm | Rail-family `data-slot` values present |
| --- | --- |
| `beta.62` | `rail`, `rail-item`, `rail-item-indicator`, `rail-item-badge-dot` |
| candidate | `sidebar-rail`, `sidebar-rail-item`, `sidebar-rail-item-indicator`, `sidebar-rail-item-badge-dot` |

Counts on both arms: 1 rail, 8 rail items, 1 indicator, 2 badge dots. The rename is complete and
carries no other change.

Gameplan has **zero** CSS or query selectors on those values, so nothing in gameplan observes the
rename. Confirmed against the source: the only `data-slot` selector in gameplan is
`DesktopLayout.vue:50`, `[data-slot='desktop-shell-content']`, and that value is unchanged in the
candidate.

The two full-shell screenshots — same screen, same viewport, one per arm — are **byte-identical**
(sha1 `33db81413bcc6707a35364a5a049b333c96d5907` for both). The rail rename costs gameplan one import
line and changes nothing a user sees.

## 3. Input scale and form typography — observed

Screen: `/g/profile/customize`, with a bento card selected so the `FormLabel size="md"` sites in
`ProfileBentoEditorPanel.vue` render. Measured with `getComputedStyle` on every `<label>`.

| Label | `beta.62` | candidate |
| --- | --- | --- |
| Avatar / Title / Size / Rendering | `font-size: 14px`, colour `srgb(0.479 0.479 0.479)` | `font-size: 13px`, colour `srgb(0.600 0.600 0.600)` |

That is `text-base` in `ink-gray-5` becoming `text-sm` in `ink-gray-6`, in dark theme, exactly as
`checkpoints/inputs.md` describes. Visually smaller and lighter; nothing overflows or reflows.

**One thing the migration notes do not mention.** With `size` gone from `FormLabelProps`, it is no
longer a declared prop, so Vue passes it through as a fallthrough attribute. The rendered element in
the candidate is literally:

```html
<label size="md" class="block text-sm text-ink-gray-6" for="…">Size</label>
```

Read back from the live DOM: `label.getAttribute('size')` returns `"md"` on the candidate and is
absent on `beta.62`. `size` is not a valid attribute on `<label>`, so this is invalid HTML that no
build step flags. It is cosmetic — nothing reads it — but it means the 29 org-wide `FormLabel
size="md"` call sites do not merely stop having an effect, they start emitting a junk attribute. It
strengthens the case for actually deleting the attribute downstream rather than leaving it.

Input `xl` does not touch gameplan. The 14 `size="xl"` / `size="2xl"` hits in gameplan source are all
`Avatar`, `UserAvatar` or `Dialog`, and the candidate still declares `xl` and `2xl` on both
(`Avatar/types.ts:17`, `Dialog/types.ts:9-13`). Confirms the census figure of 0.

## 4. List `columns` — observed

Three independent measurements, because this break is the one that fails quietly.

**(a) Tailwind, isolated from the JS build.** Ran `npx tailwindcss` with gameplan's own
`tailwind.config.js` and content globs, from `apps/gameplan/frontend`, once per arm, on an input of
just the three `@tailwind` directives:

| Arm | rules matching `list-cols` | rules matching `list-gap` (control) |
| --- | --- | --- |
| `beta.62` | **4** | 4 |
| candidate | **0** | 4 |

The four that disappear are exactly gameplan's four call sites:

```
.max-md\:list-cols-\[1\.25rem_minmax\(0\2c 1fr\)\]        { --list-columns: 1.25rem minmax(0,1fr); }
.max-md\:list-cols-\[1\.25rem_minmax\(0\2c 1fr\)_2rem\]   { --list-columns: 1.25rem minmax(0,1fr) 2rem; }
.max-md\:list-cols-\[minmax\(0\2c 1fr\)\]                 { --list-columns: minmax(0,1fr); }
.max-md\:list-cols-\[minmax\(0\2c 1fr\)_auto\]            { --list-columns: minmax(0,1fr) auto; }
```

`list-gap-1`, `list-gap-3`, `list-gap-4` and `list-gap-12` are generated identically on both arms,
from the same class attributes in the same files. So the disappearance is the utility being removed,
not the content scan missing the files.

**(b) The real production bundle.** Same result in `gameplan/public/frontend/assets/*.css`:
`beta.62` contains the four rules inside `@media not all and (width>=768px)`; the candidate contains
the string `list-cols` zero times, while all four `list-gap-*` rules survive.

**(c) Runtime, in the booted app.** On a live gameplan `List` (the discussions list, 31 rows) at a
700px viewport, added `max-md:list-cols-[minmax(0,1fr)]` to the element and read
`gridTemplateColumns` off the first row:

| Arm | before adding the class | after adding the class |
| --- | --- | --- |
| `beta.62` | `40px 268.984px 44.0156px` | `385px` — collapses to one track |
| candidate | `40px 268.984px 44.0156px` | `40px 268.984px 44.0156px` — **no change** |

Screenshots of that exact moment: `D-before-beta62-listcols-works-700.png` (rows collapsed into a
single column, orange outline on the list) and `D-after-candidate-listcols-noop-700.png` (unchanged).

Also measured on the candidate: setting `--list-columns` on the list's **parent** has no effect
either (`gridTemplateColumns` unchanged), and the list's own computed `--list-columns` is the empty
string rather than `auto minmax(0, 1fr) auto`. Inheritance and the public variable are both gone, as
ADR-0017 now says. `--list-gap` and `--list-row-padding-x` still work on both arms.

**Consequence for the four Configure lists.** Each has a desktop `columns` array and a `max-md:`
override that narrows the grid to the cells that stay visible (the rest carry `max-md:hidden`).
With the override dead, the desktop track list applies at every width, and `display: none` does not
remove a declared track — `minmax(12rem, 1fr)` still reserves 12rem while empty. Minimum track
widths, before gaps:

| File | desktop tracks | intended `max-md` tracks | minimum width once the override is dead |
| --- | --- | --- | --- |
| `CommunityMembersList.vue` | `1.25rem, minmax(12rem,1fr), minmax(12rem,1fr), 8rem, 1.5rem` | `1.25rem, minmax(0,1fr)` | ~34.75rem (556px) |
| `CommunityGuestsList.vue` | `1.25rem, minmax(12rem,1fr), minmax(12rem,1fr), 8rem, 3rem` | `1.25rem, minmax(0,1fr), 2rem` | ~36.25rem (580px) |
| `CommunitiesList.vue` | `minmax(12rem,6fr), minmax(6rem,1.2fr), minmax(6rem,1.2fr), 1.5rem` | `minmax(0,1fr)` | ~25.5rem (408px) + 3×`list-gap-12` |
| `CommunitySpacesList.vue` | `minmax(8rem,1fr), 15.25rem, 5rem, 1.5rem` (guests) | `minmax(0,1fr), auto` | ~29.75rem (476px) + `list-gap-12` |

**The band where this actually bites is 640–767px, not "mobile".** Gameplan swaps to `MobileLayout`
below 640px (`utils/useIsMobile.ts`, `max-width: 639.98px`), and the Settings dialog that hosts all
four lists only exists in `DesktopLayout`. `max-md:` stops at 768px. So the four overrides only ever
applied in a 128px-wide window band — small laptop windows and split-screen. Above 768px nothing
changes; below 640px these components never render. That makes the break narrower than the raw count
of four call sites suggests, but it is still a real overflow inside that band.

The overflow itself is **computed, not seen** — see §5.

## 5. Blocking finding: gameplan's Settings dialog is already dead on `main`

Not caused by this RC, but it blocks part of this check and it will hit the RC soak.

All four `list-cols` call sites live inside gameplan's Settings dialog (Settings → Communities).
The dialog does not open at all on `main` @ `2d65281be8`.

Same site, same session (`maya@moonhollow.studio`, a Gameplan Admin with real data: 4 communities,
14 spaces, 82 members), same 700px viewport, same script, same waits, only the frappe-ui build
differing:

| frappe-ui | `/settings/communities` opens? | Configure `List` present in DOM? |
| --- | --- | --- |
| `beta.46` (what the bench ships) | **yes** — `App settings` renders, `CommunitiesList` present with `--list-columns: minmax(0,1fr)` and `grid-template-columns: minmax(0px, 1fr)` | yes |
| `main` @ `2d65281be8` (`beta.62`) | **no** | no |
| candidate `2a7111e3c6` | **no** | no |

The dialog element is mounted but closed: eight `dialog-scroll-container` divs are in `<body>`, each
with `<!---->` for content. No console error and no Vue warning — it fails silently.

Best hypothesis, not confirmed: `App.vue:14` gates the dialog on `usersReady`, which latches
`useCall(...).isFinished` for `gameplan.api.get_user_info`. The network panel shows that request
returning **200**, yet the flag never flips — `DevUserSwitcher`, gated on the same flag, is also
absent. That points at `useCall`'s `isFinished` between `beta.46` and `beta.62`. Bisecting it was out
of scope here.

Consequence for this validation: the four Configure lists could not be rendered on either the
baseline or the candidate, so their overflow is reasoned from the track lists in §4 rather than
seen. Everything else in §4 was measured directly.

## Screenshots

All under `/tmp/rc-gameplan-shots/`, all from the booted app on `gameplan-demo.test`, dark theme.

| File | What |
| --- | --- |
| `A-before-beta62-shell-rail-1440.png` | desktop shell with the rail, baseline |
| `A-after-candidate-shell-rail-1440.png` | same screen, candidate — byte-identical to the above |
| `B-before-beta62-profile-customize-1440.png` | the `FormLabel` screen, baseline |
| `C-before-beta62-formlabels-panel.png` | editor panel, labels at 14px `ink-gray-5` |
| `C-after-candidate-formlabels-panel.png` | same panel, labels at 13px `ink-gray-6` |
| `D-before-beta62-listcols-works-700.png` | `max-md:list-cols-[…]` applied to a live list: collapses to one column |
| `D-after-candidate-listcols-noop-700.png` | same class, candidate: no effect |

Build logs: `/tmp/rc-gameplan-build/*.log`. Generated stylesheets:
`/tmp/rc-gameplan-build/tw-baseline.css`, `/tmp/rc-gameplan-build/tw-candidate.css`.

## What gameplan needs, in order

1. `AppRail.vue` — rename the import and the four tags. Blocks the build. One file.
2. The four `list-cols-[…]` classes → the `columns` object form, e.g.
   `class="max-md:list-cols-[minmax(0,1fr)]" :columns="[…]"` becomes
   `:columns="{ base: ['minmax(0,1fr)'], md: [ … ] }"`. Silent; costs column overflow in the
   640–767px band.
3. Four `FormLabel size="md"` attributes → delete. Silent; currently emits invalid HTML.

None of this was applied. Item 1 was applied temporarily and reverted.

## Unverified

- The four Configure lists were never rendered against the candidate, because of §5. Their overflow
  is computed from the track lists, not observed.
- Only one gameplan site (`gameplan-demo.test`) and one user were used.
- Light theme was not checked; every measurement is dark theme.
- No Cypress run against the candidate. Gameplan's suite runs against `bench build` output and would
  have needed the source patch left in place.
- CRM and Helpdesk remain unbuilt and unbooted.
- Socket.io was not running on the test bench (port 9000 refused), so nothing realtime was exercised.
- The `useCall(...).isFinished` hypothesis in §5 is a hypothesis. Not bisected.

## Verdict

Safe for gameplan, with one file to migrate before it builds and two more before it is correct.

Nothing surprising was found in the three breaks themselves. The rail rename is loud, complete, and
pixel-identical afterwards. The typography change lands exactly as documented. The `list-cols`
removal behaves exactly as the list track described, and its blast radius in gameplan is smaller
than four call sites suggests — a 128px window band, not all of mobile.

Two things the notes do not cover: `FormLabel size="md"` now renders as a stray `size` attribute on
`<label>`, and a failed consumer build empties the served frontend because `emptyOutDir` is on.

The thing that should hold up the RC is §5, and it is not this pull request's fault: gameplan's
entire Settings surface is already broken on `main` @ `2d65281be8`, silently, and it works on
`beta.46`. #1029's one-week soak starts from a real boot, and a real boot of gameplan today has no
Settings dialog. That regression wants a bisect before the tag.
