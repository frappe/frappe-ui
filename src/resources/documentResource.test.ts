/**
 * @vitest-environment node
 */

import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDocumentResource } from './documentResource'
import { setConfig } from '../utils/config'

// A doc as returned by frappe.client.get — includes read-only standard fields
const STANDARD_FIELDS = {
  owner: 'Administrator',
  creation: '2026-06-26 17:25:10',
  modified: '2026-06-26 17:25:10',
  modified_by: 'Administrator',
  docstatus: 0,
  idx: 0,
}

function makeServerDoc(doctype: string, name: string, overrides = {}) {
  return {
    doctype,
    name,
    ...STANDARD_FIELDS,
    status: 'Open',
    title: 'Original title',
    ...overrides,
  }
}

describe('documentResource save', () => {
  // captures the params passed to frappe.client.set_value by the save resource
  let capturedSetValueParams: any = null

  beforeEach(() => {
    capturedSetValueParams = null
    setConfig('resourceFetcher', async (options: any) => {
      if (options.url === 'frappe.client.set_value') {
        capturedSetValueParams = options.params
        // server echoes back the full doc on update
        return makeServerDoc(
          options.params.doctype,
          options.params.name,
          options.params.fieldname,
        )
      }
      if (options.url === 'frappe.client.get') {
        return makeServerDoc(options.params.doctype, options.params.name)
      }
      throw new Error(`unexpected request to ${options.url}`)
    })
  })

  afterEach(() => {
    setConfig('resourceFetcher', undefined)
  })

  it('sends only changed fields and strips standard fields', async () => {
    const doc = createDocumentResource(
      { doctype: 'CRM Deal', name: 'DEAL-0001', auto: false },
      {},
    )

    await doc.get.fetch()
    expect(doc.doc.owner).toBe('Administrator') // standard fields are present locally

    doc.doc.status = 'Proposal/Quotation'
    await nextTick()

    await doc.save.submit()

    const fieldname = capturedSetValueParams.fieldname
    // only the changed field is sent
    expect(fieldname).toEqual({ status: 'Proposal/Quotation' })
    // none of the standard fields leak into the payload
    for (const key of Object.keys(STANDARD_FIELDS)) {
      expect(fieldname).not.toHaveProperty(key)
    }
    // identity fields are not part of fieldname
    expect(fieldname).not.toHaveProperty('doctype')
    expect(fieldname).not.toHaveProperty('name')
  })

  it('sends an empty fieldname when nothing changed', async () => {
    const doc = createDocumentResource(
      { doctype: 'CRM Deal', name: 'DEAL-0002', auto: false },
      {},
    )

    await doc.get.fetch()
    await doc.save.submit()

    expect(capturedSetValueParams.fieldname).toEqual({})
  })

  it('sends only the changed subset when multiple fields exist', async () => {
    const doc = createDocumentResource(
      { doctype: 'CRM Deal', name: 'DEAL-0003', auto: false },
      {},
    )

    await doc.get.fetch()
    doc.doc.title = 'Updated title'
    await nextTick()

    await doc.save.submit()

    expect(capturedSetValueParams.fieldname).toEqual({ title: 'Updated title' })
  })
})
