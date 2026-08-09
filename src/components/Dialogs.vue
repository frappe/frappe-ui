<template>
  <div v-if="isPrimaryHost">
    <!-- v1 imperative `dialog.*` stack. -->
    <component v-for="d in imperativeDialogs" :is="d.component" :key="d.id" />
  </div>
</template>

<script lang="ts">
import { shallowRef } from 'vue'

// Every claiming `<Dialogs />` registers here on mount; the first entry
// renders the stack. Module-level so sibling hosts dedup too — inject only
// sees ancestors. Reactive so the claim hands over when the current winner
// unmounts (a rerouted layout, a `v-if`) instead of leaving no renderer.
// Mount-time only, so it never runs on the server and cannot leak across
// requests.
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
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  provide,
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

// Claim on mount, not in setup — a host whose setup runs but never mounts
// (a discarded Suspense branch, a sibling render error) must not hold the
// claim forever. Mounted hooks fire in tree order, so the slot content's
// host still beats the provider's own mount, same winner as before.
function claim() {
  if (hasParentHost) {
    // Nested extras yield via inject and never register, but they are
    // still removable mounts — warn for them like for a losing sibling.
    warnExtraHost()
    return
  }
  if (!hosts.value.includes(hostId)) hosts.value = [...hosts.value, hostId]
  if (hosts.value.length > 1) warnExtraHost()
}

function release() {
  // Hand the claim to the next registered host (the provider's own mount,
  // the next test) so the stack keeps rendering.
  hosts.value = hosts.value.filter((id) => id !== hostId)
}

onMounted(claim)
onUnmounted(release)
// Inside <KeepAlive> a deactivated host never unmounts — it renders into a
// detached container while still holding the claim. Treat deactivation
// like unmount and reactivation like mount. `claim` is idempotent because
// onActivated also fires right after the initial mount.
onActivated(claim)
onDeactivated(release)

// False during SSR and hydration — the claim list only fills on mount —
// so server and client render the same placeholder and the winner appears
// after mount. Losing hosts render nothing, not even an empty <div>.
const isPrimaryHost = computed(() => hosts.value[0] === hostId)
</script>
