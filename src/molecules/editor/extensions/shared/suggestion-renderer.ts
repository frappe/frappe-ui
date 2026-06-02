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
 * The imperative Floating UI + VueRenderer lifecycle extracted from
 * `createSuggestionExtension().render()`.
 *
 * Canonical import path:
 *   `#molecules/editor/extensions/shared/suggestion-renderer`
 *
 * Owns four correctness fixes over the original inline implementation:
 *   1. Escape -> `return false` so the suggestion plugin itself runs `onExit`
 *      (the old code called `popup.hide()` + `return true`, which swallowed the
 *      key and left the plugin state active).
 *   2. Per-query stale-result token: a render token captured in `onStart`/each
 *      `onUpdate` so a late prop update from a superseded query cannot clobber a
 *      newer one.
 *   3. `onUpdate` no-ops after `onExit`/destroy (guards against a queued async
 *      update arriving after teardown).
 *   4. `component.ref` typed via `SuggestionListExpose` instead of `any`.
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
  // Fix 3: once exited/destroyed, late async updates must not resurrect anything.
  let isActive = false
  // Fix 2: monotonic token; a stale onUpdate (from a superseded query) bails.
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

  return {
    onStart(props: SuggestionProps) {
      isActive = true
      const token = ++renderToken

      renderer = new VueRenderer(component, {
        editor: props.editor,
        props,
      })

      if (!props.clientRect || !renderer.element) return
      // A newer query already superseded this start before mount completed.
      if (token !== renderToken || !isActive) return

      floatingEl = renderer.element as HTMLElement
      floatingEl.style.position = 'absolute'
      document.body.appendChild(floatingEl)
      getReferenceClientRect = props.clientRect as () => DOMRect | null
      updatePosition()
    },

    onUpdate(props: SuggestionProps) {
      // Fix 3: ignore updates that arrive after onExit/destroy.
      if (!isActive || !renderer) return
      const token = ++renderToken

      renderer.updateProps(props)

      if (!props.clientRect) return
      // Fix 2: a newer query bumped the token between updateProps and now.
      if (token !== renderToken) return

      getReferenceClientRect = props.clientRect as () => DOMRect | null
      updatePosition()
    },

    onKeyDown(props: SuggestionKeyDownProps): boolean {
      // Fix 1: let the suggestion plugin handle Escape (it runs onExit).
      if (props.event.key === 'Escape') return false

      const list = getListExpose()
      if (list) return list.onKeyDown(props)
      return false
    },

    onExit() {
      isActive = false
      // Invalidate any in-flight render/update tokens.
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
