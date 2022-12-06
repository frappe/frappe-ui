<script setup>
import { createResource, setConfig, request, Button } from '../../src'
let post = createResource({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
})
if (typeof window !== 'undefined') {
    post.fetch()
}

let post2 = createResource({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  cache: 'posts'
})
</script>
<script>
export default {
  resources: {
    posts() {
      return {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        auto: true
      }
    },
  },
}
</script>

# Resource

Resource is a feature to manage async data fetching and mutations in your Vue
frontend. It will fetch, cache and keep data up-to-date from the server.

## Basic example

Any data that is fetched via a web request is called a resource in frappe-ui
terminology. When you are dealing with async data, you are also dealing with
loading states, error states, refetching etc. In the traditional way of fetching
data, you have to handle loading states, error states, and refetching yourself.

```js
let data, loading, error
try {
  data = await fetch('https://jsonplaceholder.typicode.com/posts/1')
} catch (e) {
  error = e
}
// rest of your code
```

The above example is still a very simplified version. You might also need a way
to reload your data.

When you create a resource using the `createResource` function, it will create a
reactive object with properties like `data`, `loading`, `error`, `reload()` etc.

```vue
<template>
  <Button @click="post.reload()" :loading="post.loading"> Reload </Button>
  <pre>{{ post }}</pre>
</template>

<script setup>
import { createResource } from 'frappe-ui'
let post = createResource({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
})
post.fetch()
</script>
```

<Story class="!block">
  <Button @click="post.reload()" :loading="post.loading"> Reload </Button>
  <pre>{{ post }}</pre>
</Story>

## Options API example

Resources can also be used in options API style. You need to register the
`resourcesPlugin` first.

**main.js**

```js
import { resourcesPlugin } from 'frappe-ui'
app.use(resourcesPlugin)
```

In your `.vue` file, you can declare all your resources under the `resources`
key as functions. The actual resource object will be available on
`this.$resources.[name]`. In the following example, `this.$resources.posts` is
the resource object.

**Component.vue**

```vue
<template>
  <pre>{{ $resources.posts }}</pre>
</template>
<script>
export default {
  resources: {
    posts() {
      return {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        // option to call .fetch() the first time automatically
        auto: true,
      }
    },
  },
}
</script>
```

<Story class="!block">
    <pre>{{ $resources.posts }}</pre>
</Story>

## Caching example

Caching is a first-class feature in resources. To cache responses, just define a
`cache` property in options with a unique global key. Now, the response will
cached in memory as well as in IndexedDB. If you define another resource in a
different part of your application with the same cache key, it will reuse the
cached one.

```vue
<template>
  <Button @click="post.reload()" :loading="post.loading">
    {{ post.fetched ? 'Reload' : 'Fetch data' }}
  </Button>
  <pre>{{ post.data }}</pre>
</template>

<script setup>
import { createResource } from 'frappe-ui'
let post = createResource({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  cache: 'posts',
})
</script>
```

<Story class="!block">
  <Button @click="post2.reload()" :loading="post2.loading">
    {{ post2.fetched ? 'Reload' : 'Fetch data' }}
  </Button>
  <pre>{{ post2.data }}</pre>
</Story>

## List of Options and API

Here is the list of all options and APIs that are available on a resource.

### Options

```js
let post = createResource({
    // partial rest api routes
    url: '/api/posts/1'
    // or full urls
    url: 'https://jsonplaceholder.typicode.com/posts/1',

    // http method: GET, POST, PUT, DELETE
    method: 'GET',

    // parameters
    params: {
      id: 1
    },
    // generate params from function
    makeParams() {
      return {
        id: 1
      }
    },

    // debounce request every 500ms
    debounce: 500,

    // initial data
    initialData: []

    // make the first request automatically
    auto: true,

    // cache key to cache the resource
    // can be a string
    cache: 'post',
    // or an array that can be serialized
    cache: ['post', '1'],
    // you can also pass reactive variable here
    cache: ['post', postId]

    // events
    // before making the request
    beforeSubmit(params) {

    },
    // validate parameters before making request
    validate(params) {
        if (!params.id) {
            // return a string message to throw an error
            return 'id is required'
        }
    },
    // error can occur from failed request and validate function
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
})
```

### API

```js
let post = createResource({...})

post.data // data returned from request
post.loading // true when data is being fetched
post.error // error that occurred from making the request or from validate function
post.promise // promise object of the request, can be awaited
post.params // params that were sent for making the request, if using makeParams, the return value is set here
post.fetched // true when data has been fetched once, stays true after that
post.previousData // when you call .reload(), previousData is set to current data, and then data is set to new returned data

post.fetch() // make the web request (fetch call)
post.reload() // alias to fetch
post.submit() // alias to fetch

// you can also pass parameters while calling submit
post.submit({ id: 2 })

// reset the state of this resource as a newly created one
post.reset()

// update url and params
post.update({
  url: '/api/users',
  params: {
    id: 2
  }
})

// override data manually
post.setData({
  id: 1,
  title: 'test'
})
// modify existing data
post.setData(data => {
  return data.filter(d => d.open)
})
```

## Frappe Resource

Fetching data from a Frappe backend is no different from any other REST API
service.

```vue
<template>
  <Button @click="post.reload()" :loading="post.loading"> Reload </Button>
  <pre>{{ post }}</pre>
</template>

<script setup>
import { createResource } from 'frappe-ui'
let todos = createResource({
  url: '/api/method/frappe.client.get_list',
  params: {
    doctype: 'ToDo',
    filters: {
      allocated_to: 'faris@frappe.io',
    },
  },
})
todos.fetch()
</script>
```

But the response format by Frappe Framework requires some parsing to be done to
extract data and errors. Since `frappe-ui` is built primarily for Frappe backend
apps, we can make it understand Frappe responses.

By default, resources use the `request` function exported from `frappe-ui` which
is a generic Fetch API wrapper. There is another function `frappeRequest` which
is a wrapper for Frappe REST API calls. To make resources use it, you have to do
the following:

**main.js**

```js
import { setConfig, frappeRequest } from 'frappe-ui'
setConfig('resourceFetcher', frappeRequest)
```

Now, resources will use `frappeRequest` for making the web requests. You can
also drop the `/api/method` part. The returned response will now set the data
from `message` key and error from `exc`.

```vue
<template>
  <Button @click="post.reload()" :loading="post.loading"> Reload </Button>
  <pre>{{ post }}</pre>
</template>

<script setup>
import { createResource } from 'frappe-ui'
let todos = createResource({
  url: '/api/method/frappe.client.get_list', // [!code --]
  url: 'frappe.client.get_list', // [!code ++]
  params: {
    doctype: 'ToDo',
    filters: {
      allocated_to: 'faris@frappe.io',
    },
  },
})
todos.fetch()
</script>
```
