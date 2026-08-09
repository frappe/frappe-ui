<template>
  <div>
    <!-- v1 imperative `dialog.*` stack. -->
    <template v-if="isPrimaryHost">
      <component v-for="d in imperativeDialogs" :is="d.component" :key="d.id" />
    </template>
  </div>
</template>

<script lang="ts">
import { shallowRef } from 'vue'

// Every claiming `<Dialogs />` registers here; the first entry renders the
// stack. Module-level so sibling hosts dedup too — inject only sees
// ancestors. Reactive so the claim hands over when the current winner
// unmounts (a rerouted layout, a `v-if`) instead of leaving no renderer.
// Client-only: on the server no unmount hook runs to release an entry, so
// it would leak across requests.
const hosts = shallowRef<symbol[]>([])
</script>

<script setup lang="ts">
import { computed, inject, onUnmounted, provide, type InjectionKey } from 'vue'
import { dialogs as imperativeDialogs } from '../utils/dialog'

// Only one `<Dialogs />` host renders the stack. Apps that wrap their tree in
// `<FrappeUIProvider>` (which mounts `<Dialogs />` internally) *and* also
// mount `<Dialogs />` manually would otherwise see every dialog twice. A
// nested host yields to its ancestor via provide/inject; a sibling host (the
// provider's own mount sits next to the app's slot content, not above it)
// yields via the module-level claim list above.
const DIALOGS_HOST_KEY = Symbol.for(
  'frappe-ui.dialogs-host',
) as InjectionKey<boolean>
const hasParentHost = inject(DIALOGS_HOST_KEY, false)
provide(DIALOGS_HOST_KEY, true)

const hostId = Symbol('dialogs-host')
const isClient = typeof window !== 'undefined'

if (!hasParentHost && isClient) {
  hosts.value = [...hosts.value, hostId]
  if (hosts.value.length > 1 && import.meta.env.DEV) {
    console.warn(
      '[frappe-ui] Multiple <Dialogs /> hosts are mounted; only the first ' +
        'renders the dialog stack. Remove the extra mount — ' +
        '<FrappeUIProvider> already includes one.',
    )
  }
}

// The wrapper <div> above renders unconditionally so server and client
// markup match (during SSR the stack is empty, so every host emits the same
// empty <div>). On the server the claim list stays empty; the inject guard
// still dedups nested hosts there.
const isPrimaryHost = computed(() =>
  isClient ? hosts.value[0] === hostId : !hasParentHost,
)

onUnmounted(() => {
  // Hand the claim to the next registered host (the provider's own mount,
  // the next test) so the stack keeps rendering.
  hosts.value = hosts.value.filter((id) => id !== hostId)
})
</script>
