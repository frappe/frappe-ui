export interface FrappeErrorMessage {
  type: string
  message: string
}

export class FrappeResponseError extends Error {
  title: string
  type: string
  messages: FrappeErrorMessage[]
  exception?: string
  indicator?: string
  httpStatus: number

  constructor(options: {
    title: string
    type: string
    messages: FrappeErrorMessage[]
    exception?: string
    indicator?: string
    httpStatus: number
  }) {
    const firstMessage = options.messages[0]?.message || options.title
    super(firstMessage)
    this.name = 'FrappeResponseError'
    this.title = options.title
    this.type = options.type
    this.messages = options.messages
    this.exception = options.exception
    this.indicator = options.indicator
    this.httpStatus = options.httpStatus

    if ((Error as any).captureStackTrace) {
      ;(Error as any).captureStackTrace(this, FrappeResponseError)
    }
  }

  get isNotFound() {
    return this.httpStatus === 404
  }

  get isPermission() {
    return this.httpStatus === 403
  }

  get isValidation() {
    return this.type === 'ValidationError'
  }

  get isAuth() {
    return this.httpStatus === 401
  }
}
