import { h } from 'vue'
import Combobox from './Combobox.vue'

const fruits = ['Apple', 'Mango', 'Cherry']

describe('Combobox', () => {
  describe('rendering', () => {
    it('renders the input shell and placeholder', () => {
      cy.mount(Combobox, {
        props: { options: fruits, placeholder: 'Pick fruit' },
      })

      cy.get('[data-slot="trigger"]').should('have.attr', 'data-variant', 'subtle')
      cy.get('[role="combobox"]').should('have.attr', 'placeholder', 'Pick fruit')
    })

    it('forwards `id` to the input element', () => {
      cy.mount(Combobox, { props: { options: fruits, id: 'my-fruit' } })
      cy.get('[role="combobox"]#my-fruit').should('exist')
    })

    it('reflects size and variant on the trigger', () => {
      cy.mount(Combobox, {
        props: { options: fruits, size: 'lg', variant: 'outline' },
      })
      cy.get('[data-slot="trigger"]').should('have.attr', 'data-size', 'lg')
      cy.get('[data-slot="trigger"]').should('have.attr', 'data-variant', 'outline')
    })

    it('renders the chevron and rotates it when open', () => {
      cy.mount(Combobox, { props: { options: fruits } })
      cy.get('[data-slot="chevron"]').should('exist')
      cy.get('[data-slot="trigger"]').should('have.attr', 'data-state', 'closed')

      cy.get('[data-slot="chevron"]').click()
      cy.get('[data-slot="trigger"]').should('have.attr', 'data-state', 'open')
    })

    it('applies `data-disabled` when disabled', () => {
      cy.mount(Combobox, { props: { options: fruits, disabled: true } })
      cy.get('[data-slot="trigger"]').should('have.attr', 'data-disabled')
      cy.get('[role="combobox"]').should('have.attr', 'disabled')
    })
  })

  describe('selection', () => {
    it('opens and selects a regular option', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
          'onUpdate:selectedOption': cy.spy().as('onSelectedOption'),
        },
      })

      cy.get('[aria-label="Show popup"]').click()
      cy.get('[role="option"]').first().click()

      cy.get('[role="combobox"]').should('have.value', 'Apple')
      cy.get('@onUpdate').should('have.been.calledWith', 'Apple')
      cy.get('@onSelectedOption').should('have.been.calledWithMatch', {
        label: 'Apple',
        value: 'Apple',
      })
    })

    it('marks the selected item via data-state=checked', () => {
      cy.mount(Combobox, {
        props: { modelValue: 'Mango', options: fruits, open: true },
      })
      cy.contains('[role="option"]', 'Mango').should(
        'have.attr',
        'data-state',
        'checked',
      )
    })

    it('emits update:open when opening and closing', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          'onUpdate:open': cy.spy().as('onOpen'),
        },
      })

      cy.get('[aria-label="Show popup"]').click()
      cy.get('@onOpen').should('have.been.calledWith', true)

      cy.get('[role="option"]').first().click()
      cy.get('@onOpen').should('have.been.calledWith', false)
    })

    it('shows all items on open before typing', () => {
      cy.mount(Combobox, {
        props: { options: fruits, open: true },
      })
      cy.get('[role="option"]').should('have.length', 3)
    })

    it('does not select a disabled option on click', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            { label: 'Apple', value: 'apple' },
            { label: 'Mango', value: 'mango', disabled: true },
          ],
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.contains('[role="option"]', 'Mango').click({ force: true })
      cy.get('@onUpdate').should('not.have.been.called')
    })
  })

  describe('query and search', () => {
    it('emits update:query and input, filters options, and clears value when cleared', () => {
      cy.mount(Combobox, {
        props: {
          modelValue: 'Apple',
          options: fruits,
          'onUpdate:query': cy.spy().as('onUpdateQuery'),
          onInput: cy.spy().as('onInput'),
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
          'onUpdate:selectedOption': cy.spy().as('onSelectedOption'),
        },
      })

      cy.get('[role="combobox"]').clear().type('ma')
      cy.get('@onUpdateQuery').should('have.been.calledWith', 'm')
      cy.get('@onUpdateQuery').should('have.been.calledWith', 'ma')
      cy.get('@onInput').should('have.been.calledWith', 'ma')

      cy.get('[role="option"]').should('have.length', 1)
      cy.get('[role="option"]').should('contain.text', 'Mango')

      cy.get('[role="combobox"]').clear()
      cy.get('@onUpdate').should('have.been.calledWith', null)
      cy.get('@onSelectedOption').should('have.been.calledWith', null)
    })

    it('filter is case-insensitive and searches against value', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            { label: 'Engineering', value: 'eng' },
            { label: 'Design', value: 'des' },
          ],
        },
      })
      cy.get('[role="combobox"]').type('ENG')
      cy.get('[role="option"]').should('have.length', 1).and('contain.text', 'Engineering')

      cy.get('[role="combobox"]').clear().type('des')
      cy.get('[role="option"]').should('have.length', 1).and('contain.text', 'Design')
    })
  })

  describe('allowCustomValue', () => {
    it('shows the built-in create row and commits raw query as value', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          allowCustomValue: true,
          openOnFocus: true,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[role="combobox"]').focus().type('dragonfruit')
      cy.get('[role="option"]').should('have.length', 1)
      cy.get('[role="option"]').first().should('contain.text', 'Create "dragonfruit"')
      cy.get('[role="option"]').first().click()
      cy.get('@onUpdate').should('have.been.calledWith', 'dragonfruit')
    })

    it('pressing Enter commits the custom value', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          allowCustomValue: true,
          openOnFocus: true,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('[role="combobox"]').focus().type('papaya{enter}')
      cy.get('@onUpdate').should('have.been.calledWith', 'papaya')
    })
  })

  describe('grouped options', () => {
    it('renders grouped options and omits empty groups', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            { group: 'Fruit', options: ['Apple', null as any, 'Mango'] },
            { group: 'Empty', options: [null as any] },
          ],
        },
      })

      cy.get('[data-slot="group-label"]').should('have.length', 1)
      cy.get('[data-slot="group-label"]').should('contain.text', 'Fruit')
      cy.get('[role="option"]').should('have.length', 2)
    })

    it('uses #group-label slot override', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [{ group: 'Fruit', options: ['Apple'] }],
        },
        slots: {
          'group-label': ({ group }: any) =>
            h('span', { 'data-cy': 'group' }, `→ ${group.group}`),
        },
      })
      cy.get('[data-cy="group"]').should('contain.text', '→ Fruit')
    })
  })

  describe('per-item slots (new API)', () => {
    it('renders item.slots.prefix, label, and suffix', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            {
              label: 'Jane Doe',
              value: 'jane',
              slots: {
                prefix: () => h('span', { 'data-cy': 'p' }, 'P'),
                label: ({ item }: any) => h('span', { 'data-cy': 'l' }, item.label),
                suffix: () => h('span', { 'data-cy': 's' }, 'S'),
              },
            },
          ],
        },
      })
      cy.get('[data-cy="p"]').should('contain.text', 'P')
      cy.get('[data-cy="l"]').should('contain.text', 'Jane Doe')
      cy.get('[data-cy="s"]').should('contain.text', 'S')
    })

    it('slots.item replaces the full row', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            {
              label: 'Custom Row',
              value: 'row',
              slots: {
                item: () => h('div', { 'data-cy': 'full-row' }, 'Custom Takeover'),
              },
            },
          ],
        },
      })
      cy.get('[data-cy="full-row"]').should('contain.text', 'Custom Takeover')
    })

    it('template #item-prefix wins over item.slots.prefix', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            {
              label: 'Jane',
              value: 'jane',
              slots: {
                prefix: () => h('span', { 'data-cy': 'from-item' }, 'JS'),
              },
            },
          ],
        },
        slots: {
          'item-prefix': () => h('span', { 'data-cy': 'from-template' }, 'TPL'),
        },
      })
      cy.get('[data-cy="from-template"]').should('exist')
      cy.get('[data-cy="from-item"]').should('not.exist')
    })
  })

  describe('legacy render alias', () => {
    it('function-form render maps to slots.item (full-row)', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            {
              label: 'Legacy',
              value: 'legacy',
              render: () => h('div', { 'data-cy': 'legacy-fn' }, 'LegacyFn'),
            },
          ],
        },
      })
      cy.get('[data-cy="legacy-fn"]').should('contain.text', 'LegacyFn')
    })

    it('object-form render maps one-to-one to slots', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            {
              label: 'Legacy',
              value: 'legacy',
              render: {
                prefix: () => h('span', { 'data-cy': 'legacy-prefix' }, 'LP'),
              },
            },
          ],
        },
      })
      cy.get('[data-cy="legacy-prefix"]').should('contain.text', 'LP')
    })
  })

  describe('namespaced and legacy slot dispatch', () => {
    it('supports namespaced item slots and legacy direct slots', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            { label: 'Jane Doe', value: 'jane', slot: 'person' },
            {
              type: 'custom',
              key: 'create',
              label: 'Create new',
              slotName: 'legacy-create',
              onClick: () => null,
            },
          ],
        },
        slots: {
          'item-person': ({ item }: any) =>
            h('div', { 'data-cy': 'person-slot' }, item.label),
          'legacy-create': ({ searchTerm }: any) =>
            h('div', { 'data-cy': 'legacy-slot' }, `Legacy ${searchTerm}`),
        },
      })

      cy.get('[data-cy="person-slot"]').should('contain.text', 'Jane Doe')
      cy.get('[data-cy="legacy-slot"]').should('contain.text', 'Legacy')
    })
  })

  describe('custom options', () => {
    it('onClick receives { query } context and closes by default', () => {
      const handler = cy.stub().as('onCustomClick')

      cy.mount(Combobox, {
        props: {
          openOnFocus: true,
          options: [
            { label: 'Apple', value: 'apple' },
            {
              type: 'custom',
              key: 'create',
              label: 'Create new',
              onClick: handler,
              // stay visible no matter what the user typed
              condition: () => true,
            },
          ],
          'onUpdate:open': cy.spy().as('onOpen'),
        },
      })

      cy.get('[role="combobox"]').focus().type('foo')
      cy.contains('[role="option"]', 'Create new').click()
      cy.get('@onCustomClick').should(
        'have.been.calledWithMatch',
        Cypress.sinon.match({ query: 'foo' }),
      )
      cy.get('@onOpen').should('have.been.calledWith', false)
    })

    it('keepOpen: true leaves the popover open after clicking', () => {
      cy.mount(Combobox, {
        props: {
          openOnFocus: true,
          options: [
            {
              type: 'custom',
              key: 'help',
              label: 'Need help',
              keepOpen: true,
              onClick: cy.spy().as('helpClick'),
            },
          ],
        },
      })

      cy.get('[role="combobox"]').focus()
      cy.contains('[role="option"]', 'Need help').click()
      cy.get('@helpClick').should('have.been.calledOnce')
      cy.get('[role="listbox"]').should('exist')
    })

    it('condition() controls visibility', () => {
      cy.mount(Combobox, {
        props: {
          openOnFocus: true,
          options: [
            { label: 'Apple', value: 'apple' },
            {
              type: 'custom',
              key: 'create',
              label: 'Create new',
              onClick: () => null,
              condition: ({ query }: any) => Boolean(query),
            },
          ],
        },
      })

      cy.get('[role="combobox"]').focus()
      cy.contains('[role="option"]', 'Create new').should('not.exist')

      cy.get('[role="combobox"]').type('x')
      cy.contains('[role="option"]', 'Create new').should('exist')
    })

    it('does not fire onClick for disabled custom option', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [
            {
              type: 'custom',
              key: 'disabled',
              label: 'Disabled action',
              disabled: true,
              onClick: cy.spy().as('disabledClick'),
            },
          ],
        },
      })
      cy.contains('[role="option"]', 'Disabled action').click({ force: true })
      cy.get('@disabledClick').should('not.have.been.called')
    })
  })

  describe('empty, loading, and footer', () => {
    it('renders emptyText when there are no results', () => {
      cy.mount(Combobox, {
        props: { open: true, options: [], emptyText: 'Nothing here' },
      })
      cy.get('[data-slot="empty"]').should('contain.text', 'Nothing here')
    })

    it('renders custom #empty slot with the current query', () => {
      cy.mount(Combobox, {
        props: { options: fruits, openOnFocus: true },
        slots: {
          empty: ({ query }: any) =>
            h('div', { 'data-cy': 'empty' }, `No results for ${query}`),
        },
      })

      cy.get('[role="combobox"]').focus().type('zzz')
      cy.get('[data-cy="empty"]').should('contain.text', 'No results for zzz')
    })

    it('renders loading state in place of list', () => {
      cy.mount(Combobox, {
        props: { open: true, loading: true, options: [], emptyText: 'X' },
      })
      cy.get('[data-slot="loading"]').should('contain.text', 'Loading...')
      cy.contains('X').should('not.exist')
    })

    it('renders #footer slot', () => {
      cy.mount(Combobox, {
        props: { open: true, options: fruits },
        slots: {
          footer: () => h('div', { 'data-cy': 'footer' }, 'FOOTER'),
        },
      })
      cy.get('[data-slot="footer"] [data-cy="footer"]').should('contain.text', 'FOOTER')
    })
  })

  describe('positioning', () => {
    it('maps deprecated `placement` to `align` when `align` is not set', () => {
      cy.mount(Combobox, {
        props: { open: true, options: fruits, placement: 'end' },
      })
      cy.get('[data-slot="content"]').should('have.attr', 'data-align', 'end')
    })

    it('`align` wins over `placement` and warns in dev', () => {
      const warn = cy.stub(console, 'warn')
      cy.mount(Combobox, {
        props: {
          open: true,
          options: fruits,
          placement: 'end',
          align: 'center',
        },
      }).then(() => {
        expect(warn).to.have.been.calledWithMatch(/placement.*deprecated/i)
      })
      cy.get('[data-slot="content"]').should('have.attr', 'data-align', 'center')
    })

    it('forwards `side` to the popover', () => {
      cy.mount(Combobox, {
        props: { open: true, options: fruits, side: 'top' },
      })
      // Popper may flip on collision, so just assert the content renders and
      // exposes a resolved side attribute.
      cy.get('[data-slot="content"]')
        .should('exist')
        .and('have.attr', 'data-side')
        .and('match', /top|bottom/)
    })
  })

  describe('imperative API', () => {
    it('exposes `reset()` which clears query and selection', () => {
      cy.mount(Combobox, {
        props: {
          modelValue: 'Apple',
          options: fruits,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
          'onUpdate:selectedOption': cy.spy().as('onSelectedOption'),
        },
      }).then((mounted: any) => {
        // cypress-vue returns { wrapper, component }; `component` is the VM.
        const vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
        vm?.reset?.()
      })

      cy.get('@onUpdate').should('have.been.calledWith', null)
      cy.get('@onSelectedOption').should('have.been.calledWith', null)
    })
  })
})
