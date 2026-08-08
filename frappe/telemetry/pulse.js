// Loads the one canonical pulse client from pulse's own CDN (not the host backend),
// so it's independent of the backend's framework version. Degrades to null if the
// asset can't be loaded, leaving telemetry off.
import { call } from 'frappe-ui';
export const BOOT_CONFIG_METHOD = 'frappe.utils.telemetry.pulse.client.boot_config';
// Direct-mode config from the app's own backend (frappe-ui SPAs lack desk's
// window.frappe.boot). Degrades to {} on any error, including old backends (404).
export async function fetchBootConfig() {
    try {
        return (await call(BOOT_CONFIG_METHOD)) || {};
    }
    catch (error) {
        return {};
    }
}
export const DEFAULT_PULSE_CLIENT_URL = 'https://pulse.m.frappe.cloud/assets/pulse/js/pulse_client.js';
// Only import from a trusted origin: pulse's CDN or the ingest host (self-hosted
// pulse). Stops a tampered boot_config from redirecting import() to an attacker
// origin — an untrusted url falls back to the canonical CDN.
function trustedClientUrl(clientUrl, host) {
    if (!clientUrl)
        return DEFAULT_PULSE_CLIENT_URL;
    try {
        const target = new URL(clientUrl);
        if (target.protocol !== 'https:')
            return DEFAULT_PULSE_CLIENT_URL;
        const allowed = new Set([new URL(DEFAULT_PULSE_CLIENT_URL).origin]);
        try {
            if (host)
                allowed.add(new URL(host).origin);
        }
        catch { }
        if (allowed.has(target.origin))
            return clientUrl;
    }
    catch { }
    return DEFAULT_PULSE_CLIENT_URL;
}
export async function loadPulseClient(options = {}) {
    const { clientUrl, ...clientOptions } = options;
    try {
        const url = trustedClientUrl(clientUrl, clientOptions.host);
        const mod = await import(/* @vite-ignore */ url);
        return new mod.PulseClient(clientOptions);
    }
    catch (error) {
        return null;
    }
}
