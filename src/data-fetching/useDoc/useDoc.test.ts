/**
 * @vitest-environment node
 */
import { ref } from 'vue'
import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useCall, useDoc } from '../index'

describe('useList', () => {
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

    console.log(user.doc)

    expect(user.getFullName).toBeDefined()
    expect(user.updateEmail).toBeDefined()

    user.getFullName.submit()

    const newEmail = 'updated@example.com'
    user.updateEmail.submit({ email: newEmail })
  })
})
