# Icon

Renders a single icon from any of the forms accepted library-wide (P11): a
`lucide-*` string, an emoji/symbol string, or a Vue component. Most
components take an icon prop directly and render it through `Icon`
internally — reach for `Icon` yourself only when you need an icon outside
of one of those props.

Pass the source through the canonical `icon` prop:

```vue
<Icon icon="lucide-circle-check" class="size-4" />
```

The existing `name` prop remains fully supported with the same value types.
When both props are present, `icon` takes precedence; an explicit `icon=""` or
`:icon="null"` intentionally renders nothing, while `:icon="undefined"` falls
back to `name`.

## Lucide string

<ComponentPreview name="Icon-Lucide" />

## Component

<ComponentPreview name="Icon-ComponentIcon" />

<!-- @include: ./Icon.api.md -->
