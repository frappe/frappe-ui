// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import FileUploadHandler from './fileUploadHandler'
import { setConfig } from './config'
import { UploadError } from './useFileUpload'

describe('FileUploadHandler', () => {
  // Stays open until a listener is fired by hand. A real aborted request
  // fires `abort` on the xhr and never reaches `readystatechange`.
  class PendingXhr {
    static instances: PendingXhr[] = []
    upload = { addEventListener: vi.fn() }
    listeners: Record<string, Array<(data?: unknown) => void>> = {}
    status = 0
    responseText = ''
    readyState = 1
    onreadystatechange: (() => void) | null = null

    constructor() {
      PendingXhr.instances.push(this)
    }
    addEventListener(event: string, cb: (data?: unknown) => void) {
      this.listeners[event] = this.listeners[event] || []
      this.listeners[event].push(cb)
    }
    open() {}
    setRequestHeader() {}
    send() {}
    fire(event: string) {
      ;(this.listeners[event] || []).forEach((cb) => cb())
    }
  }

  const file = () => new File(['hello'], 'hello.txt', { type: 'text/plain' })

  afterEach(() => {
    vi.unstubAllGlobals()
    PendingXhr.instances = []
  })

  it('rejects an UploadError with kind abort when the request aborts', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      PendingXhr as unknown as typeof XMLHttpRequest,
    )
    const handler = new FileUploadHandler()
    const onError = vi.fn()
    handler.on('error', onError)

    const pending = handler.upload(file(), {})
    PendingXhr.instances[0]!.fire('abort')
    const error = await pending.catch((e) => e)

    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('abort')
    expect(error.message).toBe('Upload cancelled')
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('rejects an UploadError with kind network when the request errors', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      PendingXhr as unknown as typeof XMLHttpRequest,
    )
    const handler = new FileUploadHandler()
    const onError = vi.fn()
    handler.on('error', onError)

    const pending = handler.upload(file(), {})
    PendingXhr.instances[0]!.fire('error')
    const error = await pending.catch((e) => e)

    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('network')
    expect(error.message).toBe('Upload failed')
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('rejects an UploadError with kind file-size before opening a request', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      PendingXhr as unknown as typeof XMLHttpRequest,
    )
    setConfig('maxFileSize', 1)
    try {
      const error = await new FileUploadHandler()
        .upload(file(), {})
        .catch((e) => e)

      expect(error).toBeInstanceOf(UploadError)
      expect(error.kind).toBe('file-size')
      expect(PendingXhr.instances).toHaveLength(0)
    } finally {
      setConfig('maxFileSize', null)
    }
  })
})
