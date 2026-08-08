/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createListResource, getCachedListResource } from './listResource'
import { setConfig } from '../utils/config'

function makeUsers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: `USER-${i + 1}`,
    status: 'Active',
  }))
}

describe('createListResource', () => {
  let users: any[]
  let getListCallCount: number

  beforeEach(() => {
    users = makeUsers(5)
    getListCallCount = 0
    setConfig('resourceFetcher', async (options: any) => {
      if (options.url === 'frappe.client.get_list') {
        getListCallCount++
        let { start = 0, limit_page_length = 20 } = options.params
        return users.slice(start, start + limit_page_length)
      }
      if (options.url === 'frappe.client.insert') {
        let doc = {
          name: `USER-${users.length + 1}`,
          ...options.params.doc,
        }
        users.push(doc)
        return doc
      }
      if (options.url === 'frappe.client.set_value') {
        let { name, fieldname } = options.params
        let doc = users.find((u) => u.name === name)
        Object.assign(doc, fieldname)
        // a fresh object, distinct from the one already sitting in
        // list.data — otherwise the assertion below would pass even if
        // updateRowInListResource were deleted, because get_list and
        // set_value would be handing out the same row reference
        return { ...doc }
      }
      throw new Error(`unexpected request to ${options.url}`)
    })
  })

  afterEach(() => {
    setConfig('resourceFetcher', undefined)
  })

  it('requires a doctype', () => {
    expect(() => createListResource({})).toThrow(
      'List resource requires doctype',
    )
  })

  it('fetches the first page with default props', async () => {
    let list = createListResource({
      doctype: 'ListResourceTestPage',
      pageLength: 2,
      auto: false,
    })

    await list.list.fetch()

    expect(list.data!.map((u: any) => u.name)).toEqual(['USER-1', 'USER-2'])
    expect(list.hasPreviousPage).toBe(false)
    expect(list.hasNextPage).toBe(true)
  })

  it('hasNextPage is false once a page comes back short of pageLength', async () => {
    let list = createListResource({
      doctype: 'ListResourceTestLastPage',
      pageLength: 20,
      auto: false,
    })

    await list.list.fetch()

    // 5 users on a 20-row page: the page is short, so there is no next page
    expect(list.data).toHaveLength(5)
    expect(list.hasNextPage).toBe(false)
  })

  it('paginates forward and back with next()/previous()', async () => {
    let list = createListResource({
      doctype: 'ListResourceTestPaginate',
      pageLength: 2,
      auto: false,
    })
    await list.list.fetch()

    list.next()
    await list.list.promise
    expect(list.start).toBe(2)
    expect(list.data!.map((u: any) => u.name)).toEqual([
      'USER-1',
      'USER-2',
      'USER-3',
      'USER-4',
    ])
    expect(list.hasPreviousPage).toBe(true)

    list.previous()
    await list.list.promise
    expect(list.start).toBe(0)
    expect(list.data!.map((u: any) => u.name)).toEqual(['USER-1', 'USER-2'])
  })

  it('inserting a row refreshes the list', async () => {
    let list = createListResource({
      doctype: 'ListResourceTestInsert',
      pageLength: 20,
      auto: false,
    })
    await list.list.fetch()
    expect(list.data).toHaveLength(5)

    await list.insert.submit({ status: 'Active' })
    await list.list.promise
    expect(list.data).toHaveLength(6)
  })

  it('setValue updates the matching row in place, without a refetch', async () => {
    let list = createListResource({
      doctype: 'ListResourceTestSetValue',
      pageLength: 20,
      auto: false,
    })
    await list.list.fetch()
    expect(getListCallCount).toBe(1)

    await list.setValue.submit({ name: 'USER-2', status: 'Inactive' })

    // no second list.list fetch — the row updates in place
    expect(getListCallCount).toBe(1)
    expect(list.getRow('USER-2').status).toBe('Inactive')
    expect(list.data!.find((u: any) => u.name === 'USER-1').status).toBe(
      'Active',
    )
  })

  it('caches by cache key and reuses the same reactive resource', () => {
    let list = createListResource({
      doctype: 'ListResourceTestCache',
      cache: 'list-resource-test-cache-key',
      auto: false,
    })

    expect(
      createListResource({
        doctype: 'ListResourceTestCache',
        cache: 'list-resource-test-cache-key',
        auto: false,
      }),
    ).toBe(list)
    expect(getCachedListResource('list-resource-test-cache-key')).toBe(list)
  })

  it('reload() re-fetches from the start, then restores pagination state', async () => {
    let list = createListResource({
      doctype: 'ListResourceTestReload',
      pageLength: 2,
      auto: false,
    })
    await list.list.fetch()
    list.next()
    await list.list.promise
    expect(list.start).toBe(2)
    expect(list.data).toHaveLength(4)

    // mutate the backing store so a real re-fetch is observable
    users[0].status = 'Inactive'

    await list.reload()

    // pagination state is restored to what it was before reload()
    expect(list.start).toBe(2)
    expect(list.pageLength).toBe(2)
    // the accumulated 4 rows are still there, freshly re-fetched
    expect(list.data).toHaveLength(4)
    expect(list.data!.map((u: any) => u.name)).toEqual([
      'USER-1',
      'USER-2',
      'USER-3',
      'USER-4',
    ])
    expect(list.data![0].status).toBe('Inactive')
    // hasPreviousPage reflects the restored start, not the temporary 0 used
    // for the single-page re-fetch inside reload()
    expect(list.hasPreviousPage).toBe(true)
  })
})
