/**
 * State machine for the "Insert Embed" dialog.
 *
 * Pure editor-agnostic state: the URL input, its validation + derived display
 * (platform name, processed src), the embed dimensions, and `insert()`. It does
 * NOT own visibility or any lifecycle wiring — the dialog component controls its
 * own open state, and `iframeInsertDialogController` mounts it. (The old version
 * registered an `iframe:open-dialog` DOM listener + `editor.storage.iframe.openDialog`
 * so a slot-mounted `<InsertIframe>` could be reached by a command; that inverted
 * coupling is gone — `openIframeDialog` now mounts this dialog directly.)
 */
import { computed, ref, watch, type Ref } from 'vue'
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

export interface UseIframeDialogArgs {
  /**
   * Edit mode: resolve the position of the iframe node being edited. The
   * dialog then swaps that node's src in place (via `updateIframeAt`) instead
   * of inserting. Resolved at submit time so doc changes can't stale the pos.
   */
  getReplacePos?: () => number | undefined
  /** Prefill for edit mode (the node's current src). */
  initialUrl?: string
}

export interface UseIframeDialog {
  embedInput: Ref<string>
  urlError: Ref<string>
  width: Ref<number>
  height: Ref<number>
  isValidUrl: Ref<boolean>
  platformName: Ref<string>
  processedUrl: Ref<string>
  reset: () => void
  /** Insert the embed. Returns `true` on success (caller closes the dialog). */
  insert: () => boolean
}

export function useIframeDialog(
  editor: Editor,
  args: UseIframeDialogArgs = {},
): UseIframeDialog {
  const allowlist = getAllowlist(editor)
  const embedInput = ref(args.initialUrl ?? '')
  const urlError = ref('')
  const width = ref(640)
  const height = ref(360)

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

  // Keep the inserted dimensions in step with the URL's platform.
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

  function reset(): void {
    embedInput.value = ''
    urlError.value = ''
    width.value = 640
    height.value = 360
  }

  function insert(): boolean {
    if (!isValidUrl.value) return false
    const replacePos = args.getReplacePos?.()
    const success =
      replacePos != null
        ? editor.commands.updateIframeAt(replacePos, processedUrl.value)
        : editor.commands.setIframe({
            src: processedUrl.value,
            width: width.value,
            height: height.value,
          })
    if (success) {
      editor.commands.focus()
    } else {
      urlError.value =
        'Failed to insert embed. Please check the URL and try again.'
    }
    return success
  }

  return {
    embedInput,
    urlError,
    width,
    height,
    isValidUrl,
    platformName,
    processedUrl,
    reset,
    insert,
  }
}
