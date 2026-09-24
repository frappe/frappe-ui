# Resource

`createResource` fetches data from a URL and gives you a reactive object with
the data, loading and error state, and methods to fetch again. It is the older
data-fetching API and stays supported through `1.x`.

For new code, use [`useCall`](./use-call).

## Composition API

```vue
<template>
  <Button :loading="todos.loading" @click="todos.reload()">Reload</Button>
  <pre>{{ todos.data }}</pre>
</template>

<script setup>
import { createResource } from 'frappe-ui'

const todos = createResource({
  url: 'frappe.client.get_list',
  params: { doctype: 'ToDo', filters: { status: 'Open' } },
  auto: true,
})
</script>
```

The short URL `frappe.client.get_list` works when the app uses
[`frappeRequest`](#frappe-backend). With the default fetcher, write the full
path, `/api/method/frappe.client.get_list`.

## Options API

Install the FrappeUI plugin with the `resources` option:

```js
// main.js
import { FrappeUI } from 'frappe-ui'
app.use(FrappeUI, { resources: true })
```

Then declare resources under the `resources` key. Each one is a function that
returns the options, and the resource is available on `this.$resources.<name>`.
When a value the function reads changes, the resource is created again with the
new options.

```vue
<template>
  <pre>{{ $resources.todos.data }}</pre>
</template>

<script>
export default {
  resources: {
    todos() {
      return {
        url: 'frappe.client.get_list',
        params: { doctype: 'ToDo' },
        auto: true,
      }
    },
  },
}
</script>
```

Add `type: 'list'` or `type: 'document'` to create a
[list resource](./list-resource) or a [document resource](./document-resource)
instead. `resourcesPlugin` is the same plugin, exported for apps that do not
install `FrappeUI`.

## Frappe backend

By default, resources use `request`, a small wrapper around `fetch`. For a
Frappe backend, set `frappeRequest` as the fetcher once in `main.js`:

```js
import { setConfig, frappeRequest } from 'frappe-ui'
setConfig('resourceFetcher', frappeRequest)
```

With `frappeRequest`:

- A URL that does not start with `/` or `http` gets the `/api/method/` prefix,
  so `frappe.client.get_list` works.
- The default method is `POST`. With `request`, it is `GET`.
- `data` is the `message` key of the response, and a failed request sets
  `error` with the server's exception details.

## Caching

Set `cache` to a key to keep the response in memory and in IndexedDB. Another
`createResource` call with the same key returns the same resource object. On a
page reload, the stored response shows until the new request finishes.

```js
const todos = createResource({
  url: 'frappe.client.get_list',
  params: { doctype: 'ToDo' },
  cache: ['todos', 'open'],
  auto: true,
})
```

The key is a string or an array that can be turned into JSON. It is read once,
when the resource is created, so changing a ref inside it later does not
change the key.

## API Reference

### Options

| Option | Default | Description |
| --- | --- | --- |
| `url` | | A path (`/api/posts/1`), a full URL, or a dotted method name with `frappeRequest`. |
| `method` | `GET` (`POST` with `frappeRequest`) | HTTP method: `GET`, `POST`, `PUT` or `DELETE`. |
| `params` | | Parameters for the request. Sent as the query string for `GET`, as a JSON body otherwise. |
| `makeParams(params)` | | Returns the parameters for each request. Receives the value passed to `fetch()` or `submit()`. |
| `auto` | `false` | Fetch once when the resource is created. |
| `initialData` | `null` | Value of `data` before the first response. |
| `debounce` | | Wait this many milliseconds after the last call before sending the request. |
| `cache` | | String or array key. See [Caching](#caching). |
| `resourceFetcher` | | Fetch function for this resource only. Overrides the `resourceFetcher` config. |
| `validate(params)` | | Runs before the request. Return a string (or throw) to fail with that message. Can be async. |
| `beforeSubmit(params)` | | Runs before the request, after `validate`. |
| `onFetch(params)` | | Runs when a fetch starts. |
| `onSuccess(data)` | | Runs with the raw response after a successful request. |
| `onData(data)` | | Runs after a successful request, and when cached data loads from IndexedDB. |
| `onError(error)` | | Runs when the request or `validate` fails. Without it, the `fallbackErrorHandler` config runs. |
| `transform(data)` | | Changes the response before it is set on `data`. Return the new value, or change `data` in place. |

### Properties

| Property | Description |
| --- | --- |
| `data` | The response, after `transform`. |
| `loading` | `true` while a request is in progress. |
| `error` | The error from the last request or from `validate`. |
| `fetched` | `true` after the first successful response, until `reset()`. |
| `promise` | The promise of the current request. You can await it. |
| `params` | The parameters sent with the last request, after `makeParams`. |
| `previousData` | A copy of `data` from before the last request started. |

### Methods

| Method | Description |
| --- | --- |
| `fetch(params?)` | Send the request. Returns a promise of `data` that rejects if the request fails. |
| `reload(params?)` | Same as `fetch`. |
| `submit(params?)` | Same as `fetch`. Use it for requests that change data, like `post.submit({ id: 2 })`. |
| `abort()` | Cancel the request in progress. It does not set `error`. |
| `reset()` | Reset the resource to its state when it was created. |
| `update({ params, auto })` | Change the parameters or `auto` for later requests. It also accepts `url` and `method`, but later requests still use the ones from the options. |
| `setData(data)` | Replace `data`. Pass a function to compute it from the current data: `setData((d) => d.filter((t) => t.open))`. |
