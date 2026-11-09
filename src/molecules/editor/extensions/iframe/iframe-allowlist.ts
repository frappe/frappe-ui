/**
 * Curated iframe embed allowlist + the single URL validator the iframe cluster
 * uses everywhere (extension load, paste, dialog, commands).
 *
 * Replaces the legacy `validateURL` / `ALLOWED_DOMAINS` substring check (which
 * let `youtube.com.evil.com` through and blanket-allowed any `startsWith('/')`
 * relative string). Validation now goes through the shared {@link isSafeUrl}
 * (absolute + http/https only) and {@link matchesHostname} (exact host OR
 * dot-boundary suffix — never substring).
 */
import type { Editor } from '@tiptap/core'
import {
  isSafeUrl,
  matchesHostname,
} from '#molecules/editor/extensions/shared/url-safety'
import { processEmbedUrl } from './iframe-embed-utils'

/**
 * Hostnames (and their embed sub-hosts) we permit as iframe sources.
 *
 * Matched by exact host OR dot-boundary suffix via {@link matchesHostname}, so
 * `www.youtube.com` and `a.youtube.com` both match `youtube.com`, while
 * `youtube.com.evil.com` does NOT.
 */
export const IFRAME_ALLOWLIST: readonly string[] = [
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
]

/**
 * The sandbox attribute applied to every embedded iframe.
 *
 * Includes `allow-same-origin`: this lets the embed keep ITS OWN origin
 * (youtube.com etc.) so its scripts can use their own cookies/storage —
 * without it, YouTube's player throws SecurityError and renders a black box.
 * It does NOT grant the iframe our origin; cross-origin isolation from the
 * host still applies. The `allow-scripts + allow-same-origin` sandbox-escape
 * concern only exists for content served from OUR origin, which
 * {@link validateIframeUrl} refuses.
 */
export const IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-popups allow-forms allow-presentation' as const

/**
 * The allowlist override configured on the editor's iframe extension, or
 * `undefined` when the extension is absent / uses the default list.
 */
export function getIframeAllowlist(
  editor: Editor,
): readonly string[] | undefined {
  return editor.extensionManager?.extensions.find(
    (extension) => extension.name === 'iframe',
  )?.options.allowlist as readonly string[] | undefined
}

/**
 * True iff any of `hosts` would pass the editor's iframe allowlist — used to
 * prune per-platform embed shortcuts when a custom allowlist excludes them.
 */
export function allowlistPermitsHosts(
  editor: Editor,
  hosts: readonly string[],
): boolean {
  const allowlist = getIframeAllowlist(editor) ?? IFRAME_ALLOWLIST
  return hosts.some((host) => matchesHostname(host, allowlist))
}

/** Options for {@link validateIframeUrl}. */
export interface ValidateIframeUrlOptions {
  /** Override the default allowlist (exact host or dot-boundary suffix). */
  allowlist?: readonly string[]
  /** Hosts to reject outright (exact host or dot-boundary suffix). */
  blocklist?: readonly string[]
}

/**
 * True iff `url` is an absolute http(s) URL whose hostname is on the allowlist
 * (and not on an optional blocklist). Relative, bare, and unknown-scheme inputs
 * are rejected — there is no `startsWith('/')` escape hatch.
 *
 * This is the one check every iframe path shares: the HTML parse rule, the
 * `src` attribute on render, the node view, paste, the dialog and commands.
 */
export function validateIframeUrl(
  url: unknown,
  options?: ValidateIframeUrlOptions,
): url is string {
  if (typeof url !== 'string') return false
  if (!isSafeUrl(url, { allowedSchemes: ['http', 'https'] })) return false

  const parsed = new URL(url)
  // IFRAME_SANDBOX keeps `allow-same-origin`, which is only safe for pages
  // from another origin. Refuse our own, even if an app allowlists its host.
  if (isOwnOrigin(parsed)) return false

  const blocklist = options?.blocklist
  if (blocklist?.length && matchesHostname(parsed.hostname, blocklist)) {
    return false
  }

  const allowlist = options?.allowlist ?? IFRAME_ALLOWLIST
  return matchesHostname(parsed.hostname, allowlist)
}

/**
 * Rewrite incoming markup's `src` into its embed form, or `null` when the
 * result is not an allowed embed.
 */
export function sanitizeIframeSrc(
  raw: string | null,
  allowlist?: readonly string[],
): string | null {
  if (!raw) return null
  const src = processEmbedUrl(raw)
  return validateIframeUrl(src, { allowlist }) ? src : null
}

function isOwnOrigin(url: URL): boolean {
  return typeof window !== 'undefined' && url.origin === window.location.origin
}
