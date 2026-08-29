# Designing Frappe apps

The design language of Gameplan, CRM, Helpdesk, Drive and Insights. When
unsure how something should look, copy a recipe or one of those apps rather
than invent. Recipes: `docs/components/recipes/*.vue`, live on the
ui.frappe.io home page, one demo per `/recipes/demo/<slug>`. Component APIs:
[COMPONENTS.md](COMPONENTS.md); tokens: [TOKENS.md](TOKENS.md).

## Principles

1. **Gray first.** Ink-gray on surface-base; color encodes information (see
   Color).
2. **Hierarchy through ink.** Ink ladder plus type scale; separate sections
   with a heading and `divide-y divide-outline-gray-1`. A border needs a
   reason: interactive affordance, overlay, or a distinct surface.
3. **One primary action per screen**, usually in the page header; the rest
   `subtle` or `ghost`.
4. **Dense but breathable.** Compact type, short rows, generous bottom padding
   on every scroll area.
5. **Alignment over flow.** Repeating trailing elements (badges, timestamps)
   get a fixed-width column.
6. **Icons support labels.** Reserve icon-only buttons for universal actions.
7. **At most one accent per screen** — a single unread dot in a gray list.

## App anatomy

Desktop:

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

- Headers teleport into the shell's pinned target, so a `PageHeader` can sit
  anywhere in the page.
- Sidebar nav: `SidebarItem` is `h-7`; wrap a group in `space-y-0.5`. Labels
  `flex-1 truncate text-sm`, count suffix `mr-1 text-xs text-ink-gray-5`.
- Rail: Home is a bespoke logo button (not a `RailItem`); the user avatar sits
  in a bottom-pinned `Dropdown` trigger.
- `PageHeaderBase` (padding-free) when the header must split to align with a
  column border below (two-pane layouts, editor toolbars).

Mobile:

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

## Screen archetypes

Each has a recipe as reference. List ↔ detail is two routes; the id is a route
param.

| Archetype | Composition |
|---|---|
| **Feed list** | `List` in feed mode (no `:columns`), rows `h-15` desktop / `h-17` mobile, title + meta line, unread signal |
| **Data table** | `List` with `:columns` + `ListHeaderCellSort`, `:row-height="40–60"` |
| **Two-pane** | Split panes under a `PageHeaderBase`, `DesktopShell :scroll="false"`, `v-model:active` on the list |
| **Board** | Track `overflow-x-auto`; columns `w-72 shrink-0 rounded-6 bg-surface-gray-1`, each with its own `ScrollArea`; cards `rounded-6 border bg-surface-elevation-1 p-3` |
| **Compose / editor** | Focused page, no sidebar; `Editor` + `EditorFixedMenu` + `EditorContent` from `frappe-ui/editor`; prose column `max-w-[770px]` |
| **Detail + meta panel** | Content column + right panel `w-[20rem] shrink-0 border-l` of label/control rows |
| **Settings** | `SettingsDialog`: `SettingsNavGroup` nav → header + body → `space-y-11 pt-6` sections → `divide-y divide-outline-gray-1` of `SettingsRow` |
| **Dashboard** | Centered `max-w-4xl space-y-6`; KPI strip as `divide-x divide-outline-gray-2` |

## Hierarchy

Ink ladder by role:

| Token | Role |
|---|---|
| `ink-gray-9` | strongest values only: unread row titles, KPI figures |
| `ink-gray-8` | body copy, row titles, section headings, primary content |
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
feed → `h-17` mobile feed. One mechanism per list: either `:row-height` on the
`List` or a height class on every `ListRow`.

Icon size by role — this ladder is the one place sizes are assigned:
`size-4` default (buttons, sidebar items, header actions), `size-3.5` inline
meta beside `text-sm`, `size-5` mobile row leading, `size-6` empty-state
glyphs, `size-2`/`size-1.5` status and unread dots.

## Color

Gray is the default. Reach for a chromatic token when it encodes state, sign,
severity or unread:

- Status / priority / unread dots: `bg-surface-{red,amber,blue,green}-7`.
- Financial sign: `text-ink-red-5` negative, `text-ink-green-5` positive.
- SLA / severity: `ink-red-5/6`, `ink-green-5`, `ink-amber-6`.
- Status badges: `<Badge :label="status" :theme="statusTheme(status)" variant="subtle" />`
  with themes mapped in one lookup:
  `({ open: 'blue', closed: 'gray', error: 'red', done: 'green' })[s] ?? 'gray'`.
- Unread count pill: `<Badge theme="amber" variant="solid" size="sm">{{ n }}</Badge>`.

## Geometry

- Sidebar `14rem`; page header `min-h-12` (48px).
- Gutters `px-3 sm:px-5` — the same pair on header, body, and full-bleed rows.
- Content width: reading pages `max-w-[940px]` centered; prose/editor
  `max-w-[770px]`; dashboards `max-w-4xl`; dense tables may run full-width.
- Gutter bleed: `-mx-3` on a `List` plus `list-row-px-3` — the hover surface
  bleeds into the gutter while text stays aligned with the toolbar above.
- Stacks: sections `space-y-6`, settings sections `space-y-11`, form fields
  `space-y-4`, sidebar nav `space-y-0.5`, inline actions `gap-2`.
- Page body top `pt-5`/`mt-5`; every scroll area ends `pb-10` … `pb-40`.

## Desktop → mobile

- Sidebar → `BottomSheet`; persistent nav → `MobileNav` tabs; panes →
  separate routes.
- Action clusters → one `…` `Dropdown`; multi-value fields collapse (assignee
  list → single avatar, meta panel → chip row).
- Titles scale up (`text-base` → `text-lg`), rows get taller (`h-15` → `h-17`).
- Mobile feed rows navigate on tap; `v-model:active` highlighting belongs to
  the desktop two-pane.
- Pinned footers:
  `[@media(display-mode:standalone)]:pb-[env(safe-area-inset-bottom)]`.
- Both breakpoints read the same model; mobile trims which fields it shows.

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

One column, `space-y-4`. Submit pair: secondary `Cancel` left, primary right.

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

An empty region inside a dense screen can be one centered line instead:
`px-3 py-10 text-center text-p-sm text-ink-gray-4`.

### Toasts

Toasts report what already happened. Decisions go to `dialog.confirm`.

One action, one toast. When a user edits several related fields in the same
record, reuse one toast: pass the same stable `id` so the message replaces
itself in place: `toast.success(message, { id: 'contact-saved' })`.
Better still, batch the writes and show one toast when they settle. Use
separate toasts for unrelated actions, or for a failure that the user must see
next to the success it replaced.

### Loading states

- Buttons: `<Button :loading="saving" />`.
- Inline: `<LoadingIndicator />` or `<Spinner />`; with a caption,
  `<LoadingText text="Loading…" />`.
- First page load: render the shell with `Skeleton` placeholders in the content
  slots.
