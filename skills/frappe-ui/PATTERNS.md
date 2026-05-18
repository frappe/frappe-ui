# UI patterns

Common compositions seen across Frappe Cloud, Gameplan, Desk, Drive, Insights. Reach for these before inventing layouts.

## App shell

```vue
<script setup>
import { FrappeUIProvider, Sidebar } from 'frappe-ui'
</script>

<template>
  <FrappeUIProvider>
    <div class="flex h-screen bg-surface-white text-ink-gray-9">
      <Sidebar />
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </FrappeUIProvider>
</template>
```

Mount `FrappeUIProvider` once at the app root so imperative `dialog.*` / `toast.*` work.

## Page header

```vue
<header class="flex items-center justify-between border-b border-outline-gray-1 px-6 py-4">
  <div>
    <Breadcrumbs :items="crumbs" />
    <h1 class="mt-1 text-xl text-ink-gray-9">{{ title }}</h1>
  </div>
  <div class="flex gap-2">
    <Button icon="lucide-filter" label="Filter" />
    <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New" @click="create" />
  </div>
</header>
```

Primary action: `variant="solid" theme="gray"`. Secondary actions: default `subtle`.

## Form page

```vue
<script setup>
import { FormControl, Button } from 'frappe-ui'
import { reactive } from 'vue'

const form = reactive({ title: '', description: '', priority: 'medium' })
const errors = reactive({})
</script>

<template>
  <form class="mx-auto max-w-xl space-y-4 p-6" @submit.prevent="save">
    <FormControl v-model="form.title" label="Title" required :error="errors.title" />
    <FormControl v-model="form.description" type="textarea" label="Description" description="Markdown supported." />
    <FormControl
      v-model="form.priority"
      type="select"
      label="Priority"
      :options="[
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ]"
    />
    <div class="flex justify-end gap-2 pt-2">
      <Button label="Cancel" @click="cancel" />
      <Button variant="solid" theme="gray" type="submit" :loading="saving" label="Save" />
    </div>
  </form>
</template>
```

Rules:
- One column. Stack with `space-y-4`.
- Every field uses `FormControl` (or a direct input control) with `label` + `error`.
- Submit pair: secondary `Cancel` left, primary `Save` right.

## API calls

Always use `useCall` (or `useList` / `useDoc`) — never raw `fetch` / `axios`.

**Read (auto on mount):**
```ts
import { useCall } from 'frappe-ui'

const user = useCall<User>({
  url: computed(() => `/api/v2/document/User/${userId.value}`),
  refetch: true,
  cacheKey: ['user', userId],
})
```

**Write (trigger on action):**
```ts
import { useCall, toast } from 'frappe-ui'

const saveTask = useCall<Task, { title: string }>({
  url: '/api/v2/method/myapp.api.create_task',
  method: 'POST',
  immediate: false,
  onSuccess: () => toast.success('Saved'),
  onError: (err) => toast.error(err.message),
})

async function onSubmit() {
  await saveTask.submit({ title: form.title })
}
```

Bind `saveTask.loading` to `<Button :loading>`; render `saveTask.error?.message` next to the form.

## Confirmation flow

```ts
import { dialog, toast } from 'frappe-ui'

async function deleteItem(id) {
  dialog.confirm({
    title: 'Delete this item?',
    message: 'This cannot be undone.',
    theme: 'red',
    confirmLabel: 'Delete',
    onConfirm: async ({ close }) => {
      await api.delete(id)
      toast.success('Deleted')
    },
  })
}
```

Never build your own confirm `<Dialog>` for this.

## List page

```vue
<script setup>
import { ListView, Button, useList } from 'frappe-ui'

const tasks = useList<Task>({
  doctype: 'Task',
  fields: ['name', 'title', 'status', 'modified'],
})
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center justify-between border-b border-outline-gray-1 px-6 py-3">
      <h1 class="text-lg text-ink-gray-9">Tasks</h1>
      <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New Task" />
    </header>
    <ListView
      class="flex-1"
      :columns="[
        { label: 'Title', key: 'title' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'modified' },
      ]"
      :rows="tasks.data ?? []"
      :loading="tasks.loading"
      row-key="name"
    />
  </div>
</template>
```

## Empty state

```vue
<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <div class="rounded-full bg-surface-gray-2 p-3 text-ink-gray-5">
    <span class="lucide-inbox size-6" aria-hidden="true" />
  </div>
  <p class="text-base text-ink-gray-7">No tasks yet</p>
  <p class="text-sm text-ink-gray-5">Create one to get started.</p>
  <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New Task" class="mt-2" />
</div>
```

## Settings panel

Two-column: nav on the left (`Sidebar` or vertical `Tabs`), form on the right. Each section uses the **form page** pattern. Save action at the bottom of each section, not floating.

## Toast usage

- `toast.success('Saved')` — after writes complete.
- `toast.error(err.message)` — for transient failures.
- `toast.info('Heads up')` — neutral notifications.

Don't use toasts for confirmations or anything requiring a decision — that's `dialog.confirm`.

## Status badges

```vue
<Badge :label="status" :theme="statusTheme(status)" variant="subtle" />
```

Map statuses to themes in one place:
```ts
function statusTheme(s) {
  return ({ open: 'blue', closed: 'gray', error: 'red', done: 'green' })[s] ?? 'gray'
}
```

## Loading states

- Buttons: `<Button :loading="saving" />`.
- Inline blocks: `<LoadingIndicator />` / `<Spinner />`.
- Skeleton text: `<LoadingText :lines="3" />`.
- Whole-page first load: render the page shell + `LoadingText` placeholders inside content slots. Don't blank out the screen.

## Dark-mode check

Before declaring a page done, toggle `[data-theme="dark"]` on `<html>` (or your app's dark-mode switch) and verify nothing looks broken. If you used only semantic tokens, it should just work.
