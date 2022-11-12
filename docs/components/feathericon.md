<script setup>
import FeatherIcon from '../../src/components/FeatherIcon.vue'
</script>

# FeatherIcon

The FeatherIcon component can be used to render SVG icons from the
[FeatherIcons](https://feathericons.com) project.

## Usage

Setting dimensions (width and height) is required otherwise it will render in a
large size. You can also customize the color by setting the `color` CSS
property. You can customize the `stroke-width` by passing it as a prop.

<Story class="gap-4">
    <FeatherIcon name="alert-triangle" class="w-6 h-6" />
    <FeatherIcon name="chevron-right" class="w-6 h-6 text-red-600" />
    <FeatherIcon name="anchor" class="w-6 h-6 text-blue-500" stroke-width="3" />
    <FeatherIcon name="coffee" class="w-6 h-6 text-green-600" stroke-width="1" />
</Story>

```vue
<template>
  <FeatherIcon name="alert-triangle" class="h-6 w-6" />
  <!-- custom color -->
  <FeatherIcon name="chevron-right" class="h-6 w-6 text-red-600" />
  <!-- custom stroke width -->
  <FeatherIcon name="anchor" stroke-width="3" class="h-6 w-6 text-blue-500" />
  <FeatherIcon name="coffee" stroke-width="1" class="h-6 w-6 text-green-600" />
</template>
<script setup>
import { FeatherIcon } from 'frappe-ui'
</script>
```

## Props

| Name           | Default  | Value    | Description                            |
| :------------- | :------- | :------- | :------------------------------------- |
| `name`         | `circle` | `String` | One of 287 icons from feathericons.com |
| `stroke-width` | `1.5`    | `Number` |                                        |
