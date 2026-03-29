/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { FrappeResponseError } from '../FrappeResponseError'

describe('FrappeResponseError', () => {
  it('sets message to first error message', () => {
    const error = new FrappeResponseError({
      title: 'Validation Error',
      type: 'ValidationError',
      messages: [
        { type: 'ValidationError', message: 'Field required' },
        { type: 'ValidationError', message: 'Other error' },
      ],
      httpStatus: 417,
    })
    expect(error.message).toBe('Field required')
  })

  it('falls back message to title when messages empty', () => {
    const error = new FrappeResponseError({
      title: 'Server Error',
      type: 'ServerError',
      messages: [],
      httpStatus: 500,
    })
    expect(error.message).toBe('Server Error')
  })

  it('is instanceof Error', () => {
    const error = new FrappeResponseError({
      title: 'Error',
      type: 'Error',
      messages: [],
      httpStatus: 500,
    })
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('FrappeResponseError')
  })

  it('isNotFound is true for 404', () => {
    const error = new FrappeResponseError({
      title: 'Not Found',
      type: 'NotFoundError',
      messages: [{ type: 'NotFoundError', message: 'Not found' }],
      httpStatus: 404,
    })
    expect(error.isNotFound).toBe(true)
    expect(error.isPermission).toBe(false)
    expect(error.isAuth).toBe(false)
    expect(error.isValidation).toBe(false)
  })

  it('isPermission is true for 403', () => {
    const error = new FrappeResponseError({
      title: 'Permission Denied',
      type: 'PermissionError',
      messages: [{ type: 'PermissionError', message: 'No permission' }],
      httpStatus: 403,
    })
    expect(error.isPermission).toBe(true)
    expect(error.isNotFound).toBe(false)
  })

  it('isAuth is true for 401', () => {
    const error = new FrappeResponseError({
      title: 'Unauthorized',
      type: 'AuthError',
      messages: [{ type: 'AuthError', message: 'Login required' }],
      httpStatus: 401,
    })
    expect(error.isAuth).toBe(true)
    expect(error.isPermission).toBe(false)
  })

  it('isValidation is true for ValidationError type', () => {
    const error = new FrappeResponseError({
      title: 'Validation Error',
      type: 'ValidationError',
      messages: [{ type: 'ValidationError', message: 'Invalid value' }],
      httpStatus: 417,
    })
    expect(error.isValidation).toBe(true)
    expect(error.isNotFound).toBe(false)
  })

  it('stores optional fields', () => {
    const error = new FrappeResponseError({
      title: 'Error',
      type: 'Error',
      messages: [],
      exception: 'Traceback...',
      indicator: 'red',
      httpStatus: 500,
    })
    expect(error.exception).toBe('Traceback...')
    expect(error.indicator).toBe('red')
  })
})
