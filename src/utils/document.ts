import { ref } from 'vue'

// Share one observer because every caller watches the same page attributes.
const documentVersion = ref(0)
let observer: MutationObserver | undefined

/** Read inside a computed to follow changes to page direction, language or theme. */
export function documentAttributes(): number {
  if (typeof document === 'undefined') return 0
  if (!observer && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(() => documentVersion.value++)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir', 'lang', 'data-theme', 'class'],
    })
  }
  return documentVersion.value
}

export function documentDir(): 'ltr' | 'rtl' {
  documentAttributes()
  if (typeof document === 'undefined') return 'ltr'
  return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
}

/** Popup sides that follow the reading direction. */
export type InlineSide = 'inline-start' | 'inline-end'

/** The physical side to hand Reka: `inline-start` is the left in LTR and the right in RTL. */
export function physicalSide<Side extends string>(
  side: Side | InlineSide,
): Side | 'left' | 'right' {
  if (side === 'inline-start') return documentDir() === 'rtl' ? 'right' : 'left'
  if (side === 'inline-end') return documentDir() === 'rtl' ? 'left' : 'right'
  return side
}
