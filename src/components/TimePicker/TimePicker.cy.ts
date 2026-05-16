import TimePicker from './TimePicker.vue'

describe('TimePicker', () => {
  it('renders', () => {
    cy.mount(TimePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('select option', () => {
    cy.mount(TimePicker)

    cy.get('input').click()
    cy.get('[role=option]')
      .eq(2)
      .invoke('text')
      .then((label) => {
        cy.get('[role=option]').eq(2).click()
        cy.get('input').should('have.value', label.trim())
      })
  })

  it('emit events', () => {
    const onUpdate = cy.spy().as('onUpdate')
    const onChange = cy.spy().as('onChange')
    const onOpen = cy.spy().as('onOpen')
    const onClose = cy.spy().as('onClose')

    cy.mount(TimePicker, {
      props: {
        'onUpdate:modelValue': onUpdate,
        onChange: onChange,
        onOpen: onOpen,
        onClose: onClose,
        use12Hour: false,
      },
    })

    cy.get('@onOpen').should('not.have.been.called')
    cy.get('input').click()
    cy.get('@onOpen').should('have.been.called')
    cy.get('[role=option]').eq(0).click()

    cy.get('@onClose').should('have.been.called')

    cy.get('@onUpdate').should('have.been.calledWith', '00:00')
    cy.get('@onChange').should('have.been.calledWith', '00:00')
  })

  it('custom options', () => {
    const options = [
      { value: '08:00' },
      { value: '09:00' },
      { value: '09:30' },
      { value: '10:00' },
      { value: '11:15' },
      { value: '13:45' },
    ]

    cy.mount(TimePicker, {
      props: { options: options },
    })

    cy.get('input').click()
    cy.get('[role=option]').should('have.length', options.length)
  })

  it('autoclose default closes popover after selection', () => {
    cy.mount(TimePicker)
    cy.get('input').click()
    cy.get('[role=option]').eq(0).click()
    cy.get('[role=dialog]').should('not.exist')
  })

  it('back-compat: autoClose=false keeps popover open after selection', () => {
    cy.mount(TimePicker, {
      props: { autoClose: false },
    })
    cy.get('input').click()
    cy.get('[role=option]').eq(0).click()
    cy.get('[role=dialog]').should('exist')
  })

  it('use12hour prop', () => {
    cy.mount(TimePicker, {
      props: { use12Hour: true },
    })

    cy.get('input').click()
    cy.get('[role=option]').eq(0).should('contain.text', 'am')

    cy.mount(TimePicker, {
      props: { use12Hour: false },
    })

    cy.get('input').click()
    cy.get('[role=option]').eq(0).should('not.contain.text', 'am')
  })

  it('minTime and maxTime props', () => {
    cy.mount(TimePicker, {
      props: { minTime: '09:00', maxTime: '11:00', use12Hour: false },
    })

    cy.get('input').click()
    cy.get('[role=option]:first').should('have.text', '09:00')
    cy.get('[role=option]:last').should('have.text', '11:00')
  })

  it('disabled', () => {
    cy.mount(TimePicker, {
      props: { disabled: true },
    })
    cy.get('input').should('have.attr', 'disabled')
  })

  it('keepOpen prop keeps popover open after selection', () => {
    cy.mount(TimePicker, { props: { keepOpen: true } })
    cy.get('input').click()
    cy.get('[role=option]').eq(0).click()
    cy.get('[role=dialog]').should('exist')
  })

  it('readonly prop prevents typing but still opens popover', () => {
    cy.mount(TimePicker, { props: { readonly: true } })
    cy.get('input').should('have.attr', 'readonly')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('side and align props are accepted (smoke test)', () => {
    cy.mount(TimePicker, { props: { side: 'bottom', align: 'end' } })
    cy.get('input').click()
    cy.get('[role=dialog]')
      .should('exist')
      .should('have.attr', 'data-align', 'end')
  })

  it('back-compat: placement is accepted in lieu of side+align', () => {
    cy.mount(TimePicker, { props: { placement: 'bottom-end' } })
    cy.get('input').click()
    cy.get('[role=dialog]')
      .should('exist')
      .should('have.attr', 'data-align', 'end')
  })

  it('back-compat: allowCustom=false behaves like readonly', () => {
    cy.mount(TimePicker, { props: { allowCustom: false } })
    cy.get('input').should('have.attr', 'readonly')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('parses flexible time input like "3pm"', () => {
    cy.mount(TimePicker, { props: { use12Hour: true } })
    cy.get('input').click()
    cy.get('input').type('3pm{enter}')
    // Figure space (U+2007) pads single-digit hours for column alignment.
    cy.get('input').should('have.value', '03:00 pm')
  })

  it('off-grid typed time gets a formatted label', () => {
    cy.mount(TimePicker, { props: { use12Hour: true, interval: 15 } })
    cy.get('input').click()
    cy.get('input').type('3:07pm{enter}')
    cy.get('input').should('have.value', '03:07 pm')
  })
})
