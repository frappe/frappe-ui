# Toast

A short message in the bottom-right corner that reports the result of an
action and closes on its own. For a message that stays in the page, use
[`Alert`](./alert).

<ComponentPreview name="Toast-Quickstart" layout="stacked" />

## Examples

### Results of an action

`toast.success`, `toast.error`, `toast.warning` and `toast.info` each show
their own icon, and `toast.message` shows none. `description` adds a second
line.

<ComponentPreview name="Toast-Examples" />

### Undo and refresh

`action` adds a button to the toast. With `duration: Infinity`, the toast waits
until the person clicks it or closes the toast.

<ComponentPreview name="Toast-Actions" />

### Reminders and favorites

`icon` replaces the type's icon with your own.

<ComponentPreview name="Toast-CustomIcon" />

### Sending, deleting and deploying

`toast.promise` shows one toast that changes from loading to success or error
when the promise settles. The deploy button updates a single toast through each
step by passing its `id` back to `toast.loading` and `toast.success`.

<ComponentPreview name="Toast-Async" />

## Behavior

### Setup

The `toast.*` functions need `<ToastProvider />` mounted in the app.
[`FrappeUIProvider`](./frappeuiprovider) already mounts it. `ToastProvider`
takes no props: the position, the look and the default duration are the same
in every app. Up to three toasts show at a time, and each one has a close
button.

### Functions

Every function takes a message and an optional options object, and returns the
toast's id.

| Function        | Shows                                          |
| --------------- | ---------------------------------------------- |
| `toast()`       | a message with no icon                         |
| `toast.message` | the same as `toast()`                          |
| `toast.success` | a success icon                                 |
| `toast.error`   | a red error icon                               |
| `toast.warning` | an amber warning icon                          |
| `toast.info`    | an info icon                                   |
| `toast.loading` | a spinner; the toast stays until you update it |

`toast.dismiss(id)` closes one toast. `toast.dismiss()` with no id closes all
of them.

### Duration

A toast closes after 4000ms. Pass `duration` to change it for one toast, or
`duration: Infinity` to keep it until the person closes it.

```js
toast.success('Saved')
toast.error('Could not save', { duration: 10000 })
toast.info('Uploading…', { duration: Infinity })
```

### Updating a toast

Pass the id a call returned as `id` in a later call. The toast with that id
changes in place instead of a new toast showing.

```js
const id = toast.loading('Uploading…')
toast.success('Uploaded', { id })
```

### Promises

`toast.promise(promise, { loading, success, error })` shows the `loading`
message, then `success` or `error` when the promise settles. `success` and
`error` take a string, or a function that receives the resolved value or the
error. The function returns a string, or an object with `message` and any other
option such as `action`, `description` or `duration`. Use this for an **Undo**
after a success or a **Retry** after a failure.

### Actions

`action` takes `{ label, onClick }` and shows a button in the toast. `cancel`
takes the same shape.

### Custom icon

`icon` takes a render function. To use a Lucide icon, render a `lucide-*`
class and set its size and color with utility classes:

```js
import { h } from 'vue'

toast('Added to favorites', {
  icon: () => h('span', { class: 'lucide-heart size-4 text-ink-red-4' }),
})
```

### HTML in messages

A string message and a string `description` can hold inline HTML. Only `a`,
`em`, `strong`, `i`, `b` and `u` tags are kept. Other tags are removed, so
write `&lt;` for a literal `<`. A component, VNode or render function renders
as it is.

### TypeScript types

`ToastOptions` is the options object every `toast.*` call takes. `ToastAction`
is its `action` or `cancel` button. `ToastId` is what a call returns.

```ts
import { toast, type ToastId, type ToastOptions } from 'frappe-ui'

function notifySaved(options?: ToastOptions): ToastId {
  return toast.success('Saved', options)
}
```
