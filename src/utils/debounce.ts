export default function debounce(
  func: Function,
  wait: number,
  immediate?: boolean
) {
  var timeout: number | undefined
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = undefined
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
