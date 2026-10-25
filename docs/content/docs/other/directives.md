# Directives

Two Vue directives for focus and outside clicks. Both are named like `vFocus`
because `<script setup>` registers a directive only when the imported name is
`v` followed by a capital letter, so importing one is all the setup it needs.

## vFocus

Focuses the first focusable element inside the target on mount. Use it in a
dialog or popover, so the user can start typing in the main field right away.

```vue
<script setup>
import { vFocus, Dialog, TextInput } from 'frappe-ui'
</script>

<template>
  <Dialog v-model:open="open" title="Rename">
    <div v-focus>
      <TextInput v-model="name" />
    </div>
  </Dialog>
</template>
```

Add the `autoselect` argument to also select the existing text, so typing
replaces it:

```vue
<div v-focus:autoselect>
  <TextInput v-model="name" />
</div>
```

Bind `false` to skip focusing, for example when the same markup is reused where
moving focus would get in the way:

```vue
<div v-focus="!isMobile">…</div>
```

## vOnOutsideClick

Calls the bound handler when the user clicks outside the element. In this
example the bordered div has the directive, so clicking anywhere outside it
runs `setInactive`.

```vue
<script setup>
import { ref } from 'vue'
import { vOnOutsideClick, Button } from 'frappe-ui'

const active = ref(false)
const setInactive = () => (active.value = false)
</script>

<template>
  <div class="rounded-6 border p-8" v-on-outside-click="setInactive">
    <Button @click="active = true">
      {{ active ? 'Click outside' : 'Click me' }}
    </Button>
  </div>
</template>
```

The library's overlay components (`Dialog`, `Popover`, `Dropdown`) already
handle outside clicks. Use this directive for elements you build yourself.
