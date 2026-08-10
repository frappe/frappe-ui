import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watchEffect,
  type Ref,
  type ShallowRef,
} from 'vue'
import { init, use, setPlatformAPI } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import type { ECharts, EChartsCoreOption } from 'echarts/core'
import debounce from '#utils/debounce'
import { installTextMeasurer } from '../measureText'
import { prefersReducedMotion } from '../utils'

// SVG only: it keeps text selectable and crisp at any DPI, and the canvas
// renderer is a large slice of echarts we would pay for on every page.
use([SVGRenderer])

/**
 * Registers echarts modules. Every chart component calls this at module scope
 * with just the pieces it draws, which is what keeps the unused half of echarts
 * out of an app's bundle.
 */
export const registerChartModules = use

export type ChartEventHandlers = Record<string, (params: any) => void>

export type UseChartArgs = {
  container: Ref<HTMLElement | undefined>
  /** Getter, not a value: its reactive dependencies drive `setOption`. */
  option: () => EChartsCoreOption | undefined
  /**
   * Bound once, when the chart initialises. Unlike `option`, this is not a
   * getter: a handler map swapped later is never read. Keep the handlers
   * stable and let them close over reactive state.
   */
  events?: ChartEventHandlers
  /**
   * Fires for clicks anywhere inside the chart, datapoint or not. Bound once,
   * like `events`.
   */
  onZrEvents?: ChartEventHandlers
}

export type UseChartReturn = {
  chart: ShallowRef<ECharts | undefined>
  dispatch: (payload: Record<string, any>) => void
  resize: () => void
  /** Measured plot width, 0 until the container has one. Follows resizes. */
  width: Ref<number>
}

const RESIZE_DEBOUNCE_MS = 100
/** Long enough to read as the plot moving, short enough not to hold a drag up. */
const RESIZE_ANIMATION_MS = 200

/**
 * Label widths are measured once and kept for the life of the page — by
 * zrender's own LRU, and by the DOM measurer behind it. A width measured
 * before the webfont arrives is therefore measured against the fallback font
 * and never measured again — no `resize()` and no fresh `setOption` can
 * correct it, which is how the widest axis labels end up clipped. The one
 * measurement a chart gets has to happen after the fonts settle, so that is
 * when it is built. The timeout is the guard: a font request that never
 * resolves must not keep the chart off the page.
 */
const FONT_SETTLE_TIMEOUT_MS = 2000

let fontsSettled = typeof document === 'undefined' || !document.fonts?.ready
let settling: Promise<void> | undefined

function whenFontsSettled(): Promise<void> {
  if (fontsSettled) return Promise.resolve()
  settling ||= Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, FONT_SETTLE_TIMEOUT_MS)),
  ]).then(() => {
    fontsSettled = true
  })
  return settling
}

export function useChart({
  container,
  option,
  events,
  onZrEvents,
}: UseChartArgs): UseChartReturn {
  const chart = shallowRef<ECharts>()
  let unmounted = false

  // `chart` is a shallowRef, so this re-runs once the instance exists and then
  // on every reactive change inside the option getter. Nothing is built before
  // then: an option may be built from what this composable measures (`width`),
  // and calling the getter during this call would read it before it is bound.
  watchEffect(() => {
    const instance = chart.value
    if (!instance) return
    const nextOption = option()
    if (!nextOption) return
    instance.setOption(nextOption, { notMerge: true, lazyUpdate: true })
  })

  const width = ref(0)

  // Sizes decided in pixels — the cap on a horizontal chart's label column —
  // are built into the option, so a resize has to re-run the builder as well as
  // re-lay the plot. Publishing the width here is what makes it re-run.
  const resize = () => {
    width.value = container.value?.clientWidth ?? 0
    // The plot slides to its new size, unless the reader has asked for less
    // movement — a whole chart re-laying itself is a large piece of motion.
    chart.value?.resize({
      animation: { duration: prefersReducedMotion() ? 0 : RESIZE_ANIMATION_MS },
    })
  }
  const debouncedResize = debounce(resize, RESIZE_DEBOUNCE_MS)
  let resizeObserver: ResizeObserver | undefined

  /**
   * Held back until the container has a size. Initialising at 0×0 — a chart in a
   * collapsed panel, an inactive tab, a dialog that hasn't opened — makes echarts
   * lay the plot out at its 100×100 fallback, and the later resize animates the
   * whole plot up from that corner. Held back until the fonts settle too — see
   * FONT_SETTLE_TIMEOUT_MS for why that measurement only happens once.
   */
  function initChart() {
    const el = container.value
    if (unmounted || chart.value || !el || !el.clientWidth || !el.clientHeight)
      return
    if (!fontsSettled) {
      whenFontsSettled().then(initChart)
      return
    }

    // Before `init`, which measures as soon as it has an option.
    installTextMeasurer(setPlatformAPI)

    const instance = init(el, undefined, { renderer: 'svg' })
    chart.value = instance
    width.value = el.clientWidth

    for (const [name, handler] of Object.entries(events ?? {})) {
      instance.on(name, handler)
    }
    for (const [name, handler] of Object.entries(onZrEvents ?? {})) {
      instance.getZr().on(name, handler)
    }
  }

  onMounted(() => {
    const el = container.value
    if (!el) return

    initChart()

    resizeObserver = new ResizeObserver(() => {
      if (chart.value) debouncedResize()
      else initChart()
    })
    resizeObserver.observe(el)
  })

  onBeforeUnmount(() => {
    unmounted = true
    debouncedResize.cancel()
    resizeObserver?.disconnect()
    resizeObserver = undefined
    chart.value?.dispose()
    chart.value = undefined
  })

  const dispatch = (payload: Record<string, any>) =>
    chart.value?.dispatchAction(payload as any)

  return { chart, dispatch, resize, width }
}
