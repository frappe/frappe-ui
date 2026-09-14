export { default as ScrollArea } from './ScrollArea.vue'

// `ScrollBar` is not exported (SHELL-Q6). `ScrollArea` renders its own
// scrollbars, and the component only works inside reka-ui's `ScrollAreaRoot`,
// which frappe-ui does not export. There is no standalone replacement.
export type { ScrollAreaProps, ScrollAreaExposed } from './types'
