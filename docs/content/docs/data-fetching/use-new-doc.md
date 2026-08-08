# useNewDoc

`useNewDoc` holds a reactive draft of a document you haven't created yet, and
submits it as an insert. Use it for a "new document" form; once submitted, read
the created document through [`useDoc`](./use-doc.md).

## Basic example

```vue
<template>
  <TextInput v-model="todo.doc.description" label="Description" />
  <Button :loading="todo.loading" @click="save"> Create </Button>
</template>

<script setup>
import { useNewDoc } from 'frappe-ui'

const todo = useNewDoc('ToDo', { status: 'Open' })

async function save() {
  const doc = await todo.submit()
  console.log(doc.name)
}
</script>
```

## Options

`useNewDoc(doctype, initialValues?, options?)`

- `doctype` — the DocType to create a document for.
- `initialValues` — the draft's starting field values, made reactive as `doc`.
  Server-managed fields (`creation`, `modified`, `owner`, `modified_by`) are
  excluded from the type.
- `options` — the same options as [`useCall`](./use-call.md), minus `url`,
  `method`, `params` and `immediate` (all fixed: a `POST` to create a document
  from `doc`, not fired until `submit()` is called).

## Return value

Everything [`useCall`](./use-call.md) returns — `data`, `error`, `loading`,
`execute`/`fetch`/`reload`, `reset`, `abort`, and so on — for the underlying
insert request, plus:

- `doc` — the reactive draft. Bind form fields to it directly; `submit()` reads
  whatever it currently holds.
- `submit()` — inserts `doc`, ignoring any params argument. On success, the
  created document (including server-assigned fields like `name`) is written
  into the shared store `useDoc` reads from, and the promise resolves with it.

```vue
<script setup>
import { useDoc, useNewDoc } from 'frappe-ui'

const draft = useNewDoc('ToDo', { description: 'Ship the release' })
const created = await draft.submit()

// created.name is already in the shared cache, so `todo.doc` reads it
// straight away — useDoc still fires its own GET in the background
const todo = useDoc({ doctype: 'ToDo', name: created.name })
</script>
```
