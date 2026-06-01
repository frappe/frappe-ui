import { type App, type Component, createApp, h } from 'vue'
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
  type Strategy,
} from '@floating-ui/dom'

export interface VirtualReference {
  getBoundingClientRect: () => DOMRect
}

export interface FloatingPopupOptions<P extends Record<string, unknown>> {
  anchor: HTMLElement
  component: Component
  props: P
  virtualReference?: VirtualReference
  closeOnAnchorPointerDown?: boolean
  floatingOptions?: {
    placement?: Placement
    strategy?: Strategy
    offset?: number | [number, number]
  }
}

export interface FloatingPopupHandle {
  floating: HTMLElement | null
  update: () => void
  destroy: () => void
}

export function useFloatingPopup<P extends Record<string, unknown>>(
  options: FloatingPopupOptions<P>,
): FloatingPopupHandle {
  const { anchor, component, props, virtualReference } = options
  const floatingOptions = options.floatingOptions ?? {}
  const reference = virtualReference ?? anchor
  const appendTo = anchor.closest('[role="dialog"]') || document.body

  const floating = document.createElement('div')
  floating.style.position = floatingOptions.strategy ?? 'absolute'
  floating.style.left = '0'
  floating.style.top = '0'
  floating.style.zIndex = '100'
  appendTo.appendChild(floating)

  let app: App | null = createApp({
    render() {
      return h(component, props)
    },
  })
  app.mount(floating)

  let cleanupAutoUpdate: (() => void) | null = null
  let destroyed = false

  const update = () => {
    if (destroyed) return
    void computePosition(reference, floating, {
      placement: floatingOptions.placement ?? 'top',
      strategy: floatingOptions.strategy ?? 'absolute',
      middleware: [
        offset(normalizeOffset(floatingOptions.offset)),
        flip(),
        shift({ padding: 8 }),
      ],
    }).then(({ x, y, strategy }) => {
      if (destroyed) return
      Object.assign(floating.style, {
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
      })
    })
  }

  const handle: FloatingPopupHandle = {
    floating,
    update,
    destroy() {
      if (destroyed) return
      destroyed = true
      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeydown, true)
      app?.unmount()
      floating.remove()
      app = null
      handle.floating = null
    },
  }

  function onPointerDown(event: PointerEvent) {
    const target = event.target as Node | null
    if (!target) return
    if (floating.contains(target)) return
    if (!options.closeOnAnchorPointerDown && anchor.contains(target)) return
    handle.destroy()
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') handle.destroy()
  }

  cleanupAutoUpdate = autoUpdate(reference, floating, update)
  requestAnimationFrame(() => {
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeydown, true)
  })
  update()

  return handle
}

function normalizeOffset(value: number | [number, number] | undefined) {
  if (Array.isArray(value)) return { mainAxis: value[1], crossAxis: value[0] }
  return value ?? 4
}
