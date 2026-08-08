import ListFilter from './ListFilter.vue';
// Only non-Link fieldtypes: a Link field renders SearchComplete, which hits
// the backend through createListResource.
const docfields = [
    { fieldname: 'subject', label: 'Subject', fieldtype: 'Data' },
    {
        fieldname: 'status',
        label: 'Status',
        fieldtype: 'Select',
        options: 'Open\nClosed',
    },
    {
        fieldname: 'priority',
        label: 'Priority',
        fieldtype: 'Select',
        options: 'Low\nHigh',
    },
];
function openFilterPanel() {
    cy.contains('button', 'Filter').click();
}
describe('ListFilter', () => {
    it('renders the empty state behind the Filter button', () => {
        cy.mount(ListFilter, { props: { docfields } });
        openFilterPanel();
        cy.contains('Empty - Choose a field to filter by').should('be.visible');
    });
    // The "Add filter" picker supplies its own #trigger, where Autocomplete's
    // #target used to call togglePopover by hand. Combobox attaches the open
    // toggle to that element itself; this is the test that it reaches the
    // consumer's Button through `as-child`.
    it('opens the "Add filter" picker from its custom trigger', () => {
        cy.mount(ListFilter, { props: { docfields } });
        openFilterPanel();
        cy.contains('button', 'Add filter').click();
        cy.get('[role=option]').should('have.length', docfields.length);
        cy.get('[role=option]').eq(0).should('contain.text', 'Subject');
    });
    it('emits a filter when a field is picked', () => {
        const onUpdate = cy.spy().as('update');
        cy.mount(ListFilter, {
            props: { docfields, 'onUpdate:modelValue': onUpdate },
        });
        openFilterPanel();
        cy.contains('button', 'Add filter').click();
        cy.get('[role=option]').contains('Status').click();
        // Select fieldtype defaults to '=' and to the first select option.
        cy.get('@update').should('have.been.calledWith', {
            status: ['=', 'Open'],
        });
    });
    it('replaces the filter when its field is changed', () => {
        const onUpdate = cy.spy().as('update');
        cy.mount(ListFilter, {
            props: {
                docfields,
                modelValue: { status: ['=', 'Open'] },
                'onUpdate:modelValue': onUpdate,
            },
        });
        openFilterPanel();
        // The row's field picker, not the "Add filter" one at the bottom.
        cy.get('#fieldname [data-slot="trigger"]').should('contain.text', 'Status');
        cy.get('#fieldname [data-slot="trigger"]').click();
        cy.get('[role=option]').contains('Priority').click();
        cy.get('@update').should('have.been.calledWith', {
            priority: ['=', 'Low'],
        });
    });
    it('removes a filter', () => {
        const onUpdate = cy.spy().as('update');
        cy.mount(ListFilter, {
            props: {
                docfields,
                modelValue: { status: ['=', 'Open'] },
                'onUpdate:modelValue': onUpdate,
            },
        });
        openFilterPanel();
        cy.get('#filter-list').find('button').last().click();
        cy.get('@update').should('have.been.calledWith', {});
    });
});
