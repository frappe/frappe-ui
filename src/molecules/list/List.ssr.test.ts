import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import List from './List.vue'
import ListCell from './ListCell.vue'
import ListHeader from './ListHeader.vue'
import ListHeaderCell from './ListHeaderCell.vue'
import ListRow from './ListRow.vue'
import ListRows from './ListRows.vue'

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

// Row identity and the header's select-all universe both come from <ListRows>.
// Both are resolved while the component sets up, so the server markup is
// complete — nothing here may wait for a client-side effect.
describe('ListRows (SSR)', () => {
  const rows = {
    default: ({ value }: { value: string }) =>
      h(ListRow, { value }, () => [h(ListCell, () => value)]),
  }

  it('derives row values on the server, coercing them to strings', async () => {
    // Numeric ids with a string `selection`: the second row is selected only if
    // the server resolved `2` to '2', the same way the client does.
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(List, { selectable: true, selection: ['2'] }, () =>
            h(ListRows, { items: [{ id: 1 }, { id: 2 }] }, rows),
          ),
      }),
    )
    const markup = html.split('data-slot="list-row"')
    expect(markup).toHaveLength(3)
    expect(markup[1]).not.toContain('data-selected')
    expect(markup[2]).toContain('data-selected="true"')
  })

  it('fills the select-all universe during setup, not after hydration', async () => {
    // A header placed after the rows is what the server can show this with:
    // <ListRows> reports the universe as it sets up, so anything rendered after
    // it carries the resolved select-all state. (A header rendered *before* the
    // rows — the usual order — has no universe to read yet on the server, and
    // resolves on the client.)
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(List, { selectable: true, selection: ['2'] }, () => [
            h(ListRows, { items: [{ id: '1' }, { id: '2' }] }, rows),
            h(ListHeader, () => h(ListHeaderCell, () => 'Name')),
          ]),
      }),
    )
    const header = html.slice(html.indexOf('data-slot="list-header-checkbox"'))
    expect(header).toContain('aria-checked="mixed"')
  })
})
