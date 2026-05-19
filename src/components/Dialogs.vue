<template>
  <div v-if="isPrimaryHost">
    <!-- Legacy `confirmDialog()` stack — back-compat. -->
    <component
      v-for="legacy in legacyDialogs"
      :is="legacy"
      :key="legacy.id ?? legacy"
    />
    <!-- v1 imperative `dialog.*` stack. -->
    <component v-for="d in imperativeDialogs" :is="d.component" :key="d.id" />
  </div>
</template>

<script setup>
import { inject, provide } from 'vue'
import { dialogs as legacyDialogs } from '../utils/confirmDialog.js'
import { dialogs as imperativeDialogs } from '../utils/dialog'

// Only the outermost `<Dialogs />` host renders the stacks. Apps that wrap
// their tree in `<FrappeUIProvider>` (which mounts `<Dialogs />` internally)
// *and* also mount `<Dialogs />` manually for legacy `confirmDialog()` would
// otherwise see every dialog twice. A nested host yields to its ancestor.
const DIALOGS_HOST_KEY = Symbol.for('frappe-ui.dialogs-host')
const hasParentHost = inject(DIALOGS_HOST_KEY, false)
const isPrimaryHost = !hasParentHost
provide(DIALOGS_HOST_KEY, true)
</script>
