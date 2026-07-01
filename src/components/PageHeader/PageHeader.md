# PageHeader

App-shell headers: a desktop `PageHeader`, a mobile `PageHeaderMobile`, and the
`PageHeaderBase` primitive they share. A page declares its header; it renders
into the layout's `<PageHeaderTarget />`.

<ComponentPreview name="PageHeader-Default" />

Clicking the header's empty area scrolls the page to the top. Interactive
elements are ignored; opt others out with `data-no-scroll-top`.

## PageHeaderMobile

Keeps its title centered regardless of the `#left` / `#right` control widths,
and clamps it to two lines. `PageHeaderBackButton` navigates to `to`, or falls
back to browser history.

<ComponentPreview name="PageHeader-Mobile" />

## PageHeaderBase

The unstyled `<header>` primitive behind both. Use it directly for a custom
strip — a toolbar or a second row — that shares the same target.

<!-- @include: ./PageHeader.api.md -->
