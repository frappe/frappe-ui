import { onScopeDispose, readonly, ref } from 'vue'

// One clock for the whole calendar. Everything that renders "what time is it" —
// the red time marker, and every isToday() check — reads from this instead of
// calling new Date() inside a computed, which never re-evaluates: the marker
// only moved when something else happened to re-render, and a tab left open
// past midnight kept highlighting yesterday until it was refreshed.
//
// Module scope, reference-counted: a week view mounts one marker per day column,
// and none of them should own a separate interval.

const now = ref(new Date())

let timer: ReturnType<typeof setInterval> | undefined
let subscribers = 0

const tick = () => (now.value = new Date())

// Background tabs throttle timers heavily (and may park them altogether), so the
// interval alone can leave the clock hours behind. Re-read on the way back in.
const tickIfVisible = () => {
  if (document.visibilityState === 'visible') tick()
}

function start() {
  if (timer) return
  // Refresh before the environment check, not after: with no document there is
  // no interval to keep this current, so a server renderer would otherwise hand
  // every request the date its process happened to boot on.
  tick()
  if (typeof document === 'undefined') return
  // 30s keeps the minute-resolution marker within half a minute of the truth
  // without waking the page every second.
  timer = setInterval(tick, 30_000)
  document.addEventListener('visibilitychange', tickIfVisible)
  window.addEventListener('focus', tick)
}

function stop() {
  if (timer) clearInterval(timer)
  timer = undefined
  if (typeof document === 'undefined') return
  document.removeEventListener('visibilitychange', tickIfVisible)
  window.removeEventListener('focus', tick)
}

/** A `Date` ref that keeps up with the wall clock while the calendar is mounted. */
export function useNow() {
  subscribers += 1
  start()

  onScopeDispose(() => {
    subscribers -= 1
    if (subscribers === 0) stop()
  })

  return readonly(now)
}
