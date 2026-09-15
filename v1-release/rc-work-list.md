# Frappe UI v1 RC work list

- Audited commit: `f4dfb48160` (`v1.0.0-beta.63`).
- Current batch base: `2b990bdb7de35616a4e600e2222a733c51aba5d3` (`v1.0.0-beta.69`).
- Items 1, 3, and 6 landed in PRs #1151, #1150, and #1149.
- The remaining 15 sections ship as exactly three sequential PRs: batch 1 is
  items 2, 4, 5, 7, 9, 12, and 16; batch 2 is items 8, 10, 11, 13, and 14;
  batch 3 is items 15, 17, and 18. Section titles below are scope records, not
  separate PR instructions.
- Batch 1 landed at `v1.0.0-beta.69`. Batch 2 is implemented on `v1/rc-batch-2`:
  items 8, 10, 11, 13, and 14, covering 45 QIDs. Batch 3 is implemented on
  `v1/rc-batch-3`, stacked on batch 2: items 15, 17, and 18, covering 17 QIDs
  and one codemod (`packaging-v1`).
- Already landed: one delegated chart workstream, issue #1139 through PR #1141 at `bc0b402820`.
- Deferred: 8 complete QIDs and 4 parts of QIDs wait for 1.1.
- Delegated: two workstreams. Charts #1139 is complete. Tree #1142 is still outside this list.

The source check used `git log --oneline f4dfb48160..HEAD` and `git diff --stat f4dfb48160..HEAD`. No non-chart final decision landed in that range. PR #1140 changed picker internals, but the public delay, `toggle`, and `allowCustomTime` contracts remain unchanged. Each unlanded item below remains required unless it says the current API stays.
Exact decisions and later user overrides win over older wording in this file.

## Vocabulary and codemod PRs

### 1. `refactor(navigation)!: use route and href for destinations`

Decisions:

- **VOC-Q1** — Replace router `to` with `route` and Button `link` with `href`. Touch `Button`, `PageHeaderBackButton`, `ListRow`, Sidebar, SidebarRail, MobileNav, TabButtons, their types, tests, docs, and `spec/tabs.md`. Migrate 32 measured v1 sites plus the later 4 SidebarItem sites. The codemod covers static template props and runs on this tree.
- **VOC-Q6** — Rename the PageHeader back target to `fallbackRoute`. Touch `useHeaderBack.ts`, PageHeader types, tests, and docs. The destination codemod covers static uses and runs on this tree.
- **NAV-Q7** — Rename `to` to `route` on SidebarItem, SidebarRailItem, and MobileNavItem. Add `href` for plain anchors. Touch the three component families and their docs and tests. Migrate GP 1, CRM 2, and Wiki 1 sites. The codemod covers all four.
- **NAV-Q8** — Keep `route`, `href`, and data-object `onClick` on TabButton items. Remove `tooltip` and require string labels. Touch `TabButtons/types.ts`, `TabButtons.vue`, tests, docs, and `spec/tabs.md`. Manually migrate 5 v1 sites and 4 v0 sites. The route and href names are codemod-covered. Tooltip and label changes are not.

Migration guide:

- Replace component router props named `to` with `route`. Keep `to` only inside the route object itself.
- Replace Button `link` with `href` for external URLs.
- Replace PageHeader back `to` with `fallbackRoute`.
- Replace TabButton `tooltip` with app-owned help UI and convert non-string labels to strings.

Dependencies: none. This PR establishes the destination vocabulary used by later navigation work.

Size: **L**. The codemod, tests, generated API docs, and own-tree migration exceed 30 files.

### 2. `refactor(overlays)!: use millisecond delays and explicit open controls`

Decisions:

- **VOC-Q3** — Change Tooltip, TooltipProvider, and HoverCard delay props from seconds to milliseconds. Touch those components, tests, stories, API docs, `spec/hover-card.md`, and a new `overlays-v1` codemod. The codemod converts 26 of 38 measured app sites and reports the remaining 12. It runs on this tree.
- **OVR-Q1** — Give overlay, selection, and picker slots `open`, `setOpen(boolean)`, `close()`, and `disabled` where supported. Touch Popover, Dropdown, HoverCard, ContextMenu, Select, Combobox, MultiSelect, PickerShell, TimePicker, slot types, tests, docs, and specs. Existing GP `close` callbacks need no change. The codemod covers current `toggle` uses. Tooltip is exempt (no controlled open model; decided 2026-09-14).
- **OVR-Q2** — Record `open|closed`, `active|inactive`, `checked|unchecked`, and `selected|unselected` state values in the family specs. Touch `spec/popover.md`, `spec/dropdown.md`, `spec/selection.md`, `spec/tabs.md`, and affected API docs. Consumer migration depends on the conflict listed below.
- **OVR-Q12** — Rename Popover and picker `toggle` to `setOpen`, keep `close`, add ContextMenu `portalTo`, export `HoverCardEmits`, and add trigger hooks. Touch all overlay and picker types, components, tests, docs, and specs. Current-name app sites are 0. The codemod migrates own-tree sites and reports 43 files still using the removed pre-RC Popover API.

Migration guide:

- Delay values now use milliseconds. Change `0.5` to `500` and `0.3` to `300`.
- Replace slot `toggle()` with `setOpen(!open)` and `toggle(value)` with `setOpen(value)`.
- When moving from Popover `#target` to `#trigger`, remove the app click handler because the trigger opens itself.
- Use `close()` as the shorthand for `setOpen(false)`.

Dependencies: PR 1, because the codemod shares component-import and template-tag detection rules with the destination codemod.

Size: **L**. This changes more than 30 component, test, story, documentation, and codemod files.

### 3. `refactor(base)!: normalize base component props`

Decisions:

- **M-base/A Icon** — Keep both Icon `name` and the canonical `icon`; both accept `string | Component | null`, and `icon` takes precedence when supplied. Touch `src/components/Icon`, docs, tests, and the base codemod. The 5 Books sites and 1 v0 site require no migration; the codemod may normalize static `name` props and runs on this tree. User override (2026-09-14), superseding the earlier rename-only decision.
- **M-base/A Progress** — Replace boolean `intervals` plus `intervalCount` with numeric `intervals`. Touch `src/components/Progress`, stories, tests, and docs. App sites are 0. The codemod migrates the 3 own-tree sites.
- **M-base/A Badge** — Narrow Badge `label` to `string | number`. Touch `src/components/Badge` and generated API docs. App sites are 0. No codemod change is needed.
- **M-base/A DividerAction** — Derive `DividerAction` from the shared action shape. Touch `src/components/Divider/types.ts` and its public export. App sites are 0.
- **OVR-Q8** — Rename Divider `position` to `align`; keep the other dialog-family names covered in PR 10. Touch `src/components/Divider`, tests, stories, and docs. App sites are 0. The codemod migrates own-tree uses.
- **OVR-Q13** — Render Progress label and hint independently. Touch `Progress.vue` and `Progress.cy.ts`. No consumer edit is required.

Migration guide:

- Icon `name` remains supported; optionally replace it with canonical `icon`.
- Replace Progress `intervals` and `intervalCount` with one numeric `intervals` prop.
- Pass only a string or number to Badge `label`.
- Use the shared action fields when declaring a `DividerAction`.
- Replace Divider `position` with `align`.

Dependencies: none.

Size: **M**. The work touches about 20 source, test, story, and documentation files.

### 4. `refactor(navigation)!: normalize shortcut sidebar and tab vocabulary`

Decisions:

- **NAV-Q1** — Rename SettingsDialog `shortcut` to `keyboardShortcut`, default it to `"Mod+Shift+,"`, accept `false`, use the shared shortcut composable, and export the corrected emit type. Touch SettingsDialog, shortcut composables, specs, tests, and docs. Migrate GP 1 and Books 1 sites. The codemod covers both and runs on this tree.
- **NAV-Q4** — Rename Sidebar `disableCollapse` to positive `collapsible` and invert its meaning. Touch Sidebar types, component, tests, and docs. Manually migrate GP 1 and HD 1 sites.
- **NAV-Q6** — Rename SidebarRailItem variant `tile` to `subtle` without changing rendering. Touch SidebarRail types, component, tests, and docs. App sites are 0. The codemod migrates own-tree sites.
- **NAV-Q9** — Use `active|inactive` for tab state and rename TabButtons `checked` and Tabs `selected` slot props to `active`. Touch TabButtons, Tabs, shared Pill tests, docs, migration docs, and `spec/tabs.md`. App sites are 0. The codemod migrates own-tree slots and selectors.

Migration guide:

- Replace SettingsDialog `shortcut` with `keyboardShortcut`; pass `false` to disable it.
- Replace Sidebar `:disable-collapse="value"` with `:collapsible="!value"`.
- Replace SidebarRailItem `variant="tile"` with `variant="subtle"`.
- Replace tab slot props `checked` and `selected` with `active`; replace tab `checked|unchecked` selectors with `active|inactive`.

Dependencies: PR 1, because its TabButton item contract must land before tab state changes.

Size: **M**. The change affects 10 to 30 files.

### 5. `refactor(date-time-picker)!: use typeable for time input`

Decisions:

- **INP-Q4** — Remove `allowCustomTime` and let `typeable` govern date and time typing. Touch `DateTimePicker.vue`, `DatePicker/types.ts`, tests, stories, API docs, and `spec/date-picker.md`. App sites are 0. The codemod migrates 7 own-tree sites and runs on this tree.

Migration guide:

- Replace DateTimePicker `allowCustomTime` with `typeable`.

Dependencies: PR 2, because PickerShell slot changes affect the same tests and generated API docs.

Size: **S**. The change stays under 10 files.

### 6. `refactor(editor)!: name suggestion components and menu size`

Decisions:

- **ED-Q5** — Rename suggestion `component` to `nodeView` for mention nodes and `listComponent` for suggestion lists. Touch `SuggestionExtension.ts`, `createSuggestionExtension.ts`, mention, tag, emoji, slash-command callers, tests, docs, and `spec/editor.md`. Manually migrate GP 1 and HD 1 sites. The research rejects an automatic codemod because the two meanings need context.
- **ED-Q9** — Rename EditorFixedMenu `buttonSize` to `size`. Touch `EditorFixedMenu.vue`, `MenuItems.vue`, tests, and docs. Migrate GP 1 and Frappe 1 sites. The editor codemod covers both and runs on this tree.

Migration guide:

- Replace mention node `component` with `nodeView` and suggestion popup `component` with `listComponent`.
- Replace EditorFixedMenu `buttonSize` with `size`.

Dependencies: none.

Size: **M**. The change touches about 15 files.

### 7. `refactor(list)!: normalize row state and slot names`

Decisions:

- **LIST-Q5** — Use `data-state="active|inactive"` plus boolean `data-selected` and `data-interactive` on `ListRowBase` only. Active and selected remain independent. `ItemListRow` keeps its runtime behavior, and reka-native attributes are exempt. The 2 Builder candidates are app-authored divs, so actual ListRow selector migrations are 0. The codemod covers owned selectors and runs on this tree.
- **LIST-Q7** — Rename ListGroup `#header` to `#label`. Touch `ListGroup.vue`, types, docs, and tests. App sites are 0. The codemod migrates the own-tree site.
- **LIST-Q8** — Rename ListHeaderCellSort `#suffix` to `#sort-indicator` and keep edge-aware placement. Touch `ListHeaderCellSort.vue`, types, docs, and tests. Consumer impact is 5 live sites: 2 in Gameplan `MembersSettings.vue` and 3 in Suite Drive `ListView.vue`; Gameplan `LIST_FAMILY_SPEC.md` has 2 documentation examples separately. The codemod covers statically named slots and reports other forms.

Migration guide:

- Replace ListRow selected-state selectors with `data-selected`; use `data-state="active"` for active rows.
- Replace ListGroup `#header` with `#label`.
- Replace ListHeaderCellSort `#suffix` with `#sort-indicator`.

Dependencies: none.

Size: **M**. The codemod and generated docs put the work between 10 and 30 files.

## Data layer

### 8. `fix(data-fetching)!: freeze the v1 data contracts`

Decisions:

- **VOC-Q4** — Delete `FrappeUIError`, type input errors inline, export `InputLabelingProps`, and add an owned printable route type. Touch `useInputLabeling.ts`, FormControl and picker types, public barrels, API docs, and input specs. App imports are 0. The 5 error-prop sites keep working.
- **VOC-Q5** — Replace the four implementation wildcard exports with named exports. Touch `src/resources/index.ts` and `src/molecules/editor/index.ts`, with export tests. App migrations are 0.
- **DAT-Q1** — Make `useCall.submit` and `useDoc` write actions reject. Keep read methods resolving. Touch `useCall`, `useDoc`, `useAction`, `useIsolatedCall`, tests, and data-fetching docs. Gameplan needs about 7 logic edits and about 22 `.catch` additions across 74 reviewed calls. No codemod covers behavior.
- **DAT-Q2** — Keep top-level document methods and throw a development error for reserved-name collisions. Touch `useDoc.ts` and its tests. No measured consumer edit exists.
- **DAT-Q3** — Keep the two errors independent and add the composable-to-error table. Touch the data-fetching docs and API type docs. No consumer edit is required. Maintainer follow-up (2026-09-16): `FrappeRequestError` is renamed `FrappeResourceError`, named for the layer that raises it; `FrappeResponseError` is unchanged. Touch `frappeRequest.ts`, `call.ts`, the root export, export tests, docs, migration guide and changelog. Consumer sites are 0.
- **DAT-Q4** — Export `UploadError`, reject it for network, server, and abort failures, type `state.error`, and remove `is_private`, `UploadPrivacy`, and the public privacy resolver. Touch upload utilities, handler, tests, exports, and docs. Review 7 v1 upload callers, but no app uses `is_private`.
- **DAT-Q6** — Keep documented per-composable defaults. Remove cache and refetch controls from `UseNewDocOptions` and force safe values in `useNewDoc` and `useDoc` methods. Touch those composables, tests, and docs. App sites are 0.
- **DAT-Q8** — Keep root `dayjs`, `dayjsLocal`, and public `Dayjs`; keep `dayjsSystem` private. Touch root export tests and API docs. No consumer edit is required.
- **DAT-Q9** — Keep duplicate read and loading aliases, narrow plugin `resources` to boolean, and use named resource exports. Touch plugin types and tests, resource barrels, and docs. Migrate 2 GP object-form sites. The data codemod converts them and runs on this tree.
- **DAT-Q10** — Accept string or string-array messages in ErrorMessage and render every message. Touch ErrorMessage types, component, tests, and docs. This is additive.

Migration guide:

- Add rejection handling to `useCall.submit` and `useDoc` write actions. Read methods still resolve on failure.
- Catch exported `UploadError` from upload calls; use only the `private` option.
- Remove `refetch`, `cacheKey`, and `staleOnError` from `useNewDoc` options and `useDoc.methods` options.
- Change `app.use(FrappeUI, { resources: {...} })` to `{ resources: true }`.
- Stop importing `FrappeUIError`; use `InputLabelingProps['error']` when forwarding an input error.

Dependencies: PR 1 for the owned route type and PR 6 for the final editor barrel names.

Size: **L**. Source, tests, docs, export checks, and Gameplan follow-up exceed 30 files.

## Overlays and dialogs

### 9. `fix(overlays)!: close menu types and overlay fallthrough`

Decisions:

- **VOC-Q2** — Use component `click` emits, data-object `onClick`, and `Event` for Menu actions. Touch Menu types, component, tests, and docs. App sites are 0.
- **OVR-Q3** — Change `MenuActionOption.onClick` from `PointerEvent` to `Event` and remove casts. Touch `Menu/types.ts` and `Menu.vue`. App sites are 0.
- **OVR-Q4** — Give Menu, Dropdown, and ContextMenu fixed slots plus typed ``item-${string}`` slots. Touch their types and type tests. App edits are 0, but type checking can reveal misspelled dynamic slots.
- **OVR-Q10** — Keep HoverCard's 300ms default after the unit change, add overlay and dialog hooks, and keep PromptField narrow. This PR owns HoverCard and overlay hooks. Touch HoverCard, ContextMenu, Dropdown, tests, docs, and specs. No delay-default migration remains.
- **OVR-Q11** — Disable HoverCard and ContextMenu fallthrough. Ignore pointer-down on HoverCard's own trigger. Touch both components, tests, and `spec/hover-card.md`. Delete the one GP HoverCard handler. No ContextMenu site changes behavior.

Migration guide:

- Type Menu action handlers as `Event`, not `PointerEvent`.
- Do not pass arbitrary listeners or attributes through HoverCard or ContextMenu; use their documented APIs.
- Remove Gameplan's `@pointer-down-outside` HoverCard workaround after upgrading.

Dependencies: PR 2 supplies the common slot and delay contracts.

Size: **M**. The work touches 10 to 30 files.

### 10. `refactor(dialog)!: freeze dialog toast and progress contracts`

Decisions:

- **OVR-Q5** — Use `icon?: string | Component`, add `theme?: DialogTheme`, and delete `DialogIcon`. Touch Dialog types, component, tests, docs, and `spec/dialog.md`. Manually migrate 3 app sites.
- **OVR-Q6** — Keep component `DialogAction`; rename and export the imperative type as `ImperativeDialogAction`. Touch dialog utilities, public exports, tests, docs, and `spec/imperative-api.md`. App type imports are 0.
- **OVR-Q7** — Document the existing 4000ms Toast default, export owned toast option types, and keep ToastProvider prop-free. Touch Toast types, docs, export tests, and `spec/toast.md`. No consumer edit is required.
- **OVR-Q8** — Keep Dialog `message`, Breadcrumb slot names, the open BreadcrumbItem record, and Alert `data-color`; document these contracts. Divider `align` is in PR 3. Touch Dialog, Breadcrumbs, Alert, SidebarCard docs, and `PHILOSOPHY.md`. No consumer migration is required.
- **OVR-Q9** — Keep `Dialog.Title`, `Dialog.Description`, `Dialog.Close`, numeric `paddingTop`, and Alert's boolean auto-icon. Document each. Touch Dialog and Alert types, generated docs, tests, and `spec/dialog.md`. No consumer migration is required.
- **OVR-Q10** — Add `data-slot` hooks to Dialog and BottomSheet content and actions. Make BottomSheet query its hook. Touch both components, tests, and docs. This is additive.
- **OVR-Q13** — The Progress hint fix is in PR 3. This PR only checks that Dialog progress examples need no duplicate workaround.

Migration guide:

- Replace structured `DialogIcon` values with an icon class name or Vue component, and pass tone through `theme`.
- Replace the imperative action type import with `ImperativeDialogAction`.

Dependencies: PR 3 for Divider and Progress, and PR 9 for shared Menu action types.

Size: **M**. The work stays within 10 to 30 files.

## Inputs and selection

### 11. `refactor(inputs)!: freeze input and selection contracts`

Decisions:

- **INP-Q1** — Add shared `SelectionOption` and `SelectionGroup` unions while keeping component-specific types. Touch selection types and root exports. App migration is 0.
- **INP-Q2** — Use `null` as the empty Select and Combobox value and keep `[]` for MultiSelect. Touch Select model types, `clear()`, tests, docs, and `spec/selection.md`. No measured app calls Select `clear()`. No codemod is needed.
- **INP-Q3** — Keep `update:open`; remove TimePicker `open`, `close`, `input-invalid`, and `invalid-change` emits; preserve rejected-text reversion. Use `InputVariant` and export `TimePickerEmits`. Touch TimePicker, tests, API docs, and `spec/date-picker.md`. App listeners are 0.
- **INP-Q5** — Add `focus()` to every input and keep `clear()` and `open()` capability-specific. Touch the input families, exposed types, tests, docs, and ADR-0012. This is additive.
- **INP-Q6** — Route control attributes and listeners once to the interactive element; keep `class` and `style` on the wrapper. Touch input components and integration tests. Review input use for behavior, because grep cannot prove dependence on fallthrough.
- **INP-Q7** — Forward `#label` and `#description` through Duration. Touch Duration, types, tests, and docs. This is additive.
- **INP-Q8** — Keep FormControl date and time routes and stop forwarding unsupported props such as `variant` to Checkbox. Touch FormControl types, component, tests, and docs. No v1 app migration is required.
- **INP-Q9** — Export `InputLabelingProps`; do not add `InputErrorValue`. Touch input barrels and export tests. App imports are 0.
- **INP-Q10** — Keep `trigger` for selection boxes and `control` for other inputs. Add FormLabel, picker chevron, and ARIA hooks. Touch inputs, pickers, tests, docs, `spec/inputs.md`, and `spec/selection.md`. This is additive.
- **INP-Q11** — Remove duplicate model emits from Combobox and MultiSelect types and correct RadioGroup emits. Touch types, API docs, and type tests. App imports are 0.
- **INP-Q12** — Use `DateRangeValue` for DateRangePicker models. Keep TextInput `string | number`, string emits, and document `v-model.number`. Touch DatePicker and TextInput docs and type tests. No consumer edit is required.
- **INP-Q13** — Keep `Dayjs` in date-picker contracts and export its type. Touch public exports and type tests. App migration is 0.
- **INP-Q14** — Replace the DatePicker type wildcard with an explicit list and remove `DatePickerViewMode` and `DatePickerDateObj` from root. Touch `DatePicker/index.ts`, root export tests, and docs. App imports are 0.
- **INP-Q15** — Add Rating `focus()` with selected-star and first-star behavior. Touch Rating, types, tests, and docs. This is additive.
- **INP-Q16** — Change Rating's default size from `md` to `sm`. Touch Rating, generated API docs, and tests. Manually review Frappe 1, HD 1, and CRM 1 sites. No codemod is planned.

Migration guide:

- Treat cleared Select and Combobox values as `null`.
- Remove TimePicker listeners for `open`, `close`, `input-invalid`, and `invalid-change`; use `update:open` for state.
- Put control attributes and listeners on the interactive element; keep wrapper layout in `class` and `style`.
- Stop importing `DatePickerViewMode` and `DatePickerDateObj` from the package root.
- Rating now defaults to `sm`; pass `size="md"` to preserve the old size.

Dependencies: PR 2 for common picker slot controls, PR 5 for DateTimePicker vocabulary, and PR 8 for input error types.

Size: **L**. This touches more than 30 component, test, type, spec, and generated documentation files.

## Navigation

### 12. `fix(navigation)!: finish navigation behavior and contracts`

Decisions:

- **NAV-Q2** — Add the `useKeyboardShortcut` setup guard before RC. Touch the composable and tests. This is a bug fix with no migration.
- **NAV-Q3** — Keep TabButtons `#prefix/#suffix` and Tabs `#tab-prefix/#tab-suffix`; explain the two modes in `spec/tabs.md`. No code or consumer change is required.
- **NAV-Q5** — Type SidebarHeader `menuItems` as `MenuOptions` with the corrected event signature. Touch SidebarHeader types, component, docs, and type tests. App edits are 0.
- **NAV-Q7** — Fix Tooltip `side`, icon rendering, route activity, and anchor fallback. The prop rename is in PR 1. Touch SidebarItem, SidebarRailItem, MobileNavItem, tests, and docs. Existing sites migrate through PR 1.
- **L-root TabButtons default** — Keep TabButtons `subtle` and TabList `underline`; document why in `spec/tabs.md`. No migration is required.

Migration guide:

- No additional migration beyond PR 1 and PR 4. Navigation fixes preserve valid current calls.

Dependencies: PR 1 for destination props, PR 4 for sidebar and tab vocabulary, and PR 9 for `MenuOptions`.

Size: **M**. The work touches 10 to 30 files.

## Shells and page header

### 13. `refactor(shells)!: make shell ownership explicit`

Decisions:

- **SHELL-Q1** — Add `scroll` to `DesktopShellProps`, use that type in the component, and document `scroll=false`. Touch DesktopShell types, component, tests, and docs. Measured 2026-09-15: the 2 shell sites are GP `DesktopLayout.vue:5` and Suite Drive `DriveLayout.vue:10`, and Drive already passes `:scroll`. Wiki is not on this box. Neither site needs an edit; the prop already worked and only the type was empty.
- **SHELL-Q2** — Keep DesktopShell `#rail/#sidebar` and MobileShell `#nav`; document the split. Touch shell docs and the shell contract note. Consumer migration is 0.
- **SHELL-Q3** — Provide the nearest shell scroll element and PageHeader target, with registries as fallback. Touch both shells, `useShellScrolled`, PageHeader target code, tests, and `spec/portal-target.md`. No caller syntax changes.
- **SHELL-Q4** — Keep `viewportClass` and document it as the ScrollArea exception. Touch `PHILOSOPHY.md` and ScrollArea docs. The 10 app sites stay unchanged.
- **SHELL-Q5** — Keep `orientation="both"` and document both scrollbars. Touch ScrollArea docs and tests. No migration.
- **SHELL-Q6** — Remove the public ScrollBar export with no replacement. Touch ScrollArea barrels, root exports, docs, and export tests. App sites are 0.
- **SHELL-Q7** — Remove `useSheetDrag` and its types from root while BottomSheet keeps the internal import. Touch root exports, BottomSheet docs, and export tests. App sites are 0.
- **SHELL-Q10** — Require `{ threshold }` in `useShellScrolled` and add a development warning for invalid calls. Touch the composable, tests, and docs. The only app call already passes a value.

Migration guide:

- Stop importing `ScrollBar`; use ScrollArea, which owns its scrollbars.
- Stop importing `useSheetDrag`; no standalone replacement ships in v1.
- Pass `{ threshold: number }` to every `useShellScrolled` call.

Dependencies: PR 2, because PickerShell and Popover changes affect shell-owned overlay tests.

Size: **L**. Ownership, tests, docs, and export changes exceed 30 files.

### 14. `refactor(page-header)!: freeze page header and color scheme APIs`

Decisions:

- **VOC-Q7** — Remove `--mobile-header-height` and keep 52px fixed. Touch `PageHeaderMobile.vue`, docs, tests, and ADR-0017. Measured 2026-09-15: Gameplan declares the variable itself at `index.css:10` as `52px` and reads it in 3 of its own files, so its declaration is not unused and keeps working. The library simply stops reading the name; nothing renders differently.
- **SHELL-Q8** — Extract and export every PageHeader prop type. Touch PageHeader components, types, barrels, generated API docs, and export tests. This is additive.
- **SHELL-Q9** — Keep one-click scroll-to-top and the existing `data-no-scroll-top` and `data-no-sheet-drag` names. Touch docs and tests only. No migration.
- **SHELL-Q11** — Make `getResolvedColorScheme` internal, remove `resolvedColorScheme()` from root, and add a read-only `resolvedColorScheme` ref to `useColorScheme()`. Touch the composable, charts token import, root exports, recipes, tests, docs, and types. Manually migrate 3 Wiki sites and 2 own recipes. A codemod cannot change a function call into a ref.
- **SHELL-Q12** — Toggle to the opposite resolved light or dark scheme. Touch `useColorScheme.ts`, tests, and docs. Wiki can delete its local toggle.

Migration guide:

- Remove overrides of `--mobile-header-height`; the mobile header is fixed at 52px in v1.
- Replace `resolvedColorScheme()` with `useColorScheme().resolvedColorScheme.value` in script code.

Dependencies: PR 1 for route vocabulary, PR 13 for nearest shell ownership, and merged chart PR #1141 because `src/charts/tokens.ts` now contains the only internal function call.

Size: **L**. PageHeader, color-scheme, chart, recipe, test, and documentation edits exceed 30 files.

## Editor

### 15. `refactor(editor)!: freeze editor kits uploads and menus`

Decisions:

- **ED-Q1** — Use TipTap `Extensions` in Editor and `useEditor`. Touch both files and type tests. This widens the accepted type and needs no migration.
- **ED-Q2** — Require `UploadedFile.file_url`, expose `MediaUploadRequestOptions` to upload callbacks, and export `MediaUploadProgress`. Touch editor upload types, `useEditor`, tests, docs, and exports. Manually verify 6 type-use sites.
- **ED-Q3** — Remove dead StarterKit `code`, `codeBlock`, and `link` keys. Give InlineKit its own starter type and omit `heading` from other kit starter options. Touch `extensions.ts`, `kits.ts`, tests, docs, stories, and ADR-0004. App edits are 0.
- **ED-Q4** — Type all 18 kit keys, give emoji and slash commands owned types, honor optional slash-command `items`, and restrict InlineKit starter settings to `false`. Touch kit types, extension implementations, tests, docs, and `spec/editor.md`. Seven app setups need no edit.
- **ED-Q6** — Use `{ label, value }` for mention and tag items and pass the original item to the slot. Touch mention and tag extensions, slot types, tests, and docs. Measured 2026-09-15: 5 sites on this box. GP `editor/config.ts` builds `{ id, label, value }` for mentions and `{ id, label }` for tags (2 edits); frappe `ComposerEditor.vue:218` maps to `{ id, label }` (1 edit); Suite's list already carries `label` and `value`, and its 2 `getMentions()` readers post the result to its API (2 reviews); Builder has no mention use. CRM, Helpdesk, Wiki and Books are not on this box.
- **ED-Q7** — Make StyleClipboard and Toc opt-in while keeping ImageViewer on. Touch `kits.ts`, tests, docs, and stories. Measured 2026-09-15 across the 4 setups on this box: 2 must opt in. GP `richTextExtensions.ts` wraps the built-in slash registry, so it needs `toc: {}` or its table-of-contents command disappears; Suite `CoreEditor.vue:154` reads `editor.storage.styleClipboard`, so it needs `styleClipboard: {}` or that line throws. Suite's table of contents is its own `@tiptap/extension-table-of-contents`, so it needs no `toc`. frappe `ComposerEditor.vue` and Suite `CommentEditor.vue` need neither.
- **ED-Q8** — Use one owned `EditorMenuOptions` type for Bubble and Floating menus. Touch both menu components, menu types, tests, and docs. Manually verify 6 Wiki option sites.
- **ED-Q10** — Keep the 15px prose default and correct the docs. Touch editor docs only. No migration.

Migration guide:

- Make every constructed `UploadedFile` include `file_url`.
- Remove dead `code`, `codeBlock`, and `link` keys from StarterKit options.
- Add StyleClipboard and Toc explicitly when an editor needs them.
- Check Bubble and Floating menu option objects against `EditorMenuOptions`.
- Update mention and tag data to include `label` and `value`; use the original slot item for extra fields.

Dependencies: PR 6 for suggestion and fixed-menu names, and PR 8 for the explicit editor barrel.

Size: **L**. The editor source, tests, stories, docs, and specs exceed 30 files.

## List

### 16. `refactor(list)!: keep virtualization component-owned`

Decisions:

- **LIST-Q1** — Make ListRows `virtual` boolean and add separate `overscan`; use `List.rowHeight`. Remove `ListVirtualOptions`. Touch ListRows, types, tests, docs, and skills. App object-form sites are 0.
- **LIST-Q2** — Rename internal virtual `itemHeight` to `rowHeight`; expose no second height prop. Touch `useVirtualRows.ts`, ListRows, and tests. Consumer migration is 0.
- **LIST-Q3** — Stop exporting `useVirtualRows` and its public types. Touch the list barrel, root export surface, docs, and export tests. App imports are 0.
- **LIST-Q4** — Do not add `as` or change selectable-row activation. Correct source comments, examples, docs, and the separate accessibility issue reference. No consumer migration.
- **LIST-Q6** — Add `selected` and `active` to the ListRows default slot. Touch ListRows slot types, tests, and docs. This is additive.

Migration guide:

- Replace ListRows object-form `virtual` with `virtual` plus `overscan`; set height on the parent List with `rowHeight`.
- Stop importing `ListVirtualOptions` or `useVirtualRows`; virtualization is component-owned.

Dependencies: PR 7 for the final row-state vocabulary.

Size: **M**. The change touches about 15 files.

## Packaging and tokens

### 17. `refactor(packaging)!: freeze the package and build contract`

Decisions:

- **PKG-Q1** — Add `tailwindcss: ">=3.4.0 <4"` as a peer and `@floating-ui/vue` as a direct dependency. Touch `package.json`, lockfile, package docs, and clean-install tests. Consumer versions already satisfy the range.
- **PKG-Q2** — Delete `src/utils/tailwind.config.js` and replace documented deep imports with `frappe-ui/tailwind`. Touch the shim, README, migration docs, and package tests. One v0 site needs the literal-path codemod. `packaging-v1` does the rewrite. Measured 2026-09-15: 0 sites left in GP, apps/frappe, Builder and Suite; all four already import `frappe-ui/tailwind`.
- **PKG-Q3** — Generate integer spacing through 128 and half steps through 19.5; remove the four explicit sizing blocks. Touch `tailwind/preset.js`, `tailwind/plugin.js`, tests, and Tailwind docs. Two classes do change: `w-wizard` (650px) is removed and `min-w-50` follows the scale at 12.5rem instead of 18rem. Measured 2026-09-15: 0 sites for either in GP, apps/frappe, Builder and Suite.
- **PKG-Q7** — Keep the preset replacing Tailwind colors, font sizes, screens, radii, and shadows; document the replacement. Touch `foundations/tailwind.md`. No migration.
- **PKG-Q8** — Default `lucideIcons` to `false`, convert shipped root and experimental icon imports, and add missing Tailwind content paths. Touch Vite, PickerShell, Rating, experimental FloatingWindow and TextEditor, tests, docs, and skills. Verified 2026-09-15: 91 `~icons/lucide/*` imports converted to class icons, and every remaining `<LucideX />` tag in shipped code is declared locally by `classIcon()`. `packaging-v1 --dry-run` reports GP `frontend/vite.config.ts` as the one config needing the option; Builder and Suite already pass it; apps/frappe does not use the plugin.
- **PKG-Q9** — Fix package tags, dependency placement, shipped imports, tarball contents, and type conditions. Touch package metadata, export definitions, build tests, and docs. Verify by packing and installing into a clean app. Verified 2026-09-15 with `npm pack` into `/tmp/rc3-consumer`: 932 files, 0 test files, all 12 exported subpaths resolve, the deep Tailwind path is blocked, all 10 bins install, and `vue-tsc` on the installed package reports 0 errors. The pack check found one more defect: the `#` self-imports did not resolve for a consumer, 136 unresolved modules, fixed by listing the `.ts` and `index.ts` forms in the `imports` map.

Migration guide:

- Import the Tailwind preset from `frappe-ui/tailwind`, not `frappe-ui/src/utils/tailwind.config`.
- Use Tailwind 3.4 or later and earlier than Tailwind 4.
- If an app imports `~icons/lucide/*` or uses auto-imported `<LucideX />` tags, pass `lucideIcons: true` to the Vite plugin.
- The Frappe UI preset replaces Tailwind colors, font sizes, screens, radii, and shadows.

Dependencies: PR 2 because PickerShell is changed by both PRs, and PR 11 because Rating needs its final default and focus tests.

Size: **L**. Experimental icon conversion and packaging verification exceed 30 files.

### 18. `refactor(tokens)!: freeze color radius and CSS variable contracts`

Decisions:

- **PKG-Q4** — Freeze prose variable names, leave chart variables to #1139, remove the mobile variable in PR 14, and remove `--focus-<name>` while keeping `--focus-outline-<name>`. Touch `tailwind/colorPalette.js`, focus previews, docs, specs, and ADR-0005. App reads of Frappe UI's removed variables are 0.
- **PKG-Q5** — Keep current alpha names; document semantic tokens as the default and raw shades as fixed-color exceptions. Touch color foundation docs and token-use checks. No migration.
- **PKG-Q6** — Set `rounded-9` to 100px and remove the old focus variables. Touch `tailwind/generated/radius.json`, generated output tests, visual fixtures, ADR-0006, and the focus files from PKG-Q4. App `rounded-9` sites are 0; review 6 own-tree uses.

Migration guide:

- Replace `box-shadow: var(--focus-X)` with `outline: var(--focus-outline-X)`.
- `rounded-9` now means 100px; use `rounded-full` for a pill or circle.
- Use semantic tokens for themed UI and raw shades only for intentional fixed colors.

Dependencies: merged chart PR #1141 for the final chart variable names, and PR 14 for removal of the mobile header variable.

Size: **M**. The change touches 10 to 30 token, test, preview, spec, and documentation files.

## Deferred to 1.1

- **DAT-Q5** — Add `useDoc` option callbacks or support both callback forms after v1.
- **DAT-Q7** — Add object overloads to `useDoctype` and `useNewDoc` after v1.
- **DAT-Q8, partial** — Decide whether to export `dayjsSystem` after v1.
- **DAT-Q9, partial** — Export missing data types, fix v1 upload-handler options, apply app config to v2 composables, and tighten loose composable types.
- **NAV-Q2, partial** — Add shortcut `showPlus`, dialog title and padding behavior, and array-overload documentation.
- **NAV-Q10** — Add navigation label customization and keep English defaults for v1.
- **SHELL-Q13** — Add portal-target composable documentation.
- **ED-Q11** — Add EditorDropZone context and hook support and export the missing editor types.
- **ED-Q12** — Add editor localization hooks.
- **LIST-Q9** — Rename or remove the experimental List export collisions.
- **LIST-Q10** — Add the ListHeaderCellSort tooltip hook; keep the English tooltip for v1.
- **PKG-Q9, partial** — Rename the experimental `Icon` export after v1.

## Delegated

- **#1139 Charts: H31, H32, M-charts, L-charts, and the chart part of X7/PKG-Q4.** Already on main through PR #1141, merge commit `bc0b402820`. The implementation spans commits `facc8691e7` through `39c0b71e89` in the audited range.
- **#1142 Tree: H11, B10, Tree slots, and Tree move events.** Still delegated to #1142. No Tree file changed between the audited commit and HEAD.

## Conflicts and gaps

1. **State vocabulary conflict.** Resolved 2026-09-14: the LIST-Q5 model wins. `data-state="active|inactive"` marks the current or highlighted row, and a boolean `data-selected` marks membership in a selection. The `selected|unselected` bucket is dropped from OVR-Q2. Items rendered by reka-ui keep reka's own attributes (`data-highlighted`, `data-state="checked"`); the rule covers rows frappe-ui renders itself. PR 7 owns the change; PR 9 only updates the vocabulary table in `PHILOSOPHY.md`.
2. **Tooltip control gap.** Resolved 2026-09-14: Tooltip is exempt from the OVR-Q1 slot rule. It keeps its uncontrolled hover model and gets no `open`, `setOpen`, or `close` slot props. PR 2 drops Tooltip from the OVR-Q1 touch list.
3. **Editor migration gap.** ED-Q6 changes mention and tag item shapes, but consumer sites have not been measured.
4. **List migration gap.** LIST-Q8 renames the sort slot, but consumer sites have not been measured.
5. **Removed chart target.** The #1139 audit targeted `src/charts/chartColors.test.ts`. Commit `256e880b89` deleted it and replaced its coverage with `src/charts/paletteColors.test.ts`.
6. **Vocabulary contract updates.** VOC-Q1, VOC-Q6, NAV-Q1, NAV-Q8, and NAV-Q9 require changes to `spec/adr/0008-no-deprecated-members-in-1-0-0.md`, `spec/shortcuts.md`, and `spec/tabs.md`.
7. **Overlay contract updates.** OVR-Q1, OVR-Q2, OVR-Q5 through OVR-Q12 require changes to `PHILOSOPHY.md`, `spec/popover.md`, `spec/dropdown.md`, `spec/hover-card.md`, `spec/date-picker.md`, `spec/dialog.md`, `spec/imperative-api.md`, and `spec/toast.md`.
8. **Input contract updates.** INP-Q2, INP-Q3, INP-Q5, and INP-Q10 require changes to `spec/inputs.md`, `spec/selection.md`, `spec/date-picker.md`, and `spec/adr/0012-template-ref-surface.md`.
9. **Shell contract updates.** SHELL-Q3, SHELL-Q4, SHELL-Q6, SHELL-Q7, and SHELL-Q10 require changes to `PHILOSOPHY.md`, `spec/portal-target.md`, and `spec/adr/0012-template-ref-surface.md`.
10. **Editor contract updates.** ED-Q3 through ED-Q7 require changes to `spec/editor.md`, `spec/adr/0004-editor-family-composition-model.md`, and `spec/adr/0017-css-variable-styling-hooks.md`.
11. **List contract updates.** LIST-Q1 through LIST-Q8 require changes to `spec/item-list-row.md`.
12. **Packaging and token contract updates.** PKG-Q2 through PKG-Q6 require changes to `spec/foundations.md`, `spec/adr/0005-focus-ring-2px.md`, `spec/adr/0006-numbered-radius-tokens.md`, `spec/adr/0010-subpath-export-rule.md`, `spec/adr/0017-css-variable-styling-hooks.md`, and `spec/adr/README.md`.

## Suggested execution order

Merge PRs 1 through 7 first so every later branch uses the final names and codemods. Merge the data, overlay, dialog, input, navigation, shell, editor, and list PRs next, in that order, because each stage consumes types or behavior fixed by the earlier stage. Merge packaging after component source no longer depends on automatic Lucide imports. Merge tokens last so visual checks run against the final components and the chart contracts already on main. Run each codemod on this tree inside its PR, regenerate API docs after source changes, and apply consumer follow-ups only after the owning Frappe UI PR lands.
