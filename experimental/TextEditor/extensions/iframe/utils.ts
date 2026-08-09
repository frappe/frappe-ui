import { IframeOptions } from './iframe-extension'


export const ALLOWED_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'codepen.io',
  'codesandbox.io',
  'figma.com',
  'www.figma.com',
  'embed.figma.com',
  'docs.google.com',
  'drive.google.com',
  'notion.so',
  'www.notion.so',
]

export interface AspectRatioInfo {
  ratio: number
  width: number
  height: number
  platform: string
}

export interface PlatformConfig {
  name: string
  ratio: number
  defaultWidth: number
  urlPatterns: string[]
}

// Platform-specific configurations
const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    name: 'YouTube',
    ratio: 9/16, // 16:9 aspect ratio
    defaultWidth: 640,
    urlPatterns: ['youtube.com', 'youtu.be', 'youtube-nocookie.com']
  },
  {
    name: 'Vimeo',
    ratio: 9/16, // 16:9 aspect ratio
    defaultWidth: 640,
    urlPatterns: ['vimeo.com', 'player.vimeo.com']
  },
  {
    name: 'CodePen',
    ratio: 3/2, // 2:3 aspect ratio (taller for code demos)
    defaultWidth: 500,
    urlPatterns: ['codepen.io']
  },
  {
    name: 'CodeSandbox',
    ratio: 3/2, // 2:3 aspect ratio
    defaultWidth: 500,
    urlPatterns: ['codesandbox.io']
  },
  {
    name: 'Figma',
    ratio: 9/16, // 16:9 default for design embeds
    defaultWidth: 800,
    urlPatterns: ['figma.com', 'www.figma.com', 'embed.figma.com']
  },
  {
    name: 'Google Docs',
    ratio: 4/3, // 4:3 for documents
    defaultWidth: 600,
    urlPatterns: ['docs.google.com', 'drive.google.com']
  },
  {
    name: 'Notion',
    ratio: 4/3, // 4:3 for pages
    defaultWidth: 600,
    urlPatterns: ['notion.so', 'www.notion.so']
  },
]

export function detectPlatform(url: string): PlatformConfig | null {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()

    return PLATFORM_CONFIGS.find(config =>
      config.urlPatterns.some(pattern => domain.includes(pattern))
    ) || null
  } catch {
    return null
  }
}

export function calculateAspectRatio(url: string): AspectRatioInfo {
  const platform = detectPlatform(url)

  if (platform) {
    return {
      ratio: platform.ratio,
      width: platform.defaultWidth,
      height: Math.round(platform.defaultWidth * platform.ratio),
      platform: platform.name
    }
  }

  // Default to 16:9 for unknown platforms
  return {
    ratio: 9/16,
    width: 640,
    height: 360,
    platform: 'Generic'
  }
}

export function getOptimalDimensions(url: string, containerWidth?: number): { width: number, height: number } {
  const aspectInfo = calculateAspectRatio(url)

  // If container width is provided, scale to fit
  if (containerWidth) {
    const CONTAINER_PADDING = 40 // px for editor padding
    const maxWidth = Math.min(containerWidth - CONTAINER_PADDING, aspectInfo.width)
    return {
      width: maxWidth,
      height: Math.round(maxWidth * aspectInfo.ratio)
    }
  }

  return {
    width: aspectInfo.width,
    height: aspectInfo.height
  }
}

export function validateURL(url: string, options: IframeOptions): boolean {
  try {
    if (url.startsWith('/')) return true
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()

    // Check blocked domains first
    if (options.blockedDomains?.some((blocked) => domain.includes(blocked))) {
      return false
    }

    // If allowedDomains is specified, check if domain is allowed
    if (options.allowedDomains?.length) {
      return options.allowedDomains.some((allowed) =>
        domain.includes(allowed.toLowerCase())
      )
    }

    // If no allowedDomains specified, allow all except blocked
    return true
  } catch {
    return false
  }
}

export function processURL(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()

    // YouTube URL processing
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return convertToYouTubeEmbed(url)
    }

    // Vimeo URL processing
    if (domain.includes('vimeo.com')) {
      return convertToVimeoEmbed(url)
    }

    // CodePen URL processing
    if (domain.includes('codepen.io')) {
      return convertToCodePenEmbed(url)
    }

    // Figma URL processing
    if (domain.includes('figma.com')) {
      return convertToFigmaEmbed(url)
    }

    // For other supported domains, return as-is
    return url
  } catch {
    return url
  }
}

function convertToYouTubeEmbed(url: string): string {
  try {
    const urlObj = new URL(url)
    let videoId = ''

    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1)
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || ''

      // Handle /embed/ URLs that are already in embed format
      if (urlObj.pathname.includes('/embed/')) {
        return url
      }
    }

    if (videoId) {
      // Add common YouTube embed parameters for better UX
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    }
  } catch (e) {
    console.warn('Failed to convert YouTube URL:', e)
  }

  return url
}

function convertToVimeoEmbed(url: string): string {
  try {
    // Handle already embedded URLs
    if (url.includes('player.vimeo.com')) {
      return url
    }

    const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/)
    if (match?.[1]) {
      return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`
    }
  } catch (e) {
    console.warn('Failed to convert Vimeo URL:', e)
  }

  return url
}

function convertToCodePenEmbed(url: string): string {
  try {
    // Handle already embedded URLs
    if (url.includes('/embed/')) {
      return url
    }

    const match = url.match(/codepen\.io\/([^\/]+)\/pen\/([^\/\?]+)/)
    if (match?.[1] && match?.[2]) {
      return `https://codepen.io/${match[1]}/embed/${match[2]}?default-tab=result`
    }
  } catch (e) {
    console.warn('Failed to convert CodePen URL:', e)
  }

  return url
}

function convertToFigmaEmbed(url: string): string {
  try {
    const urlObj = new URL(url)

    // Convert direct Figma links to embed URLs
    if (urlObj.hostname === 'www.figma.com' || urlObj.hostname === 'figma.com') {
      // Convert https://www.figma.com/design/... to https://embed.figma.com/design/...
      if (urlObj.pathname.startsWith('/design/')) {
        urlObj.hostname = 'embed.figma.com'
        // Set embed-host to 'share' for public embeds
        urlObj.searchParams.set('embed-host', 'share')
        return urlObj.toString()
      }
    }

    // For already embedded URLs, just ensure embed-host is set
    if (urlObj.hostname === 'embed.figma.com') {
      if (!urlObj.searchParams.has('embed-host')) {
        urlObj.searchParams.set('embed-host', 'share')
      }
      return urlObj.toString()
    }

    return url
  } catch (e) {
    console.warn('Failed to convert Figma URL:', e)
  }

  return url
}
