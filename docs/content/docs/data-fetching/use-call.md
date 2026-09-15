# useCall

`useCall`, `useDoc`, `useList`, `useDoctype` and `useNewDoc` are the recommended
data-fetching layer for new code. If you're maintaining an app still on the
older resource API, see [Resources](./resource.md) — it stays fully supported
through `1.x`.

`useCall` calls a whitelisted Frappe method or a REST endpoint and gives you
back a reactive object with the response, loading and error state.

## Basic example

```vue
<template>
  <Button @click="ping.reload()" :loading="ping.loading"> Ping </Button>
  <pre>{{ ping.data }}</pre>
</template>

<script setup>
import { useCall } from 'frappe-ui'

const ping = useCall({
  url: '/api/method/ping',
})
</script>
```

By default the request fires immediately and uses `GET`.

## Submitting with params

Set `method` and call `submit()` for anything that isn't a plain `GET`:

```vue
<script setup>
import { useCall } from 'frappe-ui'

const renameTodo = useCall({
  url: '/api/method/frappe.client.rename_doc',
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

## Options

- `url` — the endpoint to call. A REST path or a whitelisted method dotted path.
  Accepts a `Ref<string>` for a URL that changes reactively.
- `method` — the HTTP method: `'GET' | 'POST' | 'PUT' | 'DELETE'`. Defaults to
  `'GET'`.
- `params` — the request params. Either a plain object, or a function returning
  one, read fresh on every request — use the function form so reactive values
  inside are re-read on each call.
- `immediate` — fire the first request automatically when `useCall` is set up.
  Defaults to `true`.
- `refetch` — automatically fire a new request whenever a reactive `url` or
  `params` dependency changes. Defaults to `false`.
- `baseUrl` — prefix prepended to `url`. Useful when the Frappe site isn't
  served from the same origin as the frontend.
- `initialData` — the value `data` holds before the first response arrives.
- `cacheKey` — a string, or array of primitives, that persists the response in
  memory and IndexedDB under that key. A second `useCall` with the same
  `cacheKey` shows the cached value immediately while it refetches in the
  background.
- `staleOnError` — when `true` and `cacheKey` is set, a failed refetch keeps
  showing the last cached `data` instead of clearing it. Does not apply when
  the failure is a Frappe error response (`FrappeResponseError`) — that still
  clears the cache. Defaults to `false`.
- `transform` — receives the raw response data and returns the value `data`
  should hold. Return `undefined` to leave the response untouched.
- `beforeSubmit` — runs before a `submit()` call sends its request. Use it for
  side effects like clearing a previous validation message; a normal return does
  not stop the request from being sent. If it throws, the request is not sent
  and `submit()` rejects.
- `onSuccess` — called with the response data after a successful request.
- `onError` — called with the error after a failed request.

## Return value

- `data` — the response data, or `null` before the first successful response.
- `error` — the error from the last request, or `null`.
- `loading` (alias `isFetching`) — `true` while a request is in flight.
- `isFinished` — `true` once the current request has settled, either way.
- `params` — the params that were sent with the last request.
- `url` — the fully resolved URL, including `baseUrl` and, for `GET` requests,
  the serialized query string.
- `promise` — the in-flight request's promise. Resolves (it never rejects) once
  the request settles, whether it succeeded or failed — check `error` after
  awaiting it.
- `canAbort` — `true` while a request that can still be aborted is in flight.
- `aborted` — `true` if the last request was aborted.
- `execute()` (aliases `fetch()`, `reload()`) — fires a request using the
  current `params`, ignoring `immediate`/`refetch`. Resolves with the response
  data, or with `null` when the request fails; read `error` after awaiting it.
- `submit(params?)` — runs `beforeSubmit`, then sends a request with the given
  params (or the configured `params` if omitted). Resolves with the response
  data, or **rejects** with the error. It never settles on a request built
  before it; it settles on one that carried its own params, or on a later one
  that superseded it. Under `refetch: true` that request can be the one the
  params change already triggered; see
  [`refetch` and `submit`](#refetch-and-submit).
- `reset()` — clears any params set by a previous `submit()` call.
- `abort()` — aborts the in-flight request.

### `refetch` and `submit` {#refetch-and-submit}

With `refetch: true`, a params change sends a request on its own. `submit()`
waits for that request instead of adding one, and sends the request itself when
the change triggered nothing — a second `submit()` with the same object, a `GET`
whose params build the same URL, or a `submit()` with no argument at all.

Dispatch order decides which request is whose. A request reads the params when
it is built, so one built after `submit()` assigned its params carries them and
is that submit's request. One built before is not, even if it is still in
flight, and the submit sends its own once that one settles.

Two things follow from `refetch` and `submit` sharing one request slot:

- Two `submit()` calls in the same tick become **one** request, carrying the
  params of the later call. Both promises resolve with that one response.
- A params change supersedes the request in flight: the new request aborts the
  old one, and both callers resolve with the superseding response.

Each composable instance has one request slot. When concurrent writes must not
share one, give each its own `useCall`, or use `useDoc`, whose write methods are
isolated per submit.

`execute`/`fetch`/`reload` are one function under three names, and
`loading`/`isFetching` one ref under two. v1 keeps every alias: apps use all of
them, and dropping a name buys nothing. The docs use `reload()` and `loading`.
This is the only place the library publishes two names for one thing.

## Errors

**Actions reject, reads resolve.** A failed write rejects, so a caller that does
not handle the failure never runs its success path. A failed read resolves, so a
template can keep rendering the last value and show `error` instead.

| Call                                                           | On failure             |
| -------------------------------------------------------------- | ---------------------- |
| `submit()`                                                     | rejects                |
| `doc.setValue.submit()`, `doc.delete.submit()`, a `useDoc` `methods:` member | rejects                |
| `execute()`, `fetch()`, `reload()`, `useList` `reload()`       | resolves, sets `error` |

Every one of them sets `error` and calls `onError`, whether it rejects or not.

```js
try {
  await renameTodo.submit({ old_name: 'todo-1', new_name: 'todo-2' })
  toast.success('Renamed')
} catch (error) {
  toast.error(error.message)
}
```

### Which error you get {#which-error-class}

Which one you get depends on the API that made the request, not on the failure.
All three are plain `Error` objects:

| API                                                                  | Error                                                              | Kind        | Extra fields                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------- | --------------------------------------------------- |
| `useCall`, `useDoc`, `useList`, `useDoctype`, `useNewDoc`            | [`FrappeResponseError`](../other/utilities.md#frapperesponseerror) | class       | `title`, `type`, `exception`, `indicator`           |
| `call`, `frappeRequest`, `createResource` and the other v1 resources | [`FrappeResourceError`](../other/utilities.md#frapperequesterror)  | type only   | `messages`, `exc_type`, `exc`, `status`, `response` |
| `upload`, `useFileUpload`, `FileUploadHandler`                       | [`UploadError`](../other/utilities.md#uploaderror)                 | class       | `kind`, `status`, `messages`, `response`            |

The two Frappe errors stay separate on purpose: the v2 composables read the
parsed error page (`title`, `indicator`), and the resource layer keeps the raw
transport fields (`status`, `response`). Each is named for the layer that raises
it; both are server responses, so request versus response named nothing.

The `Kind` column decides how you narrow a catch block.
`FrappeResponseError` and `UploadError` are classes, so `instanceof` works:

```js
if (error instanceof FrappeResponseError) console.log(error.title)
```

`FrappeResourceError` is a TypeScript type over a plain `Error`, not a
constructor. There is no value to test, so
`error instanceof FrappeResourceError` does not compile. Check the field you
need instead:

```js
if (error.exc_type === 'PermissionError') showPermissionMessage()
```

## Caching

Pass `cacheKey` to persist the response. The cached value is read from IndexedDB
and shown immediately on the next `useCall` with the same key, while a fresh
request runs in the background and replaces it once it resolves.

```js
const todo = useCall({
  url: '/api/method/frappe.client.get',
  params: { doctype: 'ToDo', name: 'todo-1' },
  cacheKey: ['todo', 'todo-1'],
})
```
