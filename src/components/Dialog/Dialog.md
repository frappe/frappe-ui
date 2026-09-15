# Dialog

A flexible overlay for showing messages, forms, or actions. Keeps focus on content while allowing clear, user-friendly interactions.

## Playground

<ComponentPlayground name="Dialog" />

## Share

A typical real-world dialog — rich `#default` body, an action-row `#actions`
slot that mixes a left-side status with a right-side CTA, and `Dropdown`s
nested inside the body for inline role changes.

<ComponentPreview name="Dialog-Share" />

## Multi-step wizard

One `<Dialog>` instance, four steps. The body content swaps with internal
state while the dialog only animates in once; the `title`, `dismissible`
flag, and primary CTA all react to the current step.

<ComponentPreview name="Dialog-Wizard" />

## Full canvas (`bare`)

`bare: true` strips all auto-chrome — no padded card, no auto-header, no
auto-actions. Pair it with `Dialog.Title` for an accessible heading when
you don't want visual chrome. A command palette is the canonical reason
to reach for it.

<ComponentPreview name="Dialog-CommandPalette" />

## Icon and theme

`icon` takes a `lucide-*` class name or a Vue component, and `theme` colors the
badge behind it: `amber`, `blue`, `red` or `green`. Unset, the badge stays
neutral gray. The two props are independent — a themed dialog with no icon
renders no badge.

```vue
<Dialog title="Delete project" icon="lucide-alert-triangle" theme="red" />
<Dialog title="Invite sent" :icon="MailIcon" theme="green" />
```

The header renders only when there is a `title` or a `#title` slot. `message`
is the short paragraph below it, and it renders through reka's
`DialogDescription`, so screen readers announce it with the dialog. Anything
longer than a sentence belongs in `#default`, which replaces `message`.

## The parts

`Dialog.Title`, `Dialog.Description` and `Dialog.Close` are reka's own parts,
re-exported on the component and public. Reach for them inside `#default` when
you render your own chrome — with `bare`, most of all, where there is no
auto-header to carry the accessible name.

```vue
<Dialog v-model:open="open" bare>
  <div class="p-6">
    <Dialog.Title class="text-2xl-semibold">Pick a workspace</Dialog.Title>
    <Dialog.Description>This is where new pages go.</Dialog.Description>
    <Dialog.Close as-child><Button label="Not now" /></Dialog.Close>
  </div>
</Dialog>
```

## Styling

`paddingTop` overrides the position-based top padding, and takes a number
(pixels) or any CSS length string: `:padding-top="80"` and
`padding-top="20vh"` both work.

Style the rest through the `data-slot` hooks:

| Hook                     | Element                          |
| ------------------------ | --------------------------------- |
| `[data-slot="content"]`  | the dialog card itself           |
| `[data-slot="icon"]`     | the header icon badge            |
| `[data-slot="actions"]`  | the footer action row            |

## Imperative API

The `dialog.*` helpers cover the confirm-family surface — `confirm` and
the `danger` preset — without mounting a `<Dialog>` yourself. In real apps
`<Dialogs />` is mounted by `FrappeUIProvider`, the same component that
hosts the toast viewport, so no extra setup is needed.

Pass an `actions` array to `dialog.confirm` (or `dialog.danger`) when a
flow needs more than the default confirm + cancel pair. Each action accepts
full `Button` props and its own awaited `onClick`; the clicked button shows
a loading spinner while its handler is pending and every other button is
disabled until it settles. Throwing from `onClick` surfaces inline via the
shared error region.

`dialog.danger` is a one-line preset for irreversible actions. It forces
`theme: 'red'`, defaults the icon to a warning triangle, and defaults
`confirmLabel` to `'Delete'`. Everything `confirm` accepts (including
`actions[]`) is forwarded through.

<ComponentPreview name="Dialog-Imperative" />

## Prompt

`dialog.prompt` collects structured input through a `fields[]` array. Each
field renders through `FormControl`, so any `FormControl` `type` works —
including `text`, `select`, `checkbox`, and `combobox`. For combobox fields,
`allowCreate` passes the typed query through as the value when nothing in
the list matches — handy for category-style fields where users can add new
entries inline.

Each field can also declare a `validate` function. It runs after the
built-in `required` check, in parallel across all fields, and returns a
non-empty string to mark the field invalid (shown inline below it) or
`null` for valid. The second argument is a snapshot of every field's
current value, so validators can reference siblings. The submit button keeps
its loading state while async validators settle.

<ComponentPreview name="Dialog-Prompt" />


<!-- @include: ./Dialog.api.md -->
