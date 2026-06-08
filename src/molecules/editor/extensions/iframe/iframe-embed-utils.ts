/**
 * Pure embed-URL transformation + sizing helpers for the iframe extension.
 *
 * NO validation lives here — callers gate with `validateIframeUrl` first (see
 * `iframe-allowlist.ts`). This module only:
 *  - detects which platform a URL belongs to (via dot-boundary host match, not
 *    substring),
 *  - computes default / container-fitted dimensions per platform,
 *  - rewrites watch/share URLs into their embeddable form (youtu.be query +
 *    `/shorts` + playlists; figma `/file`,`/proto`,`/board`; vimeo unlisted
 *    hash; codepen pen).
 *
 * Everything is side-effect-free and unit-testable.
 */
import { matchesHostname } from '#molecules/editor/extensions/shared/url-safety'

const EDITOR_PADDING = 40

export interface AspectRatioInfo {
  ratio: number
  width: number
  height: number
  platform: string
}

export interface PlatformConfig {
  /** Human-readable platform name (shown in the dialog). */
  name: string
  /** Aspect ratio expressed as height / width. */
  ratio: number
  /** Default embed width in px. */
  defaultWidth: number
  /** Hostnames (exact or dot-boundary suffix) this platform owns. */
  hosts: readonly string[]
  /**
   * Slash-menu glyph. Lucide ships no brand icons, so these are semantic
   * stand-ins (play for video platforms, frame for Figma, …).
   */
  icon: string
  /** Example URL shown as the dialog placeholder for this platform. */
  example: string
}

/** Per-platform sizing + host ownership. */
export const PLATFORM_CONFIGS: readonly PlatformConfig[] = [
  {
    name: 'YouTube',
    ratio: 9 / 16,
    defaultWidth: 640,
    hosts: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
    icon: 'lucide-square-play',
    example: 'https://youtube.com/watch?v=…',
  },
  {
    name: 'Vimeo',
    ratio: 9 / 16,
    defaultWidth: 640,
    hosts: ['vimeo.com', 'player.vimeo.com'],
    icon: 'lucide-circle-play',
    example: 'https://vimeo.com/…',
  },
  {
    name: 'CodePen',
    ratio: 3 / 2,
    defaultWidth: 500,
    hosts: ['codepen.io'],
    icon: 'lucide-code-xml',
    example: 'https://codepen.io/user/pen/…',
  },
  {
    name: 'CodeSandbox',
    ratio: 3 / 2,
    defaultWidth: 500,
    hosts: ['codesandbox.io'],
    icon: 'lucide-box',
    example: 'https://codesandbox.io/s/…',
  },
  {
    name: 'Figma',
    ratio: 9 / 16,
    defaultWidth: 800,
    hosts: ['figma.com', 'embed.figma.com'],
    icon: 'lucide-frame',
    example: 'https://figma.com/design/…',
  },
  {
    name: 'Google Docs',
    ratio: 4 / 3,
    defaultWidth: 600,
    hosts: ['docs.google.com', 'drive.google.com'],
    icon: 'lucide-file-text',
    example: 'https://docs.google.com/document/d/…',
  },
  {
    name: 'Notion',
    ratio: 4 / 3,
    defaultWidth: 600,
    hosts: ['notion.so'],
    icon: 'lucide-notebook-text',
    example: 'https://notion.so/…',
  },
]

/** Resolve a platform config by its display name (case-insensitive). */
export function platformByName(name: string): PlatformConfig | null {
  const lower = name.toLowerCase()
  return (
    PLATFORM_CONFIGS.find((config) => config.name.toLowerCase() === lower) ??
    null
  )
}

/** Resolve the platform config for a URL, or null when unknown/unparseable. */
export function detectPlatform(url: string): PlatformConfig | null {
  let host: string
  try {
    host = new URL(url).hostname
  } catch {
    return null
  }
  return (
    PLATFORM_CONFIGS.find((config) => matchesHostname(host, config.hosts)) ??
    null
  )
}

/** Compute the natural aspect ratio + default size for a URL's platform. */
export function calculateAspectRatio(url: string): AspectRatioInfo {
  const platform = detectPlatform(url)
  if (platform) {
    return {
      ratio: platform.ratio,
      width: platform.defaultWidth,
      height: Math.round(platform.defaultWidth * platform.ratio),
      platform: platform.name,
    }
  }
  return { ratio: 9 / 16, width: 640, height: 360, platform: 'Generic' }
}

/** Default or container-fitted dimensions, preserving the platform ratio. */
export function getOptimalDimensions(
  url: string,
  containerWidth?: number,
): { width: number; height: number } {
  const info = calculateAspectRatio(url)
  if (containerWidth) {
    const maxWidth = Math.min(containerWidth - EDITOR_PADDING, info.width)
    return { width: maxWidth, height: Math.round(maxWidth * info.ratio) }
  }
  return { width: info.width, height: info.height }
}

/** Rewrite a platform watch/share URL into its embeddable form. */
export function processEmbedUrl(url: string): string {
  const platform = detectPlatform(url)
  switch (platform?.name) {
    case 'YouTube':
      return convertYouTube(url)
    case 'Vimeo':
      return convertVimeo(url)
    case 'CodePen':
      return convertCodePen(url)
    case 'Figma':
      return convertFigma(url)
    default:
      return url
  }
}

/** Extract a YouTube video id from any of its URL shapes. */
function youTubeVideoId(parsed: URL): string {
  if (matchesHostname(parsed.hostname, ['youtu.be'])) {
    return parsed.pathname.slice(1).split('/')[0]
  }
  // /shorts/<id> and /live/<id>
  const segments = parsed.pathname.split('/').filter(Boolean)
  if (segments[0] === 'shorts' || segments[0] === 'live') {
    return segments[1] ?? ''
  }
  // /embed/<id> is already embeddable; caller short-circuits.
  if (segments[0] === 'embed') return segments[1] ?? ''
  return parsed.searchParams.get('v') ?? ''
}

function convertYouTube(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }

  // Already an embed URL — leave untouched.
  if (parsed.pathname.startsWith('/embed/')) return url

  const videoId = youTubeVideoId(parsed)
  if (!videoId) return url

  const params = new URLSearchParams({ rel: '0', modestbranding: '1' })
  const list = parsed.searchParams.get('list')
  if (list) params.set('list', list)
  const start = parsed.searchParams.get('t') ?? parsed.searchParams.get('start')
  if (start) params.set('start', start.replace(/s$/, ''))

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function convertVimeo(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }

  if (matchesHostname(parsed.hostname, ['player.vimeo.com'])) return url

  const segments = parsed.pathname.split('/').filter(Boolean)
  const id = segments.find((seg) => /^\d+$/.test(seg))
  if (!id) return url

  // Preserve the unlisted hash (`vimeo.com/<id>/<hash>`) as `?h=<hash>`.
  const idIndex = segments.indexOf(id)
  const hash = segments[idIndex + 1]
  const params = new URLSearchParams({
    title: '0',
    byline: '0',
    portrait: '0',
  })
  if (hash && /^[0-9a-f]+$/i.test(hash)) params.set('h', hash)

  return `https://player.vimeo.com/video/${id}?${params.toString()}`
}

function convertCodePen(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }
  if (parsed.pathname.includes('/embed/')) return url

  const match = parsed.pathname.match(/^\/([^/]+)\/pen\/([^/]+)/)
  if (match) {
    return `https://codepen.io/${match[1]}/embed/${match[2]}?default-tab=result`
  }
  return url
}

function convertFigma(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }

  // Already an embed host — just ensure embed-host is present.
  if (matchesHostname(parsed.hostname, ['embed.figma.com'])) {
    if (!parsed.searchParams.has('embed-host')) {
      parsed.searchParams.set('embed-host', 'share')
    }
    return parsed.toString()
  }

  // figma.com/{design,file,proto,board}/... → embed.figma.com/...
  const embeddable = /^\/(design|file|proto|board)\//.test(parsed.pathname)
  if (matchesHostname(parsed.hostname, ['figma.com']) && embeddable) {
    parsed.hostname = 'embed.figma.com'
    parsed.searchParams.set('embed-host', 'share')
    return parsed.toString()
  }

  return url
}
