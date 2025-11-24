/**
 * @vitest-environment node
 */

import { ref } from 'vue'
import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useBulkUpdate } from '../index'

describe.skip('useBulkUpdate', () => {
  it('it returns expected object', async () => {
    let bulkUpdate = useBulkUpdate({ baseUrl })

    // Verify initial state
    expect(bulkUpdate.data).toBe(null)
    expect(bulkUpdate.error).toBe(null)
    expect(typeof bulkUpdate.submit).toBe('function')

    bulkUpdate.submit([
      { doctype: 'User', name: 'user3', email: 'user3@example.com' },
      { doctype: 'User', name: 'user4', email: 'user4@example.com' },
      { doctype: 'User', name: 'user5', email: 'user5@example.com' },
    ])

    await waitUntilValueChanges(() => bulkUpdate.data)

    console.log(bulkUpdate)

    // Verify final state
    expect(bulkUpdate.data).toStrictEqual([
      { doctype: 'User', name: 'user3', email: 'user3@example.com' },
      { doctype: 'User', name: 'user4', email: 'user4@example.com' },
      { doctype: 'User', name: 'user5', email: 'user5@example.com' },
    ])
    expect(bulkUpdate.error).toBe(null)
    expect(bulkUpdate.isFinished).toBe(true)
    expect(bulkUpdate.loading).toBe(false)
  })
})
