# RC migration effort

This report counts migration sites in the specified working trees. A site is one prop, slot, listener, import, option, call, or component use matched by the listed pattern. Multiline component patterns use `rg -P -U`. Type-only counts use imports from `frappe-ui` or its public subpaths. T3 counts are review sets, because grep cannot prove that a caller depends on the old behavior.

Every command used these exclusions:

```sh
rg -n -P -U \
  --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**' \
  --glob '!.git/**' --glob '!**/frappe-ui/**' PATTERN ROOTS
```

The own-tree column covers `src/`, `docs/`, and `spec/`. The app abbreviations are GP, Frappe, CRM, HD, Builder, Books, Wiki, and Suite (which contains Drive). Counts include tests and app-local documentation. The original report measured no Suite tree, so the Suite column reads `-` for not measured on every row except the ones a later pass measured: LIST-Q8 and the batch 2 rows. Each row's app columns sum to its `Total v1-app sites`, with one carried-forward exception listed at the end. Identical edits are consolidated under one row to prevent double counting. This applies to X1/H07, X3/the HoverCard mechanical line, X6/the two barrel lines, and H10/the related L-root cleanup. The L-root batch is split by break type because its changes have different tiers.

## Summary

| Id | Change | Tier | Total v1-app sites | v0 aggregate | Own tree | Codemod-able | Reason class | Suggested call |
|---|---|---:|---:|---:|---:|---|---|---|
| X2 | Menu handler `PointerEvent` -> `Event`; keep `onClick` only in data objects | T0 | 0 | 0 | 2 | yes | **trap** | **break**, trap clause |
| X6 + two A barrel lines | Four implementation `export *` declarations -> named exports | T0 | 0 | 0 | 4 | yes | **trap** | **break**, trap clause |
| H06 | Component option types -> additive shared selection union | T0 | 0 | 0 | 8 | yes | **consistency only** | **keep and record in CONTEXT.md**, fallback clause |
| H15 | Empty `DesktopShellProps` -> declared `scroll` prop | T0 | 2 | 0 | 4 | yes | **trap** | **break**, trap clause |
| H19 | Gated Progress `#hint` -> independently rendered slot | T0 | 0 | 0 | 3 | yes | **trap** | **break**, trap clause |
| H22 | Toast spec `5000ms` -> actual `4000ms`; add owned option types | T0 | 0 | 0 | 6 | yes | **trap** | **break**, trap clause |
| H23 | Editor `Extension[]` -> TipTap `Extensions` | T0 | 0 | 0 | 5 | yes | **trap** | **break**, trap clause |
| H25 | One-argument upload callback type -> expose request options and progress type | T0 | 0 | 0 | 7 | yes | **trap** | **break**, trap clause |
| H30 | Public `useVirtualRows` export -> component-owned virtualization | T0 | 0 | 0 | 6 | yes | **trap** | **break**, trap clause |
| H33 | Undeclared Tailwind runtime requirement -> `tailwindcss` peer `>=3.4.0 <4` | T0 | 0 | 0 | 3 | yes | **trap** | **break**, trap clause |
| H34 | Hoisted `@floating-ui/vue` -> direct dependency | T0 | 0 | 0 | 2 | yes | **trap** | **break**, trap clause |
| L-root emit types | Stale or wrong component emit declarations -> runtime declarations | T0 | 0 | 0 | 6 | yes | **trap** | **break**, trap clause |
| L-root model types | Mismatched model and error types -> runtime value shapes | T0 | 0 | 0 | 8 | yes | **trap** | **break**, trap clause |
| L-root owned types | Leaked `Dayjs` and `RouteLocationRaw` signatures -> owned printable types | T0 | 0 | 0 | 15 | yes | **trap** | **break**, trap clause |
| L-root additive gaps | Missing methods, slots, portal props, hooks, and count prop -> additive APIs | T0 | 0 | 0 | 20 | yes | **trap** | **break**, trap clause |
| M-base/A Divider action | Separate `DividerAction` shape -> shared action shape | T0 | 0 | 0 | 3 | yes | **consistency only** | **keep and record in CONTEXT.md**, fallback clause |
| M-base/A Badge label | Object-valued Badge label type -> `string | number` | T0 | 0 | 0 | 3 | yes | **trap** | **break**, trap clause |
| M-dialog/A Alert icon | Boolean/string/component icon -> string/component icon | T0 | 0 | 0 | 3 | yes | **trap** | **break**, trap clause |
| B1 | Return-only `useDoc.onSuccess` -> additive option callbacks | T0 | 0 | 0 | 8 | yes | **trap** | **break**, trap clause |
| B3 | Positional v2 calls -> additive object overloads | T0 | 0 | 0 | 7 | yes | **consistency only** | **keep and record in CONTEXT.md**, fallback clause |
| B8 | Sidebar menu subset -> `MenuOptions` and correct event type | T0 | 0 | 0 | 5 | yes | **trap** | **break**, trap clause |
| B10 | Open `TreeNode` record -> generic `TreeNode<T>` | T0 | 0 | 0 | 6 | yes | **trap** | **break**, trap clause |
| X1, H07 | Router `to` -> `route`; Button `link` -> `href` | T1 | 32 | 2 | 2 | yes | **consistency only** | **keep and record in CONTEXT.md**, T1 over 20 clause |
| M-dialog/A Breadcrumb slots | `#prefix`/`#suffix` -> `#item-prefix`/`#item-suffix` | T1 | 12 | 1 | 1 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-dialog/A Dialog statics | `Dialog.Title`, `.Description`, `.Close` -> removed | T1 | 6 | 0 | 6 | yes | **trap** | **break**, trap clause |
| M-base/A Icon prop | Icon `name` -> `icon` | T1 | 5 | 1 | 3 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-composables/A getter | Root `resolvedColorScheme()` -> removed; read `useColorScheme().resolvedColorScheme` | T2 | 3 | 0 | 13 | no | **trap** | **break**, trap clause |
| H10 + L-root SettingsDialog | `shortcut` -> `keyboardShortcut` | T1 | 2 | 0 | 6 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-data/A resources option | Unread object `resources` -> boolean | T1 | 2 | 0 | 7 | yes | **trap** | **break**, trap clause |
| M-dialog/A Dialog text | Dialog `message` -> `description` | T1 | 2 | 0 | 5 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-tabs-tree/A Tree slots | `node`/`level`/`focused` -> `item`/`index`/`active` | T1 | 2 | 0 | 6 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-editor/A fixed menu size | `buttonSize` -> `size` | T1 | 2 | 0 | 4 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-list/A row hooks | Three ListRow state hooks -> one state vocabulary | T1 | 0 | 0 | 9 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-list/A sort slot | ListHeaderCellSort `#suffix` -> `#sort-indicator` | T1 | 5 | 0 | 3 | yes | **misleading name** | **break**, misleading-name T1 clause |
| H26 | Dead StarterKit `code`, `codeBlock`, `link` keys -> removed | T1 | 1 | 0 | 6 | yes | **trap** | **break**, trap clause |
| H05 | Duplicate TimePicker emits -> keep model and validation emits | T1 | 0 | 0 | 8 | yes | **trap** | **break**, trap clause |
| H18 | `--mobile-header-height` -> removed; the mobile header is a fixed 52px | T1 | 0 | 0 | 1 | yes | **misleading name** | **break**, misleading-name T1 clause |
| H28 | ListRows object-form `virtual` -> boolean `virtual` plus `overscan` | T1 | 0 | 0 | 5 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| H35 | Deep Tailwind shim path -> `frappe-ui/tailwind` | T1 | 0 | 1 | 1 | yes | **trap** | **break**, trap clause |
| L-root internal exports | Accidental date-picker types -> removed from root | T1 | 0 | 0 | 2 | yes | **trap** | **break**, trap clause |
| L-root aliases | Redundant public type aliases -> surviving canonical names | T1 | 0 | 0 | 4 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-base/A Progress intervals | `intervals` plus `intervalCount` -> numeric `intervals` | T1 | 0 | 0 | 3 | yes | **trap** | **break**, trap clause |
| M-dialog/A Alert hook | `data-color` -> `data-theme` | T1 | 0 | 0 | 2 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-dialog/A Divider align | Divider `position` -> `align` | T1 | 0 | 0 | 3 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-overlays/A Popover control | Trigger-slot `toggle` -> `setOpen` | T1 | 0 | 0 | 3 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-inputs/A DateTimePicker | `allowCustomTime` -> `typeable` | T1 | 0 | 0 | 7 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-tabs-tree/A Tab state | `checked|unchecked` -> `active|inactive` | T1 | 0 | 0 | 2 | yes | **misleading name** | **break**, misleading-name T1 clause |
| M-shells/A useSheetDrag | Root import -> removed from the package; BottomSheet keeps it internally | T1 | 0 | 0 | 8 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| M-shells/A ScrollBar | Root import/tag -> removed from the package, with no replacement | T1 | 0 | 0 | 7 | yes | **trap** | **break**, trap clause |
| M-list/A ListGroup slot | `#header` -> `#label` | T1 | 0 | 0 | 1 | yes | **misleading name** | **break**, misleading-name T1 clause |
| B7 | Picker trigger `toggle` -> `setOpen` | T1 | 0 | 0 | 2 | yes | **misleading name** | **break**, misleading-name T1 clause |
| B9 | SidebarRailItem `tile` -> `subtle` | T1 | 0 | 0 | 4 | yes | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |
| B12 | Suggestion `component` -> `nodeView` or `listComponent` | T1 | 2 | 0 | 9 | no | **misleading name** | **break**, misleading-name T1 clause |
| M-packaging/A lucideIcons | `lucideIcons` default `true` -> `false` | T1 | 1 | 0 | 83 | yes | **trap** | **break**, trap clause |
| M-tokens/A focus variables | `--focus-<name>` box shadow -> `--focus-outline-<name>` outline | T1 | 0 | 0 | 6 | no | **trap** | **break**, trap clause |
| H14 | ScrollArea `viewportClass` -> `data-slot` selector | T2 | 10 | 0 | 11 | no | **consistency only** | **kept** (SHELL-Q4): `viewportClass` stays as the documented P10 exception |
| H24 | Optional `UploadedFile.file_url` -> required | T2 | 6 | 0 | 1 | no | **trap** | **break**, trap clause |
| M-editor/A floating options | TipTap option bag -> owned narrow options | T2 | 6 | 0 | 0 | no | **trap** | **break**, trap clause |
| M-tabs-tree/A TabButton item | Remove `tooltip`; number label -> string label | T2 | 5 | 4 | 1 | no | **trap** | **break**, trap clause |
| H27 | Editor kit `Record<string, any>` -> 18 typed options | T2 | 5 | 0 | 12 | no | **trap** | **break**, trap clause |
| H20 | Structured `DialogIcon` -> string or component | T2 | 3 | 0 | 19 | no | **trap** | **break**, trap clause |
| H13 | Sidebar `disableCollapse` -> inverted `collapsible` | T2 | 2 | 0 | 3 | no | **consistency only** | **keep and record in CONTEXT.md**, fallback clause |
| M-dialog/A paddingTop | Numeric `paddingTop` -> CSS string | T2 | 1 | 0 | 2 | no | **trap** | **break**, trap clause |
| M-editor/A slash commands | Untyped `slashCommands` -> typed object with `items` | T2 | 1 | 0 | 2 | no | **trap** | **break**, trap clause |
| M-editor/A mention items | Mention and tag item `{ id, label }` -> `{ label, value }` | T2 | 5 | 0 | 20 | no | **trap** | **break**, trap clause |
| M-overlays/A attributes | Three fallthrough targets -> one public root per overlay | T3 | 213 | 123 | 71 | no | **trap** | **break**, trap clause |
| H01 | Resolve-on-failure v2 actions -> reject | T3 | 58 | 25 | 97 | no | **trap** | **break**, trap clause |
| L-root defaults (Rating) | Rating `size` default `md` -> `sm` | T3 | 3 | 0 | 11 | no | **consistency only** | **break** (INP-Q16) |
| L-root defaults (TabButtons) | TabButtons omitted `variant` fallback -> aligned default | T3 | 38 | 9 | 37 | no | **consistency only** | **keep and record in CONTEXT.md**, fallback clause |
| X3 + HoverCard A | Delay seconds -> milliseconds; omitted HoverCard delay -> 500ms | T3 | 36 | 19 | 30 | no | **consistency only** | **keep and record in CONTEXT.md**, fallback clause |
| M-editor/A prose defaults | Omitted prose font fallback `15px` -> `14px` | T3 | 22 | 1 | 73 | no | **trap** | **break**, trap clause |
| M-packaging/A Tailwind extension | Replacing defaults -> `theme.extend` | T3 | 8 | 6 | 16 | no | **trap** | **kept** (PKG-Q7): the preset keeps replacing colors, font sizes, screens, radii and shadows; the replacement is documented instead |
| H04 | Upload failures -> one error type; remove `is_private` option | T3 | 7 | 1 | 13 | no | **trap** | **break**, trap clause |
| B14 | RichTextKit `toc` and `styleClipboard` -> opt-in | T3 | 8 | 0 | 17 | no | **trap** | **break**, trap clause |
| M-tabs-tree/A Tree move events | `drag-start`/`drag-end` -> `move-start`/`move` with new cancellation | T3 | 1 | 0 | 2 | no | **misleading name** | **keep and record in CONTEXT.md**, fallback clause |
| M-editor/A InlineKit config | Ignored StarterKit object -> honored object | T3 | 0 | 0 | 2 | no | **trap** | **break**, trap clause |
| M-packaging/A rounded token | `rounded-9` `999px` -> `100px` | T3 | 0 | 0 | 6 | no | **trap** | **break**, trap clause |
| M-packaging/A sizing scale | Hand-written sizing blocks -> one generated spacing scale | T1 | 0 | 0 | 21 | no | **consistency only** | **break**, consistency-only T1 at 20 or fewer clause |

## T0: no consumer migration

| Id | What breaks | Pattern | GP | Frappe | CRM | HD | Builder | Books | Wiki | Suite | v0 | Own |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| X2 | Only explicitly annotated Menu handler parameters can fail type-check. None exist. | `onClick\s*:\s*\([^)]*:\s*PointerEvent` in Menu option files | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| X6 + A barrels | Internal barrel declarations change. | `export\s+\*\s+from\s+['"](?:\./)?(?:local|realtime|extensions|menu)['"]` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 4 |
| H06 | This adds a shared type. | imports of `SelectOption|ComboboxOption|MultiSelectOption|SelectionOption|SelectionGroup` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 8 |
| H15 | This corrects an empty exported props type. Nothing to edit: `scroll` already worked, and Suite Drive already passes it. Measured 2026-09-15: GP `DesktopLayout.vue:5`, Suite Drive `DriveLayout.vue:10`. | `\bDesktopShellProps\b|<DesktopShell\b` | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 4 |
| H19 | Existing `#hint` content starts rendering. No caller edit is needed. | Progress blocks containing `#hint|v-slot:hint|slot="hint"` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| H22 | Code already uses 4000ms. The change is docs and additive types. | `\b(?:ExternalToast|ToastOptions)\b|duration\s*:\s*5000` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 6 |
| H23 | This widens the accepted extensions type. | imports of `Extension|Extensions` tied to `<Editor>` or `useEditor(` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 5 |
| H25 | One-argument callbacks remain valid. | `\buploadFunction\s*[:=]|\bMediaUploadProgress\b` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 7 |
| H30 | The public composable and its types are removed; no app imports them. | imports of `useVirtualRows|UseVirtualRows(?:Options|Return)?` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 6 |
| H33 | Only package metadata and docs change. An install on Tailwind v4 now fails instead of building wrong. | `\btailwindcss\b` in this package's manifests and contract docs | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| H34 | Only package metadata changes. | `@floating-ui/vue` in this package | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| L-root emit types | No consumer imports the affected emit types. | imports from `frappe-ui` containing `ComboboxEmits|MultiSelectEmits|RadioGroupEmits` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 6 |
| L-root model types | No consumer imports the affected model types. | imports containing `TextInputProps|DateRangePickerProps|DateRangeValue|FrappeUIError` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 8 |
| L-root owned types | No consumer imports the leaked third-party types from frappe-ui. | imports containing `Dayjs|RouteLocationRaw`; own search is limited to public signatures | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 15 |
| L-root additive gaps | These APIs and hooks are additive. | `Rating|Tooltip|PopoverSlots|HoverCardSlots|RatingSlots|ButtonSlots|BadgeSlots|portalTo|PageHeader|SidebarRailItemBadge` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 20 |
| M-base/A Divider action | No consumer imports `DividerAction`. | imports from `frappe-ui` containing `DividerAction` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| M-base/A Badge label | No object-valued Badge label exists. | `(?s)<Badge\b(?:(?!>).)*?(?::|v-bind:)?\blabel\s*=\s*['"]?\{` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| M-dialog/A Alert icon | No boolean-valued Alert icon exists. | Alert tags with bare `icon` or `:icon="true|false"` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| B1 | Option callbacks are additive. | `\buseDoc\s*\(|\.onSuccess\s*\(` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 8 |
| B3 | Object overloads are additive. | `\b(?:useDoctype|useNewDoc)\s*\(` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 7 |
| B8 | No SidebarHeader menu handler has an explicit incompatible event annotation. | SidebarHeader `menu-items` sites, then `onClick\s*:\s*\([^)]*:\s*PointerEvent` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 5 |
| B10 | The generic preserves valid app fields. | imports from `frappe-ui` containing `TreeNode` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 6 |

## T1: mechanical migration

| Id | What breaks | Pattern | GP | Frappe | CRM | HD | Builder | Books | Wiki | Suite | v0 | Own |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| X1, H07 | Prop names break. | `(?s)<(?:SidebarItem|SidebarRailItem|MobileNavItem|PageHeaderBackButton|ListRow)\b(?:(?!>).)*?(?::|v-bind:)?\bto\s*=|(?s)<Button\b(?:(?!>).)*?(?::|v-bind:)?\blink\s*=` | 23 | 0 | 0 | 0 | 0 | 0 | 9 | - | 2 | 2 |
| M-dialog/A Breadcrumb slots | Slot names break. Counts inspect only text inside each Breadcrumbs block. | Find files with `<Breadcrumbs\b`, then inside each block use `#(?:prefix|suffix)\b|v-slot:(?:prefix|suffix)\b|slot=['"](?:prefix|suffix)['"]` | 3 | 0 | 8 | 1 | 0 | 0 | 0 | - | 1 | 1 |
| M-dialog/A Dialog statics | Raw statics disappear. Opening tags count once. | `<Dialog\.(?:Title|Description|Close)\b|Dialog\.(?:Title|Description|Close)\s*=` | 6 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 6 |
| M-base/A Icon prop | The prop name breaks. | `(?s)<Icon\b(?:(?!>).)*?(?::|v-bind:)?\bname\s*=` | 0 | 0 | 0 | 0 | 0 | 5 | 0 | - | 1 | 3 |
| H10 + L-root | The prop name and boolean type break. The Books alias `FrappeSettingsDialog` is included. | `(?s)<(?:SettingsDialog|FrappeSettingsDialog)\b(?:(?!>).)*?(?::|v-bind:)?\bshortcut\s*=` | 1 | 0 | 0 | 0 | 0 | 1 | 0 | - | 0 | 6 |
| M-data/A resources | The ignored object form stops type-checking. | `\bresources\s*:\s*\{` near `FrappeUIPluginOptions` or `app.use` | 2 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 7 |
| M-dialog/A Dialog text | The component prop name breaks. Imperative `dialog.confirm({ message })` is excluded. | `(?s)<Dialog\b(?:(?!>).)*?(?::|v-bind:)?\bmessage\s*=` | 1 | 0 | 0 | 1 | 0 | 0 | 0 | - | 0 | 5 |
| M-tabs-tree/A Tree slots | Slot-prop destructuring breaks. | Find `<Tree\b` files, then trigger/item templates containing `\b(?:node|level|focused)\b` | 0 | 0 | 0 | 0 | 0 | 0 | 2 | - | 0 | 6 |
| M-packaging/A lucideIcons | The Vite plugin stops installing the `~icons` resolver and the two unplugins. Measured 2026-09-15 with `packaging-v1 --dry-run`: GP `frontend/vite.config.ts` is the one config that needs the option; Builder and Suite already pass `lucideIcons: true`; apps/frappe does not use the plugin. The own-tree number is the `~icons/lucide/*` imports converted to class icons, in 13 shipped files, plus 1 auto-imported tag. | `frappeui\(` without `lucideIcons` in the same options object | 1 | 0 | - | - | 0 | - | - | 0 | 0 | 83 |
| M-tokens/A focus variables | Hand-written CSS that reads a removed variable loses its ring. Measured 2026-09-15: no app reads frappe-ui's `--focus-<name>`. The 12 reads in apps/frappe resolve against the desk's own `espresso/effects.css` declarations, which this change does not touch. | `var\(--focus-(?!outline)[a-z]+\)` | 0 | 0 | - | - | 0 | - | - | 0 | 0 | 6 |
| M-packaging/A sizing scale | `w-wizard` disappears and `min-w-50` changes value. Measured 2026-09-15: 0 sites in GP, apps/frappe, Builder and Suite. The own-tree number is the theme keys deleted from the plugin. | `\bw-wizard\b\|\bmin-w-50\b` | 0 | 0 | - | - | 0 | - | - | 0 | 0 | 21 |
| M-editor/A fixed menu size | The prop name breaks. | `(?s)<EditorFixedMenu\b(?:(?!>).)*?(?::|v-bind:)?\bbutton-size\s*=` | 1 | 1 | 0 | 0 | 0 | 0 | 0 | - | 0 | 4 |
| M-list/A row hooks | CSS selectors break. The 2 Builder candidates are app-authored div hooks, so actual migrations are 0. | In files using ListRow, `data-(?:interactive|active)\b|data-\[state=selected\]|\[data-state=['"]?selected` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 9 |
| M-list/A sort slot | The slot name breaks. GP has 2 live sites plus 2 documentation examples; Suite has 3 live sites. | Find `<ListHeaderCellSort\b`, then inside each block use `#suffix\b|v-slot:suffix\b|slot=['"]suffix['"]` | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 3 |
| H26 | Dead object keys stop type-checking. | In editor-kit config files, `\b(?:code|codeBlock|link)\s*:\s*(?:false|\{)` | 0 | 0 | 0 | 0 | 0 | 0 | 1 | - | 0 | 6 |
| H05 | Removed TimePicker emits and their declarations break. No app listener exists. | In TimePicker sites and types, `@(?:open|close|input-invalid)\b|on(?:Open|Close|InputInvalid)\s*:|e:\s*['"](?:open|close|input-invalid)['"]` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 8 |
| H18 | The library stops reading the variable. GP defines and reads its own copy at 52px (`index.css:10` plus 3 reads), which keeps working unchanged. | `--mobile-header-height\b` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 1 |
| H28 | The object form is removed; height moves to parent `List.rowHeight`. | `virtual\s*=.*\{|itemHeight|ListVirtualOptions|useVirtualRows` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 5 |
| H35 | The unsupported deep path disappears. | `frappe-ui/src/utils/tailwind\.config` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 1 | 1 |
| L-root internal exports | Root type imports break. None exist in apps. | imports from `frappe-ui` containing `DatePickerViewMode|DatePickerDateObj` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| L-root aliases | Removed alias imports break. None exist in apps. | imports from `frappe-ui` containing `TabButtonValue|TabButtonIcon|AlertActionContext|AlertActionsSlotProps` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 4 |
| M-base/A Progress intervals | Two props become one number prop. | `(?s)<Progress\b(?:(?!>).)*?(?::|v-bind:)?\b(?:intervals|interval-count)\s*=` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| M-dialog/A Alert hook | CSS selectors break. | `\[?data-color(?:\]|\s*=|=)` scoped to Alert | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| M-dialog/A Divider align | The prop name breaks. | `(?s)<Divider\b(?:(?!>).)*?(?::|v-bind:)?\bposition\s*=` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| M-overlays/A Popover control | Current `toggle` sites are own-tree only. The codemod separately reports 43 files in Frappe, CRM, HD, and Builder that still use old `#target`/`togglePopover` APIs. | In Popover blocks, trigger templates containing `\btoggle\b`, plus old `#target`/`togglePopover` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 3 |
| M-inputs/A DateTimePicker | The prop name breaks. | `(?s)<DateTimePicker\b(?:(?!>).)*?(?::|v-bind:)?\ballow-custom-time\s*=` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 7 |
| M-tabs-tree/A Tab state | CSS selectors break. | In TabButtons files, `data-\[state=(?:checked|unchecked)\]|\[data-state=['"]?(?:checked|unchecked)` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| M-shells/A useSheetDrag | Root imports break, with no replacement path. | imports from `frappe-ui` containing `useSheetDrag` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 8 |
| M-shells/A ScrollBar | Root imports and global tags break, with no replacement path. | imports from `frappe-ui` containing `ScrollBar`, plus `<ScrollBar\b|<scroll-bar\b` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 |
| M-list/A ListGroup slot | The slot name breaks. | Find `<ListGroup\b`, then inside each block use `#header\b|v-slot:header\b|slot=['"]header['"]` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 1 |
| B7 | Picker trigger-slot destructuring breaks. | In DatePicker, DateRangePicker, DateTimePicker, or TimePicker blocks, trigger/suffix templates containing `\btoggle\b` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| B9 | The variant value breaks. | `(?s)<SidebarRailItem\b(?:(?!>).)*?\bvariant\s*=\s*['"]tile['"]` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 4 |
| B12 | Suggestion option keys break. The two meanings require manual context. | In `MentionMember` or `SuggestionExtensionOptions` config, `\bcomponent\s*:` | 1 | 0 | 0 | 1 | 0 | 0 | 0 | - | 0 | 9 |

## T2: manual migration per site

| Id | What breaks | Pattern | GP | Frappe | CRM | HD | Builder | Books | Wiki | Suite | v0 | Own |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| H14 | Nothing breaks. SHELL-Q4 keeps the prop; the count is recorded because the earlier 7 missed Builder and Books. Measured 2026-09-15: GP 6 and Builder 1 confirmed on this box. | `(?s)<ScrollArea\b(?:(?!>).)*?(?::|v-bind:)?\bviewport-class\s*=` | 6 | 0 | 0 | 1 | 1 | 2 | 0 | 0 | 0 | 11 |
| M-composables/A getter | The import breaks and each call has to become a `.value` read on `useColorScheme()`. A codemod cannot do it: the replacement needs a binding in the caller's scope. Wiki also deletes the `MutationObserver` the call needed. | `\bresolvedColorScheme\b` | 0 | 0 | 0 | 0 | 0 | 0 | 3 | - | 0 | 13 |
| H24 | Each imported type site must prove that every constructed result has `file_url`. | imports from `frappe-ui` or `frappe-ui/editor` containing `UploadedFile` | 3 | 1 | 0 | 2 | 0 | 0 | 0 | - | 0 | 1 |
| M-editor/A floating options | Each option object must be checked against the owned keys. | `(?s)<Editor(?:Bubble|Floating)Menu\b(?:(?!>).)*?(?::|v-bind:)?\boptions\s*=` | 0 | 0 | 0 | 0 | 0 | 0 | 6 | - | 0 | 0 |
| M-tabs-tree/A TabButton item | Each item needs a decision for removed tooltip text or a non-string label. | In TabButtons files, `\btooltip\s*:|\blabel\s*:\s*(?!['"\x60])` | 0 | 0 | 0 | 3 | 2 | 0 | 0 | - | 4 | 1 |
| H27 | Each configured kit must be checked against its real option type. | `\b(?:RichTextKit|InlineKit)\.configure\s*\(` | 2 | 1 | 1 | 1 | 0 | 0 | 0 | - | 0 | 12 |
| H20 | Each Dialog icon value must be classified as a string, component, or old object. | `(?s)<Dialog\b(?:(?!>).)*?(?::|v-bind:)?\bicon\s*=|\bDialogIcon\b` | 1 | 0 | 1 | 1 | 0 | 0 | 0 | - | 0 | 19 |
| H13 | Each dynamic value must be inverted. | `(?s)<Sidebar\b(?:(?!>).)*?(?::|v-bind:)?\bdisable-collapse(?:\s*=|\s|/?>)` | 1 | 0 | 0 | 1 | 0 | 0 | 0 | - | 0 | 3 |
| M-dialog/A paddingTop | Each number needs a CSS unit chosen by a human. | `(?s)<Dialog\b(?:(?!>).)*?(?::|v-bind:)?\bpadding(?:Top|-top)\s*=\s*['"]?\d` | 0 | 0 | 0 | 0 | 1 | 0 | 0 | - | 0 | 2 |
| M-editor/A mention items | Each item list must produce `{ label, value }`, and each `getMentions()` reader must expect the same two fields. Measured 2026-09-15: GP `editor/config.ts` builds `{ id, label, value }` for mentions and `{ id, label }` for tags (2 sites); frappe `ComposerEditor.vue:218` maps to `{ id, label }` (1 site); Suite passes a list that already carries `label` and `value`, and its 2 `getMentions()` readers post the result to its API (2 review sites); Builder has no mention use. | `\b(?:mention\|tag)\s*:\s*\{[^}]*items\|getMentions\s*\(` | 2 | 1 | - | - | 0 | - | - | 2 | 0 | 20 |
| M-editor/A slash commands | Each object must add or validate `items`. | `\bslashCommands\s*:` | 1 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |

## T3: behavior review

| Id | What breaks | Review-set pattern | GP | Frappe | CRM | HD | Builder | Books | Wiki | Suite | v0 | Own |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| M-overlays/A attributes | Attributes can move to a different DOM element. Review every overlay use. | `<(?:Popover|Dropdown|HoverCard|ContextMenu)\b` | 23 | 9 | 71 | 70 | 26 | 3 | 11 | - | 123 | 71 |
| H01 | Error handling changes from a resolved value to rejection. | In files using `useCall|useDoc`, `\.(?:submit|setValue|delete|runDocMethod)\s*\(` | 58 | 0 | 0 | 0 | 0 | 0 | 0 | - | 25 | 97 |
| L-root defaults (Rating) | Every Rating with no `size` renders one step smaller. The old combined row counted Ratings that *pass* `size`, which is the set that does not change. Measured 2026-09-15: 0 Rating tags in GP, Builder and Suite. The 3 v1 sites are recorded under INP-Q16 (frappe/ui `RatingField.vue:2`, HD `FilterValueEditor.vue:93`, CRM `CFCondition.vue:265`). | `(?s)<Rating\b(?![^>]*\bsize\s*=)[^>]*>` | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 11 |
| L-root defaults (TabButtons) | Omitted TabButtons variants can render differently. The per-app counts are the old combined row's, which is safe for GP (measured 0 Rating tags there); for Frappe, CRM and HD a few of them may be Ratings that pass `size`, which do not change. Own tree measured 2026-09-15. | `(?s)<TabButtons\b(?![^>]*\bvariant\s*=)[^>]*>` | 10 | 4 | 2 | 7 | 6 | 0 | 1 | - | 9 | 37 |
| X3 + HoverCard A | Explicit values change unit. HoverCards without a delay get a new default. | `\b(?:hoverDelay|hover-delay|leaveDelay|leave-delay)\s*=|(?s)<HoverCard\b(?![^>]*(?:hoverDelay|hover-delay)\s*=)[^>]*>` | 2 | 2 | 9 | 8 | 13 | 2 | 0 | - | 19 | 30 |
| M-editor/A prose defaults | Editors without an override render at a new base size. | `(?s)<Editor\b(?![^>]*(?:style|class)[^>]*--prose-font-size)[^>]*>` | 4 | 1 | 2 | 10 | 1 | 0 | 4 | - | 1 | 73 |
| M-packaging/A Tailwind extension | Nothing breaks. PKG-Q7 keeps the replacement and documents it in `foundations/tailwind.md`. The count stays as a record of who reads the preset. | `frappe-ui/(?:tailwind|src/utils/tailwind\.config)` | 1 | 0 | 3 | 1 | 1 | 1 | 1 | - | 6 | 16 |
| H04 | Upload callers can observe new rejection values. The removed alias has no measured call-site use. | `\buseFileUpload\s*\(`; check each `.upload(` catch path and `is_private` option | 2 | 0 | 1 | 1 | 0 | 0 | 3 | - | 1 | 13 |
| B14 | Editors lose the table-of-contents node and the format painter unless they opt in. ED-Q7 keeps `imageViewer` on, so it is two extensions, not three. Measured 2026-09-15 across the 4 setups on this box: 2 must opt in. GP `richTextExtensions.ts` wraps the built-in slash registry, so it needs `toc: {}` or its table-of-contents command disappears (GP's CommentKit stack already adds `Toc` by hand). Suite `CoreEditor.vue:154` reads `editor.storage.styleClipboard`, so it needs `styleClipboard: {}` or that line throws; Suite's table of contents is its own `@tiptap/extension-table-of-contents`, so it needs no `toc`. frappe `ComposerEditor.vue` and Suite `CommentEditor.vue` need neither. | `\bRichTextKit\.configure\s*\(|\[RichTextKit\]` | 1 | 1 | 1 | 1 | 0 | 0 | 2 | 2 | 0 | 17 |
| M-tabs-tree/A Tree events | Event names and cancellation payload change. | In Tree blocks, `@(?:drag-start|drag-end)\b|on(?:DragStart|DragEnd)\s*:` | 0 | 0 | 0 | 0 | 0 | 0 | 1 | - | 0 | 2 |
| M-editor/A InlineKit config | Previously ignored StarterKit settings start changing behavior. | InlineKit configuration blocks containing `starterKit\s*:\s*\{` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 2 |
| M-packaging/A rounded token | Every `rounded-9` use changes radius. | `\brounded-9\b` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 6 |

The inventory contains 72 candidate changes. The rule calls for 63 breaks and 9 permanent keeps. With LIST-Q5's false positives removed and LIST-Q8's 5 live sites added, and batch 2's four corrections applied, 391 v1-app candidate-site migrations remain. This total sums the per-change site counts, so one source location can count twice when it needs two independent edits.

Batch 2 corrections to the counts above, from `rc-api-decisions.md` and from greps run on 2026-09-15:

- **B11 is gone.** SHELL-Q2 keeps `#rail`/`#sidebar` and `#nav`, so there is nothing to migrate (-3).
- **H15 is 2, not 0.** Two apps render `DesktopShell`: GP `DesktopLayout.vue:5` and Suite Drive `DriveLayout.vue:10`. Neither has anything to edit — `scroll` already worked and Drive already passes it (+2).
- **H14 is 10, not 7.** The earlier count missed Builder and Books. SHELL-Q4 keeps `viewportClass`, so none of the 10 migrate (+3).
- **The L-root defaults row split.** Rating is a break with 3 v1 sites (INP-Q16); TabButtons stays a keep and carries the old combined numbers (+3).

One row's app columns do not reproduce its total: L-root defaults (TabButtons) has 38 sites against 30 in the columns. Both numbers are the original report's, carried forward unchanged. It is a keep, so it is outside the 391.

Batch 3 corrections to the counts above, from `rc-api-decisions.md` and from greps run on 2026-09-15. The four rows added by this batch use `-` for CRM, HD, Wiki and Books, which are not checked out on this box:

- **`M-packaging/A Tailwind extension` becomes a keep.** PKG-Q7 keeps the preset replacing Tailwind's colors, font sizes, screens, radii and shadows, and documents the replacement instead. Its 8 v1-app sites leave the migration total (-8).
- **`M-packaging/A lucideIcons` is new: 1 site.** `packaging-v1 --dry-run` on the three app trees reports one config to change, GP `frontend/vite.config.ts`. Builder and Suite already pass `lucideIcons: true`, and apps/frappe does not use the Vite plugin (+1).
- **`M-editor/A mention items` is new: 5 sites.** GP 2, frappe/ui 1, Suite 2 `getMentions()` readers. This is the ED-Q6 count the work list left unmeasured (+5).
- **`M-tokens/A focus variables` and `M-packaging/A sizing scale` are new: 0 sites each.** No app reads frappe-ui's `--focus-<name>`, `w-wizard` or `min-w-50`. apps/frappe reads `var(--focus-default)` 12 times, but against its own `espresso/effects.css` declarations, which this change does not touch.
- **B14 is 8, not 6.** The Suite column was never measured for this row. Suite has 2 RichTextKit setups, and 1 of them must opt in (+2). Across the 4 setups on this box, 2 need an opt-in: GP needs `toc: {}`, Suite `CoreEditor.vue` needs `styleClipboard: {}`.

The five batch 3 corrections cancel out: -8, +1, +5, +0, +2. The total stays 391.
