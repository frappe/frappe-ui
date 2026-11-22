/**
 * Shared URL-safety primitives for components and the editor.
 *
 *  1. `safeHref`        — keep a link `href` only when its scheme is safe.
 *  2. `isSafeUrl`       — does a string parse to an absolute URL with an allowed scheme?
 *  3. `matchesHostname` — exact-or-dot-boundary host allowlist matching.
 *
 * Every check uses the platform `URL` parser rather than a regex, so it sees
 * a URL the way the browser will: `JaVaScRiPt:`, leading control characters
 * and tabs inside the scheme all normalise to `javascript:` and fail.
 */

/** Schemes a link may navigate to. Relative URLs are always allowed. */
const LINK_SCHEMES: readonly string[] = ['http', 'https', 'mailto', 'tel']

// Resolves relative links so only the scheme is checked. Never navigated to.
const RELATIVE_BASE = 'https://relative.invalid/'

/**
 * `href` when it is a string that is relative or uses a link scheme (http,
 * https, mailto, tel), otherwise `undefined`. Use it wherever an `href` comes
 * from data, so a `javascript:` or `data:` URL never reaches an anchor.
 */
export function safeHref(href: unknown): string | undefined {
  if (typeof href !== 'string' || !href) return undefined
  const safe = isSafeUrl(href, {
    allowedSchemes: LINK_SCHEMES,
    base: RELATIVE_BASE,
  })
  return safe ? href : undefined
}

/** Options for {@link isSafeUrl}. */
export interface SafeUrlOptions {
  /** Schemes allowed (without the trailing colon). Defaults to `['http', 'https']`. */
  allowedSchemes?: readonly string[]
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
