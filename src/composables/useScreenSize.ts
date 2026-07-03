import { computed, onMounted, onUnmounted, reactive, type ComputedRef } from 'vue'

const hasWindow = typeof window !== 'undefined'

export interface ScreenSize {
  width: number
  height: number
}

/**
 * Reactive viewport size, updated on window resize.
 *
 * Falls back to a desktop-ish size when there's no window (SSR / non-browser
 * test env) so a `useIsMobile()` derived from it doesn't flash the mobile
 * layout before hydration.
 */
export function useScreenSize(): ScreenSize {
  const size = reactive<ScreenSize>({
    width: hasWindow ? window.innerWidth : 1024,
    height: hasWindow ? window.innerHeight : 768,
  })

  const onResize = () => {
    size.width = window.innerWidth
    size.height = window.innerHeight
  }

  onMounted(() => {
    if (hasWindow) window.addEventListener('resize', onResize)
  })
  onUnmounted(() => {
    if (hasWindow) window.removeEventListener('resize', onResize)
  })

  return size
}

/**
 * Whether the viewport is narrower than `breakpoint` (default 640px — Tailwind's
 * `sm`). Reactive; apps typically use it to choose between a desktop and a
 * mobile shell.
 */
export function useIsMobile(breakpoint = 640): ComputedRef<boolean> {
  const size = useScreenSize()
  return computed(() => size.width < breakpoint)
}
