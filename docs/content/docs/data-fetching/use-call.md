# useCall

`useCall` calls a whitelisted Frappe method or a REST endpoint and returns the
response with its loading and error state. Apps on the older resource API can
keep using [Resources](./resource.md), which stay supported through `1.x`.

## Basic example

```vue
<template>
  <Button @click="ping.reload()" :loading="ping.loading">Ping</Button>
  <pre>{{ ping.data }}</pre>
</template>

<script setup>
import { useCall } from 'frappe-ui'

const ping = useCall({
  url: '/api/v2/method/ping',
})
</script>
```

The request is a `GET` and is sent as soon as `useCall` runs.

## Send a request on demand

Set `immediate: false` and call `submit()` with the params:

```vue
<script setup>
import { useCall } from 'frappe-ui'

const renameTodo = useCall({
  url: '/api/v2/method/frappe.client.rename_doc',
  method: 'POST',
  immediate: false,
})

async function rename(name, newName) {
  await renameTodo.submit({
    doctype: 'ToDo',
    old_name: name,
    new_name: newName,
  })
}
</script>
```

## Fetch again when a value changes

Pass `params` as a function and set `refetch: true`. A new request goes out
when a value it reads changes:

```vue
<script setup>
import { ref } from 'vue'
import { useCall } from 'frappe-ui'

const query = ref('')
const users = useCall({
  url: '/api/v2/method/frappe.desk.search.search_link',
  params: () => ({ doctype: 'User', txt: query.value }),
  refetch: true,
})
</script>
```

## Options

| Name           | Type                                    | Default    | Description                                                                                      |
| -------------- | --------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `url`          | `string \| Ref<string>`                 | required   | The URL path to call, such as `/api/v2/method/ping`. A ref changes it reactively.                |
| `method`       | `'GET'`, `'POST'`, `'PUT'` or `'DELETE'` | `'GET'`    | The HTTP method. `GET` sends `params` in the query string, the others in the body.              |
| `params`       | `object \| () => object`                |            | The request params. Use the function form so reactive values are read again on each request.    |
| `immediate`    | `boolean`                               | `true`     | Sends the first request when `useCall` runs.                                                     |
| `refetch`      | `boolean`                               | `false`    | Sends a new request when a reactive `url` or `params` value changes.                            |
| `baseUrl`      | `string`                                | `''`       | A prefix for `url`, for a Frappe site on another origin.                                         |
| `initialData`  | `TResponse`                             |            | The value of `data` before the first response.                                                   |
| `cacheKey`     | `CacheKey`                              |            | A string or an array such as `['todo', name]`. Saves the response. See [Caching](#caching).     |
| `staleOnError` | `boolean`                               | `false`    | With `cacheKey`, a failed request keeps showing the cached `data`. A Frappe error response still clears it. |
| `transform`    | `(data) => data`                        |            | Changes the response before it goes into `data`. Returning `undefined` keeps the response as is. |
| `beforeSubmit` | `(params) => void \| Promise<void>`     |            | Runs before each `submit()`. If it throws, no request is sent and `submit()` rejects.            |
| `onSuccess`    | `(data) => void`                        |            | Called with the data after each successful request.                                              |
| `onError`      | `(error: Error) => void`                |            | Called with the error after each failed request.                                                 |

## Return value

| Name              | Type                                           | Description                                                                                   |
| ----------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `data`            | `TResponse \| null`                            | The response data, or `null` before the first successful response.                            |
| `error`           | `Error \| null`                                | The error from the last request.                                                              |
| `loading`         | `boolean`                                      | `true` while a request is in flight. Also available as `isFetching`.                          |
| `isFinished`      | `boolean`                                      | `true` once the current request has settled, with or without an error.                        |
| `params`          | `object`                                       | The params of the current request: the last `submit()` params, or else the `params` option.   |
| `url`             | `string`                                       | The full URL, with `baseUrl` and, for `GET`, the query string.                                |
| `promise`         | `Promise<void>`                                | Resolves when the request in flight settles. It never rejects, so check `error` after it.    |
| `canAbort`        | `boolean`                                      | `true` while a request that can be aborted is in flight.                                      |
| `aborted`         | `boolean`                                      | `true` if the last request was aborted.                                                       |
| `reload()`        | `() => Promise<TResponse \| null>`             | Sends a request with the current params. Resolves with the data, or `null` if it fails. Also available as `execute()` and `fetch()`. |
| `submit(params?)` | `(params?) => Promise<TResponse \| null>`      | Runs `beforeSubmit`, then sends a request with `params`, or the `params` option if omitted. Rejects if it fails. |
| `reset()`         | `() => void`                                   | Clears the params set by the last `submit()`.                                                 |
| `abort()`         | `() => void`                                   | Aborts the request in flight.                                                                 |

These pages use `reload()` and `loading`. The other names do the same thing
and stay in v1.

### `refetch` and `submit` {#refetch-and-submit}

With `refetch: true`, a params change sends a request by itself. `submit()`
waits for that request instead of sending a second one. It sends its own
request when the change sent nothing: the same object passed again, `GET`
params that build the same URL, or no argument at all.

A request belongs to a `submit()` if it was built after that call set its
params. A request built before, even one still in flight, does not, and the
`submit()` sends its own once that one settles.

Each `useCall` has one request slot, so:

- Two `submit()` calls in the same tick send **one** request with the params of
  the later call. Both resolve with its response.
- A params change aborts the request in flight. Both callers resolve with the
  new response.

When writes must run at the same time, give each its own `useCall`, or use the
write members of [`useDoc`](./use-doc.md), which send one request per submit.

## Errors

**Writes reject, reads resolve.** A failed write rejects, so code after `await`
does not run as if it succeeded. A failed read resolves, so a template can keep
showing the last value and show `error` next to it.

| Call                                                                                                        | On failure                |
| ----------------------------------------------------------------------------------------------------------- | ------------------------- |
| `submit()` on `useCall` and `useNewDoc`, and on the write members of `useDoc`, `useList` and `useDoctype`    | Rejects                   |
| `reload()`, `execute()` and `fetch()`                                                                        | Resolves and sets `error` |

Both kinds set `error`, and call `onError` where the composable takes one.

```js
try {
  await renameTodo.submit({ doctype: 'ToDo', old_name: 'todo-1', new_name: 'todo-2' })
  toast.success('Renamed')
} catch (error) {
  toast.error(error.message)
}
```

### Which error you get {#which-error-class}

The error class depends on the API that sent the request. All three are plain
`Error` objects with extra fields:

| API                                                                  | Error                                                              | Kind      | Extra fields                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ | --------- | --------------------------------------------------- |
| `useCall`, `useDoc`, `useList`, `useDoctype`, `useNewDoc`            | [`FrappeResponseError`](../other/utilities.md#frapperesponseerror) | class     | `title`, `type`, `exception`, `indicator`           |
| `call`, `frappeRequest`, `createResource` and the other v1 resources | [`FrappeResourceError`](../other/utilities.md#frapperequesterror)  | type only | `messages`, `exc_type`, `exc`, `status`, `response` |
| `upload`, `useFileUpload`, `FileUploadHandler`                       | [`UploadError`](../other/utilities.md#uploaderror)                 | class     | `kind`, `status`, `messages`, `response`            |

`FrappeResponseError` and `UploadError` are classes, so `instanceof` works:

```js
if (error instanceof FrappeResponseError) console.log(error.title)
```

`FrappeResourceError` is only a TypeScript type, so there is nothing to test
with `instanceof`. Check a field instead:

```js
if (error.exc_type === 'PermissionError') showPermissionMessage()
```

## Caching

With `cacheKey`, the response is saved in memory and in IndexedDB. The next
`useCall` with the same key shows the saved value at once, sends a fresh
request, and replaces the value when the response arrives.

```js
const todo = useCall({
  url: '/api/v2/method/frappe.client.get',
  params: { doctype: 'ToDo', name: 'todo-1' },
  cacheKey: ['todo', 'todo-1'],
})
```

### One cache per user {#cache-namespace}

Each signed-in user has their own cache. You do not have to set anything up.
Every `cacheKey` of `useCall` and `useList`, and every document that
[`useDoc`](./use-doc.md#shared-cache) saves, is stored under the user who is
signed in. frappe-ui reads the user from the `user_id` cookie that Frappe sets
at login. If another user signs in on the same browser, they do not see the
first user's saved values.

Guests, and requests with no session, share one cache that is not tied to a
user. A signed-in user never reads from it, so nothing a user saved reaches a
guest.

Reload the page after a user signs in or out. The data already loaded, and any
request still waiting for its response, belong to the user who was signed in
before. Without a reload, they can be shown to the new user and saved under
the new user's key. Frappe's own login and logout pages reload the page.

Other users' values stay in IndexedDB until the browser clears them. The v1
resources (`createResource`, `createDocumentResource`) do not keep a cache per
user.
