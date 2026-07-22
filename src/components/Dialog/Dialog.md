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
