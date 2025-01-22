/**
 * @vitest-environment node
 */

import { baseUrl, waitUntilValueChanges } from '../../mocks/utils'
import { useDoctype } from '../index'

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
