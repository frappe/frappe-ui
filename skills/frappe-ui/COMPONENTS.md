# Component catalog

Import everything from `'frappe-ui'`. Below: when to reach for each component, key props, and gotchas.

## Icons

Render any lucide icon as a `<span>` with the icon class — never import a Vue component per icon, never use an `<i>` tag, never inline an `<svg>`.

```vue
<span class="lucide-edit size-4" aria-hidden="true" />
<span class="lucide-plus size-5 text-ink-gray-7" aria-hidden="true" />
```

- Class name is `lucide-<kebab-case-name>` (e.g. `lucide-arrow-right`, `lucide-circle-check`).
- Size with Tailwind's `size-*` (`size-3`, `size-4`, `size-5` cover most UI).
- Always `aria-hidden="true"` — icons are decorative; the surrounding label carries meaning. If the icon is the *only* content (icon-only button), give the parent an `aria-label`.
- Color inherits from `currentColor` — set on the parent or with `text-ink-*`.

For frappe-ui components that take an `icon` prop (Button, Dropdown options, Dialog, Alert, Badge), pass the namespaced **string** `"lucide-edit"` — the component renders the span for you.

## Actions

### `Button`
Default for any trigger. `<Button :label icon iconLeft iconRight variant theme size loading disabled />`.
- `variant`: `solid | outline | subtle | ghost` (default `subtle`).
- `theme`: `gray | blue | red | green` (default `gray`).
- `size`: `sm | md | lg | xl | 2xl` (default `sm`).
- Use `Button` for navigation too: pass `route` (Vue Router) or `link` (external URL); it renders the correct element with the right semantics.
- Icon-only: pass just `icon`. Combine `iconLeft` + `label` for leading-icon buttons.
- Primary actions: `variant="solid" theme="gray"`. Destructive: `variant="solid" theme="red"` or `subtle theme="red"`.

### `Dropdown`
Menu of actions anchored to a trigger. `<Dropdown :options="[{ label, icon, onClick, ... }]"><Button ... /></Dropdown>`.
- The first child is the trigger.
- Pass actions as `options`; nested groups via `options: [{ group: 'Label', items: [...] }]`.

## Overlays

### `Dialog`
Modal. Always `v-model:open`. Props: `title`, `message`, `icon`, `theme`, `size`, `actions`, `dismissible`.
- `actions` is an array of button configs; each `onClick` receives `{ close }`.
- `bare` to suppress chrome (full-bleed content like command palettes).
- For confirm/alert/prompt, prefer the **imperative API** below.

### Imperative dialogs
```ts
import { dialog, toast } from 'frappe-ui'

dialog.confirm({ title: 'Delete?', theme: 'red', onConfirm: async () => await api.delete() })
dialog.alert({ title: 'Saved' })
const { values } = await dialog.prompt({ title: 'Rename', fields: [{ name: 'title', label: 'Title', required: true }] })
toast.success('Saved'); toast.error('Failed'); toast.info('FYI')
```
Mount `<FrappeUIProvider>` once near the app root.

### `Popover` / `Tooltip`
- `Popover` for arbitrary anchored content. `v-model:open`, slots: `#target` (trigger), `#body` (content).
- `Tooltip` for hover hints. `<Tooltip text="..."><Button .../></Tooltip>`. Don't use Tooltip for actionable UI — that's `Popover` / `Dropdown`.

## Input controls

All input controls accept the **shared labeling contract**: `label`, `description`, `error`, `required`.

### `FormControl`
The default wrapper. Pass `type="text" | "textarea" | "select" | "checkbox" | "autocomplete"` etc. Use it instead of raw `TextInput` when you need a labeled field with consistent layout.

### `TextInput` / `Textarea` / `Password`
Single-line / multi-line / masked input. `v-model="value"`. Use `FormControl :type="..."` if you want the field wrapper.

### `Select`
Fixed list, single value. `<Select v-model :options="[{ label, value }]" placeholder="..." />`.

### `MultiSelect`
Fixed list, multiple values. `v-model` is `string[]`.

### `Combobox`
Single-select with search. `v-model="selected"` + `v-model:query="q"`. For options that filter as user types.

### `Autocomplete`
Async-fetched options (typically Frappe doctype links). Pass `fetchOptions` or use it inside Frappe Link contexts.

### `Checkbox` / `Switch`
Boolean. `v-model="checked"` + `:label`. `Switch` for settings-style toggles; `Checkbox` for forms / multi-pick rows.

### `DatePicker` / `MonthPicker` / `TimePicker` / `DateRangePicker`
`v-model` holds the value. `DateRangePicker` v-model is `string[]` of length 2.

### `Slider` / `Rating`
`v-model` numeric. Standard labeling props apply.

### `FileUploader`
Frappe-native file upload. Renders an upload control with progress; emits the uploaded `File` doc.

## Display

### `Badge`
Status pill. `<Badge :label theme variant size />`. Same color axes as Button.

### `Alert`
Inline banner. `<Alert :title variant theme>` + slot for body.

### `Avatar`
`<Avatar :label :image size />`. `label` is used to generate initials when no image.

### `Tooltip` — see Overlays.

### `Progress` / `CircularProgressBar` / `Spinner` / `LoadingIndicator` / `LoadingText`
- `Spinner` / `LoadingIndicator` for inline loading.
- `LoadingText` for skeleton-style text placeholder.
- `Progress` linear; `CircularProgressBar` radial.

### `Divider`
Horizontal/vertical rule. Prefer over `<hr class="..." />`.

### `Breadcrumbs`
`<Breadcrumbs :items="[{ label, route }]" />`.

### `Tabs` / `TabButtons`
- `Tabs` for full content tabs (top-level page sections). `v-model:tab`.
- `TabButtons` for inline segmented controls (filter switches).

### `KeyboardShortcut`
Renders a kbd combo. `<KeyboardShortcut keys="cmd+k" />`.

## Lists & data

### `ListView`
Table/grid list with built-in selection, sorting, virtualization. Configure via `columns`, `rows`, `options`. Prefer this over hand-rolled `<table>` for any data list.

### `ItemListRow`
Single-row list item (label + prefix/suffix). Compose into custom lists when `ListView` is too heavy.

### `ListFilter`
Filter builder UI matched to Frappe-style queries.

### `Tree`
Hierarchical lists.

### `Calendar`
Month/week calendar view.

### `Charts`
Chart family (line, bar, etc.) wrapping ECharts/Frappe Charts.

### `TextEditor`
TipTap-based rich text. Heavy — only when you need real content editing.

### `CommandPalette`
Cmd-K palette. Compose with `Dialog bare`.

## Layout

### `Sidebar`
App-shell sidebar primitive. Pair with router views.

### `Divider` — see Display.

> Don't use `Card` — compose surfaces directly with `bg-surface-white rounded border border-outline-gray-1 p-4`.

## Provider

### `FrappeUIProvider`
Mount once at app root. Provides:
- Imperative dialog/toast mounts.
- Theme (light/dark via `[data-theme="dark"]`).
- Resource provider for `createResource` / v3 data APIs.

## Data & resources

The recommended way to call Frappe APIs is the **`useCall`** composable (with `useList` / `useDoc` / `useDoctype` / `useNewDoc` for higher-level shapes). Don't use `fetch` / `axios` directly, and don't reach for the legacy `createResource` family in new code — `useCall` is the v3 path.

### `useCall` — recommended for any whitelisted Frappe method

```ts
import { useCall } from 'frappe-ui'

const ping = useCall<string>({
  url: '/api/v2/method/ping',
})
// ping.data, ping.loading, ping.error, ping.execute(), ping.reload(), ping.abort()
```

**Options** (`UseCallOptions<TResponse, TParams>`):
- `url: string | Ref<string>` — the API endpoint. Use a `Ref` / `computed` for reactive URLs (e.g. resource ID in the path).
- `method?: 'GET' | 'POST' | 'PUT' | 'DELETE'` — default `GET`.
- `params?: TParams | (() => TParams)` — request params. Pass a function for reactive params; refs inside are auto-unwrapped. GET requests serialise to the query string; non-GET sends a JSON body.
- `immediate?: boolean` — default `true`. Set `false` for write-style calls you'll trigger with `submit` / `execute`.
- `refetch?: boolean` — re-run automatically when reactive `url` / `params` change.
- `baseUrl?: string` — prefix for `url`.
- `initialData?: TResponse` — value of `.data` before the first response.
- `cacheKey?: string | Array<...>` — when set, the response is persisted in IndexedDB. On next mount, cached data hydrates `.data` while a fresh request runs in the background. Great for "instant" perceived loads.
- `transform?: (data) => data` — mutate or replace the response shape before it lands in `.data`.
- `beforeSubmit?: (params) => void | Promise<void>` — async hook before `submit` fires; throw to abort and surface the error on `.error`.
- `onSuccess?: (data) => void` — fires after a successful response.
- `onError?: (error) => void` — fires after a failed response.

**Reactive return** (treat as a `reactive` object — no `.value`):
- `data` — response data (or cached data while loading).
- `error` — `Error` instance on failure.
- `loading` / `isFetching` — boolean.
- `isFinished` — boolean, true after the first response.
- `canAbort` / `aborted` / `abort()` — request cancellation.
- `promise` — resolves on the next response (success or error); resets after each call so you can `await` the latest.
- `execute()` / `fetch()` / `reload()` — re-run the request; returns `Promise<TResponse | null>`.
- `submit(params?)` — write-style trigger; stores `params` as the current params and runs the request. Typed so calls without a `TParams` generic accept no args.
- `reset()` — clear `submit`-supplied params.
- `url` / `params` — the computed URL and params actually sent.

**Read pattern (auto-fetch on mount):**

```ts
const userResource = useCall<User>({
  url: computed(() => `/api/v2/document/User/${userId.value}`),
  refetch: true,
  cacheKey: ['user', userId],
})
```
```vue
<LoadingText v-if="userResource.loading && !userResource.data" />
<ErrorMessage v-else-if="userResource.error" :message="userResource.error.message" />
<UserCard v-else :user="userResource.data" />
```

**Write pattern (trigger on action):**

```ts
const createTask = useCall<Task, { title: string; description?: string }>({
  url: '/api/v2/method/myapp.api.create_task',
  method: 'POST',
  immediate: false,
  onSuccess: (task) => {
    toast.success('Task created')
    router.push(`/tasks/${task.name}`)
  },
  onError: (err) => toast.error(err.message),
})

async function save() {
  await createTask.submit({ title: form.title, description: form.description })
}
```

**Tips:**
- `immediate: false` + `submit()` is the canonical write shape.
- For lists, prefer `useList` (paginated, with filters/sort) over composing `useCall` by hand.
- For a single doctype document, prefer `useDoc`.
- Pair the loading + error states with the `LoadingIndicator` / `ErrorMessage` components rather than inlining your own.

### Prototyping against a non-Frappe backend

`useCall` is wired to Frappe's response envelope (`{ data: T }`, `{ errors: [...] }`, `X-Frappe-*` headers). Pointing it at a generic REST API (mock server, public API, custom Express/Hono backend) won't work — `.data` will be `undefined` because the response isn't `{ data: ... }`-shaped.

For prototypes and demos, drop to **`useFetch` from `@vueuse/core`** — it's the same composable `useCall` is built on, with no Frappe assumptions:

```ts
import { useFetch } from '@vueuse/core'

// Read
const { data: todo, error, isFetching, execute } = useFetch(
  `https://jsonplaceholder.typicode.com/todos/1`,
).json<Todo>()

// Write (trigger on action)
const { data, execute: save, isFetching: saving } = useFetch(
  '/api/tasks',
  { immediate: false },
).post(() => ({ title: form.title })).json<Task>()

async function onSubmit() {
  await save()
}
```

API parallels: `data`, `error`, `isFetching`, `execute`, `abort`, `onFetchResponse`, `onFetchError`. When you move the prototype onto a real Frappe backend, rename `useFetch(url).json()` → `useCall({ url })` and adjust options — most call sites change ~2 lines.

For repeat-the-same-config-across-many-calls, build a project-local wrapper with `createFetch({ baseUrl, options: { beforeFetch, afterFetch, onFetchError } })` — same primitive `useFrappeFetch` itself uses.

### `useList` / `useDoc` / `useDoctype` / `useNewDoc`

Higher-level wrappers around `useCall` for common Frappe shapes (paginated lists, single docs, doctype metadata, new-doc scaffolds). Use them when they fit; drop to `useCall` when you need a custom endpoint.

### Legacy

`createResource` / `createListResource` / `createDocumentResource` still ship for migration but are not recommended for new code. Convert them to `useCall` / `useList` / `useDoc` when touching the surrounding code.
