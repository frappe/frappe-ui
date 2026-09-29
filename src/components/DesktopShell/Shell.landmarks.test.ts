/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp, h } from 'vue'
import DesktopShell from './DesktopShell.vue'
import MobileShell from '../MobileShell/MobileShell.vue'

function mount(component: any, props: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  const app = createApp({
    render: () => h(component, props, { default: () => h('p', 'Page') }),
  })
  app.mount(host)
  return { host, unmount: () => app.unmount() }
}

describe('Shell landmarks', () => {
  it.each([
    ['DesktopShell', DesktopShell, {}],
    ['DesktopShell without page scroll', DesktopShell, { scroll: false }],
    ['MobileShell', MobileShell, {}],
  ])('%s puts the page in one <main>', (_name, component, props) => {
    const { host, unmount } = mount(component, props)
    const mains = host.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].textContent).toContain('Page')
    unmount()
  })
})
