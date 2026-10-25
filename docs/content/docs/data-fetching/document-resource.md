# Document Resource

`createDocumentResource` fetches one document from a Frappe backend and gives
you methods to update, save and delete it, and to run its controller methods.
It is the older data-fetching API and stays supported through `1.x`.

For new code, use [`useDoc`](./use-doc).

## Composition API

Set `doctype` and `name`. The document is fetched when the resource is created
and is available on `todo.doc`.

```vue
<template>
  <div v-if="todo.doc">
    {{ todo.doc.description }}
    <Badge :label="todo.doc.status" />
    <Button @click="todo.setValue.submit({ status: 'Closed' })">
      Mark as closed
    </Button>
    <Button @click="todo.sendEmail.submit({ email: todo.doc.owner })">
      Send email
    </Button>
  </div>
</template>

<script setup>
import { createDocumentResource } from 'frappe-ui'

const todo = createDocumentResource({
  doctype: 'ToDo',
  name: 'TODO-0001',
  whitelistedMethods: {
    sendEmail: 'send_email',
  },
})
</script>
```

The resource sends dotted method names like `frappe.client.get`, so the app
must use [`frappeRequest`](./resource#frappe-backend) as its fetcher.

There is one resource for each `doctype` and `name`. A second
`createDocumentResource` call for the same document returns the same object.

## Options API

With `app.use(FrappeUI, { resources: true })` in `main.js` (see
[Resource](./resource#options-api)), declare the resource with
`type: 'document'`. It is available on `this.$resources.todo`.

```vue
<script>
export default {
  resources: {
    todo() {
      return {
        type: 'document',
        doctype: 'ToDo',
        name: this.todoName,
      }
    },
  },
}
</script>
```

## API Reference

### Options

| Option | Default | Description |
| --- | --- | --- |
| `doctype` | | The DocType of the document. Required. |
| `name` | | The name of the document. Required. |
| `auto` | `true` | Fetch the document when the resource is created. |
| `whitelistedMethods` | | Controller methods to expose as resources, like `{ sendEmail: 'send_email' }`. See [Whitelisted methods](#whitelisted-methods). |
| `debounce` | `500` | Wait time in milliseconds for `setValueDebounced`. |
| `realtime` | `false` | Fetch the document again when the server reports that it changed. Needs a socket on `this.$socket`, so it works only in the Options API. |
| `onSuccess(doc)` | | Runs after the document loads. |
| `onError(error)` | | Runs when loading the document fails. |
| `transform(doc)` | | Changes the document before it is set on `doc`. |
| `setValue` | | Object with `onSuccess`, `onError` and `validate` for `setValue`, `setValueDebounced` and `save`. Throw in `validate` to stop the request. |
| `delete` | | Object with `onSuccess` and `onError` for `delete`. |

### Properties

| Property | Description |
| --- | --- |
| `doc` | The document, after `transform`. `null` until it loads. |
| `originalDoc` | A copy of the document as last loaded or saved. |
| `isDirty` | `true` when `doc` differs from `originalDoc`. |
| `get` | The [resource](./resource#properties) that fetches the document. Read `get.loading`, `get.error` and `get.promise` here. |

### Methods

| Method | Description |
| --- | --- |
| `reload()` | Fetch the document again. Returns a promise. |
| `setDoc(doc)` | Replace `doc`. Pass a function to compute it from the current document. |

### Write resources

Each of these is a [resource](./resource#methods) with its own `loading` and
`error`. Call `submit()` to run it.

| Resource | `submit()` argument | Description |
| --- | --- | --- |
| `setValue` | `{ status: 'Closed' }` | Set field values. `doc` changes at once and goes back if the request fails. |
| `setValueDebounced` | `{ description: '…' }` | Same as `setValue`, sent once after `debounce` milliseconds without a new call. |
| `save` | none | Send the fields of `doc` that changed since it loaded. Sends no request when nothing changed. |
| `delete` | none | Delete the document and set `doc` to `null`. |

Rows of the same document in a [list resource](./list-resource) update with
`setValue`, `save` and `delete`.

### Whitelisted methods

Each key in `whitelistedMethods` becomes a resource on the document resource.
`submit(args)` runs the controller method with `args`, and `data` is the
method's return value.

```js
const todo = createDocumentResource({
  doctype: 'ToDo',
  name: 'TODO-0001',
  whitelistedMethods: {
    sendEmail: 'send_email',
    close: {
      method: 'close',
      onSuccess(result) {},
    },
  },
})

todo.sendEmail.submit({ email: 'jane@example.com' })
todo.close.loading
```

The value is the method name, or an object with `method` and any
[resource options](./resource#options). If the response includes this
document after the method ran, `doc` updates with it.
