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

describe('root exports', () => {
  it('exports the dayjs helpers apps use, and keeps dayjsSystem private', () => {
    expect(root).toHaveProperty('dayjs')
    expect(root).toHaveProperty('dayjsLocal')
    expect(root).not.toHaveProperty('dayjsSystem')
  })

  it('exports the upload error and no privacy resolver', () => {
    expect(root).toHaveProperty('UploadError')
    expect(root).not.toHaveProperty('isPrivateUpload')
  })

  it('drops the names v1 removed', () => {
    for (const name of [
      // VOC-Q4: the input error prop is typed inline; no owned name replaces it
      'FrappeUIError',
      // DAT-Q4
      'UploadPrivacy',
    ]) {
      expect(root).not.toHaveProperty(name)
    }
  })
})
