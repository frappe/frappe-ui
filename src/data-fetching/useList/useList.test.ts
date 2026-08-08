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

  it('shows initialData before the first response arrives', () => {
    interface User {
      name: string
      email: string
    }

    const users = useList<User>({
      baseUrl,
      doctype: 'User',
      initialData: [{ name: 'placeholder', email: 'placeholder@example.com' }],
      immediate: false,
    })

    expect(users.data).toEqual([
      { name: 'placeholder', email: 'placeholder@example.com' },
    ])
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

  it('keeps cached data visible when a refetch fails', async () => {
    interface User {
      name: string
      email: string
    }

    const cacheKey = 'offline-users'
    const cachedUsers = useList<User>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      cacheKey,
      limit: 2,
    })

    await waitUntilValueChanges(() => cachedUsers.data)
    expect(cachedUsers.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
    ])

    const offlineUsers = useList<User>({
      baseUrl,
      doctype: 'InvalidDoctype',
      fields: ['name', 'email'],
      cacheKey,
      staleOnError: true,
      limit: 2,
    })

    await waitUntilValueChanges(() => offlineUsers.data)
    await waitUntilValueChanges(() => offlineUsers.loading)

    expect(offlineUsers.error).toBeTruthy()
    expect(offlineUsers.data).toStrictEqual([
      { name: 'User1', email: 'user1@example.com' },
      { name: 'User2', email: 'user2@example.com' },
    ])
  })
})

describe('useList concurrency', () => {
  interface User {
    name: string
    email: string
  }

  const list = () =>
    useList<User>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      immediate: false,
      refetch: false,
      limit: 2,
    })

  it('deletes two rows at once and gives each its own response', async () => {
    const users = list()

    const [slow, quick] = await Promise.all([
      users.delete.submit({ name: 'slow-user' }),
      users.delete.submit({ name: 'quick-user' }),
    ])

    expect(slow).toBe('deleted slow-user')
    expect(quick).toBe('deleted quick-user')
    expect(users.delete.error).toBe(null)
    expect(users.delete.loading).toBe(false)
  })

  it('reports delete isLoading per row', async () => {
    const users = list()

    const slow = users.delete.submit({ name: 'slow-user' })
    const quick = users.delete.submit({ name: 'quick-user' })

    expect(users.delete.isLoading('slow-user')).toBe(true)
    expect(users.delete.isLoading('quick-user')).toBe(true)

    await quick
    expect(users.delete.isLoading('quick-user')).toBe(false)
    expect(users.delete.isLoading('slow-user')).toBe(true)

    await slow
    expect(users.delete.loading).toBe(false)
  })

  it('saves two rows at once without crossing responses', async () => {
    const users = list()

    const [slow, quick] = await Promise.all([
      users.setValue.submit({ name: 'slow-user', email: 'slow@example.com' }),
      users.setValue.submit({ name: 'quick-user', email: 'quick@example.com' }),
    ])

    expect(slow).toMatchObject({
      name: 'slow-user',
      email: 'slow@example.com',
    })
    expect(quick).toMatchObject({
      name: 'quick-user',
      email: 'quick@example.com',
    })
    expect(users.setValue.error).toBe(null)
  })

  it('inserts two rows at once and honours baseUrl', async () => {
    const users = list()
    const fetchSpy = vi.spyOn(global, 'fetch')

    const [slow, quick] = await Promise.all([
      users.insert.submit({ name: 'slow-user', email: 'slow@example.com' }),
      users.insert.submit({ name: 'quick-user', email: 'quick@example.com' }),
    ])

    expect(slow).toMatchObject({ name: 'slow-user' })
    expect(quick).toMatchObject({ name: 'quick-user' })
    expect(fetchSpy).toHaveBeenCalledWith(
      `${baseUrl}/api/v2/document/User`,
      expect.objectContaining({ method: 'POST' }),
    )

    fetchSpy.mockRestore()
  })

  it('reports insert isLoading while an insert is in flight', async () => {
    const users = list()

    expect(users.insert.isLoading()).toBe(false)

    const done = users.insert.submit({ name: 'slow-user' })
    expect(users.insert.isLoading()).toBe(true)

    await done
    expect(users.insert.isLoading()).toBe(false)
  })

  it('rejects a failed delete and leaves the row in the list', async () => {
    const users = useList<User>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      immediate: false,
      refetch: false,
      limit: 2,
    })
    await users.fetch()

    await expect(users.delete.submit({ name: 'User1' })).resolves.toBe(
      'deleted User1',
    )
    expect(users.data).toHaveLength(1)

    await expect(users.delete.submit({ name: 'quick-fail' })).rejects.toThrow(
      'delete quick-fail failed',
    )
    expect(users.delete.error?.message).toContain('delete quick-fail failed')
    expect(users.data).toHaveLength(1)
  })

  it('keeps the newest response in setValue data when an older submit answers last', async () => {
    const users = list()

    await Promise.all([
      users.setValue.submit({ name: 'slow-user', email: 'slow@example.com' }),
      users.setValue.submit({ name: 'quick-user', email: 'quick@example.com' }),
    ])

    expect(users.setValue.data).toMatchObject({ name: 'quick-user' })
    expect(users.setValue.error).toBe(null)
  })
})
