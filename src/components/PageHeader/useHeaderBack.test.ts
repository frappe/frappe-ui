// @vitest-environment jsdom
/**
 * `navigateBack` decides between real history and the declared fallback. The cases
 * below are the ones that made hardcoded back buttons wrong: arriving at a page from
 * more than one place, and a page that rewrites its own URL after it loads.
 */
import { describe, expect, it, beforeEach } from 'vitest'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { hasAppHistory, navigateBack } from './useHeaderBack'

const Blank = { render: () => null }

function createTestRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: Blank },
      { path: '/space/:id', name: 'Space', component: Blank },
      { path: '/space/:id/all', name: 'AllDiscussions', component: Blank },
      { path: '/drafts', name: 'Drafts', component: Blank },
      { path: '/new', name: 'NewDiscussion', component: Blank },
    ],
  })
}

async function start(router: Router, path: string) {
  window.history.replaceState(null, '', path)
  await router.replace(path)
  await router.isReady()
}

describe('hasAppHistory', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('is false on the entry the app was loaded on', async () => {
    const router = createTestRouter()
    await start(router, '/new')
    expect(hasAppHistory(router)).toBe(false)
  })

  it('is true once the app has navigated', async () => {
    const router = createTestRouter()
    await start(router, '/space/design')
    await router.push('/new')
    expect(hasAppHistory(router)).toBe(true)
  })

  it('survives a page rewriting its own URL with replace', async () => {
    const router = createTestRouter()
    await start(router, '/space/design')
    await router.push('/new')
    // The composer attaching the draft id it just created.
    await router.replace('/new?draft=abc')
    expect(hasAppHistory(router)).toBe(true)
  })
})

describe('navigateBack', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('uses the fallback when there is nothing to go back to', async () => {
    const router = createTestRouter()
    await start(router, '/new')

    await navigateBack(router, { name: 'Drafts' })

    expect(router.currentRoute.value.name).toBe('Drafts')
  })

  it('goes back to where the user came from, not to the fallback', async () => {
    const router = createTestRouter()
    await start(router, '/space/design')
    await router.push('/new')

    await navigateBack(router, { name: 'Drafts' })

    expect(router.currentRoute.value.fullPath).toBe('/space/design')
  })

  it('still goes back after the page has rewritten its own URL', async () => {
    const router = createTestRouter()
    await start(router, '/space/design')
    await router.push('/new')
    await router.replace('/new?draft=abc')

    await navigateBack(router, { name: 'Drafts' })

    expect(router.currentRoute.value.fullPath).toBe('/space/design')
  })

  it('honours the real entry point when the same page was reached elsewhere', async () => {
    const router = createTestRouter()
    await start(router, '/')
    await router.push('/space/design/all')
    await router.push('/new')

    await navigateBack(router, { name: 'Drafts' })

    expect(router.currentRoute.value.fullPath).toBe('/space/design/all')
  })
})
