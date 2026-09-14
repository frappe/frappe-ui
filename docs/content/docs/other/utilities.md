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

`dayjs` and `dayjsLocal` are the two public helpers. The opposite conversion,
`dayjsSystem`, is internal to the library and is not exported.

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

## FrappeRequestError

The error [`call`](#call), [`frappeRequest`](#frapperequest) and the v1
[resources](../data-fetching/resource.md) raise. An `Error` with the transport
fields of the failed request: `messages` (the server messages array), `exc_type`,
`exc`, `status` and the raw `response`.

It stays a separate class from `FrappeResponseError` below, which the v2
composables raise.
[The error table](../data-fetching/use-call.md#which-error-class) says which API
raises which.

## FrappeResponseError

The error [`useCall`](../data-fetching/use-call.md),
[`useDoc`](../data-fetching/use-doc.md) and
[`useList`](../data-fetching/use-list.md) raise on a Frappe error response — set
on `.error` and the reason `submit()`/`execute()` rejects with. An `Error` with
`title`, `type`, `exception` and `indicator` from the server's response.

```vue
<script setup>
import { FrappeResponseError, useCall } from 'frappe-ui'

const rename = useCall({
  url: '/api/method/frappe.client.rename_doc',
  method: 'POST',
  immediate: false,
  onError(error) {
    if (error instanceof FrappeResponseError) {
      console.log(error.title, error.type)
    }
  },
})
</script>
```

## FrappeUI plugin

An optional Vue plugin with one boolean option. It installs the v1 resources
Options API mixin — the `resources: { … }` component option, `this.$resources`,
and the `$getResource` / `$getDoc` / `$getListResource` / `$refetchResource`
helpers.

```js
// main.js
import { createApp } from 'vue'
import { FrappeUI } from 'frappe-ui'

const app = createApp(App)
app.use(FrappeUI, { resources: true })
```

`resources` is a boolean: `true` installs the mixin, `false` or no options
leaves it out. Earlier versions typed it as an object and never read what was
in it. The object form is a type error now. It still installs the mixin at
runtime, so an app that misses the change keeps working.
`npx -p frappe-ui data-v1 ./src` rewrites it.

You do not need it otherwise. Components, the imperative `dialog` and `toast`
APIs, and every Composition API data helper work without installing anything —
wrap your app in [`FrappeUIProvider`](../getting-started) instead. Passing an
option the plugin doesn't accept logs a warning in development.

## useFileUpload / FileUploadHandler

Two lower-level primitives for posting a file to Frappe's upload endpoint
without the [`FileUploader`](../components/fileuploader) component — reach
for them for a custom trigger, multi-file upload, or a fully headless flow.
`FileUploader` is the ready-made UI built on top of `FileUploadHandler`.

Uploads default to **private** — an upload with no stated `private` resolves to
`is_private=1` on the server. Pass `private: false` only for intentionally
public files.

### useFileUpload

A composable with reactive upload state.

```vue
<script setup>
import { useFileUpload } from 'frappe-ui'

const { upload, state, isUploading, progress, error, result, reset } =
  useFileUpload()

async function onFile(file) {
  await upload(file, { doctype: 'ToDo', docname: 'TODO-0001' })
  // result.value (same as state.result) now holds the uploaded file
}
</script>
```

`upload(file, options)` resets state, uploads the file, and resolves to the
uploaded file's record (or rejects with an [`UploadError`](#uploaderror)).
`state` — and the `isUploading` / `progress` / `error` / `result` computed refs
read from it — update as the request runs. `error` is an `UploadError` or
`null`. `reset()` clears `state` back to its initial values without uploading
anything.

`options` (`UploadOptions`):

| Option                       | Type                                       | Notes                                                |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| `private`                     | `boolean`                                    | Defaults to `true`. Pass `false` for public files.     |
| `folder`                      | `string`                                     | Defaults to `Home`.                                    |
| `doctype` / `docname` / `fieldname` | `string`                               | Attaches the upload to a document field.               |
| `file_url`                    | `string`                                     | Replaces the file at an existing URL.                  |
| `method`                      | `string`                                     | A whitelisted method to call instead of the default upload handler. |
| `type`                        | `string`                                     | Passed through to the upload endpoint as-is.           |
| `upload_endpoint`             | `string`                                     | Defaults to `/api/method/upload_file`.                 |
| `optimize`                    | `boolean`                                    | Resize the image server-side.                          |
| `max_width` / `max_height`    | `number`                                     | Applied when `optimize` is set.                        |
| `params`                      | `object`                                     | Extra form fields, appended as-is.                      |
| `signal`                      | `AbortSignal`                                 | Cancels the upload.                                     |
| `onProgress`                  | `(p: { loaded, total, percent }) => void`     | Called on every progress tick.                          |

### FileUploadHandler

An event-emitter class, for callers that want `.on(…)` instead of reactive
state — this is what `FileUploader` itself uses internally.

```ts
import { FileUploadHandler } from 'frappe-ui'

const handler = new FileUploadHandler()
handler.on('start', () => {})
handler.on('progress', ({ uploaded, total }) => {})
handler.on('error', (error) => {})
handler.on('finish', () => {})

const result = await handler.upload(file, { doctype: 'ToDo' })
```

`upload(file, options)` takes the same `UploadOptions` as `useFileUpload` and
resolves to the uploaded file's record, rejecting with an
[`UploadError`](#uploaderror) on failure. The events fire alongside the promise,
for callers that want to hook progress without awaiting: `start` (request
began), `progress` (`{ uploaded, total }`), `error` (the server's error text, if
any), `finish` (upload succeeded).

## UploadError

Every upload failure rejects with this class: `upload`, `useFileUpload` and
`FileUploadHandler` all raise it, and `useFileUpload`'s `state.error` holds it.

| Field      | Type                                              | Notes                                                        |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `kind`     | `'file-size' \| 'network' \| 'server' \| 'abort'` | What failed. Branch on this instead of matching the message. |
| `status`   | `number \| undefined`                             | The HTTP status, for `kind: 'server'`.                       |
| `messages` | `string[]`                                        | The server messages, parsed. Empty for the other kinds.      |
| `response` | `unknown`                                         | The parsed response body, for `kind: 'server'`.              |

```vue
<script setup>
import { upload, UploadError } from 'frappe-ui'

async function send(file) {
  try {
    return await upload(file, { doctype: 'ToDo', docname: 'TODO-0001' })
  } catch (error) {
    if (error instanceof UploadError && error.kind === 'file-size') {
      toast.error('That file is too large.')
      return
    }
    throw error
  }
}
</script>
```
