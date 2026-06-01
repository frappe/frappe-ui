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
import {
  isSafeUrl,
  matchesHostname,
} from '@molecules/editor/extensions/shared/url-safety'

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
 * Deliberately WITHOUT `allow-same-origin`: the embed must not be able to read
 * cookies / localStorage for our origin. Scripts, popups, forms, and
 * presentation (fullscreen) are permitted so the common embeds still work.
 */
export const IFRAME_SANDBOX =
  'allow-scripts allow-popups allow-forms allow-presentation' as const

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
 */
export function validateIframeUrl(
  url: string,
  options?: ValidateIframeUrlOptions,
): boolean {
  if (!isSafeUrl(url, { allowedSchemes: ['http', 'https'] })) return false

  let host: string
  try {
    host = new URL(url).hostname
  } catch {
    return false
  }

  const blocklist = options?.blocklist
  if (blocklist?.length && matchesHostname(host, blocklist)) return false

  const allowlist = options?.allowlist ?? IFRAME_ALLOWLIST
  return matchesHostname(host, allowlist)
}
