/**
 * @vitest-environment node
 */
import { ref } from 'vue'
import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useCall, useDoc } from '../index'
import { docStore } from '../docStore'
import { LOCAL_WRITE } from '../writeGate'

describe('useDoc', () => {
  it('it returns expected object', async () => {
    interface User {
      name: string
      email: string
      first_name: string
      last_name: string
    }

    let user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
    })

    await waitUntilValueChanges(() => user.loading, true)

    // Verify initial state
    expect(user.doc).toBe(null)
    expect(user.error).toBe(null)
    expect(typeof user.fetch).toBe('function')
    expect(typeof user.reload).toBe('function')

    await waitUntilValueChanges(() => user.loading, false)

    // Verify final state
    expect(user.doc).toStrictEqual({
      doctype: 'User',
      name: 'user1',
      email: 'user1@example.com',
      first_name: 'User',
      last_name: '1',
    })
    expect(user.error).toBe(null)
    expect(user.loading).toBe(false)
  })

  it('it returns expected object with methods', async () => {
    interface User {
      name: string
      email: string
      first_name: string
      last_name: string
    }

    interface UserMethods {
      getFullName: () => string
      updateEmail: (params: { email: string }) => void
    }

    const onSuccess = vi.fn()
    let user = useDoc<User, UserMethods>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      methods: {
        getFullName: 'get_full_name',
        updateEmail: {
          name: 'update_email',
          onSuccess,
        },
      },
    })

    await waitUntilValueChanges(() => user.loading, false)

    expect(user.getFullName).toBeDefined()
    expect(user.updateEmail).toBeDefined()

    user.getFullName.submit()

    const newEmail = 'updated@example.com'
    user.updateEmail.submit({ email: newEmail })
  })

  it('updates doc after running doc method', async () => {
    interface User {
      name: string
      email: string
      first_name: string
      last_name: string
    }

    interface UserMethods {
      updateEmail: (params: { email: string }) => void
    }

    let user = useDoc<User, UserMethods>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      methods: {
        updateEmail: 'update_email',
      },
    })

    await waitUntilValueChanges(() => user.doc)

    // Initial email value
    expect(user.doc!.email).toBe('user1@example.com')

    // Update email
    const newEmail = 'updated@example.com'
    await user.updateEmail.submit({ email: newEmail })

    await waitUntilValueChanges(() => user.loading, true)
    await waitUntilValueChanges(() => user.doc)

    // Verify that the doc was updated
    expect(user.doc!.email).toBe(newEmail)
  })

  it('sets error and leaves doc null when the fetch fails', async () => {
    interface User {
      name: string
      email: string
    }

    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'missing-user',
    })

    await waitUntilValueChanges(() => user.loading, true)
    await waitUntilValueChanges(() => user.loading, false)

    expect(user.error).toBeTruthy()
    expect(user.doc).toBe(null)
  })

  it('updates the doc via setValue', async () => {
    interface User {
      name: string
      email: string
    }

    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
    })

    await waitUntilValueChanges(() => user.loading, true)
    await waitUntilValueChanges(() => user.loading, false)

    const updated = await user.setValue.submit({
      email: 'setvalue-updated@example.com',
    })

    expect(updated?.email).toBe('setvalue-updated@example.com')
    expect(user.doc!.email).toBe('setvalue-updated@example.com')
    expect(user.setValue.error).toBe(null)
  })

  it('deletes the doc and clears it from the store', async () => {
    interface User {
      name: string
      email: string
    }

    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
    })

    await waitUntilValueChanges(() => user.loading, false)
    expect(user.doc).not.toBe(null)

    await user.delete.submit()

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('does not bind or fetch while the name is empty', async () => {
    interface User {
      name: string
      email: string
    }

    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: '',
    })

    // No name → nothing to bind and no request should fire.
    expect(user.doc).toBe(null)
    expect(user.loading).toBe(false)
  })

  it('binds to the doc once a late-resolving name is set', async () => {
    interface User {
      name: string
      email: string
      first_name: string
      last_name: string
    }

    // Name is empty at setup (e.g. bound to a doc that is still loading).
    const name = ref('')
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name,
    })

    // Nothing fetched or bound yet.
    expect(user.doc).toBe(null)
    expect(user.loading).toBe(false)

    // Name resolves after setup — the doc ref should re-point to the real slot.
    name.value = 'user1'

    await waitUntilValueChanges(() => user.loading, true)
    await waitUntilValueChanges(() => user.loading, false)

    expect(user.doc).toStrictEqual({
      doctype: 'User',
      name: 'user1',
      email: 'user1@example.com',
      first_name: 'User',
      last_name: '1',
    })
  })

  it('throws when getDoc is called with a whitespace-only name', () => {
    expect(() => docStore.getDoc('User', '   ')).toThrow(
      'doctype and name are required',
    )
  })
})

// `setValue`, `delete` and every `methods:` entry target the one document the
// composable is bound to, so two concurrent submits share a URL and differ
// only in their body. Each submit must run its own request and answer its own
// caller — one shared request would be aborted by the second submit (#991).
// The mock server answers slowly when a body value starts with `slow`, so the
// submit that starts first always answers second.
describe('useDoc concurrency', () => {
  interface User {
    name: string
    email: string
  }

  it('runs two setValue submits at once and gives each its own response', async () => {
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    let [slow, quick] = await Promise.all([
      user.setValue.submit({ email: 'slow@example.com' }),
      user.setValue.submit({ email: 'quick@example.com' }),
    ])

    expect(slow?.email).toBe('slow@example.com')
    expect(quick?.email).toBe('quick@example.com')
    expect(user.setValue.error).toBe(null)
    expect(user.setValue.loading).toBe(false)
    // `data` belongs to the submit that started last, not the one that
    // settled last.
    expect(user.setValue.data?.email).toBe('quick@example.com')
  })

  it('keeps setValue loading until every submit settles', async () => {
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    let slow = user.setValue.submit({ email: 'slow@example.com' })
    let quick = user.setValue.submit({ email: 'quick@example.com' })
    expect(user.setValue.loading).toBe(true)

    await quick
    // The slow submit is still in flight — the quick one settling must not
    // clear the flag.
    expect(user.setValue.loading).toBe(true)

    await slow
    expect(user.setValue.loading).toBe(false)
    expect(user.setValue.isFinished).toBe(true)
  })

  it('does not let a stale setValue success overwrite the doc store', async () => {
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    let [slow, quick] = await Promise.all([
      user.setValue.submit({ email: 'slow@example.com' }),
      user.setValue.submit({ email: 'quick@example.com' }),
    ])

    expect(slow?.email).toBe('slow@example.com')
    expect(quick?.email).toBe('quick@example.com')
    // The slow submit settles last, but it is stale — its `onSuccess` must
    // not run, or `docStore` (and every view bound to `user.doc`) would
    // show the stale document while `setValue.data` holds the fresh one.
    expect(user.doc!.email).toBe('quick@example.com')
    expect(user.setValue.data?.email).toBe('quick@example.com')
  })

  it('does not let a stale setValue success clear the newest submit error', async () => {
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    let slow = user.setValue.submit({ email: 'slow@example.com' })
    let quick = user.setValue.submit({ email: 'quick_fail' })

    let [slowResult, quickResult] = await Promise.all([slow, quick])

    // A failed request resolves `null`, per `useCall`'s submit contract.
    expect(quickResult).toBe(null)
    // The stale success still answers its own caller...
    expect(slowResult?.email).toBe('slow@example.com')
    // ...but writes nothing shared: the newest submit's error stays.
    expect(user.setValue.error?.message).toContain('setValue user1 failed')
    expect(user.setValue.data).toBe(null)
  })

  it('clears the previous error when a new submit starts', async () => {
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    await user.setValue.submit({ email: 'quick_fail' })
    expect(user.setValue.error).toBeTruthy()

    // A retry must not sit at `loading: true` with the old error still set —
    // `useCall` clears `error` on every `execute()`, and this matches it.
    let retry = user.setValue.submit({ email: 'slow@example.com' })
    expect(user.setValue.loading).toBe(true)
    expect(user.setValue.error).toBe(null)

    await retry
    expect(user.setValue.error).toBe(null)
    expect(user.setValue.data?.email).toBe('slow@example.com')
  })

  it('runs two delete submits at once and gives each its own response', async () => {
    await docStore.setDoc({ doctype: 'User', name: 'user1' }, LOCAL_WRITE)
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    let [first, second] = await Promise.all([
      user.delete.submit(),
      user.delete.submit(),
    ])

    // With one shared request the second submit aborts the first, and the
    // first caller resolves `null` instead of its own response.
    expect(first).toBe('deleted user1')
    expect(second).toBe('deleted user1')
    expect(user.delete.error).toBe(null)
    expect(user.delete.loading).toBe(false)
    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('runs two submits of the same doc method at once without crossing responses', async () => {
    interface UserMethods {
      run: (params: { tag: string }) => any
    }

    const user = useDoc<User, UserMethods>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
      methods: { run: 'run' },
    })

    let [slow, quick] = await Promise.all([
      user.run.submit({ tag: 'slow-first' }),
      user.run.submit({ tag: 'quick-second' }),
    ])

    expect(slow).toMatchObject({ method: 'run', tag: 'slow-first' })
    expect(quick).toMatchObject({ method: 'run', tag: 'quick-second' })
    expect(user.run.error).toBe(null)
    expect(user.run.loading).toBe(false)
  })
})
