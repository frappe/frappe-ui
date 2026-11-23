import Tooltip from './Tooltip.vue'
import TooltipProvider from './TooltipProvider.vue'
import Button from '../Button/Button.vue'
import { h, ref } from 'vue'

const Comp = () =>
  h(Tooltip, { text: 'some tooltip', hoverDelay: 0, side: 'top' }, [
    h(Button, {}, 'k'),
  ])

describe('Tooltip', () => {
  it('Renders', () => {
    cy.mount(Comp)

    cy.get('[data-reka-popper-content-wrapper]').should('not.exist')
    cy.get('button').should('have.attr', 'data-state', 'closed')

    cy.get('[role=tooltip]').should('not.exist')
    cy.get('button').trigger('focus')
    cy.get('[role=tooltip]').should('exist')

    cy.get('[role=tooltip]').should('have.text', 'some tooltip')
  })

  it('disabled prop', () => {
    cy.mount(
      h(Tooltip, { text: 'abc', disabled: true }, [h(Button, {}, 'k')]),
      { disabled: true },
    )

    cy.get('button').trigger('focus')
    cy.get('[role=tooltip]').should('not.exist')
  })

  it('#content renders inside the bubble and beats text', () => {
    cy.mount(h(Tooltip, { text: 'ignored', hoverDelay: 0 }), {
      slots: {
        default: h(Button, {}, 'k'),
        content: h('span', { 'data-cy': 'content' }, ['rich']),
      },
    })

    cy.get('button').trigger('focus')
    // Inside the bubble, so the consumer inherits the surface instead of
    // hand-copying its classes — which is what every #body call site did.
    cy.get('[data-slot=bubble]').find('[data-cy=content]').should('exist')
    cy.get('[data-slot=bubble]').should('not.contain.text', 'ignored')
  })

  it('bare drops the bubble shell but keeps the arrow', () => {
    cy.mount(h(Tooltip, { hoverDelay: 0, bare: true }), {
      slots: {
        default: h(Button, {}, 'k'),
        content: h('div', { 'data-cy': 'content' }, ['own surface']),
      },
    })

    cy.get('button').trigger('focus')
    cy.get('[data-cy=content]').should('exist')
    cy.get('[data-slot=bubble]').should('not.exist')
    cy.get('[data-slot=arrow]').should('exist')
  })

  it('exposes the arrow through a data-slot hook rather than a class prop', () => {
    cy.mount(h(Tooltip, { text: 'abc', hoverDelay: 0 }, [h(Button, {}, 'k')]))

    cy.get('button').trigger('focus')
    cy.get('[data-slot="arrow"]').should('exist')
  })

  it('offset moves the bubble away from the trigger', () => {
    cy.mount(
      h(Tooltip, { text: 'abc', hoverDelay: 0, offset: 24 }, [
        h(Button, {}, 'k'),
      ]),
    )

    cy.get('button').trigger('focus')
    cy.get('[data-slot="content"]').should('exist')
  })

  it('grouping under a shared TooltipProvider skips the re-delay between triggers', () => {
    // `disableHoverableContent` makes leaving the trigger close its tooltip,
    // which opens the provider's skip-delay window — the toolbar use case.
    const Group = () =>
      h(
        TooltipProvider,
        { hoverDelay: 500, skipDelay: 300, disableHoverableContent: true },
        () => [
          h(Tooltip, { text: 'First' }, () =>
            h('button', { 'data-cy': 'first' }, 'one'),
          ),
          h(Tooltip, { text: 'Second' }, () =>
            h('button', { 'data-cy': 'second' }, 'two'),
          ),
        ],
      )

    cy.clock()
    cy.mount(Group)

    // First trigger incurs the full hover delay before opening.
    cy.get('[data-cy=first]').trigger('pointermove')
    cy.get('[role=tooltip]').should('not.exist')
    cy.tick(500)
    cy.get('[role=tooltip]').should('have.text', 'First')
    cy.get('[data-cy=first]').should('have.attr', 'data-state', 'delayed-open')

    // Leaving closes it and opens the skip-delay window.
    cy.get('[data-cy=first]').trigger('pointerleave')

    // Moving to the neighbour opens instantly — no clock tick needed.
    cy.get('[data-cy=second]').trigger('pointermove')
    cy.get('[role=tooltip]').should('have.text', 'Second')
    cy.get('[data-cy=second]').should('have.attr', 'data-state', 'instant-open')
  })

  it('a standalone Tooltip still mounts its own provider (no grouping)', () => {
    // Without a surrounding provider every tooltip delays independently.
    cy.clock()
    cy.mount(
      h(Tooltip, { text: 'solo', hoverDelay: 500 }, () => h('button', 'k')),
    )

    cy.get('button').trigger('pointermove')
    cy.get('[role=tooltip]').should('not.exist')
    cy.tick(500)
    cy.get('button').should('have.attr', 'data-state', 'delayed-open')
  })

  describe('mounts the popup on the first hover or focus', () => {
    // Hosted in a bare div, so its child nodes show everything Tooltip renders.
    const host = (tooltip: ReturnType<typeof h>) => () =>
      h('div', { 'data-cy': 'host' }, [tooltip])
    const onlyTheTrigger = ($host: JQuery) =>
      expect($host[0].childNodes).to.have.length(1)

    it('renders only the trigger before, and opens on the first hover after the delay', () => {
      cy.clock()
      cy.mount(
        host(
          h(Tooltip, { text: 'Lazy', hoverDelay: 300 }, () => h('button', 'k')),
        ),
      )

      // No reka root, no portal anchors, no wrapper element.
      cy.get('[data-cy=host]').should(onlyTheTrigger)
      cy.get('button')
        .should('have.attr', 'data-state', 'closed')
        .and('have.attr', 'data-slot', 'trigger')

      // Touch never hovers, so it mounts nothing.
      cy.get('button').trigger('pointermove', { pointerType: 'touch' })
      cy.get('[data-cy=host]').should(onlyTheTrigger)

      cy.get('button').trigger('pointermove', { pointerType: 'mouse' })
      cy.tick(299)
      cy.get('[role=tooltip]').should('not.exist')
      cy.tick(1)
      cy.get('[role=tooltip]').should('have.text', 'Lazy')
      cy.get('[role=tooltip]').then(($tip) => {
        cy.get('button').should(
          'have.attr',
          'aria-describedby',
          $tip.attr('id'),
        )
      })
    })

    for (const exit of ['within the document', 'outside the viewport']) {
      it(`cancels the first hover when the pointer moves ${exit}`, () => {
        const shells = new Set<EventTarget>()
        const listeners = missedBoundaryListeners(shells)
        const skipDocumentLeave = (event: PointerEvent) => {
          if (event.target === event.currentTarget) {
            event.stopImmediatePropagation()
          }
        }

        cy.clock()
        cy.mount(() =>
          h('div', { ...listeners, style: { display: 'flex', gap: '12px' } }, [
            ...Array.from({ length: 6 }, (_, i) =>
              h(Tooltip, { text: `Tooltip ${i}`, hoverDelay: 800 }, () =>
                h('button', { 'data-cy': `trigger-${i}` }, `Button ${i}`),
              ),
            ),
            h('span', { 'data-cy': 'outside' }, 'Outside the triggers'),
          ]),
        )
        cy.get('[data-cy^=trigger-]')
          .should('have.length', 6)
          .then(($triggers) => {
            for (const trigger of $triggers.toArray()) shells.add(trigger)
          })

        if (exit === 'outside the viewport') {
          cy.document().then((doc) => {
            doc.addEventListener('pointerleave', skipDocumentLeave, true)
          })
        }
        movePointerTo('[data-cy=outside]')
        for (let i = 0; i < 6; i++) movePointerTo(`[data-cy=trigger-${i}]`)
        if (exit === 'outside the viewport') {
          movePointerOut()
          cy.document().then((doc) => {
            doc.removeEventListener('pointerleave', skipDocumentLeave, true)
          })
        } else {
          movePointerTo('[data-cy=outside]')
        }

        cy.tick(800)
        cy.get('[role=tooltip]').should('not.exist')

        movePointerTo('[data-cy=trigger-0]')
        cy.tick(800)
        cy.get('[role=tooltip]').should('have.text', 'Tooltip 0')
        movePointerOut()
      })
    }

    it('releases the handoff listener when the mounted trigger is disabled', () => {
      const shells = new Set<EventTarget>()
      const disabled = ref(false)
      let spy: ReturnType<typeof cy.spy>
      let handoffSignal: AbortSignal

      cy.clock()
      cy.mount(() =>
        h('div', missedBoundaryListeners(shells), [
          h(Tooltip, { text: 'Lazy', disabled: disabled.value }, () =>
            h('button', { 'data-cy': 'trigger-0' }, 'Trigger'),
          ),
          h('span', { 'data-cy': 'outside' }, 'Outside the trigger'),
        ]),
      )
      cy.get('[data-cy=trigger-0]').then(($trigger) => {
        shells.add($trigger[0])
        spy = cy.spy($trigger[0].ownerDocument, 'addEventListener')
      })
      movePointerTo('[data-cy=outside]')
      movePointerTo('[data-cy=trigger-0]')
      cy.then(() => {
        const handoff = spy
          .getCalls()
          .find(
            ({ args: [type, , options] }) =>
              type === 'pointermove' && options?.capture && options?.signal,
          )
        expect(handoff, 'pointer handoff armed').to.exist
        handoffSignal = handoff!.args[2].signal
        expect(handoffSignal.aborted).to.equal(false)
        disabled.value = true
      })
      cy.get('[data-cy=trigger-0]').should('not.have.attr', 'data-state')
      cy.then(() => expect(handoffSignal.aborted).to.equal(true))
      movePointerOut()
    })

    it('opens on the first keyboard focus and keeps focus on the trigger', () => {
      cy.mount(
        host(
          h(Tooltip, { text: 'Lazy', hoverDelay: 500 }, () =>
            h(Button, {}, () => 'k'),
          ),
        ),
      )

      cy.get('[data-cy=host]').should(onlyTheTrigger)
      cy.get('button').focus()
      cy.get('[role=tooltip]').should('have.text', 'Lazy')
      // Mounting replaced the button element, and focus moved with it.
      cy.focused().should('have.attr', 'data-slot', 'trigger')
    })

    it('keeps focus and typing in a field inside the trigger', () => {
      const text = ref('hello')
      cy.mount(
        host(
          h(Tooltip, { text: 'Lazy' }, () =>
            h('div', [
              h('input', {
                value: text.value,
                onInput: (e: Event) =>
                  (text.value = (e.target as HTMLInputElement).value),
              }),
            ]),
          ),
        ),
      )

      // Focus on a descendant mounts the tooltip but, as in reka, does not open it.
      cy.get('input').focus()
      cy.get('[data-cy=host]').should(($host) =>
        expect($host[0].childNodes.length).to.be.greaterThan(1),
      )
      cy.focused().should('match', 'input')
      cy.focused().type(' world')
      cy.get('input').should('have.value', 'hello world')
      cy.get('[role=tooltip]').should('not.exist')
    })
  })
})

function missedBoundaryListeners(shells: Set<EventTarget>) {
  function ignoreReplacementBoundary(event: PointerEvent) {
    // Simulate the missing native boundary even when Chromium recognizes
    // the replacement before the next move.
    const target = event.target as HTMLElement | null
    if (
      event.isTrusted &&
      target?.dataset?.cy?.startsWith('trigger-') &&
      !shells.has(target)
    ) {
      event.stopPropagation()
    }
  }

  return {
    onPointerenterCapture: ignoreReplacementBoundary,
    onPointerleaveCapture: ignoreReplacementBoundary,
  }
}

function movePointerTo(selector: string) {
  cy.get(selector).then(($el) => {
    // CDP uses runner coordinates, which include the scaled app iframe.
    const frame = window.top!.document.querySelector('iframe.aut-iframe')!
    const frameRect = frame.getBoundingClientRect()
    const scale = frameRect.width / frame.clientWidth
    const rect = $el[0].getBoundingClientRect()
    return moveNativePointer(
      frameRect.left + (rect.left + rect.width / 2) * scale,
      frameRect.top + (rect.top + rect.height / 2) * scale,
    )
  })
}

function moveNativePointer(x: number, y: number) {
  return Cypress.automation('remote:debugger:protocol', {
    command: 'Input.dispatchMouseEvent',
    params: { type: 'mouseMoved', x, y },
  })
}

function movePointerOut() {
  cy.then(() => moveNativePointer(-10, -10))
}
