import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import List from './List.vue'
import ListCell from './ListCell.vue'
import ListRow from './ListRow.vue'

// Responsive columns resolve entirely in CSS, so the server-rendered markup has
// to be complete on its own: every breakpoint carries an inline custom
// property, and the media rules the Tailwind preset emits pick one of them on
// first paint. Nothing here may wait for hydration to measure a viewport.

function render(props: Record<string, unknown>) {
  return renderToString(
    createSSRApp({
      render: () =>
        h(List, props, () => [
          h(ListRow, { value: '1' }, () => [h(ListCell, () => 'A')]),
        ]),
    }),
  )
}

describe('List (SSR)', () => {
  it('writes one carrier per breakpoint into the server markup', async () => {
    const html = await render({
      columns: {
        base: ['minmax(0, 1fr)', '80px', '64px'],
        md: ['minmax(0, 1fr)', '140px', '100px'],
        lg: ['minmax(0, 2fr)', '180px', '120px'],
      },
    })
    expect(html).toContain('--_list-columns-base:minmax(0, 1fr) 80px 64px')
    expect(html).toContain('--_list-columns-md:minmax(0, 1fr) 140px 100px')
    expect(html).toContain('--_list-columns-lg:minmax(0, 2fr) 180px 120px')
  })

  it('writes only the tiers that were supplied', async () => {
    const html = await render({
      columns: { base: ['minmax(0, 1fr)'], lg: ['120px', '90px'] },
    })
    expect(html).toContain('--_list-columns-base:minmax(0, 1fr)')
    expect(html).toContain('--_list-columns-lg:120px 90px')
    // An omitted tier must stay unset, so the CSS fallback chain — not an
    // empty declaration — is what carries the tier below it upward.
    expect(html).not.toContain('--_list-columns-md')
    expect(html).not.toContain('--_list-columns-sm')
  })

  it('renders the array form as the base tier', async () => {
    const html = await render({ columns: ['50px', 'minmax(0, 1fr)'] })
    expect(html).toContain('--_list-columns-base:50px minmax(0, 1fr)')
  })

  it('writes no column carrier at all without the prop', async () => {
    const html = await render({})
    expect(html).not.toContain('--_list-columns')
  })
})
