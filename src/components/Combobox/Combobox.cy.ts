import { defineComponent, h, ref } from 'vue'
import Combobox from './Combobox.vue'
import Dialog from '../Dialog/Dialog.vue'

const fruits = ['Apple', 'Mango', 'Cherry']

describe('Combobox', () => {
  describe('rendering', () => {
    it('renders the input shell and placeholder', () => {
      cy.mount(Combobox, {
        props: { options: fruits, placeholder: 'Pick fruit' },
      })

      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'data-variant',
        'subtle',
      )
      cy.get('[role="combobox"]').should(
        'have.attr',
        'placeholder',
        'Pick fruit',
      )
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
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'data-variant',
        'outline',
      )
    })

    it('renders the chevron and rotates it when open', () => {
      cy.mount(Combobox, { props: { options: fruits } })
      cy.get('[data-slot="chevron"]').should('exist')
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'data-state',
        'closed',
      )

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
          'options': fruits,
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
          'options': fruits,
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
          'open': true,
          'options': [
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
          'modelValue': 'Apple',
          'options': fruits,
          'onUpdate:query': cy.spy().as('onUpdateQuery'),
          'onInput': cy.spy().as('onInput'),
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
      cy.get('[role="option"]')
        .should('have.length', 1)
        .and('contain.text', 'Engineering')

      cy.get('[role="combobox"]').clear().type('des')
      cy.get('[role="option"]')
        .should('have.length', 1)
        .and('contain.text', 'Design')
    })
  })

  describe('allowCustomValue', () => {
    it('shows the built-in create row and commits raw query as value', () => {
      cy.mount(Combobox, {
        props: {
          'options': fruits,
          'allowCustomValue': true,
          'openOnFocus': true,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[role="combobox"]').focus().type('dragonfruit')
      cy.get('[role="option"]').should('have.length', 1)
      cy.get('[role="option"]')
        .first()
        .should('contain.text', 'Create "dragonfruit"')
      cy.get('[role="option"]').first().click()
      cy.get('@onUpdate').should('have.been.calledWith', 'dragonfruit')
    })

    it('pressing Enter commits the custom value', () => {
      cy.mount(Combobox, {
        props: {
          'options': fruits,
          'allowCustomValue': true,
          'openOnFocus': true,
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
                label: ({ item }: any) =>
                  h('span', { 'data-cy': 'l' }, item.label),
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
                item: () =>
                  h('div', { 'data-cy': 'full-row' }, 'Custom Takeover'),
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
          'openOnFocus': true,
          'options': [
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
      cy.get('[data-slot="footer"] [data-cy="footer"]').should(
        'contain.text',
        'FOOTER',
      )
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
      cy.get('[data-slot="content"]').should(
        'have.attr',
        'data-align',
        'center',
      )
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

  describe('custom trigger (button mode)', () => {
    it('renders the #trigger slot in place of the input, and moves search into the popover', () => {
      cy.mount(Combobox, {
        props: { options: fruits, open: true },
        slots: {
          trigger: ({ displayValue }: any) =>
            h(
              'button',
              { 'type': 'button', 'data-cy': 'custom-btn' },
              displayValue || 'Pick a fruit',
            ),
        },
      })

      cy.get('[data-cy="custom-btn"]').should('contain.text', 'Pick a fruit')
      cy.get('[data-slot="content-search"]').should('exist')
      cy.get('[data-slot="content-search"] [role="combobox"]').should('exist')
    })

    it('focuses the popover search input on open and filters from there', () => {
      cy.mount(Combobox, {
        props: { options: fruits },
        slots: {
          trigger: () =>
            h('button', { 'type': 'button', 'data-cy': 'btn' }, 'Pick'),
        },
      })

      cy.get('[data-cy="btn"]').click()
      cy.get('[data-slot="content-search"] [role="combobox"]')
        .should('be.focused')
        .type('ma')

      cy.get('[role="option"]')
        .should('have.length', 1)
        .and('contain.text', 'Mango')
    })

    it('renders built-in button when trigger="button" is set and avoids nested <button>', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          modelValue: 'Mango',
          trigger: 'button',
          placeholder: 'Pick a fruit',
        },
      })

      // Exactly one <button> renders for the trigger — no nested buttons.
      cy.get('[data-slot="trigger"]').should('have.prop', 'tagName', 'BUTTON')
      cy.get('[data-slot="trigger"] button').should('not.exist')
      cy.get('[data-slot="trigger"]').should('contain.text', 'Mango')
    })

    it('trigger="button" is in the native tab order and opens on Enter', () => {
      cy.mount(Combobox, {
        props: { options: fruits, trigger: 'button', placeholder: 'Pick' },
      })

      // Native <button> without a negative tabindex — browser includes it
      // in the default tab order. If reka's ComboboxTrigger ever creeps
      // back into this path it will set tabindex=-1 and this will fail.
      cy.get('[data-slot="trigger"]')
        .should('have.prop', 'tagName', 'BUTTON')
        .should(($btn) => {
          const ti = $btn.attr('tabindex')
          expect(ti === undefined || parseInt(ti, 10) >= 0).to.be.true
        })

      cy.get('[data-slot="trigger"]')
        .focus()
        .should('be.focused')
        .type('{enter}')

      cy.get('[data-slot="content-search"]').should('exist')
    })
  })

  describe('imperative API', () => {
    it('exposes `reset()` which clears query and selection', () => {
      cy.mount(Combobox, {
        props: {
          'modelValue': 'Apple',
          'options': fruits,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
          'onUpdate:selectedOption': cy.spy().as('onSelectedOption'),
          'onUpdate:query': cy.spy().as('onUpdateQuery'),
        },
      }).then((mounted: any) => {
        // cypress-vue returns { wrapper, component }; `component` is the VM.
        const vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
        vm?.reset?.()
      })

      cy.get('@onUpdate').should('have.been.calledWith', null)
      cy.get('@onSelectedOption').should('have.been.calledWith', null)
      cy.get('@onUpdateQuery').should('have.been.calledWith', '')
    })
  })

  // Regression: prevent a future change from re-introducing the
  // phantom prefix container described in Select's matching block.
  describe('item-prefix container', () => {
    it('omits the prefix container when no icon and no #item-prefix slot', () => {
      cy.mount(Combobox, {
        props: { open: true, options: fruits },
      })

      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('not.exist')
    })

    it('renders the prefix container when option has an icon', () => {
      cy.mount(Combobox, {
        props: {
          open: true,
          options: [{ label: 'Apple', value: 'apple', icon: 'lucide-apple' }],
        },
      })

      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('exist')
      cy.get('[role=option]').first().find('.lucide-apple').should('exist')
    })

    it('renders the prefix container when consumer provides #item-prefix', () => {
      cy.mount(Combobox, {
        props: { open: true, options: fruits },
        slots: {
          'item-prefix': () => h('span', { 'data-cy': 'tpl-prefix' }, 'P'),
        },
      })

      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('exist')
      cy.get('[role=option]')
        .first()
        .find('[data-cy="tpl-prefix"]')
        .should('exist')
    })
  })

  // Regression: a Dialog's trapped FocusScope used to steal focus from the
  // portaled popover, so the in-popover search input couldn't be focused or
  // typed into. The FocusScope inside ComboboxContent pushes onto reka's
  // focus-scope stack on open and pauses the dialog's trap.
  describe('inside a Dialog', () => {
    it('focuses and accepts typing in the popover search input (button mode)', () => {
      const Wrapper = defineComponent({
        setup() {
          return { open: ref(true) }
        },
        render() {
          return h(
            Dialog,
            { open: this.open, title: 'Pick' },
            {
              default: () =>
                h(Combobox, {
                  options: fruits,
                  trigger: 'button',
                  placeholder: 'Pick',
                }),
            },
          )
        },
      })

      cy.mount(Wrapper)

      cy.get('[role=dialog]').should('exist')
      cy.get('[data-slot="trigger"]').click()

      cy.get('[data-slot="content-search"] [role="combobox"]')
        .should('be.focused')
        .type('ma')

      cy.get('[role="option"]')
        .should('have.length', 1)
        .and('contain.text', 'Mango')
    })
  })

  describe('shared labeling contract', () => {
    it('renders label and links it to the input via for/id', () => {
      cy.mount(Combobox, {
        props: { options: fruits, label: 'Fruit' },
      })
      cy.get('[role="combobox"]').then(($input) => {
        const id = $input.attr('id')!
        cy.get(`label[for="${id}"]`).should('contain.text', 'Fruit')
      })
    })

    it('renders description and wires aria-describedby on input', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          label: 'Fruit',
          description: 'Type to filter.',
        },
      })
      cy.get('[role="combobox"]').then(($input) => {
        const id = $input.attr('id')!
        const describedBy = $input.attr('aria-describedby')!
        expect(describedBy).to.equal(`${id}-description`)
        cy.get(`#${id}-description`).should('contain.text', 'Type to filter.')
      })
    })

    it('renders error with aria-invalid + aria-errormessage and suppresses description', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          label: 'Fruit',
          description: 'helper',
          error: 'Required',
        },
      })
      cy.get('[role="combobox"]')
        .should('have.attr', 'aria-invalid', 'true')
        .then(($input) => {
          const id = $input.attr('id')!
          expect($input.attr('aria-errormessage')).to.equal(`${id}-error`)
          cy.get(`#${id}-error`).should('contain.text', 'Required')
          cy.get(`#${id}-description`).should('not.exist')
        })
    })

    it('renders required indicator and forwards aria-required', () => {
      cy.mount(Combobox, {
        props: { options: fruits, label: 'Fruit', required: true },
      })
      cy.get('[role="combobox"]').should('have.attr', 'aria-required', 'true')
      cy.contains('label', 'Fruit').within(() => {
        cy.get('span[aria-hidden="true"]').should('contain.text', '*')
      })
    })

    it('flips data-invalid on the trigger when error is set', () => {
      cy.mount(Combobox, {
        props: { options: fruits, label: 'Fruit', error: 'Required' },
      })
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'data-invalid',
        'true',
      )
    })

    it('button-mode trigger gets aria-invalid + data-invalid on error', () => {
      cy.mount(Combobox, {
        props: {
          options: fruits,
          label: 'Fruit',
          error: 'Required',
          trigger: 'button',
        },
      })
      cy.get('[data-slot="trigger"]')
        .should('have.attr', 'aria-invalid', 'true')
        .and('have.attr', 'data-invalid', 'true')
    })
  })
})
