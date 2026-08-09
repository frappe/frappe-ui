<template>
  <div v-if="isPrimaryHost">
    <!-- v1 imperative `dialog.*` stack. -->
    <component v-for="d in imperativeDialogs" :is="d.component" :key="d.id" />
  </div>
</template>

<script lang="ts">
// One claim shared by every `<Dialogs />` in the app, so sibling hosts dedup
// too — inject only sees ancestors. Client-only: on the server no unmount
// hook runs to release it, so a claim would leak across requests.
let activeHost: symbol | null = null
</script>

<script setup lang="ts">
import { inject, onUnmounted, provide, type InjectionKey } from 'vue'
import { dialogs as imperativeDialogs } from '../utils/dialog'

// Only one `<Dialogs />` host renders the stack. Apps that wrap their tree in
// `<FrappeUIProvider>` (which mounts `<Dialogs />` internally) *and* also
// mount `<Dialogs />` manually would otherwise see every dialog twice. A
// nested host yields to its ancestor via provide/inject; a sibling host (the
// provider's own mount sits next to the app's slot content, not above it)
// yields to whichever host mounted first via the module-level claim above.
const DIALOGS_HOST_KEY = Symbol.for(
  'frappe-ui.dialogs-host',
) as InjectionKey<boolean>
const hasParentHost = inject(DIALOGS_HOST_KEY, false)
const hostId = Symbol('dialogs-host')
const isPrimaryHost = !hasParentHost && claimHost()
provide(DIALOGS_HOST_KEY, true)

onUnmounted(() => {
  // Release so the next mounted host (a rerouted app, the next test) wins.
  if (activeHost === hostId) activeHost = null
})

function claimHost(): boolean {
  // SSR renders once and never unmounts; the inject guard above still
  // dedups nested hosts there.
  if (typeof window === 'undefined') return true
  if (activeHost === null) {
    activeHost = hostId
    return true
  }
  if (import.meta.env.DEV) {
    console.warn(
      '[frappe-ui] Multiple <Dialogs /> hosts are mounted; only the first ' +
        'renders the dialog stack. Remove the extra mount — ' +
        '<FrappeUIProvider> already includes one.',
    )
  }
  return false
}
</script>
