/**
 * @vitest-environment node
 */

import { baseUrl } from '../mocks/utils'
import { useAction, UseActionOptions } from './useAction'

interface SetValueParams {
  name: string
  email: string
}

type SetValueOptions = UseActionOptions<SetValueParams, SetValueParams>

// `useDoctype` and `useList` write `docStore` and `listStore` from these
// hooks, so a hook that fires for a stale submit writes a stale document.
// The mock server answers slowly when a value starts with `slow`, so the
// submit that starts first always settles last.
function makeSetValue(
  onSuccess?: SetValueOptions['onSuccess'],
  onError?: SetValueOptions['onError'],
) {
  return useAction<SetValueParams, SetValueParams>({
    url: ({ name }) => `/api/v2/document/User/${name}`,
    method: 'PUT',
    baseUrl,
    key: ({ name }) => name,
    onSuccess,
    onError,
  })
}

describe('useAction hook gating', () => {
  it('does not fire onSuccess for a stale submit of the same target', async () => {
    const onSuccess = vi.fn()
    const action = makeSetValue(onSuccess)

    await Promise.all([
      action.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      action.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    // Only the newest submit for `user1` may fire the hook — the stale one
    // settling last must not hand its response to the store writers.
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'quick-fresh@example.com' }),
      expect.objectContaining({ email: 'quick-fresh@example.com' }),
    )
  })

  it('does not fire onError for a stale submit of the same target', async () => {
    const onError = vi.fn()
    const action = makeSetValue(undefined, onError)

    // `slowfail` starts slow and fails; it is stale by the time it settles.
    let stale = action.submit({ name: 'user1', email: 'slowfail' })
    let newest = action.submit({ name: 'user1', email: 'quick@example.com' })

    await expect(stale).rejects.toThrow('setValue user1 failed')
    await newest

    expect(onError).not.toHaveBeenCalled()
  })

  it('fires the older onSuccess when the newer same-target submit fails', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const action = makeSetValue(onSuccess, onError)

    // The older submit is slow and succeeds; the newer one fails at once.
    // The failed submit wrote nothing, so the older response is what the
    // server holds — its hook must still hand it to the store writers.
    let older = action.submit({ name: 'user1', email: 'slow-old@example.com' })
    let newer = action.submit({ name: 'user1', email: 'quickfail' })

    await expect(newer).rejects.toThrow('setValue user1 failed')
    await older

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'slow-old@example.com' }),
      expect.objectContaining({ email: 'slow-old@example.com' }),
    )
  })

  it('fires onSuccess for every target when the keys differ', async () => {
    const onSuccess = vi.fn()
    const action = makeSetValue(onSuccess)

    // Two targets, so neither submit is stale — both hooks must run, or the
    // first row's store write would be dropped (this is what `useAction`
    // exists for: delete two rows, save two fields).
    await Promise.all([
      action.submit({ name: 'slow-user', email: 'a@example.com' }),
      action.submit({ name: 'quick-user', email: 'b@example.com' }),
    ])

    expect(onSuccess).toHaveBeenCalledTimes(2)
  })

  it('fires onSuccess for every submit when the action has no key', async () => {
    const onSuccess = vi.fn()
    const action = useAction<{ name: string }, { name: string }>({
      url: () => `/api/v2/document/User`,
      method: 'POST',
      baseUrl,
      onSuccess,
    })

    // No key means no target to conflict on — two inserts are always
    // distinct documents, so both hooks must run (`useList().insert` relies
    // on this to refetch after each insert lands).
    await Promise.all([
      action.submit({ name: 'slow-user' }),
      action.submit({ name: 'quick-user' }),
    ])

    expect(onSuccess).toHaveBeenCalledTimes(2)
  })
})
