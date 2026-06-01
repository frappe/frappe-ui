import { onBeforeUnmount, watch, type Ref } from 'vue'

/**
 * While `active` is true, swallow file drops that land anywhere outside a scoped
 * drop target by calling `preventDefault()` on window `dragover`/`drop`.
 *
 * Without this, a stray file drop while the upload dialog is open hits the
 * document default and navigates the browser away, destroying the editor
 * session. The guard ONLY prevents the default — it never routes those files
 * anywhere, leaving the dialog body's own drop handler (see `useScopedFileDrop`)
 * as the sole real drop target. Listeners are bound only while active and
 * removed on deactivate / unmount.
 */
export function useStrayDropGuard(active: Ref<boolean>): void {
  let bound = false
  const prevent = (event: DragEvent) => event.preventDefault()

  function add() {
    if (bound) return
    window.addEventListener('dragover', prevent)
    window.addEventListener('drop', prevent)
    bound = true
  }

  function remove() {
    if (!bound) return
    window.removeEventListener('dragover', prevent)
    window.removeEventListener('drop', prevent)
    bound = false
  }

  watch(active, (isActive) => (isActive ? add() : remove()), { immediate: true })
  onBeforeUnmount(remove)
}
