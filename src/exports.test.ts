/**
 * @vitest-environment jsdom
 *
 * The package's public surface, asserted by name.
 *
 * `export *` from an implementation module publishes whatever that file
 * exports next (PHILOSOPHY.md, P15). The barrels below list their names, and
 * these tests fail when a name appears or disappears without the list being
 * updated — including the names v1 removed on purpose.
 */

import { describe, expect, it } from 'vitest'
import * as root from './index'
import type {
  ColorScheme,
  DateRangeValue,
  Dayjs,
  DesktopShellProps,
  ErrorMessageValue,
  ImperativeDialogAction,
  InputExposed,
  InputLabelingProps,
  PageHeaderBackButtonProps,
  PageHeaderMobileProps,
  PageHeaderMobileTitleProps,
  PageHeaderTitleProps,
  PickerExposed,
  ResolvedColorScheme,
  RouteDestination,
  ScrollAreaExposed,
  SelectionGroup,
  SelectionOption,
  ToastAction,
  ToastId,
  ToastOptions,
} from './index'
import * as resources from './resources/index'
import * as local from './resources/local'
import * as realtime from './resources/realtime'

describe('resources barrel', () => {
  it('names every export instead of re-exporting a module wholesale', () => {
    expect(Object.keys(resources).sort()).toEqual([
      'createDocumentResource',
      'createListResource',
      'createResource',
      'deleteLocal',
      'getCachedDocumentResource',
      'getCachedListResource',
      'getCachedResource',
      'getLocal',
      'onDocUpdate',
      'resourcesPlugin',
      'saveLocal',
    ])
  })

  it('publishes the idb and realtime helpers the list names, and no others', () => {
    for (const name of Object.keys(local)) {
      expect(resources).toHaveProperty(name)
    }
    for (const name of Object.keys(realtime)) {
      expect(resources).toHaveProperty(name)
    }
  })
})

/**
 * Types are erased at runtime, so the assertions above cannot see them. This
 * alias is the check: `yarn type-check` covers this file, and a type that
 * stops being exported fails to resolve here.
 */
type PublicTypes = [
  ColorScheme,
  DateRangeValue,
  Dayjs,
  DesktopShellProps,
  ErrorMessageValue,
  ImperativeDialogAction,
  InputExposed,
  InputLabelingProps,
  PageHeaderBackButtonProps,
  PageHeaderMobileProps,
  PageHeaderMobileTitleProps,
  PageHeaderTitleProps,
  PickerExposed,
  ResolvedColorScheme,
  RouteDestination,
  ScrollAreaExposed,
  ToastAction,
  ToastId,
  ToastOptions,
  SelectionGroup,
  SelectionOption,
]

describe('root exports', () => {
  it('keeps the public type names resolvable', () => {
    const names: PublicTypes[number] extends never ? never : true = true

    expect(names).toBe(true)
  })

  it('exports the dayjs helpers apps use, and keeps dayjsSystem private', () => {
    expect(root).toHaveProperty('dayjs')
    expect(root).toHaveProperty('dayjsLocal')
    expect(root).not.toHaveProperty('dayjsSystem')
  })

  it('exports the upload error and no privacy resolver', () => {
    expect(root).toHaveProperty('UploadError')
    expect(root).not.toHaveProperty('isPrivateUpload')
  })

  it('drops the value exports v1 removed', () => {
    for (const name of [
      'isPrivateUpload',
      'dayjsSystem',
      // SHELL-Q6: ScrollArea draws its own bars; ScrollBar has no use alone.
      'ScrollBar',
      // SHELL-Q7: BottomSheet is the only caller.
      'useSheetDrag',
      // SHELL-Q11: the getter reads the document once and does not react.
      'resolvedColorScheme',
      'getResolvedColorScheme',
    ]) {
      expect(root).not.toHaveProperty(name)
    }
  })

  it('keeps the color-scheme composable', () => {
    // SHELL-Q11: the resolved value is a read-only ref on the composable now,
    // not a root function. `useColorScheme.spec.ts` covers the ref itself.
    expect(root).toHaveProperty('useColorScheme')
  })

  it('keeps the shell exports v1 kept', () => {
    expect(root).toHaveProperty('ScrollArea')
    expect(root).toHaveProperty('DesktopShell')
    expect(root).toHaveProperty('MobileShell')
    expect(root).toHaveProperty('shellScrollContainer')
    expect(root).toHaveProperty('useShellScrolled')
  })
})

/**
 * Removed *types* leave nothing behind at runtime, so the checks above cannot
 * see them either. Each import below must fail to resolve; `@ts-expect-error`
 * turns it into a type error when the name comes back.
 */
// @ts-expect-error VOC-Q4: the input error prop is typed inline, with no owned name
import type { FrappeUIError } from './index'
// @ts-expect-error DAT-Q4: `private` is the only upload privacy option
import type { UploadPrivacy } from './index'
// @ts-expect-error OVR-Q5: Dialog takes `icon` and `theme` separately
import type { DialogIcon } from './index'
// @ts-expect-error INP-Q14: calendar internals, published by the old wildcard
import type { DatePickerViewMode } from './index'
// @ts-expect-error INP-Q14: calendar internals, published by the old wildcard
import type { DatePickerDateObj } from './index'
// @ts-expect-error SHELL-Q6: ScrollBar is not a public component
import type { ScrollBarProps } from './index'
// @ts-expect-error SHELL-Q7: useSheetDrag is internal to BottomSheet
import type { UseSheetDrag } from './index'
// @ts-expect-error SHELL-Q7: useSheetDrag is internal to BottomSheet
import type { UseSheetDragOptions } from './index'

type RemovedTypes = [
  FrappeUIError,
  UploadPrivacy,
  DialogIcon,
  DatePickerViewMode,
  DatePickerDateObj,
  ScrollBarProps,
  UseSheetDrag,
  UseSheetDragOptions,
]
