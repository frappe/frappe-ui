export interface DebouncedFunction {
  (...args: any[]): void

  /**
   * Drops a pending call. Components that debounce a network request should
   * call this when they unmount — otherwise the trailing call fires against a
   * gone component, wasting a request and rejecting into nothing.
   */
  cancel: () => void
}

export default function debounce(
  func: (...args: any[]) => any,
  wait: number,
  immediate?: boolean,
): DebouncedFunction {
  let timeout: number | undefined

  const debounced = function (this: unknown, ...args: any[]) {
    const context = this
    const later = function () {
      timeout = undefined
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  } as DebouncedFunction

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
  }

  return debounced
}
