// The colours a chart is drawn in, read off the page rather than written
// into any chart: the Frappe Charts file's variables (chart-tokens.css)
// and frappe-ui's own ink, outline and surface tokens. ECharts takes a
// colour string, so a custom property is resolved to the value the page
// holds for it right now, and read again when the page changes mode —
// the one moment the same property means another colour.
import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useColorScheme } from '../../src'
import './chart-tokens.css'

/** `--name` resolved against the document root, trimmed; '' if unset */
export function readToken(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

/**
 * A colour string a canvas can parse, from any CSS colour the page uses
 * (frappe-ui's tokens are oklch, which zrender cannot lift or fade): the
 * browser normalises it through a canvas fill.
 */
let probe: CanvasRenderingContext2D | null | undefined
export function toHex(color: string): string {
  if (!color) return color
  if (/^#|^rgb/.test(color)) return color
  if (probe === undefined) {
    probe =
      typeof document === 'undefined'
        ? null
        : document.createElement('canvas').getContext('2d')
  }
  if (!probe) return color
  probe.fillStyle = '#000'
  probe.fillStyle = color
  return probe.fillStyle
}

/** a frappe-ui token (`ink-gray-5`) or a chart variable, as a colour */
export function token(name: string): string {
  return toHex(readToken(name.startsWith('--') ? name : `--${name}`))
}

/**
 * The tokens as reactive state: a counter that moves whenever the page's
 * mode changes, so a computed that reads tokens through `t()` re-reads
 * them in the new mode.
 */
export function useChartTokens(): {
  /** bumps when the colours on the page change */
  version: Ref<number>
  /** a token's colour, as of the current version */
  t: (name: string) => string
} {
  const { resolvedColorScheme } = useColorScheme()
  const version = ref(0)
  const bump = () => {
    version.value += 1
  }
  // the attribute flips before the stylesheet's new values are readable
  // in the same tick, so the read is deferred a frame
  watch(resolvedColorScheme, () => requestAnimationFrame(bump))
  let observer: MutationObserver | null = null
  onMounted(() => {
    observer = new MutationObserver(() => requestAnimationFrame(bump))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  })
  onBeforeUnmount(() => observer?.disconnect())
  const t = (name: string) => {
    void version.value
    return token(name)
  }
  return { version, t }
}

/** the page's mode right now, for the few options that take a flag */
export function useIsDark(): Ref<boolean> {
  const { resolvedColorScheme } = useColorScheme()
  return computed(() => resolvedColorScheme.value === 'dark')
}
