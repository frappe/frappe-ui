# Frappe UI v1 RC open questions

## X4 — Is `FrappeUIError` just the Frappe response error object?

**Question.** Is `FrappeUIError` the Frappe response error object?

**Facts.** `FrappeUIError` is an interface that extends `Error` with one optional field, `messages?: string[]` (`src/composables/useInputLabeling.ts:6-13`). Input props accept `string | FrappeUIError`, then render `messages` or fall back to `message` (`src/composables/useInputLabeling.ts:26-32`, `src/composables/useInputLabeling.ts:87-94`). Only `frappe-ui/experimental` exports the name (`experimental.ts:7-13`). No code constructs it because interfaces do not exist at runtime.

`FrappeResponseError` is a class with required `title` and `type`, plus optional `exception` and `indicator` (`src/data-fetching/useFrappeFetch.ts:6-26`). `useFrappeFetch` constructs it from `response.errors[0]` (`src/data-fetching/useFrappeFetch.ts:115-147`). It has no `messages` field, but it still satisfies `FrappeUIError` because that field is optional.

`FrappeRequestError` (renamed `FrappeResourceError` on 2026-09-16; the facts here describe the tree at audit time) is an interface with optional `exc_type`, `exc`, `response`, and `status`, plus required `messages` (`src/utils/frappeRequest.ts:20-26`). `frappeRequest` constructs an `Error`, adds those fields, and guarantees at least one message (`src/utils/frappeRequest.ts:190-215`). It also satisfies `FrappeUIError` structurally, but `FrappeUIError` is not an alias of either request error.

```ts
const inputError: FrappeUIError = requestError // valid structurally
const inputError2: FrappeUIError = responseError // also valid
```

H03 explicitly keeps the v1 and v2 request errors independent (`v1-release/rc-api-decisions.md:22-25`). `FrappeUIError` is a third, smaller display contract, not a third transport error.

**Recommendation.** Do not promote `FrappeUIError` under that misleading name; rename it to `InputErrorValue` and export that stable input type.

## X5 — What is the slot prop for closing?

**Question.** What slot prop closes each component today?

**Facts.** These are the exact props on each trigger or default slot:

| Component | Trigger/default slot props today | How slot code closes it |
|---|---|---|
| DatePicker, DateRangePicker, DateTimePicker | `#trigger`: `{ toggle, open, displayLabel, inputValue }` (`src/components/DatePicker/types.ts:127-137`, `src/components/DatePicker/types.ts:174-217`) | `toggle(false)`; only `#actions` gets `close` (`src/components/DatePicker/types.ts:139-172`) |
| TimePicker | No trigger/default slot. `#suffix`: `{ toggle, open }` (`src/components/TimePicker/TimePicker.vue:138-153`) | `toggle(false)` |
| Popover | `#trigger` and `#default`: `{ open, close, toggle }` (`src/components/Popover/types.ts:52-60`, `src/components/Popover/Popover.vue:154-159`) | `close()` |
| HoverCard | `#trigger`: `{ open }`; `#default`: `{}` (`src/components/HoverCard/HoverCard.vue:50-65`, `src/components/HoverCard/HoverCard.vue:81-83`) | No slot helper |
| Tooltip | `#default`: `{}`; it is the trigger (`src/components/Tooltip/Tooltip.vue:37-55`) | No open model or slot helper |
| Select | `#trigger`: `{ open, disabled, selectedOption, clear, setOpen }` (`src/components/Select/types.ts:74-100`, `src/components/Select/Select.vue:220-229`) | `setOpen(false)` |
| Combobox | `#trigger`: `{ open, disabled, query, selectedOption, displayValue, clear, setOpen }` (`src/components/Combobox/types.ts:174-199`, `src/components/Combobox/Combobox.vue:278-286`) | `setOpen(false)` |
| MultiSelect | `#trigger`: `{ open, disabled, query, selectedOptions, clear, setOpen }` (`src/components/MultiSelect/types.ts:121-149`, `src/components/MultiSelect/MultiSelect.vue:276-283`) | `setOpen(false)` |
| Dropdown | `#trigger` and `#default`: fallthrough attrs plus `{ open, close, disabled }` (`src/components/Dropdown/Dropdown.vue:1-16`, `src/components/Dropdown/types.ts:51-65`) | `close()` |
| ContextMenu | `#trigger` and `#default`: `{ open }` (`src/components/ContextMenu/ContextMenu.vue:1-6`, `src/components/ContextMenu/types.ts:20-23`) | No slot helper |

P7 prescribes `{ open, disabled, value }` for trigger slots (`PHILOSOPHY.md:209-221`). ADR-0012 says slot props reach code inside slots, while template-ref methods exist for parent script (`spec/adr/0012-template-ref-surface.md:15-31`). It also reserves `open` and `close` template-ref methods for overlays that own triggers (`spec/adr/0012-template-ref-surface.md:38-57`).

```vue
<template #trigger="{ open, close, toggle, disabled }">
  <Button :disabled="disabled" @click="open ? close() : toggle()" />
</template>
```

**Recommendation.** Use `{ open, close, toggle, disabled }` for trigger-owning overlays; add P7's `value` when the component has a primary value.

## X7 — Which undocumented CSS variables are in use?

**Question.** Where are these variables defined and read, and do consumer apps use them?

**Facts.** Counts are exact string occurrences in the current Gameplan, CRM, Helpdesk, Insights, Frappe, and Suite source trees. They exclude `node_modules`, builds, and nested frappe-ui copies. Tests count because they encode compatibility.

| Variable | Defined at | Read at | Consumer usage count | Stored content |
|---|---|---|---:|---|
| `--mobile-header-height` | Not defined by this library; Gameplan sets it (`/Users/netchampfaris/Projects/benches/frappe-bench/apps/gameplan/frontend/src/index.css:10`) | PageHeader uses a `52px` fallback (`src/components/PageHeader/PageHeaderMobile.vue:3`) | 4 | No |
| `--prose-color-red,orange,yellow,green,teal,cyan,blue,indigo,purple,pink,gray` | Light and dark values (`src/molecules/editor/extensions/color/color-styles.css:1-27`) | Palette and serializer (`src/molecules/editor/extensions/shared/color-palette.ts:36-46`, `src/molecules/editor/extensions/shared/color-style.ts:120-123`) | `3,2,1,2,1,1,4,1,1,1,1` | Yes |
| `--prose-highlight-red,orange,yellow,green,teal,cyan,blue,indigo,purple,pink,gray` | Light and dark values (`src/molecules/editor/extensions/highlight/highlight-styles.css:1-27`) | Palette and serializer (`src/molecules/editor/extensions/shared/color-palette.ts:36-46`, `src/molecules/editor/extensions/shared/color-style.ts:125-127`) | `3,2,2,1,1,1,1,1,1,1,1` | Yes |
| `--chart-categorical-1..10` | Light and dark ramps (`src/charts/style.css:15-41`, `src/charts/style.css:89-102`) | Library and docs readers (`src/charts/tokens.ts:229-248`, `docs/components/foundations/ChartColorsPage.vue:31-35`, `docs/components/foundations/ChartColorsPage.vue:66-73`) | 0 each | No |
| `--chart-sequential-1..9` | Light and dark ramps (`src/charts/style.css:43-51`, `src/charts/style.css:104-112`) | Library and docs readers (`src/charts/tokens.ts:241-250`, `docs/components/foundations/ChartColorsPage.vue:40-43`, `docs/components/foundations/ChartColorsPage.vue:66-73`) | 0 each | No |
| `--chart-diverging-1..9` | Light and dark ramps (`src/charts/style.css:53-67`, `src/charts/style.css:114-124`) | Library and docs readers (`src/charts/tokens.ts:241-250`, `docs/components/foundations/ChartColorsPage.vue:48-51`, `docs/components/foundations/ChartColorsPage.vue:66-73`) | 0 each | No |
| `--chart-gridline`, `--chart-axis-line` | Light and dark values (`src/charts/style.css:69-74`, `src/charts/style.css:126-131`) | Token map and reader (`src/charts/tokens.ts:142-160`, `src/charts/tokens.ts:251-257`) | 0 each | No |
| `--chart-inside-label` | One theme-independent value (`src/charts/style.css:76-80`) | Token map and reader (`src/charts/tokens.ts:152-159`, `src/charts/tokens.ts:251-257`) | 0 | No |
| `--chart-backdrop` | Intentionally unset (`src/charts/style.css:82-86`) | Optional override with ancestor-background fallback (`src/charts/tokens.ts:156-159`, `src/charts/tokens.ts:197-205`, `src/charts/tokens.ts:257`) | 0 | No |
| `--focus-default,red,green,amber,blue,violet` | Generated for light and dark themes (`tailwind/colorPalette.js:149-176`; names come from `tailwind/generated/effects.json:21-40`) | No library runtime read; docs display them (`docs/components/foundations/FocusRingPreview.vue:12-43`) | `13,2,2,3,2,2` | No |

The editor writes prose variable references into HTML styles (`src/molecules/editor/extensions/color/color-extension.ts:58-80`, `src/molecules/editor/extensions/highlight/highlight-extension.ts:82-116`). Suite also parses and exports those exact strings, for example `--prose-color-red` (`/Users/netchampfaris/Projects/benches/frappe-bench-suite/apps/suite/frontend/src/apps/writer/utils/docxexporter.js:47-57`). Frappe still reads `--focus-default`; the library ADR confirms frappe-ui itself no longer does (`spec/adr/0005-focus-ring-2px.md:53-58`).

**Recommendation.** Keep and document prose names; document chart names; rename the mobile hook before RC; keep legacy focus emission without presenting it as new frappe-ui API.

## H08 — What event does a Menu action receive?

**Question.** What does `MenuActionOption.onClick` receive at type-check time and runtime?

**Facts.** The declaration promises a browser `PointerEvent` (`src/components/Menu/types.ts:52-60`). `Menu` receives `$event` from the reka item `select` handler, then casts it to `PointerEvent` before calling the consumer (`src/components/Menu/Menu.vue:34-41`, `src/components/Menu/Menu.vue:126-170`). A cast changes only TypeScript. It does not change the object.

Both `DropdownMenuItem` and `ContextMenuItem` reuse reka's `MenuItemEmits` (`node_modules/reka-ui/src/DropdownMenu/DropdownMenuItem.vue:1-6`, `node_modules/reka-ui/src/ContextMenu/ContextMenuItem.vue:1-6`). That public emit type is `select: [event: Event]` (`node_modules/reka-ui/src/Menu/MenuItem.vue:5-11`). Reka handles pointer and keyboard activation as a click, constructs a cancelable `CustomEvent`, and emits it as `select` (`node_modules/reka-ui/src/Menu/MenuItem.vue:30-45`, `node_modules/reka-ui/src/Menu/MenuItem.vue:49-75`).

At type-check time, consumers can read pointer-only fields. At runtime, they receive the synthetic `CustomEvent`; `pointerType`, coordinates, and buttons are absent. `preventDefault()` is meaningful because reka uses it to keep the menu open (`node_modules/reka-ui/src/Menu/MenuItem.vue:35-44`).

```ts
const options: MenuOptions = [{
  label: 'Open',
  onClick(event) {
    console.log(event.pointerType)
  },
}]
```

The corrected public declaration is `onClick?: (event: Event) => void`. This matches reka's public type and does not expose its internal `CustomEvent` construction.

**Recommendation.** Change the parameter to `Event` now and remove both `PointerEvent` casts in `Menu.vue`.

## H09 — Should Dropdown and ContextMenu have explicit named slot types?

**Question.** What are the costs and benefits of the current index-signature typing?

**Facts.** `MenuSlots` names `item`, `item-prefix`, `item-label`, `item-suffix`, `group-label`, and `empty`, then accepts every string through an index signature (`src/components/Menu/types.ts:174-200`). Dropdown defines `Omit<MenuSlots, 'default' | 'trigger'>` and adds its trigger slots (`src/components/Dropdown/types.ts:61-66`). ContextMenu does the same (`src/components/ContextMenu/types.ts:49-54`).

Because `keyof MenuSlots` includes `string`, `Omit` cannot preserve distinct named properties. `DropdownSlots` effectively resolves to an arbitrary-string slot function map intersected with typed `default` and `trigger`. All Menu slot names still compile, but their props become `any`.

```vue
<Dropdown :options="options">
  <template #item-prefx="{ item }">{{ item.label }}</template>
</Dropdown>
```

Today the typo compiles and never renders. With fixed slots only, it fails type-check. Consumers also regain completion and exact `{ item, close, selected }` props from `MenuItemSlotProps` (`src/components/Menu/types.ts:156-167`). The cost is that fixed slots alone reject valid dynamic names.

Menu does support option-selected dynamic names. `item.slot = 'avatar'` dispatches to `#item-avatar` (`src/components/Menu/MenuItemContent.vue:29-30`, `src/components/Menu/MenuItemContent.vue:57-64`). Keep that feature with a narrow template-literal signature, following Select's existing pattern (`src/components/Select/types.ts:152-177`):

```ts
type MenuDynamicSlots = {
  [name: `item-${string}`]: ((p: MenuItemSlotProps) => any) | undefined
}
type DropdownSlots = DropdownFixedSlots & MenuFixedSlots & MenuDynamicSlots
```

With the narrow dynamic signature, `item-prefx` still compiles because it matches `item-${string}`. Its props are typed, unlike today. TypeScript cannot reject that typo without a bounded union of option slot IDs or a non-overlapping dynamic namespace.

**Recommendation.** Use explicit fixed slots plus the narrow `` `item-${string}` `` signature; do not keep the unrestricted string index signature.

## H11 — Should Tree use `v-model:nodes` and mutate nodes in place?

**Question.** Would `v-model:nodes` make in-place node mutation acceptable, and how do other tree libraries model state?

**Facts from this repository.** Tree takes `nodes: TreeNode[]`; each node may contain `expanded?: boolean` (`src/components/Tree/types.ts:11-20`, `src/components/Tree/types.ts:54-65`). It also defines `v-model:expanded` as an expand-all boolean (`src/components/Tree/Tree.vue:103-105`). A row toggle mutates `node.expanded`; expand-all mutates every collapsible node (`src/components/Tree/Tree.vue:122-149`). Row clicks already toggle expansion (`src/components/Tree/TreeItem.vue:28`, `src/components/Tree/TreeItem.vue:162-165`). There is no selection model.

**Installed-source comparison.** Reka TreeRoot keeps item data separate. Unnamed `v-model` holds selected item objects, `v-model:expanded` holds string keys, `multiple` changes selection cardinality, and `getKey` identifies items (`node_modules/reka-ui/src/Tree/TreeRoot.vue:6-38`). It derives expansion and selection by key without mutating items (`node_modules/reka-ui/src/Tree/TreeRoot.vue:112-139`).

**Comparison from memory, not checked against installed source.**

| Library | Expansion | Selection |
|---|---|---|
| Element Plus `el-tree` | `default-expanded-keys` plus node methods/state | `current-node-key` or checked-key methods |
| Naive UI `n-tree` | controlled `expanded-keys` with update callback | controlled `selected-keys` and `checked-keys` |
| PrimeVue Tree | `v-model:expandedKeys`, keyed map | `v-model:selectionKeys`, keyed value/map |
| Ant Design Vue Tree | `v-model:expandedKeys` | `v-model:selectedKeys` and `v-model:checkedKeys` |
| Headless Tree | controlled expanded-item IDs | controlled selected-item IDs |
| TanStack patterns | feature state keyed by row/item ID | separate keyed selection state |
| Radix/shadcn patterns | no canonical Tree primitive; recipes own state | recipe-specific state |

`v-model:nodes` says the component may replace the primary data array and emit `update:nodes`. An in-place property write may render if the objects are reactive, but it does not emit a new array reference. Shallow watchers, immutable stores, and undo logs can miss it. P2 requires observable two-way state to use a model (`PHILOSOPHY.md:50-58`). P3 permits structured render data, but it does not make UI state part of that data (`PHILOSOPHY.md:75-81`).

```vue
<Tree :nodes="nodes" v-model="selectedKeys" v-model:expanded="expandedKeys" />
```

**Recommendation.** Do not add `v-model:nodes`; use keyed expansion and selection models, and stop mutating caller nodes.

## H14 — Why does `ScrollArea.viewportClass` exist?

**Question.** Why was `viewportClass` introduced, how much is it used, and can `data-slot` replace it?

**Facts.** `git log -S viewportClass --oneline -- src/components/ScrollArea` finds two commits. Commit `49d2a14efe` introduced ScrollArea and `viewportClass` together. Its message says ScrollArea supported SettingsDialog panels with fixed headers and scrolling bodies. The first call supplied inner padding through `viewport-class` (`src/components/SettingsDialog/SettingsBody.vue:1-8`). Commit `f5789268a6` later extracted the prop type and added `data-slot` hooks; it did not create the behavior.

The current prop is declared at `src/components/ScrollArea/types.ts:1-8` and appended to the viewport class at `src/components/ScrollArea/ScrollArea.vue:7-12`. P10 now forbids named class props for inner elements and prescribes `data-slot` selectors (`PHILOSOPHY.md:309-321`).

Current exact-string counts, excluding `node_modules`, are:

| Scope | `viewportClass` or `viewport-class` occurrences |
|---|---:|
| `src/` | 5 |
| `docs/` | 9 |
| Consumer sources | 7: Gameplan 6, Helpdesk 1 |

The consumer examples include Gameplan's sidebar (`/Users/netchampfaris/Projects/benches/frappe-bench/apps/gameplan/frontend/src/components/AppSidebar.vue:13`) and Helpdesk's sidebar (`/Users/netchampfaris/Projects/benches/frappe-bench/apps/helpdesk/desk/src/components/layouts/AppSidebar.vue:11`).

The same result is possible because the actual scrolling element already has `data-slot="scroll-area-viewport"` (`src/components/ScrollArea/ScrollArea.vue:7-10`):

```vue
<ScrollArea class="settings-scroll" />
<style>
.settings-scroll [data-slot='scroll-area-viewport'] { padding: 0 1rem; }
</style>
```

Scoped Vue styles need `:deep([data-slot='scroll-area-viewport'])`. Tailwind consumers can use an arbitrary descendant variant.

**Recommendation.** Remove `viewportClass`, document the selector, and migrate the 21 repository and consumer occurrences before the RC.

## H17 — What do the shell and PageHeader registries do?

**Question.** What is the registry, how does it misroute, and what changes under each proposed option?

**Facts.** A registry is a module-level array of mounted DOM elements. Mounting appends an element, unmounting removes it, and a computed value returns the last element (`src/composables/useShellScrolled.ts:21-47`, `src/components/PageHeader/target.ts:7-19`). DesktopShell and MobileShell register their scroll elements (`src/components/DesktopShell/DesktopShell.vue:66-89`, `src/components/MobileShell/MobileShell.vue:44-49`). Each PageHeaderTarget registers its empty target element (`src/components/PageHeader/PageHeaderTarget.vue:6-12`). PageHeader teleports to the last target (`src/components/PageHeader/PageHeaderBase.vue:1-13`). `useShellScrolled` listens to the last scroll element (`src/composables/useShellScrolled.ts:73-93`). Component ancestry is not considered.

Normal single shell:
```text
DesktopShell
  PageHeaderTarget A      <- RoutedPage's PageHeader teleports here
  ScrollArea A            <- RoutedPage's useShellScrolled listens here
    RoutedPage + PageHeader
```
Two shells, or a dialog target mounted later:
```text
DesktopShell A: PageHeaderTarget A + ScrollArea A
    Page A + useShellScrolled  --listener--> ScrollArea B  WRONG
    Dialog + PageHeader        --teleport--> Target B      WRONG
DesktopShell B                 <- mounted last
  PageHeaderTarget B + ScrollArea B
```
Option 1 provides the nearest targets and keeps the registry as fallback. Normal consumer code stays unchanged:
```vue
<DesktopShell><Page /></DesktopShell>
const scrolled = useShellScrolled() // nearest shell, then global fallback
```
Option 2 removes globals and requires explicit targets. A possible API makes every consumer wire both elements:
```vue
<PageHeader :target="headerTarget" />
const scrolled = useShellScrolled({ target: scrollElement })
```
Option 3 freezes last-mounted-wins behavior. Consumer code stays unchanged and must avoid concurrent shells or local PageHeader targets:
```vue
<DesktopShell><PageHeader /></DesktopShell>
const scrolled = useShellScrolled()
```
**Recommendation.** Choose option 1; nearest ownership fixes nested layouts while the fallback preserves router and non-component access.

## VOC-Q4 — What should `FrappeUIError` be called?

**Question.** "still unsure about InputErrorValue, others are fine" (2026-09-14).

**Facts.**

- `FrappeUIError` is `interface FrappeUIError extends Error { messages?: string[] }` (`src/composables/useInputLabeling.ts:11-13`). It types `InputLabelingProps.error` (`:32`), `PickerShell.vue:73,89`, and `FormControl/types.ts:3,11`. Only `experimental.ts:13` exports it.
- The component reads two keys: `messages` first, then `message` (`useInputLabeling.ts:85-97`). It never reads `name` or `stack`.
- `spec/inputs.md:100,171` already specifies `error?: string | Error`. The name `FrappeUIError` is not in the spec.
- No measured app imports `FrappeUIError` (gameplan, frappe, crm, helpdesk, builder, wiki, insights, raven, meet, books). The frappe app copies the shape by hand three times: `Grid/types.ts:27`, `components/types.ts:4`, and `InviteUser.vue:50,99`. `InviteUser.vue` needs a cast because `{ messages: [...] }` is not an `Error`.
- Apps pass `:error=` to frappe-ui inputs at 5 sites (frappe 4, helpdesk 1).

**Name candidates.**

| Name | Problem |
|---|---|
| `FrappeUIError` | Reads like a transport error; the product prefix breaks the generic-name rule |
| `InputErrorValue` | Every other `*Value` type is a model value (`SliderValue`, `RadioValue`, `TabValue`, `SelectOptionValue`), so it suggests a v-model |
| `InputError` | Already the name of an exported component (`src/components/InputLabeling/index.ts:3`) |
| `FieldError` | Collides with react-hook-form's well-known type; frappe-ui has no "field" vocabulary |
| `ErrorLike` | Free name, but does not say what it is for |
| `DisplayError` | Vague; can read as a verb phrase |

Nuxt UI, Vuetify, Element Plus, and Reka UI do not name a type for this prop. Each types it inline (`string`, `string | boolean`, or `string | string[]`).

**Recommendation.** Add no new name. Type the prop inline as `error?: string | (Error & { messages?: string[] })` and delete `FrappeUIError`. Code that forwards the prop uses `InputLabelingProps['error']`, which X4 already exports. This matches the spec and costs zero app migrations.

**Follow-up choice.** Because the component reads only `message` and `messages`, the type could loosen to `string | { message?: string; messages?: string[] }`. That removes the frappe app's cast, but it moves away from the spec's `Error`.

## VOC-Q3 — Can a codemod change delay props from seconds to milliseconds?

**Question.** "can we write a codemod for this?" (2026-09-14).

**Answer.** Yes. It converts 26 of the 38 app sites without help and lists the other 12 for a person to check.

**Props that change.**

| Component | Prop | Default (seconds) | ×1000 at |
|---|---|---|---|
| Tooltip | `hoverDelay` | 0.5 | `Tooltip.vue:20,25` |
| TooltipProvider | `hoverDelay`, `skipDelay` | 0.5, 0.3 | `TooltipProvider.vue:38,41-42` |
| HoverCard | `hoverDelay`, `leaveDelay` | 0.3, 0.3 | `HoverCard.vue:27-28,38-39` |

No other public time prop uses seconds. `ScrollArea.scrollHideDelay`, Toast `duration`, and the input debounce props already use milliseconds.

**App sites** (apps in `~/Projects/benches/frappe-bench/apps/`).

| Kind of site | GP | Frappe | CRM | HD | Builder | Books | Wiki | Total | Codemod |
|---|---|---|---|---|---|---|---|---|---|
| Number written in the template | 0 | 0 | 6 | 4 | 13 | 3 | 0 | 26 | converts |
| Variable, expression, `h()` call, or JS object | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | refuses |
| HoverCard with no delay set | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 3 | lists |
| Old `<Popover trigger="hover">` delays | 0 | 2 | 3 | 4 | 0 | 0 | 0 | 9 | converts and lists |

The migration report counted 36 sites. This count is 38 because the report missed `AttachField.vue:39-40` in Frappe and `LinkedEntryButton.vue:6-7` in Books. Books imports the components under other names (`FrappeTooltip`, `FrappeHoverCard`). Helpdesk registers `Tooltip` globally (`desk/src/main.js:14,35`). The codemod must handle both.

A HoverCard with no delay set is a behavior change, not only a unit change: it opens after 300ms today and after 500ms once the default changes (`rc-medium-triage.md:60`). The codemod cannot fix this, so it prints these sites.

**How to build it.** Copy the template scanner from `scripts/migrate-shortcuts-v1.js`. That codemod already rewrites prop values in SFC templates without a parser (`:551`, `:587`, `:595`). Add a new bin next to `shortcuts-v1` in `package.json:21-24`. Estimated size: 200 to 300 lines plus about 150 lines of tests.

**Running it twice must be safe.** Every app value today is between 0 and 1.5. Rules for a number written in the template:

- Leave `0` unchanged.
- Multiply values from 0.05 to 10 by 1000.
- Skip values of 50 or more, because they are already milliseconds.
- Refuse any other value.

Every converted value is at least 50, so a second run changes nothing. The codemod refuses variables and expressions instead of wrapping them in `(expr) * 1000`, because a second run would multiply them again. It only changes tags imported from `frappe-ui`, or bare tags that the file does not import from anywhere else. This is the same rule `shortcuts-v1` uses.

**Effect on the decision.** With the codemod, 26 sites need no manual work and 12 need a check. That takes X3 from T3 down to about T1, plus a short manual list.

## DAT-Q9 — What does the M-data checklist mean?

**Question.** "please explain this in plain words" (2026-09-14).

**What the question asks.** The audit found seven smaller problems in the data layer. The triage put three of them in group A (small fixes that a rule already decides) and four in group C (fixes that can wait for 1.1). The question is: do the A fixes now, and move the C fixes to 1.1?

**Group A: small fixes before RC.**

| Item | What is wrong today | Fix | App sites |
|---|---|---|---|
| `execute`, `fetch`, `reload` and `loading`, `isFetching` | Every v2 composable returns three names for the same "run the request" function and two names for the same "is loading" flag (`src/data-fetching/useCall/useCall.ts:252-269`). The audit asked to remove the extra names. | No code change. The v1 rules already accept these extra names as an exception. Write the exception in the API docs. | 0 |
| `app.use(FrappeUI, { resources })` | The type allows `resources: true` or an object. The plugin only checks whether the value is on. The object contents are never read (`src/utils/plugin.ts:16`). | Change the type to `resources?: boolean`. | 2, a codemod can fix them |
| `export *` in `src/resources/index.ts:6,8` | Everything in `local.ts` and `realtime.ts` becomes public, including helpers that were never meant to be public. | List the public names one by one. This is already decided as part of VOC-Q5. | 0 |

**Group C: move to 1.1.** None of these change an existing name, so doing them after v1 does not break apps.

| Item | What is wrong today |
|---|---|
| Missing type exports | Types such as `UseDocOptions`, the `Use*Return` types, `FrappeUIPluginOptions`, and the v1 `Resource` interfaces exist but cannot be imported. |
| `FileUploadHandler.upload()` (the v1 upload helper) | It accepts `params`, `signal`, and `onProgress` but ignores them, returns `Promise<any>`, and reports progress in a different shape than `useFileUpload`. |
| v2 composables ignore app config | `setConfig('requestHeaders', ...)` and `setConfig('requestBaseUrl', ...)` apply to `frappeRequest` and v1 resources only. `useCall`, `useList`, and `useDoc` do not send those headers, so an app that uses token auth gets no auth header on them. |
| Loose types | `error` is `Ref<any>` on every composable, `debounce` loses the argument types of the wrapped function, and `vOnOutsideClick` has no types. |

**Option 1 (recommended):** do the three A items before RC, and move the four C items to 1.1. **Option 2:** do all seven before RC. **Option 3:** same as option 1, but remove the extra names instead of keeping them.

**How this fits your other answers.** You said v2 data fetching gets no more improvements and v3 replaces it. That supports option 1. The config bug in group C is the only item with a user-visible effect today (token-auth apps). If an app needs it before v3, fix it in 1.1 as a bug fix.

## DAT-Q6 — Should `useNewDoc` default to `refetch: false`?

**Question.** "useNewDoc's default is not intentional, it should probably be refetch: false?" (2026-09-14).

**Answer.** It already is `false`, but by accident. `useNewDoc` does not set `refetch`; it gets `false` from `useIsolatedCall` (`src/data-fetching/useIsolatedCall.ts:70`). The type still lets a caller pass `refetch: true` (`src/data-fetching/useNewDoc/useNewDoc.ts:6-9`), and that breaks the composable.

**What `refetch: true` does to `useNewDoc`.** A scratch vitest run confirmed this.

1. `params()` reads the reactive `doc` (`useNewDoc.ts:31-39`), so the params watcher (`useIsolatedCall.ts:289-291`) sends a POST insert on every edit to `doc`.
2. `submit()` sends nothing when `refetch` is true (`useIsolatedCall.ts:230-232`). It resolves `undefined`, and `useNewDoc` then throws `insert <doctype> failed` (`useNewDoc.ts:60-65`).

With autoname, that is one new row per keystroke.

**Cache options on an insert.** `cacheKey` writes the last insert response to IndexedDB and shows it as `data` in the next session before any submit (`useIsolatedCall.ts:179-181`, `:256-284`). `staleOnError` only works with `cacheKey`. `initialData` does no harm but has no clear use. `immediate` is already left out of the type, but `...options` comes after `immediate: false` (`useNewDoc.ts:40-41`), so an untyped caller can still override it.

**Consumer sites.** 7 `useNewDoc` calls: gameplan 6, all with no options, and suite 1, with `onSuccess` and `onError` only. No site passes `refetch`, `immediate`, `cacheKey`, `staleOnError`, or `initialData`.

**Recommendation.** Zero app migrations.

- Leave `refetch`, `cacheKey`, and `staleOnError` out of `UseNewDocOptions`. `initialData` is optional.
- Set `immediate: false, refetch: false` after `...options` so no caller can override them.
- Update `docs/content/docs/data-fetching/use-new-doc.md:35-37`.

The type change is an API break, so the PR title gets a `!`.

`useDoc` `methods:` entries have the same problem: `...option` is spread after `refetch: false` (`src/data-fetching/useDoc/useDoc.ts:128-133`). Apply the same fix there.

**Gaps in the docs for the other defaults.**

- `use-call.md:65` does not say that `submit()` stops sending requests when `refetch` is true.
- `use-list.md:107` does not say that `refetch` also controls paging and the reload after `insert`, `setValue`, and `delete`.
- `use-doc.md` does not say that the GET always refetches when `name` changes.

## DAT-Q4 — How many call sites use `is_private`?

**Question.** "if there are too many call sites using is_private, i'd like to keep it" (2026-09-14).

**Answer.** None. No app passes `is_private` to a frappe-ui upload API, v1 or v0. Remove it.

**Facts.**

- `is_private` is not a v0 name. It came in v1.0.0-beta.21 (commit 3e18192772, 2026-07-04). In v0, `useFileUpload` and `FileUploadHandler` read only `private`.
- `UploadOptions` declares both options (`src/utils/useFileUpload.ts:7-8`). `isPrivateUpload()` checks `private` first, then `is_private` (`:35-45`). `FileUploadHandler.upload` shares that type and resolver (`src/utils/fileUploadHandler.ts:1,64,146`), so removing the option affects both.
- `FileUploader` has only a `private` prop (`src/components/FileUploader/types.ts:19`) and is not affected.
- Every `is_private` hit in the apps is one of these: a document field, a raw FormData or server call (crm `filesUploaderHandler.ts:106`, crm `AttachmentArea.vue:114`, frappe/ui `useUploader.ts:346`), or a type or fixture.
- `private` passed through `useFileUpload`: 8 v1 sites (gameplan 2, frappe/ui 1, crm 1, helpdesk 1, wiki 3) and 5 in suite. These keep working.

**Also remove.**

- `UploadPrivacy` (`src/index.ts:185`, `useFileUpload.ts:4`): only `is_private` uses it.
- `isPrivateUpload` from the root export (`src/index.ts:180`), or keep it internal. No app imports either name.

**Own-tree edits.**

- `src/utils/useFileUpload.test.ts:6,19-32` (the fallback tests).
- `docs/content/docs/other/utilities.md:194,226`.
- `docs/content/docs/migration.md:922,940,950` and `changelog.md:924,2352`: say `private` only.

Leave the server form field and response field (`useFileUpload.ts:65,270`, `fileUploadHandler.ts:146`, `FileUploader.cy.ts`).

**Watch out.** The old experimental TextEditor spreads an untyped `uploadArgs` into `upload()` (`experimental/TextEditor/TextEditor.vue:92`). An `is_private` passed there would be ignored without an error. No app does this.

## DAT-Q1 — What does "every v2 action rejects" cost?

**Question.** "i'd like to keep this consistent, but this should depend on the migration effort. I don't plan to enhance v2 data fetching apis further, they will be replaced by data fetching v3" (2026-09-14).

**Short answer.** Only gameplan uses `useCall` or `useDoc`. Frappe/ui, crm, helpdesk, builder, books, and wiki do not. If the rule is "actions reject, reads resolve", about 50 gameplan sites change. Most of them become correct, about 7 need an edit, and about 22 need a `.catch` or they print an unhandled rejection. The docs already say these calls reject.

**Library behavior today.**

| Member | On failure |
|---|---|
| `useCall` `submit`, `execute`, `fetch`, `reload` | resolves (`null`, `initialData`, or the previous data) (`useCall.ts:188-212`) |
| `useDoc` `setValue`, `delete`, `methods:` members | resolve `null` (`useIsolatedCall.ts:199-214`) |
| `useDoc` `reload`, `fetch`, `execute` | resolve `null` (VueUse `execute`) |
| `useList` `insert`, `setValue`, `delete`; `useDoctype` actions | reject (`useAction.ts:198-217`) |
| `useList` `reload`, `fetch`, `execute` | resolve (VueUse `execute`, `useList.ts:266-268`) |
| `useNewDoc().submit` | rejects (`useNewDoc.ts:57-66`) |

Reads (`reload`, `fetch`, `execute`) already resolve in every composable. Only the write actions differ. So "actions reject, reads resolve" is one consistent rule. It leaves every `reload()` and `fetch()` call alone.

**The 58 sites, rechecked.** 16 of the 58 were false positives: 10 `useDoctype`, 3 `useList`, 2 `useNewDoc`, and 1 `Set.delete`. The grep also missed 32 real sites, 12 of them in `TaskDetail.vue`, which gets its doc through `useTask`. That gives 74 real sites that call submit, execute, fetch, or reload on a `useCall` or `useDoc` resource, all in gameplan.

| Kind of site | All 74 | Affected if only actions reject |
|---|---|---|
| Uses the resolved value, or needs code after it to run on failure | 5 | 1 (`CommandPalette.vue:606`, `response \|\| []`). The other 4 are `reload()` calls. |
| Runs success logic after a failure (rejection fixes a bug) | 14 | 14. 9 are inside `dialog` `onConfirm`, which already shows a rejection inline (`src/utils/dialog.ts:340-353`). 5 chain `.then` with no `.catch`. |
| Already has try/catch or `.catch`, but the catch never runs today | 19 | 17, which become correct with no edit |
| Result ignored | 36 | about 22 get a console "unhandled rejection". The rest are `reload()` or `fetch()` calls. |

**Bugs the change fixes in gameplan.**

- `DiscussionView.vue:752`: a failed post edit still commits and deletes the draft, so the edit is lost.
- `CustomizeSidebarDialog.vue:360` and `MobileHome.vue:140` show a success toast on failure.
- `ProfileSettings.vue:264,283,323`, `ProfileImageEditor.vue:92`, and `useProfileFieldEditing.ts:77-95` update local state as if the save worked.
- `Drafts.vue:245` and `SpaceDiscussions.vue:240` clear the selection or close the dialog after a failure.

**Library edits.**

- `useAction.ts:198` and `useIsolatedCall.ts:199` read `call.error` after the await.
- `useNewDoc.ts:57-66` checks for `null`.
- Tests: `useDoc.test.ts:333,336,352` and `staleWrites.test.ts:470`.
- Reference docs: no change (`use-call.md:103-112`, `use-doc.md:103`, `utilities.md:146` already say reject). Only `changelog.md:856` describes the old behavior.

**Recommendation.** Make the write actions reject: `useCall` `submit` and `useDoc` `setValue`, `delete`, and `methods:` members. Keep `reload`, `fetch`, and `execute` resolving everywhere, and write "actions reject, reads resolve" in the data-fetching docs.

The cost is in gameplan only, and gameplan is your app: about 7 edits plus about 22 `.catch` additions. The change also fixes about 20 silent failures. Because v3 replaces v2, this is the last change to v2's error contract.

## OVR-Q8 — Should Alert's `data-color` hook become `data-theme`?

**Question.** "Alert data-color was renamed from data-theme in this https://github.com/frappe/frappe-ui/pull/1005, not sure how to handle this." (2026-09-14).

**Short answer.** Keep `data-color`. PR #1005 renamed it on purpose, because `data-theme` is the light/dark attribute. Record the name as a hook rule so the audit does not flag it again.

**What PR #1005 did.** PR #1005 (merged in 4cea3ec92b, 2026-08-09) first stamped `data-theme` on the root of Alert and SidebarCard. The barista review said the attribute was already used for light/dark (`useColorScheme.ts:17` sets `<html data-theme>`, and apps style `[data-theme='dark']`). Commit 34386604d3 renamed it to `data-color` on both components.

**Facts.**

- The prop is still `theme` (`gray | blue | green | amber | red`, `src/components/Alert/types.ts:32`). The hook carries that value: `Alert.vue:175` and `Sidebar/SidebarCard.vue:133`. The audit named only Alert, but SidebarCard stamps it too.
- The hook is not documented. One test checks it (`Sidebar.cy.ts:239`).
- A `data-theme="red"` on an Alert would match no selector today. Every frappe-ui `data-theme` selector names the value `dark` (`tailwind/preset.js:24`, `tailwind/colorPalette.js:81,158`, `tailwind/plugin.js:195`), and every script reads only `document.documentElement` (`useColorScheme.ts:56`, `charts/tokens.ts:268-271`).
- The problem is meaning, not a broken selector. `CONTEXT.md:76-82` defines `data-theme` as the light/dark attribute. Apps already set it below `<html>` (crm `EmailContent.vue:239-240`, frappe `PrintFormat.vue:4`). A future `closest('[data-theme]')` lookup would stop at an Alert.
- No other frappe-ui component stamps a tone hook. P10 (`PHILOSOPHY.md:314`) lists `data-slot`, `data-state`, `data-disabled`, `data-variant`, and `data-size`, and has no tone hook. P4 names the prop `theme`; it says nothing about DOM attributes. So `data-color` breaks no written rule.
- Frappe desk's espresso CSS uses `data-theme` for tone (`.es-alert[data-theme="red"]`, `frappe/public/css/espresso/components/alert.css:48`) next to `[data-theme="dark"]`. That is the one argument for the rename.
- App sites that select either attribute on Alert or SidebarCard: 0 in all seven v1 apps. The migration cost is 0 either way.

**Recommendation.** Keep `data-color`. Add one line to P10: "The tone hook is `data-color` and carries the `theme` value, because `data-theme` is the light/dark attribute." Document the hook in the Alert and SidebarCard API docs. Drop the triage item "M-dialog/A Alert hook".

**Follow-up.** "there must be other components that are setting data-theme attribute against the theme prop?" (2026-09-14).

No. A search of `src/`, `experimental/`, and `docs/` finds no component that stamps `data-theme` from a `theme` prop.

- `data-color` is stamped by Alert (`Alert.vue:175`) and SidebarCard (`SidebarCard.vue:133`) only. Git history shows `data-theme` was on these two components only, from their first commits (87d5dca344, fcd519143d) until 34386604d3.
- Components with a `theme` prop and no hook at all: Badge, Button, Avatar, Spinner, Dialog (from OVR-Q5), and Menu options.
- Every other `data-theme` use is light/dark: `useColorScheme.ts:23`, `charts/tokens.ts:271`, `experimental/Calendar/useEventBase.ts:54`, and the docs demos. `experimental/ThemeSwitcher.vue:40` uses a different name, `data-theme-option`.
- The editor's `data-color` (`highlight-extension.ts:97`) is a legacy attribute in saved HTML, not a component hook.

So v1 has no `data-theme` tone hook to be consistent with. Adding `data-color` to Badge, Button, and the others now would add hooks nobody uses, so leave them out until an app needs one.

## OVR-Q12 — Can a codemod change `toggle` to `setOpen`?

**Question.** "if toggle is codemod-able easily then setOpen rename is fine" (2026-09-14).

**Short answer.** Yes. No v1 app uses the current `toggle` name, so the rename costs apps nothing. A codemod converts every current-name site. The old names that beta.39 (Popover) and beta.52 (pickers) removed are still in four apps. Those sites need a person, and they must migrate anyway.

**How it was counted.** Every `.vue` template was parsed with `@vue/compiler-sfc`. The count follows destructured slot names, and includes renamed imports (Books `FrappePopover`) and global registration. It skips same-name local components (Builder `ContextMenu.vue`, Books `Popover.vue`, Helpdesk headlessui `NestedPopover`). The full site list is in `/tmp/fui/rows.json` (scanner `/tmp/fui/scan.mjs`); these are scratch files and can be deleted.

**Current names (the RC change).**

| Form | v1 apps | v0 apps | Own tree |
|---|---:|---:|---:|
| Popover `toggle`, any form | 0 | 0 | 0 |
| Picker `{ toggle }`, `toggle()`, `toggle(bool)`, `@click="toggle"`, passed as a value | 0 | 0 | 3 story handlers, 18 in 4 test files |
| Template ref `.toggle()` | 0 | 0 | 0 |
| Popover `close` from `#default`/`#trigger` | 2 (GP `EmojiPicker.vue:37,56`, passed as a callback) | 0 | 3 (`Popover/stories/Click.vue:13`, `Dismissible.vue:15`, `Popover.cy.ts:66`) |
| Dropdown trigger `close` | 0 | 0 | 0 |

- Template refs are not part of the rename. Popover exposes only `open` and `close` (`Popover.vue:119`), and the pickers expose only `open` (`DatePicker.vue:190-192`).
- Picker `#trigger` is not wired to open the picker (`PickerShell.vue:3-4` uses `PopoverAnchor`), so `@click="toggle"` there becomes `setOpen(!open)`. On Popover `#trigger` the same handler toggles twice, so the codemod lists it instead.

**Old names the migration report missed.** The report's pattern (`\btoggle\b` inside trigger templates) cannot match `togglePopover`, `#target`, `#body`, or `#body-main`. "0 sites" was right for the RC change, but it hides these.

| Old Popover form | Frappe | CRM | HD | Builder | v0 |
|---|---:|---:|---:|---:|---:|
| `togglePopover` destructured | 3 | 16 | 17 | 9 | 44 |
| `togglePopover()` | 1 | 9 | 13 | 4 | 28 |
| `@x="togglePopover"` | 3 | 7 | 1 | 7 | 15 |
| `togglePopover` passed as a value | 0 | 2 | 4 | 0 | 4 |
| old `close()` or `close` as a callback | 3 | 5 | 11 | 5 | 1 |

CRM, Helpdesk (beta.24), Builder (beta.21), and frappe/ui (`>=beta.16`) still use the old Popover slots: 43 files in total. CRM also has 3 old picker slot uses. The old `isOpen` is read 10 times in v1 apps, and the old `open()` method is called about 16 times (HD, Builder). Moving from `#target` to `#trigger` means deleting the app's own click handler, because `#trigger` opens the popover itself. The migration guide needs one note for this.

**What the codemod converts.**

- `{ toggle }` becomes `{ setOpen, open }`. If the slot already uses another `open`, the site is refused.
- `toggle()` and picker `@x="toggle"` become `setOpen(!open)`. `toggle(true)` and `toggle(false)` become `setOpen(true)` and `setOpen(false)`.

**What it lists for a person.** `toggle(expr)` with a non-literal argument, `toggle` passed as a value, `@click="toggle"` on Popover `#trigger`, render-function slots in `.ts` files, and every old-name site above.

**How to build it.** Slot renames need scope tracking, so use `@vue/compiler-sfc` (`parse`, `babelParse`, `walkIdentifiers`, `MagicString`). It ships with the `vue` peer dependency, so no new dependency. About 250 to 300 lines plus 150 lines of tests. Put it in one `overlays-v1` bin with the delay-units codemod (VOC-Q3). Both need the same frappe-ui tag check, file walk, `--dry-run`, and "any refusal exits non-zero" rule, and the delay transform can use the same template AST instead of regexes.

**Follow-up decision (2026-09-14).** "if we are keeping close, then it should be present alongside setOpen everywhere and document it." `close()` stays on every slot that has `setOpen`, trigger and content slots alike, so the codemod renames only `toggle`. The `close` rows in the first table need no migration.

## OVR-Q11 — Which sites lose attributes when HoverCard and ContextMenu stop forwarding them?

Found during the OVR-Q12 research.

- **HoverCard.** Used in GP 2, Frappe 1, Books 1, and 4 own-tree files. One site passes a fallthrough attribute: `gameplan/frontend/src/components/ReactionsDesktop.vue:7`, `@pointer-down-outside="onPointerDownOutside"`. The handler calls `preventDefault()` (`:90-92`). Today it reaches `HoverCardContent` (checked in jsdom). With `inheritAttrs: false` it is dropped, and a click outside closes the reaction picker.
- **ContextMenu.** No app uses frappe-ui's ContextMenu (Builder's 2 are its own component). Attributes already go nowhere today: they fall through to reka's `ContextMenuRoot`, which has `inheritAttrs: false` and renders no element. Adding `inheritAttrs: false` changes nothing at runtime.

**Follow-up.** "about HoverCard, can the pointer-down-outside behaviour be generalised? if not then explicitly emit the pointer-down-outside event and not via v-bind=\"$attrs\"" (2026-09-14).

**Short answer.** Yes. GP's handler exists only so that pressing the trigger does not close the card. Popover, Dropdown, and the pickers already ignore presses on their own trigger. HoverCard is the only overlay with a trigger that does not.

**Why GP has the handler.** `ReactionsDesktop.vue:87-89` says it: a press on the trigger counts as outside the card, so the card closes and the trigger's `@click` (`:15`) opens it again, which shows as a flash. It was added in gameplan `f3848f2b` (2026-07-01), when the component moved from Popover to HoverCard. The card holds only emoji `Button`s, and no overlay opens from inside it. The handler prevents every outside press, not only presses on the trigger. So on a touch screen that gets the desktop layout, tapping elsewhere may never close the card (reka ignores touch for hover open and close). This comes from reading the reka source; it was not tested on a device.

**Facts.**

- Reka's HoverCard has no trigger rule: `HoverCardContentImpl.js:157` passes `pointerDownOutside` through, and `DismissableLayer.js:57-63` closes unless the event is prevented.
- The same rule exists elsewhere: frappe-ui `Popover.vue:138-150` (documented at `spec/popover.md:287-289`), reka `PopoverContentNonModal.js:129-131`, reka `DropdownMenuContent.js:142`, `PickerShell.vue` (about `:170`), and `TimePicker.vue:175-186`. Tooltip closes on a trigger press on purpose (reka `TooltipContentImpl.js:115`).
- Nested overlays need no rule. Reka's `isLayerExist` (`DismissableLayer/utils.js:8-15`) ignores a press inside any later `[data-dismissable-layer]`, portaled or not.
- No frappe-ui overlay has public dismiss events. `PopoverEmits`, `DialogEmits`, `DropdownEmits`, and `BottomSheetEmits` declare only open-state and `after-leave` events.
- HoverCard already has `inheritAttrs: false` (`HoverCard.vue:18-20`) but binds `v-bind="$attrs"` on `HoverCardContent` (`:75`). The OVR-Q11 fix is to delete `:75`.
- A scratch jsdom test against the real `HoverCard.vue`, with the card open:

| Handler | Press on trigger | Press elsewhere | Press inside a later reka layer |
|---|---|---|---|
| None | closes (the flash) | closes | stays open |
| GP's (prevents every press) | stays open | stays open | stays open |
| Trigger-only rule | stays open | closes | stays open |

**Recommendation.** Build the rule into HoverCard, and declare no dismiss emits.

- In `HoverCard.vue`, give `HoverCardTrigger` a template ref. Add `@pointer-down-outside` on `HoverCardContent` that calls `preventDefault()` when the trigger element contains `event.target`, as `Popover.vue:79,145-150` does. Delete `v-bind="$attrs"` at `:75`.
- Copy the wording of `spec/popover.md:288-289` into `spec/hover-card.md`.
- Gameplan follow-up: delete `ReactionsDesktop.vue:7` and `:87-92`. This also fixes the touch problem.
- Do not add `pointerDownOutside`, `escapeKeyDown`, `interactOutside`, or `focusOutside` emits; no other overlay has them.

## INP-Q16 — What changes when Rating's default size becomes `sm`?

**Decision.** "set default value of size prop to "sm"" (2026-09-14).

**Short answer.** A Rating with no `size` gets 16px stars instead of 20px, so a 5-star row goes from 108px to 88px wide. Only 3 v1-app sites and 0 v0 sites leave out `size`. It is a small runtime break: the PR title needs `!`, and a codemod is not worth building. Every other input already defaults to `sm`, and `sm` is also the invalid-size fallback.

**Facts.**

- Size map (`src/components/Rating/Rating.vue:197-202`): xs 14px, sm 16px, md 20px, lg 24px. The gap is 2px at every size (`:20`). Labels stay 13px, so only the stars change.
- The default `size: 'md'` (`Rating.vue:146`) dates from the first commit, `6417c55534` "feat: rating" (2024-10-16), with no reason given. It was the middle of the old `sm|md|lg|xl` map.
- The `sm` fallback (`Rating.vue:205`) came in `3f69ae7a29` (2026-09-09). That commit says an invalid value "falls back to the component's own default", so Rating did not follow its own rule. The new default fixes that.
- Default `sm`: Button, TextInput, Select, Combobox, MultiSelect, Checkbox, Switch, Slider, RadioGroup, TabButtons, Textarea, FormControl, Password. DatePicker and TimePicker have no default and pass `undefined` to TextInput, which renders `sm`. Badge and Avatar default to `md`, but they are display components with their own scales. After the change, no input defaults to `md`.
- No written rule sets a family default size (PHILOSOPHY.md, CONTEXT.md, spec/ are silent).
- The docs playground already assumes `sm`: its knob defaults to `sm` (`Rating.playground.vue:22`) and its snippet leaves out `size` (`:38`), which renders `md` today.
- FormControl has no `type="rating"`.

**Sites that change.**

| Group | Omitted `size` (renders smaller) | Explicit `size="sm"` (now redundant) |
|---|---|---|
| frappe/ui | 1: `src/components/Fields/RatingField.vue:2` (renders every Rating field) | 0 |
| helpdesk | 1: `desk/src/components/view-controls/filter/FilterValueEditor.vue:93` | 1: `desk/src/pages/ticket/TicketFeedback.vue:33` |
| crm | 1: `frontend/src/components/ConditionsFilter/CFCondition.vue:265` (`h(Rating, …)`) | 0 |
| gameplan, builder, frappe_books, wiki | 0 | 0 |
| v0 (8 apps) | 0 | 0 |
| own | 11 story and docs uses; 23 of 25 Cypress mounts (none checks the default class) | 1: `stories/Sizes.vue:8` |

CRM's other rating fields use its own `Controls/RatingInput.vue`, and Helpdesk list cells use its own `StarRating.vue`. They do not change.

**What the PR must touch.**

- `Rating.vue:146`: `'md'` → `'sm'`.
- Regenerate `Rating.api.md` (`docs/scripts/propsgen.ts`); it says `default: '"md"'` at `:47`.
- Optional: `@default 'sm'` in the JSDoc at `types.ts:29`, and a Cypress test that an omitted size renders `size-4`.
- Changelog and migration notes list the 3 app sites. No spec file or story states `md`.

**Recommendation.** Ship the default change with the 3 sites in the migration notes and no codemod. This tree has no component-prop codemod, and a template codemod would miss CRM's `h(Rating, …)` call. The TabButtons question in the same migration row is about `variant`, not size (TabButtons already defaults to `sm`), so it stays open. The combined "38 / 9 / 44" count in `rc-migration-effort.md:83,177` counted Rating tags that pass a dynamic `size`, not tags that leave it out; the Rating part should use the counts above. The smaller stars were not checked in a rendered app.

## INP-Q2 — One empty value for Select and Combobox: `null` or `undefined`?

**Question.** "i'd like to keep empty value for Select, Combobox consistent, but unsure between undefined and null, which one is better? what does reka-ui do?" (2026-09-14).

**Short answer.** Use `null`. reka-ui 2.9.9 accepts both and treats them the same. `null` matches what Frappe returns for empty fields and survives a JSON request body; `undefined` is dropped from it. Select to `null` touches no app site found; Combobox to `undefined` would break one site and put type errors on about 20 `ref(null)` sites.

**What reka-ui does.**

- Every root takes `AcceptableValue = string | number | bigint | Record<string, any> | null` (`dist/index3.d.ts:231`). `null` is in the public type; `undefined` is allowed because the prop is optional.
- `isNullish` (`dist/shared/nullish.js`) treats `null` and `undefined` as empty. SelectRoot uses it to render the blank native `<option>` (`Select/SelectRoot.js:89`).
- Internally reka uses `undefined`: it is the unbound default in SelectRoot (`:75`), ComboboxRoot (`:111`), and ListboxRoot (`:97`); Listbox deselect, single ToggleGroup, and single Accordion reset to `undefined`; NumberField clears to `undefined` but its prop accepts `number | null`. The one place reka writes `null` is `ComboboxCancel` with `resetModelValueOnClear` (`Combobox/ComboboxCancel.js:30`).
- `SelectItem` and `ComboboxItem` throw on `''` as an item value. frappe-ui maps it in `useEmptyValueMapping.ts:17-34`.

**What frappe-ui does today.**

- Select: `defineModel<SelectOptionValue | undefined>()` with no default (`Select.vue:53`). reka Select never deselects, so the only empty emit is `clear()`, which sets `undefined` (`:208-210`).
- Combobox: `defineModel<ComboboxOptionValue | null>({ default: null })` (`Combobox.vue:90`). It already maps `null`/`undefined` to `undefined` for reka (`:161-162`) and sets `null` in `clear()` (`:252-255`), which also runs when the input is emptied (`:337`).
- Other inputs: `''` for DatePicker, DateTimePicker, TimePicker; `null` for Duration; `[]` for MultiSelect; `0` for Rating; `undefined` and never cleared for RadioGroup, Password, Slider.
- Frappe returns empty Link and Select fields as `None`, which is `null` in JSON (`frappe/model/base_document.py:576`, `:608-611`). Request bodies use `JSON.stringify` (`src/utils/request.ts:50`), which drops `undefined` keys, so `setValue({ status: undefined })` does not clear the field on the server.
- No mapping layer is needed. For Select, change `clear()`, the model default, and the types.

**Migration cost (grep only).**

| Group | Bound sites (Select / FC select / Combobox) | `=== null` or `=== undefined` on the model | `== null` | `ref(null)` init | Select `clear()` used |
|---|---|---|---|---|---|
| v1 | 50 / 56 / 41 | 0 | 2 (GP `TaskDetail.vue:337,342`) | Combobox 9, Select 1 | 0 |
| v0 | 30 / 50 / 24 | 1 (Combobox, `AddMemberDialog.vue:85`) | 0 | Combobox 9, FC select 1 | 0 |
| own | 35 / 4 / 20 | 0 | 0 | Combobox 2 | 2 stories |

Grep cannot see values passed through props or stores, or truthiness checks (safe for both). vue-tsc was not run. Some v1 `<Combobox>` tags are app-local wrappers, so those counts are upper bounds.

**Recommendation.** Use `null` for both. Type the prop as `string | number | null | undefined` so `ref()`, an unset model, and Frappe `null` all type-check, and emit only `null`. Update `spec/selection.md:52`.

## INP-Q12 — Is it okay for TextInput to emit a string when `type="number"`?

**Question.** "TextInput value was typed string | number because of type="number"? is it okay to emit string when type="number"?" (2026-09-14).

**Short answer.** Yes. TextInput has always emitted the native string, also for `type="number"`. `number` was added to the prop type only so callers could pass a number in. Callers who want a number back use `v-model.number`, which already works on the component.

**Facts.**

- TextInput emits `(e.target as HTMLInputElement).value` on `@input` and `@change` (`TextInput.vue:277-286`); debounce wraps the same function. The emit type is already `[value: string]` (`types.ts:30`); the prop is `string | number` (`types.ts:22`).
- `number` came in 4f618ce26f (2023-08-25, "fix: allow number type value to support text input type number"), which changed only the prop type.
- FormControl passes other types to TextInput with `type` unchanged (`FormControl.vue:95-97`, `:131-137`) and declares no `modelValue`, so `v-model.number` reaches TextInput.
- Vue 3.5.27 casts to a number for `v-model` on a native `<input type="number">` only (`runtime-dom.esm-bundler.js:1487`). On a component, `v-model.number` runs `looseToNumber` on the emitted value (`runtime-core.esm-bundler.js:4353`); an empty field stays `''`, not `NaN`.
- reka-ui NumberField: prop `number | null`, emit `number`, empty sets `undefined`.

**Usage.**

| Group | TextInput/FormControl `type="number"` sites | `v-model.number` on them |
|---|---|---|
| v1 | 13 static (CRM 5, HD 2, Wiki 2, Books 4) and 5 dynamic | 4 (CRM `EventNotifications.vue:44,104`, `CalendarSettings.vue:96,195`) |
| v0 | Insights: 25 FormControl, 5 old `Input`, about 5 config objects | 0 |
| own | 1 story, no binding | 0 |

Apps that need a number convert it themselves (`Number(e)`, `parseInt`, `safeParseFloat`) or use `v-model.number`. No sampled site depends on getting a number from the component.

**Recommendation.** Keep the prop `string | number`, keep emitting `string`, and document `v-model.number` for callers who want a number. That is today's behavior, so nothing breaks. Narrowing the prop to `string` (the picked option) changes nothing at runtime but adds type errors where a number is passed in, including the 4 CRM `v-model.number` sites and Books `:model-value="scale"`. Emitting a number would break `''` checks and force a choice of empty value; a real number input belongs in a separate NumberInput component. The DateRangePicker part of INP-Q12 is not affected. vue-tsc was not run for either option.

## INP-Q3 — What is TimePicker's `invalid-change` event, and is it needed?

**Question.** "what is invalid-change event and why is it needed?" (2026-09-14).

**Short answer.** It fires `true` when TimePicker rejects typed text, and `false` at the next good commit. The model does not change on rejection, so the event is the only way a parent learns that input was thrown away. Nobody listens to it, its state is unreliable, and no other picker has it. Research recommends removing it together with `input-invalid`.

**Facts.**

- Declared at `TimePicker/types.ts:79-80`: `input-invalid(input: string)` and `invalid-change(invalid: boolean)`.
- Text is invalid when `parseFlexibleTime` fails or the time is outside `min`/`max` (`TimePicker.vue:341-345`). The check runs only on blur (`:403-409`) and Enter (`:411-421`).
- On rejection (`:346-351`) it emits `input-invalid(raw)` and `invalid-change(true)`, puts the last good value back in the input, and emits no `update:modelValue`. `invalid-change(false)` fires from `commit()` (`:319-327`) or when the text equals the current value (`:335-339`).
- The event is the only signal. No slot prop, data attribute, or exposed value shows the state, and `aria-invalid` comes only from the `error` prop. A jsdom check: after typing `garbage` and pressing Enter, the input shows `08:00` and has no `aria-invalid`.
- Problems:
  1. The text is reverted, so the screen shows no error while the flag stays `true`.
  2. The flag is not reset when the parent changes `modelValue` (`:278-287`).
  3. `blurInput()` and `selectAll()` do nothing: they call `querySelector('input')` on the input itself (`:466-482`).
  4. If (3) is fixed, Enter would emit `true` and then `false` at once, because blur commits the reverted text (from reading the code, not run).
- DatePicker and DateTimePicker reset rejected text silently. Duration keeps the text and shows its own error message. DateTimePicker's inner TimePicker listens only to `@change`.
- Both events came with the first TimePicker (`caba181bea`, PR #398, 2025-09-01), when rejected text stayed visible, so the flag then matched the screen. The v1 refresh (`2dfac8284d`, PR #675) added the revert and left the events. `TimePicker.api.md:207-215` has no descriptions, and `spec/date-picker.md:470-478` still lists `open`/`close` and not `update:open`. No test covers the events.

**Usage.** `invalid-change` and `input-invalid`: 0 listeners in v1, v0, and own. `@open`/`@close` on TimePicker: 0 across 12 v1 tags (CRM 11, frappe/ui 1). The 2 CRM FormControl `type="time"` sites (`WorkDayModal.vue:26,40`) validate with `@blur` and `<ErrorMessage>`. That `@blur` lands on TimePicker's wrapper `<div>`, where blur does not bubble, so it probably never fires (not run).

**Recommendation.** Remove `input-invalid` and `invalid-change` too. The model never takes a bad value, so a form that saves stays safe without the event. If users need to see rejected input, add visible feedback later for all typed pickers at once (keep the text, show the error, set `aria-invalid`, as Duration does); that is additive. If `invalid-change` stays, it needs three fixes (reset on model change, Enter and blur order, docs), and the date pickers should get it too.

## INP-Q10 — Which data-slot does a picker input get when it is both a control and a trigger?

**Question.** "how will DatePicker handle this? it's input is a control that also triggers the datepicker overlay?" (2026-09-14).

**Short answer.** All four pickers already render `<input data-slot="control">` through TextInput, and they have no separate trigger element. Keep `control`. Define `trigger` as the selection family's name for its box, not as "anything that opens a panel".

**Facts.**

- TextInput renders `<input data-slot="control">` (`TextInput.vue:33-50`).
- DatePicker, DateRangePicker, and DateTimePicker use `PickerShell.vue`: a reka `PopoverAnchor` `<div>` with no data-slot, then TextInput's input. The chevron is an SVG with `@mousedown` (`:29-35`), not a focusable button. The panel opens on click or focus of the input (`:198-208`) and on ArrowDown (`:223-226`). TimePicker has the same shape (`TimePicker.vue:1-51`).
- With `typeable=false`, the same `<input>` gets `readonly`; it never becomes a button. A custom `#trigger` slot replaces the input and gets no data-slot.
- The picker input has no `role="combobox"`, `aria-haspopup`, or `aria-expanded`.
- Combobox input mode has two elements where a picker has one: the styled box is `trigger` (with open/closed `data-state`), the transparent input inside it is `input`, and the chevron button is `chevron` (`Combobox.vue:596-650`). Select and MultiSelect also use `trigger` for the box (`spec/selection.md:222-240`).
- reka's `DatePickerTrigger` is a separate button next to the field, and reka sets no data-slot. frappe-ui already uses `trigger` for an anchor box (Combobox), not for reka's Trigger part.
- `spec/inputs.md:608-620` gives `control` for input shells; `PHILOSOPHY.md:323` lets each family's spec set its own names. No spec has a picker rule.

**Usage.**

- frappe_books `Controls/Base.vue:106` styles `[data-slot=control]` (red border on required fields) and applies it to DatePicker and DateTimePicker. Renaming the picker slot breaks it.
- frappe/ui `Grid.vue:458-589` and helpdesk `EditCustomerDialog.vue:41` use `trigger` for selects only. GP and Builder use `label`.
- own: `SettingsRow.vue:37-38`, `Checkbox.vue:162`, and `Switch.vue:261` query `control` at runtime. Cypress: `trigger` 72, `input` 26, `control` 16, `label` 6, `chevron` 4. v0: 0.

**Recommendation.** Keep `control` on picker inputs. Spec sentence: "`data-slot="trigger"` is used only by the selection family (Select, Combobox, MultiSelect) for the box that shows the chosen option; every other input, including DatePicker, DateRangePicker, DateTimePicker, and TimePicker, marks its main interactive element `data-slot="control"`, even when that element also opens a panel." Additive follow-ups: `aria-haspopup` and `aria-expanded` on the picker input (this fixes the accessibility gap and gives styles an open-state hook), and `data-slot="chevron"` on the picker chevron.

## INP-Q8 — What must change for FormControl date and time routing?

**Short answer.** Nothing for routing: the decision already describes the code, since v1.0.0-beta.1. The prop-forwarding half still has one bug: `variant` reaches Checkbox as a DOM attribute.

**Facts.**

- `FormControl.vue:76-99`: `date` → DatePicker, `daterange` → DateRangePicker, `datetime` → DateTimePicker, `time` → TimePicker. Everything else, including `datetime-local`, goes to TextInput with `type` forwarded (`:136-152`). This came in `1716ffa333` (2026-05-16).
- TextInput already accepts `date`, `time`, `datetime-local`, `month`, and `week` (`src/components/types/TextInput.ts:1-15`), and `TextInput/stories/Types.vue:10,14` shows them. `FormControl.md:30` already documents the native-input path.
- `FormControlProps.type` (`types.ts:22-32`) lists `'date'` and `'time'` twice (inside `TextInputTypes` and on their own). The type works, but the JSDoc (`:12-21`) does not say these go to pickers.
- FormControl always forwards `variant` (`:130`, default `'subtle'` at `:43`). Checkbox has no `variant` prop, so jsdom shows `<div class="flex-col inline-flex" variant="subtle">`.

**What must change.** Stop forwarding `variant` for `type="checkbox"`. Optional: one JSDoc line on `type` saying `date` and `time` render pickers and native inputs use `<TextInput type="date|time">`. Close the audit finding "native date/time unreachable" as intended.

**Usage.** v1: CRM `WorkDayModal.vue:26,40` (`time`), `LeadSyncSourceForm.vue:103` (`datetime`), and `FormBuilderPanel.vue:594` (dynamic). All v1 apps are on beta.1 or later, so no site changes. v0: 3 `type="date"` sites (`TodoDetail.vue` in todos, codeoff, build2026) get DatePicker on upgrade; the value is still a `YYYY-MM-DD` string. Dynamic `:type` values in v0 and helpdesk were not checked.

## NAV-Q7 — Can SidebarItem rename `to` to `route` today?

**Short answer.** Yes. VOC-Q1 already decided the rename; the app cost is 4 committed sites, all template attributes a codemod can rename. No alias is needed.

**Facts.**

- `to?: RouteLocationRaw` is declared at `src/components/Sidebar/types.ts:52`. SidebarItem has no `route` or `href`. `SidebarItem.vue:22` picks a link when `to` is set; `:166-171` renders `RouterLink`, or a plain `<a href>` when there is no router and `to` is a string; `:175` resolves `to` for active-state inference.
- Own tree: docs `Sidebar.md:38-39`, `Sidebar.api.md:79,86`, tests `Sidebar.cy.ts:124,126,161,175`, and the example in `docs/content/docs/migration.md:1319,1328-1329`.
- SidebarRailItem (`SidebarRail/types.ts:24`) and MobileNavItem (`MobileNav/types.ts:25`) have the same `to` prop.

**App sites** (bench checkouts; every app pins a beta that already has SidebarItem `to`):

| App | Site |
|---|---|
| GP | `frontend/src/components/AppSidebar.vue:44` `:to="{ name: 'Space', ... }"` |
| CRM | `frontend/src/components/Layouts/AppSidebar.vue:28` and `:80` `:to="link.to"` |
| Wiki | `frontend/src/components/Sidebar.vue:19` `:to="item.to"` (plus 2 in the untracked `src/proto/LibrarySidebar.vue:21,30`) |

- No site passes `to` through `v-bind` spreads, wrapper components, or `SidebarItemProps`. The `to:` keys in CRM and Wiki item arrays are app data and can keep their names.
- Helpdesk, Builder, and Books use SidebarItem with `@click` only. frappe/ui and the v0 apps do not use the Sidebar family.
- `rc-migration-effort.md:125` shows CRM 0; the 2 CRM sites were added in CRM commit 02838e56 (2026-07-28).

**What the PR must do.** Rename `to` to `route` on SidebarItem, SidebarRailItem, and MobileNavItem together. Add `href` for external URLs, since today a string `to` with no router becomes an `<a href>`. The codemod must match only these tags (not `Teleport to=`) and handle import aliases such as Books' `FrappeSidebarItem`.

## NAV-Q9 — Should TabButtons and Tabs share one "current tab" slot prop?

**Short answer.** Yes. Research recommends `active` for both, not `selected`. No app uses either slot prop today.

**Facts.**

- TabButtons `#prefix` and `#suffix` pass `{ button, checked, disabled }` (`TabButtons.vue:382-397`, `types.ts:52-57`). `checked` comes from reka's `RadioGroupItem`. The button renders `data-state="checked|unchecked"` (`:348`), but the inner Pill gets `:active` and renders `data-state="active|inactive"` (`shared/tabs/Pill.vue:111`).
- TabTrigger slots and the Tabs shorthand `#tab-prefix`, `#tab-label`, `#tab-suffix` pass `{ selected, disabled }` (`TabTrigger.vue:82-87`, `Tabs.vue:32-43`, `types.ts:69`). reka's TabsTrigger passes no slot props, so `selected` is our own choice. The trigger renders `data-state="active|inactive"`.
- `PHILOSOPHY.md:216` (P7) says tab and accordion slots use `{ active }`. X5 accepted aligning slot props with P7.
- Elsewhere, `active` means the current item (MobileNavItem `{ active }` with `data-state="active|inactive"`; SidebarItem and SidebarRailItem `active`), and `selected` means an option in a picker or list model (Select, Combobox, MultiSelect, Menu; ListRow `data-state="selected"`). OVR-Q2 uses `selected|unselected` for collection rows.

**Usage.** 0 app sites use TabButtons `checked` or Tabs `selected` on the current API. The only TabButtons slot in the apps is `gameplan Discussions.vue:43` `#suffix="{ button }"`. 16 references in 6 CRM and Helpdesk files use the removed v0 `#tab-item="{ tab, selected }"`; those templates are rewritten on upgrade anyway. Own tree: about 12 lines (`TabButtons/types.ts:54,56`, `TabButtons.vue:386,394`, `Tabs/types.ts:69`, `TabTrigger.vue:85`, `Tabs.cy.ts:42-46`, `Tabs.md:68`, `spec/tabs.md:183-188,233-235`, `migration.md:1381`) plus generated api.md files.

**Options.**

- `active` on both: matches P7, the new `data-state`, and Pill. 0 app sites. The PR title needs `!`. No deprecated alias (ADR-0008).
- `selected` on both: makes the pair consistent but goes against P7 and OVR-Q2.
- Keep `checked` and `selected`: both stay off P7.

Side note: Select, Combobox, MultiSelect, and Menu options pass `selected` but render `data-state="checked"`. That mismatch is outside NAV-Q9.

## SHELL-Q1 — Should DesktopShell stop wrapping pages in ScrollArea, so apps compose it?

**Short answer.** No. Keep the ScrollArea inside DesktopShell and keep the `scroll` prop (H15). Removing it breaks Gameplan's scroll code, needs a new way to find the scroll element, and saves one prop.

**Facts.**

- DesktopShell renders a flex row: `#rail`, `#sidebar`, then a content column with `overflow-hidden` (`DesktopShell.vue:2-8`). `PageHeaderTarget` sits above the scroll area, so the header does not scroll (`:11`).
- `scroll` true (default): the page goes inside `<ScrollArea class="min-h-0 flex-1">` (`:18-20`), and a watcher registers its viewport for `useShellScrolled` (`:66-89`).
- `scroll` false: the page goes in a plain `flex min-h-0 flex-1 flex-col overflow-hidden` div (`:29-31`). Nothing registers, so `useShellScrolled` stays `false` and warns once in development (`useShellScrolled.ts:35-37,105-115`).
- MobileShell does not use ScrollArea. It has a native `overflow-y-auto` div (`MobileShell.vue:17-20`) that registers on mount (`:46-49`).
- PageHeader click-to-top does not use the registry. It walks up to the nearest scrolling parent (`PageHeaderBase.vue:41-55`), so it works with any container.
- `scroll` was added in `5d714a6a6a` (2026-07-05) because the default ScrollArea competed with pages that scroll their own panes (boards, split panes).

**Usage.**

- 2 DesktopShell and 2 MobileShell uses: GP `DesktopLayout.vue:5`, `MobileLayout.vue:2`; Wiki `MainLayout.vue:5,35`. No app passes `scroll`. `rc-migration-effort.md:101` shows 0 DesktopShell sites; the real number is 2.
- Wiki needs `:scroll="false"` and does not use it. Its pages scroll their own panes, and `MainLayout.vue:133-142` forces the ScrollArea viewport to full height with CSS instead. Wiki adopted the shells one day before the prop existed.
- GP depends on the shell owning the scroll element: 1 `useShellScrolled` call (`DiscussionView.vue:400`) and 12 `shellScrollContainer` uses (`router.ts:724,730`, `CommentsArea.vue:701-749`, `CommentsList.vue:356,364`, `DiscussionView.vue:401,446`, `ProfileBentoEditorPanel.vue:232`, `useProfileBentoDrag.ts:171`). `MobileNavItem.vue:126` uses it for tap-to-top.
- Docs recipes: 9 DesktopShells, 2 with `:scroll="false"` (`MailDesktop.vue:473`, `DealsDesktop.vue:440`).

**What composing would look like.**

```vue
<!-- page-wide scroll -->
<DesktopShell><Page /></DesktopShell>                                           <!-- shell owns -->
<DesktopShell><ScrollArea class="min-h-0 flex-1"><Page /></ScrollArea></DesktopShell> <!-- composed -->

<!-- split panes -->
<DesktopShell :scroll="false"><List /><Detail /></DesktopShell>  <!-- shell owns -->
<DesktopShell><List /><Detail /></DesktopShell>                  <!-- composed -->
```

If apps compose it, these break or need new wiring:

- `useShellScrolled`, `shellScrollContainer`, and MobileNavItem tap-to-top need to find the scroll element. A `data-slot` query has no owner, which is the problem SHELL-Q3 fixes. If every ScrollArea registered itself, sidebar and dialog ScrollAreas would be picked up too, so ScrollArea would need a flag such as `<ScrollArea shell>`: the same prop in a different place. SHELL-Q3 option 1 is simplest when the shell provides an element it renders itself.
- Every app must remember `min-h-0 flex-1`, or the content is clipped by the `overflow-hidden` column.
- DesktopShell would compose while MobileShell keeps its own scroll, so the two shells would differ.

**Cost.** Keep: 0 sites. Add a docs line on when to pass `:scroll="false"`; Wiki can then pass it and delete `MainLayout.vue:133-142`. Remove: 2 app shells, 9 recipes, the story, and `DesktopShell.cy.ts:32`. A codemod can wrap the default slot, but it cannot rewire GP's 13 scroll-element uses, and the default layout changes silently, so the PR title needs `!`.

## SHELL-Q4 — Are there really no `viewportClass` callers?

**Short answer.** There are callers. Apps have 10 sites (9 committed), all on frappe-ui's own `ScrollArea` imported from `'frappe-ui'`. The H14 count of 7 missed Builder and Books.

| App | Site | Value |
|---|---|---|
| GP | `frontend/src/components/AppSidebar.vue:13` | `px-2 pt-0.5 pb-10` |
| GP | `frontend/src/pages/Onboarding.vue:83` | `isolate bg-surface-base` |
| GP | `frontend/src/pages/Configure/AddCommunityMembersDialog.vue:58` | `px-2 py-2` |
| GP | `frontend/src/components/AppRail/CustomizeSidebarDialog.vue:15` | `px-4 py-3` |
| GP | `frontend/src/components/UnsplashPicker/UnsplashPicker.vue:71` | `pr-3` |
| GP | `frontend/src/components/ProfileBento/ProfileBentoEditorPanel.vue:20` | `px-2 py-6` |
| HD | `desk/src/components/layouts/AppSidebar.vue:11` | `px-2` |
| Builder | `frontend/src/components/DashboardSidebar.vue:5` | `px-2 pt-0.5 pb-2` |
| Books | `frontend/src/components/QuickView.vue:23` (as `FrappeScrollArea`) | `py-1` |
| Books | `frontend/src/pages/ChartOfAccounts.vue:20` (uncommitted, branch `codex/frappe-ui-sqlite-port`) | `p-4` |

Raven's `viewportClassName` is a prop on its own React component and does not count.

**Own tree.** `ScrollArea.vue:10`, `types.ts:7`, generated `ScrollArea.api.md:23`; callers `SettingsDialog/SettingsBody.vue:6` and `Sidebar/stories/Default.vue:76`; 9 docs recipes (`DiscussionsDesktop:596`, `TasksDesktop:836`, `MailDesktop:487,609`, `FilesDesktop:548`, `TicketsDesktop:329`, `DealsDesktop:453`, `AccountingDesktop:380`, `AccountingMobile:315`).

**Replacement.** reka renders the viewport as a direct child of the root, so each value moves into a child selector on the ScrollArea's own class:

```vue
<!-- before --> <ScrollArea viewport-class="px-2" />
<!-- after  --> <ScrollArea class="[&>[data-slot=scroll-area-viewport]]:px-2" />
```

Each utility needs the prefix. In CSS: `.x > [data-slot='scroll-area-viewport'] { padding-inline: .5rem }`, wrapped in `:deep()` in scoped styles. The `>` keeps the rule off nested ScrollAreas. For static class strings a codemod can write this Tailwind form; dynamic bindings need a manual edit.

## SHELL-Q6 — What is the use case for composing with ScrollBar? Do apps do it?

**Short answer.** No use case is left, and no app uses it. Making it internal breaks 0 app sites.

**Facts.**

- Gameplan had a local `ScrollBar.vue` (GP `5b52b2e4`, 2025-03-28), used inside hand-built reka `ScrollAreaRoot`/`ScrollAreaViewport` markup. frappe-ui took the file over and exported it next to ScrollArea in `49d2a14efe` ("Add a reusable ScrollArea/ScrollBar").
- Its one real caller was GP `ScrollContainer.vue`, which kept raw reka parts because it needed `id="scrollContainer"` on the viewport (GP `80d0d440`). GP `6c028a83` (2026-07-03) deleted that file when GP moved to DesktopShell.
- `ScrollBar` calls `injectScrollAreaRootContext()` (`ScrollBar.vue:44`), so it works only inside reka's `ScrollAreaRoot`, which frappe-ui does not export. An app would have to import reka-ui directly.
- Own tree: used only by `ScrollArea.vue:14-18`. Docs: `ScrollArea.md:20-24` already says it is "not something apps mount on its own"; `ScrollArea.api.md:57-59` has a props table.
- Apps: 0 imports, 0 `<ScrollBar>` or `<scroll-bar>` tags. `gameplan-settings-exploration` has its own local copy.

**What the PR must do.** Remove `ScrollBar` from `ScrollArea/index.ts:2` and the root, delete the docs paragraph and the props table. PR title needs `!`.

## SHELL-Q7 — Why is `useSheetDrag` exported?

**Short answer.** The commit that added it exported it because the gesture seemed general ("generic to any surface you can drag away"). Nothing outside BottomSheet uses it. Removing it from the root is safe.

**Facts.**

- Added in `ffd9589266` (2026-08-06, "feat(composables): add useSheetDrag for drag-to-dismiss surfaces", PR #925) with `export *` in `src/index.ts`. `df66056eed` (#956) changed that to a named export (`src/index.ts:141-145`).
- Only caller: `BottomSheet.vue:67,125`, by relative path.
- Docs: `BottomSheet.md:40-41` says it is "exported from the package root if you need the same behaviour on a surface of your own". No other page mentions it.
- Its thresholds are fixed module constants (25 percent close ratio, 0.5 px/ms velocity; `useSheetDrag.ts:11-24`).
- It reads a consumer opt-out attribute, `data-no-sheet-drag` (`useSheetDrag.ts:31,210`). It is not documented. See SHELL-Q9.
- Apps: 0 uses, v0 included.

**Options.**

1. Make it internal: remove it from `src/index.ts:141-145` and delete `BottomSheet.md:40-41`. PR title needs `!`; 0 sites. It can be exported again when a second surface needs it. This matches SHELL-Q6.
2. Move it to `frappe-ui/experimental` (the triage plan, `rc-migration-effort.md:66`).
3. Keep it at the root and document it.

**Recommendation.** Option 1.

## SHELL-Q9 — Which data attributes does a `data-fui-` prefix rule cover?

**Short answer.** Taken literally, "any public data attr" covers `data-slot`, `data-state`, and the other styling hooks, about 200 own sites and about 120 app sites, and it cannot apply to attributes set by reka-ui. The rule should cover only attributes that apps add to their own markup for frappe-ui to read. Two exist today, and neither is used by an app.

**Attributes an app adds for frappe-ui to read.**

| Attribute | Read at | App sites | Rename |
|---|---|---:|---|
| `data-no-scroll-top` | `PageHeaderBase.vue:33`; docs `PageHeader.md:10` | 0 | `data-fui-no-scroll-top` |
| `data-no-sheet-drag` | `useSheetDrag.ts:31,210`; not documented | 0 | `data-fui-no-sheet-drag`, and document it on BottomSheet |

The only other hit is a local copy of the selector in `gameplan-settings-exploration/.../PageHeaderShell.vue:37`, which is not a v1-track app.

**Attributes the rule must not rename.**

- Styling hooks frappe-ui sets: `data-slot` (about 200 own sites), `data-state` (about 54), `data-disabled`, `data-size`, `data-variant`, `data-motion`, `data-invalid`, `data-required`, `data-loading`, `data-color`, and a few others. App styling uses `data-slot` (GP 30, CRM 2, HD 19, Builder 3, Books 10, Wiki 5, frappe/ui 47) and `data-state` (HD 9, Wiki 7, frappe/ui 9, GP 1). P10 (`PHILOSOPHY.md:309-323`) names these hooks and sets no prefix.
- Attributes set by dependencies: reka-ui (`data-state` on overlay parts, `data-disabled`, `data-highlighted`, `data-side`, `data-align`, `data-orientation`, `data-placeholder`) and vue-sonner (`data-sonner-toast`, `data-mounted`, `data-expanded`, `data-front`).
- `data-theme` on `<html>`: frappe-ui sets and reads it, and apps style against it (GP 5, CRM 8, HD 32, Builder 17, Wiki 27, frappe/ui 6).
- Editor content attributes parsed from saved HTML (`data-float`, `data-align`, `data-id`, `data-label`, `data-tag-id`, `data-toc-id`, `data-columns`, `data-interactive`, legacy `data-color`). Renaming them breaks stored documents.

No `data-fui-` attribute exists anywhere today.

**Proposed wording for P10.** "An attribute that an app adds to its own markup for frappe-ui to read starts with `data-fui-`. This does not apply to the styling hooks frappe-ui sets (`data-slot`, `data-state`, `data-color`, and the rest of this list), attributes set by dependencies, `data-theme`, or attributes stored in editor content."

## SHELL-Q10 — What changes when `useShellScrolled` requires `threshold`?

**Short answer.** 0 app changes. The one app call already passes it. Our tests and several docs lines call it with no argument.

**Facts.**

- Apps: 1 call, GP `DiscussionView.vue:400`, `useShellScrolled({ threshold: scrollToTopThreshold })` with 200 (`:397`).
- Own tree with `threshold: 12`: `useShellScrolled.ts:67` (JSDoc), `DesktopShell.md:29`, `docs/content/docs/other/composables.md:102`, `migration.md:2528`, `changelog.md:2138`.
- Tests with no argument: `useShellScrolled.spec.ts:61`, and `mountScrolled()` at `:163` (the test "defaults the threshold to 200", to delete), `:200`, `:201`, `:217`.
- Text that shows `useShellScrolled()` with no argument: `DesktopShell.vue:16`, `DesktopShell.md:20`, `MobileShell.md:20`, `migration.md:2521`, `changelog.md:2145`.
- It is a type break and a runtime change. `useShellScrolled()` throws when it destructures `undefined`. `useShellScrolled({})` gives `scrollTop > undefined`, which is always `false`, with no warning.

**What the PR must do.** Signature `useShellScrolled(options: { threshold: number })`, the same required-options-object form as `useSheetDrag` and `useTouchHandler`. Add a development warning when `threshold` is missing or not a number. Update the tests and the docs lines above. PR title needs `!`.

## SHELL-Q11 — Is `resolvedColorScheme` imported only by charts?

**Short answer.** Charts are the only importer inside `src/`, but Wiki and two docs recipes import it from `'frappe-ui'`. Removing the root export breaks them, and `useColorScheme()` has no replacement today.

**Facts.**

- Defined at `useColorScheme.ts:54`. Root exports: the function at `src/index.ts:133` and the type `ResolvedColorScheme` at `:135`. Not in `experimental.ts`.
- Charts import it by relative path: `src/charts/tokens.ts:3`, called at `:217`.
- Docs recipes import it from `'frappe-ui'`: `docs/components/recipes/ComposeDesktop.vue:10,92,139` and `ComposeMobile.vue:8,91,138`.
- Text to change: `migration.md:2485` (maps `getSystemTheme()` to `resolvedColorScheme()`), `changelog.md:740`, `skills/frappe-ui/CORE.md:63,68`.
- `useColorScheme()` returns only `colorScheme` (the saved preference), `setColorScheme`, and `toggleColorScheme`. It has no resolved value.

**Wiki, 3 sites, all in `frontend/src/composables/useTheme.js`.** `:1` imports it; `:28` sets `resolvedTheme = ref(resolvedColorScheme())`; `:32` re-reads it in a `MutationObserver` on `data-theme`. `resolvedTheme` picks the sun or moon icon (`:43`). Wiki's `toggleTheme` flips the resolved scheme (`:51`) because `toggleColorScheme` does nothing visible when the preference is `system` and the OS is dark; SHELL-Q12 fixes that.

**Options.**

1. Add a read-only `resolvedColorScheme: Readonly<Ref<'light' | 'dark'>>` to what `useColorScheme()` returns, and keep the `ResolvedColorScheme` type exported. This is additive. Wiki and both recipes switch to it and delete their `MutationObserver`s. Wiki's own toggle can use `toggleColorScheme` after SHELL-Q12.
2. No replacement. Wiki and the recipes copy the 6-line read of `data-theme`, the `dark` class, and `matchMedia`.

Either way the PR title needs `!`, and a codemod cannot move a function call to a ref. **Recommendation.** Option 1: the rename becomes an internal detail, and apps get a reactive value, which is what Wiki built by hand.

**Follow-up: how is `colorScheme` different from a resolved value?** (2026-09-14)

`colorScheme` (`useColorScheme.ts:28,36`) is the saved preference: `'light' | 'dark' | 'system'`. A resolved value is what the page shows: `'light' | 'dark'`. They differ in three cases:

| Situation | `colorScheme` | Resolved |
|---|---|---|
| Preference `system`, OS dark | `'system'` | `'dark'` |
| Preference `system`, user switches the OS to light | stays `'system'`, no change to watch | becomes `'light'` |
| App sets `data-theme` or the `dark` class itself, without `setColorScheme` | stale (`'light'` default, `:28`) | read from the document (`:54-61`) |

- When the OS setting changes, only `data-theme` is rewritten (`:113-117`); `currentScheme` does not change. A `computed` over `colorScheme` cannot follow it.
- Wiki needs the resolved value to pick the sun or moon icon. With `colorScheme` alone, `'system'` gives no answer. Wiki's comment says the same (`wiki/frontend/src/composables/useTheme.js:23-27`), and it watches `data-theme` with a `MutationObserver` for that reason.
- A resolved ref would be a module-level `ref` updated in `applyColorScheme` (`:67-75`), which already runs on every set and on every OS change. It does not need a `MutationObserver`, unless it must also follow apps that write `data-theme` themselves.

## ED-Q3 — Do we need StarterKit? Why does it exist? Does anyone use it?

**Short answer.** Yes, keep it. `CommentKit` and `RichTextKit` are built on it. No app imports frappe-ui's `StarterKit` directly, but crm and suite configure it through the kits' `starterKit:` key, and suite needs that key for collaboration. Removing all configuration (the ED-Q3 pick) breaks both apps. Recommendation: remove only the dead keys, with two type fixes.

**What it is.** A custom extension `frappeStarterKit` (`src/molecules/editor/extensions.ts:139-172`). Members: bold, blockquote, bulletList, document, dropcursor (frappe-styled), gapcursor, hardBreak, heading, undoRedo, horizontalRule, italic, listItem, listKeymap, orderedList, `ListJoin`, paragraph, strike, text, underline, trailingNode, and `HeadingIds` when headings are on (`:169`). Compared with `@tiptap/starter-kit`, it never adds link, code, or codeBlock, so frappe's own `Link`, `Code`, and `CodeBlock` do not register twice. Each member takes `Partial<Options> | false`; `document`, `gapcursor`, `listJoin`, and `text` take only `false` (`:94-118`). Exported from `frappe-ui/editor` only (`src/molecules/editor/index.ts:36`), not from the root.

**Why it exists.** PR #718 (`0d90d49b3a`) re-exported TipTap's kit. PR #765 (`4fd4731b7d`, merged 2026-06-08) replaced it with the custom kit so that "link/code/codeBlock can never double-register with our replacements", and added `HeadingIds`. The keys `code`, `codeBlock`, and `link` were kept as `false`-only so old `{ link: false }` calls still compiled; they have done nothing since. ADR-0004 point 3 (`spec/adr/0004-editor-family-composition-model.md:60`) names it as one of the four kits; `spec/editor.md:56,89,118,222,228` export it, use `[StarterKit]` as the minimal setup, and ask for the kits' `starterKit` passthrough.

**Two things the audit missed.**

- `code` is not dead in `InlineKit`: `kits.ts:295` reads `starterKit.code !== false` to drop `Code`. Deleting `code` from the shared type removes InlineKit's only way to turn off `Code`.
- `heading` is dead inside the kits' `starterKit:` key: `starterKitBase` spreads `starter` and then overwrites `heading` with the top-level `heading` member (`kits.ts:81-84`).

**Use in frappe-ui.** `CommentKit` and `RichTextKit` (`kits.ts:75-88`); `InlineKit` reuses only its option type (`kits.ts:258`). Docs `docs/content/docs/molecules/editor.md:133,141,145` (`:141` wrongly says StarterKit ships `link`, `code`, `codeBlock`). Story `stories/Primitives.vue:37-42` uses the dead `link: false`. Tests: `Editor.test.ts`, `kits.test.ts`, `useEditor.test.ts:137`, `list-join.test.ts:257,290,379` (`listJoin: false`, `orderedList: false`).

**Use in apps.**

- Direct imports of frappe-ui's `StarterKit` or `StarterKitOptions`: **0**. Every `StarterKit` import in builder, wiki, raven, helpdesk, and suite is TipTap's `@tiptap/starter-kit`. The H26 count of 1 site (wiki `wiki-starterkit.js:22-23`) is TipTap's kit, so the real count is 0.
- `starterKit:` key through `RichTextKit`: **2 sites**.
  - crm `frontend/src/components/editor/config.ts:44,52` passes it through; `EmailEditor.vue:262` sets `starterKit: { paragraph: false }` to add its own `CustomParagraph`.
  - suite `frontend/src/apps/writer/components/CoreEditor.vue:215-220` sets `trailingNode`, `paragraph: false`, `gapcursor: false`, and `undoRedo: false` under Y.js collaboration. `useEditor.ts:52` does not remove `UndoRedo` for collaboration, so this key is the only way.
- Apps on the v1 kits: gameplan, crm, helpdesk, frappe (`ComposerEditor.vue`), insights (`DashboardText.vue`), suite, wiki (prototype only). Builder, raven, and books do not use the frappe-ui editor.

**Options.**

| Option | App sites that break | Own tree | ED-Q4 effect |
|---|---|---|---|
| (a) Remove `code`, `codeBlock`, `link` from the shared type | 0 | `Primitives.vue:42`, `editor.md:141` (both already wrong) | Unchanged; InlineKit needs its own `starterKit` type that keeps `code` |
| (b) Remove all configuration, fixed defaults only (the pick) | 2 (crm, suite) | `list-join.test.ts`; contradicts ADR-0004 point 3 and `spec/editor.md:222` | InlineKit object question goes away |
| (c) Stop exporting, kit key takes only `false` | 2 (crm, suite) | tests, Primitives story and docs section, spec, ADR-0004, `CONTEXT.md:185` | Same as (b) |
| (c′) Stop exporting, keep object passthrough | 0 | Same own-tree set as (c); `StarterKitOptions` must stay exported | Unchanged |

(b) and (c) remove the only way to turn off `UndoRedo` under collaboration and to replace the paragraph node. (c) and (c′) remove the only frappe-ui base for editors built by hand; `useEditor` has no default extensions.

**Recommendation: (a) plus two type fixes.** (1) `InlineKit` gets its own `starterKit` type listing only the keys it reads: bold, italic, strike, underline, code, dropcursor, gapcursor, undoRedo. (2) The `starterKit` key on `CommentKit` and `RichTextKit` is typed `Omit<StarterKitOptions, 'heading'>`, because the top-level `heading` member wins. Correct `editor.md:141` and `Primitives.vue:37-42`. No app breaks, nothing is renamed, and every accepted key does something.

**Follow-up (2026-09-14).** The maintainer: "yes". Recommendation (a) with the two type fixes is decided.

## ED-Q5 — How many call sites does the `nodeView` / `listComponent` rename touch?

**Short answer.** 2 app sites, not 0: gameplan 1 and helpdesk 1. Own tree: 10 declaration or implementation sites in 4 files, and 8 callers. Neither app break shows up at runtime as an error, so the PR adds a development warning for the old key.

**Correction to the page.** The public list field is `SuggestionExtension.configure({ component })` at `src/molecules/editor/SuggestionExtension.ts:17`. `createSuggestionExtension` (`extensions/suggestion/createSuggestionExtension.ts:60`) is internal and not exported from `frappe-ui/editor`. The rename must cover both, or the public API keeps `component`.

**Own tree.**

| Kind | Sites |
|---|---|
| Declarations and reads → `listComponent` | `SuggestionExtension.ts:17,60,63`; `createSuggestionExtension.ts:60,114` |
| Declarations and reads → `nodeView` | `mention/mention-extension.ts:192,199,204`; `kits.ts:58` (`MentionMember`) |
| Delete | `mention/mention-extension.ts:49` (`component: undefined`, never read) |
| Callers → `listComponent` | `mention-extension.ts:153`, `tag/tag-extension.ts:116`, `emoji/emoji-extension.ts:53`, `slash-commands/slash-commands-extension.ts:193`, `shared/suggestion-open.test.ts:100`, `useEditor.test.ts:152`, `spec/editor.md:356` |
| Callers → `nodeView` | `docs/content/docs/migration.md:2041` |

Stories, `skills/`, and the docs recipes pass no `component`. Out of scope: the parked v0 editor in `experimental/TextEditor/` uses the same field names; leave it.

**Apps.**

| App | Site | Edit | How it fails if missed |
|---|---|---|---|
| gameplan | `frontend/src/components/editor/config.ts:45` `mention: { component: TextEditorMentionComponent }` | `nodeView` | Passed through a spread, so no type error; the old key is ignored and mentions stop using the app's component |
| helpdesk | `desk/src/tiptap-extensions.ts:80` `SuggestionExtension.configure({ component: FieldAutocompleteList })` | `listComponent` | Type-check catches it; at runtime the `{{` popup no longer opens |

frappe, crm, wiki, insights: 0 (they pass only `items`, or no suggestion config). suite: 0 for v1; `mail/utils/mentionSuggestion.ts:75` uses the v0 `createSuggestionExtension` from `frappe-ui/experimental`, which does not change. builder, books, raven: do not use the frappe-ui editor.

**Codemod or manual.** Manual. The two app sites use different keys in different shapes, so a codemod would need context to tell them apart. The PR adds a migration note, a development warning when `component` is still passed to `Mention`, the `mention:` kit member, or `SuggestionExtension.configure`, and follow-up edits in gameplan and helpdesk. PR title needs `!`.

**TipTap names.** Neither `@tiptap/suggestion` (3.26.0) nor `@tiptap/extension-mention` has an option called `component`, `nodeView`, or `listComponent`. `nodeView` matches TipTap's own term (`addNodeView`, `VueNodeViewRenderer`) without being an existing option.

**Follow-up (2026-09-14).** The maintainer: "sure". The rename goes ahead, with the 2 app follow-ups.

## ED-Q4 — Typed kit keys and honored configuration, with examples

**Short answer.** Typing the kit keys breaks no app: all 7 kit setups in the apps compile unchanged under option A or B. The page is wrong about `slashCommands`: `{}` already gives the full built-in menu, so "require items" would break the default. The real `slashCommands` bug is that `{ items }` is silently ignored. Recommendation: option B, with an optional `items` that works.

**What the code does today.** `CustomMember = Record<string, any> | false` (`kits.ts:54`). RichTextKit has all 18 open keys, CommentKit 9, InlineKit only `placeholder`. `starterKit`, `heading`, `link`, `mention`, and `tag` are already typed.

| Key | Real options type | Key | Real options type |
|---|---|---|---|
| placeholder | `PlaceholderOptions` (TipTap) | iframe | `IframeOptions` (`iframe-extension.ts:24`) |
| image | `ImageExtensionOptions` (`image-extension.ts:30`) | toc | none; takes no options (`toc-node-extension.ts:14`) |
| imageGroup | `ImageGroupOptions` (`image-group-extension.ts:8`) | slashCommands | no named type; needs an owned narrow type |
| imageViewer | none; takes no options (`image-viewer-extension.ts:18`) | color | `ColorOptions` (`color-extension.ts:10`) |
| video | `VideoExtensionOptions` (`video-extension.ts:35`) | highlight | `HighlightOptions` (`highlight-extension.ts:8`) |
| attachment | `AttachmentExtensionOptions` (`attachment-extension.ts:36`) | typography | `TypographyOptions` (TipTap) |
| table | `TableOptions` (TipTap) | textAlign | `TextAlignOptions` (TipTap) |
| contentPaste | `ContentPasteOptions` (`content-paste-extension.ts:34`) | styleClipboard | `StyleClipboardOptions` (`copy-styles-extension.ts:25`) |
| emoji | no named type; needs an owned narrow type | taskList | `TaskListOptions` (TipTap) |

None of the 18 types is exported from `frappe-ui/editor` today. Exporting them is not needed for type-checking: once the kit types are fixed, `RichTextKitOptions['image']` names each one. Emoji and slashCommands reuse a factory type with an index signature (`createSuggestionExtension.ts:85`), so they need their own narrow type or typos still compile.

**Example 1: a misspelled option.**

```ts
RichTextKit.configure({ image: { uplaodFunction: upload } })
```

- Today: compiles and runs. TipTap keeps unknown keys and never reads them. The image falls back to the `<Editor>` upload function; with none, uploads fail with no hint.
- After A or B: compile error, "`uplaodFunction` does not exist in type `Partial<ImageExtensionOptions>`. Did you mean `uploadFunction`?"

**Example 2: `slashCommands`.**

```ts
RichTextKit.configure({ slashCommands: {} })                  // today: full built-in menu
RichTextKit.configure({ slashCommands: { items: myCommands } }) // today: compiles, ignored
```

- `{}` is the kit default (`kits.ts:218`) and shows the built-in list (`slash-commands-extension.ts:51,167-178`). `spec/editor.md:218` and `rc-medium-triage.md:185` say it is inert until given items; that is true for `mention` and `tag`, not for `slashCommands`.
- `{ items }` does nothing. The only working path is the undocumented `{ suggestion: { items } }`. Gameplan works around it with `SlashCommands.extend` (`collapsible-menu.ts:55`).
- A as written ("require items"): `slashCommands: {}` and the kit default stop compiling. A break for no benefit.
- A or B with optional `items`: `{}` keeps the built-in list, `{ items }` works, `{ itmes }` is a compile error. Additive.

**Example 3: `InlineKit.starterKit`.**

```ts
InlineKit.configure({ starterKit: { bold: { HTMLAttributes: { class: 'x' } } } })
InlineKit.configure({ starterKit: { heading: false } })
```

- Today: both compile. `kits.ts:291-298` checks only `!== false` on 8 keys (bold, italic, strike, underline, code, dropcursor, gapcursor, undoRedo). The bold settings are ignored. InlineKit has no heading, so `heading: false` does nothing.
- After A: the object is passed to `Bold.configure(...)`, so the class is applied. InlineKit still needs its own 8-key type, or `heading` keeps compiling.
- After B: the type is `{ bold?: false, italic?: false, … the 8 keys } | false`. Object values and other keys stop compiling. Nothing changes at runtime.

**Option C (one import per extension), in one example.**

```ts
extensions: [StarterKit, Code, CodeBlock, Placeholder, Link,
  Image.configure({ uploadFunction: upload }), ImageGroup, ImageViewer, MediaDrop,
  Table.configure({ cellMinWidth: 25 }), TableRow, TableCell, TableHeader,
  TableNavigation, TableCellColor, TableSelectionOverlay, TextStyle, Color,
  Mention.configure({ items }), /* about 30 entries */]
```

It catches typos today, but every app setup must be rewritten, and the pairing rules move into app code (ImageGroup needs Image, Table needs 6 helpers, Color needs TextStyle, MediaDrop with any media; `kits.ts:147-173,242`). It reverses ADR-0004, where kits own the defaults. The individual extensions are already exported for apps that want this.

**App sites.** Each object was type-checked against the A types.

| Site | Sets | Under A or B |
|---|---|---|
| gameplan `richTextExtensions.ts:16` | heading, `table: { cellMinWidth: 25 }`, `slashCommands: false`, mention, tag | compiles |
| gameplan `commentExtensions.ts:36` (CommentKit) | heading, table, mention, tag | compiles |
| crm `editor/config.ts:49` | heading, mention, `starterKit` passed as `Record<string, unknown>` | compiles; the pass-through is not checked |
| crm `EmailEditor.vue:262` | `starterKit: { paragraph: false }` (JS) | compiles |
| helpdesk `desk/src/components/editor/config.ts:52` | heading, mention | compiles |
| frappe `ui/src/components/Composer/ComposerEditor.vue:227` | heading, mention | compiles |
| suite `writer/components/CoreEditor.vue:214` | `starterKit` with `trailingNode`, `paragraph`, `gapcursor`, `undoRedo` (JS) | compiles |
| suite `writer/components/CommentEditor.vue:80` | mention | compiles |

Corrections: the "5 H27 sites" (`rc-migration-effort.md:76,165`) counted a code comment, missed gameplan's `CommentKit.configure`, and did not search suite. The real number is 7 call sites in 5 apps, 0 edits, so H27 is T0. The "1 slashCommands site" is `slashCommands: false` and needs no edit. InlineKit: 0 sites.

**How ED-Q3 changes this.** If ED-Q3 removes only the dead keys, InlineKit needs its own 8-key type in A or B, because `code: false` works there (`kits.ts:295`). If ED-Q3 removes all StarterKit configuration, the InlineKit part of A versus B goes away, but crm and suite break (see ED-Q3).

**Recommendation: B, with two clarifications.**

1. Type all 18 keys. `slashCommands` gets an optional `items` that works; `{}` still means the built-in list. Emoji and slashCommands get owned narrow types.
2. InlineKit's `starterKit` gets its own 8-key `false`-only type.

No app edits, no runtime change, and every setting that does nothing today becomes a compile error. Starting with B keeps A open: accepting objects in InlineKit later only widens the type. Going from A back to B later would be a break. Also fix `spec/editor.md:218` and `rc-migration-effort.md:80,169`.

**Follow-up (2026-09-14).** The maintainer: "go with recommendation". Option B with the two clarifications is decided.

## LIST-Q1 — Can a ListRows row height differ from List's `rowHeight`?

**Short answer.** No, not in a way that works. `ListRows` does not need a height prop, and `overscan` is never set anywhere.

**How the height is resolved today.** `List` provides `rowHeight` through `provideListContext` (`src/molecules/list/List.vue:181`). `ListRows` reads it (`ListRows.vue:49`), uses `virtual.itemHeight` first and `rowHeight` second (`ListRows.vue:51-55`), and passes the result to `useVirtualRows` (`ListRows.vue:72`). If neither is set, it warns and renders every item (`ListRows.vue:57-64`).

`rowHeight` is also the CSS height of every row: `List.vue:72` sets `--_list-row-height`, and `style.css:113` applies it to each `list-row`. Each `List` resets it (`style.css:34`), so nested lists do not inherit it. Group headers do not use it (`ListGroup.vue:10`, fixed `h-8`).

**Cases checked.**

- **A different `itemHeight` inside a List.** The rows still render at `List`'s height, so the scroll calculation disagrees with the real rows. Windowing breaks.
- **Group headers.** The 32px `ListGroup` header is not a `list-row`. A header inside a virtual window breaks fixed-height windowing with or without a height prop.
- **Nested lists.** Each `List` has its own `rowHeight`.
- **More than one virtual `ListRows` in one `List`.** Not supported today. Select-all keeps one array and the last `ListRows` wins (`List.vue:152-154`, `ListRows.vue:89`). VueUse computes the window from `scrollTop / itemHeight` and ignores the wrapper's offset (`@vueuse/core` 14.1.0, `dist/index.js:7785-7788`). Groups with different heights need one `List` per group.
- **`ListRows` without a `List`.** The only case the override enables (`list-context.ts:44`). Rows then get no CSS height, and no document describes this use.
- **Stated reason.** None. The object form came in the first commit, `511ef4286f` "feat: add list family". No test uses it (`List.cy.ts:1034` passes `virtual: true`).

**Overscan.** Default 6 (`useVirtualRows.ts:44`). Read once at setup (`useVirtualRows.ts:19,44`, `ListRows.vue:73-74`). Never set in `src`, `docs`, stories, tests, or apps.

**App sites** (33 app files import `frappe-ui/list`):

| Term | Sites |
|---|---|
| `virtual` boolean | 2: gameplan `MembersSettings.vue:65` (List `row-height` 60), `AddCommunityMembersDialog.vue:99` (52) |
| `virtual` object, `itemHeight`, `overscan`, `ListVirtualOptions` | 0 |

Both virtual sites set `rowHeight` on `List`, so they keep working.

**Recommendation.** `virtual?: boolean` and `overscan?: number` (default 6) on `ListRows`. The height comes only from `List`'s `rowHeight`. Add a `ListRows` height prop only if a real case appears later; that is an additive change. Edits:

- `src/molecules/list/types.ts:118-124`: delete `ListVirtualOptions`.
- `src/molecules/list/index.ts:23`: delete the type export.
- `src/molecules/list/ListRows.vue`: line 22 drop the type import; line 41 `virtual?: boolean` plus `overscan?: number`; lines 51-55 height is `context?.rowHeight.value`; line 61 the warning names only `rowHeight` on `<List>`; lines 73-74 pass `props.overscan`; lines 37-39 update the doc comment.
- Regenerate `src/molecules/list/list.api.md:186-189` with `docs/scripts/propsgen.ts`.
- Docs: `src/molecules/list/list.md:183`, `skills/frappe-ui/CORE.md:311`.
- PR title needs `!` (the object form is removed, 0 app sites).

## LIST-Q3 — Do we need to expose `useVirtualRows`?

**Short answer.** No. Its only caller is `ListRows`.

- Callers: `ListRows.vue:21,68` only. None in docs, stories, tests, or apps. Gameplan's `LIST_FAMILY_SPEC.md:269,361` mentions it in prose only.
- Exported from `frappe-ui/list` only (`src/molecules/list/index.ts:14-15`, `package.json:63-65`), not from `src/index.ts`.
- Called public in `list.md:183-184` ("exported for exotic cases") and `docs/content/public/llms.txt:108`. No api.md entry, type test, or export snapshot refers to it.
- `ListRows` imports it by relative path, so nothing needs it public.

**Edits.** Delete `src/molecules/list/index.ts:14-15`. Delete the `useVirtualRows` sentence in `list.md:183-184` and ", plus the `useVirtualRows` composable" in `llms.txt:108`. Optionally rename its internal `itemHeight` option to `rowHeight` (`useVirtualRows.ts:16,43`). H30 (owned return types) is no longer needed. PR title needs `!` (0 app sites).

## LIST-Q4 — How does `as` fix ListRow's problem? Is there a simpler way?

**Short answer.** `as` fixes neither problem. The simplest correct fix keeps today's behavior, corrects the documentation, and fixes our own examples. It is not a break.

**The two problems.**

1. **Adding `@click` changes the element.** `to` gives `<a>`; otherwise `onClick` or `v-model:active` gives `<button>`; otherwise `<div>` (`ListRow.vue:5-22,42-44`). The effects: a click listener moves the content inset from 0 to 0.75rem (`style.css:126-129`), and a clickable row cannot hold a Dropdown or another button (`list.md:15-19`), so four recipes use an overlay button instead (`list.md:35-51`, `RowActions.vue:64`). The row checkbox is a focusable `div role="checkbox"` inside the root (`ListRowBase.vue:27-36`), so a selectable list with clickable rows nests a focusable element inside `<a>` or `<button>`, which is invalid HTML.
2. **Selectable mode ignores `onClick`.** A row click toggles selection and returns before `onClick`, `to`, and the active model run (`ListRow.vue:47-51`). This is tested (`List.cy.ts:130-149`) and documented (`types.ts:66-67,97`, `list.md:20-21`). Our own `TicketsDesktop.vue:412,435` story is always selectable and has `@click`, so a ticket can never be opened. `skills/frappe-ui/CORE.md:322,329` teaches the same pattern.

**What `as` does.** It only touches problem 1, and fixes none of its effects:

- The checkbox is still inside the root, whatever the tag.
- `as="div"` with `onClick` gives a row the keyboard cannot reach.
- `as="a"` without `to` has no `href` and cannot take focus.
- `as="button"` is what the code already picks.

Problem 2 is one early `return`, and it does not depend on the tag.

**Why the `<button>` is needed.** List has no keyboard handling: no roving focus and no `aria-activedescendant` (`List.vue:1-10`). Rows are reachable by keyboard only because they are native `<a>` or `<button>` elements. The spec gives roles only (`list.md:234-236`).

**Options checked.**

| Option | Result |
|---|---|
| Tag from `to` only, List owns the keyboard | Needs roving focus that survives virtual rows unmounting. Largest change. |
| Add `as` | New prop; every non-default value is broken. Fixes nothing. |
| Always call `onClick` after the toggle | Every click in select mode both toggles and opens. Break. |
| Checkbox selects, row body activates | Breaks 3 consumer lists that rely on row click toggling. Keeps the invalid nesting. Break. |
| Keep behavior, fix docs and examples | No break. Every real consumer already uses "select mode". |

**Sites.** Only rows from `frappe-ui/list` (crm and helpdesk use v0 `:row`; suite mail uses `frappe-ui/experimental`).

- gameplan: 12 rows. `to` at `DiscussionRow.vue:2`, `Drafts.vue:89`, `Search.vue:232`, `Notifications.vue:32` (also `@click`), `People.vue:104,174`. Selectable with `to`: `DiscussionList.vue:8,27` and `Drafts.vue:89`; both rely on row click toggling.
- wiki: 4 rows, `to` at `SpaceList.vue:154` and `ContributionsPanel.vue:62`.
- frappe_books: 12 rows. Click at `Table.vue:71`, `ItemsTable.vue:25`, `ModernPOSItemsTable.vue:30`, `LinkedEntries.vue:53`, `ListReport.vue:23`. Selectable at `pages/ListView/List.vue:26`; it already guards its handler. `Table.vue:71` uses `focus-visible:ring`, which works only because the row is a `<button>`.
- suite drive: 6 rows, no selectable List.
- App selectors use only `[data-slot="list-row"]`; none depend on the tag.
- Own tree: selectable with a no-op `@click` at `Feed.vue:74`, `AccountingDesktop.vue:687`, `AccountingMobile.vue:280`, `TicketsDesktop.vue:435`, `CORE.md:329`. Tag checks in `List.cy.ts:82,85,103,393,428,653,690`.

**Recommendation.** Drop `as` and keep the element rule and the select-mode rule.

- Reword `types.ts:86-87,97`: "In a `selectable` list a row click toggles selection; `to`, `onClick`, and `v-model:active` do not run."
- Fix `TicketsDesktop.vue:412,435` (make selection a mode, or drop `@click`) and `CORE.md:322,329`. Remove the no-op `@click` in `Feed.vue:74`, `AccountingDesktop.vue:687`, `AccountingMobile.vue:280`.
- Record the checkbox-inside-`<a>`/`<button>` nesting as a separate accessibility issue for after the RC. The likely fix is a `<div>` row with a built-in overlay link or button.
- If "checkbox selects, row opens" is wanted later, add it as an opt-in List prop. That is additive.

No behavior change, so no `!`. Section 5 of the research (other libraries) was from memory: MUI DataGrid and AG Grid always fire row click and make select-on-click a separate setting; GitHub's issue list keeps the checkbox and the title link as separate controls.

**Follow-up (2026-09-14).** The maintainer: "yes". The recommendation is decided.

## LIST-Q5 and LIST-Q8 — What are the actual consumer migrations?

**LIST-Q5.** The two Builder matches are false positives, both in
`frontend/src/components/CommandPalette.vue`: `data-active` belongs to
app-authored `div` rows and its query selector, with no `ListRow` in the file.
The actual Builder ListRow selector migration count is 0.

**LIST-Q8.** There are 5 live `#suffix` occurrences across 2 consumer files:

- Gameplan `frontend/src/components/Settings/MembersSettings.vue`: 2
- Suite `frontend/src/apps/drive/components/ListView.vue`: 3

Gameplan's `LIST_FAMILY_SPEC.md` has 2 additional documentation examples,
counted separately from live sites. No tied dynamic slot, `v-slot:suffix`, or
legacy `slot="suffix"` form was found. The rename to `#sort-indicator` is fully
mechanical and preserves the component's edge-aware placement.

## Batch 2 — what the implementation measured

Greps run 2026-09-15 against the three app trees on this box: Gameplan
(`frappe-bench`), Builder (`builder-bench`) and Suite, which contains Drive.
Wiki, Helpdesk and CRM are not on this box; their counts stay as recorded.

**SHELL-Q1 / H15 — two apps render `DesktopShell`, not zero.** Gameplan
`frontend/src/components/DesktopLayout.vue:5` and Suite Drive
`frontend/src/apps/drive/pages/DriveLayout.vue:10`. Drive already passes
`:scroll="shellScroll"`, so the prop was live before this batch; only the
`DesktopShellProps` type was empty. Nothing to migrate in either app.

**SHELL-Q4 / H14 — `viewportClass` sites confirmed.** Gameplan 6 and Builder 1,
matching the SHELL-Q4 table. Suite has 0. The prop is kept, so none migrate.

**VOC-Q7 — Gameplan owns its copy of `--mobile-header-height`.** It declares the
variable at `frontend/src/index.css:10` with the value `52px`, the same as the
fallback the library used, and reads it in three of its own files
(`CommentsArea.vue:80,540`, `DiscussionView.vue:490`). The library no longer
reads the name, so Gameplan's declaration and reads keep working unchanged and
render identically.

**SHELL-Q11 / SHELL-Q12 — no color-scheme sites on this box.** Zero
`resolvedColorScheme` and zero `toggleColorScheme` occurrences in Gameplan,
Builder and Suite. Wiki's 3 sites stand as recorded.

**SHELL-Q6 / SHELL-Q7 — confirmed 0.** No `ScrollBar` import or tag, and no
`useSheetDrag` import, in any of the three trees.

**SHELL-Q9 — confirmed 0.** No `data-no-scroll-top` and no `data-no-sheet-drag`
in any of the three trees. Both attributes are now documented.

**INP-Q16 — zero `<Rating>` tags in Gameplan, Builder and Suite.** So the
combined "38 / 9 / 44" row in `rc-migration-effort.md` was TabButtons, not
Rating: Gameplan's 10 cannot contain a Rating. The row is now split, and the
Rating half carries the 3 v1 sites INP-Q16 lists.

## Batch 3 — what the implementation measured

Greps and codemod dry runs from 2026-09-15, against the four app trees on this
box: Gameplan, frappe (`apps/frappe`, which holds `frappe/ui`), Builder and
Suite. CRM, Helpdesk, Wiki, Books and Insights are not on this box; their
counts stay as recorded.

**ED-Q6 — 5 mention and tag sites.** Gameplan `frontend/src/components/editor/
config.ts` builds `{ id, label, value }` for mentions and `{ id, label }` for
tags, so both lists change (2 edits). frappe `ui/src/components/Composer/
ComposerEditor.vue:218` maps its options to `{ id, label }` (1 edit). Suite
passes `allUsers`, whose transform already sets `label` and `value`
(`drive/js/resources.js:40-46`), so its two kit sites need no edit, but its two
`getMentions()` readers (`writer/components/FloatingComments.vue:323,353`) post
the result to its API and need review. Builder has no mention or tag use.

**ED-Q7 — 2 of the 4 setups on this box must opt in.** Gameplan
`richTextExtensions.ts` wraps the built-in slash registry
(`collapsible/collapsible-menu.ts:61`), so it needs `toc: {}` or the
table-of-contents command disappears from its menu; its CommentKit stack
already adds `Toc` by hand (`commentExtensions.ts:46`), so that one is
unaffected. Suite `writer/components/CoreEditor.vue:154` reads
`editor.storage.styleClipboard.styleClipboard`, so it needs `styleClipboard: {}`
or that line throws. Suite's table of contents is its own
`@tiptap/extension-table-of-contents`, not the frappe `Toc` node, so it needs no
`toc`. frappe `ComposerEditor.vue` and Suite `CommentEditor.vue` need neither.

**PKG-Q2 — 0 deep-path sites left.** All four apps already import
`frappe-ui/tailwind`. `packaging-v1 --dry-run` on each tree confirms it.

**PKG-Q8 — 82 icon imports converted, 1 app config to change.** The conversion
touched 12 shipped files: `commands.js` 31, `slash-commands-extension.ts` 14,
`MediaNodeView.vue` 10, `ImageViewerModal.vue` 8, `LinkPopup.vue` 5,
`IframeNodeView.vue` 4, `FloatingWindow.vue` 3, `ImageGroupNodeView.vue` 2,
`ImageGroupUploadDialog.vue` 2, `Rating.vue` 1, `Rating/types.ts` 1 and
`PickerShell.vue` 1. Every `<LucideX />` tag left in shipped code is declared
locally by `classIcon()`, so no shipped file depends on the auto-import plugin.
`packaging-v1 --dry-run` reports one config to change, Gameplan
`frontend/vite.config.ts`; Builder `vite.config.mjs:18`, Suite
`vite.config.ts:99` and Suite `vite.recorder.config.ts:11` already pass
`lucideIcons: true`; `apps/frappe` does not use the Vite plugin at all.

**PKG-Q3, PKG-Q4 and PKG-Q6 — 0 app sites.** No `w-wizard`, no `min-w-50`, no
`rounded-9` and no read of a removed `--focus-<name>` variable in any of the
four trees. `apps/frappe` reads `var(--focus-default)` 12 times, but it
declares those variables itself in `frappe/public/css/espresso/effects.css`, so
this change does not reach them.

**PKG-Q9 — the pack check found one more defect.** `npm pack` plus
`npm install` into `/tmp/rc3-consumer`: 932 files, 0 test files, all 12
exported subpaths resolve, `frappe-ui/src/utils/tailwind.config` fails with
`ERR_PACKAGE_PATH_NOT_EXPORTED`, all 10 bins install and point at shipped
files, and a Tailwind build through the packed preset emits `p-4.5`,
`min-w-50` at 12.5rem, `rounded-9` at 100px, 14 `--focus-outline-*`
declarations and no box-shadow focus variable. `vue-tsc` on the installed
package first reported 198 errors: 136 were unresolved `#` self-imports,
because a consumer's compiler reads the `imports` map and adds neither an
extension nor an `index` segment, and this repo's own `tsconfig.app.json`
`paths` are not published. Listing the `.ts` and `index.ts` forms in each
`imports` pattern fixes it. The remaining 22 were `import.meta.env` without
`vite/client` types, which `getting-started.md` now tells consumers to keep.

## PKG-Q4 and PKG-Q6 — Are the `--focus-<name>` variables legacy? Examples

**Short answer.** They are superseded inside frappe-ui, but "legacy" and "kept for backward compatibility" are wrong. No release used them alone, and no app reads frappe-ui's copy. Recommendation: remove them before RC.

**The two families.** `tailwind/colorPalette.js:167-174` emits six names (default, red, green, amber, blue, violet) in two forms. Values come from `tailwind/generated/effects.json:21-40`.

| Variable | Light | Dark |
|---|---|---|
| `--focus-default` (box-shadow) | `0px 0px 0px 2px #c9c9c9e5` | `0px 0px 0px 3px #464646cc` |
| `--focus-outline-default` (outline) | `2px solid #c9c9c9e5` | `3px solid #464646cc` |

The outline value is computed from the shadow string (`colorPalette.js:182-185`). The only utilities are `focus-ring` and `focus-ring-<color>`, and both use the outline form (`plugin.js:96-106`). A global `:focus-visible { outline: var(--focus-outline-default) }` rule gives every focusable element a ring (`plugin.js:181-184`). No utility uses the box-shadow form.

**Where "legacy" came from.** ADR-0005 (`spec/adr/0005-focus-ring-2px.md`) first built `.focus-ring` on the box-shadow variables, then an amendment switched to outline because every element had to opt in and a box-shadow ring conflicted with `shadow-*` on the same element (TextInput had that bug). Line 58 says the box-shadow names "remain emitted for backward compatibility but are no longer used by frappe-ui itself".

**Why "backward compatibility" is wrong.**

- History: the box-shadow form arrived in `1494a9e69f` (2026-05-24) and the outline form in `95b3bea207` (2026-06-07). Both reached main in PR #727 and first shipped together in `v1.0.0-beta.5`. No tag has the box-shadow form without the outline form.
- frappe-ui: no `var(--focus-<name>)` read in `src/`, `tailwind/`, `experimental/`, or `vitepress/`. Components use the global rule (TextInput) or `focus-ring-<color>` (`Button.vue:139-141`, `Checkbox.vue:207`, `Radio.vue:83`, `SidebarItem.vue:27`, charts).
- Apps: Frappe Desk SCSS has 11 reads of `--focus-default` (`scss/common/buttons.scss:22,82,97,112`, `scss/desk/global.scss:31`, and others). Frappe defines all twelve variables itself in `frappe/public/css/espresso/effects.css:27-53`, loaded through `scss/espresso/_shadows.scss:7` (Frappe PR #40139). The earlier count of "13" included those definitions. Red, green, blue, and violet have 0 reads. Gameplan, CRM, Helpdesk, Insights, and Suite read neither box-shadow name. Raven and Wiki generate their own copies.
- The `focus-ring` classes in apps (Gameplan `AppRail.vue:73`, Helpdesk `AssignTo.vue:20`, Suite `DeviceSettingsTab.vue:27`) use the outline form and are not affected.

**Examples.** What an app would write with the box-shadow names, and what it writes today.

1. A custom focusable element.

   ```css
   /* box-shadow form */
   .card:focus-visible { outline: none; box-shadow: var(--focus-default); }
   /* today: write nothing, the global :focus-visible rule covers it. Explicit form: */
   .card:focus-visible { outline: var(--focus-outline-default); outline-offset: 0; }
   ```

2. An error-colored ring.

   ```html
   <!-- box-shadow form -->
   <div tabindex="0" class="outline-none" style="box-shadow: var(--focus-red)">
   <!-- today -->
   <div tabindex="0" class="focus-visible:focus-ring-red">
   ```

3. A ring on an element that also has a shadow. This is the case ADR-0005 switched for.

   ```html
   <!-- box-shadow form: the ring and shadow-sm both set box-shadow, so one of them is lost -->
   <div class="shadow-sm focus-within:[box-shadow:var(--focus-default)]">
   <!-- today: outline, so both show -->
   <div class="shadow-sm focus-within:focus-ring">
   ```

**Is there a case where box-shadow is better?** Only when a ring must be combined with an elevation in one `box-shadow` list, for example `box-shadow: var(--elevation-sm), var(--focus-default)`. No app does this. `overflow: hidden` clips both forms the same way, and forced-colors mode removes box-shadow but keeps outline.

**Options.**

1. Remove before RC (recommended). Delete `colorPalette.js:168,172` and update the comment at `:149`. Update ADR-0005 lines 40 and 58. 0 app sites. One breaking changelog line for unknown apps: `box-shadow: var(--focus-X)` becomes `outline: var(--focus-outline-X)`. PR title needs `!`.
2. Keep, but do not document them and do not call them legacy. The six names stay in the output with no reader. Once the RC freezes additions-only, they cannot be removed until v2.

Either way, fix `docs/components/foundations/FocusRingPreview.vue:17-41` (the swatches render `--focus-outline-*` but are labeled with the box-shadow names), `spec/foundations.md:28`, and `spec/adr/README.md:13` (both still describe `focus-visible:ring-2`).

Limit: the census covered 6 apps plus a scan of the local bench. The other consumers in the 41-app list were not checked.

**Follow-up (2026-09-14).** The maintainer: "sure, go with recommendations". Option 1, remove before RC, is decided.

## PKG-Q5 — What is the alpha naming inconsistency, and how would it be normalized?

**Short answer.** In every family, `alpha` is added to the end of the group key, which is how Figma names it (`tailwind/figma-tokens-to-theme.js:41-42`). Raw classes have the hue in the group key and semantic classes do not, so the class names read differently. Recommendation: no rename; document the rule.

| Family | Theme key | Classes |
|---|---|---|
| Raw light | `gray-alpha` (`colorPalette.js:46-48`) | `bg-gray-alpha-100`, `text-gray-alpha-500` |
| Raw dark | `dark-gray-alpha` (`colorPalette.js:49-51`) | `bg-dark-gray-alpha-100` |
| Semantic surface | `surface-alpha` (`plugin.js:256,260`) | `bg-surface-alpha-gray-2`, `bg-surface-alpha-base`, `bg-surface-alpha-elevation-1` |
| Semantic outline | `outline-alpha` (`plugin.js:263,278,282,286`) | `border-outline-alpha-gray-1`, `ring-outline-alpha-gray-2` |
| Overlays | `white-overlay`, `black-overlay` (`colorPalette.js:42-43,53-59`); Figma calls them `white-alpha`, `black-alpha` | `bg-black-overlay-200` |

So raw is `{hue}-alpha-{shade}` and semantic is `{category}-alpha-{hue}-{step}`. The audit's page example `gray-500-alpha` (`rc-api-audit-review.html:256`) does not exist.

`/50` opacity works on semantic alpha classes but not on raw alpha or overlay classes, because those values already carry alpha (`colorPalette.js:11-15`). No site uses it.

**Usage.** Class uses plus `var()` reads.

| Family | Own tree | GP | Frappe | CRM | HD | Builder | Books | Wiki |
|---|---|---|---|---|---|---|---|---|
| `gray-alpha-*`, `dark-gray-alpha-*` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `surface-alpha-*`, `outline-alpha-*` | 5 | 0 | 4 (own copy) | 0 | 3 | 0 | 0 | 2 |
| `black-overlay-*`, `white-overlay-*` | 10 | 1 | 0 | 1 | 3 | 0 | 0 | 5 |

Own-tree semantic sites: `Menu/utils.ts:173` (3), `selection/utils.ts:122`, `SidebarCard.vue:134`. Frappe's 4 reads use its own variables in `espresso/colors.css`.

**Ways to normalize.**

1. `alpha` next to the hue in semantic names: `surface-alpha-gray-2` → `surface-gray-alpha-2`. 5 own-tree and 5 app sites, plus CSS variable names, the Figma mapping, and the v2 codemod (`migrate-tokens-v2.js:114-133,282-288`). The entries without a hue (`base`, `sidebar`, `elevation-1..3`) have no good new name.
2. `alpha` before the hue in raw names: `gray-alpha-100` → `alpha-gray-100`. 0 sites, but it leaves the Figma name and Frappe's espresso variables.
3. Keep the names and document the rule: "`alpha` is a suffix on the group key: `gray-alpha`, `surface-alpha`, `outline-alpha`." 0 sites.

A codemod can do 1 or 2. Recommendation: 3. The names match Figma and Frappe, and a rename has no functional gain. The overlay word (`overlay` where Figma says `alpha`) is a larger mismatch than the position, but renaming it touches 20 sites for no gain, so leave it too.

**The rule for raw shades (decided).** Semantic tokens are the default. Raw shades are for fixed colors that must not follow the theme, such as the editor's font color swatches (`src/molecules/editor/components/font-color/swatches.ts:27-52`). The dark raw ramp is not a simple swap of the light ramp (it runs in reverse and has an extra `450` step), which is one more reason to use semantic tokens for themed UI.

**Follow-up (2026-09-14).** The maintainer: "sure, go with recommendations". Option 3, no rename and a documented rule, is decided.

## PKG-Q3 — Half steps 0.5 to 19.5 in the spacing scale

**Short answer.** 16 of the 20 half steps exist today; 16.5, 17.5, 18.5, and 19.5 are new. The whole change (integers 1 to 128, half steps to 19.5, four sizing blocks removed) changes the value of 0 sites. It needs Tailwind 3.4.

- Today spacing is extended in two places: `tailwind/preset.js:18-20,26-27` (integers 1 to 64) and `tailwind/plugin.js:288-303` (4.5 to 12.5, 13.5, 14.5, 15.5). Tailwind's defaults have 0.5, 1.5, 2.5, and 3.5.
- New values are n × 0.25rem: 16.5 = 4.125rem, 17.5 = 4.375rem, 18.5 = 4.625rem, 19.5 = 4.875rem.
- A key built as `i + 0.5` becomes the string `"1.5"` and compiles to `.p-1\.5`. Fraction keys such as `w-1/2` are separate and still work. Tested in memory with the real preset: `p-16.5`, `-mt-16.5`, `gap-17.5`, `min-h-19.5`, `max-w-112` compile. The new keys also feed `list-gap-*` and `list-row-px-*` (`plugin.js:216-222`).
- In Tailwind 3.4.19 (installed), `width`, `height`, `size`, `minWidth`, `maxWidth`, `minHeight`, and `maxHeight` all read `theme('spacing')` (`stubs/config.full.js:519,641,653,674,685,973,1007`). Before 3.4, `minWidth`, `maxWidth`, and `minHeight` did not, so removing the `minWidth` block would drop `min-w-40` there. Every measured app resolves 3.4.x. Set the peer range to `>=3.4.0 <4`.

| Class | Before | After | Own tree | Apps |
|---|---|---|---|---|
| `w-3.5`, `h-3.5` | 0.875rem | same | 8 | 72 |
| `w-112` | 28rem | same | 0 | 0 |
| `min-w-40` | 10rem | same | 4 | 17 |
| `max-h-52` | 13rem | same | 0 | 4 |
| `min-w-50` | 18rem | 12.5rem | 0 | 0 |
| `w-wizard` | 650px | removed | 0 | 0 |

No app under `~/Projects/benches` uses `min-w-50`, `w-wizard`, or `theme('minWidth.50')`, so there is no app to move 650px to. Apps that are not checked out locally were not checked.

## PKG-Q7 — Does any doc say the preset extends Tailwind?

No. `docs/content/docs/foundations/tailwind.md:15-16` says the preset "sets ... the integer spacing scale (1–64, filling the gaps in Tailwind's default scale)", and spacing is extended. No doc, spec, or skill says that colors, font sizes, screens, radii, or shadows extend Tailwind. The audit line (`rc-api-audit.md:304-305`) was wrong. The replacing sections are at `tailwind/plugin.js:225-250`. The docs fix is one line saying the preset replaces those five sections, so stock classes such as `2xl:` and `shadow-inner` are not generated.

## PKG-Q8 — What does turning `lucideIcons` off by default take?

**Mechanism.** `vite/index.js:13` reads `options.lucideIcons ?? true` and, when on, adds three plugins from `vite/lucideIcons.js:7-28`: `unplugin-auto-import` and `unplugin-vue-components` with an unplugin-icons resolver (so `<LucideX />` works without an import), and `lucideIconsPlugin` (`vite/lucideIconsPlugin.js:17-44`), which turns `~icons/lucide/<name>` into an inline-SVG component from `lucide-static`. Class icons do not use Vite: `tailwind/lucideIconsPlugin.js` makes a `lucide-<name>` class for every icon, drawn as a CSS mask in `currentColor` (`tailwind/iconPackPlugin.js:69-107`). Tailwind only generates classes it finds written out in scanned files.

**Shipped code: 83 imports and 1 tag in 13 files. The flip affects 81 imports in 11 files.**

- Root, 2: `src/components/shared/picker/PickerShell.vue:68` (becomes `lucide-chevron-down`) and `src/components/Rating/Rating.vue:141`.
- `frappe-ui/editor`, `/list`, `/charts`, `/icons`: none.
- `frappe-ui/experimental`, 79 in 9 files: `FloatingWindow/FloatingWindow.vue:132-134` (3); TextEditor `commands.js:2-32` (31), `slash-commands-extension.ts:10-23` (14), `MediaNodeView.vue:10-19` (10), `ImageViewerModal.vue:181-188` (8), `LinkPopup.vue:67-71` (5), `IframeNodeView.vue:6-9` (4), `ImageGroupUploadDialog.vue:270-271` (2), `ImageGroupNodeView.vue:52-53` (2).
- `frappe-ui/vitepress`: `PrevNextBtns.vue:11-12` and a `<LucideChevronRight>` tag at `PropsTable.vue:45`. Not affected, because `vitepress/index.node.ts:179` calls `lucideIcons()` directly.
- Docs and stories: 33 imports and 8 tags. The docs site and `vite.config.ts:14` (Cypress) call `lucideIcons()` directly, so they are not affected.

**Things to handle.**

1. Rating's filled star cannot be a class icon: `star.svg` has `fill="none"`, so the mask draws only the outline. `Rating.cy.ts:172-179` checks `svg[fill=currentColor]`. Use an inline filled-star SVG.
2. The experimental barrel re-exports FloatingWindow and TextEditor (`experimental.ts:4,44-64`), so any `frappe-ui/experimental` import pulls their `~icons` imports into the app build. Convert them in the same PR. (Not confirmed with a build.)
3. TextEditor command objects store icon components (`commands.js`, `slash-commands-extension.ts:31`) and render them with `<component :is>` in 8 places. To keep that shape, use small components that render `<span class="lucide-bold" />`, so the class names are still written out for Tailwind.
4. `experimental/FloatingWindow` is not in `tailwind/content.js:50-58`; add it. Gameplan, CRM, Helpdesk, Builder, and Insights scan only part of frappe-ui in their own configs and miss `experimental/TextEditor`. That gap exists today.
5. The auto-import resolver has a bug that the flip removes for most apps: Gameplan's `auto-imports.d.ts:9` declares `lucideSlotClasses` from `~icons/lucide/slot-classes`, because Button has a local variable with that name (`Button.vue:82`).

**Apps.**

| App | Vite plugin | `lucideIcons` | `~icons/lucide` imports | Auto tags | Breaks? |
|---|---|---|---|---|---|
| Gameplan | `vite.config.ts:34` | default | 2 | 4 | Yes; add `lucideIcons: true` |
| CRM | `vite.config.js:114` | `true` | 60 | 5 | No |
| Helpdesk | `desk/vite.config.js:21` | `true` | 203 | 61 | No |
| Builder | `vite.config.mjs:12` | `true` | 13 | 0 | No |
| Books | calls `lucideIconsPlugin()` directly | — | 0 | 0 | No; can drop it after the conversion |
| Wiki | `vite.config.js:34` | `true` | 0 | 0 | No |
| Insights | `vite.config.js:54` | `true` | 0 | 0 | No |
| Frappe (`frappe/ui`) | built by CRM and Helpdesk | `true` there | 14 | 6 | No |
| Suite | `vite.config.ts:88` | `true` | 268 | 98 | No |

The failure is partly silent: an import fails the build, but a `<LucideX />` tag compiles and renders nothing, with only a "Failed to resolve component" warning in development. The local apps are on older betas and break only when they upgrade.

**History.** The option was added in `d798387fad` (2025-03-15) with default `true`. No ADR or spec mentions it. Class icons are already the documented style (`docs/content/docs/other/icons.md:22`, `PHILOSOPHY.md:359`, `migration.md:1683`). The `icons.md` table at `:159-161` still recommends `~icons` imports for dynamic names and props; that table changes. `frappe-ui/icons` is not affected (16 hand-written SVG components, no Lucide imports).

**Classification.** A break in build config, so the PR title needs `!` and a migration note: "If you import `~icons/lucide/*` or use `<LucideX />` tags, pass `lucideIcons: true` to the frappe-ui Vite plugin." T1, 1 measured app, one config line.
