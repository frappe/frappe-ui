/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import OnThisPage from './OnThisPage.vue'

// The real vitepress `route` is a reactive object; `watch(route, ...)` in
// OnThisPage needs that to avoid an "invalid watch source" warning.
vi.mock('vitepress', () => ({
  useRoute: () => reactive({ path: '/docs/molecules/editor' }),
}))

// jsdom has no IntersectionObserver; OnThisPage only needs observe/disconnect.
class FakeIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function mount(component: any) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  createApp({ render: () => h(component) }).mount(container)
  return container
}

function addHeading(
  tag: 'h2' | 'h3',
  id: string,
  text: string,
  parent: HTMLElement = document.body,
) {
  const el = document.createElement(tag)
  el.id = id
  el.textContent = text
  parent.appendChild(el)
  return el
}

describe('OnThisPage', () => {
  const originalIO = globalThis.IntersectionObserver

  beforeEach(() => {
    globalThis.IntersectionObserver = FakeIntersectionObserver as any
  })

  afterEach(() => {
    document.body.innerHTML = ''
    globalThis.IntersectionObserver = originalIO
  })

  it('excludes headings nested under [data-demo-preview] but keeps real doc headings', async () => {
    addHeading('h2', 'rich-text-editor', 'Rich text editor')

    // RichTextKit assigns real ids to headings typed inside its own demo, so
    // presence of an id alone can't be used to tell these apart.
    const demo = document.createElement('div')
    demo.setAttribute('data-demo-preview', '')
    document.body.appendChild(demo)
    addHeading('h2', 'toc-abc-1', 'Onboarding playbook', demo)
    addHeading('h3', 'toc-abc-2', 'First-week checklist', demo)

    addHeading('h2', 'inline-editor', 'Inline editor')

    const container = mount(OnThisPage)
    await nextTick()
    const names = Array.from(container.querySelectorAll('aside a')).map(
      (a) => a.textContent,
    )

    expect(names).toEqual(['Rich text editor', 'Inline editor'])
  })

  it('renders nothing when every heading on the page lives inside a demo preview', async () => {
    const demo = document.createElement('div')
    demo.setAttribute('data-demo-preview', '')
    document.body.appendChild(demo)
    addHeading('h2', 'toc-xyz-1', 'Escalation matrix', demo)

    const container = mount(OnThisPage)
    await nextTick()
    const names = Array.from(container.querySelectorAll('aside a')).map(
      (a) => a.textContent,
    )

    expect(names).toEqual([])
    expect(container.querySelector('aside')?.className).toContain('invisible')
  })
})
