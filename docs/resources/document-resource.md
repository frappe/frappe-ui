# Document Resource

Document Resource is a wrapper on top of [Resource](/resources/resource) for
working with a single document. This feature only works with a Frappe Framework
backend as of now.

## Usage

Create a document resource by specifying `doctype` and `name` of the record. It
will be fetched automatically. The `todo.doc` is the document object with all
the fields of the document. Along with this, you get `todo.setValue` and
`todo.delete` resources.

```vue
<template>
  <div v-if="todo.doc">
    <div>
      <h1>
        {{ todo.description }}
      </h1>
      <Badge>{{ todo.status }}</Badge>
    </div>
    <Button @click="todo.setValue.submit({ status: 'Closed' })">
      Mark as Closed
    </Button>
    <Button @click="todo.sendEmail.submit({ email: todo.owner })">
      Send email
    </Button>
  </div>
</template>
<script setup>
import { createDocumentResource, Button } from 'frappe-ui'
let todo = createDocumentResource({
  doctype: 'ToDo',
  name: '1',
  whitelistedMethods: {
    sendEmail: 'send_email',
  },
})
</script>
```

## Options API

You can also define resources if you are using Options API. You need to register
the `resourcesPlugin` first.

**main.js**

```js
import { resourcesPlugin } from 'frappe-ui'
app.use(resourcesPlugin)
```

In your .vue file, you can declare all your resources under the resources key as
functions. The resource object will be available on `this.$resources.[name]`. In
the following example, `this.$resources.todo` is the resource object.

**Component.vue**

```vue
<script>
export default {
  resources: {
    todo() {
      return {
        type: 'document',
        doctype: 'ToDo',
        name: '1',
      }
    },
  },
}
</script>
```

## List of Options and API

Here is the list of all options and APIs that are available on a list resource.

### Options

```js
let todo = createDocumentResource({
  // name of the doctype
  doctype: 'ToDo',

  // name of the record
  name: '',

  // define doc methods to use as resources
  whitelistedMethods: {
    sendEmail: 'send_email',
  },
  // the above configuration enables the following API
  // todo.sendEmail.submit()

  // events
  // error can occur from failed request
  onError(error) {},
  // on successful response
  onSuccess(data) {},
  // transform data before setting it
  transform(doc) {
    doc.open = false
    return doc
  },
  // other events
  delete: {
    onSuccess() {},
    onError() {},
  },
  setValue: {
    onSuccess() {},
    onError() {},
  },
})
```

### API

A document resource is made up of multiple individual resources. In our running
example, the resource object that fetches the document is at `todos.get`. So all
the [properties of a resource](/resources/resource) are available on this
object. Similarly, there are resources for `setValue`, and `delete`.

```js
let todo = createDocumentResource({...})

todo.doc // doc returned from request
todo.reload() // reload the doc

// update options
todo.update({
  doctype: '',
  name: ''
})

todo.get // doc resource
todos.get.loading // true when data is being fetched
todos.get.error // error that occurred from making the request
todos.get.promise // promise object of the request, can be awaited

// resource to set value(s) on the document
todos.setValue
todos.setValue.submit({
    // field value pairs to set
    status: 'Closed',
    description: 'Updated description'
})

// same as setValue but debounced
todos.setValueDebounced
// will run once after 500ms
todos.setValueDebounced.submit({
    description: 'Updated description'
})

// resource to delete the document
todos.delete
todos.delete.submit()

// if whitelistedMethods is defined
// you get a resource for each whitelisted method
todos.sendEmail
todos.sendEmail.submit
todos.sendEmail.loading
```
