import { defineComponent, h, ref } from 'vue'
import Link from './Link.vue'

const users = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
]

function stubSearchLink(rows = users) {
  cy.intercept('POST', '/api/method/frappe.desk.search.search_link', {
    statusCode: 200,
    body: { message: rows },
  }).as('searchLink')
}

describe('Link', () => {
  beforeEach(() => {
    stubSearchLink()
  })

  describe('rendering', () => {
    it('emits data-slot="link" on the root wrapper', () => {
      cy.mount(Link, { props: { doctype: 'User' } })
      cy.get('[data-slot="link"]').should('exist')
    })

    it('forwards id/label/description/required to the underlying Combobox (P5)', () => {
      cy.mount(Link, {
        props: {
          doctype: 'User',
          id: 'user-picker',
          label: 'User',
          description: 'Pick a user',
          required: true,
        },
      })

      cy.get('label[for="user-picker"]').should('contain.text', 'User')
      cy.get('[role="combobox"]#user-picker').should(
        'have.attr',
        'aria-required',
        'true',
      )
      cy.contains('Pick a user').should('exist')
    })

    it('forwards `error` and wires aria-invalid', () => {
      cy.mount(Link, {
        props: {
          doctype: 'User',
          id: 'user-picker',
          error: 'Boom',
        },
      })
      cy.get('[role="combobox"]#user-picker').should(
        'have.attr',
        'aria-invalid',
        'true',
      )
      cy.contains('Boom').should('exist')
    })
  })

  describe('v-model', () => {
    it('round-trips a selection', () => {
      cy.mount(Link, {
        props: {
          doctype: 'User',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.wait('@searchLink')
      cy.get('[role="combobox"]').click()
      cy.contains('[role="option"]', 'Alice').click()
      cy.get('@onUpdate').should('have.been.calledWith', 'alice')
    })

    it('clear sets the model to null (never the empty string)', () => {
      const Host = defineComponent({
        setup() {
          const value = ref<string | null>('alice')
          return { value }
        },
        render() {
          return h(Link, {
            doctype: 'User',
            modelValue: this.value,
            'onUpdate:modelValue': (v: string | null) => (this.value = v),
          })
        },
      })

      cy.mount(Host).then(({ component }) => {
        const host = component as unknown as { value: string | null }
        cy.get('[data-slot="clear"]').click({ force: true })
        cy.then(() => expect(host.value).to.equal(null))
      })
    })
  })

  describe('default clear', () => {
    it('renders a clear button when value is set and not required', () => {
      cy.mount(Link, {
        props: {
          doctype: 'User',
          modelValue: 'alice',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('[data-slot="clear"]').should('exist').click({ force: true })
      cy.get('@onUpdate').should('have.been.calledWith', null)
    })

    it('suppresses the clear button when required is true', () => {
      cy.mount(Link, {
        props: { doctype: 'User', modelValue: 'alice', required: true },
      })
      cy.get('[data-slot="clear"]').should('not.exist')
    })

    it('suppresses the clear button when modelValue is empty', () => {
      cy.mount(Link, { props: { doctype: 'User' } })
      cy.get('[data-slot="clear"]').should('not.exist')
    })
  })

  describe('creatable', () => {
    it('does not render the Create row by default', () => {
      cy.mount(Link, { props: { doctype: 'User' } })
      cy.get('[role="combobox"]').click().type('zed')
      cy.contains('[role="option"]', 'Create').should('not.exist')
    })

    it('shows the Create row only when query is non-empty', () => {
      cy.mount(Link, { props: { doctype: 'User', creatable: true } })
      cy.get('[role="combobox"]').click()
      cy.contains('[role="option"]', 'Create').should('not.exist')
      cy.get('[role="combobox"]').type('zed')
      cy.contains('[role="option"]', 'Create').should('contain.text', 'zed')
    })

    it('emits @create with just the query (one argument)', () => {
      cy.mount(Link, {
        props: {
          doctype: 'User',
          creatable: true,
          onCreate: cy.spy().as('onCreate'),
        },
      })
      cy.get('[role="combobox"]').click().type('zed')
      cy.contains('[role="option"]', 'Create').click()
      cy.get('@onCreate').should('have.been.calledOnce')
      cy.get('@onCreate').should('have.been.calledWith', 'zed')
      cy.get('@onCreate').then((spy) => {
        // Spec: @create is one-arg. Guard against the old (query, close) shape.
        const callArgs = (spy as unknown as sinon.SinonSpy).getCall(0).args
        expect(callArgs).to.have.length(1)
      })
    })
  })

  describe('v-model:open', () => {
    it('emits update:open when the popover toggles', () => {
      cy.mount(Link, {
        props: {
          doctype: 'User',
          'onUpdate:open': cy.spy().as('onOpen'),
        },
      })
      cy.get('[role="combobox"]').click()
      cy.get('@onOpen').should('have.been.calledWith', true)
    })
  })

  describe('exposed API', () => {
    it('exposes a zero-arg reload() that re-fetches options', () => {
      const Host = defineComponent({
        setup() {
          const link = ref<{ reload: () => void } | null>(null)
          return { link }
        },
        render() {
          return h(Link, { doctype: 'User', ref: 'link' })
        },
      })

      cy.mount(Host).then(({ component }) => {
        cy.wait('@searchLink')
        cy.then(() => {
          const exposed = (component as unknown as { link: { reload: () => void } }).link
          expect(exposed.reload).to.be.a('function')
          expect(exposed.reload.length).to.equal(0)
          exposed.reload()
        })
        cy.wait('@searchLink')
      })
    })
  })

  describe('#suffix slot', () => {
    it('replaces the default clear button', () => {
      cy.mount(Link, {
        props: { doctype: 'User', modelValue: 'alice' },
        slots: {
          suffix: () =>
            h('button', { 'data-slot': 'redirect', type: 'button' }, 'Go'),
        },
      })
      cy.get('[data-slot="clear"]').should('not.exist')
      cy.get('[data-slot="redirect"]').should('exist')
    })
  })
})
