export { IframeExtension, default } from './iframe-extension'
export type {
  IframeOptions,
  SetIframeOptions,
  IframeAlign,
} from './iframe-extension'
export {
  detectPlatform,
  calculateAspectRatio,
  getOptimalDimensions,
  processEmbedUrl,
  PLATFORM_CONFIGS,
} from './iframe-embed-utils'
export type {
  AspectRatioInfo,
  PlatformConfig,
} from './iframe-embed-utils'
export {
  IFRAME_ALLOWLIST,
  IFRAME_SANDBOX,
  validateIframeUrl,
} from './iframe-allowlist'
