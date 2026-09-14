# Icon

Renders a single icon from any of the forms accepted library-wide (P11): a
`lucide-*` string, an emoji/symbol string, or a Vue component. Most
components take an icon prop directly and render it through `Icon`
internally — reach for `Icon` yourself only when you need an icon outside
of one of those props.

Pass the source through the `icon` prop:

```vue
<Icon icon="lucide-circle-check" class="size-4" />
```

## Lucide string

<ComponentPreview name="Icon-Lucide" />

## Component

<ComponentPreview name="Icon-ComponentIcon" />

<!-- @include: ./Icon.api.md -->
