import type { RouteLocationRaw, Router } from 'vue-router'

/**
 * How long to wait for `router.back()` to resolve before assuming it went nowhere.
 * A pop that is rejected by a guard never reaches `afterEach`, so the timer is what
 * releases the fallback in that case.
 */
const BACK_SETTLE_TIMEOUT_MS = 700

/**
 * Whether going back keeps the user inside this app.
 *
 * Vue Router writes the previous in-app location into `history.state.back` on every
 * push, and leaves it `null` on the first entry it creates. So `back == null` means
 * the app was entered here: a cold load onto a deep link, or an arrival from another
 * site. Going back from there leaves the app, which is never what a header back
 * button should do.
 *
 * `router.replace()` copies `back` over untouched, so a page that rewrites its own
 * URL — canonicalising params, attaching a newly created draft id — still reports the
 * entry the user actually arrived from rather than its own earlier URL.
 */
export function hasAppHistory(router: Router): boolean {
  const state = router.options.history.state as
    | { back?: unknown }
    | undefined
    | null

  if (state?.back == null) return false

  // A previous entry identical to the current one would pop without appearing to
  // move. Treat it as no history at all.
  return state.back !== router.currentRoute.value.fullPath
}

/** Resolves once the next navigation finishes, or once the wait times out. */
function whenNavigationSettles(router: Router): Promise<void> {
  return new Promise((resolve) => {
    let stopAfterEach: (() => void) | undefined

    const timer = setTimeout(() => {
      stopAfterEach?.()
      resolve()
    }, BACK_SETTLE_TIMEOUT_MS)

    stopAfterEach = router.afterEach(() => {
      clearTimeout(timer)
      stopAfterEach?.()
      resolve()
    })
  })
}

/**
 * Go back the way the browser's back button would, and fall back to `to` when that
 * is not possible.
 *
 * A back button that always navigates to a fixed destination is not a back button:
 * it drops the user wherever the page author guessed they came from, which is wrong
 * for every other entry path into that page. So history wins, and `to` is only the
 * recovery route for when there is no history to walk.
 *
 * The post-navigation check covers entries that bounce: a guard that rejects the pop,
 * or a previous entry that redirects straight back to where we already are. Without
 * it the button would silently do nothing on those pages.
 */
export async function navigateBack(
  router: Router,
  to?: RouteLocationRaw,
): Promise<void> {
  if (!to) {
    router.back()
    return
  }

  if (!hasAppHistory(router)) {
    await router.push(to)
    return
  }

  const origin = router.currentRoute.value.fullPath
  const settled = whenNavigationSettles(router)
  router.back()
  await settled

  if (router.currentRoute.value.fullPath === origin) {
    await router.push(to)
  }
}
