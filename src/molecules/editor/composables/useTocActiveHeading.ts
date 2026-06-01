import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'
import type { Editor } from '@tiptap/core'
import type { HeadingInfo } from '@molecules/editor/extensions/shared/heading-scope'

const ACTIVE_TOP_THRESHOLD = -50
const ACTIVE_BOTTOM_THRESHOLD = 100

export interface EnrichedAnchor extends HeadingInfo {
  isActive: boolean
  isScrolledOver: boolean
}

/**
 * Enrich anchors with `isActive` / `isScrolledOver` based on each heading's
 * position relative to the scroll container's current scroll offset.
 *
 * Recomputes on a PASSIVE `scroll` listener (no polling) and whenever the
 * anchors or container change. The listener is removed on unmount and whenever
 * the container ref changes (the watch cleanup detaches the previous one).
 */
export function useTocActiveHeading(
  editor: Editor,
  anchors: Ref<HeadingInfo[]>,
  container: Ref<HTMLElement | null>,
): { enrichedAnchors: ComputedRef<EnrichedAnchor[]> } {
  // A monotonically-bumped tick that invalidates the computed on scroll.
  const scrollTick = ref(0)

  const enrichedAnchors = computed<EnrichedAnchor[]>(() => {
    // Touch the tick so scroll events re-run this computed.
    void scrollTick.value

    const scrollParent = container.value
    const editorDom = editor.isDestroyed ? null : editor.view?.dom

    if (!scrollParent || !editorDom) {
      return anchors.value.map((a) => ({
        ...a,
        isActive: false,
        isScrolledOver: false,
      }))
    }

    const scrollTop = scrollParent.scrollTop
    const parentTop = scrollParent.getBoundingClientRect().top

    return anchors.value.map((anchor) => {
      const el = anchor.id
        ? editorDom.querySelector(`[data-toc-id="${cssAttrValue(anchor.id)}"]`)
        : null
      if (!el) {
        return { ...anchor, isActive: false, isScrolledOver: false }
      }
      const relativeTop =
        el.getBoundingClientRect().top - parentTop + scrollTop
      const isActive =
        relativeTop >= scrollTop + ACTIVE_TOP_THRESHOLD &&
        relativeTop <= scrollTop + ACTIVE_BOTTOM_THRESHOLD
      const isScrolledOver = relativeTop < scrollTop + ACTIVE_TOP_THRESHOLD
      return { ...anchor, isActive, isScrolledOver }
    })
  })

  const onScroll = () => {
    scrollTick.value += 1
  }

  const stopContainerWatch = watch(
    container,
    (el, _prev, onCleanup) => {
      if (!el) return
      el.addEventListener('scroll', onScroll, { passive: true })
      scrollTick.value += 1
      onCleanup(() => el.removeEventListener('scroll', onScroll))
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    stopContainerWatch()
  })

  return { enrichedAnchors }
}

/** Escape a value for use inside an attribute selector string. */
function cssAttrValue(value: string): string {
  return value.replace(/["\\]/g, '\\$&')
}
