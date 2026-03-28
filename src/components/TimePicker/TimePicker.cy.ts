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
    cy.get('[data-index="2"]').click()

    cy.get('[data-index="2"]').then((x) => {
      cy.get('input').should('have.value', x.text())
    })
  })

  it('emit events', () => {
    const onUpdate = cy.spy().as('onUpdate')
    const onChange = cy.spy().as('onChange')
    const onInputInvalid = cy.spy().as('onInputInvalid')
    const onInvalidChange = cy.spy().as('onInvalidChange')
    const onOpen = cy.spy().as('onOpen')
    const onClose = cy.spy().as('onClose')

    cy.mount(TimePicker, {
      props: {
        'onUpdate:modelValue': onUpdate,
        onChange: onChange,
        onInputInvalid: onInputInvalid,
        onInvalidChange: onInvalidChange,
        onOpen: onOpen,
        onClose: onClose,
        use12Hour: false,
      },
    })

    cy.get('@onOpen').should('not.have.been.called')
    cy.get('input').click()
    cy.get('@onOpen').should('have.been.called')
    cy.get('[data-index="0"]').click()

    cy.get('@onClose').should('have.been.called')

    cy.get('input').then((x) => {
      const tm = x.val()
      cy.get('@onUpdate').should('have.been.calledWith', tm)
      cy.get('@onChange').should('have.been.calledWith', tm)
    })
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

  it('autoclose prop', () => {
    cy.mount(TimePicker)
    cy.get('input').click()
    cy.get('[role=option]').eq(0).click()
    cy.get('[role=dialog]').should('not.exist')

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
})
