import { setConfig } from '../../index'
import SearchComplete from './SearchComplete.vue'

const DOCS = [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }]

// `createListResource` caches by doctype in module scope and mirrors every
// response into IndexedDB, so a shared name would leak one test's filters and
// results into the next.
let counter = 0
function uniqueDoctype() {
  return `SearchCompleteDoc${++counter}-${Date.now()}`
}

// Stands in for frappe.client.get_list. It honours the `like` filter the picker
// sends, so typing a query really does drop rows from the result set — which is
// the whole point of these tests.
function stubServer() {
  setConfig('resourceFetcher', (options: any) => {
    const pattern = options.params?.filters?.name?.[1] ?? '%%'
    const query = String(pattern).replaceAll('%', '').toLowerCase()
    return Promise.resolve(
      DOCS.filter((doc) => doc.name.toLowerCase().includes(query)),
    )
  })
}

function trigger() {
  return cy.get('[data-slot="trigger"]')
}

function search() {
  return cy.get('[data-slot="search"] input')
}

describe('SearchComplete', () => {
  beforeEach(stubServer)
  afterEach(() => setConfig('resourceFetcher', undefined))

  it('shows the picked option on the trigger', () => {
    cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } })

    trigger().should('contain.text', 'Select an option').click()
    cy.get('[role=option]').contains('Alpha').click()

    trigger().should('contain.text', 'Alpha')
  })

  // The regression this guards: Combobox resolves the trigger label out of the
  // options it was handed, and those options are one page of server results.
  // Without SearchComplete remembering the selection, narrowing the query drops
  // the selected row from `options` and the label silently reverts to the
  // placeholder.
  it('keeps the selected label after a query that excludes it', () => {
    cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } })

    trigger().click()
    cy.get('[role=option]').contains('Alpha').click()
    trigger().should('contain.text', 'Alpha')

    trigger().click()
    search().type('Beta')
    cy.get('[role=option]').should('contain.text', 'Beta')

    // Close without selecting anything.
    search().type('{esc}')
    cy.get('[data-slot="content"]').should('not.exist')

    trigger().should('contain.text', 'Alpha')
  })

  // Combobox hands query ownership to anything that listens for
  // `update:query`, so the committed label used to stay in the search box and
  // the next keystroke appended to it — "Alpha" then "AlphaBeta".
  it('resets the search box each time the popover opens', () => {
    cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } })

    trigger().click()
    cy.get('[role=option]').contains('Alpha').click()

    trigger().click()
    search().should('have.value', '')
  })

  it('resolves a label for a value supplied by the parent', () => {
    cy.mount(SearchComplete, {
      props: { doctype: uniqueDoctype(), modelValue: 'Gamma' },
    })

    trigger().should('contain.text', 'Gamma')
  })
})
