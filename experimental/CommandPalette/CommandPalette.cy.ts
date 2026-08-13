import { defineComponent, h, ref } from 'vue'
import CommandPalette from './CommandPalette.vue'
import CommandPaletteFooter from './CommandPaletteFooter.vue'
import CommandPaletteInput from './CommandPaletteInput.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'

// Only what jsdom cannot answer lives here: scrolling, sticky chrome and the
// focus the dialog's focus scope hands out. The filter, the keyboard order and
// the data hooks are covered in CommandPalette.test.ts.

const CONTENT = '[data-slot=command-palette-content]'
const ITEM = '[data-slot=command-palette-item]'
const INPUT = '[data-slot=command-palette-input]'
const FOOTER = '[data-slot=command-palette-footer]'

// More rows than the 60vh scroll region can hold, so the list has somewhere to
// scroll to.
const rows = Array.from({ length: 40 }, (_, i) => `Row ${i + 1}`)

const Harness = defineComponent({
  setup() {
    const open = ref(true)
    return () =>
      h(
        CommandPalette,
        { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v) },
        () => [
          h(CommandPaletteInput, { placeholder: 'Search' }),
          ...rows.map((row) =>
            h(CommandPaletteItem, { value: row }, () => row),
          ),
          h(CommandPaletteFooter, () => 'Enter to run'),
        ],
      )
  },
})

function press(key: string, times = 1) {
  cy.get(`${INPUT} input`).type(`{${key}}`.repeat(times))
}

describe('CommandPalette', () => {
  beforeEach(() => {
    cy.viewport(1000, 700)
    cy.mount(Harness)
  })

  it('scrolls the highlighted row into view as the keyboard walks down', () => {
    cy.get(CONTENT).its('0.scrollTop').should('eq', 0)

    press('downArrow', 20)

    // The list moved, and the row the keyboard is on sits inside the region
    // rather than below its fold. `scrollIntoView` knows nothing about the
    // sticky field and footer, so the row can still land behind them. That is
    // a separate bug, and asserting it here would only lock in today's answer.
    cy.get(CONTENT).its('0.scrollTop').should('be.greaterThan', 0)
    cy.get(`${ITEM}[data-state=active]`).should(($row) => {
      const row = $row[0].getBoundingClientRect()
      const region = Cypress.$(CONTENT)[0].getBoundingClientRect()
      expect(row.top).to.be.at.least(region.top)
      expect(row.bottom).to.be.at.most(region.bottom)
    })
  })

  it('pins the field and the footer while the list scrolls under them', () => {
    // One scroll region holds the whole slot, so the chrome stays put through
    // `position: sticky` alone.
    cy.get(INPUT).then(($input) => {
      cy.get(FOOTER).then(($footer) => {
        const inputTop = $input[0].getBoundingClientRect().top
        const footerBottom = $footer[0].getBoundingClientRect().bottom
        const firstRowTop = Cypress.$(ITEM)[0].getBoundingClientRect().top

        cy.get(CONTENT).scrollTo(0, 400)

        cy.get(ITEM)
          .first()
          .should(($row) => {
            expect($row[0].getBoundingClientRect().top).to.be.lessThan(
              firstRowTop,
            )
          })
        cy.get(INPUT).should(($el) => {
          expect($el[0].getBoundingClientRect().top).to.be.closeTo(inputTop, 1)
        })
        cy.get(FOOTER).should(($el) => {
          expect($el[0].getBoundingClientRect().bottom).to.be.closeTo(
            footerBottom,
            1,
          )
        })
      })
    })
  })

  it('opens with the focus in the field and keeps it there', () => {
    // The dialog's focus scope decides where the focus lands on open. It has to
    // be the filter field, or typing would go nowhere.
    cy.get(`${INPUT} input`).should('be.focused')
    press('downArrow', 3)
    cy.get(`${INPUT} input`).should('be.focused')
  })
})
