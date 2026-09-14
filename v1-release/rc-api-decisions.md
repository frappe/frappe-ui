# RC API decisions — round 1

Answers pasted from `rc-api-audit-review.html` on 2026-09-12 against commit `f4dfb48160` (v1.0.0-beta.63).
Source findings: `rc-api-audit.md`. Status column: **decided**, **open** (question in the comment still to answer), **not answered**.

## Cross-cutting

| Id | Status | Decision | Comment |
|---|---|---|---|
| X1 | decided | `route` for router destinations, `href` for external URLs everywhere; remove `to` and `link` before 1.0.0 | canonical props must be `route` and `href` |
| X2 | decided | `onClick` only inside data/action objects; component-level `click` emits; fix Menu event type | click emits and onClick prop both behave the same in Vue components if i am not wrong? |
| X3 | decided | Standardize public delay props on milliseconds; state the unit in docs | |
| X4 | open | Export every stable named type used by a public signature; promote `FrappeUIError`; replace the route type leak with an owned printable type | not sure about FrappeUIError isn't it just Frappe response error object? |
| X5 | open | Align slot props with P7; define each family's data-state vocabulary | why change the slot name from prefix to item-prefix for TabButtons? not intentional? slot prop renames look fine. also what is the slot prop to close? |
| X6 | decided | Replace all four implementation-module `export *` statements with explicit named exports | |
| X7 | open | Document the serialized prose variables unchanged; resolve or rename the mobile, chart, and legacy focus variables, then document | where are these css vars used? let me review them before finalizing |

## High

| Id | Status | Decision | Comment |
|---|---|---|---|
| H01 | decided | Every listed v2 action rejects on failure; fix tests/docs | |
| H02 | decided | Ship the open-ended top-level spread of consumer methods on `useDoc` | |
| H03 | decided | Ship both error shapes as independent contracts | ship two separate v1 and v2 error response shapes, frappeRequest is based v1 and useFrappeFetch is based on v2 |
| H04 | decided | Normalize upload rejection to one exported error type, type `UploadState.error`, remove `is_private` | |
| H05 | decided | Keep `update:open` and `invalid-change`, remove duplicate emits, shared variant type, export `TimePickerEmits` | |
| H06 | decided | Keep component-specific types; add a new shared union alongside them | |
| H07 | decided | Rename Button `link` to `href`; remove the old name | |
| H08 | open | Change Menu `onClick` to the actual reka `CustomEvent` type | i would like to understand this in detail before deciding |
| H09 | open | Replace the index-signature construction with explicit named slot types | what are the pros and cons of current state vs recommended option? |
| H10 | decided | Replace `shortcut?: boolean` with the shared shortcut vocabulary and composable | `combo` is an ambiguous prop name, should be `keyboardShortcut`; default `"Mod+Shift+,"`; disable by passing `false` |
| H11 | delegated | Tracked in https://github.com/frappe/frappe-ui/issues/1142 (assigned to shahzeelahmed) | create a new github issue and assign it to shahzeel, the original author of this feature |
| H12 | decided | Keep current TabButtons API as is | this is intentional, `#tab-prefix` is shorthand mode |
| H13 | decided | Positive `collapsible` on both Sidebar and SidebarSection | |
| H14 | decided | Remove `viewportClass`; document the `data-slot` selector; migrate 7 consumer uses (Gameplan 6, Helpdesk 1) | |
| H15 | decided | Add `scroll` to `DesktopShellProps`; component consumes the exported type | |
| H16 | open | Rename `to` to `fallback` | should be `fallbackRoute` instead of `fallback`? |
| H17 | open | (no option chosen) | need simple/visual explanation with examples of this before deciding |
| H18 | decided | Rename to `--page-header-mobile-height`; document | |
| H19 | decided | Render `#hint` whenever supplied; regression test | label and hint must render independently |
| H20 | decided | `icon?: string \| Component`, add `theme?: DialogTheme`, delete `DialogIcon` | |
| H21 | open | Name and export separate component and imperative action types | imperative actions will always be written inline in dialog.confirm so is it really needed to export ImperativeDialogAction? |
| H22 | decided | Amend the spec to 4000ms; export owned toast option types | toast is not supposed to be stylable by consumers. ToastProvider does not take any props. |
| H23 | decided | Use TipTap's `Extensions` type in Editor and useEditor | |
| H24 | decided | One exported `UploadedFile` with required `file_url` | |
| H25 | decided | Expose the second upload-callback argument; export `MediaUploadProgress` | |
| H26 | decided | Remove the three dead StarterKit keys; correct docs | |
| H27 | decided | Export the real option interfaces; type all 18 kit keys | |
| H28 | decided | `rowHeight` across List, ListVirtualOptions, useVirtualRows | |
| H29 | decided | Ship the boolean-or-object `virtual` overload | |
| H30 | decided | Define and export owned `useVirtualRows` return types | |
| H31 | delegated | Tracked in https://github.com/frappe/frappe-ui/issues/1139 (assigned to nextchamp-saqib) | create a github issue for all chart related questions and assign to saqib |
| H32 | delegated | Tracked in #1139 | goes into the charts issue |
| H33 | decided | Declare a Tailwind v3 peer dependency; document the supported range | |
| H34 | decided | Declare `@floating-ui/vue` as a direct dependency | |
| H35 | decided | Delete the deprecated Tailwind shim; README points at `frappe-ui/tailwind` | |

## Medium groups

All thirteen groups were answered with the "resolve all before RC" option and no comment: M-data (preserving ADR-0013), M-base, M-dialog, M-overlays, M-inputs, M-navigation, M-tabs-tree, M-shells, M-composables, M-editor (preserving serialized prose variable names), M-list, M-charts (delegated to #1139), M-packaging.

**M-base/A Icon override (2026-09-14).** The maintainer said “keep both: icon and name.” Both props accept `string | Component | null`; `icon` is canonical and takes precedence when its value is not `undefined`. `name` remains supported without a warning or required migration. This supersedes the mechanical rename-only outcome recorded in `rc-medium-triage.md`.

The reviewer's note: "this looks like a heavy list of decisions to make, almost every one in medium group is its own grilling session." See `rc-medium-triage.md` for the split into mechanical fixes and real decisions.

## Low batches and info

| Id | Status | Decision |
|---|---|---|
| L-root | decided | Fix all before RC |
| L-navigation | not answered | can wait for 1.1 |
| L-list | not answered | can wait for 1.1 |
| L-editor | not answered | can wait for 1.1 |
| L-charts | delegated | Tracked in #1139 |
| L-shortcuts | not answered | can wait for 1.1 |
| L-packaging | not answered | can wait for 1.1 |
| I1 | not answered | nothing to decide |

## Round 2 inputs (added 2026-09-12)

- Open questions from the comments above are answered in `rc-open-questions.md` and inside the page's context blocks ("Answer to your question") for X2, X4, X5, X7, H08, H09, H11, H14, H16, H17, H21, H22.
- The 91 non-chart MEDIUM findings are sorted in `rc-medium-triage.md`: 40 mechanical (spec decides, veto only), 17 real decisions (B1 to B17, now sections on the page), 34 can wait for 1.1.
- X1 gained a fourth option on the page matching the comment: `route` for router destinations, `href` for external URLs.
- B6, B7 and X5 are one decision (which slot props close an overlay).

## Round 2 answers (2026-09-12)

Changes to round 1: X1 decided (`route` + `href`), H11 delegated to #1142, H14 decided (remove `viewportClass`). Options picked for X4, X5, X7, H08, H09, H16, H21 are unchanged; the questions in their comments are answered in `rc-open-questions.md` and on the page.

| Id | Status | Decision | Comment |
|---|---|---|---|
| B1 | decided | `useDoc` supports both the return-method subscription and option callbacks | |
| B2 | decided | Keep the current per-composable cache and refetch defaults | |
| B3 | decided | Add object overloads; keep the positional forms | |
| B4 | decided | Keep `dayjs` and `dayjsLocal` exported from the root | dayjs exports are necessary and must be exported from frappe-ui, it is supposed to be used in app code |
| B5 | decided | Keep `BreadcrumbItem`'s open index signature | |
| B6 | open | `{ open, close, disabled }` picked | is open, close functions or state? should we have setOpen here? |
| B7 | decided | State plus `setOpen(boolean)` | |
| B8 | decided | `SidebarHeader.menuItems` uses `MenuOptions` and its `onClick` signature | |
| B9 | decided | Map SidebarRailItem `tile` to `subtle` | |
| B10 | decided | `TreeNode` becomes generic | |
| B11 | decided | Shell side region is called `nav` on both shells | |
| B12 | decided | `nodeView` and `listComponent` replace the two meanings of `component` | |
| B13 | open | Generic items with accessors picked | why cant SuggestionItem just be { label, value }, transformation can be done in user app code? am i missing something? |
| B14 | decided | StyleClipboard, Toc, ImageViewer become opt-in | |
| B15 | decided | Add `as` to ListRow; `onClick` is activation only and is not swallowed in selectable mode | |
| B16 | open | Align `minWidth.50` and remove `width.wizard` picked | instead of adding specific values for width, height, minWidth, maxHeight, can we just generate all values like we did in preset.js with integerSpacing? |
| B17 | open | (no option chosen) | unsure, need to understand this problem deeply with examples |

The reviewer's note after this round: "still feels too overwhelming, is there a better way to deal with these decisions?"

## Round 3: migration effort (2026-09-12)

The reviewer does not want unnecessary renames or breaks in app code. `rc-migration-effort.md` measures every decided change against seven v1-track apps (gameplan, frappe/ui, crm, helpdesk, builder, frappe_books, wiki), eight v0 apps as one aggregate, and this tree. Tiers: T0 nothing to migrate (22 changes), T1 codemod-able rename or removal (31), T2 manual edits (9), T3 behavior change grep cannot find (13). Doing every break would touch 384 v1-app sites; the orchestrator's recommended subset touches about 70. Open calls for the reviewer: X1 (`to` → `route`, 32 sites), H01 direction, X3 units, H14, and the four large T3 consistency items (overlay fallthrough, TabButtons/Rating defaults, delay defaults, prose font size).

## Round 4: grilling pages (2026-09-13)

The reviewer asked for one interactive grilling page per area with easy context per API. Built in `v1-release/grilling/` (open `index.html`): 9 area pages, 100 questions, each with what the API is, a visual, the audit finding, what was already said, the trade-off with measured migration cost, options with a recommendation, and a free-text answer box. Answers persist per page in localStorage; each page and the index have a copy button. Charts (#1139) and Tree (#1142) have no page.

## Grilling answers: vocabulary (2026-09-14)

Source: `grilling/01-vocabulary.html`. Three picks differ from the page's recommended option. VOC-Q1 and VOC-Q3 choose the break over keeping the current API. VOC-Q7 removes the variable instead of renaming it.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| VOC-Q1 | X1, H07 | decided | Use `route` for router destinations and `href` for external URLs; remove `to` and `link` | (none) |
| VOC-Q2 | X2, H08 | decided | Use `click` emits on components, `onClick` in data objects, and type Menu actions as `Event` | (none) |
| VOC-Q3 | X3 | decided | Change all public delay props to milliseconds before v1 | can we write a codemod for this? |
| VOC-Q4 | X4 | decided | Export every stable signature type and add an owned route type. Delete `FrappeUIError` and add no new name: type the prop inline as `error?: string \| (Error & { messages?: string[] })`; code that passes it through uses `InputLabelingProps['error']` | still unsure about InputErrorValue, others are fine. Follow-up (2026-09-14): "recommendation sounds okay" |
| VOC-Q5 | X6 | decided | Replace all four implementation wildcard exports with explicit named exports | (none) |
| VOC-Q6 | H16 | decided | Rename to `fallbackRoute` | (none) |
| VOC-Q7 | H18 | decided | Remove the CSS variable and keep the 52px height fixed | keep the height fixed for now, we will expose it when it is needed |

Changes to earlier rounds:

- **H08 closed with a different type.** Round 1 picked Reka's `CustomEvent`. VOC-Q2 types Menu action callbacks as `Event`, as the research recommended.
- **H16 closed.** Round 1 picked `fallback`. VOC-Q6 settles on `fallbackRoute`, as the round 1 comment asked.
- **H18 overridden.** Round 1 decided to rename the variable to `--page-header-mobile-height` and document it. VOC-Q7 removes the variable instead, and `PageHeaderMobile` uses a fixed 52px height. This also settles the mobile variable part of X7.
- **X4 closed with a different outcome.** Round 1 said to promote `FrappeUIError`, and the page proposed renaming it to `InputErrorValue`. Instead, `FrappeUIError` is deleted and no type replaces it; the prop is typed inline, which matches `spec/inputs.md`. The looser `{ message?, messages? }` type was not adopted. See `rc-open-questions.md`.
- **X3 ships with a codemod.** Research in `rc-open-questions.md` shows a codemod converts 26 of 38 app sites and lists the other 12, which makes this about T1 instead of T3. The RC work list needs a codemod item next to `shortcuts-v1`.
- X1, X2, X6, and H07 confirm the round 1 and 2 decisions.

## Grilling answers: data-layer (2026-09-14)

Source: `grilling/02-data-layer.html`. DAT-Q1, DAT-Q4, DAT-Q6, and DAT-Q9 asked for facts; the answers are in `rc-open-questions.md`. General note from DAT-Q1: v2 data fetching gets no further improvements, because data fetching v3 replaces it.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| DAT-Q1 | H01 | decided | Write actions reject on failure (`useCall` `submit`; `useDoc` `setValue`, `delete`, `methods:` members); `reload`/`fetch`/`execute` keep resolving in every composable | i'd like to keep this consistent, but this should depend on the migration effort. I don't plan to enhance v2 data fetching apis further, they will be replaced by data fetching v3. Research: only gameplan is affected, about 7 edits and 22 `.catch` additions; fixes about 20 silent failures. Follow-up (2026-09-14): "yes, reject seems to be better behaviour that fixes actual bugs" |
| DAT-Q2 | H02 | decided | Keep top-level methods and throw a clear development-time error for reserved names | (none) |
| DAT-Q3 | H03 | decided | Keep both names and document a composable-to-error table with field differences | (none) |
| DAT-Q4 | H04 | decided | Export UploadError, reject it for network, server, and abort failures, type state.error with it, and remove is_private | if there are too many call sites using is_private, i'd like to keep it. Research: 0 app sites in v1 or v0 apps, so `is_private` is removed, with the `UploadPrivacy` type. |
| DAT-Q5 | B1 | deferred to 1.1 | (not answered) | park this for v1.1 |
| DAT-Q6 | B2 | decided | Keep the per-composable defaults and document each one beside its options | each default is intentional, document them, useNewDoc's default is not intentional, it should probably be refetch: false? Research: it is already `false` through `useIsolatedCall`, but a caller can pass `refetch: true`, which sends an insert on every edit. Fix: remove `refetch`, `cacheKey`, `staleOnError` from `UseNewDocOptions` and force `immediate: false, refetch: false`; same for `useDoc` `methods:`. 0 app sites. |
| DAT-Q7 | B3 | deferred to 1.1 | (not answered) | park this for v1.1 |
| DAT-Q8 | B4 | decided | Keep dayjs and dayjsLocal at root; document that Dayjs and dayjsSystem are not public | we can decide if we want to export dayjsSystem later in v1.1 |
| DAT-Q9 | M-data/A, M-data/C, X6 | decided (A); C not confirmed | Keep `execute`/`fetch`/`reload` and `loading`/`isFetching` and document them as an exception; narrow plugin `resources` to `boolean`; replace the `export *` lines in `src/resources/index.ts` with named exports. The four C items stay at the recommended 1.1 until the maintainer confirms. | please explain this in plain words. Explanation in `rc-open-questions.md`. Follow-up (2026-09-14): "keep the duplicate names, they are harmless. sure, narrow to true/false is fine. yes for named exports" |
| DAT-Q10 | L-root (ErrorMessage) | decided | Accept string or string-array messages, normalize them, and render every message | (none) |

Changes to earlier rounds:

- **B1 deferred.** Round 2 decided `useDoc` supports both option callbacks and the returned subscription. DAT-Q5 moves this to 1.1. `useDoc` ships as it is.
- **B3 deferred.** Round 2 decided to add object overloads to `useDoctype` and `useNewDoc`. DAT-Q7 moves this to 1.1. Only the positional forms ship.
- **H02 changed.** Round 1 shipped the top-level spread with no check. DAT-Q2 keeps the spread and adds a development-time error when a method name collides with a built-in member.
- **B2 gets one fix.** The defaults stay and are documented, but `useNewDoc` loses its cache and refetch options. That is a type break with 0 app sites, so the PR title needs `!`.
- **H01 narrowed.** Round 1 said every listed v2 action rejects. DAT-Q1 applies that to write actions only. `reload`, `fetch`, and `execute` keep resolving, because they already resolve in all five composables. The data-fetching docs state the rule "actions reject, reads resolve". The RC work list needs a gameplan follow-up for about 7 edits and 22 `.catch` additions (site list in `rc-open-questions.md`).
- **M-data/A closed.** The v1 exception for duplicate names is recorded (no code change), `resources` becomes `boolean` (2 app sites, codemod-able), and the barrel fix stays with VOC-Q5.
- **H04 is confirmed,** including the `is_private` removal, because no app uses it.
- **dayjsSystem export** is a new 1.1 item.
- H03, B4, and L-root confirm the earlier decisions. DAT-Q9's barrel item was already decided in VOC-Q5.

## Grilling answers: overlays-dialogs (2026-09-14)

Source: `grilling/03-overlays-dialogs.html`. OVR-Q8, OVR-Q9, and OVR-Q11 were answered in free text with no option picked. All 13 are decided. OVR-Q8 (Alert hook) and OVR-Q12 (codemod) asked for facts, and OVR-Q11 needed a site list; the answers are in `rc-open-questions.md`.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| OVR-Q1 | X5, B6, B7 | decided | Every trigger slot exposes `open` (boolean), `setOpen(boolean)`, and `disabled`, plus its component-specific value fields | (none) |
| OVR-Q2 | X5 | decided (amended in Round 5) | `data-state`: `open\|closed` for visibility, `active\|inactive` for current items and rows, `checked\|unchecked` for binary controls. Selection on rows is a boolean `data-selected`, not a `data-state` value. reka-rendered items keep reka's attributes | (none) |
| OVR-Q3 | H08 | decided | `MenuActionOption.onClick` receives `Event`; remove the `PointerEvent` casts | (none) |
| OVR-Q4 | H09 | decided | Explicit fixed slots plus a typed `` item-${string} `` signature on Menu, Dropdown, and ContextMenu | (none) |
| OVR-Q5 | H20 | decided | Dialog `icon?: string \| Component`, add `theme?: DialogTheme`, delete `DialogIcon` | (none) |
| OVR-Q6 | H21 | decided | Keep `DialogAction` for the component; rename the `dialog.confirm` type to `ImperativeDialogAction` and export it | (none) |
| OVR-Q7 | H22 | decided | Document the existing 4000ms Toast default, export owned toast option types, keep `ToastProvider` prop-free | (none) |
| OVR-Q8 | M-dialog, B5 | decided | Keep Dialog `message`. Rename Divider `position` to `align`. Keep the Breadcrumb slot names. `BreadcrumbItem` keeps its open index signature (B5, not re-answered). Keep Alert's `data-color` hook, because PR #1005 moved off `data-theme` on purpose (it is the light/dark attribute). Follow-up (2026-09-14): "data-color is fine" | Dialog message prop is okay<br>Divider action alignment prop should be "align"<br>Alert data-color was renamed from data-theme in this https://github.com/frappe/frappe-ui/pull/1005, not sure how to handle this.<br>Keep current slotnames for BreadcrumbItem |
| OVR-Q9 | M-dialog | decided | Keep all three: `Dialog.Title`, `Dialog.Description`, and `Dialog.Close` are public on purpose; `paddingTop` stays `string \| number`; Alert `icon` stays `boolean \| string \| Component` (`true` is the auto icon) | Dialog.Title, Dialog.Description, Dialog.Close these are intentionally exposed<br>keep paddingTop as-is<br>icon: true in Alert means auto icon, so it is valid |
| OVR-Q10 | M-dialog | decided | Add `data-slot` hooks to Dialog and BottomSheet, keep PromptField options narrow, keep the 300ms HoverCard default after the change to milliseconds (`hoverDelay: 300`) | (none) |
| OVR-Q11 | M-overlays | decided | Set `inheritAttrs: false` on HoverCard and ContextMenu. Popover stays as it is (no forwarding); Dropdown keeps forwarding to its trigger | ideally fallthrough should be disabled like Popover OR pass it to the trigger slot/component like Dropdown. Passing it to overlay content like HoverCard is not right. disable it using inheritAttrs: false for HoverCard and ContextMenu. |
| OVR-Q12 | M-overlays | decided (the codemod is easy) | Popover and picker `toggle` becomes `setOpen(boolean)`; `close` stays everywhere next to it (follow-up); add ContextMenu `portalTo`, export `HoverCardEmits`, add `data-slot="trigger"` to every overlay trigger | if toggle is codemod-able easily then setOpen rename is fine |
| OVR-Q13 | H19 | decided | Label and `#hint` render independently; add the regression test | (none) |

Changes to earlier rounds:

- **B6 overridden, X5 closed.** Round 2 picked `{ open, close, disabled }` for Dropdown. OVR-Q1 uses `setOpen(boolean)` on every trigger slot, which answers the X5 question "what is the slot prop to close?": `setOpen(false)`. B7 is confirmed and now applies to every family, not only the pickers.
- **X5 data-state closed.** OVR-Q2 sets the four value pairs by meaning. Each family spec records its values.
- **H09 closed** with explicit fixed slots and a typed `` item-${string} `` signature.
- **H21 closed.** Both types stay; the imperative one is renamed to `ImperativeDialogAction` and exported.
- **M-dialog narrowed.** Round 1 said "resolve all Dialog-family findings before RC". OVR-Q8 and OVR-Q9 keep five of them as they are: Dialog `message`, the Breadcrumb slot names, the three Dialog statics, the numeric `paddingTop`, and the boolean Alert `icon`. The docs must list the statics as public and say that Alert `icon: true` shows the auto icon (the prop comment at `src/components/Alert/types.ts:33` does not say this). The triage items "M-dialog/A Alert icon" and the page's static removal are dropped.
- **HoverCard default stays 300ms.** OVR-Q10 keeps today's behavior. `spec/hover-card.md:103` says `hoverDelay = 0.5` and must change to `300`. The X3 codemod no longer needs to list the 3 HoverCards with no delay set, because their timing does not change (see VOC-Q3 in `rc-open-questions.md`).
- **M-overlays fallthrough overrides the page's recommendation.** The page recommended keeping each target and documenting it. OVR-Q11 stops forwarding on HoverCard and ContextMenu. Attributes passed to them will be dropped with no error, so the PR title needs `!`. Research found one affected app site: GP `ReactionsDesktop.vue:7` passes `@pointer-down-outside` to HoverCard only to stop a press on the trigger from closing the card. Follow-up (2026-09-14): HoverCard ignores presses on its own trigger, as Popover, Dropdown, and the pickers already do. No dismiss emits are added. Gameplan then deletes its handler (`ReactionsDesktop.vue:7`, `:87-92`). ContextMenu attributes already go nowhere, so nothing changes there.
- H08, H19, H20, and H22 confirm the earlier decisions. OVR-Q3 matches VOC-Q2.
- **`close` stays next to `setOpen` (follow-up, 2026-09-14).** The maintainer: "if we are keeping close, then it should be present alongside setOpen everywhere and document it." Every overlay, selection, and picker slot, trigger and content slots alike, exposes `open`, `setOpen(boolean)`, `close()`, and `disabled` where the component has it. `close()` is the same as `setOpen(false)`. Only `toggle` is renamed. Slots that lack `close` today (HoverCard, Tooltip, ContextMenu, Select, Combobox, MultiSelect, picker triggers) gain it. GP's 2 `close` callbacks need no change. This amends OVR-Q1.
- **One `overlays-v1` codemod.** The `toggle` rename and the X3 delay units share one bin built on `@vue/compiler-sfc`. It lists, and does not convert, the 43 files in Frappe, CRM, HD, and Builder that still use the old Popover `#target`/`togglePopover` API; those must migrate anyway. The migration report's 0-site count for this row missed them.
- **Alert `data-color` kept (follow-up, 2026-09-14).** The maintainer: "data-color is fine". No other component sets `data-theme` from a `theme` prop; only Alert and SidebarCard set a tone hook, and both use `data-color`. The triage item "M-dialog/A Alert hook" is dropped. P10 gets a line naming `data-color` as the tone hook, and the Alert and SidebarCard API docs document it. No other component gets the hook until an app needs it.

Follow-up work from this page, for the RC work list:

- **Slot contract (OVR-Q1, OVR-Q12).** Every overlay, selection, and picker slot exposes `open`, `setOpen(boolean)`, `close()`, and `disabled` where the component has it. Remove Popover's `toggle(boolean | Event)` and picker `toggle`. Add `close` and `setOpen` where they are missing. Update the slot types, `spec/popover.md`, `spec/date-picker.md`, the API docs, stories, and the 4 picker test files. Document `close()` as the same as `setOpen(false)`.
- **Data-state values (OVR-Q2).** Each family spec records its values: `open|closed`, `active|inactive`, `checked|unchecked`, `selected|unselected`.
- **Menu (OVR-Q3, OVR-Q4).** Type `MenuActionOption.onClick` as `Event` and remove the casts in `Menu.vue`. Replace the index signature in `MenuSlots` with fixed slots plus `` item-${string} ``, and fix the `Omit` types in Dropdown and ContextMenu.
- **Dialog (OVR-Q5, OVR-Q6, OVR-Q9, OVR-Q10).** `icon?: string | Component`, add `theme`, delete `DialogIcon` (3 manual app sites). Rename the `dialog.confirm` action type to `ImperativeDialogAction` and export it. Add `data-slot` hooks to Dialog content and actions, and to BottomSheet content, and make BottomSheet find its content through the hook. Document `Dialog.Title`, `Dialog.Description`, and `Dialog.Close` as public.
- **Toast (OVR-Q7).** Change `spec/toast.md:16,79` to 4000ms. Export owned toast option types from `frappe-ui`.
- **Divider and Alert (OVR-Q8, OVR-Q9).** Rename Divider `position` to `align`. Add the `data-color` tone hook line to P10 (`PHILOSOPHY.md`). Document `data-color` in the Alert and SidebarCard API docs. Document Alert `icon: true` as the auto icon, including the prop comment at `src/components/Alert/types.ts:33`.
- **HoverCard (OVR-Q10, OVR-Q11).** Keep the 300ms default after the change to milliseconds, and change `spec/hover-card.md:103`. Delete `v-bind="$attrs"` (`HoverCard.vue:75`). Add a trigger template ref and ignore pointer-down on the trigger, as `Popover.vue:79,138-150` does. Copy the wording of `spec/popover.md:287-289` into `spec/hover-card.md`. PR title needs `!`.
- **ContextMenu and HoverCard parity (OVR-Q11, OVR-Q12).** ContextMenu gets `inheritAttrs: false` and a `portalTo` prop. Export `HoverCardEmits`. Add `data-slot="trigger"` to the Dropdown, HoverCard, and ContextMenu triggers.
- **Progress (OVR-Q13).** Render the row when only `#hint` is given (`Progress.vue:2-5`). Add a test for label only, hint prop, and hint slot only.
- **Codemod.** One `overlays-v1` bin on `@vue/compiler-sfc`: the `toggle` rename and the X3 delay units. It lists the old Popover `#target`/`togglePopover` sites (43 files in Frappe, CRM, HD, Builder) and does not convert them. It no longer lists the 3 HoverCards with no delay set.
- **Migration guide.** Add a note: moving from `#target` to `#trigger` means deleting the app's own click handler, because `#trigger` opens the popover itself.
- **`rc-migration-effort.md`.** Correct the "M-overlays/A Popover control" and B7 rows. The 0 count is right for the current names, but it misses the old-name sites above.
- **Gameplan.** Delete the `@pointer-down-outside` handler in `ReactionsDesktop.vue:7` and `:87-92` after the HoverCard change ships.
- **Triage items dropped.** "M-dialog/A Alert hook" and "M-dialog/A Alert icon" in `rc-medium-triage.md`.

## Grilling answers: inputs-selection (2026-09-14)

Source: `grilling/04-inputs-selection.html`. INP-Q2, INP-Q3, INP-Q10, and INP-Q12 asked for facts, and INP-Q8 and INP-Q16 needed a check; the answers are in `rc-open-questions.md`. The maintainer accepted the research recommendations for INP-Q2, INP-Q3, INP-Q10, and INP-Q12 in a follow-up. Three picks differ from the page's recommended option: INP-Q2 unifies the empty value, INP-Q13 keeps `Dayjs`, and INP-Q16 changes the default instead of the fallback.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| INP-Q1 | H06 | decided | Keep the component-specific types and add `SelectionOption` and `SelectionGroup` unions | (none) |
| INP-Q2 | M-inputs | decided (`null`) | Use one empty value for Select and Combobox; keep `[]` for MultiSelect. Research: reka-ui accepts both and treats them the same; `null` matches Frappe's empty fields and survives `JSON.stringify`. Select changes only in `clear()`, which no app calls. Type the prop `string \| number \| null \| undefined` and emit `null` | i'd like to keep empty value for Select, Combobox consistent, but unsure between undefined and null, which one is better? what does reka-ui do? <br>Follow-up (2026-09-14): "null is fine" |
| INP-Q3 | H05 | decided | Keep `update:open`; remove `open`, `close`, `input-invalid`, and `invalid-change`; keep the revert of rejected text to the last valid value (`TimePicker.vue:348-350`, which does not depend on the events); use `InputVariant`, and export `TimePickerEmits`. Research: `invalid-change` fires when typed text is rejected; 0 listeners anywhere, the text is reverted so the flag does not match the screen, the flag is never reset, and no other picker has it | what is invalid-change event and why is it needed? <br>Follow-up (2026-09-14): "i tried adding an invalid value in timepicker, it reset the value to teh previous valid value. i am okay with removing invalid-chagne as long as it preserves current behavior" |
| INP-Q4 | M-inputs | decided | Remove `allowCustomTime` and let `typeable` govern both date and time typing | (none) |
| INP-Q5 | M-inputs, L-root | decided | Add `focus()` to every input and keep `clear()` and `open()` capability-specific | (none) |
| INP-Q6 | M-inputs | decided | Route control attributes and listeners once to the interactive element, with `class` and `style` on the layout wrapper | (none) |
| INP-Q7 | M-inputs | decided | Forward `#label` and `#description` through Duration before RC | (none) |
| INP-Q8 | M-inputs | decided | Make native and composite type routes explicit and forward only props each child supports. FormControl `type="date"` renders DatePicker and `type="time"` renders TimePicker; a native date input is `<TextInput type="date" />`. Research: routing already works this way since beta.1; the remaining fix is to stop forwarding `variant` to Checkbox | type="date" -> Datepicker and type="time" -> Timepicker are good defaults for FormControl<br>if someone wants native date they can explicitly use `<TextInput type="date" />` |
| INP-Q9 | M-inputs, X4 | decided (export part); rename superseded by VOC-Q4 | Export `InputLabelingProps` from the root. The `InputErrorValue` rename is not done: VOC-Q4 deletes `FrappeUIError` and adds no new name | (none) |
| INP-Q10 | M-inputs | decided | Keep `control` and `trigger`, document both, and add `data-slot="label"` to FormLabel. Research: all four pickers already render `<input data-slot="control">` with no separate trigger, and frappe_books styles that hook. Proposed rule: `trigger` is only the selection family's box (Select, Combobox, MultiSelect); every other input, pickers included, uses `control` | how will DatePicker handle this? it's input is a control that also triggers the datepicker overlay? <br>Follow-up (2026-09-14): "okay" |
| INP-Q11 | L-root | decided | Remove duplicate `defineModel` events from `ComboboxEmits` and `MultiSelectEmits` and correct `RadioGroupEmits` | (none) |
| INP-Q12 | L-root | decided (TextInput pick reversed) | `DateRangeValue` for both sides of DateRangePicker `v-model`. TextInput: research recommends keeping the prop `string \| number` and the `string` emit (today's behavior), and documenting `v-model.number`. Narrowing the prop adds type errors at 4 CRM `v-model.number` sites and Books `:model-value="scale"` | TextInput value was typed string \| number because of type="number"? is it okay to emit string when type="number"? <br>Follow-up (2026-09-14): "okay" |
| INP-Q13 | L-root | decided | Keep `Dayjs` in the component contract and export the `Dayjs` type from frappe-ui | (none) |
| INP-Q14 | L-root | decided | Replace the wildcard with an explicit public type list and remove `DatePickerViewMode` and `DatePickerDateObj` from the root | (none) |
| INP-Q15 | L-root | decided | Add `focus()` to Rating; it focuses the selected star, or the first star when the value is empty | (none) |
| INP-Q16 | L-root | decided | Change Rating's `size` default from `md` to `sm`, so omitted and invalid sizes both render `sm` | set default value of size prop to "sm". Research: 3 v1 sites render smaller (frappe/ui `RatingField.vue:2`, HD `FilterValueEditor.vue:93`, CRM `CFCondition.vue:265`), 0 in v0; no codemod |

Changes to earlier rounds:

- **M-inputs empty values changed.** The page recommended keeping `undefined` (Select), `null` (Combobox), and `[]` (MultiSelect) as `spec/selection.md` states. INP-Q2 makes Select and Combobox use the same empty value. Follow-up: the value is `null`. Select's `clear()` and model type change; the prop accepts `null` and `undefined` and the component emits `null`. `spec/selection.md:52` must change.
- **INP-Q9 rename dropped.** The page predates the VOC-Q4 follow-up, so its option still names `InputErrorValue`. VOC-Q4 stands: `FrappeUIError` is deleted, the `error` prop is typed inline, and wrappers use `InputLabelingProps['error']`. The new part of INP-Q9 is that `InputLabelingProps` is exported from the root.
- **DAT-Q8 (B4) partly overridden.** DAT-Q8 said to document that `Dayjs` is not public. INP-Q13 keeps `Dayjs` in DatePicker callbacks and setters and exports the `Dayjs` type from the root. `dayjsSystem` stays private, and its export is still a 1.1 item.
- **L-root Rating default changed.** Round 3 suggested keeping the TabButtons and Rating defaults and recording them. INP-Q16 changes the Rating default to `sm` instead of changing the fallback. Every Rating with no `size` renders smaller, so the PR title needs `!`: 3 v1-app sites, listed in the migration notes. `sm` is already the default of every other input. The combined "38 / 9 / 44" Rating count in `rc-migration-effort.md:83,177` counted dynamic `size` tags, not omitted ones, and needs correcting. The TabButtons question in that row is about `variant`, not size, and stays open.
- H05 and H06 confirm the round 1 decisions.
- **H05 changed.** Round 1 kept `invalid-change`. INP-Q3 removes it with `input-invalid`, because nothing listens to it and its flag did not match the screen. The revert of rejected text stays; the PR extends `TimePicker.cy.ts:230-243` to check that the input shows the last valid value. Update `TimePicker.api.md` and `spec/date-picker.md:470-478` (which still lists `open`/`close`). Any later feedback for rejected input is an additive change for all typed pickers at once.
- **INP-Q12 pick reversed.** The page picked narrowing the TextInput prop to `string`. The follow-up keeps the prop `string \| number` and the `string` emit, and the docs point to `v-model.number`. No code or type change for TextInput; DateRangePicker still gets `DateRangeValue` on both sides.
- **Picker `data-slot` rule (INP-Q10).** `spec/inputs.md` and `spec/selection.md` record: `trigger` is only the selection family's box (Select, Combobox, MultiSelect); every other input, pickers included, marks its main interactive element `control`. Additive follow-ups: `aria-haspopup` and `aria-expanded` on the picker input, `data-slot="chevron"` on the picker chevron.
- **Audit finding "native date/time unreachable" closed as intended.** FormControl already routes `date` and `time` to the pickers, and `FormControl.md:30` documents `<TextInput type="date">`.

## Grilling answers: navigation (2026-09-14)

Source: `grilling/05-navigation.html`. NAV-Q7 and NAV-Q9 asked for facts; the answers are in `rc-open-questions.md`. NAV-Q4 differs from the page's recommended option: it renames the prop instead of keeping it. The maintainer answered both research follow-ups the same day: NAV-Q7 renames `to` to `route` in the RC, and NAV-Q9 uses `active` as the slot prop.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| NAV-Q1 | H10, M-tabs-tree, L-root | decided | Rename `shortcut` to `keyboardShortcut`, default it to `"Mod+Shift+,"`, accept `false`, use the shared composable, and export the corrected emit type | (none) |
| NAV-Q2 | L-shortcuts | decided | Add the setup guard before RC and defer the documentation additions to 1.1 | (none) |
| NAV-Q3 | H12 | decided | Keep TabButtons `#prefix` and `#suffix`, keep Tabs `#tab-prefix` and `#tab-suffix`, and record why they differ in the spec | (none) |
| NAV-Q4 | H13 | decided (page recommendation not taken) | Rename `Sidebar.disableCollapse` to `collapsible` and invert both measured call sites | (none) |
| NAV-Q5 | B8 | decided | Change `SidebarHeader.menuItems` to `MenuOptions` and use its corrected event signature | (none) |
| NAV-Q6 | B9 | decided | Rename `tile` to `subtle` and preserve the current rendering | (none) |
| NAV-Q7 | M-navigation | decided | Fix the Tooltip prop, icon handling, route activity, and anchor fallback before RC; defer additive declarations and key documentation to 1.1. Research: the `to` → `route` rename (already decided in VOC-Q1) is feasible now. 4 committed v1-app sites pass `to` to SidebarItem (GP 1, CRM 2, Wiki 1), all template attributes a codemod can rename; no alias needed. Rename SidebarRailItem and MobileNavItem `to` in the same PR, and add `href` for the no-router anchor | can you check whether renaming SidebarItemProps['to'] to "route" is feasible today based on app call sites <br>Follow-up (2026-09-14): "rename to to route" |
| NAV-Q8 | M-tabs-tree, X1, X2 | decided | Keep `route`, `href`, and `onClick`; remove `tooltip`; require string labels; manually migrate the 5 sites | (none) |
| NAV-Q9 | M-tabs-tree, L-root | decided (slot prop pick changed) | Change `data-state` to `active` and `inactive` and remove both redundant aliases. The page kept the `checked` slot prop; the follow-up renames the slot prop to `active` on both TabButtons (`checked`) and Tabs/TabTrigger (`selected`). Research: P7 already names tab slots `{ active }`, it matches the new `data-state`, and OVR-Q2 uses `selected` for collection rows. 0 app sites use either prop | Tabs uses "selected" as slot prop, but TabButtons uses "checked", worth keeping consistent? maybe we should keep both as "selected"? <br>Follow-up (2026-09-14): "active" |
| NAV-Q10 | L-navigation | decided | Defer label customization to 1.1 and keep the current English defaults for RC | (none) |

Changes to earlier rounds:

- **H13 kept despite round 3.** Round 3 suggested keeping `disableCollapse` and recording the difference, because inverting 2 dynamic values is manual (T2). NAV-Q4 confirms the round 1 decision: rename to `collapsible`. The PR title needs `!`; the 2 sites are GP and HD (`rc-migration-effort.md:167`).
- **L-shortcuts partly moved before RC.** Round 1 left the batch for 1.1. NAV-Q2 adds the `useKeyboardShortcut` setup guard before RC; the `showPlus`, dialog `title`/`paddingTop`, and array-overload docs stay in 1.1.
- **M-navigation split.** Round 1 answered "resolve all before RC"; the medium triage later put all five items in 1.1. NAV-Q7 fixes the four runtime items before RC (Tooltip `side`, non-lucide icon strings, SidebarRailItem route activity and anchor fallback) and leaves the `collapsed` model declaration and the injection key docs for 1.1.
- **X1 site count for SidebarItem corrected.** `rc-migration-effort.md:125` shows CRM 0; CRM develop now has 2 SidebarItem `:to` sites (`AppSidebar.vue:28,80`, added 2026-07-28). The combined X1 count of 32 needs a recount before the PR.
- **X1 SidebarItem part confirmed for the RC.** The follow-up to NAV-Q7 renames `to` to `route` on SidebarItem, SidebarRailItem, and MobileNavItem in the same PR, with `href` added for external URLs. No `to` alias (ADR-0008). The PR title needs `!`.
- **NAV-Q9 slot prop changed.** The page kept TabButtons `checked`. The follow-up renames the slot prop to `active` on TabButtons, TabTrigger, and the Tabs shorthand slots (`#tab-prefix`, `#tab-label`, `#tab-suffix`). PR title needs `!`; 0 app sites; about 12 own-tree lines; `spec/tabs.md:183-188,233-235` and `migration.md:1381` change. No alias.
- **L-root TabButtons default decided: keep both.** The audit's LOW list flags TabButtons defaulting to `variant="subtle"` (`TabButtons.vue:40`) while TabList defaults to `underline` (`TabList.vue:17`). No grilling page asks this. Maintainer (2026-09-14): "keep both defaults", as round 3 suggested. `spec/tabs.md` records why: TabButtons is usually a filter or view switcher, TabList is usually page-level tabs. No code change.
- H10, H12, B8, B9, and L-navigation confirm the earlier decisions. NAV-Q8 confirms the medium triage.

## Grilling answers: shells-page-header (2026-09-14)

Source: `grilling/06-shells-page-header.html`. SHELL-Q1, SHELL-Q4, SHELL-Q6, SHELL-Q7, and SHELL-Q11 asked for facts; the answers are in `rc-open-questions.md`. The maintainer answered the research the same day (follow-ups in the table). Seven final picks differ from the page's recommended option: SHELL-Q2 keeps the split slot names, SHELL-Q6 makes ScrollBar internal instead of experimental, SHELL-Q7 makes `useSheetDrag` internal instead of experimental, SHELL-Q9 keeps one click and the current attribute name, SHELL-Q10 requires `threshold`, SHELL-Q11 also removes the root export, and SHELL-Q13 moves the docs to 1.1. All 13 are decided.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| SHELL-Q1 | H15 | decided | Add `scroll` to `DesktopShellProps` and use that interface in DesktopShell | is it a good idea to remove ScrollArea from DesktopShell and let people compose them? <br>Research: no. GP's 13 scroll-element uses and MobileNavItem tap-to-top need the shell to own the scroll element; composing would need a ScrollArea flag that is the same prop in a new place. Keep it, and document when to pass `:scroll="false"` <br>Follow-up (2026-09-14): "okay" |
| SHELL-Q2 | B11 | decided (overrides B11) | Keep `#rail`, `#sidebar`, and `#nav` and document the split | (none) |
| SHELL-Q3 | H17 | decided | Use the nearest shell and PageHeader owner, with the registries as fallback | (none) |
| SHELL-Q4 | H14 | decided (pick reversed; overrides H14) | Keep `viewportClass` and document it as the ScrollArea exception to P10 | I couldn't find any callers using viewportClass, so removing it should be fine? <br>Research: apps have 10 sites, not 0: GP 6, HD 1, Builder 1, Books 2 (1 uncommitted). Own tree: `SettingsBody.vue`, a Sidebar story, 9 docs recipes. <br>Follow-up (2026-09-14): "keep viewportClass, document exception" |
| SHELL-Q5 | M-shells | decided | Keep `both` and document that it renders both scrollbars | (none) |
| SHELL-Q6 | M-shells | decided | Stop exporting ScrollBar and expose no standalone replacement | what is the usecase of composing with ScrollBar, when ScrollArea composes root, viewport and scrollbar components already? any apps do this? <br>Research: none left. It came from GP's `ScrollContainer.vue`, which needed an `id` on a hand-built reka viewport; GP deleted that file on 2026-07-03. It only works inside reka's `ScrollAreaRoot`, which frappe-ui does not export. 0 app sites <br>Follow-up (2026-09-14): "then dont export ScrollBar?" Confirmed: no export |
| SHELL-Q7 | M-shells | decided | Remove `useSheetDrag` and its types from the root; BottomSheet keeps using it internally | not sure why it is exported? <br>Research: `ffd9589266` (PR #925) exported it because the drag gesture seemed general. Only BottomSheet uses it; 0 app sites; the thresholds are fixed constants. <br>Follow-up (2026-09-14): "yes remove useSheetDrag from root" |
| SHELL-Q8 | M-shells | decided | Extract and export every PageHeader prop type before RC | (none) |
| SHELL-Q9 | M-shells | decided (rename and rule dropped) | Keep one-click scroll-to-top. Keep `data-no-scroll-top` and `data-no-sheet-drag` as they are. No `data-fui-` prefix and no prefix rule | keep it click, change the attr to `data-fui-no-scroll-top` and document that any public data attr must be prefixed with `data-fui-` <br>Research: read literally, the rule covers `data-slot` and `data-state` (about 200 own sites, about 120 app styling sites) and reka-ui attributes. Proposed scope: attributes an app adds to its own markup for frappe-ui to read. Two exist, both 0 app sites: `data-no-scroll-top` and `data-no-sheet-drag` <br>Follow-up (2026-09-14): "then keep data-no-scroll-top and data-no-sheet-drag, no need to add fui and no need to add the prefix rule for data attrs" |
| SHELL-Q10 | M-shells | decided | Require `threshold` and remove the default | (none) |
| SHELL-Q11 | M-composables | decided | Rename the function `resolvedColorScheme` to `getResolvedColorScheme` and do not export it. Add a read-only `resolvedColorScheme: Readonly<Ref<ResolvedColorScheme>>` to what `useColorScheme()` returns, and keep the `ResolvedColorScheme` type exported | rename is fine, but do not export getResolvedColorScheme, it is only imported by charts which is internal <br>Research: inside `src/` only charts import it (relative path), but Wiki `useTheme.js:1,28,32` and docs recipes `ComposeDesktop.vue` and `ComposeMobile.vue` import it from `'frappe-ui'`. `useColorScheme()` has no resolved value. Recommendation: add a read-only `resolvedColorScheme` ref to `useColorScheme()` <br>Follow-up (2026-09-14): "useColorScheme() has colorScheme readonly computed, how would it be different from resolvedColorScheme?" Answer in `rc-open-questions.md`: `colorScheme` is the saved preference and can be `system`; the resolved value is what the page shows, and it changes when the OS setting changes while `colorScheme` stays `system` <br>Follow-up (2026-09-14): "sure add resolvedColorScheme to useColorScheme()" |
| SHELL-Q12 | M-composables | decided | Toggle to the opposite of the resolved light or dark scheme | (none) |
| SHELL-Q13 | M-composables | deferred to 1.1 | Add the portal target docs in 1.1 | (none) |

Changes to earlier rounds:

- **B11 overridden.** Round 2 renamed the DesktopShell side-region slots to `#nav` on both shells. SHELL-Q2 keeps `#rail` and `#sidebar` on DesktopShell and `#nav` on MobileShell. `spec/` records why: the desktop shell has two side regions (rail and sidebar) and the mobile shell has one bottom bar. No code change; the 3 app sites in `rc-migration-effort.md:46,130` drop out of the work list.
- **H15 confirmed, with a question answered.** The shell keeps its ScrollArea. The docs gain a line on when to pass `:scroll="false"` (pages that scroll their own panes). Wiki is one such app and uses CSS instead (`MainLayout.vue:133-142`). `rc-migration-effort.md:101` shows 0 DesktopShell app sites; the real number is 2 (GP, Wiki).
- **H17 closed** with option 1: nearest owner, registry as fallback. SHELL-Q1 research adds that the shell should provide the element it renders itself.
- **H14 overridden.** Rounds 1 and 2 decided to remove `viewportClass`. The first SHELL-Q4 pick also removed it, on the belief that no app used it. After the research found 10 app sites (not 7; `rc-migration-effort.md:72` needs correcting), the maintainer kept the prop, as the page recommended. P10 (`PHILOSOPHY.md:309-321`) and the ScrollArea docs name it as the one exception to the no-inner-class-props rule. No app changes.
- **ScrollBar internal, not experimental.** The medium triage (`rc-medium-triage.md:150`) and the page moved ScrollBar to `frappe-ui/experimental`. SHELL-Q6 removes the export with no replacement. PR title needs `!`; 0 app sites.
- **`useSheetDrag` internal, not experimental.** The medium triage (`rc-medium-triage.md:149`) and the page moved it to `frappe-ui/experimental`. SHELL-Q7 removes it from the root. PR title needs `!`; 0 app sites. It can be exported again when a second surface needs it.
- **No `data-fui-` prefix.** The first SHELL-Q9 answer renamed the opt-out and added a prefix rule. After the research showed the rule would apply to `data-slot` and `data-state`, the maintainer dropped both. `data-no-scroll-top` and `data-no-sheet-drag` keep their names, and P10 gets no new rule. SHELL-Q9 still keeps the single click (the page recommended a double-click). No code change.
- **`useShellScrolled` default removed.** The triage put the 200-versus-12 fix in 1.1 as a default change. SHELL-Q10 makes `threshold` required before RC. 0 app sites (GP already passes it). PR title needs `!`.
- **M-composables getter becomes a removal.** Round 1 and `rc-migration-effort.md:45` treated this as a codemod-able rename (T1, 3 sites). SHELL-Q11 also removes the root export, so Wiki's 3 sites and 2 docs recipes lose the function. The replacement is a new read-only `resolvedColorScheme` ref on `useColorScheme()`. The same name moves from a function to a ref, so imports break and a codemod cannot convert the calls; the PR title needs `!`. Wiki can then delete its `MutationObserver` (`useTheme.js:28-37`), and after SHELL-Q12 its own `toggleTheme` (`:50-52`) as well.
- **M-composables docs split.** Round 1 said "add the missing docs before RC". SHELL-Q13 moves the portal target docs to 1.1. SHELL-Q12 fixes the toggle before RC as round 1 said.
- SHELL-Q5 and SHELL-Q8 confirm the medium triage.

Follow-up work from this page, for the RC work list:

- **DesktopShell (SHELL-Q1).** Add `scroll` to `DesktopShellProps` and use it in `defineProps`. Document when to pass `:scroll="false"`. Wiki follow-up: pass `:scroll="false"` and delete `MainLayout.vue:133-142`.
- **Shell slot names (SHELL-Q2).** Record in `spec/` why DesktopShell has `#rail` and `#sidebar` and MobileShell has `#nav`.
- **Ownership (SHELL-Q3).** DesktopShell and MobileShell provide their scroll element and their PageHeaderTarget element. `useShellScrolled` and PageHeader inject the nearest one and fall back to the registries.
- **ScrollArea (SHELL-Q4, SHELL-Q5, SHELL-Q6).** Keep `viewportClass`. Add a line to P10 and to `ScrollArea.md` naming it as the documented exception. Document `orientation="both"`. Remove `ScrollBar` from `ScrollArea/index.ts:2` and the root, and delete `ScrollArea.md:20-24` and `ScrollArea.api.md:57-59`. PR title needs `!`.
- **`useSheetDrag` (SHELL-Q7).** Remove it and its types from `src/index.ts:141-145`. Delete the sentence at `BottomSheet.md:40-41`. PR title needs `!`.
- **PageHeader (SHELL-Q8, SHELL-Q9).** Extract and export every PageHeader prop type. Click-to-top and `data-no-scroll-top` stay as they are.
- **`useShellScrolled` (SHELL-Q10).** Signature `useShellScrolled(options: { threshold: number })`, a development warning when it is missing, update `useShellScrolled.spec.ts` (delete the "defaults the threshold to 200" test) and the docs lines listed in `rc-open-questions.md`.
- **Color scheme (SHELL-Q11, SHELL-Q12).** Rename the function to `getResolvedColorScheme`, remove it from the root (`src/index.ts:133`), and update `src/charts/tokens.ts:3`. Keep the `ResolvedColorScheme` type export. Add a module-level `resolvedColorScheme` ref, set in `applyColorScheme` (`useColorScheme.ts:67-75`) so it follows `setColorScheme` and OS changes, and return it read-only from `useColorScheme()`. `toggleColorScheme` flips the resolved value. Add tests for the OS-change case and for toggling from `system`. Switch `ComposeDesktop.vue` and `ComposeMobile.vue` to the ref and delete their observers. Update `migration.md:2485`, `changelog.md:740`, and `skills/frappe-ui/CORE.md:63,68`. PR title needs `!`.
- **Wiki follow-up.** In `useTheme.js`, use `useColorScheme().resolvedColorScheme`, delete the `MutationObserver` (`:28-37`), and use `toggleColorScheme` instead of its own `toggleTheme` (`:50-52`).
- **1.1.** Portal target docs (SHELL-Q13).
- **`rc-migration-effort.md`.** Correct H15 (0 → 2 DesktopShell sites) and the getter row (rename → removal, not codemod-able). Drop B11 and H14 from the break list; if the H14 row stays for the record, its count is 10, not 7. Change the ScrollBar and `useSheetDrag` rows from "move to experimental" to "remove from root".

## Grilling answers: editor (2026-09-14)

Source: `grilling/07-editor.html`. ED-Q3, ED-Q4, and ED-Q5 asked for facts; the answers are in `rc-open-questions.md`. The maintainer accepted the research recommendations for all three in a follow-up. All 12 are decided. Two final picks differ from the page's recommended option: ED-Q4 takes option B with changes, and ED-Q7 keeps ImageViewer on by default. ED-Q3 first picked removing all StarterKit configuration; after the research it keeps the page's recommendation.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| ED-Q1 | H23 | decided | Use TipTap `Extensions` in both Editor and useEditor | (none) |
| ED-Q2 | H24, H25 | decided | Require `file_url`, expose request options, and export `MediaUploadProgress` | (none) |
| ED-Q3 | H26 | decided (first pick reversed) | Remove `code`, `codeBlock`, and `link` from `StarterKitOptions` and correct the docs. Keep StarterKit exported and configurable. InlineKit gets its own `starterKit` type; the `starterKit` key on CommentKit and RichTextKit is `Omit<StarterKitOptions, 'heading'>` | do we need StarterKit? why does it exist? anyone uses it? <br>Research: yes. It is the base of CommentKit and RichTextKit (PR #765). No app imports it, but crm and suite configure it through the kits' `starterKit:` key, and suite needs it to turn off `undoRedo` under collaboration. Removing all configuration breaks both. <br>Follow-up (2026-09-14): "yes" |
| ED-Q4 | H27, M-editor/A | decided (page recommendation not taken) | Option B with changes: type all 18 kit keys against their real option types; give emoji and `slashCommands` owned narrow types; `slashCommands` gets an optional `items` that works, and `{}` still means the built-in menu; InlineKit's `starterKit` accepts only `false` on its 8 keys, or `false` | need simple examples to understand this before i can decide <br>Research: examples in `rc-open-questions.md`. All 7 app kit setups compile unchanged; "require items" would break the `slashCommands: {}` default. <br>Follow-up (2026-09-14): "go with recommendation" |
| ED-Q5 | B12 | decided | Rename the fields to `nodeView` and `listComponent`, in both `SuggestionExtension` and `createSuggestionExtension` | if we go with the rename, how many call sites do we need to migrate? <br>Research: 2 app sites (gameplan 1, helpdesk 1); own tree 10 declaration sites and 8 callers. <br>Follow-up (2026-09-14): "sure" |
| ED-Q6 | B13 | decided | Use `{ label, value }` and pass the original item to the item slot | (none) |
| ED-Q7 | B14 | decided (page recommendation partly taken) | StyleClipboard and Toc become opt-in; ImageViewer stays on by default | make styleclipboard and Toc optional, keep imageviewer |
| ED-Q8 | M-editor/A | decided | Export one owned narrow options type for both menu components | (none) |
| ED-Q9 | M-editor/A | decided | Rename `buttonSize` to `size` before RC | (none) |
| ED-Q10 | M-editor/A | decided | Freeze 15px as the v1 default and correct the documentation | (none) |
| ED-Q11 | M-editor/C | deferred to 1.1 | Defer EditorDropZone context fallback, `data-slot`, and the missing type exports to 1.1 and record them | (none) |
| ED-Q12 | L-editor | deferred to 1.1 | Editor localization hooks wait for 1.1 | (none) |

Changes to earlier rounds:

- **H26 confirmed, with two type fixes (ED-Q3).** The first ED-Q3 pick removed all StarterKit configuration. The research showed crm (`EmailEditor.vue:262`, `paragraph: false`) and suite (`CoreEditor.vue:215-220`, `undoRedo: false` under collaboration) need the kits' `starterKit:` key, so the maintainer kept round 1's decision. Two additions the audit missed: `code: false` works in InlineKit (`kits.ts:295`), so InlineKit gets its own type instead of losing that key; and `heading` inside the kits' `starterKit:` key does nothing (`kits.ts:81-84`), so the type omits it. The H26 site count is 0, not 1: the wiki match was TipTap's own kit.
- **H27 and M-editor/A slashCommands changed (ED-Q4).** Round 1 and the medium triage said `slashCommands` must require `items`. That was wrong: `slashCommands: {}` is the kit default and shows the built-in menu. ED-Q4 makes `items` optional and makes it work (today `{ items }` is ignored). `spec/editor.md:218` and `rc-medium-triage.md:185` must change.
- **M-editor/A InlineKit changed (ED-Q4).** The medium triage said to pass InlineKit's `starterKit` objects through. ED-Q4 narrows the type to `false` only, which changes no runtime behavior. Accepting objects later is an additive widening.
- **H27 is T0, not T2.** 7 app kit setups (not 5), 0 edits. `rc-migration-effort.md:76,80,165,169` need correcting.
- **B12 site count corrected (ED-Q5).** `rc-migration-effort.md` showed 0 app sites; the real count is 2. The rename also covers the public `SuggestionExtension.configure` field.
- **B13 closed with a different model (ED-Q6).** Round 2 picked generic items with accessors. ED-Q6 uses `{ label, value }`, and the item slot receives the original item, as the round 2 comment proposed.
- **B14 narrowed (ED-Q7).** Round 2 made StyleClipboard, Toc, and ImageViewer opt-in. ED-Q7 keeps ImageViewer in RichTextKit by default, so only StyleClipboard and Toc need an opt-in. Fewer of the 6 measured RichTextKit setups (`rc-migration-effort.md:88,182`) can change behavior; the ones that use a table of contents or style copy must opt in. ImageViewer takes no options, so ED-Q4 types its key as `{} | false`.
- **M-editor prose default kept at 15px (ED-Q10).** Round 1 said "resolve all before RC", and `rc-migration-effort.md:85` listed changing the fallback to 14px. ED-Q10 takes round 3's suggestion: 15px stays, and `docs/content/docs/molecules/editor.md:68-78` changes to say 15px. No code change; the 22 sites drop out of the break list.
- **M-editor/C and L-editor deferred.** Round 1 said "resolve all" for M-editor; ED-Q11 confirms the medium triage (1.1). ED-Q12 confirms L-editor for 1.1.
- H23, H24, and H25 confirm the earlier decisions.

Follow-up work from this page, for the RC work list:

- **Extensions type (ED-Q1).** `extensions: Extensions` in `Editor.vue:3-16` and `useEditor.ts:12-26`.
- **Upload callback (ED-Q2).** `UploadedFile.file_url` required; `uploadFunction(file, options?: MediaUploadRequestOptions)`; export `MediaUploadProgress` (`useEditor.ts:20-38`, `extensions/shared/media-upload-types.ts:42-68`). 6 type-use sites need a manual check (`rc-migration-effort.md:162`).
- **StarterKit (ED-Q3).** Remove `code`, `codeBlock`, `link` from `StarterKitOptions` (`extensions.ts:98,99,107`). Give InlineKit its own `starterKit` type. Type the CommentKit and RichTextKit `starterKit` key as `Omit<StarterKitOptions, 'heading'>`. Correct `docs/content/docs/molecules/editor.md:141` and `stories/Primitives.vue:37-42`. 0 app sites.
- **Kit types (ED-Q4).** Replace `CustomMember` (`kits.ts:54`) with the real option type per key (table in `rc-open-questions.md`). Owned narrow types for emoji and `slashCommands`. Make `slashCommands: { items }` replace the built-in list; `{}` keeps it. InlineKit `starterKit`: `{ bold?, italic?, strike?, underline?, code?, dropcursor?, gapcursor?, undoRedo?: false } | false`. Add type tests for a misspelled key. Fix `spec/editor.md:218`. 0 app edits.
- **Suggestion names (ED-Q5).** `component` → `listComponent` in `SuggestionExtension.ts:17,60,63` and `createSuggestionExtension.ts:60,114`, and in the tag, emoji, slash-commands, and mention callers; `component` → `nodeView` in `mention-extension.ts:192,199,204` and `kits.ts:58`; delete `mention-extension.ts:49`. Update the two tests, `spec/editor.md:356`, and `migration.md:2041`. Development warning when `component` is still passed. PR title needs `!`. App follow-ups: gameplan `frontend/src/components/editor/config.ts:45` and helpdesk `desk/src/tiptap-extensions.ts:80`. The v0 editor in `experimental/` is not changed.
- **Suggestion items (ED-Q6).** Mention and tag items become `{ label, value }`; the item slot receives the original item. Remove `email`, `full_name`, and `isNew` from the public types (`mention-extension.ts:24-30`, `tag-extension.ts:105-110`). App site count not measured yet; measure before the PR.
- **RichTextKit defaults (ED-Q7).** `styleClipboard: false` and `toc: false` by default (`kits.ts:196-224`); ImageViewer stays. Check the 6 RichTextKit setups for table of contents and style copy use. PR title needs `!`.
- **Menu options (ED-Q8).** One owned `EditorMenuOptions` type for `EditorBubbleMenu` and `EditorFloatingMenu`, with a typed `shouldShow` context. 6 app sites need a manual check.
- **Fixed menu (ED-Q9).** `buttonSize` → `size` on `EditorFixedMenu`. 2 app sites, codemod-able. PR title needs `!`.
- **Prose font (ED-Q10).** Docs say 15px at `docs/content/docs/molecules/editor.md:68-78`. No code change.
- **1.1.** EditorDropZone context fallback and `data-slot`, the missing editor type exports (ED-Q11), and editor copy hooks (ED-Q12).

## Grilling answers: list (2026-09-14)

Source: `grilling/08-list.html`. LIST-Q1, LIST-Q3, and LIST-Q4 asked for facts; the answers are in `rc-open-questions.md`. The maintainer accepted the LIST-Q4 recommendation in a follow-up. Eight are decided and two wait for 1.1. LIST-Q1 and LIST-Q3 override round 1, LIST-Q4 overrides round 2; LIST-Q6 and LIST-Q8 move items the medium triage put in 1.1 into the RC.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| LIST-Q1 | H29 | decided (overrides H29; the picked option was changed by the answer) | `virtual?: boolean` and `overscan?: number` on ListRows. No height prop on ListRows; the height comes from `List.rowHeight`. `ListVirtualOptions` is removed | Picked: "Use a virtual boolean plus separate virtualRowHeight and virtualOverscan props". List has rowHeight, virtual object has itemHeight, is there a case where two can be different? I feel like we can keep virtual as a boolean prop only, and add overscan as a prop separately? i dont think we need itemHeight because it can be inferred from List unless there is a valid reason for them to be separate then we can introduce rowHeight on ListRows as well as a separate prop <br>Research: no valid case. Rows render at `List`'s CSS height, so a different virtual height breaks windowing. The only case it enables is ListRows without a List, which is undocumented. 0 app sites use the object form. |
| LIST-Q2 | H28 | decided (resolved by LIST-Q1 and LIST-Q3) | Rename itemHeight to rowHeight in both public option types | (none) <br>Both public option types are removed, so `rowHeight` on List is the only public name. Rename the internal `useVirtualRows` option to `rowHeight` too. |
| LIST-Q3 | H30 | decided (overrides H30) | Stop exporting useVirtualRows and keep virtualization component-only | do we need to expose useVirtualRows? if not dont <br>Research: no. `ListRows` is its only caller; 0 callers in docs, stories, tests, or apps. |
| LIST-Q4 | B15 | decided (overrides B15) | No `as`. Keep the element rule and the select-mode rule; correct the docs, fix our own examples, and file the checkbox nesting as a separate accessibility issue. Not a break | unsure, tell me how `as` fixes the problem? is there a simpler way to solve this? <br>Research: `as` fixes neither problem, and 3 consumer lists rely on a row click toggling selection. <br>Follow-up (2026-09-14): "yes" |
| LIST-Q5 | M-list | decided | Use `data-state="active\|inactive"` plus boolean `data-selected` and `data-interactive` | (none) |
| LIST-Q6 | M-list | decided (triage said 1.1) | Add `selected` and `active` slot props before RC | (none) |
| LIST-Q7 | M-list | decided | Rename `#header` to `#label` before RC | (none) |
| LIST-Q8 | M-list | decided (triage said 1.1) | Rename `#suffix` to `#sort-indicator` and keep edge-aware placement | (none) |
| LIST-Q9 | M-list | deferred to 1.1 | Wait until 1.1, then rename or remove the experimental collisions | (none) |
| LIST-Q10 | L-list | deferred to 1.1 | Wait until 1.1, keeping and documenting the English-only generated tooltip for v1 | (none) |

Changes to earlier rounds:

- **H29 overridden (LIST-Q1).** Round 1 shipped the boolean-or-object `virtual` overload. It becomes `virtual?: boolean` plus `overscan?: number` (default 6). The page's option 3 also had a `virtualRowHeight` prop; the maintainer dropped it. A ListRows height prop can be added later if a real case appears. PR title needs `!`.
- **H28 closed by removal (LIST-Q2).** Round 1 renamed `itemHeight` to `rowHeight` in two public types. Both types leave the public API, so no public rename is left. The H28 row in `rc-migration-effort.md:56,140` becomes "object form removed", still 0 app sites.
- **H30 overridden (LIST-Q3).** Round 1 exported owned return types for `useVirtualRows`. The composable is no longer exported, so the types are not needed. `rc-migration-effort.md:27,106` must change from "owned return type" to "export removed".
- **B15 overridden (LIST-Q4).** Round 2 decided to add `as` and stop swallowing `onClick` in selectable mode. The research found that `as` fixes neither problem and that gameplan (`DiscussionList.vue`, `Drafts.vue`) and frappe_books (`pages/ListView/List.vue`) rely on a row click toggling selection. The maintainer took the recommendation: no `as`, no behavior change. B15 drops out of the break list, and the `rc-migration-effort.md:90,184` row (T3) is removed. `rc-medium-triage.md:209` must change to match.
- **M-list mostly confirmed.** Round 1 said "resolve all before RC". LIST-Q5, LIST-Q6, LIST-Q7, and LIST-Q8 do that; LIST-Q9 defers the experimental collisions to 1.1, which `rc-medium-triage.md` already proposed. LIST-Q6 and LIST-Q8 were in the triage's "can wait" list and now go into the RC.
- **L-list confirmed for 1.1 (LIST-Q10).**

Follow-up work from this page, for the RC work list:

- **Virtual props (LIST-Q1, LIST-Q2).** Delete `ListVirtualOptions` (`src/molecules/list/types.ts:118-124`) and its export (`index.ts:23`). In `ListRows.vue`: `virtual?: boolean` and `overscan?: number` (line 41), height from `context?.rowHeight.value` (lines 51-55), warning names only `rowHeight` (line 61), pass `props.overscan` (lines 73-74), doc comment (lines 37-39), drop the type import (line 22). Rename the internal `itemHeight` option to `rowHeight` (`useVirtualRows.ts:16,43`). Regenerate `list.api.md:186-189`. Fix `list.md:183` and `skills/frappe-ui/CORE.md:311`. 0 app edits. PR title needs `!`.
- **`useVirtualRows` (LIST-Q3).** Delete `src/molecules/list/index.ts:14-15`, the sentence in `list.md:183-184`, and the mention in `docs/content/public/llms.txt:108`. 0 app edits. Same PR as above.
- **ListRow activation (LIST-Q4).** Reword `types.ts:86-87,97`; fix `TicketsDesktop.vue:412,435` and `CORE.md:322,329`; remove the no-op `@click` in `Feed.vue:74`, `AccountingDesktop.vue:687`, `AccountingMobile.vue:280`; open an issue for the checkbox nested inside `<a>`/`<button>`. No `!`.
- **Row state attributes (LIST-Q5).** In `ListRowBase.vue:2-9`: `data-state="active|inactive"`, `data-selected`, `data-interactive`. 2 app selector sites, codemod-able; 9 own-tree sites. PR title needs `!`.
- **Slot props (LIST-Q6).** Add `selected` and `active` to the ListRows default slot (`ListRows.vue:2-15,44-47`). Additive.
- **ListGroup slot (LIST-Q7).** `#header` → `#label` (`ListGroup.vue:6-15,22-37`). 0 app sites, 1 own-tree site. PR title needs `!`.
- **Sort slot (LIST-Q8).** `#suffix` → `#sort-indicator` on `ListHeaderCellSort` (`ListHeaderCellSort.vue:22-51`, `types.ts:101-115`); placement stays. App sites not measured; measure before the PR. PR title needs `!`.
- **1.1.** Experimental ListView name collisions (LIST-Q9) and a `tooltip` hook on `ListHeaderCellSort` (LIST-Q10).

## Grilling answers: packaging-tokens (2026-09-14)

Source: `grilling/09-packaging-tokens.html`. PKG-Q4, PKG-Q5, and PKG-Q6 asked for facts; the answers are in `rc-open-questions.md`. PKG-Q3 and PKG-Q8 add scope, so their facts are there too. All 9 are decided. The maintainer accepted the research recommendations for the focus variables and the alpha names in a follow-up. Four final picks differ from the page: PKG-Q4 and PKG-Q6 remove the `--focus-<name>` variables, PKG-Q3 adds half steps, PKG-Q7 keeps the replacing preset, and PKG-Q8 turns the Lucide virtual icons off by default.

| QID | Covers | Status | Choice | Answer |
|---|---|---|---|---|
| PKG-Q1 | H33, H34 | decided | Add a Tailwind v3 peer range and add `@floating-ui/vue` as a direct dependency | (none) <br>Note: PKG-Q3 needs Tailwind 3.4, so the peer range is `>=3.4.0 <4`, not `>=3.2.7 <4` |
| PKG-Q2 | H35 | decided | Delete the shim and replace every documented deep import with `frappe-ui/tailwind` | (none) |
| PKG-Q3 | B16 | decided (half steps added) | Extend `integerSpacing` through 128, remove all four explicit sizing blocks, and move 650px to the app that needs it | note that i need the .5 steps as well, 1.5, 2.5, 3.5 etc. you can limit these to 19.5 <br>Research: 16 of the 20 half steps exist today (Tailwind 0.5 to 3.5, plugin 4.5 to 15.5); 16.5 to 19.5 are new. All sizing families read spacing only from Tailwind 3.4. 0 sites change value: no `min-w-50` or `w-wizard` anywhere |
| PKG-Q4 | X7, H18, M-packaging | decided (page recommendation not taken for focus) | Freeze prose names; chart names go to #1139; the mobile variable is removed (VOC-Q7); remove the `--focus-<name>` box-shadow variables before RC and keep `--focus-outline-<name>` | focus vars are legacy? are you sure? also mobile variable is set to go away <br>Research: not legacy in the usual sense. Both families shipped together in beta.5 (PR #727), so no release used the box-shadow family alone. frappe-ui reads neither `var(--focus-<name>)`; the 11 Frappe reads use Frappe's own copy (`espresso/effects.css:27-53`). 0 app sites read frappe-ui's copy. Recommendation: remove before RC <br>Follow-up (2026-09-14): "sure, go with recommendations" |
| PKG-Q5 | B17 | decided | Semantic tokens are the recommended default; raw shades are for limited, intentional fixed-color cases. No alpha rename; document that `alpha` is a suffix on the group key | semantic tokens are recommended default, raw shades are useful in very limited but practical/intentional scenarios, what is the alpha naming inconsistency and how would you normalize it? <br>Research: raw alpha is `{hue}-alpha-{shade}` (`bg-gray-alpha-100`); semantic alpha is `{category}-alpha-{hue}-{step}` (`bg-surface-alpha-gray-2`). Both put `alpha` right after the group key, which is the Figma name. The audit example `gray-500-alpha` does not exist. Recommendation: no rename; document the rule <br>Follow-up (2026-09-14): "sure, go with recommendations" |
| PKG-Q6 | M-packaging | decided (page recommendation not taken for focus) | Set `rounded-9` to 100px and remove the legacy focus variables now | i am unsure about the legacy focus variables, please explain with examples <br>Research and examples: see PKG-Q4 in `rc-open-questions.md` <br>Follow-up (2026-09-14): "sure, go with recommendations". This matches the maintainer's first pick |
| PKG-Q7 | M-packaging | decided (page recommendation not taken) | Keep the preset replacing Tailwind's colors, font sizes, screens, radii, and shadows; document that it replaces them | i think replace was intentional, extend will leak tailwind's classes <br>Check: no doc says the preset extends Tailwind. `foundations/tailwind.md:15-16` only says it fills gaps in the spacing scale, and spacing is extended. The audit's contradiction was wrong |
| PKG-Q8 | M-packaging | decided (scope added) | Document one canonical Vite, Vue, Tailwind v3, `frappe-ui/vite`, and TypeScript setup before RC. Also: `lucideIcons` defaults to `false`, and frappe-ui's shipped code uses class icons | i think importing icons from lucide virtual module should be turned off by default, if there is code in frappe-ui that uses it, should switch to the class name based icons. apps can turn it on intentinoally. <br>Facts: root has 2 imports (PickerShell, Rating); experimental has 79 in 9 files. Rating's filled star cannot be a class icon. Of 7 apps, only Gameplan uses the default; the rest pass `lucideIcons: true` or do not use the Vite plugin |
| PKG-Q9 | L-packaging | decided | Fix tags, dependencies, shipped imports, tarball contents, and types conditions before RC; defer the experimental `Icon` rename | (none) |

Changes to earlier rounds:

- **M-packaging/A Tailwind extension dropped (PKG-Q7).** The medium triage (`rc-medium-triage.md:223`) moved the five theme sections under `theme.extend`, and `rc-migration-effort.md:86` listed it as a T3 break with 8 app sites. PKG-Q7 keeps replacement, so stock Tailwind colors and shades do not appear next to frappe-ui's. No code change; the 8 sites drop out of the break list. The audit finding at `rc-api-audit.md:304-305` was wrong: no doc says the preset extends Tailwind.
- **B16 widened (PKG-Q3).** Round 2 and the triage (`rc-medium-triage.md:227`) aligned `minWidth.50` and removed `width.wizard`. PKG-Q3 generates the whole scale instead: integers 1 to 128 and half steps 0.5 to 19.5, with the plugin's `spacing`, `width`, `height`, `minWidth`, and `maxHeight` blocks deleted. No app uses `w-wizard`, so there is no app to move 650px to.
- **H33 range raised (PKG-Q1, PKG-Q3).** `min-w-*`, `max-w-*`, and `min-h-*` read the spacing scale only from Tailwind 3.4, so the peer range is `>=3.4.0 <4`. Every measured app already resolves 3.4.x.
- **H18 confirmed as removal (PKG-Q4).** The page option said "rename the mobile variable". VOC-Q7 already removes it with a fixed 52px height, and the maintainer confirmed that. The page text was out of date.
- **Legacy focus variables removed (PKG-Q4, PKG-Q6).** The triage (`rc-medium-triage.md:222`) and the page kept `--focus-<name>` as documented legacy output, based on ADR-0005 and a 13-read Frappe count. The research found both reasons wrong: no release used them alone, and Frappe defines its own copy. The maintainer accepted the recommendation to remove them before RC. PR title needs `!`; 0 app sites.
- **B17 closed, alpha rename dropped (PKG-Q5).** Round 2 left B17 open. The triage's "put `alpha` in one consistent name position" (`rc-medium-triage.md:228`) is replaced by no rename and a documented rule. No code change.
- **`lucideIcons` default flipped (PKG-Q8).** The triage (`rc-medium-triage.md:232`) and the page made the root entry work when the option is `false`. PKG-Q8 also makes `false` the default. This breaks build config for apps that rely on the default, so the PR title needs `!`.
- PKG-Q2, PKG-Q9, and the `rounded-9` part of PKG-Q6 confirm earlier decisions.

Follow-up work from this page, for the RC work list:

- **Package metadata (PKG-Q1, PKG-Q9).** `tailwindcss: ">=3.4.0 <4"` in `peerDependencies`; `@floating-ui/vue` in `dependencies`. The hygiene batch as listed at `rc-api-audit.md:335-339`. Pack and install into a clean app to test. The experimental `Icon` rename waits.
- **Tailwind shim (PKG-Q2).** Delete `src/utils/tailwind.config.js` and fix `readme.md:61-70`. The v0 site can use a codemod for the literal path.
- **Sizing scale (PKG-Q3).** In `tailwind/preset.js`, generate integers 1 to 128 and half steps 0.5 to 19.5. Delete the plugin's `spacing` block (`plugin.js:288-303`) and the `width`, `height`, `minWidth`, and `maxHeight` blocks. Update `foundations/tailwind.md:15` ("1–64"). 0 app sites.
- **CSS variables (PKG-Q4).** Document the `--prose-*` names as frozen. Charts: #1139. Mobile variable: VOC-Q7 work item. Remove the `--focus-<name>` variables: delete `tailwind/colorPalette.js:168,172`, update the comment at `:149`, and update ADR-0005 lines 40 and 58. Changelog line: `box-shadow: var(--focus-X)` becomes `outline: var(--focus-outline-X)`. PR title needs `!`. Also fix `docs/components/foundations/FocusRingPreview.vue:17-41` (it labels `--focus-outline-*` swatches with the old names), `spec/foundations.md:28`, and `spec/adr/README.md:13` (both still describe `focus-visible:ring-2`).
- **Color tokens (PKG-Q5).** Foundations docs: semantic tokens are the default for UI that follows the theme; raw shades are for fixed colors, with the editor swatches as the example. Check frappe-ui's own components for raw shades on themed UI. Document the alpha rule: `alpha` is a suffix on the group key (`gray-alpha`, `surface-alpha`, `outline-alpha`). Correct the wrong `gray-500-alpha` example at `rc-api-audit-review.html:256`.
- **Radius (PKG-Q6).** `rounded-9` → 100px in `tailwind/generated/radius.json:11`. Visual check of own-tree uses (T3, 0 app sites).
- **Preset docs (PKG-Q7).** Add one line to `foundations/tailwind.md`: the preset replaces Tailwind's colors, font sizes, screens, radii, and shadows, so stock classes such as `2xl:` and `shadow-inner` are not generated. No code change.
- **Lucide icons (PKG-Q8).** `vite/index.js:13` defaults to `false`; update `vite/index.d.ts:133-137`. Convert `PickerShell.vue:68` to a `lucide-chevron-down` class. Give Rating an inline filled-star SVG (a class icon draws only the outline; `Rating.cy.ts:172-179` checks the fill). Convert the 79 imports in `experimental/FloatingWindow` and `experimental/TextEditor` in the same PR, because the experimental barrel pulls them into every app build. Keep the TextEditor command `icon` values as components that render a class icon, so the shape apps may read does not change. Add `experimental/FloatingWindow` to `tailwind/content.js:50-58`. Update `icons.md:94-165`, `other/vite.md:121-133`, `vite/README.md:90-122`, `skills/frappe-ui/SETUP.md:16,142`, `Rating/types.ts:23`, `Rating.md:37`, and `Rating.api.md:37`. Write the canonical setup page. Migration note: "If you import `~icons/lucide/*` or use `<LucideX />` tags, pass `lucideIcons: true`." PR title needs `!`. App follow-up: Gameplan `vite.config.ts:34` adds `lucideIcons: true` (2 imports, 4 tags).
- **`rc-migration-effort.md`.** Drop the M-packaging/A row (`:86`). Add a `lucideIcons` default row: T1, 1 app (GP, one config line). Add a `--focus-<name>` removal row: T0, 0 app sites. The H33 range changes to 3.4.

## Round 5: work-list gaps (2026-09-14)

| Gap | Status | Decision | Notes |
| --- | --- | --- | --- |
| Tooltip control gap (OVR-Q1) | decided | Tooltip is exempt from the `open` / `setOpen(boolean)` / `close()` trigger-slot rule. It stays hover-only with no controlled open model. | User's words: "Tooltip is exempt". PR 2 touch list updated. |
| Row-state vocabulary (OVR-Q2 vs LIST-Q5) | decided | LIST-Q5 model wins: `data-state="active\|inactive"` for the current or highlighted row, boolean `data-selected` for selection. Drop `selected\|unselected` from OVR-Q2. reka-rendered items keep reka's `data-highlighted` and `data-state="checked"`. | User confirmed 2026-09-14. Active and selected are independent on the same row, so one `data-state` value cannot carry both. Matches P7 slot props `{ active, selected }` and the existing `data-active` on ListRowBase. OVR-Q2 amended below. |
