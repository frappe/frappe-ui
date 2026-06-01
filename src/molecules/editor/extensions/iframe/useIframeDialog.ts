/**
 * State machine + editor wiring for the "Insert Embed" dialog.
 *
 * Owns: open/close state, the URL input + its validation/derived display, and
 * the `iframe:open-dialog` listener on `editor.view.dom` (registered in
 * `onMounted`, removed in `onUnmounted`). This is how the `openIframeDialog`
 * command — which only dispatches the DOM event — actually opens the dialog
 * (Option A wiring: `<InsertIframe :editor="editor" />` lives in the slot).
 *
 * Fixes the legacy no-op `computed()` side-effect (it computed derived
 * dimensions but discarded them) by syncing dimensions through a `watch`.
 */
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type { Editor } from '@tiptap/core'
import { validateIframeUrl } from './iframe-allowlist'
import {
  calculateAspectRatio,
  detectPlatform,
  getOptimalDimensions,
  processEmbedUrl,
} from './iframe-embed-utils'

/** Pull an iframe `src` out of an `<iframe …>` snippet, else return the input. */
function extractSrc(input: string): string {
  const trimmed = input.trim()
  if (trimmed.startsWith('<iframe')) {
    return trimmed.match(/\ssrc=["']([^"']+)["']/)?.[1] ?? ''
  }
  return trimmed
}

function getAllowlist(editor: Editor): readonly string[] | undefined {
  return editor.extensionManager?.extensions.find(
    (extension) => extension.name === 'iframe',
  )?.options.allowlist as readonly string[] | undefined
}

function iframeStorage(
  editor: Editor,
): { openDialog?: (() => void) | null } | null {
  const storage = editor.storage as Record<string, unknown>
  return (
    (storage.iframe as { openDialog?: (() => void) | null } | undefined) ?? null
  )
}

export interface UseIframeDialog {
  showDialog: Ref<boolean>
  embedInput: Ref<string>
  urlError: Ref<string>
  width: Ref<number>
  height: Ref<number>
  isValidUrl: Ref<boolean>
  platformName: Ref<string>
  processedUrl: Ref<string>
  open: () => void
  close: () => void
  insert: () => void
  registerInputRef: (focus: () => void) => void
}

export function useIframeDialog(editor: Editor): UseIframeDialog {
  const allowlist = getAllowlist(editor)
  const showDialog = ref(false)
  const embedInput = ref('')
  const urlError = ref('')
  const width = ref(640)
  const height = ref(360)
  let focusInput: (() => void) | null = null

  const processedUrl = computed(() => {
    const src = extractSrc(embedInput.value)
    return src ? processEmbedUrl(src) : ''
  })

  const isValidUrl = computed(
    () =>
      !!processedUrl.value &&
      validateIframeUrl(processedUrl.value, { allowlist }),
  )

  const platformName = computed(() => {
    if (!isValidUrl.value) return 'Generic'
    return detectPlatform(processedUrl.value)?.name ?? 'Generic'
  })

  // Keep the inserted dimensions in step with the URL's platform. (The legacy
  // code did this in a discarded `computed()` — moved to a real watcher.)
  watch([processedUrl, isValidUrl], () => {
    if (!isValidUrl.value) {
      width.value = 640
      height.value = 360
      return
    }
    const info = calculateAspectRatio(processedUrl.value)
    const dims = getOptimalDimensions(processedUrl.value, 800)
    width.value = dims.width
    height.value = Math.round(dims.width * info.ratio)
  })

  watch(embedInput, () => {
    urlError.value =
      embedInput.value && !isValidUrl.value
        ? 'Please enter a supported URL or iframe embed code'
        : ''
  })

  function open(): void {
    embedInput.value = ''
    urlError.value = ''
    width.value = 640
    height.value = 360
    showDialog.value = true
    requestAnimationFrame(() => focusInput?.())
  }

  function close(): void {
    showDialog.value = false
  }

  function insert(): void {
    if (!isValidUrl.value) return
    const success = editor.commands.setIframe({
      src: processedUrl.value,
      width: width.value,
      height: height.value,
    })
    if (success) {
      close()
      editor.commands.focus()
    } else {
      urlError.value =
        'Failed to insert embed. Please check the URL and try again.'
    }
  }

  function registerInputRef(focus: () => void): void {
    focusInput = focus
  }

  function handleOpenEvent(event: Event): void {
    const detail = (event as CustomEvent).detail as { editor?: Editor }
    if (detail?.editor === editor) open()
  }

  onMounted(() => {
    const storage = iframeStorage(editor)
    if (storage) storage.openDialog = open
    editor.view.dom.addEventListener('iframe:open-dialog', handleOpenEvent)
  })

  onUnmounted(() => {
    const storage = iframeStorage(editor)
    if (storage?.openDialog === open) storage.openDialog = null
    editor.view?.dom?.removeEventListener('iframe:open-dialog', handleOpenEvent)
  })

  return {
    showDialog,
    embedInput,
    urlError,
    width,
    height,
    isValidUrl,
    platformName,
    processedUrl,
    open,
    close,
    insert,
    registerInputRef,
  }
}
