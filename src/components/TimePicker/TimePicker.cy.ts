import { h } from 'vue'
import TimePicker from './TimePicker.vue'

// TimePicker declares its `#suffix` slot props inline rather than in `types.ts`,
// so the shape is mirrored here.
type SuffixSlotProps = {
  open: boolean
  toggle: (flag?: boolean | Event) => void
}

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

  it('typeable: false prevents typing but still opens popover', () => {
    cy.mount(TimePicker, { props: { typeable: false } })
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

  describe('#suffix slot props', () => {
    // TimePicker has no `#trigger`; `#suffix` is where it hands out the same
    // two names as the date pickers and Popover. A rename here is silent.
    it('exposes open and toggle to the #suffix slot', () => {
      cy.mount(TimePicker, {
        props: { modelValue: '10:00:00' },
        slots: {
          suffix: ({ open, toggle }: SuffixSlotProps) =>
            h(
              'button',
              {
                'data-cy': 'suffix',
                class: open ? 'is-open' : 'is-closed',
                onMousedown: (e: MouseEvent) => {
                  e.preventDefault()
                  toggle()
                },
              },
              open ? 'Close' : 'Open',
            ),
        },
      })

      cy.get('[data-cy="suffix"]')
        .should('have.class', 'is-closed')
        .and('have.text', 'Open')
      cy.get('[role=dialog]').should('not.exist')

      cy.get('[data-cy="suffix"]').click()
      cy.get('[role=dialog]').should('exist')
      cy.get('[data-cy="suffix"]')
        .should('have.class', 'is-open')
        .and('have.text', 'Close')
    })

    it('toggle sets the open state when passed a boolean', () => {
      // Same signature as Popover's `toggle`: a boolean sets, a bare call
      // flips. Called directly, since a click also dismisses the popover.
      let toggle: SuffixSlotProps['toggle'] | null = null

      cy.mount(TimePicker, {
        props: { modelValue: '10:00:00' },
        slots: {
          suffix: (props: SuffixSlotProps) => {
            toggle = props.toggle
            return h('span', { 'data-cy': 'suffix' })
          },
        },
      })

      cy.then(() => toggle?.(true))
      cy.get('[role=dialog]').should('exist')

      // A flip would close it here. Setting must be idempotent.
      cy.then(() => toggle?.(true))
      cy.get('[role=dialog]').should('exist')

      cy.then(() => toggle?.(false))
      cy.get('[role=dialog]').should('not.exist')

      // A bare call still flips.
      cy.then(() => toggle?.())
      cy.get('[role=dialog]').should('exist')
    })
  })
})
