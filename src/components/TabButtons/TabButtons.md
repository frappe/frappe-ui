# TabButtons

A radio-group based tab control for switching between compact views.

> Status: work in progress. The v1 API and implementation are still being
> polished, especially route/link behavior, option compatibility, and
> browser-tab details. Treat this component as preview-quality until this note
> is removed.

## Playground

<ComponentPlayground name="TabButtons" />

## Variants

<ComponentPreview name="TabButtons-Variants" />

## Sizes

<ComponentPreview name="TabButtons-Sizes" />

## Vertical

<ComponentPreview name="TabButtons-Vertical" />

## Prefix and suffix

<ComponentPreview name="TabButtons-PrefixSuffix" />

<!-- @include: ./TabButtons.api.md -->

## Migration from v0

TabButtons no longer wraps `<Button>` internally — each tab is now a native
`<button>`, `<a href>`, or `<RouterLink>` rendering a `<Pill>` for its visual
treatment. This is a breaking change for consumers that were passing Button
props through option entries.

- `theme`, `variant`, `size`, `loading`, `prefix` on individual options are no
  longer honored. Use `Button` or `Pill` directly if you need per-tab theming or
  a loading spinner.
- `hideLabel` on options is gone. Use `icon` for an icon-only tab — its `label`,
  if provided, is automatically exposed as accessibility text. Use `iconLeft` /
  `iconRight` when you want an accent icon next to a visible label.
- `route` and `href` on options are honored: a tab renders as a `<RouterLink>`
  when `route` is set, or an `<a href target=_blank>` when `href` is set.
- The per-tab `tooltip` value now surfaces as the native `title` attribute
  rather than the floating `<Tooltip>` popover. Wrap the `TabButtons` instance
  in a custom tooltip if you need styled behavior.
