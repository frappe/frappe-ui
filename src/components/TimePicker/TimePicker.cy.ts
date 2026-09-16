import { h } from 'vue'
import TimePicker from './TimePicker.vue'

// TimePicker declares its `#suffix` slot props inline rather than in `types.ts`,
// so the shape is mirrored here.
type SuffixSlotProps = {
  open: boolean
  disabled: boolean
  setOpen: (value: boolean) => void
  close: () => void
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

  // INP-Q3: `open` and `close` are gone. `update:open` carries both, with the
  // state in the payload, so the open and the close are two calls on one spy.
  it('emit events', () => {
    const onUpdate = cy.spy().as('onUpdate')
    const onChange = cy.spy().as('onChange')
    const onUpdateOpen = cy.spy().as('onUpdateOpen')

    cy.mount(TimePicker, {
      props: {
        'onUpdate:modelValue': onUpdate,
        onChange: onChange,
        'onUpdate:open': onUpdateOpen,
      },
    })

    cy.get('@onUpdateOpen').should('not.have.been.called')
    cy.get('input').click()
    cy.get('@onUpdateOpen').should('have.been.calledWith', true)
    cy.get('[role=option]').eq(0).click()

    cy.get('@onUpdateOpen').should('have.been.calledWith', false)

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

  it('formats options with a zero-padded 12-hour format and emits canonical values', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(TimePicker, {
      props: { format: 'hh:mm A', 'onUpdate:modelValue': onUpdate },
    })

    cy.get('input').click()
    cy.get('[role=option]').eq(0).should('have.text', '12:00 AM')
    cy.get('[role=option]').eq(0).click()
    cy.get('input').should('have.value', '12:00 AM')
    cy.get('@onUpdate').should('have.been.calledWith', '00:00')
  })

  it('formats options with a non-padded 12-hour format and emits canonical values', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(TimePicker, {
      props: {
        format: 'h:mm A',
        interval: 60,
        'onUpdate:modelValue': onUpdate,
      },
    })

    cy.get('input').click()
    cy.get('[role=option][data-value="15:00"]').should('have.text', '3:00 PM')
    cy.get('[role=option][data-value="15:00"]').click()
    cy.get('input').should('have.value', '3:00 PM')
    cy.get('@onUpdate').should('have.been.calledWith', '15:00')
  })

  it('renders seconds in display and option labels when the format includes seconds', () => {
    cy.mount(TimePicker, {
      props: { modelValue: '14:30:15', format: 'HH:mm:ss' },
    })

    cy.get('input').should('have.value', '14:30:15')
    cy.get('input').click()
    cy.get('[role=option]').eq(0).should('have.text', '00:00:00')
  })

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

  // INP-Q3 removed `input-invalid` and `invalid-change`. The revert of rejected
  // text to the last valid value is the only signal left, so it is now the only
  // thing the user has. It is asserted after a typed change, not just after the
  // initial prop, so a stale "last valid" value would fail here.
  it('invalid typed input reverts to the last valid value', () => {
    const onUpdate = cy.spy().as('onUpdate')
    const onInputInvalid = cy.spy().as('onInputInvalid')
    const onInvalidChange = cy.spy().as('onInvalidChange')

    cy.mount(TimePicker, {
      props: {
        modelValue: '08:00',
        format: 'HH:mm:ss',
        'onUpdate:modelValue': onUpdate,
        'onInput-invalid': onInputInvalid,
        'onInvalid-change': onInvalidChange,
      },
    })
    cy.get('input').click()
    cy.get('input').type('25:99:99{enter}')
    cy.get('input').should('have.value', '08:00:00')
    cy.get('@onUpdate').should('not.have.been.called')

    cy.get('input').clear()
    cy.get('input').type('15:30:45{enter}')
    cy.get('input').should('have.value', '15:30:45')

    cy.get('input').click()
    cy.get('input').clear()
    cy.get('input').type('nonsense{enter}')
    cy.get('input').should('have.value', '15:30:45')
    cy.get('@onUpdate').should('have.been.calledOnce')

    cy.get('@onInputInvalid').should('not.have.been.called')
    cy.get('@onInvalidChange').should('not.have.been.called')
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
    it('exposes open and setOpen to the #suffix slot', () => {
      cy.mount(TimePicker, {
        props: { modelValue: '10:00:00' },
        slots: {
          suffix: ({ open, setOpen }: SuffixSlotProps) =>
            h(
              'button',
              {
                'data-cy': 'suffix',
                class: open ? 'is-open' : 'is-closed',
                onMousedown: (e: MouseEvent) => {
                  e.preventDefault()
                  setOpen(!open)
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

    it('setOpen sets the open state when passed a boolean', () => {
      // Same signature as Popover's `setOpen`: a boolean sets, a bare call
      // flips. Called directly, since a click also dismisses the popover.
      let setOpen: SuffixSlotProps['setOpen'] | null = null

      cy.mount(TimePicker, {
        props: { modelValue: '10:00:00' },
        slots: {
          suffix: (props: SuffixSlotProps) => {
            setOpen = props.setOpen
            return h('span', { 'data-cy': 'suffix' })
          },
        },
      })

      cy.then(() => setOpen?.(true))
      cy.get('[role=dialog]').should('exist')

      // A flip would close it here. Setting must be idempotent.
      cy.then(() => setOpen?.(true))
      cy.get('[role=dialog]').should('exist')

      cy.then(() => setOpen?.(false))
      cy.get('[role=dialog]').should('not.exist')
    })
  })

  // INP-Q5 / INP-Q10 (ADR-0012).
  describe('template ref and picker hooks', () => {
    it('open() and close() drive the popover', () => {
      let vm: any
      cy.mount(TimePicker).then((mounted: any) => {
        vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
      })

      cy.get('[role=listbox]').should('not.exist')
      cy.then(() => vm?.open?.())
      cy.get('[role=listbox]').should('exist')
      cy.then(() => vm?.close?.())
      cy.get('[role=listbox]').should('not.exist')
    })

    it('open() is a no-op while disabled', () => {
      let vm: any
      cy.mount(TimePicker, { props: { disabled: true } }).then(
        (mounted: any) => {
          vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
        },
      )

      cy.then(() => vm?.open?.())
      cy.get('[role=listbox]').should('not.exist')
    })

    it('focus() focuses the trigger input', () => {
      cy.mount(TimePicker).then((mounted: any) => {
        const vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
        vm?.focus?.()
      })

      cy.get('input').should('be.focused')
    })

    it('marks the input and the chevron with the picker hooks', () => {
      cy.mount(TimePicker)

      cy.get('input')
        .should('have.attr', 'data-slot', 'control')
        .and('have.attr', 'role', 'combobox')
        .and('have.attr', 'aria-haspopup', 'listbox')
        .and('have.attr', 'aria-expanded', 'false')
      cy.get('[data-slot="chevron"]').should('exist')
      // INP-Q10: a picker's input is a `control`, not a `trigger`. The
      // `trigger` marker belongs to Popover's own wrapper, so assert the input
      // itself never carries it.
      cy.get('input').should('not.have.attr', 'data-slot', 'trigger')

      cy.get('input').click()
      cy.get('input').should('have.attr', 'aria-expanded', 'true')
    })

    it('points aria-controls at the open listbox', () => {
      cy.mount(TimePicker)

      cy.get('input').should('not.have.attr', 'aria-controls')

      cy.get('input').click()
      cy.get('input')
        .invoke('attr', 'aria-controls')
        .should('be.a', 'string')
        .then((panelId) => {
          cy.get(`#${panelId}`).should('have.attr', 'role', 'listbox')
        })
    })

    it('keeps aria-activedescendant on the input, not on the listbox', () => {
      cy.mount(TimePicker)

      cy.get('input').click()
      cy.get('input').type('{downarrow}')

      cy.get('[role=listbox]').should('not.have.attr', 'aria-activedescendant')
      cy.get('input')
        .invoke('attr', 'aria-activedescendant')
        .should('be.a', 'string')
        .then((optionId) => {
          cy.get(`#${optionId}`).should('have.attr', 'role', 'option')
        })
    })

    it('drops aria-activedescendant when the listbox closes', () => {
      cy.mount(TimePicker)

      cy.get('input').click()
      cy.get('input').type('{downarrow}')
      cy.get('input').should('have.attr', 'aria-activedescendant')

      // The options unmount with the panel, so the reference would dangle.
      cy.get('input').type('{esc}')
      cy.get('[role=listbox]').should('not.exist')
      cy.get('input').should('not.have.attr', 'aria-activedescendant')
      cy.get('input').should('not.have.attr', 'aria-controls')
    })
  })

  // A parent that mounts a picker with `open` already true gets an open panel.
  // The prop is only watched for changes, so the initial value used to be
  // dropped (plans/001, step 1).
  describe('initial open state', () => {
    it('mounts open when `open` starts true', () => {
      cy.mount(TimePicker, { props: { modelValue: '22:00', open: true } })

      cy.get('[role=listbox]').should('exist')
      cy.get('input').should('have.value', '22:00')
      // The bound option is marked, and the list is scrolled to it rather than
      // left at the top of the day.
      cy.get('[role=option][aria-selected=true]').should('have.text', '22:00')
      cy.get('[data-slot="content-body"]').should(($panel) => {
        expect($panel[0].scrollTop).to.be.greaterThan(0)
      })
      // A panel that is merely displayed is not open: the trigger has to point
      // at it too.
      cy.get('input').should('have.attr', 'aria-expanded', 'true')
      cy.get('input')
        .invoke('attr', 'aria-controls')
        .should('be.a', 'string')
        .then((panelId) => {
          cy.get(`#${panelId}`).should('have.attr', 'role', 'listbox')
        })
    })

    it('stays closed when `open` starts false', () => {
      cy.mount(TimePicker, { props: { modelValue: '22:00', open: false } })
      cy.get('[role=listbox]').should('not.exist')
      cy.get('input').should('have.attr', 'aria-expanded', 'false')
    })

    it('stays closed when `open` is omitted', () => {
      cy.mount(TimePicker, { props: { modelValue: '22:00' } })
      cy.get('[role=listbox]').should('not.exist')
    })

    it('follows the parent from false to true and back', () => {
      cy.mount(TimePicker, {
        props: { modelValue: '22:00', open: false },
      }).then(({ wrapper }) => {
        cy.get('[role=listbox]').should('not.exist')
        cy.then(() => wrapper.setProps({ open: true }))
        cy.get('[role=listbox]').should('exist')
        cy.then(() => wrapper.setProps({ open: false }))
        cy.get('[role=listbox]').should('not.exist')
      })
    })

    it('still opens from the trigger with no `open` bound', () => {
      cy.mount(TimePicker, { props: { modelValue: '22:00' } })
      cy.get('input').click()
      cy.get('[role=listbox]').should('exist')
    })

    it('emits no `update:open` while mounting open', () => {
      cy.mount(TimePicker, {
        props: {
          modelValue: '22:00',
          open: true,
          'onUpdate:open': cy.spy().as('onUpdateOpen'),
        },
      })

      cy.get('[role=listbox]').should('exist')
      cy.get('@onUpdateOpen').should('not.have.been.called')

      // The first emit is the picker's own close, so nothing looped on mount.
      cy.get('[role=option]').eq(0).click()
      cy.get('[role=listbox]').should('not.exist')
      cy.get('@onUpdateOpen').should('have.been.calledOnceWith', false)
    })
  })
})
