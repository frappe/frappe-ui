import { reactive, readonly, ref } from 'vue';
import { fetchBootConfig, loadPulseClient, } from './pulse.ts';
let client = null;
let removePageviewHook = null;
const appName = ref();
const isEnabled = ref(false);
export function useTelemetry() {
    return reactive({
        isEnabled: readonly(isEnabled),
        disable: () => {
            isEnabled.value = false;
            client?.stop();
        },
        capture: (event_name, data = {}) => {
            if (!isEnabled.value || !appName.value)
                return;
            client?.capture(event_name, appName.value, data);
        },
        getDistinctId: () => client?.getDistinctId?.() ?? '',
    });
}
function defaultScrubRoute(to) {
    const matched = to.matched[to.matched.length - 1];
    return matched?.path || to.path || '';
}
export default {
    async install(app, options) {
        appName.value = options.app_name;
        if (!appName.value) {
            console.warn(`Telemetry plugin installed without app_name. \n` +
                `To enable telemetry, please provide the app_name while installing the plugin: \n` +
                `app.use(telemetryPlugin, { app_name: 'your_app_name' })`);
            return;
        }
        // Explicit options win; fetch the rest from the backend (skip when self-sufficient).
        const fetched = options.host != null && options.apiKey != null ? {} : await fetchBootConfig();
        const getContext = options.getContext || (() => ({ user: fetched.user, team: fetched.team }));
        // Reinstalls (tests, HMR, SSR-per-request) reuse the module singletons, so tear
        // down the previous client's flush timer and router hook before replacing them.
        client?.stop();
        removePageviewHook?.();
        removePageviewHook = null;
        client = await loadPulseClient({
            host: options.host ?? fetched.host,
            apiKey: options.apiKey ?? fetched.key,
            site: options.site ?? fetched.site,
            enabled: options.enabled ?? fetched.enabled ?? false,
            getContext,
            anonymousMode: options.anonymousMode,
            clientUrl: options.clientUrl ?? fetched.client_url,
        });
        if (!client)
            return;
        isEnabled.value = await client.init();
        if (isEnabled.value) {
            removePageviewHook = setupPageviewTracking(options, fetched.site_age);
        }
    },
};
// Older backends omit site_age → track anyway (permissive, matching desk's
// `site_age && site_age > 15` skip check).
function setupPageviewTracking(options, site_age) {
    if (!options.router || (site_age && site_age > 15))
        return null;
    const scrub = options.scrubRoute || defaultScrubRoute;
    let lastFullPath = '';
    const capturePageview = (to) => {
        // Dedupe so the initial capture and afterEach can't double-count the same route.
        if (!isEnabled.value || !appName.value || to.fullPath === lastFullPath)
            return;
        lastFullPath = to.fullPath;
        client?.capture('pageview', appName.value, { route: scrub(to) });
    };
    // afterEach missed the initial navigation if it resolved during install's awaits,
    // so capture the landing route once the router is ready.
    options.router.isReady().then(() => {
        if (options.router)
            capturePageview(options.router.currentRoute.value);
    });
    return options.router.afterEach((to) => capturePageview(to));
}
