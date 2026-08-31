// The package's public surface. `export *` is allowed only from a curated
// barrel — an `index.ts` whose export list was reviewed — never from an
// implementation module, where it publishes whatever that file happens to
// export next. See PHILOSOPHY.md, P15.

// App setup and plugins
export { default as FrappeUI } from './utils/plugin'
export { FrappeUIProvider } from './components/FrappeUIProvider'
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
export * from './components/LoadingIndicator'
export * from './components/LoadingText'
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
export type { StatusTheme } from './components/shared/statusIcon'
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
// ListView family moved to `frappe-ui/experimental` (#985, P14) — it stays
// there, unstable, until `frappe-ui/list` reaches functional parity. See
// v1-release/plan.md's ListView row.
// Calendar family moved to `frappe-ui/experimental` (#1020, P14) — parked
// there, API unchanged, until a redesigned calendar family replaces it.
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
export * from './components/Tabs'

// Command and keyboard surfaces
// CommandPalette left the root export in `1.0.0` (P14). It is rebuilt as a
// seven-part family in `frappe-ui/experimental`, where the API can still
// change.
export * from './components/KeyboardShortcut'
export * from './components/KeyboardShortcutsDialog'
export {
  useKeyboardShortcut,
  type HoldKeyboardShortcutConfig,
  type KeyboardShortcutCombo,
  type KeyboardShortcutConfig,
  type KeyboardShortcutEntry,
  type KeyboardShortcutGroup,
  type KeyboardShortcutKey,
  type PressKeyboardShortcutConfig,
} from './composables/useKeyboardShortcut'

// ThemeSwitcher moved to `frappe-ui/experimental` (#1094, P14) — parked
// there, deprecated, while apps move to `Select` plus `useColorScheme`.

// v1 Charts family moved to `frappe-ui/experimental` (#942, P14) — parked
// there, API unchanged, while apps migrate to `frappe-ui/charts`.

// Composables
export { usePageMeta, type PageMeta } from './utils/pageMeta'
export {
  useColorScheme,
  resolvedColorScheme,
  type ColorScheme,
  type ResolvedColorScheme,
} from './composables/useColorScheme'
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
// FileUploadHandler is the class FileUploader is built on; useFileUpload is
// the recommended composable entry point for headless/custom-UI uploads.
// fileToBase64 and the fileSize helpers (formatBytes, getMaxFileSize,
// fileSizeLimitMessage) had zero external consumers at the v1 sweep — they
// stay internal to the upload paths that use them.
export { default as FileUploadHandler } from './utils/fileUploadHandler'
export {
  isPrivateUpload,
  upload,
  useFileUpload,
  type UploadedFile,
  type UploadOptions,
  type UploadPrivacy,
  type UploadState,
} from './utils/useFileUpload'
