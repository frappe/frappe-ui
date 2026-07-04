/**
 * @vitest-environment node
 */
import { ref } from 'vue'
import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useCall, useDoc } from '../index'
import { docStore } from '../docStore'

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
    expect(() => docStore.getDoc('User', '   ', (d) => d)).toThrow(
      'doctype and name are required',
    )
  })
})
