/**
 * @vitest-environment node
 */

import { ref } from 'vue'
import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useList } from '../index'

describe('useList', () => {
  it('it returns expected object', async () => {
    interface User {
      name: string
      email: string
    }

    let users = useList<User>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      groupBy: 'name',
      orderBy: 'email asc',
      start: 0,
      limit: 2,
      immediate: false,
    })

    // Verify initial state
    expect(users.data).toBe(null)
    expect(users.error).toBe(null)
    expect(users.hasNextPage).toBe(true)
    expect(typeof users.fetch).toBe('function')

    // fetch
    await users.fetch()

    // Verify final state
    expect(users.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
    ])
    expect(users.error).toBe(null)
    expect(users.isFinished).toBe(true)
    expect(users.loading).toBe(false)
  })

  it('handles pagination correctly', async () => {
    const users = useList({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      limit: 2,
      immediate: false,
    })

    await users.fetch()

    expect(users.hasNextPage).toBe(true)
    expect(users.hasPreviousPage).toBe(false)
    expect(users.start).toBe(0)

    users.next()
    await waitUntilValueChanges(() => users.data)

    expect(users.start).toBe(2)
    expect(users.hasPreviousPage).toBe(true)
    expect(users.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
      { name: 'User3', email: 'user3@example.com' },
      { name: 'User4', email: 'user4@example.com' },
    ])

    await users.previous()
    expect(users.start).toBe(0)
    expect(users.hasPreviousPage).toBe(false)
  })

  it('dynamic filters should refetch the list', async () => {
    const query = ref('user1')
    const users = useList({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      filters: {
        email: ['like', query],
      },
      limit: 3,
    })

    await waitUntilValueChanges(() => users.data)
    expect(users.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
    ])

    query.value = 'user2'
    await waitUntilValueChanges(() => users.data)
    expect(users.data).toStrictEqual([
      { name: 'User2', email: 'user2@example.com' },
    ])
  })

  it('params are parsed and sent to server correctly', async () => {
    const query = ref('user1')
    const users = useList({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      filters: {
        name: 'User1',
        email: ['like', query],
      },
      limit: 2,
      immediate: false,
    })

    // intercept fetch and check request params
    const fetchSpy = vi.spyOn(global, 'fetch')

    await users.fetch()

    let searchParams = new URLSearchParams({
      fields: JSON.stringify(['name', 'email']),
      filters: JSON.stringify({
        name: 'User1',
        email: ['like', '%user1%'],
      }),
      start: '0',
      limit: '2',
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `${baseUrl}/api/v2/document/User?${searchParams.toString()}`,
      ),
      expect.any(Object),
    )

    fetchSpy.mockRestore()
  })

  it('transforms data using transform function', async () => {
    const users = useList({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      transform: (data) => {
        return data.map((user) => ({
          ...user,
          displayName: user.name.toUpperCase(),
        }))
      },
      immediate: false,
    })

    await users.fetch()
    // @ts-ignore
    expect(users.data[0].displayName).toBe('USER1')
  })

  it('handles errors correctly', async () => {
    let errorCaught = null
    const users = useList({
      baseUrl,
      doctype: 'InvalidDoctype',
      onError: (error) => {
        errorCaught = error
      },
      immediate: false,
    })

    await users.fetch()
    expect(users.error).toBeTruthy()
    expect(errorCaught).toBeTruthy()
  })

  it('it caches response if cacheKey is provided', async () => {
    interface User {
      name: string
      email: string
    }

    let users = useList<User>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      orderBy: 'email asc',
      cacheKey: 'users',
      start: 0,
      limit: 2,
    })

    await waitUntilValueChanges(() => users.data)
    expect(users.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
    ])

    let users2 = useList<User>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      orderBy: 'email asc',
      cacheKey: 'users',
      start: 0,
      limit: 2,
      immediate: false,
    })

    await waitUntilValueChanges(() => users2.data)
    expect(users2.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
    ])
  })
})
