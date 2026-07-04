// App setup and plugins
export { default as FrappeUI } from './utils/plugin'
export { default as FrappeUIProvider } from './components/Provider/FrappeUIProvider.vue'
export { getConfig, setConfig } from './utils/config'
export type { FrappeUIConfig } from './utils/config'
export { default as pageMetaPlugin } from './utils/pageMeta.js'
export { usePageMeta } from './utils/pageMeta'

// Data fetching
export * from './data-fetching'
// Legacy resource API. Keep public until official apps finish the v3 migration.
export * from './resources/index.ts'
export { default as call, createCall } from './utils/call'
export { frappeRequest } from './utils/frappeRequest'
export { request } from './utils/request'
export { default as initSocket } from './utils/socketio'

// Base components
export * from './components/Alert'
export * from './components/Avatar'
export * from './components/Badge'
export * from './components/BottomSheet'
export * from './components/Breadcrumbs'
export * from './components/Button'
export * from './components/Divider'
export * from './components/Icon'
export { default as LoadingIndicator } from './components/LoadingIndicator.vue'
export { default as LoadingText } from './components/LoadingText.vue'
export * from './components/Progress'
export * from './components/Rating'
export * from './components/Skeleton'
export * from './components/Spinner'
export * from './components/Tooltip'

// Form controls
export * from './components/Autocomplete'
export * from './components/Checkbox'
export * from './components/Combobox'
export * from './components/DatePicker'
export * from './components/Duration'
export * from './components/ErrorMessage'
export * from './components/FileUploader'
export * from './components/FormControl'
export { default as FormLabel } from './components/FormLabel.vue'
export * from './components/MultiSelect'
export * from './components/Password'
export * from './components/Select'
export * from './components/Slider'
export * from './components/Switch'
export * from './components/Textarea'
export * from './components/TextInput'
export * from './components/TimePicker'

// Dialogs, menus, and feedback
export * from './components/ContextMenu'
export * from './components/Dialog'
export { default as Dialogs } from './components/Dialogs.vue'
export * from './components/Dropdown'
export * from './components/HoverCard'
export * from './components/Popover'
export type { PopoverAlign, PopoverSide } from './components/Popover/types'
export {
  dialog,
  type ConfirmArgs,
  type DialogNamespace,
  type PromptArgs,
  type PromptField,
} from './utils/dialog'
export { toast } from './components/Toast/toast'
export { default as ToastProvider } from './components/Toast/ToastProvider.vue'

// Lists and collection views
export * from './components/ItemListRow'
// Legacy ListView family. Do not deprecate until `frappe-ui/list` reaches parity.
export * from './components/ListView'
export { default as ListFilter } from './components/ListFilter/ListFilter.vue'
export { default as NestedPopover } from './components/ListFilter/NestedPopover.vue'
export * from './components/Calendar'
export * from './components/Tree'

// Navigation and layout
export * from './components/DesktopShell/index.ts'
export * from './components/MobileNav/index.ts'
export * from './components/MobileShell/index.ts'
export * from './components/PageHeader'
export * from './components/Rail'
export * from './components/ScrollArea'
export * from './components/SettingsDialog'
export * from './components/Sidebar/index.ts'
export * from './components/TabButtons'
export { default as Tabs } from './components/Tabs/Tabs.vue'

// Command and keyboard surfaces
export { default as CommandPalette } from './components/CommandPalette/CommandPalette.vue'
export { default as CommandPaletteItem } from './components/CommandPalette/CommandPaletteItem.vue'
export { default as KeyboardShortcut } from './components/KeyboardShortcut.vue'
export * from './components/KeyboardShortcutsModal'
export * from './composables/useShortcut'

// Deprecated component compatibility
/** @deprecated Use layout markup or domain-specific components instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as Card } from './components/Card.vue'
/** @deprecated Use `dialog.confirm(...)` instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as ConfirmDialog } from './components/ConfirmDialog.vue'
/** @deprecated Use `dialog.confirm(...)` instead. */
export { confirmDialog } from './utils/confirmDialog.js'
/** @deprecated Use lucide icon names or the `Icon` component instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as FeatherIcon } from './components/FeatherIcon.vue'
/** @deprecated Use `TextInput` or `FormControl` instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as Input } from './components/Input.vue'
/** @deprecated Use list primitives from `frappe-ui/list` or app-owned row markup instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as ListItem } from './components/ListItem.vue'
/** @deprecated Use `Select` for month picking instead. */
export * from './components/MonthPicker'
/** @deprecated Use the imperative `toast(...)` API instead. The `<Toast />` SFC will be removed in a future major. */
export { default as Toast } from './components/Toast/Toast.vue'
/** @deprecated Use `Select` with `useTheme` instead. */
export * from './components/ThemeSwitcher'
/** @deprecated Use the `frappe-ui/editor` subpath instead. */
export * from './components/TextEditor'
/** @deprecated Use extensions from `frappe-ui/editor` instead. */
export * from './components/TextEditor/extensions/image'
/** @deprecated Use extensions from `frappe-ui/editor` instead. */
export * from './components/TextEditor/extensions/suggestion'

// Charts
export { default as AxisChart } from './components/Charts/AxisChart.vue'
export * from './components/CircularProgressBar'
export { default as DonutChart } from './components/Charts/DonutChart.vue'
export { default as ECharts } from './components/Charts/ECharts.vue'
export { default as FunnelChart } from './components/Charts/FunnelChart.vue'
export { default as NumberChart } from './components/Charts/NumberChart.vue'
export { default as useAxisChartOptions } from './components/Charts/axisChartOptions'

// Grid layout
export { default as GridLayout } from './components/VueGridLayout/Layout.vue'

// Browser and responsive composables
export * from './composables/useScreenSize'
export * from './composables/useScrollContainer'

// Directives
export { default as focusDirective } from './directives/focus'
export { default as onOutsideClickDirective } from './directives/onOutsideClick'
export { default as visibilityDirective } from './directives/visibility'

// Utilities
export { dayjs, dayjsLocal } from './utils/dayjs'
export { default as debounce } from './utils/debounce'
export { default as fileToBase64 } from './utils/file-to-base64'
export { default as FileUploadHandler } from './utils/fileUploadHandler'
export * from './utils/fileSize'
export * from './utils/theme'
export * from './utils/useFileUpload'
