# Dialog

A flexible overlay for showing messages, forms, or actions. Keeps focus on content while allowing clear, user-friendly interactions.

## Destructive confirm
<ComponentPreview name="Dialog-Confirm" />

## Create / edit form
<ComponentPreview name="Dialog-Custom" />

## State-driven actions
<ComponentPreview name="Dialog-Modal" />

## Action layout

A single action on a small dialog (`xs`, `sm`, `md`) renders full-width.
Everything else sits side-by-side at natural width, right-aligned. Using the
`#actions` slot opts out — you own the layout.

<ComponentPreview name="Dialog-ActionsLayout" />

## Single-CTA form
<ComponentPreview name="Dialog-Interactive" />

## Auto-focus a field
<ComponentPreview name="Dialog-Autofocus" />

## Full-canvas (`bare`)
<ComponentPreview name="Dialog-Bare" />

## Master / detail browser
<ComponentPreview name="Dialog-Browse" />

## Imperative API

The `dialog.*` helpers cover the confirm-family surface — `confirm` and
the `danger` preset — without mounting a `<Dialog>` yourself.

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


<!-- @include: ../../../meta/Dialog.md -->
