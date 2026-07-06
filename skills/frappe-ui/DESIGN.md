# Designing Frappe apps

The design language of a Frappe app, distilled from Gameplan, CRM, Helpdesk,
Drive, Insights and the recipe screens that reproduce them
(`docs/components/recipes/*.vue`, live at ui.frappe.io/recipes). When unsure
how something should look, copy from a recipe or a shipping app — don't
invent. Component APIs: [COMPONENTS.md](COMPONENTS.md); tokens:
[TOKENS.md](TOKENS.md).

## Principles

1. **Gray first.** Ink-gray on surface-base; color only where it encodes
   information (see Color). Primary button is `solid` + `gray`.
2. **Hierarchy through ink, not boxes.** Ink ladder + type scale, section
   heading + `divide-y divide-outline-gray-1` — not boxed cards. Borders must
   earn their place (interactive affordance, overlay, distinct surface).
3. **One primary action per screen**, usually in the page header; the rest
   `subtle` or `ghost`.
4. **Dense but breathable.** 13–14px body, 40–60px rows, 48px header,
   generous bottom padding on scroll areas.
5. **Alignment over flow.** Repeating trailing elements (badges, timestamps)
   get fixed-width columns, not ragged flex rows.
6. **Icons support labels, never replace them** — icon-only buttons only for
   universal actions (×, …). Decorative icons are noise.
7. **At most one accent per screen** — a single unread dot in a gray list, not
   a palette.

## App anatomy

Desktop:

```html
<div class="h-screen w-full bg-surface-base text-ink-gray-9">
  <DesktopShell> <!-- :scroll="false" when an inner ScrollArea owns scrolling -->
    <template #rail>…</template>      <!-- only multi-workspace apps -->
    <template #sidebar>
      <Sidebar width="14rem" class="border-r">
        <SidebarHeader title subtitle logo :menu-items />
        <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
          …SidebarGroup / SidebarItem…
        </ScrollArea>
      </Sidebar>
    </template>
    <PageHeader>…</PageHeader>   <!-- teleports to the pinned header target -->
    <div>…page body…</div>
  </DesktopShell>
</div>
```

- Sidebar nav items: `h-7`, `space-y-0.5`, labels `flex-1 truncate text-sm`,
  count suffix `mr-1 text-xs text-ink-gray-5`.
- Rail: Home is a bespoke logo button (not a `RailItem`); user avatar
  `Dropdown` pins to the bottom.
- `PageHeaderBase` (padding-free) when the header must split to align with a
  column border below (two-pane layouts, editor toolbars).

Mobile:

```html
<MobileShell>  <!-- owns height; no h-screen wrapper -->
  <PageHeaderMobile title>
    <template #left>…back chevron or menu opener…</template>
    <template #right>…actions…</template>
  </PageHeaderMobile>
  <div>…body…</div>
  <BottomSheet v-model:open="…">…whatever lived in the desktop sidebar…</BottomSheet>
  <template #nav>
    <MobileNav>…4 tabs; last is "You": an Avatar with an active ring…</MobileNav>
  </template>
</MobileShell>
```

## Screen archetypes

Each has a recipe as reference. List ↔ detail is two routes with the id as a
param, not one component with a screen toggle.

| Archetype | Composition |
|---|---|
| **Feed list** | `List` in feed mode, rows `h-15` desktop / `h-17` mobile, title + meta line, unread signal |
| **Data table** | `List` with `:columns` + `ListHeaderCellSort`, `:row-height="40–60"`; sort state and comparators are app code |
| **Two-pane** | Split panes under a `PageHeaderBase`, `:scroll="false"` |
| **Board** | `ScrollArea orientation="horizontal"`, columns on `bg-surface-gray-1`, cards on `bg-surface-elevation-1` |
| **Compose / editor** | Focused page, no sidebar; `Editor` + `EditorFixedMenu`; prose column `max-w-[770px]` |
| **Detail + meta panel** | Content column + right panel `w-[20rem] shrink-0 border-l` of label/control rows |
| **Settings** | `SettingsDialog`: nav groups → header + body → `space-y-11 pt-6` sections → `divide-y divide-outline-gray-1` of `SettingsRow` |
| **Dashboard** | Centered `max-w-4xl space-y-6`; KPI strip as `divide-x divide-outline-gray-2` |

## Hierarchy

Ink ladder by role — pick by role, not by eye:

| Token | Role |
|---|---|
| `ink-gray-9` | page default, strongest values (unread titles, KPI figures) |
| `ink-gray-8` | titles, headings, primary content |
| `ink-gray-7` | secondary values, table cells, descriptions |
| `ink-gray-6` | field labels, form icons |
| `ink-gray-5` | timestamps, counts, captions, meta |
| `ink-gray-4` | ids (`tabular-nums`), decorative glyphs |

Type by role (prefer composites like `text-base-semibold` over size + weight):

- Row title: `text-base` desktop / `text-lg` mobile; unread → `-semibold`.
- Meta: `text-sm` desktop / `text-md` mobile, always `ink-gray-5`, `mt-1.5`
  below the title.
- Section headings `text-lg-semibold`; page titles `text-2xl`+; prose
  `text-p-base text-ink-gray-8`.

Row heights: `:row-height="40"` dense table → 44–60 medium → `h-15` desktop
feed → `h-17` mobile feed. One mechanism per list.

Icons: `size-4` default, `size-3.5` inline meta, `size-5` mobile row leading,
`size-2`/`size-1.5` status dots.

## Color

Gray everywhere, except where color encodes meaning:

- Status / priority / unread dots: `bg-surface-{red,amber,blue,green}-7`.
- Financial sign: `text-ink-red-6` negative, `text-ink-green-6` positive.
- SLA / severity: `ink-red-6/7`, `ink-green-6`, `ink-amber-7`.
- Status badges: `<Badge :label="status" :theme="statusTheme(status)" variant="subtle" />`
  with themes mapped in one lookup:
  `({ open: 'blue', closed: 'gray', error: 'red', done: 'green' })[s] ?? 'gray'`.
- Unread count pill: `grid h-4 min-w-4 place-content-center rounded-full
  bg-amber-600 px-1 text-xs text-white dark:bg-dark-amber-500`.

Not encoding state, sign, severity, or unread? Then it's gray.

## Geometry

- Sidebar `14rem`; page header `min-h-12` (48px).
- Gutters `px-3 sm:px-5` — same pair on header, body, full-bleed rows.
- Content width: reading pages `max-w-[940px]` centered; prose/editor
  `max-w-[770px]`; dashboards `max-w-4xl`; dense tables may run full-width.
- Gutter bleed: `-mx-3` on a `List` + `list-row-px-3` — hover surface bleeds
  into the gutter, text stays aligned with the toolbar above.
- Stacks: sections `space-y-6`, settings sections `space-y-11`, form fields
  `space-y-4`, sidebar nav `space-y-0.5`, inline actions `gap-2`.
- Top of a page body `pt-5`/`pt-6`; bottom of every scroll area `pb-10` …
  `pb-40`.

## Desktop → mobile

Systematic translation, not a separate design:

- Sidebar → `BottomSheet`; persistent nav → `MobileNav` tabs; panes →
  separate routes.
- Action clusters → one `…` `Dropdown`; multi-value fields collapse (assignee
  list → single avatar, meta panel → chip row).
- Titles scale up (`text-base` → `text-lg`), rows get taller (`h-15` → `h-17`).
- Drop the active-row highlight — tapping drills in.
- Section cards go flush: border/rounding/padding only at `sm:`+.
- Pinned footers:
  `[@media(display-mode:standalone)]:pb-[env(safe-area-inset-bottom)]`.
- Same data on both — trim fields, don't fork the model.

## Patterns

### Form page

```vue
<form class="mx-auto max-w-xl space-y-4 p-6" @submit.prevent="save">
  <FormControl v-model="form.title" label="Title" required :error="errors.title" />
  <FormControl v-model="form.description" type="textarea" label="Description" description="Markdown supported." />
  <FormControl v-model="form.priority" type="select" label="Priority" :options="priorityOptions" />
  <div class="flex justify-end gap-2 pt-2">
    <Button label="Cancel" @click="cancel" />
    <Button variant="solid" theme="gray" type="submit" :loading="saving" label="Save" />
  </div>
</form>
```

One column, `space-y-4`. Every field uses `FormControl` (or a direct control)
with `label` + `error`. Submit pair: secondary `Cancel` left, primary `Save`
right.

### API calls

Always `useCall` (or `useList` / `useDoc`) — never raw `fetch` / `axios`.
Read = auto-fetch on mount; write = `immediate: false` + `submit(params)`.
Bind `.loading` to `<Button :loading>`, render `.error?.message` next to the
form. Examples: [COMPONENTS.md](COMPONENTS.md) → Data & resources.

### Confirmation flow

```ts
dialog.confirm({
  title: 'Delete this item?',
  message: 'This cannot be undone.',
  theme: 'red',
  confirmLabel: 'Delete',
  onConfirm: async ({ close }) => {
    await api.delete(id)
    toast.success('Deleted')
  },
})
```

Never build your own confirm `<Dialog>`.

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

### Toasts

`toast.success('Saved')` after writes, `toast.error(err.message)` for
failures, `toast.info(...)` for neutral notices. Never for decisions — that's
`dialog.confirm`.

### Loading states

- Buttons: `<Button :loading="saving" />`.
- Inline: `<LoadingIndicator />` / `<Spinner />`; skeleton text
  `<LoadingText :lines="3" />`.
- First page load: render the shell with `LoadingText` placeholders in
  content slots — don't blank the screen.

### Dark-mode check

Before calling a screen done, toggle `[data-theme="dark"]` on `<html>` and
verify. Semantic tokens only → it should just work.
