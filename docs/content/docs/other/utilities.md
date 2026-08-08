# Utilities

Some common utilities that are useful in building frontend apps.

## call

Calls a whitelisted method on the server and resolves to its `message`. The
method is a dotted path; an argument object becomes the JSON request body.

```js
import { call } from 'frappe-ui'

let count = await call('frappe.client.get_count', { doctype: 'ToDo' })
```

Pass a path starting with `/` to hit it directly instead of `/api/method/…`.

A third argument takes `headers` (merged over the defaults, winning over
anything from [`setConfig('requestHeaders')`](#configuration)) and `onError`,
which receives `{ response, status, error }` for a failed HTTP response. The
promise rejects either way — `onError` is for reporting, not for recovery.

```js
await call(
  'my_app.api.save',
  { name },
  { onError: ({ error }) => toast.error(error.messages[0]) },
)
```

The rejection is a `FrappeRequestError`: an `Error` with `exc_type`, `exc`,
`status`, `response`, and `messages` (the server's `_server_messages`, already
parsed).

## frappeRequest

The transport `call` is built on, for requests `call` doesn't shape — a `GET`, a
non-method URL, a request you need to abort.

```js
import { frappeRequest } from 'frappe-ui'

let doc = await frappeRequest({
  url: '/api/resource/ToDo/TODO-0001',
  method: 'GET',
})
```

Options: `url` (required), `method` (defaults to `POST`), `params` (query string
on `GET`, JSON body otherwise), `headers`, `signal`, `credentials`,
`responseType` (`'json'` or `'response'`), and the `onError` /
`onServerMessages` callbacks. It sets the `Accept`, `Content-Type`,
`X-Frappe-Site-Name` and CSRF headers, unwraps `message` from the response, and
throws a `FrappeRequestError` on failure.

### Configuration

Both `call` and `frappeRequest` read these through `setConfig`:

```js
import { setConfig } from 'frappe-ui'

// point requests at a remote site during local development
setConfig('requestBaseUrl', 'https://my-site.frappe.cloud')
// merged into every request; pass a function for values that change
setConfig('requestHeaders', () => ({ Authorization: `token ${key}:${secret}` }))
// called with the server's _server_messages on a successful response
setConfig('serverMessagesHandler', (messages) => messages.forEach(toast))
```

Setting `requestBaseUrl` makes relative requests cross-origin and defaults them
to `credentials: 'include'`, so the server has to send
`Access-Control-Allow-Credentials: true` and a non-wildcard origin. If you
authenticate with a token header instead, pass `credentials: 'omit'` per
request.

## FrappeUI plugin

An optional Vue plugin with one option. It installs the v1 resources Options API
mixin — the `resources: { … }` component option, `this.$resources`, and the
`$getResource` / `$getDoc` / `$getListResource` / `$refetchResource` helpers.

```js
import { FrappeUI } from 'frappe-ui'

app.use(FrappeUI, { resources: true })
```

You do not need it otherwise. Components, the imperative `dialog` and `toast`
APIs, and every Composition API data helper work without installing anything —
wrap your app in [`FrappeUIProvider`](../getting-started) instead. Passing an
option the plugin doesn't accept logs a warning in development.

## debounce

Creates a function that will run only once in the specified number of wait time
(milliseconds). In the following example, if you run `debouncedInput` function
every time the user presses a key, it will run only once in every `500ms`.

```js
import { debounce } from 'frappe-ui'

function onInput(e) {
  // do something with input event
}

let debouncedInput = debounce(onInput, 500)
```

## fileToBase64

This function will return the base64 string of a
[File object](https://developer.mozilla.org/en-US/docs/Web/API/File_API).

```js
import { fileToBase64 } from 'frappe-ui'

let base64 = fileToBase64(file) // file must be an instance of File
```

## pageMeta

This is a plugin that can be used to update the `document.title` reactively as
the page changes.

Register the plugin in your `main.js` file.

```js
import { pageMetaPlugin } from 'frappe-ui'
// ...
app.use(pageMetaPlugin)
```

Now, in your page component, declare the `pageMeta` function. It must return an
object with `title` and (`icon` or `emoji`) properties. The `pageMeta` function
behaves like a computed property, if there are reactive dependences that change,
`document.title` will also change accordingly.

**Page.vue**

```vue
<template>...</template>
<script>
export default {
    ...
    pageMeta() {
        return {
            title: 'Page Title',
            icon: '<link to .png, .ico file>',
            emoji: '🌈'
        }
    }
}
</script>
```
