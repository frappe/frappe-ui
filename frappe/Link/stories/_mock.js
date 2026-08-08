import { onBeforeUnmount, onMounted } from 'vue';
const SEARCH_LINK_PATH = '/api/method/frappe.desk.search.search_link';
const LATENCY_MS = 200;
const MAX_RESULTS = 20;
const datasets = new Map();
let originalFetch = null;
function getUrl(input) {
    if (typeof input === 'string')
        return input;
    if (input instanceof URL)
        return input.toString();
    return input.url;
}
function recordsFor(doctype) {
    // Multiple stories on the same docs page often register the same seed
    // dataset (e.g. `{ User: MOCK_USERS }`). Dedupe by `value` so a single
    // `search_link` request doesn't return the row N times.
    const byValue = new Map();
    for (const ds of datasets.values()) {
        const rows = ds[doctype];
        if (!rows)
            continue;
        for (const r of rows)
            byValue.set(r.value, r);
    }
    return Array.from(byValue.values());
}
function matchesQuery(r, q) {
    if (!q)
        return true;
    const hay = `${r.label ?? ''} ${r.value}`.toLowerCase();
    return hay.includes(q);
}
function matchesFilters(r, filters) {
    for (const [k, v] of Object.entries(filters)) {
        if (k in r && r[k] !== v)
            return false;
    }
    return true;
}
async function handleSearchLink(init) {
    let body = {};
    try {
        if (typeof init?.body === 'string')
            body = JSON.parse(init.body);
    }
    catch {
        /* ignore — empty body */
    }
    const doctype = body.doctype ?? '';
    const txt = String(body.txt ?? '').trim().toLowerCase();
    const filters = body.filters ?? {};
    const matches = recordsFor(doctype)
        .filter((r) => matchesQuery(r, txt))
        .filter((r) => matchesFilters(r, filters))
        .slice(0, MAX_RESULTS)
        .map(({ value, label, description }) => ({
        value,
        label: label ?? value,
        description,
    }));
    await new Promise((r) => setTimeout(r, LATENCY_MS));
    return new Response(JSON.stringify({ message: matches }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
function patchedFetch(input, init) {
    const url = getUrl(input);
    if (url.includes(SEARCH_LINK_PATH))
        return handleSearchLink(init);
    return originalFetch.call(window, input, init);
}
/**
 * Install a mocked `frappe.desk.search.search_link` endpoint for the lifetime
 * of the calling component. Stories on a docs page run concurrently, so each
 * call registers under its own key — installs are refcounted and the global
 * `fetch` is restored when the last consumer unmounts.
 */
export function useMockSearchLink(dataset) {
    const id = Symbol('mock-search-link');
    onMounted(() => {
        if (!originalFetch) {
            originalFetch = window.fetch.bind(window);
            window.fetch = patchedFetch;
        }
        datasets.set(id, dataset);
    });
    onBeforeUnmount(() => {
        datasets.delete(id);
        if (datasets.size === 0 && originalFetch) {
            window.fetch = originalFetch;
            originalFetch = null;
        }
    });
}
function avatar(value) {
    return `https://i.pravatar.cc/80?u=${value}`;
}
export const MOCK_USERS = [
    { value: 'alex@frappe.io', label: 'Alex Rivera', description: 'Engineering', enabled: 1, department: 'Engineering', image: avatar('alex@frappe.io') },
    { value: 'alexandra@frappe.io', label: 'Alexandra Chen', description: 'Design', enabled: 1, department: 'Design', image: avatar('alexandra@frappe.io') },
    { value: 'alexei@frappe.io', label: 'Alexei Volkov', description: 'Engineering', enabled: 1, department: 'Engineering', image: avatar('alexei@frappe.io') },
    { value: 'priya@frappe.io', label: 'Priya Shah', description: 'Design', enabled: 1, department: 'Design', image: avatar('priya@frappe.io') },
    { value: 'priyanka@frappe.io', label: 'Priyanka Mehta', description: 'Product', enabled: 1, department: 'Product', image: avatar('priyanka@frappe.io') },
    { value: 'marcus@frappe.io', label: 'Marcus Lee', description: 'Product', enabled: 1, department: 'Product', image: avatar('marcus@frappe.io') },
    { value: 'marco@frappe.io', label: 'Marco Silva', description: 'Engineering', enabled: 1, department: 'Engineering', image: avatar('marco@frappe.io') },
    { value: 'maria@frappe.io', label: 'Maria Garcia', description: 'Marketing', enabled: 1, department: 'Marketing', image: avatar('maria@frappe.io') },
    { value: 'sofia@frappe.io', label: 'Sofia Hartmann', description: 'Engineering', enabled: 1, department: 'Engineering', image: avatar('sofia@frappe.io') },
    { value: 'sophie@frappe.io', label: 'Sophie Laurent', description: 'Sales', enabled: 0, department: 'Sales', image: avatar('sophie@frappe.io') },
    { value: 'kenji@frappe.io', label: 'Kenji Tanaka', description: 'Design', enabled: 1, department: 'Design', image: avatar('kenji@frappe.io') },
    { value: 'kenta@frappe.io', label: 'Kenta Mori', description: 'Engineering', enabled: 0, department: 'Engineering', image: avatar('kenta@frappe.io') },
    { value: 'nadia@frappe.io', label: 'Nadia Okafor', description: 'Product', enabled: 1, department: 'Product', image: avatar('nadia@frappe.io') },
    { value: 'diego@frappe.io', label: 'Diego Alvarez', description: 'Engineering', enabled: 1, department: 'Engineering', image: avatar('diego@frappe.io') },
    { value: 'lina@frappe.io', label: 'Lina Petrova', description: 'Marketing', enabled: 1, department: 'Marketing', image: avatar('lina@frappe.io') },
    { value: 'liam@frappe.io', label: 'Liam Connor', description: 'Product', enabled: 1, department: 'Product', image: avatar('liam@frappe.io') },
    { value: 'hassan@frappe.io', label: 'Hassan Iqbal', description: 'Sales', enabled: 1, department: 'Sales', image: avatar('hassan@frappe.io') },
    { value: 'ava@frappe.io', label: 'Ava Nguyen', description: 'Engineering', enabled: 1, department: 'Engineering', image: avatar('ava@frappe.io') },
];
export const MOCK_LOST_REASONS = [
    { value: 'Price too high' },
    { value: 'Lost to competitor' },
    { value: 'No budget' },
    { value: 'Bad timing' },
    { value: 'Missing feature' },
    { value: 'No decision' },
];
