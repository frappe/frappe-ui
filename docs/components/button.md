<script setup>
import Button from '../../src/components/Button.vue'
const alert = (text) => window.alert(text)
</script>

# Button

The Button component is used to trigger an action such as submitting a form,
opening a Dialog, or canceling an action.

## Usage

<Story class="gap-4">
  <Button @click="alert('Hello')">Default</Button>
  <Button appearance="primary">Primary</Button>
  <Button appearance="danger">Danger</Button>
  <Button appearance="minimal">Minimal</Button>
  <Button icon="x" />
  <Button icon-left="menu">Menu</Button>
  <Button icon-right="external-link">Link</Button>
  <Button :loading="true">Submit</Button>
</Story>

```vue
<template>
  <Button @click="alert('Hello')">Default</Button>
  <Button appearance="primary">Primary</Button>
  <Button appearance="danger">Danger</Button>
  <Button appearance="minimal">Minimal</Button>
  <Button icon="x" />
  <Button icon-left="menu">Menu</Button>
  <Button icon-right="external-link">Link</Button>
  <Button :loading="true">Submit</Button>
</template>

<script setup>
import { Button } from 'frappe-ui'
</script>
```

## Props

| Name          | Default       | Value                                                                      | Description                                                                                           |
| :------------ | :------------ | :------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `label`       | `null`        | `String`                                                                   |                                                                                                       |
| `appearance`  | `'secondary'` | `primary \| secondary \| danger \| success \| warning \| white \| minimal` |                                                                                                       |
| `disabled`    | `false`       | `true \| false`                                                            |                                                                                                       |
| `active`      | `false`       | `true \| false`                                                            | Only applicable if `appearance` is `minimal`                                                          |
| `icon`        | `null`        | [Feather Icon](/components/feathericon) name                               | Will only display icon without label. If `label` is provided, `aria-label` will be set to that value. |
| `iconLeft`    | `null`        | [Feather Icon](/components/feathericon) name                               |                                                                                                       |
| `iconRight`   | `null`        | [Feather Icon](/components/feathericon) name                               |                                                                                                       |
| `loading`     | `false`       | `true \| false`                                                            | Will show a loading spinner to the left of the button text                                            |
| `loadingText` | `null`        | `String`                                                                   | Set this to change the button text in `loading` state                                                 |
| `route`       | `null`        | `String \| Object`                                                         | If you are using `vue-router`, you can pass a valid `route` value and click handler will be added     |
| `link`        | `null`        | `String`                                                                   | URL to open in a new window on button click                                                           |

## Events

All attributes and event listeners are passed down to the underlying `button`
element, so `@click` and other events will just work like on a normal button.
