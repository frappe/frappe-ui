/**
 * @vitest-environment node
 */

import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useDoc, useNewDoc } from '../index'
import { docStore } from '../docStore'

interface User {
  name: string
  email: string
}

describe('useNewDoc', () => {
  it('returns sane state before the first submit', () => {
    const user = useNewDoc<User>('User', { email: 'draft@example.com' }, { baseUrl })

    expect(user.doc).toEqual({ email: 'draft@example.com' })
    expect(user.data).toBe(null)
    expect(user.error).toBe(null)
    expect(user.loading).toBe(false)
    expect(typeof user.submit).toBe('function')
  })

  it('submits the current value of doc, not the initial value', async () => {
    const user = useNewDoc<User>(
      'User',
      { name: 'draft-user', email: 'first@example.com' },
      { baseUrl },
    )

    // Reactive round-trip: a change to `doc` before submit shows up in the
    // request body, because `params()` reads `doc` fresh on every submit.
    user.doc.email = 'final@example.com'

    const fetchSpy = vi.spyOn(global, 'fetch')
    await user.submit()

    expect(fetchSpy).toHaveBeenCalledWith(
      `${baseUrl}/api/v2/document/User`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'draft-user', email: 'final@example.com' }),
      }),
    )

    fetchSpy.mockRestore()
  })

  it('is loading while the submit is in flight, and not after', async () => {
    const user = useNewDoc<User>(
      'User',
      { name: 'draft-user', email: 'draft@example.com' },
      { baseUrl },
    )

    const pending = user.submit()
    expect(user.loading).toBe(true)

    await pending
    expect(user.loading).toBe(false)
  })

  it('resolves with the created doc and makes it readable via useDoc', async () => {
    const user = useNewDoc<User>(
      'User',
      { name: 'new-user-1', email: 'new-user-1@example.com' },
      { baseUrl },
    )

    const created = await user.submit()

    expect(created.email).toBe('new-user-1@example.com')
    expect(user.data).toMatchObject({ email: 'new-user-1@example.com' })
    expect(user.error).toBe(null)

    // Written into the shared doc store under the returned name — a useDoc
    // for it reads the same value without waiting on its own fetch.
    const existing = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: created.name,
      immediate: false,
    })
    expect(existing.doc).toMatchObject({ email: 'new-user-1@example.com' })
  })

  it('resolves with a doc that carries its doctype, even when the response omits it', async () => {
    const user = useNewDoc<User>(
      'User',
      { name: 'new-user-2', email: 'new-user-2@example.com' },
      { baseUrl },
    )

    // The insert endpoint echoes the payload back, so the response has no
    // `doctype`. The resolved doc carries the same shape the store holds.
    const created = (await user.submit()) as User & { doctype: string }

    expect(created.doctype).toBe('User')
    expect(docStore.getDoc('User', 'new-user-2').value).toMatchObject({
      doctype: 'User',
    })
  })

  it('sets error and rejects on a failed insert', async () => {
    const invalid = useNewDoc('InvalidDoctype', { email: 'nope@example.com' }, {
      baseUrl,
    })

    await expect(invalid.submit()).rejects.toThrow()
    await waitUntilValueChanges(() => invalid.loading, false)

    expect(invalid.error).toBeTruthy()
    expect(invalid.data).toBe(null)
  })

  it('runs two submits at once and gives each caller the created doc', async () => {
    const user = useNewDoc<User>(
      'User',
      { name: 'slow-user', email: 'draft@example.com' },
      { baseUrl },
    )

    // With one shared request the second submit aborts the first mid-flight
    // and the first caller rejects instead of receiving its doc (#991).
    let [first, second] = await Promise.all([user.submit(), user.submit()])

    expect(first).toMatchObject({ name: 'slow-user' })
    expect(second).toMatchObject({ name: 'slow-user' })
    expect(user.error).toBe(null)
    expect(user.loading).toBe(false)
  })

  it('calls onSuccess with the created doc', async () => {
    const onSuccess = vi.fn()
    const user = useNewDoc<User>(
      'User',
      { name: 'draft-user', email: 'draft@example.com' },
      { baseUrl, onSuccess },
    )

    await user.submit()

    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'draft@example.com' }),
    )
  })
})
