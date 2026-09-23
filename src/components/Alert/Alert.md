# Alert

An inline message that reports status and offers a next step. The layout is content-driven: a title alone renders a single row, a description or a second action switches to a banner.

<ComponentPlayground name="Alert" />

## Dismissible rows

Plain confirmations with only a × button. The parent hides the alert on `@dismiss`.

<ComponentPreview name="Alert-DismissibleRows" />

## Themed rows

One-line status rows with a single action. The theme colors the icon and the action label.

<ComponentPreview name="Alert-ThemedRows" />

## Banners

A description or a second action switches the alert to the banner layout. A "Dismiss" action calls `context.dismiss()`.

<ComponentPreview name="Alert-Banners" />

## Dismissible banner

An info banner with one action and a × button in the corner.

<ComponentPreview name="Alert-DismissibleBanner" />

## Slot overrides

`#prefix` replaces the status icon and `#description` carries rich content.

<ComponentPreview name="Alert-ImportProgress" />

## The icon prop

`icon` has three states. Unset or `true` renders the theme's own status glyph
(gray shows the info glyph in black ink). `false` hides it. A `lucide-*` class
name or a Vue component renders that glyph instead, in the theme's color.

```vue
<Alert title="Saved" theme="green" />
<!-- the theme's auto icon -->
<Alert title="Saved" theme="green" :icon="true" />
<!-- the same auto icon, stated -->
<Alert title="Saved" :icon="false" />
<!-- no icon -->
<Alert title="Saved" icon="lucide-rocket" />
<!-- your own -->
```

## Styling

The tone is on the root as `data-color`, and the computed layout as
`data-layout`:

| Hook                                            | Meaning                                    |
| ----------------------------------------------- | ------------------------------------------- |
| `[data-color="gray\|blue\|green\|amber\|red"]` | the `theme` prop                           |
| `[data-layout="row\|banner"]`                   | one line, or the stacked layout            |

`data-color`, not `data-theme`: `data-theme` is the light/dark attribute the
app sets on the document, and an alert must not look like a theme root.

```css
:where([data-color='red']) {
  /* your overrides */
}
```

<!-- @include: ./Alert.api.md -->
