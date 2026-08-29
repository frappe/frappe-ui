# frappe-ui core reference

Component APIs, design tokens and page composition. When this file does not answer a prop, slot or option question, read the shipped source before guessing: the npm package includes all of `src/`. `node_modules/frappe-ui/src/components/<Name>/` holds `types.ts`, a generated `<Name>.api.md` prop/slot/emit table, and `stories/*.vue`; the chart tables sit in `src/charts/docs/*.api.md` and the molecules under `src/molecules/<family>/`. Grep for the name if the path does not match. Read these from disk; do not import from `frappe-ui/src/*`, which the `exports` map blocks. With no `node_modules` on disk, fetch https://ui.frappe.io/llms.txt. Copy an existing Frappe app (Gameplan, CRM, Helpdesk, Drive, Insights) rather than invent.

Import from `'frappe-ui'`. Four families ship on their own subpaths: `frappe-ui/list`, `frappe-ui/editor`, `frappe-ui/charts`, `frappe-ui/experimental`.

## Tokens

frappe-ui ships a Tailwind preset: colour, type, radius and shadow all come from semantic tokens, so one class works in light and dark mode. Tailwind's raw palette (`bg-gray-100`, `text-gray-900`) is a fixed light-mode value that never flips, so always reach for the semantic token.

Five colour categories. `ink`, `surface` and `outline` cover almost every case; the `-alpha` pair are translucent, gray-only variants for overlay work.

| Category | Utilities | Steps |
|---|---|---|
| `ink` | `text-ink-*`, `fill-ink-*`, `placeholder-ink-*` | `base`, `blue-link`, `gray-1..9`, `<color>-1..9` |
| `surface` | `bg-surface-*` | `base`, `sidebar`, `elevation-1..3`, `gray-1..10`, `<color>-1..10` |
| `outline` | `border-outline-*`, `ring-outline-*`, `divide-outline-*` | `base`, `elevation-1..2`, `gray-1..9`, `<color>-1..10` |
| `surface-alpha` | `bg-surface-alpha-*` | `base`, `sidebar`, `elevation-1..3`, `gray-1..10` |
| `outline-alpha` | `border-outline-alpha-*` | `base`, `elevation-1..2`, `gray-1..9` |

`<color>` is one of `red green blue amber orange yellow teal cyan violet purple pink`. Higher step = stronger contrast. Steps are not interchangeable across categories: in light mode `ink-red-5` resolves to red/500 while `surface-red-5` resolves to red/400.

**Ink.** `text-ink-gray-1..9` is the gray ladder climbing in contrast, by role: `-9` strongest values only (unread row titles, KPI figures) · `-8` body copy, row titles, section headings, and the page default set once on the page wrapper · `-7` secondary values, table cells, descriptions · `-6` field labels, form icons · `-5` timestamps, counts, captions, meta · `-4` ids (`tabular-nums`), decorative glyphs. Also `text-ink-blue-link` for links and toast action labels (a blue `subtle` / `outline` / `ghost` button label is `text-ink-blue-5`), `text-ink-red-7` for error text (what `ErrorMessage` renders), and `text-ink-base` for inverse ink on a dark surface: `bg-surface-gray-9` (toast), `bg-surface-gray-10` (tooltip).

**Surface.** `bg-surface-base` is the page background, `bg-surface-sidebar` the sidebar and rail.

- `bg-surface-gray-1` — quiet fill for something that is **not** a control: a board column, an inset block inside a card, a disabled input.
- `bg-surface-gray-2` / `-3` / `-4` — the control interaction ladder: rest, hover, pressed. Written `bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4`. `gray-2` is also the `subtle` input fill. Every colour follows the same 2 / 3 / 4 pattern.
- `bg-surface-elevation-1` — dialog panel and dialog body, and a card sitting on a tinted column (board cards).
- `bg-surface-elevation-2` — popover, dropdown and menu surface.
- `bg-surface-elevation-3` — active nav item and active tab; pair with `shadow-sm`. A plain card is `bg-surface-base` plus a border.
- Tinted status block: `bg-surface-<color>-2` with `text-ink-<color>-7` and `border-outline-<color>-3`. Solid: `bg-surface-<color>-7` with `text-white`.

**Outline.** `border-outline-gray-1` / `-gray-2` are the default and stronger borders; a bare `border` already resolves to `--outline-gray-1`. `border-outline-red-3` / `-green-3` are error and success borders. Focus rings are automatic: a global `:focus-visible` outline covers every focusable element. Retheme with `focus-visible:focus-ring-<name>` (`red | green | amber | blue | violet`), suppress with `focus-visible:outline-none`, and apply the default ring outside focus with `data-[state=open]:focus-ring`.

### Type

`InterVar` is the `<html>` font. Two parallel scales share pixel sizes and differ in line-height. `text-*` (line-height 1.15 through `text-4xl`, loosening to 1.4–1.6 at `text-5xl` and up) is for single-line labels: headings, button text, badges, table cells, stat values, timestamps. `text-p-*` (line-height 1.4–1.6) is for text that wraps: paragraphs, descriptions, helper text.

Sizes, each with a `text-p-*` twin: `2xs` 11px · `xs` 12px · `sm` 13px · `base` 14px (default) · `md` 15px · `lg` 16px · `xl` 17px · `2xl` 18px · `3xl` 20px · `4xl` 24px. `text-5xl` … `text-12xl` (26–56px) are display only — the paragraph scale stops at `text-p-4xl`.

Size and weight combine into one utility, `text-<size>-<weight>` and `text-p-<size>-<weight>`, where `<weight>` is `medium | semibold | bold`: `text-lg-semibold`, `text-base-medium`, `text-p-sm-medium`. Each carries tuned letter-spacing, so prefer it over `text-lg font-semibold`.

By role: row title `text-base` desktop / `text-lg` mobile, `-semibold` when unread · meta `text-sm` desktop / `text-md` mobile, always `ink-gray-5`, `mt-1.5` below the title · section headings `text-lg-semibold` · page titles `text-2xl`+ · prose `text-p-base text-ink-gray-8` · quiet section label `text-sm text-ink-gray-5`. Headers use sentence case: "Recent activity".

### Radius and shadow

Radius is numbered `rounded-0` … `rounded-9`, plus `rounded-none` and `rounded-full`; named aliases (`rounded-md`, `rounded-xl`, …) were removed in 1.0. `rounded-1` 4px checkboxes, colour swatches, small chips · `rounded-3` 6px `xs` buttons · `rounded-4` 8px the default control radius (`sm`/`md` buttons, `sm`/`md` inputs, list items, tooltips) · `rounded-5` 10px `lg` controls (`lg` buttons, `lg`/`xl` inputs, toasts) · `rounded-6` 12px card-like surfaces, popovers, dropdowns, menus · `rounded-7` 16px dialog panels · `rounded-full` the pill radius for avatars, status dots, pill badges.

Shadow: `shadow-sm` input on focus, resting card, active nav item · `shadow-base` / `shadow` active tab indicator · `shadow-md` slider thumb, rare · `shadow-lg` bottom sheets, drag labels · `shadow-xl` dialogs, toasts, tooltips · `shadow-2xl` popovers, dropdowns, menus. Pair a shadow with a `bg-surface-elevation-*` background.

For exact values read `node_modules/frappe-ui/tailwind/generated/radius.json` and `effects.json`, both short; the tables above already carry what you need from `colors.json` (1173 lines) and `plugin.js` (690).

### What the preset replaces

The preset **replaces** `colors`, `screens`, `borderRadius`, `boxShadow` and `fontSize`, so these stock Tailwind classes do not compile: `2xl:*` (breakpoints stop at `xl`, 1280px); bare `rounded` (no DEFAULT radius — write `rounded-4`); and the families `slate zinc neutral stone indigo sky emerald rose fuchsia lime` (only `gray blue green red orange yellow teal violet cyan amber pink purple` exist). It **adds** every integer spacing step 1–64, so `h-15`, `h-17` and `size-33` compile here — leave them alone.

### Dark mode

The scheme lives in `data-theme` on `<html>` (`"light"` or `"dark"`). Semantic tokens flip automatically; reach for a `dark:` variant only for a value with no semantic token.

```js
import { useColorScheme, resolvedColorScheme } from 'frappe-ui'
// module-level singleton every caller shares
const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
// colorScheme      Readonly<Ref<'light' | 'dark' | 'system'>>
// setColorScheme   (scheme) => void — writes data-theme, persists
resolvedColorScheme() // 'light' | 'dark', with 'system' already resolved
```

### Styling past the prop surface

Target a component's `data-slot` and state attributes. Slots in wide use: `trigger`, `content`, `content-body`, `input`, `control`, `search`, `item`, `item-prefix`, `label`, `prefix`, `action`, `footer`, `empty`. State attributes: `data-state` (values are per component — `open`/`closed`, `active`/`inactive`), `data-disabled`, `data-highlighted`, `data-placeholder`, `data-size`. Both work as Tailwind variants (`data-[state=open]:rotate-180`, `data-[disabled]:opacity-50`) and as plain CSS (`[data-slot='trigger'][data-state='open'] { … }`).

## Icons

Any lucide icon renders as a `<span>` carrying the icon class, named `lucide-<kebab-case-name>`:

```vue
<span class="lucide-edit size-4" aria-hidden="true" />
<span class="lucide-circle-check size-5 text-ink-gray-7" aria-hidden="true" />
```

- Size with `size-*` by role: `size-4` default (buttons, sidebar items, header actions), `size-3.5` inline meta beside `text-sm`, `size-5` mobile row leading, `size-6` empty-state glyphs, `size-2` / `size-1.5` status and unread dots.
- Decorative icons take `aria-hidden="true"`. Icons support labels — reserve icon-only buttons for universal actions, and give the parent an `aria-label` when the icon is the only content.
- Props named `icon` take the namespaced **string** `"lucide-edit"` or a Vue component: `Button`, `Dropdown` options, `Alert`, `Switch`, `Tabs` items. `Dialog` is the exception — its `icon` is a lucide string or `{ name, theme }` only, and a component renders nothing. `Badge` has no `icon` prop — put the span in its `#prefix` / `#suffix`.
- `<Icon :name />` renders a `lucide-*` string, an emoji, or a component. A bare name like `"home"` renders nothing.

## Page anatomy

Gray first: ink-gray on surface-base, colour only where it encodes information. Hierarchy comes from the ink ladder and the type scale; separate sections with a heading and `divide-y divide-outline-gray-1`. A border needs a reason: interactive affordance, overlay, or a distinct surface. One primary action per screen, usually in the page header; the rest `subtle` or `ghost`. At most one accent per screen. Repeating trailing elements (badges, timestamps) get a fixed-width column.

```html
<div class="h-screen w-full bg-surface-base text-ink-gray-8">
  <DesktopShell> <!-- :scroll="false" when inner panes own their own scroll -->
    <template #rail>…</template>      <!-- only multi-workspace apps -->
    <template #sidebar>
      <Sidebar width="14rem" class="border-r">
        <SidebarHeader title subtitle :show-logo :menu-items />
        <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
          <nav class="space-y-0.5">…SidebarLabel / SidebarItem…</nav>
        </ScrollArea>
      </Sidebar>
    </template>
    <PageHeader>…</PageHeader>   <!-- teleports to the pinned header target -->
    <div>…page body…</div>
  </DesktopShell>
</div>
```

- `DesktopShell` — prop `scroll` (default `true`; `false` for multi-pane layouts that own their scroll), slots `#rail`, `#sidebar`, default. `MobileShell` — slots default and `#nav`.
- Headers teleport into the shell's pinned target, so a `PageHeader` can sit anywhere in the page. `PageHeader` has a **default slot only** — a `#prefix` or `#suffix` template on it renders nothing, so the whole header row, actions included, goes in the default slot. `PageHeaderMobile` has a default slot (the centered title) plus `#prefix` and `#suffix`.
- `PageHeaderBase` is padding-free: use it when the header must split to align with a column border below (two-pane layouts, editor toolbars). The family also ships `PageHeaderTitle` (prop `title`, or a default slot that overrides it), `PageHeaderMobileTitle` and `PageHeaderBackButton`.
- Sidebar family: `Sidebar` (props `width`, `collapsedWidth`, `disableCollapse`), `SidebarHeader`, `SidebarSection`, `SidebarLabel`, `SidebarItem`, `SidebarCollapseToggle`, `SidebarCard` (a promotional footer card taking `title`, `description`, `theme`, `icon`, `action`, `dismissible`, emitting `dismiss`). `SidebarItem` is `h-7`; wrap a group in `space-y-0.5`, labels `flex-1 truncate text-sm`, count suffix `mr-1 text-xs text-ink-gray-5`.
- Also `Rail` / `RailItem`, `MobileNav` / `MobileNavItem`, `BottomSheet`, and the `SettingsDialog` family. On the rail, Home is a bespoke logo button (not a `RailItem`) and the user avatar sits in a bottom-pinned `Dropdown` trigger.
- `ScrollArea` owns every app-level scroll region. Props `orientation` (`vertical | horizontal | both`), `viewportClass`, `scrollHideDelay`; exposes `viewportElement`.
- There is no Card component. Build the surface from tokens: `bg-surface-base rounded-6 border border-outline-gray-1 p-4`.

Geometry: sidebar `14rem`; page header `min-h-12` (48px); gutters `px-3 sm:px-5`, the same pair on header, body and full-bleed rows; content width `max-w-[940px]` centered for reading pages, `max-w-[770px]` prose/editor, `max-w-4xl` dashboards, full-width for dense tables; stacks `space-y-6` sections, `space-y-11` settings sections, `space-y-4` form fields, `space-y-0.5` sidebar nav, `gap-2` inline actions; page body top `pt-5`/`mt-5`; every scroll area ends `pb-10` … `pb-40`. Gutter bleed is `-mx-3` on a `List` plus `list-row-px-3`, so the hover surface bleeds into the gutter while text stays aligned with the toolbar above.

### Mobile

```html
<MobileShell>  <!-- fixed inset-0, owns native scroll; slots: default and #nav -->
  <PageHeaderMobile title="Inbox">
    <template #prefix>…back chevron or menu opener…</template>
    <template #suffix>…actions…</template>
  </PageHeaderMobile>
  <div>…body…</div>
  <BottomSheet v-model:open="…" title="Spaces">…the desktop sidebar…</BottomSheet>
  <template #nav>
    <MobileNav>…4 `MobileNavItem`s; last is "You": an Avatar in the item…</MobileNav>
  </template>
</MobileShell>
```

Desktop → mobile: sidebar → `BottomSheet`; persistent nav → `MobileNav` tabs; panes → separate routes; action clusters → one `…` `Dropdown`; multi-value fields collapse (assignee list → single avatar, meta panel → chip row); titles scale up (`text-base` → `text-lg`); rows get taller (`h-15` → `h-17`). Mobile feed rows navigate on tap; `v-model:active` highlighting belongs to the desktop two-pane. Pinned footers take `[@media(display-mode:standalone)]:pb-[env(safe-area-inset-bottom)]`.

### Screen archetypes

| Archetype | Composition |
|---|---|
| **Feed list** | `List` in feed mode (no `:columns`), rows `h-15` desktop / `h-17` mobile, title + meta line, unread signal |
| **Data table** | `List` with `:columns` + `ListHeaderCellSort`, `:row-height="40–60"` |
| **Two-pane** | Split panes under a `PageHeaderBase`, `DesktopShell :scroll="false"`, `v-model:active` on the list |
| **Board** | Track `overflow-x-auto`; columns `w-72 shrink-0 rounded-6 bg-surface-gray-1`, each with its own `ScrollArea`; cards `rounded-6 border bg-surface-elevation-1 p-3` |
| **Compose / editor** | Focused page, no sidebar; `Editor` + `EditorFixedMenu` + `EditorContent` from `frappe-ui/editor`; prose column `max-w-[770px]` |
| **Detail + meta panel** | Its own route with the id as a route param (list ↔ detail is two routes); content column + right panel `w-[20rem] shrink-0 border-l` of label/control rows |
| **Settings** | `SettingsDialog`: `SettingsNavGroup` nav → header + body → `space-y-11 pt-6` sections → `divide-y divide-outline-gray-1` of `SettingsRow` |
| **Dashboard** | Centered `max-w-4xl space-y-6`; KPI strip of `NumberCard`s from `frappe-ui/charts`, charts below in a grid, each sized by its wrapper |

## Actions

Colour on a component is two props: `variant` (visual weight) and `theme` (hue). The value set differs per component; each entry below states its own.

### `Button`

Default for any trigger. `<Button :label icon iconLeft iconRight variant theme size loading disabled />`.

- `variant`: `solid | subtle | outline | ghost` (default `subtle`). `theme`: `gray | blue | green | red` (default `gray`). `size`: `xs | sm | md | lg` (default `sm`).
- Also `tooltip`, `loadingText`, `type` (`button | submit | reset`, default `button`).
- Navigation: `route` (a Vue Router target) or `link` (an external URL) — it renders the matching element with the right semantics.
- Icon-only: pass just `icon`. Leading icon: `iconLeft` + `label`.
- Primary action: `variant="solid" theme="gray"`. Destructive: `variant="solid" theme="red"` or `subtle theme="red"`.

### `Dropdown` / `ContextMenu`

Menu of actions anchored to a trigger. `Dropdown`'s default slot (or `#trigger`) is the trigger; it also builds one from a `button?: ButtonProps` object. Props: `options`, `button`, `v-model:open`, `side` (`top | right | bottom | left`, default `bottom`), `align` (`start | center | end`, default `start`), `offset` (number, default `4`), `matchTriggerWidth`, `portalTo`. Placement is `side` plus `align`. `ContextMenu` takes `options` and `v-model:open` only; its default slot is the right-clickable region.

`options` is **one flat array**; mix these shapes freely:

- action: `{ label, icon?, description?, onClick?, route?, disabled?, selected?, theme? }`
- group: `{ group: 'Label', options: [...], hideLabel? }` — the nested key is **`options`**. `{ group, items }` is a type error (`items?: never`) and renders nothing.
- submenu: `{ label, submenu: [...] }` · switch: `{ label, switch: true, switchValue?, onClick(value: boolean) }`

`theme` on a menu option is `gray | red` only (`MenuTheme`). Item slots: `#item-prefix`, `#item-label`, `#item-suffix`, `#item`, `#group-label`, `#empty`.

## Overlays

| Component | Trigger | Content | Other slots |
|---|---|---|---|
| `Dialog` | — (`v-model:open`) | default | `#title`, `#actions` |
| `Popover` | `#trigger` | default | — |
| `HoverCard` | `#trigger` | default | — |
| `Tooltip` | **default** | `#content` | — |
| `Dropdown` / `ContextMenu` | default or `#trigger` | the `options` prop | `#item-prefix`, `#item-label`, `#item-suffix`, `#group-label`, `#empty` |
| `PageHeader` | — | **default only** | — |
| `PageHeaderMobile` | — | default (the centered title) | `#prefix`, `#suffix` |

### `Dialog`

`v-model:open` is the canonical model (plain `v-model` / `modelValue` also works). Props: `title`, `message`, `icon` (a `lucide-*` string or `{ name, theme }`), `size` (`xs`…`7xl`, default `lg`), `position` (`center | top`), `paddingTop`, `actions`, `dismissible` (default `true`), `showCloseButton` (default `true`), `bare`.

- `actions` is an array of `ButtonProps` plus `label` and `onClick(ctx)`, where `ctx` is `{ close }`.
- `Dialog` has no `theme` prop. The colour lives on the icon object: `:icon="{ name: 'lucide-trash-2', theme: 'red' }"` — `DialogTheme` is `amber | blue | red | green`.
- `bare` drops the padded card, the auto-header and the auto-actions (full-bleed content).

### Imperative dialogs and toasts

`dialog.confirm`, `dialog.prompt` and `dialog.danger` each return a `DialogHandle` (`{ close }`) **synchronously**. Values and results arrive through callbacks.

```ts
import { dialog, toast } from 'frappe-ui'

dialog.danger({
  title: 'Delete this item?', message: 'This cannot be undone.', confirmLabel: 'Delete',
  onConfirm: async () => { await api.delete(id); toast.success('Deleted') },
})

dialog.prompt({
  title: 'Rename', fields: [{ name: 'title', label: 'Title', required: true }],
  onConfirm: ({ values }) => rename(values.title),
})
```

- `confirm(args)` — `title`, `message`, `confirmLabel` (default `'Confirm'`), `cancelLabel` (default `'Cancel'`), `theme`, `icon`, `size` (default `'md'`), `dismissible`, `onConfirm(ctx)`, `onCancel()`, `actions[]`. `ctx` is `{ close, setError }`, where `setError` takes a **message string** (or `null`), never an `Error`. Resolving `onConfirm` closes the dialog; rejecting renders the thrown error inline and re-enables the buttons, so call `setError` only when you catch the error yourself.
- `prompt(args)` — the same args plus a **required** `fields` and a **required** `onConfirm({ values, close, setError })`. `confirmLabel` defaults to `'Submit'`, `size` to `'md'`; it has no `actions`. A field is `{ name, label?, placeholder?, description?, required?, validate?, type?, defaultValue?, options? }` with `type` one of `text` (default), `textarea`, `select`, `checkbox`, `combobox`.
- `danger(args)` — the destructive preset: forces `theme: 'red'`, defaults the icon to `lucide-alert-triangle` and `confirmLabel` to `'Delete'`. Same args as `confirm` minus `theme` and `icon` (`DangerArgs = Omit<ConfirmArgs, 'theme' | 'icon'>`).
- Toasts: `toast.success | error | warning | info (message, { id?, description?, duration?, action? })` and `toast.dismiss(id?)`. Toasts report what already happened; decisions go to `dialog.confirm`. One action, one toast — when a user edits several related fields in the same record, pass the same stable `id` so the message replaces itself in place: `toast.success(message, { id: 'contact-saved' })`.
- Both imperative APIs render through `<FrappeUIProvider>`; mount it once ([SETUP.md](SETUP.md)).

### `Popover` / `Tooltip` / `HoverCard`

- `Popover` — arbitrary anchored content. `v-model:open`, `side`, `align`, `offset`, `bare`, `portalTo`. Trigger in `#trigger`, content in the default slot.
- `Tooltip` — hover hints: `<Tooltip text="Rename"><Button icon="lucide-pencil" /></Tooltip>`. Props `text`, `side`, `offset`, `hoverDelay` (seconds), `bare`, `disabled`; rich content goes in `#content`. Anything clickable belongs in `Popover` or `Dropdown` instead.
- `HoverCard` — hover-revealed rich previews (person cards, deal owners). `#trigger` plus the default slot.

## Input controls

Every input control **except `FileUploader`** accepts the shared labeling contract `InputLabelingProps`: `label`, `description`, `error` (`string | Error`), `required`, `id`. `Radio` is the one partial: it takes `label`, `description` and `id`, while `required` and `error` sit on `RadioGroup`.

Text-family sizes are `sm | md | lg | xl` (`InputSize`) and variants `subtle | outline | ghost` (`InputVariant`). Binary controls (`Checkbox`, `Radio`, `Switch`) take size `xs | sm | md` (`ToggleSize`).

### `FormControl`

The default for a labeled field, and a dispatcher: `type` picks the child component. Values are any `TextInputTypes` value (`text`, `email`, `number`, `password`, `search`, `tel`, `url`, `date`, `datetime-local`, `time`, `month`, `week`, `file`, `range`) plus `textarea`, `select`, `checkbox`, `combobox`, `multiselect`, `date`, `daterange`, `datetime`, `time`. Its own props are `label`, `description`, `error`, `required`, `size` (`sm | md`), `variant` (`subtle | outline`); type-specific props and the `v-model` shape follow the child component, so read that entry. Reach for a bare `TextInput` only inside a control you compose yourself.

```vue
<form class="mx-auto max-w-xl space-y-4 p-6" @submit.prevent="save">
  <FormControl v-model="form.title" label="Title" required :error="errors.title" />
  <FormControl v-model="form.priority" type="select" label="Priority" :options="priorityOptions" />
  <div class="flex justify-end gap-2 pt-2">
    <Button label="Cancel" @click="cancel" />
    <Button variant="solid" theme="gray" type="submit" :loading="saving" label="Save" />
  </div>
</form>
```

### The rest

- `TextInput` / `Textarea` / `Password` — single-line / multi-line / masked. `v-model` is `string | number` (`string` for `Textarea` and `Password`). Also `type` (`TextInput` only), `placeholder`, `disabled`, `debounce` (ms, `TextInput` / `Textarea`), `rows` (`Textarea`).
- `Select` — fixed list, one value. `v-model` is `string | number`; `options: Array<string | { label, value, disabled?, icon?, description? }>`. Also `placeholder`, `emptyText`, `open`, `side`, `align`, `offset`, `portalTo`.
- `MultiSelect` — fixed list, several values. `v-model` is `Array<string | number>`; `options` accepts `{ label, value, icon?, description?, disabled? }` and grouped entries `{ group, options, hideLabel? }`. Optional `v-model:query`.
- `Combobox` — one value with search. `v-model` is `string | number | null`; `options` take the same `{ label, value, icon?, description?, disabled? }` shape as `MultiSelect`, or a bare string, and group as `{ group, options }`. Optional `v-model:query` — the component owns the query when unbound. Also `placeholder`, `loading`, `emptyText`, `hideSearch`, `trigger` (`'input' | 'button'`, default `input`), and `filterable` (default `true`) — set `filterable="false"` whenever the options come from a server search, or the client re-filters the ranked results away.
- `Checkbox` / `Switch` / `Radio` — `v-model` plus `label`. `Checkbox` model is `boolean` (`1`/`0` still accepted) and adds `indeterminate`. `Switch` adds `controlPosition` (`start | end`, default `end`) and `icon`. `RadioGroup` holds the `v-model` (`string | number | boolean`) and `orientation` (`vertical | horizontal`), while `Radio` renders one option with a **required** `value` plus optional `disabled`. `Checkbox` and `Switch` take `padded` for a clickable row surface; on radios `padded` and `size` live on `RadioGroup` and are inherited, so `<Radio padded>` is ignored.
- `DatePicker` / `DateTimePicker` / `TimePicker` — `v-model` holds the value as a string. `DateRangePicker`'s `v-model` is `[from, to]` in `YYYY-MM-DD`, or `[]` when nothing is selected; it also takes `dualPane`.
- `Slider` — `v-model` is `number[]`: `[25]` for one thumb, `[20, 80]` for a range. Props `min`, `max`, `step`, `size` (`sm | md`); emits `value-commit` on drag end.
- `Rating` — `v-model` is a `number`. Props `max` (default 5), `step` (`1 | 0.5`).
- `Duration` — `v-model` is seconds (`number | null`). `format` is `short | long | colon` or a token template such as `hh:mm:ss`.
- `FileUploader` — Frappe-native upload. Props `fileTypes`, `private` (default `true`), `folder`, `doctype`, `docname`, `fieldname`, `optimize`, `validateFile`. Emits `success` with the uploaded File doc, and `failure`. It has no labeling props — render your own label around it.
- `ErrorMessage` — `<ErrorMessage :message="err" />`; `message` takes a string or an `Error`.
- `ItemListRow` — the shared row primitive behind `Dropdown`, `Select`, `Combobox` and `MultiSelect`. Use it when you compose a custom listbox or menu surface and want the design-system row shell with its prefix/label/suffix regions and `active` / `selected` / `disabled` states. Props `as`, `size` (`sm | md | lg | xl`), `active`, `selected`, `disabled`.

## Display

- `Badge` — status pill. `<Badge :label theme variant size />`. `variant` is `solid | subtle | outline | ghost`; `theme` is `gray | blue | green | amber | red | violet`; `size` is `sm | md | lg`. Icons go in `#prefix` / `#suffix`. Map status themes in one lookup: `({ open: 'blue', closed: 'gray', error: 'red', done: 'green' })[s] ?? 'gray'`. Unread count pill: `<Badge theme="amber" variant="solid" size="sm">{{ n }}</Badge>`.
- `Alert` — inline notice. `<Alert :title :description theme :icon :primary-action :secondary-action dismissible @dismiss />`. No layout prop: it renders a single-line row and switches to the stacked banner when `description` or `secondaryAction` is set, readable as `data-layout` (`"row"` / `"banner"`). `theme` (`gray | blue | green | amber | red`, default `gray`) colours the status icon; every theme auto-shows one, `:icon="false"` hides it, and a `lucide-*` string or component replaces it — the container never changes colour. Actions are `ButtonProps` plus `onClick({ dismiss })`. The component is stateless: `dismissible` shows a × that emits `dismiss`, and the parent hides the alert with `v-if`.
- `Avatar` — `<Avatar :label :image size shape theme />`. `label` generates the initials when there is no image. `size`: `xs | sm | md | lg | xl | 2xl | 3xl`. `shape`: `circle | square`. `theme`: `gray | blue | green | amber | red | violet`.
- `Progress` — `value` is **required**. Also `size` (`sm | md | lg | xl`), `label`, `hint`, `intervals` (turns it into a step indicator), `intervalCount`.
- `Spinner` / `LoadingIndicator` — inline spinners. `LoadingText` is a spinner plus one line of text; its only prop is `text?: string` (default `"Loading..."`), and it has no `lines` prop. `Skeleton` is the placeholder primitive: no props, size it with classes (`<Skeleton class="h-4 w-40" />`). First page load renders the shell with `Skeleton` in the content slots.
- `Divider` — `orientation` (`horizontal | vertical`) picks the axis. Also `position` (`start | center | end`), `flexItem`, `action`.
- `Breadcrumbs` — a **required** `items` array of `{ label, route?, href?, onClick? }`.
- `Tabs` — full content tabs. `v-model` holds a `TabValue` (`string | number`). Compose `TabList` + `TabTrigger :value` + `TabPanel :value`, or pass the `tabs` shorthand `[{ value, label, icon?, route? }]`. `variant`: `underline | subtle | ghost | browser-tab`. `size`: `sm | md`. `vertical` renders a side rail. (`v-model:tab` belongs to `SettingsDialog`, not `Tabs`.)
- `TabButtons` — inline segmented control. `v-model` plus `options: [{ value, label, icon? }]`, and `fluid` to stretch.
- `KeyboardShortcut` — `<KeyboardShortcut combo="Mod+K" />` renders a kbd combo (`Mod` is Cmd on macOS, Ctrl elsewhere). Register the shortcut itself with `useKeyboardShortcut({ combo: 'Mod+K', description, handler })`, and list them all with `KeyboardShortcutsDialog`.
- Combo grammar (`src/utils/keyboardShortcutCombo.ts`): `Mod+Ctrl+Alt+Shift+<Key>` — parts joined by `+`, modifiers only `Mod`/`Ctrl`/`Alt`/`Shift`, exactly one key name last.
- Key names: `A`–`Z`, `F1`–`F12`, `Digit0`–`Digit9`, `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight`, `Escape`, `Enter`, `Space`, `Tab`, `Backspace`, `Delete`, `Insert`, `Home`, `End`, `PageUp`, `PageDown`, and punctuation by name (`Slash`, `Minus`, `Equal`, `Comma`, `Period`, `Semicolon`, `Quote`, `Backtick`, `Backslash`, `BracketLeft`, `BracketRight`, `Plus`). The chip draws the glyph itself (`Escape` → `Esc`, `ArrowUp` → `↑`, `Enter` → `↵`), so never write the glyph or `Up`/`Down`/`Esc`: an unknown name renders as written and the combo never fires.

Colour encodes state, sign, severity or unread: status / priority / unread dots `bg-surface-{red,amber,blue,green}-7`; financial sign `text-ink-red-5` negative and `text-ink-green-5` positive; SLA / severity `ink-red-5/6`, `ink-green-5`, `ink-amber-6`.

### Empty state

```vue
<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <div class="rounded-full bg-surface-gray-2 p-3 text-ink-gray-5">
    <span class="lucide-inbox size-6" aria-hidden="true" />
  </div>
  <p class="text-base text-ink-gray-7">No tasks yet</p>
  <p class="text-sm text-ink-gray-5">Create one to get started.</p>
  <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New Task" class="mt-2" />
</div>
```

An empty region inside a dense screen can be one centered line instead: `px-3 py-10 text-center text-p-sm text-ink-gray-4`.

## `List` family (`frappe-ui/list`)

The list primitive for every list. Feed mode is the default; adding `:columns` and a `ListHeader` gives table mode.

`List` props:

- `columns?: string[]` — **CSS grid track sizes**, joined into the `--list-columns` template shared by the header and every row. Not column descriptors: `['minmax(0,1fr)', '11rem', '6rem']`. Default is the feed template `['auto', 'minmax(0,1fr)', 'auto']`. Table lists need deterministic sizes; an `auto` track sizes per row.
- `divider?: 'inset' | 'full' | 'none'` — `inset` on the feed template, `full` once `columns` is set.
- `selectable?: boolean` — reveals the checkbox column and switches row click from navigate to toggle.
- `rowHeight?: number` — px; required for virtualization.
- `v-model:selection` (`string[]`) and `v-model:active` (`string | undefined`). Binding `v-model:active` is what opts the list into active-row tracking.

The parts:

- `ListRow` — props `{ to?: RouteLocationRaw, value?: string, onClick? }`. `value` is the **row key**, required whenever the list uses `selectable` or `v-model:active`. There is no `row` prop; the row's content is app-written `<ListCell>` children.
- `ListRows` — props `{ items: T[], rowKey?: string | ((item, index) => PropertyKey), virtual?: boolean | { itemHeight?, overscan? } }`. Its scoped slot gives `{ item, index, value }`. `rowKey` defaults to the item's `name`, then `id`, then the index.
- `ListCell` — default slot only.
- `ListHeaderCell` — **the column label goes in the default slot**, not a prop. Optional `#prefix` / `#suffix`.
- `ListHeaderCellSort` — props `{ direction?: 'asc' | 'desc' | null, align?: 'start' | 'end' }`, emits `click`, label in the default slot, scoped `#suffix="{ direction }"` for a custom glyph. It is controlled: sort state and comparators are app code.
- `ListHeader` — default slot holds the header cells. Its presence flips the list into table semantics; there is no mode prop.
- `ListGroup` — props `{ label?: string, sticky?: boolean }`, slots `#header` and default.
- Geometry: the `list-gap-*` and `list-row-px-*` utilities, or the raw `--list-columns`, `--list-gap`, `--list-row-padding-x` CSS vars.

Row heights: `:row-height="40"` dense table → 44–60 medium → `h-15` desktop feed → `h-17` mobile feed. Use **one** height mechanism per list: either `:row-height` on the `List` or a height class on every `ListRow`.

```vue
<List :columns="['minmax(0,1fr)', '11rem', '6rem']" :row-height="60" selectable v-model:selection="selection">
  <ListHeader>
    <ListHeaderCell>Subject</ListHeaderCell>
    <ListHeaderCell>Assigned to</ListHeaderCell>
    <ListHeaderCellSort :direction="dir" align="end" @click="toggleSort">Modified</ListHeaderCellSort>
  </ListHeader>
  <ListRows :items="rows" v-slot="{ item, value }">
    <ListRow :value="value" @click="open(item)">
      <ListCell>{{ item.subject }}</ListCell>
      <ListCell>{{ item.owner }}</ListCell>
      <ListCell class="justify-end">{{ item.modified }}</ListCell>
    </ListRow>
  </ListRows>
</List>
```

## `Tree`

`<Tree :nodes :node-key="'key'" draggable :move guides />`. A node is `{ [nodeKey]: id, label?, children?, expanded? }` — `expanded` is per node and defaults to open. `guides`: `connectors | lines | none`.

## `Editor` (`frappe-ui/editor`)

TipTap-based rich text. `extensions` is **required**. The kits (`RichTextKit`, `CommentKit`, `InlineKit`) are extension **instances** — pass them uncalled; use `Kit.configure({...})` to set options. Also `format` (`html | json | markdown`, default `html`), `placeholder`, `editable`, `autofocus`, `uploadFunction`.

`Editor` is **renderless**: its template is one slot exposing `{ editor, isEmpty }` and it draws no UI, so a self-closing `<Editor … />` renders nothing. Put the chrome in the default slot:

```vue
<script setup>
import { ref } from 'vue'
import { Editor, EditorContent, EditorFixedMenu, RichTextKit,
         Bold, Italic, Separator, HeadingGroup, InsertLink } from 'frappe-ui/editor'
const content = ref('')
const toolbar = [HeadingGroup, Separator, Bold, Italic, InsertLink]
</script>

<template>
  <Editor v-model="content" :extensions="[RichTextKit]">
    <template #default="{ editor }">
      <EditorFixedMenu :editor="editor" :items="toolbar" />
      <EditorContent :editor="editor" />
    </template>
  </Editor>
</template>
```

`EditorFixedMenu` / `EditorBubbleMenu` / `EditorContent` take `editor` optionally — inside `<Editor>` they fall back to the provided context — but `items` is required on the menus.

`items` is a `MenuItem[]` of **objects**, never strings. Three shapes: a command item `{ icon?, label, action(editor), isActive?, isDisabled?, getLabel?, component?, isAvailable? }`; a group `{ type: 'group', label, items: [...] }`; and the literal separator `{ type: 'separator' }`. Import the ready-made ones from `frappe-ui/editor`: `Bold`, `Italic`, `Strike`, `InlineCode`, `BulletList`, `OrderedList`, `Blockquote`, `Paragraph`, `H1`…`H6`, `HeadingGroup`, `AlignLeft`, `AlignCenter`, `AlignRight`, `FontColor`, `FontHighlight`, `InsertImage`, `InsertVideo`, `InsertAttachment`, `InsertLink`, `InsertIframe`, `InsertTable`, `HorizontalRule`, `Undo`, `Redo`, `Separator`, and the `Table*` / `CellColor` items. Whole presets ship too: `minimalToolbar`, `commentToolbar`, `articleToolbar`, `tableToolbar`. Items whose extension is absent prune themselves, so one preset works across kits.

## `CommandPalette` (`frappe-ui/experimental`)

Seven parts: `CommandPalette` + `CommandPaletteInput` + `CommandPaletteList` + `CommandPaletteGroup` + `CommandPaletteItem` + `CommandPaletteEmpty` + `CommandPaletteFooter`. Groups and items go inside `CommandPaletteList`; the input, the empty state and the footer are its siblings.

- Root: `v-model:open`, `v-model:query`, `filterable` (default `true` — set `false` when a server search already decided what matches) and `title` (the accessible name, never drawn). Emits `select(value, event)`.
- `CommandPaletteItem`: **`value` is required** — it is what `select` reports. The visible label is the default slot; the `label` prop only feeds the client filter, so set it only when the default slot draws more than the label. Also `keywords?: string[]`, `disabled?`, `as?`. Icons go in `#prefix` and shortcut hints in `#suffix` (a `KeyboardShortcut`, so `combo="ArrowUp"` / `"Escape"`, never `"Up"` / `"Esc"`); neither is searchable.
- `CommandPaletteInput` takes `placeholder`; `CommandPaletteGroup` takes `label`.
- Register the opener yourself: `useKeyboardShortcut({ combo: 'Mod+K', description: 'Open command palette', allowInInput: true, handler })`. `allowInInput` is off by default, so without it the palette stops opening as soon as a field has focus.

## Charts and Calendar

`frappe-ui/charts` exports `BarChart`, `LineChart`, `AreaChart`, `DonutChart`, `FunnelChart`, `HeatmapChart`, `ScatterChart`, `SankeyChart`, `NumberCard`, plus the chrome `ChartCard`, `ChartContainer`, `ChartLegend`, `ChartTooltip`. Every chart takes `:data` (your rows) plus flat props that name the columns. The column names differ per family; everything below is required unless marked optional:

- `BarChart` / `LineChart` / `AreaChart` — `x`, `y` (`string | string[]` for several series); optional `series`, plus `horizontal` on `BarChart`
- `DonutChart` / `FunnelChart` — `category`, `value`
- `ScatterChart` — `x`, `y`; optional `size`, `series`
- `HeatmapChart` — `x`, `y`, `value`
- `SankeyChart` — `source`, `target`, `value`

Every chart also takes `title`, `subtitle`, `loading` and `error`, and draws its own header, tooltip and empty state, so pass `title` instead of drawing a heading above the chart. `BarChart`, `LineChart`, `AreaChart`, `DonutChart` and `ScatterChart` also draw their own legend; `FunnelChart`, `HeatmapChart` and `SankeyChart` draw none. Reach for `ChartLegend` / `ChartTooltip` only in a plot you draw yourself. There is no `height` prop: the chart root is `h-full`, so put the height on the wrapper (`<div class="h-80"><BarChart … /></div>`). `NumberCard` is the KPI tile, with **required** `title` and `value` (`number | string | null`) plus `prefix`, `suffix`, `delta`, `deltaSuffix`, `deltaCaption`, `negativeIsBetter`, `precision`, `compact`, `sparkline` and `card` (default `true`). `ChartCard` is that same card surface with a default slot.

`Calendar` is a day/week/month view imported from `frappe-ui/experimental`. `CalendarMode` is `'Day' | 'Week' | 'Month'`; an event is `{ id?, title?, fromDate/toDate, fromTime/toTime, participant?, venue?, color? }`.

## Names that moved

Old names that no longer resolve from `frappe-ui`, and what to write instead.

- `Autocomplete` → `Combobox` (one value) or `MultiSelect` (several). Removed in `1.0.0`, along with `FormControl type="autocomplete"`.
- `ListView` → the `List` / `ListRow` / `ListCell` family from `frappe-ui/list`. The config-driven `ListView` still exists on `frappe-ui/experimental`, unstable, until `frappe-ui/list` reaches parity.
- `TextEditor` and its menu components → `Editor` from `frappe-ui/editor`. The v0 family is parked on `frappe-ui/experimental`.
- `Input` → `TextInput`, `Textarea`, `Select`, `Checkbox`, or `FormControl`.
- `ListItem` → list primitives from `frappe-ui/list`, or app-written row markup.
- `Card` → build the surface from tokens (see Page anatomy).
- `ConfirmDialog` / `confirmDialog` → `dialog.confirm(...)`. The `Toast` SFC → the imperative `toast(...)` API.
- `FeatherIcon` → a `lucide-*` class string, or the `Icon` component.
- `MonthPicker` → `Select`.
- `CircularProgressBar` → `Progress` for a linear bar. There is no radial progress component in `1.0`; copy the old SFC into your app if you need the arc.
- `useShortcut` → `useKeyboardShortcut`; `KeyboardShortcutsModal` → `KeyboardShortcutsDialog`.
- `AxisChart` / `NumberChart` / `ECharts` → the `frappe-ui/charts` family. The old charts are parked on `frappe-ui/experimental`.
- `Badge theme="orange"` → `theme="amber"`.
