# Dialog

A window over the page for a message, a form or a decision. To ask a quick
question from code without placing a `<Dialog>` in the template, use the
`dialog.*` functions.

<ComponentPlayground name="Dialog" />

## Examples

### Share a document

A rich body in `#default` with `Dropdown`s inside it, and an `#actions` row
with a status on the left and the main button on the right.

<ComponentPreview name="Dialog-Share" />

### New project setup

One dialog, three steps. The body, `title`, `dismissible` and the main button
change with the step, while the dialog itself opens only once.

<ComponentPreview name="Dialog-Wizard" />

### Command palette

`bare` removes the padded card, the header and the action row, so the content
draws its own layout.

<ComponentPreview name="Dialog-CommandPalette" />

### Rename and delete from a list

`dialog.prompt` asks for the new name and checks it. `dialog.danger` confirms
the delete. Each button shows a spinner until its `onConfirm` finishes.

<ComponentPreview name="Dialog-ProjectActions" />

## Behavior

### Header

The header renders when there is a `title` or a `#title` slot. `message` is
the short paragraph under it, and screen readers read it out when the dialog
opens. Anything longer than a sentence belongs in `#default`, which replaces
`message`.

`icon` takes a `lucide-*` class name or a component. `theme` colors the badge
behind it: `amber`, `blue`, `red` or `green`, and gray when unset. A `theme`
without an `icon` shows no badge.

```vue
<Dialog title="Delete project" icon="lucide-alert-triangle" theme="red" />
```

### Parts for a bare dialog

`Dialog.Title`, `Dialog.Description` and `Dialog.Close` are the parts the
header and action row are built from. Use them inside `#default` when you draw
your own layout. A `bare` dialog has no header, so it needs `Dialog.Title` for
its accessible name.

```vue
<Dialog v-model:open="open" bare>
  <div class="p-6">
    <Dialog.Title class="text-2xl-semibold">Pick a workspace</Dialog.Title>
    <Dialog.Description>This is where new pages go.</Dialog.Description>
    <Dialog.Close as-child><Button label="Not now" /></Dialog.Close>
  </div>
</Dialog>
```

### Opening a dialog from code

`dialog.confirm`, `dialog.danger` and `dialog.prompt` open a dialog and return
right away. They need `<Dialogs />` somewhere in the app, which
`FrappeUIProvider` already mounts.

- **`dialog.confirm`** shows a message with a confirm and a cancel button.
  Pass `actions` for more than two buttons. Each action takes `Button` props
  and its own `onClick`. While one `onClick` runs, its button shows a spinner
  and the others are disabled. An error thrown from it shows inside the
  dialog.
- **`dialog.danger`** is `dialog.confirm` for actions that cannot be undone.
  It sets `theme: 'red'`, a warning icon and a "Delete" button label, and
  accepts everything `confirm` does.
- **`dialog.prompt`** asks for input through `fields`. Each field renders
  through `FormControl`, so any `FormControl` `type` works. A field's
  `validate` function runs after the `required` check and returns an error
  message, or `null` when the value is fine. Its second argument holds every
  field's value, so one field can check another.

### Space above the dialog

`paddingTop` sets the space above the dialog. It takes a number of pixels or a
CSS length: `:padding-top="80"` or `padding-top="20vh"`.

<!-- @include: ./Dialog.api.md -->
