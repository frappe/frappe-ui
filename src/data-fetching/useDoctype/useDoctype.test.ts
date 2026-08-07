/**
 * @vitest-environment node
 */

import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useDoctype } from '../index'
import { docStore } from '../docStore'

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
    await docStore.setDoc({ doctype: 'User', name: 'slow-user' })
    await docStore.setDoc({ doctype: 'User', name: 'quick-user' })

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
