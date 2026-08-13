import { defineComponent, h, ref } from 'vue'
import CommandPalette from './CommandPalette.vue'
import CommandPaletteFooter from './CommandPaletteFooter.vue'
import CommandPaletteInput from './CommandPaletteInput.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'
import CommandPaletteList from './CommandPaletteList.vue'

// Only what jsdom cannot answer lives here: scrolling, the column that keeps
// the field and the footer out of the rows' way, and the focus and pointer
// paths a real browser drives. The filter, the keyboard order and the data
// hooks are covered in CommandPalette.test.ts, which pins the same pointer
// event, because a wrong event name here fails in CI and nowhere else.

const LIST = '[data-slot=command-palette-list]'
const ITEM = '[data-slot=command-palette-item]'
const INPUT = '[data-slot=command-palette-input]'
const FOOTER = '[data-slot=command-palette-footer]'

// More rows than the list can hold, so it has somewhere to scroll to.
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
          h(CommandPaletteList, () =>
            rows.map((row) => h(CommandPaletteItem, { value: row }, () => row)),
          ),
          h(CommandPaletteFooter, () => 'Enter to run'),
        ],
      )
  },
})

function press(key: string, times = 1) {
  cy.get(`${INPUT} input`).type(`{${key}}`.repeat(times))
}

/** The row the keyboard is on, whole and inside the list's own box. */
function expectActiveRowInsideList() {
  cy.get(`${ITEM}[data-state=active]`).should(($row) => {
    const row = $row[0].getBoundingClientRect()
    const list = Cypress.$(LIST)[0].getBoundingClientRect()
    expect(row.top).to.be.at.least(list.top)
    expect(row.bottom).to.be.at.most(list.bottom)
  })
}

/** The list's box, and so every row in it, is clear of the chrome. */
function expectListClearOfChrome() {
  cy.get(LIST).should(($list) => {
    const list = $list[0].getBoundingClientRect()
    const field = Cypress.$(INPUT)[0].getBoundingClientRect()
    const footer = Cypress.$(FOOTER)[0].getBoundingClientRect()
    expect(list.top).to.be.at.least(field.bottom)
    expect(list.bottom).to.be.at.most(footer.top)
  })
}

describe('CommandPalette', () => {
  beforeEach(() => {
    cy.viewport(1000, 700)
    cy.mount(Harness)
  })

  it('scrolls the highlighted row into view on the way down', () => {
    cy.get(LIST).its('0.scrollTop').should('eq', 0)

    press('downArrow', 20)

    cy.get(LIST).its('0.scrollTop').should('be.greaterThan', 0)
    expectActiveRowInsideList()
    expectListClearOfChrome()
  })

  it('scrolls the highlighted row into view on the way back up', () => {
    press('downArrow', 20)
    cy.get(LIST).its('0.scrollTop').should('be.greaterThan', 0)

    // Fewer presses than went down, so the row lands mid-list. Walking all the
    // way back to row 1 would park the list at `scrollTop: 0`, where the row is
    // clear of the field whether or not the layout is right.
    press('upArrow', 8)

    cy.get(LIST).its('0.scrollTop').should('be.greaterThan', 0)
    expectActiveRowInsideList()
    expectListClearOfChrome()
  })

  it('keeps the rows clear of a footer that grows after mount', () => {
    // The footer's height is the caller's. It takes its space from the column
    // and the list gives it up, so no row can end up behind it.
    cy.get(FOOTER).invoke('css', 'padding-bottom', '40px')
    cy.get(FOOTER).should(($el) => {
      expect($el[0].getBoundingClientRect().height).to.be.greaterThan(40)
    })

    press('downArrow', 20)

    expectActiveRowInsideList()
    expectListClearOfChrome()
  })

  it('holds the field and the footer still while the list scrolls', () => {
    cy.get(INPUT).then(($input) => {
      cy.get(FOOTER).then(($footer) => {
        const inputTop = $input[0].getBoundingClientRect().top
        const footerBottom = $footer[0].getBoundingClientRect().bottom
        const firstRowTop = Cypress.$(ITEM)[0].getBoundingClientRect().top

        cy.get(LIST).scrollTo(0, 400)

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

    // `.type()` focuses its own subject first, so this cannot show that the
    // focus was still in the field before the keys. What it does show is that
    // walking the list never hands the focus to a row, which is what
    // `ListboxFilter` turns off and what would stop the user typing. The
    // highlight assertion is here so a no-op key press cannot pass this.
    press('downArrow', 3)
    cy.get(`${ITEM}[data-state=active]`).should('have.text', 'Row 4')
    cy.get(`${INPUT} input`).should('be.focused')
  })

  it('moves the highlight to the row under the pointer', () => {
    // `pointermove` is the only event reka binds on a row. `mouseover` and
    // `mouseenter` are silent no-ops, and a highlight assertion after one of
    // them reads the row that was already highlighted. Reka ignores the event
    // object itself, so the default constructor is enough.
    cy.get(ITEM).eq(3).trigger('pointermove')
    cy.get(`${ITEM}[data-state=active]`).should('have.text', 'Row 4')
    // Reka highlights on hover with focus off, so the pointer never takes the
    // caret away from the field.
    cy.get(`${INPUT} input`).should('be.focused')
  })
})
