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

  beforeEach(() => {
    users = makeUsers(5)
    setConfig('resourceFetcher', async (options: any) => {
      if (options.url === 'frappe.client.get_list') {
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
        return doc
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
      doctype: 'User',
      pageLength: 2,
      auto: false,
    })

    await list.list.fetch()

    expect(list.data.map((u: any) => u.name)).toEqual(['USER-1', 'USER-2'])
    expect(list.hasPreviousPage).toBe(false)
    expect(list.hasNextPage).toBe(true)
  })

  it('paginates forward and back with next()/previous()', async () => {
    let list = createListResource({
      doctype: 'User',
      pageLength: 2,
      auto: false,
    })
    await list.list.fetch()

    list.next()
    await list.list.promise
    expect(list.start).toBe(2)
    expect(list.data.map((u: any) => u.name)).toEqual([
      'USER-1',
      'USER-2',
      'USER-3',
      'USER-4',
    ])
    expect(list.hasPreviousPage).toBe(true)

    list.previous()
    await list.list.promise
    expect(list.start).toBe(0)
    expect(list.data.map((u: any) => u.name)).toEqual(['USER-1', 'USER-2'])
  })

  it('inserting a row refreshes the list', async () => {
    let list = createListResource({
      doctype: 'User',
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
      doctype: 'User',
      pageLength: 20,
      auto: false,
    })
    await list.list.fetch()

    await list.setValue.submit({ name: 'USER-2', status: 'Inactive' })

    expect(list.getRow('USER-2').status).toBe('Inactive')
    // the row updated in place; no second list.list fetch was needed
    expect(list.data.find((u: any) => u.name === 'USER-1').status).toBe(
      'Active',
    )
  })

  it('caches by cache key and reuses the same reactive resource', () => {
    let list = createListResource({
      doctype: 'User',
      cache: 'user-list',
      auto: false,
    })

    expect(
      createListResource({ doctype: 'User', cache: 'user-list', auto: false }),
    ).toBe(list)
    expect(getCachedListResource('user-list')).toBe(list)
  })

  it('reload() re-fetches from the start, then restores pagination state', async () => {
    let list = createListResource({
      doctype: 'User',
      pageLength: 2,
      auto: false,
    })
    await list.list.fetch()
    list.next()
    await list.list.promise
    expect(list.start).toBe(2)

    await list.reload()

    expect(list.start).toBe(2)
    expect(list.pageLength).toBe(2)
  })
})
