// The package's public surface. `export *` is allowed only from a curated
// barrel — an `index.ts` whose export list was reviewed — never from an
// implementation module, where it publishes whatever that file happens to
// export next. See PHILOSOPHY.md, P15.

// App setup and plugins
export { default as FrappeUI } from './utils/plugin'
export { default as FrappeUIProvider } from './components/Provider/FrappeUIProvider.vue'
export { getConfig, setConfig } from './utils/config'
export type { FrappeUIConfig } from './utils/config'

// Data fetching
export * from './data-fetching'
// v1 resource API. Supported and frozen through 1.x, un-deprecated — see #886
// and ADR-0013 (implementation stays JS; no changes to internal code).
export * from './resources/index.ts'
// One HTTP transport. `request` stays internal — it is the bare fetch wrapper
// `frappeRequest` and the v1 resources are built on, with none of the Frappe
// response handling a consumer wants.
export { default as call } from './utils/call'
export { frappeRequest, type FrappeRequestError } from './utils/frappeRequest'

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
export * from './components/Checkbox'
export * from './components/Combobox'
export * from './components/DatePicker'
export * from './components/Duration'
export * from './components/ErrorMessage'
export * from './components/FileUploader'
export * from './components/FormControl'
export * from './components/FormLabel'
export * from './components/MultiSelect'
export * from './components/Password'
export * from './components/Radio'
export * from './components/Select'
// Shared by Select / MultiSelect / Combobox, so it belongs to the family
// rather than to any one of their barrels.
export type { SelectionExposed } from './components/shared/selection/types'
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
export {
  dialog,
  type ConfirmArgs,
  type DangerArgs,
  type DialogControl,
  type DialogHandle,
  type DialogNamespace,
  type PromptArgs,
  type PromptControl,
  type PromptField,
  type PromptFieldValidator,
} from './utils/dialog'
export { toast } from './components/Toast/toast'
export { default as ToastProvider } from './components/Toast/ToastProvider.vue'

// Lists and collection views
export * from './components/ItemListRow'
// Legacy ListView family. Ships frozen (not deprecated) for v1 — see the
// parity note in v1-release/plan.md's ListView row: `frappe-ui/list` is
// composition-based by design (P3) and doesn't replicate ListView's
// config-driven columns (resizable widths, per-column getLabel/prefix
// functions, tooltips, disabled-row exclusion, the select banner), so this
// isn't a "not yet" gap that will close on its own. Bringing ListView's own
// 12-export barrel to the at-bar checklist (TS conversion, types.ts, tests,
// docs) is tracked as a follow-up, not done in the same pass as this comment.
export * from './components/ListView'
export { default as ListFilter } from './components/ListFilter/ListFilter.vue'
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
export {
  formatShortcutLabel,
  getActiveShortcuts,
  matchesShortcut,
  useShortcut,
  type ActiveShortcut,
  type RegisteredShortcut,
  type ShortcutConfig,
} from './composables/useShortcut'

// Deprecated component compatibility
/** @deprecated Use layout markup or domain-specific components instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as Card } from './components/Card.vue'
/** @deprecated Use lucide icon names or the `Icon` component instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as FeatherIcon } from './components/FeatherIcon.vue'
/** @deprecated Use list primitives from `frappe-ui/list` or app-owned row markup instead. */
// @ts-expect-error Deprecated JS SFC compatibility export.
export { default as ListItem } from './components/ListItem.vue'
/** @deprecated Use `Select` for month picking instead. */
export * from './components/MonthPicker'
/** @deprecated Use the imperative `toast(...)` API instead. The `<Toast />` SFC will be removed in a future major. */
export { default as Toast } from './components/Toast/Toast.vue'
/** @deprecated Use `Select` with `useColorScheme` instead. */
export * from './components/ThemeSwitcher'

// Charts
export { default as AxisChart } from './components/Charts/AxisChart.vue'
export { default as DonutChart } from './components/Charts/DonutChart.vue'
export { default as ECharts } from './components/Charts/ECharts.vue'
export { default as FunnelChart } from './components/Charts/FunnelChart.vue'
export { default as NumberChart } from './components/Charts/NumberChart.vue'
export { default as useAxisChartOptions } from './components/Charts/axisChartOptions'

// Composables
export { usePageMeta, type PageMeta } from './utils/pageMeta'
export { useColorScheme, type ColorScheme } from './composables/useColorScheme'
export {
  shellScrollContainer,
  useShellScrolled,
} from './composables/useShellScrolled'
export {
  useSheetDrag,
  type UseSheetDrag,
  type UseSheetDragOptions,
} from './composables/useSheetDrag'

// Embedding: name one portal target for every overlay under a Vue app
export {
  portalTargetKey,
  providePortalTarget,
  usePortalTarget,
} from './composables/usePortalTarget'
export type { PortalTarget } from './composables/usePortalTarget'

// Directives
export { vFocus } from './directives/focus'
export { vOnOutsideClick } from './directives/onOutsideClick'

// Utilities
export { dayjs, dayjsLocal } from './utils/dayjs'
export { default as debounce } from './utils/debounce'
export { default as fileToBase64 } from './utils/file-to-base64'
export { default as FileUploadHandler } from './utils/fileUploadHandler'
export {
  fileSizeLimitMessage,
  formatBytes,
  getMaxFileSize,
} from './utils/fileSize'
export {
  isPrivateUpload,
  upload,
  useFileUpload,
  type UploadedFile,
  type UploadOptions,
  type UploadPrivacy,
  type UploadState,
} from './utils/useFileUpload'
