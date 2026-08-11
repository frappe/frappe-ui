/**
 * @vitest-environment node
 */

import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useDoctype } from '../index'
import { docStore } from '../docStore'
import { LOCAL_WRITE } from '../writeGate'

interface User {
  name: string
  email: string
}

describe('useDoctype', () => {
  it('insert api', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    const fetchSpy = vi.spyOn(global, 'fetch')

    user.insert.submit({ name: 'John Doe', email: 'john@example.com' })

    await waitUntilValueChanges(() => user.insert.loading, false)
    expect(user.insert.loading).toBe(false)

    expect(fetchSpy).toHaveBeenCalledWith(
      `${baseUrl}/api/v2/document/User`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
        }),
      }),
    )

    fetchSpy.mockRestore()
  })

  it('delete api', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    const fetchSpy = vi.spyOn(global, 'fetch')

    user.delete.submit({ name: 'user1' })
    await waitUntilValueChanges(() => user.delete.loading)
    expect(user.delete.loading).toBe(false)

    expect(fetchSpy).toHaveBeenCalledWith(
      `${baseUrl}/api/v2/document/User/user1`,
      expect.objectContaining({ method: 'DELETE' }),
    )

    fetchSpy.mockRestore()
  })

  it('runDocMethod api', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    const fetchSpy = vi.spyOn(global, 'fetch')

    user.runDocMethod.submit({
      name: 'user1',
      method: 'reset_password',
      params: {
        send_email: true,
        password: 'newpassword',
      },
    })
    await waitUntilValueChanges(() => user.runDocMethod.loading)
    expect(user.runDocMethod.loading).toBe(false)

    expect(fetchSpy).toHaveBeenCalledWith(
      `${baseUrl}/api/v2/document/User/user1/method/reset_password`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          send_email: true,
          password: 'newpassword',
        }),
      }),
    )

    fetchSpy.mockRestore()
  })
})

describe('useDoctype concurrency', () => {
  it('runs two runMethod submits at once and gives each its own response', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let [slow, quick] = await Promise.all([
      user.runMethod.submit({ method: 'slow_count', params: { page: 1 } }),
      user.runMethod.submit({ method: 'quick_count', params: { page: 2 } }),
    ])

    expect(slow).toEqual({ method: 'slow_count', page: 1 })
    expect(quick).toEqual({ method: 'quick_count', page: 2 })
    expect(user.runMethod.error).toBe(null)
    expect(user.runMethod.loading).toBe(false)
  })

  it('reports runMethod isLoading per method while two submits are in flight', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let slow = user.runMethod.submit({ method: 'slow_count' })
    let quick = user.runMethod.submit({ method: 'quick_count' })

    expect(user.runMethod.isLoading('slow_count')).toBe(true)
    expect(user.runMethod.isLoading('quick_count')).toBe(true)
    expect(user.runMethod.isLoading('untouched')).toBe(false)

    await quick
    expect(user.runMethod.isLoading('quick_count')).toBe(false)
    expect(user.runMethod.isLoading('slow_count')).toBe(true)

    await slow
    expect(user.runMethod.isLoading('slow_count')).toBe(false)
    expect(user.runMethod.loading).toBe(false)
  })

  it('runs two runDocMethod submits at once and gives each its own response', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let [slow, quick] = await Promise.all([
      user.runDocMethod.submit({ name: 'slow-user', method: 'archive' }),
      user.runDocMethod.submit({ name: 'quick-user', method: 'archive' }),
    ])

    expect(slow).toEqual({ name: 'slow-user', method: 'archive' })
    expect(quick).toEqual({ name: 'quick-user', method: 'archive' })
    expect(user.runDocMethod.isLoading('slow-user', 'archive')).toBe(false)
    expect(user.runDocMethod.error).toBe(null)
  })

  it('deletes two documents at once and removes both from the doc store', async () => {
    await docStore.setDoc({ doctype: 'User', name: 'slow-user' }, LOCAL_WRITE)
    await docStore.setDoc({ doctype: 'User', name: 'quick-user' }, LOCAL_WRITE)

    let user = useDoctype<User>('User', { baseUrl })

    let [slow, quick] = await Promise.all([
      user.delete.submit({ name: 'slow-user' }),
      user.delete.submit({ name: 'quick-user' }),
    ])

    expect(slow).toBe('deleted slow-user')
    expect(quick).toBe('deleted quick-user')
    expect(user.delete.error).toBe(null)
    expect(docStore.getDoc('User', 'slow-user').value).toBe(null)
    expect(docStore.getDoc('User', 'quick-user').value).toBe(null)
  })

  it('reports delete isLoading per document name', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let slow = user.delete.submit({ name: 'slow-user' })
    let quick = user.delete.submit({ name: 'quick-user' })

    expect(user.delete.isLoading('slow-user')).toBe(true)
    expect(user.delete.isLoading('quick-user')).toBe(true)

    await quick
    expect(user.delete.isLoading('quick-user')).toBe(false)
    expect(user.delete.isLoading('slow-user')).toBe(true)

    await slow
    expect(user.delete.loading).toBe(false)
  })

  it('sets values on two documents at once without crossing responses', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let [slow, quick] = await Promise.all([
      user.setValue.submit({ name: 'slow-user', email: 'slow@example.com' }),
      user.setValue.submit({ name: 'quick-user', email: 'quick@example.com' }),
    ])

    expect(slow).toMatchObject({
      name: 'slow-user',
      email: 'slow@example.com',
    })
    expect(quick).toMatchObject({
      name: 'quick-user',
      email: 'quick@example.com',
    })
    expect(user.setValue.error).toBe(null)
    expect(user.setValue.isLoading('slow-user')).toBe(false)
  })

  it('inserts two documents at once and gives each its own response', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let [slow, quick] = await Promise.all([
      user.insert.submit({ name: 'slow-user', email: 'slow@example.com' }),
      user.insert.submit({ name: 'quick-user', email: 'quick@example.com' }),
    ])

    expect(slow).toMatchObject({ name: 'slow-user' })
    expect(quick).toMatchObject({ name: 'quick-user' })
    expect(user.insert.error).toBe(null)
    expect(user.insert.loading).toBe(false)
  })

  it('rejects a runMethod submit whose validate fails, and sends no request', async () => {
    let user = useDoctype<User>('User', { baseUrl })
    const fetchSpy = vi.spyOn(global, 'fetch')

    await expect(
      user.runMethod.submit({ method: 'quick_count', validate: () => 'nope' }),
    ).rejects.toThrow('nope')

    expect(user.runMethod.error?.message).toBe('nope')
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })

  it('reports insert isLoading while an insert is in flight', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    expect(user.insert.isLoading()).toBe(false)

    let done = user.insert.submit({ name: 'slow-user' })
    expect(user.insert.isLoading()).toBe(true)

    await done
    expect(user.insert.isLoading()).toBe(false)
  })
})

// `submit()` either resolves with the response or rejects with the error.
// There is no second failure channel, so `null` is free to mean a `null`
// response.
describe('useDoctype submit outcome', () => {
  it('rejects a runMethod submit whose request fails, and sets error', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    await expect(
      user.runMethod.submit({ method: 'quick_fail' }),
    ).rejects.toThrow('quick_fail failed')

    expect(user.runMethod.error?.message).toContain('quick_fail failed')
  })

  it('resolves with null when the server answers with a null response', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    // The same value a failed request used to hand back. It now means one thing
    // only: the server answered `null`, and the submit succeeded.
    await expect(user.runMethod.submit({ method: 'quick_null' })).resolves.toBe(
      null,
    )

    expect(user.runMethod.error).toBe(null)
    expect(user.runMethod.data).toBe(null)
  })

  it('rejects a failed delete and leaves the document in the store', async () => {
    await docStore.setDoc({ doctype: 'User', name: 'quick-fail' }, LOCAL_WRITE)

    let user = useDoctype<User>('User', { baseUrl })

    await expect(user.delete.submit({ name: 'quick-fail' })).rejects.toThrow(
      'delete quick-fail failed',
    )

    expect(docStore.getDoc('User', 'quick-fail').value).toMatchObject({
      name: 'quick-fail',
    })
  })
})

// A stale response must not land in the shared stores either. `docStore` is
// written from two places: `useFrappeFetch`'s `afterFetch` for any response
// carrying `docs` (#1017), and the per-method `onSuccess` hooks. In every test
// below the stale submit starts first and settles last, so an implementation
// that writes on settle leaves the store on the stale document.
describe('useDoctype stale store writes', () => {
  it('does not let a stale docs-channel response overwrite the doc store', async () => {
    await docStore.setDoc(
      {
        doctype: 'User',
        name: 'user1',
        email: 'old@example.com',
      },
      LOCAL_WRITE,
    )
    let user = useDoctype<User>('User', { baseUrl })

    // `update_email` answers with a `docs` array, which `useFrappeFetch`
    // pushes into `docStore` on every response.
    await Promise.all([
      user.runDocMethod.submit({
        name: 'user1',
        method: 'update_email',
        params: { email: 'slow-stale@example.com' },
      }),
      user.runDocMethod.submit({
        name: 'user1',
        method: 'update_email',
        params: { email: 'quick-fresh@example.com' },
      }),
    ])

    expect(docStore.getDoc('User', 'user1').value?.email).toBe(
      'quick-fresh@example.com',
    )
  })

  it('does not let a stale setValue success overwrite the doc store', async () => {
    await docStore.setDoc(
      {
        doctype: 'User',
        name: 'user1',
        email: 'old@example.com',
      },
      LOCAL_WRITE,
    )
    let user = useDoctype<User>('User', { baseUrl })

    let [slow, quick] = await Promise.all([
      user.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      user.setValue.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    // Each caller still receives its own response...
    expect(slow).toMatchObject({ email: 'slow-stale@example.com' })
    expect(quick).toMatchObject({ email: 'quick-fresh@example.com' })
    // ...but only the newest submit for this document may write the store.
    expect(docStore.getDoc('User', 'user1').value?.email).toBe(
      'quick-fresh@example.com',
    )
    expect(user.setValue.data).toMatchObject({
      email: 'quick-fresh@example.com',
    })
  })
})

// `data` and `error` belong to the submit that started last, not the one that
// settled last. In every test below the slow submit starts first and answers
// second, so an implementation that writes on settle gets it backwards.
describe('useDoctype overlapping submits', () => {
  it('keeps the newest response in data when an older submit answers last', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    await Promise.all([
      user.runMethod.submit({ method: 'slow_count', params: { page: 1 } }),
      user.runMethod.submit({ method: 'quick_count', params: { page: 2 } }),
    ])

    expect(user.runMethod.data).toEqual({ method: 'quick_count', page: 2 })
    expect(user.runMethod.error).toBe(null)
  })

  it('keeps the newest response in data across two keyed setValue submits', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    await Promise.all([
      user.setValue.submit({ name: 'slow-user', email: 'slow@example.com' }),
      user.setValue.submit({ name: 'quick-user', email: 'quick@example.com' }),
    ])

    expect(user.setValue.data).toMatchObject({ name: 'quick-user' })
    expect(user.setValue.error).toBe(null)
  })

  it('does not let an older failure overwrite the newest submit success', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let stale = user.runMethod.submit({ method: 'slow_fail' })
    let newest = user.runMethod.submit({
      method: 'quick_count',
      params: { page: 2 },
    })

    // The failed submit still reports the failure to its own caller.
    await expect(stale).rejects.toThrow('slow_fail failed')
    await expect(newest).resolves.toEqual({ method: 'quick_count', page: 2 })

    // ...and writes nothing shared, because it is no longer the newest.
    expect(user.runMethod.error).toBe(null)
    expect(user.runMethod.data).toEqual({ method: 'quick_count', page: 2 })
  })

  it('does not let an older success clear the newest submit error', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    let stale = user.runMethod.submit({
      method: 'slow_count',
      params: { page: 1 },
    })
    let newest = user.runMethod.submit({ method: 'quick_fail' })

    await expect(newest).rejects.toThrow('quick_fail failed')
    // The successful submit still hands its own response to its own caller.
    await expect(stale).resolves.toEqual({ method: 'slow_count', page: 1 })

    expect(user.runMethod.error?.message).toContain('quick_fail failed')
    expect(user.runMethod.data).toBe(null)
  })

  it('clears the error when the newest submit succeeds', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    await expect(
      user.runMethod.submit({ method: 'quick_fail' }),
    ).rejects.toThrow('quick_fail failed')
    expect(user.runMethod.error).toBeInstanceOf(Error)

    await user.runMethod.submit({ method: 'quick_count', params: { page: 3 } })

    expect(user.runMethod.error).toBe(null)
    expect(user.runMethod.data).toEqual({ method: 'quick_count', page: 3 })
  })

  it('keeps the last successful data after a failure', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    await user.runMethod.submit({ method: 'quick_count', params: { page: 1 } })
    await expect(
      user.runMethod.submit({ method: 'quick_fail' }),
    ).rejects.toThrow('quick_fail failed')

    expect(user.runMethod.error?.message).toContain('quick_fail failed')
    expect(user.runMethod.data).toEqual({ method: 'quick_count', page: 1 })
  })

  it('holds the error until the next submit settles, instead of clearing it at the start', async () => {
    let user = useDoctype<User>('User', { baseUrl })

    await expect(
      user.runMethod.submit({ method: 'quick_fail' }),
    ).rejects.toThrow('quick_fail failed')
    expect(user.runMethod.error).toBeInstanceOf(Error)

    let retry = user.runMethod.submit({ method: 'slow_count' })
    expect(user.runMethod.error).toBeInstanceOf(Error)

    await retry
    expect(user.runMethod.error).toBe(null)
  })
})
