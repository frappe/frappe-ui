export default function debounce(
  func: (...args: any[]) => any,
  wait: number,
  immediate?: boolean,
) {
  var timeout: number | undefined
  return function (this: unknown, ...args: any[]) {
    var context = this,
      later = function () {
        timeout = undefined
        if (!immediate) func.apply(context, args)
      }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
