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
  current `params`, ignoring `immediate`/`refetch`. Returns a promise that
  resolves with the response data, or rejects if the request fails.
- `submit(params?)` — runs `beforeSubmit`, then sends a request with the given
  params (or the configured `params` if omitted). Resolves with the response
  data, or rejects with the error.
- `reset()` — clears any params set by a previous `submit()` call.
- `abort()` — aborts the in-flight request.

## Errors

A Frappe error response rejects `submit()`/`execute()` and sets `error` to a
[`FrappeResponseError`](../other/utilities.md#frapperesponseerror), which
carries `title`, `type`, `exception` and `indicator` from the server's response
— narrow a catch block with `error instanceof FrappeResponseError` to read them.

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
