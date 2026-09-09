# Checkpoint — inputs / typography track (#1117, #1118)

- **Branch**: `v1/rc-inputs`
- **Base**: `2d65281be8` (`v1.0.0-beta.62`) on `main`
- **Contract**: `v1-release/rc-implementation-handoff.md` §2 + decision brief D2/D3
  (both untracked here; owned by the integration agent)
- **Status**: implementation complete, all checks green. Nothing pushed, no PR.

## Confirmed contract (not relitigated)

- Input sizes `xs / sm / md / lg`; single-line heights **24 / 28 / 32 / 40px**.
- Add `xs` everywhere; remove input `xl`.
- Labels, descriptions and Textarea text fixed at **13px**.
- Labels and descriptions default to **`ink-gray-6`** (Textarea *value* colour unchanged).
- Textarea `size` drives spacing + min-height only.
- `FormLabel.size` removed.
- Progress / Slider / toggle scales untouched.

Note: issue #1118's table asks for a graduated Textarea scale (13/14/15/16px).
The confirmed D3 decision supersedes it — flat 13px at every size. Implemented
per the decision, not the issue.

## Commits

| SHA | Subject |
| --- | --- |
| `e630725664` | `docs(v1-release): add inputs track checkpoint` |
| `3f69ae7a29` | `feat(inputs)!: xs/sm/md/lg input scale and fixed 13px form typography` |
| `af43176e6d` | `test(inputs): assert computed geometry for the xs/sm/md/lg scale` |
| `3ed7d7753d` | `docs(inputs)!: document the xs/sm/md/lg scale and fixed form typography` |
| `7f54247bd4` | `fix(inputs): report a stale input size once, naming the family` |

## Done

### Size scale

Six declarations of the scale updated to `xs | sm | md | lg`:

| Declaration | File |
| --- | --- |
| `InputSize` | `src/composables/inputTypes.ts` |
| `SelectionSize` | `src/components/shared/selection/utils.ts` |
| `ItemListSize` | `src/components/ItemListRow/types.ts` |
| `ComboboxSize` | `src/components/Combobox/types.ts` |
| `MultiSelectSize` | `src/components/MultiSelect/types.ts` |
| Select inline union | `src/components/Select/types.ts` |

`FormControl.size` widened from `sm | md` to `InputSize`. It clamps `lg` to `md`
for `type="checkbox"`, which renders on `ToggleSize` and has no `lg`.

Class maps given an `xs` row and stripped of `xl`: `TextInput.vue` (3),
`Textarea.vue` (2), `Rating.vue` (1), `shared/selection/utils.ts` (4),
`Select/utils.ts` (1), `ItemListRow.vue` (1),
`experimental/CodeEditor/CodeEditor.vue` (1).

New `xs` values follow the existing `Button` xs precedent (`h-6`, `text-xs`,
`rounded-3`, `px-1.5`), so a 24px input and a 24px button match.

Downstream via `InputSize`, no local map: `Password`, `TimePicker`, `Duration`,
the `DatePicker` family, `shared/picker/PickerShell.vue`.
Downstream via `SelectionSize`: `experimental/MultiEmailInput`.

### Invalid runtime size

Every input size lookup was a bare object index, so a stale `size="xl"` from a
JS call site yielded `undefined` and shipped an element with no height, font,
radius or padding class and no warning. All of them now go through the existing
`resolvePropValue` (the `Badge` #1069 utility): fall back to the component's own
default, warn once in dev.

`toItemListSize` resolves before forwarding, and the selection helpers share one
warning context, so one stale `<Select size="xl">` reports once, not four times.

### Typography and colour

| Member | Before | After |
| --- | --- | --- |
| Label (`InputLabel`) | 14px `text-base`, `ink-gray-5` | 13px `text-sm`, `ink-gray-6` |
| Label (`FormLabel`) | 12px `sm` / 14px `md`, `ink-gray-5` | 13px `text-sm`, `ink-gray-6` |
| Description | 13px `text-p-sm`, `ink-gray-5` | 13px, `ink-gray-6` |
| Description (disabled) | `ink-gray-3` | `ink-gray-4` |
| Textarea text | 14 / 16 / 18 / 20px | 13px `text-p-sm` at every size |

`InputLabel`'s `color` union moved from `'gray-5' | 'gray-7'` to
`'gray-6' | 'gray-7'`, default `gray-6`. That is the existing colour type the
contract said to update; no new public colour API was added. Only `gray-7` is
passed by callers (the inline-row controls), so nothing else moved.

The disabled description went `ink-gray-3` to `ink-gray-4` so it matches the
disabled label and keeps the same one-step gap from the new enabled colour.
`ink-gray-3` measured 1.69:1 in light, which is very low even for disabled text.

### Dropped from the first pass

An `INPUT_SIZES` runtime const was added with the scale and then removed. It had
no call sites, exporting it would freeze a new public member under ADR-0012 that
neither issue asked for, and it changed how `propsgen` renders every `InputSize`
prop (alias name to expanded literal union) across the whole input family.

## Verification

Run from `/Users/netchampfaris/Projects/worktrees/rc-inputs`.

**Cypress needs `env -u ELECTRON_RUN_AS_NODE`.** The agent environment inherits
`ELECTRON_RUN_AS_NODE=1`, which makes the Cypress Electron binary boot as plain
Node and fail with `Cannot find module .../Contents/MacOS/Contents/Resources/app/index.js`.
Not a real failure. Same finding as the Rail track.

| Command | Result |
| --- | --- |
| `yarn type-check` | `Done in 8.55s.` — clean |
| `yarn test` (vitest) | `Test Files 102 passed (102)`, `Tests 1674 passed (1674)` |
| `yarn docs:gen` then `yarn docs:check` | `The committed API tables match the source.` |
| `env -u ELECTRON_RUN_AS_NODE npx cypress run --component --config video=false,screenshotOnRunFailure=false --spec <17 input-family specs>` | `All specs passed! 452 452` |

The 17 specs: TextInput, Textarea, FormLabel, FormControl, Select, Rating,
ItemListRow, Combobox, MultiSelect, Checkbox, Switch, Radio, Slider, Password,
DatePicker, TimePicker, Duration.

### Measured geometry (real browser, not class strings)

Rendered in Chrome at the standard root scale via a temporary `App.vue` harness:

- `TextInput` height by size: **xs 24, sm 28, md 32, lg 40** px — exact.
- Selection trigger height by size: **xs 24, sm 28, md 32, lg 40** px — exact.
- Heights hold with a prefix and a suffix, and in dark theme.
- `Textarea` computed font-size: **13px at all four sizes**.
- Every `[data-slot="label"]` and `[data-slot="description"]`: **13px**.
- Stale `size="xl"` renders pixel-identical to `size="sm"` and warns once.

Cypress covers the same numbers as regression tests.

### Contrast (measured, WCAG 2.1 relative luminance)

| Token | Light | Dark |
| --- | --- | --- |
| `ink-gray-3` (old disabled description) | 1.69 | 1.78 |
| `ink-gray-4` (new disabled) | 2.85 | 4.18 |
| `ink-gray-5` (**old** label/description) | **4.18 — fails AA** | **4.18 — fails AA** |
| `ink-gray-6` (**new** label/description) | **7.80 — AA + AAA** | **6.29 — AA** |
| `ink-gray-7` (inline-row labels) | 11.71 | 8.17 |

The accepted `ink-gray-6` default fixes a real AA failure in both themes.
Disabled text is exempt from 1.4.3, and `ink-gray-4` is better than the
`ink-gray-3` it replaces.

### Screenshots

- `/tmp/rc-inputs-shots/01-light-full.png` — every size with label, description,
  required indicator, disabled row, prefix/suffix row, Textarea, Select,
  Combobox, Password, Rating, FormControl, FormLabel. Light.
- `/tmp/rc-inputs-shots/02-dark-full.png` — same page, dark.
- `/tmp/rc-inputs-shots/03-stale-xl-fallback.png` — stale `size="xl"` beside real
  `size="sm"`, identical.

Not committed. `App.vue` was used as the harness and restored (`git checkout`).

## Consumer usage

Census method: full-source grep of 25 local app checkouts under
`/Users/netchampfaris/Projects/benches/`, plus complete tarball greps of 24
remote `frappe/*` repos via `gh api repos/<r>/tarball`. `gh search code` was not
relied on for any zero.

### Input `size="xl"` — 1 hit org-wide

| Repo | Hits | Note |
| --- | --- | --- |
| `frappe/frappe` (`ui/`, `@framework/ui`) | 1 | `src/components/Phone/stories/Sizes.vue:10` — `<PhoneInput size="xl">`, a size-showcase story |
| everything else | 0 | ~80 other `xl` hits across all apps are `Dialog`, `Avatar` or `Progress`, which keep their own scales |

A reverse sweep of every input-component tag in the local benches found only
`sm`, `md`, and two dynamic bindings defaulting to `sm`. **Migration cost:
trivial.** Removal proceeds; no escalation.

### `FormLabel.size` — 31 call sites, all `size="md"`

| Repo | Sites |
| --- | --- |
| helpdesk | 21 |
| gameplan | 4 |
| frappe_books | 3 (incl. the generic `TwoColumnForm` renderer, aliased import) |
| suite (writer) | 2 |
| lms | 1 |

Zero dynamic bindings, zero JS config objects — every one is the literal
`size="md"`. The census costed this as "moderate" assuming the fixed size would
land on the old `sm` (12px). It lands on **13px**, so those 31 sites shrink by
1px, not 2, and they land on the accepted size. The migration is deleting an
attribute. **No escalation.**

### Unverified

- Private repos in the `frappe` org (not enumerated).
- `canvas-kit` and `lending` — public, not grepped.
- `insights_docs`, `handbook`, `frappe_io`, `blog`,
  `partner_relationship_management`, `webshop`, `cafe`, `drive-desktop`,
  `drift`, `charts`, `falcon`, `erpnext_com`, `mcp` — public, not fetched;
  most are unlikely Vue frontends, but zero is not asserted.
- **All non-frappe-org consumers.** frappe-ui is public on npm; community,
  partner and in-house apps are unbounded and unenumerable. Largest blind spot.
- `frappe/drive` is archived (folded into `frappe/suite`); checked anyway, 0.

## Open questions for the orchestrator

1. **Stack inputs never dim their label or description when disabled.**
   `TextInput`, `Textarea`, `Password` and `Rating` render `<InputLabel>` and
   `<InputDescription>` without passing `:disabled`, so a disabled field keeps a
   full-strength `ink-gray-6` label — measured 7.80:1, same as enabled. The
   inline-row controls (`Checkbox`, `Switch`, `Radio`) do pass it and dim to
   `ink-gray-4`. Both components already have the `disabled` prop wired; the
   stack layouts just do not use it. Pre-existing, visible in
   `01-light-full.png` (second row). Not fixed: changing it is a rendering
   change beyond D2/D3 and the contract said verify, not change. Worth a
   decision before the tag.
2. **`src/charts/docs/*.api.md` have pre-existing generator drift** — `docs:gen`
   reorders `update:hiddenSeries` after `select` in AreaChart, BarChart and
   LineChart. Not mine (charts is Saqib's track), so the three files were
   reverted and left uncommitted. `docs:check` passes regardless, so it is not a
   CI gate — but the next agent to run `docs:gen` will see the same three files
   go dirty.

## Remaining / not done

- Nothing pushed. No PR, no issue comment.
- Consumer apps not built or booted against the candidate — that is the
  integration agent's step 5, and the disk budget here forbids it.
- `yarn build` and `yarn docs:build` not run (disk).
- Full `yarn test:cypress` not run — only the 17 input-family specs (disk/time).
