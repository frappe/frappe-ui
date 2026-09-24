# Utilities

Plain functions and classes for common app tasks: dates, server requests,
errors and file uploads. Import them from `frappe-ui`.

## debounce

Returns a function that waits until `wait` milliseconds pass with no new call,
then runs once with the last arguments. In this example, `debouncedInput` runs
500ms after the user stops typing.

```vue
<script setup>
import { debounce } from 'frappe-ui'

function onInput(e) {
  // do something with input event
}

const debouncedInput = debounce(onInput, 500)
</script>
```

Pass `true` as the third argument to run on the first call instead of the last.
Call `debouncedInput.cancel()` to drop a pending call, for example when the
component unmounts before a debounced request fires.

## dayjs / dayjsLocal

`dayjs` is [Day.js](https://day.js.org/) with the plugins the library and most
apps need already loaded: `relativeTime`, `localizedFormat`, `isToday`,
`duration`, `utc`, `timezone`, `advancedFormat`, `customParseFormat`. Import it
instead of adding your own `dayjs` dependency, so every date in the app uses
the same plugins.

```vue
<script setup>
import { dayjs } from 'frappe-ui'

const label = dayjs('2024-01-15').format('MMMM D, YYYY') // "January 15, 2024"
</script>
```

`dayjsLocal` converts a datetime string stored in the server's timezone
(`setConfig('systemTimezone', …)`) into the local timezone
(`setConfig('localTimezone', …)`, or the browser's own). With no argument, it
returns "now" in the local timezone. Without a `systemTimezone`, it behaves
like `dayjs`.

```vue
<script setup>
import { dayjsLocal, setConfig } from 'frappe-ui'

setConfig('systemTimezone', 'UTC')

const local = dayjsLocal('2024-01-15 10:00:00') // 10:00 UTC, shown in the browser's zone
</script>
```

The reverse conversion, `dayjsSystem`, is internal and not exported.

## call

Calls a whitelisted server method and resolves to its `message`. The method is
a dotted path, and the argument object becomes the JSON request body.

```vue
<script setup>
import { call } from 'frappe-ui'

const count = await call('frappe.client.get_count', { doctype: 'ToDo' })
</script>
```

A path that starts with `/` is used as the URL, instead of
`/api/method/<method>`.

The third argument takes two options:

| Option    | Type                                     | Description                                                                                                  |
| --------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `headers` | `Record<string, string>`                 | Merged over the default headers and over [`setConfig('requestHeaders')`](#configuration).                    |
| `onError` | `({ response, status, error }) => void`  | Called when the server returns an error response. The promise still rejects, so use it to report, not recover. |

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

The promise rejects with a [`FrappeResourceError`](#frapperequesterror).

## frappeRequest

The request function that `call` is built on. Use it for requests `call` does
not cover: a `GET`, a URL that is not a method, or a request you need to abort.

```vue
<script setup>
import { frappeRequest } from 'frappe-ui'

const doc = await frappeRequest({
  url: '/api/resource/ToDo/TODO-0001',
  method: 'GET',
})
</script>
```

| Option             | Type                       | Description                                                  |
| ------------------ | -------------------------- | ------------------------------------------------------------ |
| `url`              | `string`                   | Required. A dotted method name or a path.                    |
| `method`           | `string`                   | HTTP method. Defaults to `POST`.                             |
| `params`           | `object`                   | Query string on `GET`, JSON body otherwise.                  |
| `headers`          | `HeadersInit`              | Extra request headers.                                       |
| `signal`           | `AbortSignal`              | Cancels the request.                                         |
| `credentials`      | `RequestCredentials`       | Passed to `fetch`.                                           |
| `responseType`     | `'json' \| 'response'`     | `'response'` returns the raw `Response`. Defaults to `json`. |
| `onError`          | `(error) => void`          | Called once with the `FrappeResourceError`.                  |
| `onServerMessages` | `(messages) => void`       | Called with the server's `_server_messages`.                 |

It sets the `Accept`, `Content-Type`, `X-Frappe-Site-Name` and CSRF headers,
returns the `message` from the response, and throws a `FrappeResourceError` on
failure.

### Configuration

`call` and `frappeRequest` read these settings from `setConfig`. `getConfig`
reads a value back, for code that depends on a value set elsewhere in the app.

```vue
<script setup>
import { getConfig, setConfig, toast } from 'frappe-ui'

// point requests at a remote site during local development
setConfig('requestBaseUrl', 'https://my-site.frappe.cloud')
// merged into every request; pass a function for values that change
setConfig('requestHeaders', () => ({ 'Accept-Language': locale.value }))
// called with the server's _server_messages on a successful response
setConfig('serverMessagesHandler', (messages) => messages.forEach(toast))

getConfig('requestBaseUrl') // 'https://my-site.frappe.cloud'
</script>
```

With `requestBaseUrl` set, relative requests go to another origin and default
to `credentials: 'include'`. The server must then send
`Access-Control-Allow-Credentials: true` and a specific (not `*`) origin. If you
authenticate with a token header (`Authorization: token <key>:<secret>`)
instead, pass `credentials: 'omit'` per request. Only do that in code that runs
on a server: in a browser, anyone can read the key and secret.

## FrappeResourceError {#frapperequesterror}

The error that [`call`](#call), [`frappeRequest`](#frapperequest) and the v1
[resources](../data-fetching/resource.md) raise. It is a plain `Error` with the
fields of the failed request: `messages` (the server messages, parsed),
`exc_type`, `exc`, `status` and the raw `response`. It was renamed from
`FrappeRequestError`; the [migration guide](../migration.md#errors-renamed) has
the details.

It is a TypeScript `interface`, not a class. The resource layer throws
`new Error(...)` and sets those fields on it. So use it to type a caught error
(`const e = error as FrappeResourceError`, since a catch variable cannot have a
type annotation), but `error instanceof FrappeResourceError` does not compile,
and `error.name` is `"Error"`. Check a field instead, for example
`e.exc_type === 'PermissionError'`.

The v2 composables raise [`FrappeResponseError`](#frapperesponseerror) instead,
which is a real class.
[The error table](../data-fetching/use-call.md#which-error-class) shows which
API raises which.

## FrappeResponseError

The error that [`useCall`](../data-fetching/use-call.md),
[`useDoc`](../data-fetching/use-doc.md) and
[`useList`](../data-fetching/use-list.md) raise on a Frappe error response. It is
set on `.error`, and `submit()` and `execute()` reject with it. It is an `Error`
with `title`, `type`, `exception` and `indicator` from the server's response.

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

An optional Vue plugin that installs the v1 resources Options API: the
`resources: { … }` component option, `this.$resources`, and the `$getResource`,
`$getDoc`, `$getListResource` and `$refetchResource` helpers.

```js
// main.js
import { createApp } from 'vue'
import { FrappeUI } from 'frappe-ui'

const app = createApp(App)
app.use(FrappeUI, { resources: true })
```

| Option      | Type      | Default | Description                               |
| ----------- | --------- | ------- | ----------------------------------------- |
| `resources` | `boolean` | `false` | Install the v1 resources Options API mixin. |

Earlier versions typed `resources` as an object and never read its contents.
The object form is now a type error, but it still installs the mixin at
runtime, so an app that misses the change keeps working.
`npx -p frappe-ui data-v1 ./src` rewrites it.

You don't need the plugin for anything else. Components, the `dialog` and
`toast` functions, and every Composition API data helper work without it. Wrap
your app in [`FrappeUIProvider`](../getting-started) instead. Passing an option
the plugin doesn't accept logs a warning in development.

## useFileUpload / FileUploadHandler

Upload a file to Frappe's upload endpoint without the
[`FileUploader`](../components/fileuploader) component. Use them for a custom
trigger, several files at once, or an upload with no UI. `FileUploader` is
built on `FileUploadHandler`.

Uploads are **private** by default: an upload with no `private` option is saved
with `is_private=1`. Pass `private: false` only for files meant to be public.

For a single upload with no reactive state, call `upload(file, options)`. It
takes the same options and resolves to the uploaded file's record.

### useFileUpload

A composable that uploads a file and tracks its progress in reactive state.

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

| Member                                     | Description                                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `upload(file, options)`                    | Resets state, uploads the file, and resolves to its record. Rejects with an [`UploadError`](#uploaderror). |
| `state`                                    | Reactive upload state, updated while the request runs.                                                    |
| `isUploading`, `progress`, `error`, `result` | Computed refs read from `state`. `error` is an `UploadError` or `null`.                                 |
| `reset()`                                  | Clears `state` without uploading anything.                                                                |

`options` (`UploadOptions`):

| Option                              | Type                                    | Description                                                    |
| ----------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| `private`                           | `boolean`                               | Defaults to `true`. Pass `false` for public files.             |
| `folder`                            | `string`                                | Defaults to `Home`.                                            |
| `doctype` / `docname` / `fieldname` | `string`                                | Attaches the upload to a document field.                       |
| `file_url`                          | `string`                                | Replaces the file at an existing URL.                          |
| `method`                            | `string`                                | A whitelisted method to call instead of the default handler.   |
| `type`                              | `string`                                | Sent to the upload endpoint unchanged.                         |
| `upload_endpoint`                   | `string`                                | Defaults to `/api/method/upload_file`.                         |
| `optimize`                          | `boolean`                               | Resize the image on the server.                                |
| `max_width` / `max_height`          | `number`                                | Used when `optimize` is set.                                   |
| `params`                            | `object`                                | Extra form fields, sent unchanged.                             |
| `signal`                            | `AbortSignal`                           | Cancels the upload.                                            |
| `onProgress`                        | `(p: { loaded, total, percent }) => void` | Called on every progress update.                             |

### FileUploadHandler

A class that uploads a file and reports progress through events. Use it when you
want `.on(…)` listeners instead of reactive state. `FileUploader` uses it.

```ts
import { FileUploadHandler } from 'frappe-ui'

const handler = new FileUploadHandler()
handler.on('start', () => {})
handler.on('progress', ({ uploaded, total }) => {})
handler.on('error', (error) => {})
handler.on('finish', () => {})

const result = await handler.upload(file, { doctype: 'ToDo' })
```

`upload(file, options)` takes the same `UploadOptions` as `useFileUpload`,
resolves to the uploaded file's record, and rejects with an
[`UploadError`](#uploaderror). The events fire while the promise runs:

| Event      | Payload                | Fires when                  |
| ---------- | ---------------------- | --------------------------- |
| `start`    | none                   | The request starts.         |
| `progress` | `{ uploaded, total }`  | Upload progress changes.    |
| `error`    | The server's error text, if any | The upload fails. |
| `finish`   | none                   | The upload succeeds.        |

## UploadError

The error every upload failure rejects with. `upload`, `useFileUpload` and
`FileUploadHandler` all raise it, and `useFileUpload`'s `state.error` holds it.

| Field      | Type                                              | Description                                                  |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `kind`     | `'file-size' \| 'network' \| 'server' \| 'abort'` | What failed. Check this instead of matching the message.     |
| `status`   | `number \| undefined`                             | The HTTP status, for `kind: 'server'`.                       |
| `messages` | `string[]`                                        | The server messages, parsed. Empty for the other kinds.      |
| `response` | `unknown`                                         | The parsed response body, for `kind: 'server'`.              |

```vue
<script setup>
import { toast, upload, UploadError } from 'frappe-ui'

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
