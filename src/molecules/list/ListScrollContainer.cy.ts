import { computed, h, ref } from 'vue'
import ScrollArea from '../../components/ScrollArea/ScrollArea.vue'
import type { ScrollAreaExposed } from '../../components/ScrollArea/types'
import { List, ListCell, ListRow, ListRows } from './index'

for (const source of ['getter', 'ref'] as const) {
  for (const preloaded of [true, false]) {
    it(`windows ${preloaded ? 'preloaded' : 'later'} rows in ScrollArea using a ${source}`, () => {
      const data = Array.from({ length: 500 }, (_, i) => ({
        id: String(i + 1),
      }))
      const items = ref(preloaded ? data : [])
      const scroller = ref<ScrollAreaExposed | null>(null)
      const viewport = () => scroller.value?.viewportElement ?? null
      const scrollContainer =
        source === 'getter' ? viewport : computed(viewport)
      cy.mount({
        render: () =>
          h(
            ScrollArea,
            { ref: scroller, style: 'height: 200px', orientation: 'both' },
            () =>
              h(List, { rowHeight: 40, columns: ['minmax(0,1fr)'] }, () =>
                h(
                  ListRows,
                  { items: items.value, virtual: true, scrollContainer },
                  {
                    default: ({
                      item,
                      value,
                    }: {
                      item: { id: string }
                      value: string
                    }) =>
                      h(ListRow, { value }, () =>
                        h(ListCell, () => `Row ${item.id}`),
                      ),
                  },
                ),
              ),
          ),
      })
      if (!preloaded) {
        cy.then(() => {
          items.value = data
        })
      }
      cy.contains('[data-slot=list-row]', /^Row 1$/).should('be.visible')
      cy.get('[data-slot=list-row]').should('have.length.lessThan', 50)
      cy.get('[data-slot=scroll-area-viewport]').scrollTo('bottom')
      cy.contains('[data-slot=list-row]', 'Row 500').should('be.visible')
      cy.contains('[data-slot=list-row]', /^Row 1$/).should('not.exist')
    })
  }
}
