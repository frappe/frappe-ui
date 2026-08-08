<template>
  <div v-if="isPrimaryHost">
    <!-- v1 imperative `dialog.*` stack. -->
    <component v-for="d in imperativeDialogs" :is="d.component" :key="d.id" />
  </div>
</template>

<script setup lang="ts">
import { inject, provide, type InjectionKey } from 'vue'
import { dialogs as imperativeDialogs } from '../utils/dialog'

// Only the outermost `<Dialogs />` host renders the stack. Apps that wrap
// their tree in `<FrappeUIProvider>` (which mounts `<Dialogs />` internally)
// *and* also mount `<Dialogs />` manually would otherwise see every dialog
// twice. A nested host yields to its ancestor.
const DIALOGS_HOST_KEY = Symbol.for(
  'frappe-ui.dialogs-host',
) as InjectionKey<boolean>
const hasParentHost = inject(DIALOGS_HOST_KEY, false)
const isPrimaryHost = !hasParentHost
provide(DIALOGS_HOST_KEY, true)
</script>
