/**
 * @vitest-environment node
 */
import { ref } from 'vue'
import { delay, http, HttpResponse } from 'msw'
import { server } from '../../mocks/node'
import { baseUrl, url, waitUntilValueChanges } from '../../mocks/utils'
import { useCall, useDoc, useList } from '../index'
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
    // A failed write rejects, per the v1 submit contract (DAT-Q1).
    let quick = user.setValue.submit({ email: 'quick_fail' }).catch((e) => e)

    let [slowResult, quickResult] = await Promise.all([slow, quick])

    expect((quickResult as Error).message).toContain('setValue user1 failed')
    // The stale success still answers its own caller...
    expect(slowResult?.email).toBe('slow@example.com')
    // ...but writes nothing shared: the newest submit's error stays.
    expect(user.setValue.error?.message).toContain('setValue user1 failed')
    expect(user.setValue.data).toBe(null)
  })

  // DAT-Q2: a `methods:` entry is spread over what `useDoc` returns, so a
  // colliding key would replace a built-in member without a word.
  it('refuses a method name that collides with a built-in member', () => {
    expect(() =>
      useDoc<User>({
        baseUrl,
        doctype: 'User',
        name: 'user1',
        immediate: false,
        methods: { setValue: 'set_value' },
      }),
    ).toThrow('already a member of the object useDoc returns')

    expect(() =>
      useDoc<User>({
        baseUrl,
        doctype: 'User',
        name: 'user1',
        immediate: false,
        methods: { reload: 'reload_doc' },
      }),
    ).toThrow('already a member of the object useDoc returns')
  })

  // DAT-Q6: `refetch: true` on a document method re-sends it from the params
  // watcher and makes `submit()` send nothing at all. The option is gone from
  // the type, and the value is forced after the caller's spread so an untyped
  // caller cannot put it back.
  it('keeps a document method on submit only, whatever the caller passes', async () => {
    interface UserMethods {
      updateEmail: (params: { email: string }) => User
    }

    const user = useDoc<User, UserMethods>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
      methods: {
        updateEmail: {
          name: 'update_email',
          ...({ refetch: true, immediate: true } as {}),
        },
      },
    })

    const submitted = user.updateEmail.submit({ email: 'forced@example.com' })
    // A request went out. With `refetch: true` in force, `submit()` would
    // return without sending anything and `loading` would stay false.
    expect(user.updateEmail.loading).toBe(true)
    await submitted
    expect(user.updateEmail.error).toBe(null)
  })

  it('clears the previous error when a new submit starts', async () => {
    const user = useDoc<User>({
      baseUrl,
      doctype: 'User',
      name: 'user1',
      immediate: false,
    })

    await expect(
      user.setValue.submit({ email: 'quick_fail' }),
    ).rejects.toThrow('setValue user1 failed')
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

// `setValue` writes the submitted values into the stores before the request
// goes out, like the legacy `createDocumentResource`. The response replaces
// them; a failure reverts them, but never over a write that landed since.
describe('useDoc setValue is optimistic', () => {
  interface User {
    name: string
    email: string
  }

  async function setup() {
    await docStore.setDoc(
      { doctype: 'User', name: 'user1', email: 'old@example.com' },
      LOCAL_WRITE,
    )
    server.use(
      http.get(url('/api/v2/document/User'), () =>
        HttpResponse.json({
          data: [{ name: 'user1', email: 'old@example.com' }],
        }),
      ),
    )
    const list = useList<User>({
      doctype: 'User',
      baseUrl,
      immediate: false,
      refetch: false,
    })
    await list.reload()
    server.resetHandlers()

    const user = useDoc<User>({
      doctype: 'User',
      name: 'user1',
      baseUrl,
      immediate: false,
    })
    const rowEmail = () => list.data?.find((row) => row.name === 'user1')?.email
    return { user, list, rowEmail }
  }

  it('shows the submitted values at once, then the server answer', async () => {
    const { user, rowEmail } = await setup()
    server.use(
      http.put(url('/api/v2/document/User/user1'), async () => {
        await delay(20)
        return HttpResponse.json({
          data: { name: 'user1', email: 'saved@example.com' },
        })
      }),
    )

    const save = user.setValue.submit({ email: 'typed@example.com' })
    expect(user.doc!.email).toBe('typed@example.com')
    expect(rowEmail()).toBe('typed@example.com')

    await save
    expect(user.doc!.email).toBe('saved@example.com')
    expect(rowEmail()).toBe('saved@example.com')
  })

  it('reverts a failed submit', async () => {
    const { user, rowEmail } = await setup()

    const save = user.setValue.submit({ email: 'quickfail' })
    expect(user.doc!.email).toBe('quickfail')

    await expect(save).rejects.toThrow('setValue user1 failed')
    expect(user.doc!.email).toBe('old@example.com')
    expect(rowEmail()).toBe('old@example.com')
  })

  it('does not revert over a later submit', async () => {
    const { user, rowEmail } = await setup()

    const failed = user.setValue.submit({ email: 'slow-fail' })
    const later = user.setValue.submit({ email: 'new@example.com' })
    await later
    await expect(failed).rejects.toThrow('setValue user1 failed')

    expect(user.doc!.email).toBe('new@example.com')
    expect(rowEmail()).toBe('new@example.com')
  })

  it('reverts overlapping failures on one field to the original value', async () => {
    const { user, rowEmail } = await setup()

    const first = user.setValue.submit({ email: 'quickfail' })
    const second = user.setValue.submit({ email: 'slow-fail' })
    await expect(first).rejects.toThrow('setValue user1 failed')
    // The second submit is still in flight, so its value stays.
    expect(user.doc!.email).toBe('slow-fail')
    await expect(second).rejects.toThrow('setValue user1 failed')

    expect(user.doc!.email).toBe('old@example.com')
    expect(rowEmail()).toBe('old@example.com')
  })

  it('does not revert over a fetch that landed', async () => {
    const { user } = await setup()

    const failed = user.setValue.submit({ email: 'slow-fail' })
    // The default handler answers with the server's copy at once.
    await user.reload()
    expect(user.doc!.email).toBe('user1@example.com')
    await expect(failed).rejects.toThrow('setValue user1 failed')

    expect(user.doc!.email).toBe('user1@example.com')
  })

  it('does not revert over a newer submit of the same value', async () => {
    const { user, rowEmail } = await setup()
    // The first save fails slowly, the second succeeds at once. Both send the
    // same value, so only the order of writes tells them apart.
    let calls = 0
    server.use(
      http.put(url('/api/v2/document/User/user1'), async () => {
        if (++calls === 1) {
          await delay(60)
          return HttpResponse.json({ errors: [] }, { status: 500 })
        }
        return HttpResponse.json({
          data: { name: 'user1', email: 'same@example.com' },
        })
      }),
    )

    const failed = user.setValue.submit({ email: 'same@example.com' })
    await user.setValue.submit({ email: 'same@example.com' })
    await expect(failed).rejects.toThrow()

    expect(user.doc!.email).toBe('same@example.com')
    expect(rowEmail()).toBe('same@example.com')
  })

  it('does not revert a list row that was refetched', async () => {
    const { user, list, rowEmail } = await setup()

    const failed = user.setValue.submit({ email: 'slow-fail' })
    server.use(
      http.get(url('/api/v2/document/User'), () =>
        HttpResponse.json({
          data: [{ name: 'user1', email: 'listed@example.com' }],
        }),
      ),
    )
    await list.reload()
    await expect(failed).rejects.toThrow('setValue user1 failed')

    expect(user.doc!.email).toBe('old@example.com')
    expect(rowEmail()).toBe('listed@example.com')
  })

  it('keeps a row field the doc did not have', async () => {
    const { user, rowEmail } = await setup()
    // A partial doc, as the `docs` side channel can publish.
    await docStore.setDoc({ doctype: 'User', name: 'user1' }, LOCAL_WRITE)

    const save = user.setValue.submit({ email: 'quickfail' })
    expect(user.doc!.email).toBe('quickfail')
    // The doc has no value to revert the row to, so the row is not touched.
    expect(rowEmail()).toBe('old@example.com')
    await expect(save).rejects.toThrow('setValue user1 failed')

    expect(user.doc!.email).toBe(undefined)
    expect(rowEmail()).toBe('old@example.com')
  })
})
