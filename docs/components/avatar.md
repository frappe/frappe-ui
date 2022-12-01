<script setup>
import { Avatar } from '../../src/index'
</script>

# Avatar

The Avatar component is usually used to show display picture of a user or a
fallback with their initials.

## Usage

<Story class="gap-4">

<Avatar imageURL="https://placekitten.com/100" label="Whiskers" />
<Avatar imageURL="" label="Whiskers" />

<Avatar imageURL="https://placekitten.com/150" label="Charlie" size="sm" />
<Avatar imageURL="" label="Charlie" size="sm" />

<Avatar imageURL="https://placekitten.com/200" label="Felix" size="lg" />
<Avatar imageURL="" label="Felix" size="lg" />

<Avatar imageURL="https://placekitten.com/180" label="Snowy" shape="square" />
<Avatar imageURL="" label="Snowy" shape="square" />

</Story>

```vue
<template>
  <Avatar imageURL="https://placekitten.com/100" label="Whiskers" />
  <Avatar imageURL="" label="Whiskers" />

  <Avatar imageURL="https://placekitten.com/150" label="Charlie" size="sm" />
  <Avatar imageURL="" label="Charlie" size="sm" />

  <Avatar imageURL="https://placekitten.com/200" label="Felix" size="lg" />
  <Avatar imageURL="" label="Felix" size="lg" />

  <Avatar imageURL="https://placekitten.com/180" label="Snowy" shape="square" />
  <Avatar imageURL="" label="Snowy" shape="square" />
</template>

<script setup>
import { Avatar } from 'frappe-ui'
</script>
```

## Props

| Name       | Default  | Value              | Description                                                                        |
| :--------- | :------- | :----------------- | :--------------------------------------------------------------------------------- |
| `imageURL` | `null`   | `String`           | URL to an image                                                                    |
| `label`    | `null`   | `String`           | First character of the label will be used as a placeholder when imageURL is `null` |
| `size`     | `'md'`   | `sm \| md \| lg`   | Size of the element                                                                |
| `shape`    | `circle` | `circle \| square` | Shape of the element                                                               |
