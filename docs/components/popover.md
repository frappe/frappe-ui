<script setup>
import { Popover, Button } from '../../src/index'
let emojis = ['👍', '👎', '🔥', '🍿', '❤️']
</script>

# Popover

The Popover component is used whenever a piece of UI needs to be shown in a
popup.

## Usage

Popover is a headless component that will let you create custom popups. The
`target` slot provides slotProps like `togglePopover`, `open`, `close` to
trigger the popover. Here you can render a button or any element that will open
the popover. In the `body` and `body-main` slots you can render the contents of
the popover.

<Story class="gap-4">
    <Popover transition="default">
    <template #target="{ togglePopover, isOpen }">
      <Button
        appearance="minimal"
        icon-left="smile"
        @click="togglePopover()"
        :active="isOpen"
      >
        Feedback
      </Button>
    </template>
    <template #body-main>
      <div class="grid grid-cols-5 p-0.5">
        <button
          class="grid h-8 w-8 place-items-center rounded p-1 hover:bg-gray-100"
          v-for="emoji in emojis"
        >
          {{ emoji }}
        </button>
      </div>
    </template>
  </Popover>
</Story>

```vue
<template>
  <Popover transition="default">
    <template #target="{ togglePopover, isOpen }">
      <Button
        appearance="minimal"
        icon-left="smile"
        @click="togglePopover()"
        :active="isOpen"
      >
        Feedback
      </Button>
    </template>
    <template #body-main>
      <div class="grid grid-cols-5 p-0.5">
        <button
          class="grid h-8 w-8 place-items-center rounded p-1 hover:bg-gray-100"
          v-for="emoji in emojis"
        >
          {{ emoji }}
        </button>
      </div>
    </template>
  </Popover>
</template>

<script setup>
import { Popover } from 'frappe-ui'
</script>
```

## Props

| Name           | Default          | Value                                                                                                                                        | Description                                        |
| :------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| `trigger`      | `'click'`        | `click \| hover`                                                                                                                             | See [trigger](#trigger)                            |
| `hoverDelay`   | `0`              | `Number` in seconds                                                                                                                          | Only applicable if `trigger` is `hover`            |
| `leaveDelay`   | `0`              | `Number` in seconds                                                                                                                          | Only applicable if `trigger` is `hover`            |
| `placement`    | `'bottom-start'` | `top-start \| top \| top-end \| bottom-start \| bottom \| bottom-end \| right-start \| right \| right-end \| left-start \| left \| left-end` | Placement of the popup with respect to the trigger |
| `popoverClass` | `null`           | `String`                                                                                                                                     | Class to apply to the popover container            |
| `transition`   | `null`           | `Object \| 'default'`                                                                                                                        | See [transition](#transition)                      |
| `hideOnBlur`   | `true`           | `Boolean`                                                                                                                                    | Whether to close the popup on clicking outside     |
| `show`         | `undefined`      | `Boolean`                                                                                                                                    | Control when popup shows based on this prop        |

### `trigger`

The trigger prop allows you control whether the popup should open on `click` of
the target element or `hover`. If you set `trigger` as `hover` you get two more
props to control its behaviour: `hoverDelay` and `leaveDelay`. If you keep your
mouse pointer on the popup content the popup wont close.

<Story class="gap-4">
  <Popover trigger="hover" :hoverDelay="0.5" :leaveDelay="1">
    <template #target>
      <Button>Hover me</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-base">Popup content</div>
    </template>
  </Popover>
</Story>

```vue
<template>
  <Popover trigger="hover" :hoverDelay="0.5" :leaveDelay="1">
    <template #target>
      <Button>Hover me</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-base">Popup content</div>
    </template>
  </Popover>
</template>
```

### `transition`

The transition prop is an object that can be used to add transitions the enter
and exit states of the popup. Internally, this prop is directly passed to the
`transition` component.

<Story class="gap-4">
  <Popover transition="default" trigger="hover">
    <template #target>
      <Button>Default transition</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-base">Popup content</div>
    </template>
  </Popover>
  <Popover
    trigger="hover"
    :transition="{
      enterActiveClass: 'transition duration-500 ease-in-out origin-top-left',
      enterFromClass: 'scale-0',
      enterToClass: 'scale-100',
      leaveActiveClass: 'transition duration-300 ease-in-out origin-top-right',
      leaveFromClass: 'scale-100',
      leaveToClass: 'scale-0',
    }"
  >
  <template #target>
      <Button>Custom Transition</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-base">Popup content</div>
    </template>
  </Popover>
</Story>

```vue
<template>
  <Popover transition="default" trigger="hover">
    <template #target>
      <Button>Default transition</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-base">Popup content</div>
    </template>
  </Popover>

  <Popover
    trigger="hover"
    :transition="{
      enterActiveClass: 'transition duration-500 ease-in-out origin-top-left',
      enterFromClass: 'scale-0',
      enterToClass: 'scale-100',
      leaveActiveClass: 'transition duration-300 ease-in-out origin-top-right',
      leaveFromClass: 'scale-100',
      leaveToClass: 'scale-0',
    }"
  >
    <template #target>
      <Button>Custom Transition</Button>
    </template>
    <template #body-main>
      <div class="p-2 text-base">Popup content</div>
    </template>
  </Popover>
</template>
```

## Slots

| Name        | Description                                                                     |
| :---------- | :------------------------------------------------------------------------------ |
| `target`    | Reference element against which the popup is positioned                         |
| `body-main` | Popup content rendered inside a `div` with white background and rounded corners |
| `body`      | Popup content without any markup                                                |
