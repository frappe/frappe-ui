export { default as PageHeader } from './PageHeader.vue'
export { default as PageHeaderBase } from './PageHeaderBase.vue'
export { default as PageHeaderTitle } from './PageHeaderTitle.vue'
export { default as PageHeaderTarget } from './PageHeaderTarget.vue'
export { default as PageHeaderMobile } from './PageHeaderMobile.vue'
export { default as PageHeaderMobileTitle } from './PageHeaderMobileTitle.vue'
export { default as PageHeaderBackButton } from './PageHeaderBackButton.vue'

// Every PageHeader component that takes props owns a named type (SHELL-Q8).
// `PageHeader`, `PageHeaderBase` and `PageHeaderTarget` take none, so they get
// no empty interface — that is what `FrappeUIProviderProps` was.
export type {
  PageHeaderTitleProps,
  PageHeaderMobileProps,
  PageHeaderMobileTitleProps,
  PageHeaderBackButtonProps,
} from './types'
