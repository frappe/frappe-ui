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
  DateRangeValue,
  Dayjs,
  ErrorMessageValue,
  ImperativeDialogAction,
  InputExposed,
  InputLabelingProps,
  PickerExposed,
  RouteDestination,
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
  DateRangeValue,
  Dayjs,
  ErrorMessageValue,
  ImperativeDialogAction,
  InputExposed,
  InputLabelingProps,
  PickerExposed,
  RouteDestination,
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
    for (const name of ['isPrivateUpload', 'dayjsSystem']) {
      expect(root).not.toHaveProperty(name)
    }
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

type RemovedTypes = [
  FrappeUIError,
  UploadPrivacy,
  DialogIcon,
  DatePickerViewMode,
  DatePickerDateObj,
]
