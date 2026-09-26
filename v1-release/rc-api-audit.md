# RC API audit

Reviewed 2026-09-11 against `main` at `f4dfb48160` (`1.0.0-beta.63`). Read-only review of every
public entry point in `package.json` `exports`. Thirteen area reports were consolidated here; every
finding was cited to `file:line` by the reviewer, and the top findings were re-verified by hand.

Scope: `.` (root), `./editor`, `./list`, `./charts`, `./tailwind`, `./vite`, `./icons`,
`./style.css`, `./tsconfig.base.json`, packaging. `./experimental` and `./vitepress` were checked
only for leaks into stable paths.

Severity: **HIGH** = wrong or inconsistent and cannot change after the tag without a major.
**MEDIUM** = will likely want changing; changing later costs a break or a deprecation cycle.
**LOW** = note, additive later, or spec drift.

## Cross-cutting themes

These recur across families. Fixing the theme once is cheaper than fixing each instance.

1. **Router destination has two names.** `to` on Sidebar, SidebarRail, MobileNav, PageHeader, List;
   `route` on Button, Breadcrumbs, Menu/Dropdown, Tabs, TabButtons. Button also calls the external
   URL `link` while Breadcrumbs and TabButtons call it `href`, with two different `href` semantics
   (same tab vs new tab). #1125 (explicit `href`) lands in 1.1 on top of this. Decide one word for
   each now, or record the split in CONTEXT.md so it stops being re-litigated.
2. **`onClick` as a prop vs `click` as an emit.** SidebarItem, ListRow, Breadcrumbs items,
   TabButtons items, Divider actions take `onClick` props; SidebarRailItem and MobileNavItem emit
   `click`. The Menu `onClick` is typed `PointerEvent` but receives a reka `CustomEvent`.
3. **Time units.** `hoverDelay` and `leaveDelay` are seconds; `scrollHideDelay` is milliseconds.
4. **Public types that do not export, or export under names the generated docs do not print.**
   `BreadcrumbItem`, `SpinnerSize`, Button `Theme/Size/Variant`, `MenuOptions`, `TimePickerEmits`,
   `ReferenceLineLabelPlacement`, all PageHeader props types, the v2 composable option/return types,
   the v1 `Resource*` interfaces, `FrappeUIError` (only in experimental), and more. Every api table
   that prints `route` shows `string | kt | Tt`.
5. **Slot-prop and data-attribute vocabulary drifts per family.** Trigger slots hand `toggle` on
   pickers and Popover, `setOpen` on Select; item slots hand `item`/`tab`/`button`/`node`;
   `data-state` is `active|inactive` here, `checked|unchecked` there, `selected` on list rows.
6. **`export *` from implementation modules** still exists in three places
   (`src/resources/index.ts` for `local` and `realtime`; `src/molecules/editor/index.ts` for
   `extensions` and `menu`), the exact P15 pattern the root barrel comment forbids.
7. **Undocumented CSS variables that are already contract.** `--mobile-header-height`,
   `--prose-color-*`/`--prose-highlight-*` (serialized into stored editor content, so never
   renamable), `--chart-gridline` and friends, `--focus-<name>` (ADR-0005 calls it legacy).

## HIGH

### Root: data layer and utilities

- **`submit()` has two opposite failure contracts.** `useCall`, `useDoc.setValue/delete/methods`
  resolve `null` on failure (`src/data-fetching/useCall/useCall.ts:203-212`,
  `useIsolatedCall.ts:50-52`); `useList` actions, `useDoctype`, `useNewDoc` reject
  (`useAction.ts:60-68`). The docs say both reject. Pick one before the tag.
- **`useDoc` spreads user `methods` onto its return** (`useDoc.ts:221`). Any member added to the
  return in 1.x collides with a consumer's method name, so the return shape can never grow.
  Nest them (`doc.methods.x`) or freeze a reserved-name list.
- **Two error shapes for one server error.** `FrappeResponseError` class
  (`useFrappeFetch.ts:6-11`: `type`, `exception`) vs `FrappeRequestError` interface
  (`frappeRequest.ts:20-26`: `exc_type`, `exc`, `status`, `messages`). Same fields, different
  names, only one is `instanceof`-checkable.
- **`upload()` rejects with a string, a `DOMException`, or an `Error`** (`useFileUpload.ts:203,210`);
  `UploadState.error` is `any`. `UploadOptions` carries both `private` and `is_private`, the v0
  alias ADR-0008 says must be gone.

### Root: components

- **TimePicker emits `open`/`close` beside `update:open`, and `input-invalid` beside
  `invalid-change`** (`TimePicker/types.ts:77-82`). This is the duplication #1098 removed elsewhere;
  emits cannot be dropped after 1.0. Also its `variant` is a private narrower alias and
  `TimePickerEmits` is not exported.
- **Three option-type hierarchies for one option shape.** `SelectOption` = one selectable;
  `ComboboxOption` = selectable | custom | group; `MultiSelectOption` = one selectable,
  `MultiSelectOptions` = the array. Names freeze; a wrapper author needs three imports. Export one
  shared `SelectionOption`/`SelectionGroup` and alias per component at the same level.
- **`Button.link` vs `Breadcrumbs.href`** for the external URL, next to identical `route` props
  (`Button/types.ts:47`, `Breadcrumbs/types.ts:11`).
- **Menu `onClick(event: PointerEvent)` is a false type** (`Menu/types.ts:60`); reka emits a
  `CustomEvent` with no pointer fields. Widening later is a break for annotated handlers.
- **`DropdownSlots`/`ContextMenuSlots` lose every named slot** because `Omit` over
  `MenuSlots`' string index signature keeps only the index (`Menu/types.ts:199`,
  `Dropdown/types.ts:61`). Typos in `#item-*` slot names compile.
- **`SettingsDialog.shortcut?: boolean`** (`SettingsDialog/types.ts:8`) is a name CONTEXT.md lists
  under avoid, hard-codes `Mod+Shift+,` via a raw window listener, and a boolean cannot later take a
  combo string.
- **Tree spends the `expanded` model name on a boolean expand-all switch** and mutates the caller's
  `node.expanded` in place (`Tree.vue:105,129,148`). A keyed `v-model:expanded="TreeKey[]"` can
  never be added. Tree also has no selection model and row click already means toggle, so adding
  selection later is a silent behaviour change.
- **TabButtons per-item slots** are `#prefix`/`#suffix` with `{ button, checked, disabled }` where
  Tabs uses `#tab-prefix`/`#tab-suffix` with `{ tab, selected, disabled }` for the same shape
  (`TabButtons/types.ts:52-57`).
- **Sidebar `disableCollapse` vs SidebarSection `collapsible`** for the same axis inside one family
  (`Sidebar/types.ts:23,154`).
- **`ScrollArea.viewportClass`** is a class-injection prop (`ScrollArea/types.ts:7`), the only one
  left; P10 forbids it and `data-slot="scroll-area-viewport"` already exists.
- **`DesktopShellProps` is `{}`** while the component has a `scroll` prop declared inline
  (`DesktopShell/types.ts:2`, `DesktopShell.vue:45-55`).
- **`PageHeaderBackButton.to` means "fallback only when there is no history"**
  (`PageHeader/types.ts:13-18`); everywhere else `to` means "navigate here". Rename to `fallback`.
- **`shellScrollContainer` and the PageHeader target are module-global, last-mounted-wins
  registries** (`useShellScrolled.ts:21-37`, `PageHeader/target.ts:7-19`). Two shells, or a
  PageHeader inside a dialog, misroute. `shellScrollContainer` is a bare `ComputedRef` export so it
  cannot take a scope later. Provide from the shell, fall back to the registry.
- **`--mobile-header-height`** (`PageHeaderMobile.vue:3`) is an undocumented, unprefixed public
  hook; ADR-0017 wants `--page-header-mobile-height`.
- **Progress `#hint` slot never renders without `label` or `hint`** (`Progress.vue:4,13`). Not
  irreversible, but a documented slot that does nothing.
- **Dialog still takes the structured `DialogIcon` object and has no `theme` prop**
  (`Dialog/types.ts:21-25,52`). P11 uses this object as its "Bad" example and P13 lists its
  removal as an accepted v1 break, but it was never executed. `icon` has no `Component` branch,
  and the imperative `ConfirmArgs` has a top-level `theme` the component lacks. Fix:
  `icon?: string | Component`, add `theme?: DialogTheme`, delete `DialogIcon`.
- **`DialogAction` is two different types under one name.** The component one
  (`Dialog/types.ts:31`, `label` optional, ctx `{ close }`) ships from root; the imperative one
  (`utils/dialog.ts:52`, `label` required, ctx has `setError`) types `ConfirmArgs.actions` but is
  not exported, so a consumer cannot annotate an actions array for `dialog.confirm`.
- **Toast `duration` is 4000ms in code, 5000ms in the spec.** `ToastProvider.vue` sets no
  `duration`, so vue-sonner's default applies; `spec/toast.md:16,79` promises 5000. A default is
  frozen behaviour. Toast option types (`ExternalToast` and friends) are also unreachable from
  `frappe-ui`; consumers must import them from `vue-sonner`, which is not a peer.

### `frappe-ui/editor`

- **`Editor.extensions: Extension[]`** rejects tiptap `Node`/`Mark` instances under vue-tsc
  (`Editor.vue:16`); `useEditor` uses tiptap `Extensions`. `<Editor :extensions="[Link, Image]">`
  fails type-check.
- **Two `UploadedFile` types; the exported one is wrong** (`useEditor.ts:33-38` optional
  `file_url`; engine requires it and throws without it).
- **`uploadFunction` hides its second argument** (`useEditor.ts:25` vs
  `media-upload-types.ts:65-68`); `MediaUploadProgress` is unexported.
- **Dead `code`/`codeBlock`/`link` keys on `StarterKitOptions`** (`extensions.ts:98,99,107`) that the
  kit never adds, while `docs/content/docs/molecules/editor.md:141` tells consumers to disable them.
- **Kit config is `Record<string, any>` for 18 keys** (`kits.ts:54`); real option interfaces exist
  and none are exported. `image: { uplaodFunction }` compiles.

### `frappe-ui/list`

- **`rowHeight` on List vs `itemHeight` in `ListVirtualOptions`/`useVirtualRows`**
  (`types.ts:81,119`, `useVirtualRows.ts:16`) for one quantity.
- **`virtual?: boolean | ListVirtualOptions`** is the library's only boolean+object overload
  (`ListRows.vue:41`).
- **`useVirtualRows` returns vueuse's unnamed types** (`useVirtualRows.ts:63`); the frozen return
  shape is whatever `@vueuse/core` declares that release. Own it or park it.

### `frappe-ui/charts`

- **`useChart`, `registerChartModules`, `UseChartArgs`, `UseChartReturn`, `ChartEventHandlers`**
  freeze echarts' own types as frappe-ui API (`index.ts:22-27`, `core/useChart.ts:26-49`) with no
  ADR; ADR-0016 sanctions exactly one echarts leak. Write the ADR or park them.
- **Spec promises `#legend` on every plot that draws one; no chart has it.** Only
  `ChartContainerSlots` does (`types.ts:1222`). Add it or amend the spec.

### Packaging and tokens

- **`tailwindcss` is not a peer dependency** (`package.json:210`, devDependencies) but
  `frappe-ui/tailwind` imports it at load time and the preset is v3-only.
- **`@floating-ui/vue` is imported at root and not declared**
  (`SidebarRailItemBadge.vue:38`); it works only by hoisting through reka-ui.
- **`readme.md:66` tells consumers to `require('frappe-ui/src/utils/tailwind.config')`**, a path
  the `exports` map blocks, and `src/utils/tailwind.config.js` still ships as a deprecated shim
  pointing at another unexported path. Delete the shim, fix the README.

## MEDIUM

### Root: data layer and utilities

- `execute` / `fetch` / `reload` and `loading` / `isFetching` are permanent triple/double aliases on
  every v2 composable. ADR-0008 says aliases stop being a tool. Keep `reload` and `loading`.
- `useDoc` takes `onSuccess` as a subscribe method on the return, not an option; no `onError` at all.
- Unexported types: `UseDocOptions`, `UseDoctypeOptions`, `UseNewDocOptions`, `NewDoc`, all
  `Use*Return` types, `CallOptions`, `CallError`, `FrappeRequestOptions`, `DebouncedFunction`,
  `FrappeUIPluginOptions`, and the v1 `Resource`/`ListResource`/`DocumentResource`/`ResourceOptions`
  interfaces. `ResourceOptions` declares none of the ~30 keys the JS reads.
- `FileUploadHandler.upload()` ignores `params`, `signal`, `onProgress` while accepting the same
  `UploadOptions`; progress payloads differ (`{uploaded,total}` vs `{loaded,total,percent}`);
  `upload(): Promise<any>`.
- `refetch` defaults `false` on `useCall`, `true` on `useList`, hard-coded on `useDoc`; `useNewDoc`
  inherits `cacheKey`/`staleOnError`/`initialData` that make no sense for a one-shot POST.
- `FrappeUIConfig.requestHeaders`/`requestBaseUrl` apply only to `frappeRequest` and v1 resources;
  v2 composables ignore them. Token-auth apps get no header on `useList`.
- `FrappeUI` plugin option `resources?: boolean | Record<string, any>`: the object form is never
  read. Narrow to `boolean`.
- `useDoctype(doctype, options)` and `useNewDoc(doctype, values, options)` are positional; the
  other three take one options object. `runDocMethod` takes `validate` inside the params object.
- `error` is `Ref<any>` on every composable while `onError` is typed `Error`; `debounce` erases
  parameter types; `vOnOutsideClick` is untyped.
- `src/resources/index.ts:6,8` `export *` from `local` and `realtime` (P15).
- `dayjs`/`dayjsLocal` at root: ADR-0010 says it "cannot stay at root as-is" and no later decision
  records keeping it. `Dayjs` type and `dayjsSystem` are not exported. Write the disposition.

### Root: components

- Base components: `DividerAction` is a second, incompatible action shape (no `theme`/`variant`);
  Progress `intervals: boolean` + `intervalCount` is a boolean mode switch; Badge `label` accepts any
  object via unexported `Label`; `Icon`'s only prop is `name` but takes a `Component`; `TooltipSide`,
  `PopoverSide`, `DropdownSide` and a private TimePicker copy are four names for one union; axis
  unions are named and exported on some components, inline on others; `BreadcrumbItem` has an open
  `[key: string]: any`.
- Dialog family: `message` is the description text while Alert, toast and P5/P6 say
  `description` (`Dialog/types.ts:49`), a rename-now-or-never under ADR-0008;
  `Dialog.Title`/`Dialog.Description`/`Dialog.Close` attach raw reka-ui components as statics
  (`Dialog/index.ts:26-28`), absent from the spec's public API and the api table;
  `paddingTop: string | number` binds the raw value to `style` so the number branch produces invalid
  CSS, and it is a style-injection prop (P10); Dialog stamps no `data-slot` and BottomSheet stamps
  nothing and selects its own content by class name; Alert's tone attribute is `data-color`, the
  first and only tone hook, so that name freezes; Alert `icon` is a tri-state
  `boolean | string | Component` where P11 fixes the shape at `string | Component`; Divider
  `position: 'start' | 'center' | 'end'` reuses Dialog's `position` word for what every other
  component calls `align`; Breadcrumbs per-item `#prefix`/`#suffix` should be
  `#item-prefix`/`#item-suffix` (P6); `PromptField` select options are an ad-hoc array rather than
  `SelectOption`; HoverCard `hoverDelay` defaults 0.3 in code, 0.5 in spec and Tooltip.
- Overlays: trigger slot props differ (Popover `{open, close, toggle}`, Dropdown
  `{open, close, disabled, ...attrs}`, HoverCard `{open}`, ContextMenu `{open}`);
  `Popover.toggle(flag?: boolean | Event)` freezes an event overload; ContextMenu has no `portalTo`;
  attrs land in three different places across the four; `HoverCardEmits` does not exist and
  `PopoverEmits` has a different shape; only Popover stamps `data-slot="trigger"`.
- Inputs: "nothing selected" is `undefined` (Select), `null` (Combobox), `[]` (MultiSelect), and
  FormControl switches between the first two by `type`; `DateTimePicker.allowCustomTime` is leftover
  vocabulary next to `typeable`; picker trigger slots hand `toggle` and omit `disabled`; pickers
  expose only `{open}` and Checkbox/Switch/Slider/RadioGroup/FormControl expose nothing, so 185
  FormControl call sites cannot `focus()`; fallthrough attrs land on the wrapper, the control, or
  both (Checkbox applies them twice); Duration drops the `#label`/`#description` slots;
  `FormControl.type` union collapses so native date/time are unreachable and `variant` is forwarded
  to toggles as a stray attribute; `FrappeUIError` and `InputLabelingProps` are the types of frozen
  root props but ship only from `frappe-ui/experimental`; `data-slot="control"` vs `"trigger"`
  splits by family, and FormLabel lacks `data-slot="label"`.
- Navigation: `SidebarHeader.menuItems` is an inline unexported type narrower than `MenuOptions`
  with a different `onClick` signature; `SidebarProps`/`SidebarSectionProps` omit their `collapsed`
  model; SidebarRailItem `variant: 'tile' | 'ghost'` adds a value to the library's most shared axis;
  SidebarRailItem neither infers `active` from the route nor falls back to `<a>` without a router
  while its two siblings do; SidebarItem renders a non-lucide icon string as text; the injection keys
  `sidebarCollapsedKey`/`sidebarToggleKey` are exported and undocumented; SidebarItem passes
  `placement="right"` to Tooltip, which has only `side`, so collapsed tooltips render on top.
- Tabs and Tree: Tree slot props use `node`/`level`/`focused` where P7 says `item`/`index`/`active`;
  Tree events are `drag-start`/`drag-end(null)` (interaction names, P1); `TreeNode` keeps an open
  index signature; `TabButton` items carry `tooltip`/`href`/`onClick` and `label: string | number`
  outside the spec; `data-state` is `checked|unchecked` on TabButtons and `active|inactive` on Tabs;
  `SettingsDialogEmits` is stale and unexported; `spec/item-list-row.md:46` and
  `spec/inputs.md:182` still say `sm|md|lg|xl`.
- Shells: DesktopShell has `#rail`/`#sidebar`, MobileShell has `#nav` for the same region;
  PageHeader exports no props types; `ScrollArea.orientation` accepts `'both'`; `PageHeaderBase`
  scrolls to top on any click with only an unnamespaced `data-no-scroll-top` opt-out;
  `useSheetDrag` is BottomSheet-specific with module-constant thresholds and should be parked;
  `ScrollBar` throws without a reka `ScrollAreaRoot` that frappe-ui does not export;
  `useShellScrolled` defaults `threshold` to 200 while every example passes 12.
- Composables: `resolvedColorScheme` is a non-reactive function under a noun name with no docs page;
  `toggleColorScheme` from `system` on a dark OS produces no visible change; the portal-target trio
  has no docs page.

### `frappe-ui/editor`

- Bubble/Floating `options` is a structural leak of tiptap's floating bag with `shouldShow: any`.
- `buttonSize` exists on EditorFixedMenu only; vocabulary is `size`.
- `EditorDropZone` requires `editor` and skips context resolution unlike every sibling; no `data-slot`.
- Unexported types on public signatures: `UseEditorOptions`, `SuggestionFloatingOptions`,
  `BaseSuggestionItem`, `SetImageOptions` and siblings, `EditorCommandMeta`.
- `component` means node view on `MentionMember` and popup list on `SuggestionExtensionOptions`.
- `MentionSuggestionItem` freezes `value`/`email`/`full_name`; `TagSuggestionItem.isNew` is internal.
- `--prose-color-*`/`--prose-highlight-*` are declared on `.ProseMirror` (ADR-0017 rule 2) and are
  serialized into content; `--prose-font-size` fallback is 15px, docs say 14px.
- `StyleClipboard` ships on by default in RichTextKit with no trigger, no tests; `Toc` and
  `ImageViewer` have no options. P14 candidates.
- `InlineKit.starterKit` accepts config objects and honours only `false`.
- `slashCommands` kit key is an untyped bag with no `items`.
- `src/molecules/editor/index.ts:36,39` `export *` from `extensions` and `menu` (P15).
- Preset names (`articleToolbar`, `minimalToolbar`) do not pair with kit names.

### `frappe-ui/list`

- `ListRow.onClick` is a prop that also selects `<button>` vs `<div>` and is swallowed in
  `selectable` mode.
- Row state hooks mix `data-interactive` (bare), `data-state="selected"` (value), `data-active`
  (bare).
- `ListRows` default slot omits `selected`/`active`.
- `ListGroup` has a `label` prop and a `#header` slot; the override slot is `#label` everywhere else.
- `ListHeaderCellSort#suffix` is the sort glyph and renders leading under `align="end"`.
- `frappe-ui/experimental` exports `List`, `ListRow`, `ListRows`, `ListHeader` with different props
  under the same names.

### `frappe-ui/charts`

- `DonutSliceEvent.name` carries the label, every other event carries identity; `dataIndex` vs
  `index` across events.
- `#tooltip` slot props differ per chart and `row` reaches only axis charts.
- `ChartTooltipItem.kind` is optional with "absent means series"; `value` widened to
  `number | string` by #1128.
- `ReferenceLineLabelPlacement` not exported (the brief already asks for it).
- `showDataLabels` / `showValues` / `showInlineLabels` / `showPercentages` for one concept.
- Chart-level `format` on five charts, not on Bar/Line/Area; Scatter has both levels.
- `hiddenSeries` v-model on axis and Scatter, nothing on Donut.
- `ChartTokens.splitLine` maps to `--chart-gridline`; three token keys have no CSS var; none of the
  non-ramp vars are documented.
- Locale is hard-coded `en-US`; `OTHERS_LABEL` is an exported constant.
- ADR-0016's docs obligation (template ref, `getDataURL`, `notMerge`) is unmet.
- `NumberCardSparkline.type` vs `SeriesStyle.type: ChartMark`.

### Packaging and tokens

- The consumer toolchain contract (Vite + vue plugin + Tailwind v3 + `frappe-ui/vite` icon
  resolver + `allowImportingTsExtensions`) is real and unwritten. Root imports `~icons/lucide/*` in
  two places, so `lucideIcons: false` breaks the root entry. `src/index.ts` imports with `.ts`
  suffixes.
- Preset `minWidth.50 = 18rem` contradicts the spacing scale (`50 = 12.5rem`); `width.wizard` is an
  app screen name.
- `rounded-9` ships `999px`; spec and ADR-0006 say 100px.
- `--focus-<name>` box-shadow vars ship as admitted legacy (ADR-0005).
- `theme.colors`, `fontSize`, `screens`, `borderRadius`, `boxShadow` replace Tailwind defaults;
  `foundations/tailwind.md` says the opposite.
- Dark mode has two mechanisms: selector-flipped semantic tokens and name-flipped `dark-*` raw
  shades that the editor itself relies on. `alpha` sits in two positions.
- `fontFamily.text = 'Inter Variable'` token is never wired; CSS uses `InterVar`.

## LOW

Grouped; details are in the per-area reports summarized above.

- Defaults drift between peers: `size` `sm` vs `md`, `hoverDelay` 0.5 vs 0.3, TabButtons `subtle`
  vs TabList `underline`, Rating invalid-size fallback `sm` while default is `md`.
- Emits types that are stale, wrong, or unexported: `ComboboxEmits`/`MultiSelectEmits` still list
  `update:modelValue`; `RadioGroupEmits` wrong payload; `AxisChartEmits`/`ScatterChartEmits` omit
  `update:hiddenSeries`; `SettingsDialogEmits`.
- Model/prop type mismatches: `TextInput.modelValue: string | number` emits `string`;
  `DateRangePickerProps.modelValue: string[]` vs emitted `DateRangeValue`; `ErrorMessage.message`
  reads `.messages` as a string while `FrappeUIError.messages` is `string[]`.
- Third-party types in public positions: `Dayjs` in DatePicker `isDateUnavailable` and
  `setDate/setRange`; `RouteLocationRaw` spelled three ways and printed as `string | kt | Tt`.
- Internal types reaching root through `export *`: `DatePickerViewMode`, `DatePickerDateObj`.
- Redundant aliases: `TabButtonValue`/`TabButtonIcon`; `AlertActionContext` =
  `AlertActionsSlotProps`; `ResolvedColorScheme` exported from both root and charts.
- Missing but additive: `Rating.focus()`, Tooltip `open` (CONTEXT.md over-promises), `*Slots` types
  for Popover/HoverCard/Rating/Button/Badge, `portalTo` on pickers and ContextMenu, `data-slot` on
  PageHeader parts and chart internals, `SidebarRailItemBadge` count pill.
- Hard-coded English with no hook: SidebarCollapseToggle labels, `Order by ${label}` tooltip in
  List, all editor menu labels and drop-zone strings, chart empty/loading/error strings.
- Keyboard shortcuts: `KeyboardShortcut.showPlus`, `KeyboardShortcutsDialog.paddingTop`/`title`,
  and the array form of `useKeyboardShortcut` are shipped but absent from `spec/shortcuts.md`;
  `useKeyboardShortcut` outside setup registers forever with no guard.
- Packaging: no `v1.0.0-beta.57`–`.63` tags locally; dead dependencies (`@tailwindcss/line-clamp`,
  `highlight.js`, `prosemirror-tables`, `ora`, `prettier`, `typescript`, `slugify`, seven unused
  `@tiptap/extension-*`); `vite`/`vitepress` imported by shipped files but devDeps only; the
  tarball ships tests, Cypress specs, playgrounds and `src/mocks` (msw); `./icons`/`./tailwind`
  subpaths have no `types` condition; `frappe-ui/experimental` exports a different `Icon`.

## Checked and found fine

- No `@deprecated`, `warnDeprecated`, or v0 aliases in any stable path except the tailwind shim
  above. Parked families are exported only from `experimental.ts`.
- Root barrel uses `export *` only from curated per-family barrels; no internal helper from
  `data-fetching` (`useAction`, `useIsolatedCall`, `docStore`, `writeGate`, `request`) is reachable.
- D1 (rail rename), D2 (`xs|sm|md|lg`), D3 (fixed 13px labels, no `FormLabel.size`) landed
  completely in code; the only leftovers are two stale spec lines.
- Every overlay uses `v-model:open`; no `visible`/`show`/`placement` survivors.
- `useColorScheme` storage key `theme` and `data-theme` attribute match CONTEXT.md; portal-target
  trio matches its spec line for line; keyboard-shortcut combo grammar and config fields match the
  spec exactly.
- `exports` map has no wildcard, so deep `frappe-ui/src/...` imports are blocked; `dist/` is not
  published; heavy dependencies (tiptap, echarts, codemirror) stay behind their subpaths.
- Charts barrel is explicit; `ChartExposed` matches ADR-0016; emit names are P1-compliant.
- List `columns` contract matches the RC brief; CSS variable prefixes (`--list-*` public,
  `--_list-*` internal) follow ADR-0017.
