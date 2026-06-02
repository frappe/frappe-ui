import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'
import type { Editor } from '@tiptap/core'
import {
  collectHeadings,
  getActiveTabId,
  getActiveTabRange,
  type HeadingInfo,
} from '#molecules/editor/extensions/shared/heading-scope'
import {
  foldHeadings,
  type HeadingTreeNode,
} from '#molecules/editor/extensions/shared/heading-tree-utils'

export type TocAnchorTree = HeadingTreeNode<HeadingInfo>[]

/**
 * Live heading anchors for the table-of-contents node view.
 *
 * Replaces the legacy `setInterval(updateAnchors, 300)` polling + `{ deep: true }`
 * doc watch. Refreshes are driven by editor lifecycle events plus a SHALLOW doc
 * identity watch (ProseMirror swaps the doc object on every change, so identity
 * is enough — no deep traversal). Active-tab scoping goes through
 * `getActiveTabId` so the host `getCurrentTab` is reached for in exactly one
 * place (`heading-scope.ts`).
 */
export function useTocAnchors(editor: Editor): {
  anchors: Ref<HeadingInfo[]>
  anchorTree: ComputedRef<TocAnchorTree>
  refresh: () => void
} {
  const anchors = ref<HeadingInfo[]>([])

  const anchorTree = computed<TocAnchorTree>(() =>
    foldHeadings<HeadingInfo>(
      anchors.value,
      (item) => item as HeadingInfo,
    ),
  )

  const refresh = () => {
    if (editor.isDestroyed) return
    anchors.value = collectHeadings(editor, getActiveTabRange(editor))
  }

  // Shallow identity watch: ProseMirror replaces `state.doc` on each change.
  const stopDocWatch = watch(
    () => editor.state?.doc,
    refresh,
  )

  // Active-tab changes don't necessarily mutate the doc, so watch the id too.
  const stopTabWatch = watch(
    () => getActiveTabId(editor),
    refresh,
  )

  onMounted(() => {
    refresh()
    editor.on('update', refresh)
    editor.on('selectionUpdate', refresh)
    editor.on('create', refresh)
    editor.on('focus', refresh)
  })

  onBeforeUnmount(() => {
    stopDocWatch()
    stopTabWatch()
    editor.off('update', refresh)
    editor.off('selectionUpdate', refresh)
    editor.off('create', refresh)
    editor.off('focus', refresh)
  })

  return { anchors, anchorTree, refresh }
}
