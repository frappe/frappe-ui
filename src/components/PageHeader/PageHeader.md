# PageHeader

App-shell headers: a desktop `PageHeader`, a mobile `PageHeaderMobile`, and the
`PageHeaderBase` primitive they share. A page declares its header; it renders
into the layout's `<PageHeaderTarget />`.

<ComponentPreview name="PageHeader-Default" />

Clicking the header's empty area scrolls the page to the top. Interactive
elements are ignored; opt others out with `data-no-scroll-top`.

## PageHeaderMobile

Keeps its title centered regardless of the `#left` / `#right` control widths, on
a single line with a trailing ellipsis.

`PageHeaderBackButton` goes back through history, the way the browser's own back
button does. It only navigates to `to` when there is no in-app history to go
back to, so give it a `to` that makes the page recoverable on a cold load.

<ComponentPreview name="PageHeader-Mobile" />

## PageHeaderBase

The unstyled `<header>` primitive behind both. Use it directly for a custom
strip — a toolbar or a second row — that shares the same target.

<!-- @include: ./PageHeader.api.md -->
