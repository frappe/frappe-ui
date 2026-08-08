# Utilities

Some common utilities that are useful in building frontend apps.

## debounce

Creates a function that will run only once in the specified number of wait time
(milliseconds). In the following example, if you run `debouncedInput` function
every time the user presses a key, it will run only once in every `500ms`.

```vue
<script setup>
import { debounce } from 'frappe-ui'

function onInput(e) {
  // do something with input event
}

const debouncedInput = debounce(onInput, 500)
</script>
```

## dayjs / dayjsLocal

`dayjs` is a re-export of [Day.js](https://day.js.org/), pre-loaded with the
plugins the library and most apps need: `relativeTime`, `localizedFormat`,
`isToday`, `duration`, `utc`, `timezone`, `advancedFormat`, `customParseFormat`.
Import it instead of adding your own `dayjs` dependency, so every date in the
app shares one set of plugins.

```vue
<script setup>
import { dayjs } from 'frappe-ui'

const label = dayjs('2024-01-15').format('MMMM D, YYYY') // "January 15, 2024"
</script>
```

`dayjsLocal` converts a datetime string stored in the server's timezone
(`setConfig('systemTimezone', …)`) into the browser's local timezone
(`setConfig('localTimezone', …)`, falling back to the browser's own). Called
with no argument, it returns "now" in the local timezone. Without a
`systemTimezone` configured, it behaves exactly like `dayjs`.

```vue
<script setup>
import { dayjsLocal, setConfig } from 'frappe-ui'

setConfig('systemTimezone', 'UTC')

const local = dayjsLocal('2024-01-15 10:00:00') // 10:00 UTC, shown in the browser's zone
</script>
```

## call

Calls a whitelisted method on the server and resolves to its `message`. The
method is a dotted path; an argument object becomes the JSON request body.

```vue
<script setup>
import { call } from 'frappe-ui'

const count = await call('frappe.client.get_count', { doctype: 'ToDo' })
</script>
```

Pass a path starting with `/` to hit it directly instead of `/api/method/…`.

A third argument takes `headers` (merged over the defaults, winning over
anything from [`setConfig('requestHeaders')`](#configuration)) and `onError`,
which receives `{ response, status, error }` for a failed HTTP response. The
promise rejects either way — `onError` is for reporting, not for recovery.

```vue
<script setup>
import { call, toast } from 'frappe-ui'

await call(
  'my_app.api.save',
  { name: 'ToDo' },
  { onError: ({ error }) => toast.error(error.messages[0]) },
)
</script>
```

The rejection is a `FrappeRequestError`: an `Error` with `exc_type`, `exc`,
`status`, `response`, and `messages` (the server's `_server_messages`, already
parsed).

## frappeRequest

The transport `call` is built on, for requests `call` doesn't shape — a `GET`, a
non-method URL, a request you need to abort.

```vue
<script setup>
import { frappeRequest } from 'frappe-ui'

const doc = await frappeRequest({
  url: '/api/resource/ToDo/TODO-0001',
  method: 'GET',
})
</script>
```

Options: `url` (required), `method` (defaults to `POST`), `params` (query string
on `GET`, JSON body otherwise), `headers`, `signal`, `credentials`,
`responseType` (`'json'` or `'response'`), and the `onError` /
`onServerMessages` callbacks. It sets the `Accept`, `Content-Type`,
`X-Frappe-Site-Name` and CSRF headers, unwraps `message` from the response, and
throws a `FrappeRequestError` on failure.

### Configuration

Both `call` and `frappeRequest` read these through `setConfig`. `getConfig`
reads a value back — useful when one part of the app sets a value another part
depends on.

```vue
<script setup>
import { getConfig, setConfig, toast } from 'frappe-ui'

// point requests at a remote site during local development
setConfig('requestBaseUrl', 'https://my-site.frappe.cloud')
// merged into every request; pass a function for values that change
setConfig('requestHeaders', () => ({ Authorization: `token ${key}:${secret}` }))
// called with the server's _server_messages on a successful response
setConfig('serverMessagesHandler', (messages) => messages.forEach(toast))

getConfig('requestBaseUrl') // 'https://my-site.frappe.cloud'
</script>
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
// main.js
import { createApp } from 'vue'
import { FrappeUI } from 'frappe-ui'

const app = createApp(App)
app.use(FrappeUI, { resources: true })
```

You do not need it otherwise. Components, the imperative `dialog` and `toast`
APIs, and every Composition API data helper work without installing anything —
wrap your app in [`FrappeUIProvider`](../getting-started) instead. Passing an
option the plugin doesn't accept logs a warning in development.

## fileToBase64

This function will return the base64 string of a
[File object](https://developer.mozilla.org/en-US/docs/Web/API/File_API).

```vue
<script setup>
import { fileToBase64 } from 'frappe-ui'

async function onFile(file) {
  const base64 = await fileToBase64(file) // file must be an instance of File
}
</script>
```
