# PageHeader

The header row at the top of a page in an app shell. On mobile, use
`PageHeaderMobile`.

<ComponentPreview name="PageHeader-Default" />

## Anatomy

`DesktopShell` and `MobileShell` each render a `PageHeaderTarget`. A page
declares its header anywhere in its template, and the header moves into that
target. `PageHeader` is the desktop header, `PageHeaderMobile` the mobile one,
and `PageHeaderBase` is the plain `<header>` both are built on.

```vue
<!-- Desktop page -->
<PageHeader>
  <PageHeaderTitle title="Engineering" />
  <Button label="New discussion" variant="solid" />
</PageHeader>

<!-- Mobile page -->
<PageHeaderMobile>
  <template #prefix>
    <PageHeaderBackButton :fallback-route="{ name: 'Spaces' }" />
  </template>
  <PageHeaderMobileTitle title="Engineering" />
  <template #suffix>
    <Button variant="ghost" icon="lucide-more-horizontal" label="Options" />
  </template>
</PageHeaderMobile>
```

## Examples

### Mobile header with a back button

`PageHeaderMobile` with a back button in `#prefix`, a long
`PageHeaderMobileTitle` in the default slot and an options button in `#suffix`.

<ComponentPreview name="PageHeader-Mobile" />

## Behavior

### Where the header renders

The header moves into the `PageHeaderTarget` of the shell it is inside. A
header outside any shell uses the most recently mounted target. With no target
mounted, it renders where it is declared.

### Desktop header

`PageHeader` lays out its default slot in one row, with the items spread to
both ends. It is at least 48px tall. `PageHeaderTitle` shows `title`, or its
default slot, as the page title.

### Click to scroll to the top

A single click on the header's empty area scrolls the page to the top. Clicks
on interactive elements are ignored: links, buttons, form controls, labels, and
anything with `role="button"`. To exclude another element, add
`data-no-scroll-top`:

```vue
<PageHeader>
  <Breadcrumbs data-no-scroll-top :items="items" />
</PageHeader>
```

### Mobile header

`PageHeaderMobile` keeps its title centered however wide the `#prefix` and
`#suffix` controls are. The title stays on one line and ends with an ellipsis.
Pass it as the `title` prop, or put a `PageHeaderMobileTitle` in the default
slot. `PageHeaderMobileTitle` takes a `#prefix` for an icon beside the text,
and only the text is shortened.

The header is 52px tall, fixed. For a header of another height, use
`PageHeaderBase` with your own class.

### Back button

`PageHeaderBackButton` goes back through history, the way the browser's back
button does. It navigates to `fallbackRoute` only when there is no in-app
history to go back to, for example after a cold load onto a deep link. Give it
a fallback so the page has a way out on a cold load.

### Custom header

`PageHeaderBase` is the unstyled `<header>` behind both headers. Use it for a
custom strip, such as a toolbar or a second row, that renders into the same
target.

## Accessibility

Each header renders a `<header>` element. `PageHeaderMobile` puts its title in
an `<h1>`. `PageHeaderBackButton` is named "Back". Set `label` to change it.

<!-- @include: ./PageHeader.api.md -->
