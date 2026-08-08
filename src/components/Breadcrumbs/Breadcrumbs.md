# Breadcrumbs

A navigation aid that shows the user’s current location within a hierarchy and allows quick navigation to parent pages.

## Playground

<ComponentPlayground name="Breadcrumbs" />

## Example

<ComponentPreview name="Breadcrumbs-Example" />

## Prefix slot

<ComponentPreview name="Breadcrumbs-Slots" />

## Item shape

Each item needs a `label`. How the item navigates depends on the other fields:

- `route` renders a `<router-link>`.
- `href` renders an `<a>`.
- Neither renders a `<button>`, so use `onClick` to navigate.

Set `href` and `onClick` together when the app navigates by itself but the crumb
must still be a real link. A plain left click runs `onClick` only. A click with
<kbd>Cmd</kbd>, <kbd>Ctrl</kbd> or <kbd>Shift</kbd>, and a middle click, stay
with the browser and open the URL. The context menu keeps "Copy link address".

```js
const items = [
  {
    label: 'Dashboards',
    href: '/app/dashboard',
    onClick: () => router.push('/dashboard'),
  },
  { label: 'Sales' },
]
```

<!-- @include: ./Breadcrumbs.api.md -->
