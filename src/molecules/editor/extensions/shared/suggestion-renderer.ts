import { VueRenderer } from '@tiptap/vue-3'
import type {
  SuggestionProps,
  SuggestionKeyDownProps,
} from '@tiptap/suggestion'
import type { Component } from 'vue'
import {
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
} from '@floating-ui/dom'
import type { SuggestionListExpose } from './suggestion-types'

export interface SuggestionFloatingOptions {
  placement?: Placement
  offset?: number | [number, number]
}

/**
 * The imperative Floating UI + VueRenderer lifecycle for suggestion popups,
 * extracted from `createSuggestionExtension().render()`.
 *
 * Import path: `#molecules/editor/extensions/shared/suggestion-renderer`
 */
export function createSuggestionRenderer(
  component: Component,
  floatingOptions?: SuggestionFloatingOptions,
): {
  onStart(props: SuggestionProps): void
  onUpdate(props: SuggestionProps): void
  onKeyDown(props: SuggestionKeyDownProps): boolean
  onExit(): void
} {
  let renderer: VueRenderer | null = null
  let floatingEl: HTMLElement | null = null
  let getReferenceClientRect: (() => DOMRect | null) | null = null
  // Once exited/destroyed, late async updates must not resurrect anything.
  let isActive = false
  // Monotonic token; a stale onUpdate from a superseded query bails.
  let renderToken = 0

  function getListExpose(): SuggestionListExpose | null {
    const ref = renderer?.ref as SuggestionListExpose | null | undefined
    if (ref && typeof ref.onKeyDown === 'function') return ref
    return null
  }

  function updatePosition(): void {
    if (!floatingEl || !getReferenceClientRect) return
    const rect = getReferenceClientRect()
    if (!rect) return
    const reference = { getBoundingClientRect: () => rect }
    void computePosition(reference, floatingEl, {
      placement: floatingOptions?.placement ?? 'bottom-start',
      middleware: [
        offset(normalizeOffset(floatingOptions?.offset)),
        flip(),
        shift({ padding: 8 }),
      ],
    }).then(({ x, y }) => {
      if (!floatingEl) return
      Object.assign(floatingEl.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: '100',
      })
    })
  }

  // Attach `renderer.el` (the wrapper VueRenderer always creates) rather than
  // `renderer.element` (its firstElementChild): reka's FocusScope-based popup has
  // no synchronous first child, so `element` is null and nothing would mount.
  // `.el` is an undocumented tiptap internal, so a tiptap major could break this
  // (guarded by suggestion-renderer.test.ts).
  function getWrapper(): HTMLElement | null {
    return (renderer as unknown as { el: HTMLElement | null } | null)?.el ?? null
  }

  // Attach the wrapper to the body and position it. Re-callable from a later
  // onUpdate if the initial attach couldn't complete.
  function attach(props: SuggestionProps, token: number): void {
    if (!isActive || token !== renderToken || !renderer) return
    if (floatingEl) return
    const wrapper = getWrapper()
    if (!props.clientRect || !wrapper) return

    floatingEl = wrapper
    floatingEl.style.position = 'absolute'
    document.body.appendChild(floatingEl)
    getReferenceClientRect = props.clientRect as () => DOMRect | null
    updatePosition()
  }

  return {
    onStart(props: SuggestionProps) {
      isActive = true
      const token = ++renderToken

      renderer = new VueRenderer(component, {
        editor: props.editor,
        props,
      })

      attach(props, token)
    },

    onUpdate(props: SuggestionProps) {
      if (!isActive || !renderer) return
      const token = ++renderToken

      renderer.updateProps(props)

      if (!props.clientRect) return
      if (token !== renderToken) return

      getReferenceClientRect = props.clientRect as () => DOMRect | null
      // Late-attach if the initial mount couldn't; otherwise just reposition.
      if (!floatingEl) attach(props, token)
      else updatePosition()
    },

    onKeyDown(props: SuggestionKeyDownProps): boolean {
      // Let the suggestion plugin handle Escape (it runs onExit).
      if (props.event.key === 'Escape') return false

      const list = getListExpose()
      if (list) return list.onKeyDown(props)
      return false
    },

    onExit() {
      isActive = false
      renderToken++
      floatingEl?.remove()
      renderer?.destroy()
      floatingEl = null
      renderer = null
      getReferenceClientRect = null
    },
  }
}

function normalizeOffset(value: number | [number, number] | undefined) {
  if (Array.isArray(value)) return { mainAxis: value[1], crossAxis: value[0] }
  return value ?? 4
}
