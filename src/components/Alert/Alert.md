# Alert

An inline message that reports status and offers a next step. The layout is content-driven: a title alone renders a single row, a description or a second action switches to a banner.

## Playground

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

<!-- @include: ./Alert.api.md -->
