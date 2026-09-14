# PageHeader

App-shell headers: a desktop `PageHeader`, a mobile `PageHeaderMobile`, and the
`PageHeaderBase` primitive they share. A page declares its header; it renders
into the layout's `<PageHeaderTarget />`.

<ComponentPreview name="PageHeader-Default" />

A single click on the header's empty area scrolls the page to the top.
Interactive elements are ignored — links, buttons, form controls, and anything
with `role="button"`. Opt a non-interactive element out with
`data-no-scroll-top`:

```vue
<PageHeader>
  <Breadcrumbs data-no-scroll-top :items="items" />
</PageHeader>
```

## PageHeaderMobile

Keeps its title centered regardless of the `#prefix` / `#suffix` control widths,
on a single line with a trailing ellipsis. The header is 52px tall, fixed. There
is no CSS variable for the height in v1; a taller strip is `PageHeaderBase` with
your own class.

`PageHeaderBackButton` goes back through history, the way the browser's own back
button does. It only navigates to `fallbackRoute` when there is no in-app
history to go back to, so give it a fallback that makes the page recoverable
on a cold load.

<ComponentPreview name="PageHeader-Mobile" />

## PageHeaderBase

The unstyled `<header>` primitive behind both. Use it directly for a custom
strip — a toolbar or a second row — that shares the same target.

<!-- @include: ./PageHeader.api.md -->
