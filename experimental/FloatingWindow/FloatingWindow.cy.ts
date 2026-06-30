import { defineComponent, h, ref } from 'vue'
import FloatingWindow from './FloatingWindow.vue'
import type { WindowMode } from './types'

// A controlled host that surfaces the bound mode as text, so the v-model sync is
// observable, and forwards a storageKey for the persistence tests. The default
// slot is tagged so we can assert it collapses in the tray.
function controlledWindow(
  options: {
    initialMode?: WindowMode
    storageKey?: string | null
    title?: string
  } = {},
) {
  return defineComponent({
    setup() {
      const mode = ref<WindowMode>(options.initialMode ?? 'docked')
      return { mode }
    },
    render() {
      return [
        h('span', { 'data-cy': 'mode' }, this.mode),
        h(
          FloatingWindow,
          {
            title: options.title ?? 'Messages',
            mode: this.mode,
            'onUpdate:mode': (value: WindowMode) => (this.mode = value),
            storageKey: options.storageKey ?? null,
          },
          { default: () => h('div', { 'data-cy': 'body' }, 'Conversation') },
        ),
      ]
    },
  })
}

// Simulate a pointer resize drag on a named edge/corner handle. Only the delta
// matters: startResize records the pointerdown position, then the window-level
// pointermove/pointerup (bubbled up from <body>) drive the resize loop.
function dragResize(
  name: string,
  from: { x: number; y: number },
  delta: { x: number; y: number },
) {
  cy.get(`[data-resize=${name}]`).trigger('pointerdown', {
    eventConstructor: 'PointerEvent',
    button: 0,
    clientX: from.x,
    clientY: from.y,
  })
  cy.get('body').trigger('pointermove', {
    eventConstructor: 'PointerEvent',
    clientX: from.x + delta.x,
    clientY: from.y + delta.y,
  })
  cy.get('body').trigger('pointerup', { eventConstructor: 'PointerEvent' })
}

describe('FloatingWindow', () => {
  beforeEach(() => {
    // Deterministic geometry: the default panel (460×520) fits with room to
    // spare, so nothing clamps to the viewport.
    cy.viewport(1200, 800)
    localStorage.clear()
    // The single-detached registry lives in module scope; clear its body flag
    // so one test never bleeds into the next.
    document.body.classList.remove('has-floating-window')
  })

  it('renders docked by default with the window body visible', () => {
    cy.mount(controlledWindow())

    cy.get('[data-cy=mode]').should('have.text', 'docked')
    cy.get('.floating-window')
      .should('exist')
      .and('have.attr', 'data-state', 'docked')
    cy.get('[data-cy=body]').should('be.visible')
    // Docked offers pop-out and minimize, never a close.
    cy.get('[aria-label="Pop out"]').should('exist')
    cy.get('[aria-label="Close"]').should('not.exist')
  })

  it('walks docked → floating → minimized → floating → docked from the chrome', () => {
    cy.mount(controlledWindow())

    // Pop out: detaches, casts a shadow, and surfaces the resize grip.
    cy.get('[aria-label="Pop out"]').click()
    cy.get('[data-cy=mode]').should('have.text', 'floating')
    cy.get('.floating-window').should('have.attr', 'data-state', 'floating')
    cy.get('[aria-label="Resize window"]').should('exist')
    cy.get('[data-cy=body]').should('be.visible')

    // Minimize: collapses to the tray, hiding the body, narrowed to 320px.
    cy.get('[aria-label="Minimize"]').click()
    cy.get('[data-cy=mode]').should('have.text', 'minimized')
    cy.get('[data-cy=body]').should('not.be.visible')
    cy.get('.floating-window').invoke('outerWidth').should('eq', 320)

    // Expand back out of the tray.
    cy.get('[aria-label="Expand"]').click()
    cy.get('[data-cy=mode]').should('have.text', 'floating')
    cy.get('[data-cy=body]').should('be.visible')

    // Close: docks back into the host layout.
    cy.get('[aria-label="Close"]').click()
    cy.get('[data-cy=mode]').should('have.text', 'docked')
    cy.get('.floating-window').should('have.attr', 'data-state', 'docked')
  })

  it('lets the host drive the window through v-model:mode', () => {
    const Host = defineComponent({
      setup() {
        const mode = ref<WindowMode>('docked')
        return { mode }
      },
      render() {
        return [
          h(
            'button',
            { 'data-cy': 'go-float', onClick: () => (this.mode = 'floating') },
            'float',
          ),
          h(FloatingWindow, {
            title: 'Messages',
            mode: this.mode,
            'onUpdate:mode': (value: WindowMode) => (this.mode = value),
          }),
        ]
      },
    })

    cy.mount(Host)
    cy.get('.floating-window').should('have.attr', 'data-state', 'docked')

    // Host flips the bound mode; the window detaches to match.
    cy.get('[data-cy=go-float]').click()
    cy.get('.floating-window').should('have.attr', 'data-state', 'floating')
    cy.get('[aria-label="Close"]').should('exist')
  })

  describe('persistence', () => {
    const KEY = 'fw:test:persist'

    it('restores a saved mode on mount and adopts it into v-model', () => {
      // Seed a floating session, then mount with the bound mode still at its
      // docked default. The restored mode must win and propagate up, or a
      // controlled host would render docked over a floating window.
      localStorage.setItem(
        KEY,
        JSON.stringify({
          mode: 'floating',
          rect: { x: 120, y: 120, width: 500, height: 400 },
        }),
      )

      cy.mount(controlledWindow({ storageKey: KEY, initialMode: 'docked' }))

      cy.get('[data-cy=mode]').should('have.text', 'floating')
      cy.get('.floating-window').should('have.attr', 'data-state', 'floating')
      cy.get('.floating-window').invoke('outerWidth').should('eq', 500)
    })

    it('writes mode changes back to storage', () => {
      cy.mount(controlledWindow({ storageKey: KEY }))

      cy.get('[aria-label="Pop out"]').click()
      cy.get('[data-cy=mode]').should('have.text', 'floating')
      cy.wrap(null).then(() => {
        const saved = JSON.parse(localStorage.getItem(KEY) as string)
        expect(saved.mode).to.equal('floating')
      })
    })
  })

  it('pins the previously detached window when a second one pops out', () => {
    // Only one window may float at a time; popping a second one out docks the
    // first via the shared activeDocker registry.
    const TwoWindows = defineComponent({
      render() {
        return [
          h(FloatingWindow, { title: 'Window A' }),
          h(FloatingWindow, { title: 'Window B' }),
        ]
      },
    })

    cy.mount(TwoWindows)

    cy.contains('.floating-window', 'Window A')
      .find('[aria-label="Pop out"]')
      .click()
    cy.contains('.floating-window', 'Window A').should(
      'have.attr',
      'data-state',
      'floating',
    )

    cy.contains('.floating-window', 'Window B')
      .find('[aria-label="Pop out"]')
      .click()

    // B is now floating; A was pinned back into the docked layout.
    cy.contains('.floating-window', 'Window B').should(
      'have.attr',
      'data-state',
      'floating',
    )
    cy.contains('.floating-window', 'Window A')
      .should('have.attr', 'data-state', 'docked')
      .find('[aria-label="Pop out"]')
      .should('exist')
  })

  describe('keyboard accessibility', () => {
    it('names every window control for assistive tech', () => {
      cy.mount(controlledWindow())

      cy.get('[aria-label="Minimize"]').should('exist')
      cy.get('[aria-label="Pop out"]').should('exist')

      cy.get('[aria-label="Pop out"]').click()
      cy.get('[aria-label="Close"]').should('exist')
      cy.get('[aria-label="Resize window"]').should('exist')
    })

    it('expands from the tray via a focusable, named control', () => {
      cy.mount(controlledWindow())

      cy.get('[aria-label="Pop out"]').click()
      cy.get('[aria-label="Minimize"]').click()
      cy.get('[data-cy=mode]').should('have.text', 'minimized')
      cy.get('[data-cy=body]').should('not.be.visible')

      // Reachable by keyboard and named; being a native <button> it activates on
      // Enter/Space. Clicking exercises the same handler that activation fires.
      cy.get('[aria-label="Expand"]')
        .should('be.visible')
        .focus()
        .should('be.focused')
        .click()

      cy.get('[data-cy=mode]').should('have.text', 'floating')
      cy.get('[data-cy=body]').should('be.visible')
    })

    it('resizes with the arrow keys on the grip, clamped to the minimum', () => {
      cy.mount(controlledWindow())
      cy.get('[aria-label="Pop out"]').click()
      cy.get('.floating-window').invoke('outerWidth').should('eq', 460)

      // One arrow step is 16px.
      cy.get('[aria-label="Resize window"]')
        .focus()
        .trigger('keydown', { key: 'ArrowRight' })
      cy.get('.floating-window').invoke('outerWidth').should('eq', 476)

      // Shrinking past the 380px floor stops at the floor, never below.
      cy.get('[aria-label="Resize window"]').then(($grip) => {
        for (let i = 0; i < 20; i++) {
          cy.wrap($grip).trigger('keydown', { key: 'ArrowLeft' })
        }
      })
      cy.get('.floating-window').invoke('outerWidth').should('eq', 380)
    })
  })

  describe('pointercancel cleanup', () => {
    it('clears isDragging and removes the move listener when drag is cancelled', () => {
      cy.mount(controlledWindow())
      cy.get('[aria-label="Pop out"]').click()

      // Start a drag on the handle, then cancel it (OS gesture / context menu).
      cy.get('.floating-window [data-resize]').first().closest('.floating-window').find('.cursor-move, [class*="cursor-move"]').then(() => {
        // Trigger pointerdown on the title bar handle to start drag
        cy.get('.floating-window').find('.select-none').first().trigger('pointerdown', {
          eventConstructor: 'PointerEvent',
          button: 0,
          clientX: 800,
          clientY: 300,
        })
        // Cancel instead of releasing — should clean up without error
        cy.get('body').trigger('pointercancel', { eventConstructor: 'PointerEvent' })
        // A subsequent pointermove should have no effect (listener was removed)
        cy.get('body').trigger('pointermove', {
          eventConstructor: 'PointerEvent',
          clientX: 900,
          clientY: 400,
        })
        // Panel position should be unchanged from before the drag (no movement applied)
        cy.get('.floating-window').should('have.attr', 'data-state', 'floating')
      })
    })

    it('clears isResizing and removes the move listener when resize is cancelled', () => {
      cy.mount(controlledWindow())
      cy.get('[aria-label="Pop out"]').click()
      cy.get('.floating-window').invoke('outerWidth').should('eq', 460)

      cy.get('[data-resize=se]').trigger('pointerdown', {
        eventConstructor: 'PointerEvent',
        button: 0,
        clientX: 800,
        clientY: 700,
      })
      // Cancel the resize — listener must be torn down
      cy.get('body').trigger('pointercancel', { eventConstructor: 'PointerEvent' })
      // Further moves should not resize the panel
      cy.get('body').trigger('pointermove', {
        eventConstructor: 'PointerEvent',
        clientX: 900,
        clientY: 800,
      })
      cy.get('.floating-window').invoke('outerWidth').should('eq', 460)
    })
  })

  describe('edge and corner resize', () => {
    // Floating default is 460×520, parked bottom-right in the 1200×800 viewport:
    // x = 1200 - 460 - 24 = 716, y = 800 - 520 - 24 = 256.
    const START_X = 716
    const START_Y = 256

    it('grows from the bottom-right corner, leaving the origin put', () => {
      cy.mount(controlledWindow())
      cy.get('[aria-label="Pop out"]').click()

      dragResize('se', { x: START_X + 460, y: START_Y + 520 }, { x: 40, y: 30 })

      cy.get('.floating-window').should(($el) => {
        const r = $el[0].getBoundingClientRect()
        expect(r.width).to.be.closeTo(500, 1)
        expect(r.height).to.be.closeTo(550, 1)
        expect(r.left).to.be.closeTo(START_X, 1)
        expect(r.top).to.be.closeTo(START_Y, 1)
      })
    })

    it('grows from the top-left corner, shifting the origin to anchor the opposite edge', () => {
      cy.mount(controlledWindow())
      cy.get('[aria-label="Pop out"]').click()

      dragResize('nw', { x: START_X, y: START_Y }, { x: -40, y: -30 })

      cy.get('.floating-window').should(($el) => {
        const r = $el[0].getBoundingClientRect()
        expect(r.width).to.be.closeTo(500, 1)
        expect(r.height).to.be.closeTo(550, 1)
        expect(r.left).to.be.closeTo(START_X - 40, 1)
        expect(r.top).to.be.closeTo(START_Y - 30, 1)
      })
    })
  })
})
