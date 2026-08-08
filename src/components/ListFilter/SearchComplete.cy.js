import { setConfig } from '../../index';
import SearchComplete from './SearchComplete.vue';
const DOCS = [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }];
// `createListResource` caches by doctype in module scope and mirrors every
// response into IndexedDB, so a shared name would leak one test's filters and
// results into the next.
let counter = 0;
function uniqueDoctype() {
    return `SearchCompleteDoc${++counter}-${Date.now()}`;
}
function matches(options) {
    const pattern = options.params?.filters?.name?.[1] ?? '%%';
    const query = String(pattern).replaceAll('%', '').toLowerCase();
    return DOCS.filter((doc) => doc.name.toLowerCase().includes(query));
}
// Stands in for frappe.client.get_list. It honours the `like` filter the picker
// sends, so typing a query really does drop rows from the result set — which is
// the whole point of these tests.
function stubServer() {
    setConfig('resourceFetcher', (options) => Promise.resolve(matches(options)));
}
// Same server, but no request answers until the test says so, and an aborted
// one rejects the way `fetch` does. Returns a `release` that answers everything
// still outstanding, newest request first — the order that lets a stale
// response land last and win.
function stubDeferredServer() {
    const pending = [];
    setConfig('resourceFetcher', (options) => {
        return new Promise((resolve, reject) => {
            options.signal?.addEventListener('abort', () => {
                const error = new Error('Aborted');
                error.name = 'AbortError';
                reject(error);
            });
            pending.push(() => resolve(matches(options)));
        });
    });
    return function release() {
        pending.reverse().forEach((answer) => answer());
        pending.length = 0;
    };
}
function trigger() {
    return cy.get('[data-slot="trigger"]');
}
function search() {
    return cy.get('[data-slot="search"] input');
}
describe('SearchComplete', () => {
    beforeEach(stubServer);
    afterEach(() => setConfig('resourceFetcher', undefined));
    it('shows the picked option on the trigger', () => {
        cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } });
        trigger().should('contain.text', 'Select an option').click();
        cy.get('[role=option]').contains('Alpha').click();
        trigger().should('contain.text', 'Alpha');
    });
    // The regression this guards: Combobox resolves the trigger label out of the
    // options it was handed, and those options are one page of server results.
    // Without SearchComplete remembering the selection, narrowing the query drops
    // the selected row from `options` and the label silently reverts to the
    // placeholder.
    it('keeps the selected label after a query that excludes it', () => {
        cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } });
        trigger().click();
        cy.get('[role=option]').contains('Alpha').click();
        trigger().should('contain.text', 'Alpha');
        trigger().click();
        search().type('Beta');
        cy.get('[role=option]').should('contain.text', 'Beta');
        // Close without selecting anything.
        search().type('{esc}');
        cy.get('[data-slot="content"]').should('not.exist');
        trigger().should('contain.text', 'Alpha');
    });
    // Combobox hands query ownership to anything that listens for
    // `update:query`, so the committed label used to stay in the search box and
    // the next keystroke appended to it — "Alpha" then "AlphaBeta".
    it('resets the search box each time the popover opens', () => {
        cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } });
        trigger().click();
        cy.get('[role=option]').contains('Alpha').click();
        trigger().click();
        search().should('have.value', '');
    });
    // `createResource.fetch` opens a new AbortController per call and leaves the
    // old request running, so two searches in flight both write to `r.data` and
    // the slower one wins. Here the first request answers last and would put all
    // three rows back under a search box reading "Beta".
    it('drops a stale search response', () => {
        const release = stubDeferredServer();
        cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } });
        trigger().click();
        search().type('Beta');
        cy.then(release);
        cy.get('[role=option]').should('have.length', 1);
        cy.get('[role=option]').should('contain.text', 'Beta');
    });
    // Aborting the previous request makes it run its own `loading = false` after
    // the replacement has set the shared flag true, so the popover would drop its
    // loading state while the new search is still out.
    it('stays in the loading state while a replacement search is out', () => {
        stubDeferredServer();
        cy.mount(SearchComplete, { props: { doctype: uniqueDoctype() } });
        trigger().click();
        search().type('Beta');
        cy.get('[data-slot="content"]').should('have.attr', 'data-loading');
    });
    it('resolves a label for a value supplied by the parent', () => {
        cy.mount(SearchComplete, {
            props: { doctype: uniqueDoctype(), modelValue: 'Gamma' },
        });
        trigger().should('contain.text', 'Gamma');
    });
});
