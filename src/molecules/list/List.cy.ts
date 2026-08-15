import { h, ref } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  RouterView,
  type Router,
} from 'vue-router'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListHeaderCellSort,
  ListRow,
  ListRows,
} from './index'

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { render: () => null } },
      { path: '/item/:id', name: 'Item', component: { render: () => null } },
    ],
  })
}

function feedRow(id: string, props: Record<string, unknown> = {}) {
  return h(ListRow, { key: id, value: id, ...props }, () => [
    h(ListCell, () => h('span', `Leading ${id}`)),
    h(ListCell, () => h('span', `Content ${id}`)),
    h(ListCell, { class: 'justify-end' }, () => h('span', `Trailing ${id}`)),
  ])
}

describe('List (feed mode)', () => {
  it('renders list semantics and the default grid template', () => {
    cy.mount({
      render: () => h(List, () => [feedRow('1'), feedRow('2'), feedRow('3')]),
    })
    cy.get('[data-slot=list]').should('have.attr', 'role', 'list')
    cy.get('[data-slot=list-row]')
      .should('have.length', 3)
      .each(($row) => {
        expect($row).to.have.attr('role', 'listitem')
        expect(
          getComputedStyle($row[0]).gridTemplateColumns.split(' '),
        ).to.have.length(3)
      })
    // Static rows (no link, no click, not selectable) are not interactive.
    cy.get('[data-slot=list-row][data-interactive]').should('not.exist')
  })

  it('shows dividers between rows only, inset to the content column', () => {
    cy.mount({
      render: () => h(List, () => [feedRow('1'), feedRow('2'), feedRow('3')]),
    })
    cy.get('[data-slot=list-divider]').should('have.length', 3)
    cy.get('[data-slot=list-divider]').eq(0).should('have.css', 'opacity', '0')
    cy.get('[data-slot=list-divider]').eq(1).should('have.css', 'opacity', '1')
    cy.get('[data-slot=list-divider]').eq(2).should('have.css', 'opacity', '1')
    cy.get('[data-slot=list-divider]')
      .eq(1)
      .should(($el) => {
        expect(getComputedStyle($el[0]).gridColumnStart).to.equal('2')
      })
  })

  it('renders rows as links with `to`, buttons with a click listener, divs otherwise', () => {
    const clicked = cy.spy().as('rowClick')
    cy.mount(
      {
        render: () =>
          h(List, () => [
            feedRow('1', { to: { name: 'Item', params: { id: '1' } } }),
            feedRow('2', { onClick: clicked }),
            feedRow('3'),
          ]),
      },
      { global: { plugins: [makeRouter()] } },
    )
    cy.get('a[data-slot=list-row]')
      .should('have.attr', 'href', '/item/1')
      .and('have.attr', 'data-interactive')
    cy.get('button[data-slot=list-row]').click()
    cy.get('@rowClick').should('have.been.calledOnce')
    cy.get('div[data-slot=list-row]').should('exist')
  })

  it('navigates on row click', () => {
    const router = makeRouter()
    cy.mount(
      {
        render: () => [
          h(RouterView),
          h(List, () => [
            feedRow('1', { to: { name: 'Item', params: { id: '1' } } }),
          ]),
        ],
      },
      { global: { plugins: [router] } },
    )
    cy.get('a[data-slot=list-row]')
      .click()
      .then(() => {
        expect(router.currentRoute.value.fullPath).to.equal('/item/1')
      })
  })
})

describe('List (selection)', () => {
  function mountSelectable(rowProps: Record<string, unknown> = {}) {
    const selection = ref<string[]>([])
    const selectable = ref(true)
    cy.mount({
      render: () =>
        h(
          List,
          {
            selectable: selectable.value,
            selection: selection.value,
            'onUpdate:selection': (next: string[]) => (selection.value = next),
          },
          () => [feedRow('1', rowProps), feedRow('2', rowProps)],
        ),
    })
    return { selection, selectable }
  }

  it('toggles selection on row click instead of activating the row', () => {
    const clicked = cy.spy().as('rowClick')
    const { selection } = mountSelectable({ onClick: clicked })
    cy.get('[data-slot=list-row]')
      .first()
      .click()
      .then(() => {
        expect(selection.value).to.deep.equal(['1'])
      })
    cy.get('@rowClick').should('not.have.been.called')
    cy.get('[data-slot=list-row]')
      .first()
      .should('have.attr', 'data-state', 'selected')
    cy.get('[data-slot=list-row]')
      .first()
      .click()
      .then(() => {
        expect(selection.value).to.deep.equal([])
      })
  })

  it('toggles selection on a mouse click over the checkbox', () => {
    const { selection } = mountSelectable()
    // The inner native <input> is presentational and must not swallow clicks:
    // otherwise a click landing on it fires the input's own native toggle, which
    // fights the one-way :modelValue binding and selects nothing. With
    // pointer-events:none, a click at those pixels resolves to the wrapper.
    cy.get('[data-slot=list-row-checkbox] input[type=checkbox]')
      .first()
      .should('have.css', 'pointer-events', 'none')
    cy.get('[data-slot=list-row-checkbox]')
      .first()
      .click()
      .then(() => {
        expect(selection.value).to.deep.equal(['1'])
      })
    cy.get('[data-slot=list-row-checkbox]')
      .first()
      .should('have.attr', 'aria-checked', 'true')
  })

  it('exposes a keyboard-operable checkbox and reveals the checkbox column', () => {
    const { selection, selectable } = mountSelectable()
    cy.get('[data-slot=list-row-checkbox]').should('have.length', 2)
    // 32px checkbox column + the 12px hover-surface inset interactive rows get.
    cy.get('[data-slot=list-row]')
      .first()
      .should('have.css', 'padding-inline-start', '44px')
    cy.get('[data-slot=list-row-checkbox]')
      .first()
      .should('have.attr', 'role', 'checkbox')
      .and('have.attr', 'aria-checked', 'false')
      .focus()
      .type('{enter}')
      .then(() => {
        expect(selection.value).to.deep.equal(['1'])
      })
    cy.get('[data-slot=list-row-checkbox]')
      .first()
      .should('have.attr', 'aria-checked', 'true')
      .then(() => {
        // Leaving select mode collapses the checkbox column again.
        selectable.value = false
      })
    cy.get('[data-slot=list-row-checkbox]').should('not.exist')
    // Rows with no link/click revert to non-interactive divs: no inset at all.
    cy.get('[data-slot=list-row]')
      .first()
      .should('have.css', 'padding-inline-start', '0px')
  })
})

describe('List (select all)', () => {
  // Select-all is fed by <ListRows> (the full items universe), so this mount
  // uses ListRows + a header rather than bare feedRow().
  function mountSelectAll(initial: string[] = []) {
    const selection = ref<string[]>(initial)
    const items = ref([{ id: '1' }, { id: '2' }, { id: '3' }])
    cy.mount({
      render: () =>
        h(
          List,
          {
            selectable: true,
            selection: selection.value,
            'onUpdate:selection': (next: string[]) => (selection.value = next),
          },
          () => [
            h(ListHeader, () => h(ListHeaderCell, () => 'Name')),
            h(
              ListRows,
              { items: items.value },
              {
                default: ({
                  item,
                  value,
                }: {
                  item: { id: string }
                  value: string
                }) => h(ListRow, { value }, () => h(ListCell, () => item.id)),
              },
            ),
          ],
        ),
    })
    return { selection, items }
  }

  it('selects every row from the header checkbox and clears on a second click', () => {
    const { selection } = mountSelectAll()
    cy.get('[data-slot=list-header-checkbox]')
      .should('have.attr', 'role', 'checkbox')
      .and('have.attr', 'aria-checked', 'false')
      .click()
      .then(() => {
        expect(selection.value).to.deep.equal(['1', '2', '3'])
      })
    cy.get('[data-slot=list-header-checkbox]')
      .should('have.attr', 'aria-checked', 'true')
      .click()
      .then(() => {
        expect(selection.value).to.deep.equal([])
      })
  })

  it('shows the mixed state when only some rows are selected', () => {
    mountSelectAll(['2'])
    cy.get('[data-slot=list-header-checkbox]').should(
      'have.attr',
      'aria-checked',
      'mixed',
    )
    // The inner native input carries the indeterminate property, not an attr.
    cy.get('[data-slot=list-header-checkbox] input[type=checkbox]')
      .first()
      .should(($el) => {
        expect(($el[0] as HTMLInputElement).indeterminate).to.equal(true)
      })
  })

  it('clicking mixed promotes to all selected', () => {
    const { selection } = mountSelectAll(['2'])
    cy.get('[data-slot=list-header-checkbox]')
      .click()
      .then(() => {
        expect([...selection.value].sort()).to.deep.equal(['1', '2', '3'])
      })
  })

  it('honors a custom rowKey when the value is neither name nor id', () => {
    // Items carry the selection value in `ref`, not name/id — so select-all
    // would target the wrong universe without an explicit rowKey.
    const selection = ref<string[]>([])
    const items = [{ ref: 'a' }, { ref: 'b' }]
    cy.mount({
      render: () =>
        h(
          List,
          {
            selectable: true,
            selection: selection.value,
            'onUpdate:selection': (next: string[]) => (selection.value = next),
          },
          () => [
            h(ListHeader, () => h(ListHeaderCell, () => 'Name')),
            h(
              ListRows,
              { items, rowKey: 'ref' },
              {
                default: ({
                  item,
                  value,
                }: {
                  item: { ref: string }
                  value: string
                }) => h(ListRow, { value }, () => h(ListCell, () => item.ref)),
              },
            ),
          ],
        ),
    })
    cy.get('[data-slot=list-header-checkbox]')
      .click()
      .then(() => {
        expect([...selection.value].sort()).to.deep.equal(['a', 'b'])
      })
  })

  it('matches string row values against numeric item ids', () => {
    // Real-world footgun: items carry numeric `id`s, but `ListRow.value` is
    // string-typed, so consumers pass `String(item.id)`. The select-all
    // universe must coerce to string too, or a numeric universe never matches
    // the string selection and the header checkbox stays empty.
    const selection = ref<string[]>(['2'])
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    cy.mount({
      render: () =>
        h(
          List,
          {
            selectable: true,
            selection: selection.value,
            'onUpdate:selection': (next: string[]) => (selection.value = next),
          },
          () => [
            h(ListHeader, () => h(ListHeaderCell, () => 'Name')),
            h(
              ListRows,
              { items },
              {
                default: ({
                  item,
                  value,
                }: {
                  item: { id: number }
                  value: string
                }) => h(ListRow, { value }, () => h(ListCell, () => item.id)),
              },
            ),
          ],
        ),
    })
    // One of three selected → mixed/indeterminate, proving the universe matched.
    cy.get('[data-slot=list-header-checkbox]').should(
      'have.attr',
      'aria-checked',
      'mixed',
    )
    cy.get('[data-slot=list-header-checkbox]')
      .click()
      .then(() => {
        expect([...selection.value].sort()).to.deep.equal(['1', '2', '3'])
      })
  })
})

describe('List (active row)', () => {
  // Four rows so the active row (row 2) has a divider on both sides plus an
  // untouched row 4 to prove only the hugging pair is hidden.
  function mountActive(rowProps: Record<string, unknown> = {}) {
    const active = ref<string | undefined>('2')
    cy.mount({
      render: () =>
        h(
          List,
          {
            active: active.value,
            'onUpdate:active': (next?: string) => (active.value = next),
          },
          () => [
            feedRow('1', rowProps),
            feedRow('2', rowProps),
            feedRow('3', rowProps),
            feedRow('4', rowProps),
          ],
        ),
    })
    return { active }
  }

  it('marks the bound row active and makes rows interactive without a click handler', () => {
    mountActive()
    // Binding v-model:active opts every row into interactivity → buttons.
    cy.get('button[data-slot=list-row]').should('have.length', 4)
    cy.get('[data-slot=list-row][data-active]')
      .should('have.length', 1)
      .and('contain.text', 'Content 2')
      .and('have.attr', 'aria-current', 'true')
  })

  it('activates on click and still fires the row’s own onClick', () => {
    const clicked = cy.spy().as('rowClick')
    const { active } = mountActive({ onClick: clicked })
    cy.get('[data-slot=list-row]')
      .eq(0)
      .click()
      .then(() => {
        expect(active.value).to.equal('1')
      })
    // Unlike selection, activation is additive — the app’s handler still runs.
    cy.get('@rowClick').should('have.been.calledOnce')
    cy.get('[data-slot=list-row]').eq(0).should('have.attr', 'data-active')
    cy.get('[data-slot=list-row]').eq(1).should('not.have.attr', 'data-active')
  })

  it('hides the dividers directly above and below the active row', () => {
    mountActive() // active = row 2 (index 1)
    // Row 1 never shows a divider-above; the pair hugging the active row
    // (its own divider-above and row 3’s) go to 0; row 4 keeps its divider.
    cy.get('[data-slot=list-divider]').eq(0).should('have.css', 'opacity', '0')
    cy.get('[data-slot=list-divider]').eq(1).should('have.css', 'opacity', '0')
    cy.get('[data-slot=list-divider]').eq(2).should('have.css', 'opacity', '0')
    cy.get('[data-slot=list-divider]').eq(3).should('have.css', 'opacity', '1')
  })

  it('stays inert when v-model:active is not bound', () => {
    cy.mount({ render: () => h(List, () => [feedRow('1'), feedRow('2')]) })
    cy.get('[data-slot=list-row][data-active]').should('not.exist')
    cy.get('button[data-slot=list-row]').should('not.exist')
  })
})

describe('List (column mode)', () => {
  function mountTable() {
    // Sort state and toggle rules are app-owned; the cells are controlled.
    const sortField = ref('name')
    const sortDirection = ref<'asc' | 'desc'>('asc')
    function toggleSort(field: string, firstDirection: 'asc' | 'desc' = 'asc') {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = firstDirection
      }
    }
    const directionFor = (field: string) =>
      sortField.value === field ? sortDirection.value : null
    cy.mount({
      render: () =>
        h(List, { columns: ['minmax(0,1fr)', '10rem', '4rem'] }, () => [
          h(ListHeader, () => [
            h(
              ListHeaderCellSort,
              {
                direction: directionFor('name'),
                onClick: () => toggleSort('name'),
              },
              {
                default: () => 'User',
                // Adornments are app-supplied; expose the scoped direction for assertions.
                suffix: ({ direction }: { direction: string | null }) =>
                  h(
                    'span',
                    { 'data-testid': 'sort-icon' },
                    direction ?? 'none',
                  ),
              },
            ),
            h(
              ListHeaderCellSort,
              {
                direction: directionFor('creation'),
                onClick: () => toggleSort('creation', 'desc'),
              },
              () => 'User since',
            ),
            h(ListHeaderCell, { class: 'justify-end' }, () => 'Actions'),
          ]),
          feedRow('1'),
          feedRow('2'),
        ]),
    })
    return { sortField, sortDirection }
  }

  it('uses table semantics when a header is present', () => {
    mountTable()
    cy.get('[data-slot=list]').should('have.attr', 'role', 'table')
    cy.get('[data-slot=list-header]').should('have.attr', 'role', 'row')
    cy.get('[data-slot=list-header-cell]').should(
      'have.attr',
      'role',
      'columnheader',
    )
    cy.get('[data-slot=list-row]').first().should('have.attr', 'role', 'row')
    cy.get('[data-slot=list-cell]').first().should('have.attr', 'role', 'cell')
  })

  it('shares the column template between header and rows', () => {
    mountTable()
    cy.get('[data-slot=list-header]').should(($header) => {
      const rowTemplate = getComputedStyle(
        $header[0].parentElement!.querySelector('[data-slot=list-row]')!,
      ).gridTemplateColumns
      expect(getComputedStyle($header[0]).gridTemplateColumns).to.equal(
        rowTemplate,
      )
    })
  })

  it('renders controlled sort chrome and emits clicks for app-owned sort state', () => {
    const { sortField, sortDirection } = mountTable()
    cy.get('[data-slot=list-header-cell][data-sort=asc]').should(
      'contain.text',
      'User',
    )
    cy.get('[data-slot=list-header-cell]')
      .first()
      .should('have.attr', 'aria-sort', 'ascending')
      .find('button')
      .click()
      .then(() => {
        expect(sortField.value).to.equal('name')
        expect(sortDirection.value).to.equal('desc')
      })
    cy.get('[data-slot=list-header-cell]')
      .first()
      .should('have.attr', 'aria-sort', 'descending')
    cy.get('[data-testid=sort-icon]').should('have.text', 'desc')
    cy.get('[data-slot=list-header-cell]')
      .eq(1)
      .find('button')
      .click()
      .then(() => {
        expect(sortField.value).to.equal('creation')
        expect(sortDirection.value).to.equal('desc')
      })
    cy.get('[data-slot=list-header-cell]')
      .first()
      .should('not.have.attr', 'data-sort')
    // Plain ListHeaderCell → same columnheader geometry, no button.
    cy.get('[data-slot=list-header-cell]')
      .eq(2)
      .find('button')
      .should('not.exist')
  })

  it('right-aligns an end-aligned sort cell and leads with the glyph', () => {
    const direction = ref<'asc' | null>(null)
    cy.mount({
      render: () =>
        h(List, { columns: ['minmax(0,1fr)', '6rem', '4rem'] }, () => [
          h(ListHeader, () => [
            h(ListHeaderCell, () => 'Name'),
            h(
              ListHeaderCellSort,
              {
                direction: direction.value,
                align: 'end',
                onClick: () =>
                  (direction.value = direction.value ? null : 'asc'),
              },
              {
                default: () => 'Size',
                suffix: () => h('span', { 'data-testid': 'glyph' }, 'icon'),
              },
            ),
            h(ListHeaderCell, () => ''),
          ]),
          feedRow('1'),
        ]),
    })

    const sizeCell = () => cy.get('[data-slot=list-header-cell]').eq(1)
    // The cell right-aligns its content.
    sizeCell().should('have.class', 'justify-end')
    // The glyph renders before the label, so the label hugs the right edge.
    sizeCell()
      .find('button')
      .then(($button) => {
        const html = $button.html()
        expect(html.indexOf('data-testid="glyph"')).to.be.lessThan(
          html.indexOf('Size'),
        )
      })
    // Inactive → glyph hidden until hover (opacity, so no layout shift).
    cy.get('[data-testid=glyph]').parent().should('have.class', 'opacity-0')
    // Activating the sort reveals the glyph.
    sizeCell().find('button').click()
    cy.get('[data-testid=glyph]').parent().should('not.have.class', 'opacity-0')
  })
})

describe('List (styling hooks)', () => {
  // The v1 CSS-var contract (ADR-0017): --list-columns, --list-gap and
  // --list-row-padding-x are the public hooks. Defaults live in var()
  // fallbacks at the use sites, so a consumer value — a class on the List or
  // a declaration inherited from any ancestor — always beats the built-in
  // defaults AND the props.

  it('lets a --list-columns class beat the columns prop', () => {
    cy.mount({
      render: () =>
        h(
          List,
          {
            columns: ['50px', '50px', '50px'],
            // The tailwind arbitrary-property form consumers author
            // (list-cols-[…] compiles to the same declaration).
            class: '[--list-columns:60px_90px_120px]',
          },
          () => [feedRow('1')],
        ),
    })
    cy.get('[data-slot=list-row]').should(($row) => {
      expect(getComputedStyle($row[0]).gridTemplateColumns).to.equal(
        '60px 90px 120px',
      )
    })
  })

  it('applies hooks inherited from an ancestor, over props and defaults', () => {
    cy.mount({
      render: () =>
        h(
          'div',
          {
            style:
              '--list-columns: 70px 110px 130px; --list-gap: 20px; --list-row-padding-x: 24px',
          },
          [
            h(List, { columns: ['50px', '50px', '50px'] }, () => [
              h(ListHeader, () => [
                h(ListHeaderCell, () => 'A'),
                h(ListHeaderCell, () => 'B'),
                h(ListHeaderCell, () => 'C'),
              ]),
              feedRow('1', { onClick: () => {} }),
              feedRow('2'),
            ]),
          ],
        ),
    })
    cy.get('[data-slot=list-row]').should(($row) => {
      const style = getComputedStyle($row[0])
      expect(style.gridTemplateColumns).to.equal('70px 110px 130px')
      expect(style.columnGap).to.equal('20px')
    })
    // One --list-row-padding-x value lands everywhere — interactive row,
    // static row, and header — so none of them can drift.
    cy.get('button[data-slot=list-row]').should(
      'have.css',
      'padding-inline-start',
      '24px',
    )
    cy.get('div[data-slot=list-row]').should(
      'have.css',
      'padding-inline-start',
      '24px',
    )
    cy.get('[data-slot=list-header]').should(
      'have.css',
      'padding-inline-start',
      '24px',
    )
  })

  it('defaults the row inset to 12px and the header to flush until the hook is set', () => {
    // The documented asymmetric default: interactive rows carry a 0.75rem
    // hover-surface inset; static rows and the header (which can't know
    // whether its rows are interactive) stay flush at 0 — the consumer aligns
    // everything by declaring the hook once.
    cy.mount({
      render: () =>
        h(List, { columns: ['minmax(0,1fr)', '10rem', '4rem'] }, () => [
          h(ListHeader, () => [
            h(ListHeaderCell, () => 'A'),
            h(ListHeaderCell, () => 'B'),
            h(ListHeaderCell, () => 'C'),
          ]),
          feedRow('1', { onClick: () => {} }),
          feedRow('2'),
        ]),
    })
    // Also pins the preflight escape: the interactive row is a <button>, and
    // preflight's `button { padding: 0 }` must not eat the inset (the padding
    // rule deliberately keeps attribute specificity instead of :where()).
    cy.get('button[data-slot=list-row]').should(
      'have.css',
      'padding-inline-start',
      '12px',
    )
    cy.get('div[data-slot=list-row]').should(
      'have.css',
      'padding-inline-start',
      '0px',
    )
    cy.get('[data-slot=list-header]').should(
      'have.css',
      'padding-inline-start',
      '0px',
    )
  })

  it('drives the preset sugar utilities through the same vars', () => {
    cy.mount({
      render: () =>
        h(
          List,
          {
            columns: ['minmax(0,1fr)', '10rem'],
            // list-gap-4 → --list-gap: 1rem; list-row-px-3 → 0.75rem.
            class: 'list-gap-4 list-row-px-3',
          },
          () => [
            h(ListHeader, () => [
              h(ListHeaderCell, () => 'A'),
              h(ListHeaderCell, () => 'B'),
            ]),
            feedRow('1', { onClick: () => {} }),
          ],
        ),
    })
    cy.get('[data-slot=list-row]')
      .should('have.css', 'column-gap', '16px')
      .and('have.css', 'padding-inline-start', '12px')
    cy.get('[data-slot=list-header]').should(
      'have.css',
      'padding-inline-start',
      '12px',
    )
  })

  it('applies rowHeight to every row', () => {
    cy.mount({
      render: () => h(List, { rowHeight: 48 }, () => [feedRow('1')]),
    })
    cy.get('[data-slot=list-row]').should('have.css', 'height', '48px')
  })

  it('contains prop carriers to their own list; public hooks cross into nested lists', () => {
    // The outer list's columns/selectable/rowHeight ride internal --_list-*
    // carriers, which reset at every list root — a nested list that omits
    // those props falls back to its own defaults instead of inheriting the
    // outer geometry. Public hooks (--list-gap here) keep crossing by design.
    cy.mount({
      render: () =>
        h('div', { style: '--list-gap: 20px' }, [
          h(
            List,
            {
              columns: ['50px', '50px', '50px'],
              selectable: true,
              rowHeight: 64,
            },
            () => [
              feedRow('1'),
              h(ListRow, { value: 'host' }, () => [
                h(ListCell, () => h(List, () => [feedRow('inner')])),
              ]),
            ],
          ),
        ]),
    })
    cy.get('[data-slot=list] [data-slot=list] [data-slot=list-row]').should(
      ($row) => {
        const style = getComputedStyle($row[0])
        // Feed template, not the outer 50px tracks.
        expect(style.gridTemplateColumns).to.not.equal('50px 50px 50px')
        // No leaked checkbox column (32px) and no hover inset inherited from
        // the outer selectable list or its interactive host row.
        expect(style.paddingInlineStart).to.equal('0px')
        expect(style.paddingInlineEnd).to.equal('0px')
        // Not the outer fixed rowHeight.
        expect(style.height).to.not.equal('64px')
        // The public hook crossed both list boundaries.
        expect(style.columnGap).to.equal('20px')
      },
    )
  })
})

describe('ListRows (virtual)', () => {
  it('windows rows against the nearest scrollable ancestor', () => {
    const items = Array.from({ length: 500 }, (_, i) => ({ id: String(i + 1) }))
    cy.mount({
      render: () =>
        h(
          'div',
          {
            style: 'height: 200px; overflow-y: auto',
            'data-testid': 'viewport',
          },
          [
            h(List, { rowHeight: 40, columns: ['minmax(0,1fr)'] }, () => [
              h(
                ListRows,
                { items, virtual: true },
                {
                  default: ({ item }: { item: { id: string } }) =>
                    h(ListRow, { key: item.id }, () => [
                      h(ListCell, () => h('span', `Row ${item.id}`)),
                    ]),
                },
              ),
            ]),
          ],
        ),
    })
    cy.get('[data-slot=list-row]').should('have.length.lessThan', 50)
    cy.contains('[data-slot=list-row]', 'Row 1').should('exist')
    cy.get('[data-testid=viewport]').scrollTo('bottom')
    cy.contains('[data-slot=list-row]', 'Row 500').should('exist')
    cy.contains('[data-slot=list-row]', 'Row 1').should('not.exist')
  })
})
