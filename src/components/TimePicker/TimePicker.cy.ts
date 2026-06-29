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

  it('defaults to 24-hour HH:mm display', () => {
    cy.mount(TimePicker, {
      props: { modelValue: '14:30' },
    })

    cy.get('input').should('have.value', '14:30')
    cy.get('input').click()
    cy.get('[role=option]').eq(0).should('have.text', '00:00')
  })

  it(
    'formats options with a zero-padded 12-hour format and emits canonical values',
    () => {
      const onUpdate = cy.spy().as('onUpdate')

      cy.mount(TimePicker, {
        props: { format: 'hh:mm A', 'onUpdate:modelValue': onUpdate },
      })

      cy.get('input').click()
      cy.get('[role=option]').eq(0).should('have.text', '12:00 AM')
      cy.get('[role=option]').eq(0).click()
      cy.get('input').should('have.value', '12:00 AM')
      cy.get('@onUpdate').should('have.been.calledWith', '00:00')
    },
  )

  it(
    'formats options with a non-padded 12-hour format and emits canonical values',
    () => {
      const onUpdate = cy.spy().as('onUpdate')

      cy.mount(TimePicker, {
        props: {
          format: 'h:mm A',
          interval: 60,
          'onUpdate:modelValue': onUpdate,
        },
      })

      cy.get('input').click()
      cy.get('[role=option][data-value="15:00"]').should(
        'have.text',
        '3:00 PM',
      )
      cy.get('[role=option][data-value="15:00"]').click()
      cy.get('input').should('have.value', '3:00 PM')
      cy.get('@onUpdate').should('have.been.calledWith', '15:00')
    },
  )

  it('back-compat: use12Hour=true maps to 12-hour display when format is omitted', () => {
    cy.mount(TimePicker, {
      props: { modelValue: '15:00', use12Hour: true },
    })

    cy.get('input').should('have.value', '3:00 PM')
    cy.get('input').click()
    cy.get('[role=option][data-value="15:00"]').should('have.text', '3:00 PM')
  })

  it('format prop takes precedence over the deprecated use12Hour alias', () => {
    cy.mount(TimePicker, {
      props: { modelValue: '15:00', use12Hour: true, format: 'HH:mm' },
    })

    cy.get('input').should('have.value', '15:00')
  })

  it(
    'renders seconds in display and option labels when the format includes seconds',
    () => {
      cy.mount(TimePicker, {
        props: { modelValue: '14:30:15', format: 'HH:mm:ss' },
      })

      cy.get('input').should('have.value', '14:30:15')
      cy.get('input').click()
      cy.get('[role=option]').eq(0).should('have.text', '00:00:00')
    },
  )

  it('min and max props', () => {
    cy.mount(TimePicker, {
      props: { min: '09:00', max: '11:00' },
    })

    cy.get('input').click()
    cy.get('[role=option]:first').should('have.text', '09:00')
    cy.get('[role=option]:last').should('have.text', '11:00')
  })

  it('back-compat: minTime/maxTime aliases still work', () => {
    cy.mount(TimePicker, {
      props: { minTime: '09:00', maxTime: '11:00' },
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

  it('parses flexible time input like "3pm" using the configured format', () => {
    cy.mount(TimePicker, { props: { format: 'hh:mm A' } })
    cy.get('input').click()
    cy.get('input').type('3pm{enter}')
    cy.get('input').should('have.value', '03:00 PM')
  })

  it('parses typed input in the configured 12-hour format', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(TimePicker, {
      props: { format: 'hh:mm A', 'onUpdate:modelValue': onUpdate },
    })
    cy.get('input').click()
    cy.get('input').type('03:45 PM{enter}')
    cy.get('input').should('have.value', '03:45 PM')
    cy.get('@onUpdate').should('have.been.calledWith', '15:45')
  })

  it('parses typed input with seconds in the configured format', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(TimePicker, {
      props: { format: 'HH:mm:ss', 'onUpdate:modelValue': onUpdate },
    })
    cy.get('input').click()
    cy.get('input').type('15:30:45{enter}')
    cy.get('input').should('have.value', '15:30:45')
    cy.get('@onUpdate').should('have.been.calledWith', '15:30:45')
  })

  it('preserves typed seconds in localized Dayjs formats', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(TimePicker, {
      props: { format: 'LTS', 'onUpdate:modelValue': onUpdate },
    })
    cy.get('input').click()
    cy.get('input').type('8:02:18 PM{enter}')
    cy.get('input').should('have.value', '8:02:18 PM')
    cy.get('@onUpdate').should('have.been.calledWith', '20:02:18')
  })

  it('invalid typed input does not corrupt the model value', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(TimePicker, {
      props: {
        modelValue: '08:00',
        format: 'HH:mm:ss',
        'onUpdate:modelValue': onUpdate,
      },
    })
    cy.get('input').click()
    cy.get('input').type('25:99:99{enter}')
    cy.get('input').should('have.value', '08:00:00')
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('off-grid typed time gets a formatted label', () => {
    cy.mount(TimePicker, { props: { format: 'hh:mm A', interval: 15 } })
    cy.get('input').click()
    cy.get('input').type('3:07pm{enter}')
    cy.get('input').should('have.value', '03:07 PM')
  })
})
