// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { setConfig } from './config'
import { isPrivateUpload, upload, UploadError } from './useFileUpload'

describe('isPrivateUpload', () => {
  it('defaults to private when private is not set', () => {
    expect(isPrivateUpload()).toBe(true)
    expect(isPrivateUpload({})).toBe(true)
  })

  it('honors an explicit private: false', () => {
    expect(isPrivateUpload({ private: false })).toBe(false)
  })

  it('honors an explicit private: true', () => {
    expect(isPrivateUpload({ private: true })).toBe(true)
  })
})

describe('upload (standalone export)', () => {
  class FakeXhr {
    static DONE = 4
    static instances: FakeXhr[] = []
    upload = { addEventListener: vi.fn() }
    listeners: Record<string, Array<() => void>> = {}
    status = 200
    responseText = ''
    readyState = 4
    body: FormData | null = null

    constructor() {
      FakeXhr.instances.push(this)
    }
    addEventListener(event: string, cb: () => void) {
      this.listeners[event] = this.listeners[event] || []
      this.listeners[event].push(cb)
    }
    open() {}
    setRequestHeader() {}
    send(body: FormData) {
      this.body = body
      this.responseText = JSON.stringify({
        message: { file_url: '/private/files/hello.txt', is_private: 1 },
      })
      this.onreadystatechange?.()
    }
    onreadystatechange: (() => void) | null = null
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    FakeXhr.instances = []
  })

  it('does not crash when called with no state/reset args (the beta.35 bug)', async () => {
    vi.stubGlobal('XMLHttpRequest', FakeXhr as unknown as typeof XMLHttpRequest)
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    const result = await upload(file, {})

    expect(result).toEqual({
      file_url: '/private/files/hello.txt',
      is_private: 1,
    })
    expect(FakeXhr.instances).toHaveLength(1)
    expect(FakeXhr.instances[0]!.body?.get('is_private')).toBe('1')
  })

  it('rejects an UploadError carrying the server messages', async () => {
    class FailingXhr extends FakeXhr {
      send(body: FormData) {
        this.body = body
        this.status = 417
        this.responseText = JSON.stringify({
          _server_messages: JSON.stringify([
            JSON.stringify({ message: 'Not allowed' }),
          ]),
        })
        this.onreadystatechange?.()
      }
    }
    vi.stubGlobal(
      'XMLHttpRequest',
      FailingXhr as unknown as typeof XMLHttpRequest,
    )
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    const error = await upload(file, {}).catch((e) => e)

    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('server')
    expect(error.status).toBe(417)
    expect(error.message).toBe('Not allowed')
    expect(error.messages).toEqual(['Not allowed'])
  })

  it('rejects an UploadError when the file is over the size limit', async () => {
    setConfig('maxFileSize', 1)
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    try {
      const error = await upload(file, {}).catch((e) => e)

      expect(error).toBeInstanceOf(UploadError)
      expect(error.kind).toBe('file-size')
    } finally {
      setConfig('maxFileSize', null)
    }
  })
})
