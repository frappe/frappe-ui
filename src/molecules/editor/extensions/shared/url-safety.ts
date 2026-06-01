/**
 * Shared URL-safety primitives for editor extensions.
 *
 * Two concerns, kept deliberately small and pure:
 *  1. `isSafeUrl`   — does a string parse to an absolute URL with an allowed scheme?
 *  2. `matchesHostname` — exact-or-dot-boundary host allowlist matching.
 *
 * These replace two long-standing holes in the legacy iframe/link code:
 *  - the `domain.includes(allowed)` substring check (so `youtube.com.evil.com`
 *    matched `youtube.com`), and
 *  - the `url.startsWith('/')` blanket allow of any relative/bare string.
 *
 * NOTE: platform embed *transformation* (youtube /shorts + youtu.be query
 * params, vimeo unlisted hash, codepen, codesandbox, figma /file//proto//board,
 * google docs/drive, notion) is NOT done here — that lives in the iframe
 * cluster's embed utils. This module only decides whether a host is on an
 * allowlist and whether a URL is well-formed + scheme-safe, which is the
 * gate every one of those platforms must pass first.
 */

/** Options for {@link isSafeUrl}. */
export interface SafeUrlOptions {
  /** Schemes allowed (without the trailing colon). Defaults to `['http', 'https']`. */
  allowedSchemes?: string[]
  /**
   * Optional base to resolve relative URLs against (e.g. `window.location.origin`).
   * A server-relative `file_url` like `/files/x.png` resolves to an http(s) URL
   * and passes; `javascript:`/`data:` still parse to their own scheme and fail.
   */
  base?: string
}

const DEFAULT_SCHEMES: readonly string[] = ['http', 'https']

/** Normalize a scheme to a bare lowercase token (strip any trailing `:`). */
function normalizeScheme(scheme: string): string {
  return scheme.toLowerCase().replace(/:$/, '')
}

/**
 * True iff `url` parses as an absolute URL whose scheme is in `allowedSchemes`.
 *
 * Uses the platform `URL` parser, so relative paths, bare slugs, anchors, and
 * protocol-relative (`//host`) strings all fail — they cannot be parsed as
 * absolute URLs. `javascript:`, `data:`, etc. fail unless explicitly allowed.
 *
 * @param url The candidate URL string.
 * @param options Optional scheme allowlist; defaults to http/https.
 * @returns Whether the URL is absolute and uses an allowed scheme.
 */
export function isSafeUrl(url: string, options?: SafeUrlOptions): boolean {
  if (typeof url !== 'string' || url.trim() === '') return false

  const allowedSchemes = (options?.allowedSchemes ?? DEFAULT_SCHEMES).map(
    normalizeScheme,
  )

  let parsed: URL
  try {
    parsed = new URL(url, options?.base)
  } catch {
    return false
  }

  // URL#protocol always includes the trailing ':' (e.g. 'https:').
  const scheme = normalizeScheme(parsed.protocol)
  return allowedSchemes.includes(scheme)
}

/**
 * Exact host match OR dot-boundary suffix match against an allowlist.
 *
 * `host === entry` matches; `host.endsWith('.' + entry)` matches (so
 * `a.youtube.com` matches `youtube.com`). Substring matches do NOT:
 * `youtube.com.evil.com` does not match `youtube.com`. Comparison is
 * case-insensitive.
 *
 * This is the matcher the iframe allowlist validation consumes against its
 * `ALLOWED_DOMAINS` (youtube/youtu.be, vimeo/player.vimeo.com, codepen,
 * codesandbox, figma/embed.figma.com, docs/drive.google.com, notion), and
 * the same matcher used to reject blocked domains without the substring hole.
 *
 * @param host A URL hostname (e.g. from `new URL(url).hostname`).
 * @param allowlist Bare hostnames to match against (no scheme, no path).
 * @returns Whether `host` exactly equals or is a dot-suffixed subdomain of an entry.
 */
export function matchesHostname(
  host: string,
  allowlist: readonly string[],
): boolean {
  if (!host) return false
  const normalizedHost = host.toLowerCase()

  return allowlist.some((entry) => {
    const normalizedEntry = entry.toLowerCase().replace(/^\.+/, '')
    if (!normalizedEntry) return false
    return (
      normalizedHost === normalizedEntry ||
      normalizedHost.endsWith('.' + normalizedEntry)
    )
  })
}
