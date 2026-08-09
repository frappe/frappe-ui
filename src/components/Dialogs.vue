<template>
  <div>
    <!-- v1 imperative `dialog.*` stack. -->
    <template v-if="isMounted && isPrimaryHost">
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

// Warn once per session, like `warnDeprecated` — a route swap can hold two
// hosts for a tick on every navigation, and that mount is one the app needs.
let warnedExtraHost = false
function warnExtraHost() {
  if (!import.meta.env.DEV || warnedExtraHost) return
  warnedExtraHost = true
  console.warn(
    '[frappe-ui] Multiple <Dialogs /> hosts are mounted; only one ' +
      'renders the dialog stack. Remove the extra mount — ' +
      '<FrappeUIProvider> already includes one.',
  )
}
</script>

<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  type InjectionKey,
} from 'vue'
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

if (typeof window !== 'undefined' && !hasParentHost) {
  hosts.value = [...hosts.value, hostId]
  if (hosts.value.length > 1) warnExtraHost()
}

// The stack is empty until after mount, so gating on `isMounted` keeps
// server and client hydration markup identical — both sides render the
// false branch — even though the claim list is client-only. The wrapper
// <div> renders unconditionally for the same reason.
const isMounted = ref(false)
onMounted(() => (isMounted.value = true))
const isPrimaryHost = computed(() => hosts.value[0] === hostId)

onUnmounted(() => {
  // Hand the claim to the next registered host (the provider's own mount,
  // the next test) so the stack keeps rendering.
  hosts.value = hosts.value.filter((id) => id !== hostId)
})
</script>
