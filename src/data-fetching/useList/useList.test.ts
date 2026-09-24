/**
 * @vitest-environment node
 */

import { ref } from 'vue'
import { http, HttpResponse } from 'msw'
import {
  baseUrl,
  signInAs,
  url,
  waitUntilValueChanges,
} from '../../mocks/utils'
import { server } from '../../mocks/node'
import { useList } from '../index'
import { idbStore } from '../idbStore'

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

  it('caches rows as the server sent them and transforms them once on read', async () => {
    // Each row carries a JSON string that `transform` parses. Parsing it a
    // second time throws, so the cache must never hand `transform` a row it
    // has already transformed.
    server.use(
      http.get(url('/api/v2/document/Activity'), ({ request }) => {
        let start = Number(new URL(request.url).searchParams.get('start'))
        return HttpResponse.json({
          data: [start + 1, start + 2].map((n) => ({
            name: `A${n}`,
            data: JSON.stringify({ n }),
          })),
        })
      }),
    )

    interface Activity {
      name: string
      data: string | { n: number }
    }
    const options = {
      baseUrl,
      doctype: 'Activity',
      cacheKey: 'parsed-activities',
      limit: 2,
      immediate: false,
      transform: (rows: Activity[]) =>
        rows.map((row) => ({ ...row, data: JSON.parse(row.data as string) })),
    }
    const expected = [1, 2, 3, 4].map((n) => ({ name: `A${n}`, data: { n } }))

    const activities = useList<Activity>(options)
    await activities.fetch()

    // A reload shows the cached rows while it is in flight.
    const reloading = activities.reload()
    expect(activities.data).toStrictEqual(expected.slice(0, 2))
    await reloading

    activities.next()
    await waitUntilValueChanges(() => activities.data)
    expect(activities.data).toStrictEqual(expected)

    // A second list with the same key starts from the cache, both pages.
    const reopened = useList<Activity>(options)
    await vi.waitFor(() => expect(reopened.data).toStrictEqual(expected))
  })
})

describe('useList per user', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const cachedList = (cacheKey: string) =>
    useList<{ name: string; email: string }>({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      cacheKey,
      limit: 2,
      immediate: false,
    })

  it('rows one user cached are not read by another user or a guest', async () => {
    signInAs('alice@example.com')
    const alices = useList({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      cacheKey: 'per-user-users',
      limit: 2,
    })
    await waitUntilValueChanges(() => alices.data)
    expect(alices.data).toHaveLength(2)

    signInAs('bob@example.com')
    const bobs = cachedList('per-user-users')
    signInAs('Guest')
    const guests = cachedList('per-user-users')
    signInAs(null)
    const noSession = cachedList('per-user-users')
    signInAs('alice@example.com')
    const alicesAgain = cachedList('per-user-users')

    await waitUntilValueChanges(() => alicesAgain.data)
    expect(alicesAgain.data).toStrictEqual(alices.data)
    expect(bobs.data).toBe(null)
    expect(guests.data).toBe(null)
    expect(noSession.data).toBe(null)
  })

  it.each([
    ['no session', null],
    ['a guest', 'Guest'],
  ])('with %s, rows keep the un-namespaced key', async (_, user) => {
    signInAs(user)
    const users = useList({
      baseUrl,
      doctype: 'User',
      fields: ['name', 'email'],
      cacheKey: ['plain-users', String(user)],
      limit: 2,
    })
    await waitUntilValueChanges(() => users.data)
    expect(
      await idbStore.get(`["useList:v2","plain-users","${user}"]`),
    ).toStrictEqual(users.data)
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
