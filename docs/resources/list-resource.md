# List Resource

List Resource is a wrapper on top of [Resource](/resources/resource) for working
with lists. This feature only works with a Frappe Framework backend as of now.

## Usage

A list resource knows how to fetch records of a DocType from a Frappe Framework
backend so there is no need to specify the url. Instead you only define
`doctype`, `fields`, `filters`, etc. You also get methods like `next()`,
`setValue()`, etc.

```vue
<template>
  <div class="space-y-4">
    <div
      class="flex items-center justify-between"
      v-for="todo in todos.data"
      :key="todo.name"
    >
      <div>
        {{ todo.description }}
      </div>
      <Badge>{{ todo.status }}</Badge>
    </div>
  </div>
  <Button @click="todos.next()"> Next Page </Button>
</template>
<script setup>
import { createListResource } from 'frappe-ui'
let todos = createListResource({
  doctype: 'ToDo',
  fields: ['name', 'description', 'status'],
  orderBy: 'creation desc',
  start: 0,
  pageLength: 5,
})
todos.fetch()
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
the following example, `this.$resources.todos` is the resource object.

**Component.vue**

```vue
<script>
export default {
  resources: {
    todos() {
      return {
        type: 'list',
        doctype: 'ToDo',
        fields: ['name', 'description', 'status'],
        orderBy: 'creation desc',
        start: 0,
        pageLength: 5,
        auto: true,
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
let todos = createListResource({
    // name of the doctype
    doctype: 'ToDo',

    // list of fields
    fields: ['name', 'description', 'status', ...],

    // object of filters to apply
    filters: {
        status: 'Open'
    },

    // the order in which records must be sorted
    orderBy: 'creation desc',

    // index from which records should be fetched
    // default value is 0
    start: 0,

    // number of records to fetch in a single request
    // default value is 20
    pageLength: 20,

    // parent doctype when you are fetching records of a child doctype
    parent: null,

    // set to 1 to enable debugging of list query
    debug: 0,

    // cache key to cache the resource
    // can be a string
    cache: 'todos',
    // or an array that can be serialized
    cache: ['todos', 'faris@frappe.io'],

    // default value for url is "frappe.client.get_list"
    // specify url if you want to use a custom API method
    url: 'todo_app.api.get_todos',

    // make the first request automatically
    auto: true,

    // events
    // error can occur from failed request
    onError(error) {

    },
    // on successful response
    onSuccess(data) {

    },
    // transform data before setting it
    transform(data) {
      for (let d of data) {
        d.open = false
      }
      return data
    },
    // other events
    fetchOne: {
        onSuccess() {},
        onError() {}
    },
    insert: {
        onSuccess() {},
        onError() {}
    },
    delete: {
        onSuccess() {},
        onError() {}
    },
    setValue: {
        onSuccess() {},
        onError() {}
    },
    runDocMethod: {
        onSuccess() {},
        onError() {}
    },
})
```

### API

A list resource is made up of multiple individual resources. In our running
example, the resource object that fetches the list is at `todos.list`. So all
the [properties of a resource](/resources/resource) are available on this
object. Similarly, there are resources for `fetchOne`, `setValue`, `insert`,
`delete`, and `runDocMethod`.

```js
let todos = createListResource({...})

todos.data // data returned from request
todos.originalData // response data before being transformed
todos.reload() // reload the existing list
todos.next() // fetch the next page
todos.hasNextPage // whether there is next page to fetch

// update list options
todos.update({
  fields: ['*'],
  filters: {
    status: 'Closed'
  }
})

todos.list // list resource
todos.list.loading // true when data is being fetched
todos.list.error // error that occurred from making the request
todos.list.promise // promise object of the request, can be awaited

// resource to fetch and update a single record in the list
todos.fetchOne
// pass the name of the record to fetch that record and update the list
todos.fetchOne.submit(name)

// resource to set value(s) for a single record in the list
todos.setValue
todos.setValue.submit({
    // id of the record
    name: '',
    // field value pairs to set
    status: 'Closed',
    description: 'Updated description'
})

// resource to insert a new record in the list
todos.insert
todos.insert.submit({
    description: 'New todo'
})

// resource to delete a single record
todos.delete
todos.delete.submit(name)

// resource to run a doc method
todos.runDocMethod
todos.runDocMethod.submit({
    // name of the doc method
    method: 'send_email',
    // name of the record
    name: '',
    // params to pass to the method
    email: 'test@example.com'
})
```
