import { isSafeUrl, matchesHostname, } from '#molecules/editor/extensions/shared/url-safety';
/**
 * Hostnames (and their embed sub-hosts) we permit as iframe sources.
 *
 * Matched by exact host OR dot-boundary suffix via {@link matchesHostname}, so
 * `www.youtube.com` and `a.youtube.com` both match `youtube.com`, while
 * `youtube.com.evil.com` does NOT.
 */
export const IFRAME_ALLOWLIST = [
    'youtube.com',
    'youtu.be',
    'youtube-nocookie.com',
    'vimeo.com',
    'player.vimeo.com',
    'codepen.io',
    'codesandbox.io',
    'figma.com',
    'embed.figma.com',
    'docs.google.com',
    'drive.google.com',
    'notion.so',
];
/**
 * The sandbox attribute applied to every embedded iframe.
 *
 * Includes `allow-same-origin`: this lets the embed keep ITS OWN origin
 * (youtube.com etc.) so its scripts can use their own cookies/storage —
 * without it, YouTube's player throws SecurityError and renders a black box.
 * It does NOT grant the iframe our origin; cross-origin isolation from the
 * host still applies. The `allow-scripts + allow-same-origin` sandbox-escape
 * concern only exists for content served from OUR origin, which the
 * allowlist precludes (absolute http(s) URLs on external hosts only).
 */
export const IFRAME_SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-forms allow-presentation';
/**
 * The allowlist override configured on the editor's iframe extension, or
 * `undefined` when the extension is absent / uses the default list.
 */
export function getIframeAllowlist(editor) {
    return editor.extensionManager?.extensions.find((extension) => extension.name === 'iframe')?.options.allowlist;
}
/**
 * True iff any of `hosts` would pass the editor's iframe allowlist — used to
 * prune per-platform embed shortcuts when a custom allowlist excludes them.
 */
export function allowlistPermitsHosts(editor, hosts) {
    const allowlist = getIframeAllowlist(editor) ?? IFRAME_ALLOWLIST;
    return hosts.some((host) => matchesHostname(host, allowlist));
}
/**
 * True iff `url` is an absolute http(s) URL whose hostname is on the allowlist
 * (and not on an optional blocklist). Relative, bare, and unknown-scheme inputs
 * are rejected — there is no `startsWith('/')` escape hatch.
 */
export function validateIframeUrl(url, options) {
    if (!isSafeUrl(url, { allowedSchemes: ['http', 'https'] }))
        return false;
    let host;
    try {
        host = new URL(url).hostname;
    }
    catch {
        return false;
    }
    const blocklist = options?.blocklist;
    if (blocklist?.length && matchesHostname(host, blocklist))
        return false;
    const allowlist = options?.allowlist ?? IFRAME_ALLOWLIST;
    return matchesHostname(host, allowlist);
}
