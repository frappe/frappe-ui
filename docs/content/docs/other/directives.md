# Directives

Two Vue directives that are useful in building frontend apps. Both are named
`vSomething` on purpose: `<script setup>` auto-registers a directive only when
the imported binding is spelled `vFoo`, so importing it is all the setup there
is.

## vFocus

Focuses the first focusable element inside the target on mount. Handy in a
dialog or a popover, where the field the user came for should already be ready
to type into.

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

Bind `false` to skip focusing — useful when the same markup is reused somewhere
focus would be intrusive:

```vue
<div v-focus="!isMobile">…</div>
```

## vOnOutsideClick

Calls the bound handler when a click lands outside the element. In the example
below the bordered div carries the directive, so clicking anywhere outside it
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

Overlay components in this library (`Dialog`, `Popover`, `Dropdown`) already
handle outside clicks themselves — reach for this directive for your own
custom-built surfaces.
