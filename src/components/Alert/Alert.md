# Alert

A message inside the page that reports a status and offers a next step. For a
short message that goes away on its own, use [`toast`](./toast) instead.

<ComponentPlayground name="Alert" />

## Examples

### Confirmations

Plain messages with only a × button. `dismissible` shows the button, and the
parent removes the alert on `@dismiss`.

<ComponentPreview name="Alert-DismissibleRows" />

### Status with an action

One-line status messages with one `primaryAction` each. `theme` colors the
icon and the action label.

<ComponentPreview name="Alert-ThemedRows" />

### Warnings that need a decision

A `description` or a `secondaryAction` switches the alert to the banner
layout. The "Dismiss" action calls `dismiss()` from its `onClick` context.

<ComponentPreview name="Alert-Banners" />

### Trial ending

A banner with one action and a × button in the corner.

<ComponentPreview name="Alert-DismissibleBanner" />

### Import in progress

`#prefix` replaces the status icon with a spinner, and `#description` holds
formatted text.

<ComponentPreview name="Alert-ImportProgress" />

## Behavior

### Layout

The alert has no layout prop. With only a title, it is a single row. A
`description`, a `#description` slot or a `secondaryAction` switches it to the
banner layout, with the description and buttons below the title. The
container looks the same for every `theme`. Only the icon and the row action
label take the theme's color.

### Icon

`icon` has three states. Unset or `true` shows the theme's status icon. The
gray theme shows the info icon in black. `false` hides the icon. A `lucide-*`
class name or a Vue component shows that icon instead, in the theme's color.

```vue
<!-- the theme's icon -->
<Alert title="Saved" theme="green" />
<!-- the same icon, written out -->
<Alert title="Saved" theme="green" :icon="true" />
<!-- no icon -->
<Alert title="Saved" :icon="false" />
<!-- your own icon -->
<Alert title="Saved" icon="lucide-rocket" />
```

### Actions

`primaryAction` and `secondaryAction` take `Button` props plus an `onClick`
that receives `{ dismiss }`. While an `onClick` that returns a promise is
running, its button shows a spinner and ignores more clicks. A `loading` value
you pass wins over this. A `secondaryAction` without a `primaryAction` logs a
warning in development.

The `#actions` slot replaces both buttons and receives `{ dismiss }`.

### Dismissing

The alert never hides itself. The × button and `dismiss()` only emit
`dismiss`. The parent hides the alert, usually with `v-if`.

## Accessibility

A `red` or `amber` alert has the `alert` role, so screen readers read it out
at once. Other themes have the `status` role, which screen readers read out
when they are idle. The × button is labelled "Dismiss".

## Migrating from v0

`Alert` no longer has a `v-model` and never hides itself. Render it with
`v-if` and hide it on `@dismiss`. `theme="yellow"` is now `amber`, the default
`theme` is now `gray` instead of `blue`, the
`variant` and `type` props are gone, the `#icon` slot is now `#prefix`, and the
`#footer` slot is replaced by `primaryAction`, `secondaryAction` and the
`#actions` slot. `dismissible` is now `false` by default. None of these changes
show an error. See the [migration guide](../migration#alert) for the full list.

<!-- @include: ./Alert.api.md -->
