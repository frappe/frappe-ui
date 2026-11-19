// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { setConfig } from './config'
import {
  isPrivateUpload,
  upload,
  useFileUpload,
  UploadError,
} from './useFileUpload'

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

  it('names a 413 from a proxy as a file that is too big', async () => {
    class ProxyLimitXhr extends FakeXhr {
      send(body: FormData) {
        this.body = body
        this.status = 413
        this.responseText =
          '<html><head><title>413 Request Entity Too Large</title></head></html>'
        this.onreadystatechange?.()
      }
    }
    vi.stubGlobal(
      'XMLHttpRequest',
      ProxyLimitXhr as unknown as typeof XMLHttpRequest,
    )
    const file = new File([new Uint8Array(3 * 1024 * 1024)], 'demo.mp4', {
      type: 'video/mp4',
    })

    const error = await upload(file, {}).catch((e) => e)

    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('file-size')
    expect(error.status).toBe(413)
    expect(error.message).toBe(
      'This file is 3 MB, which is more than the server accepts.',
    )
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

describe('upload cancellation', () => {
  // Stays open until something calls `abort()`, which is what an aborted
  // request does: the browser fires `abort` on the xhr, never `readystatechange`.
  class PendingXhr {
    static instances: PendingXhr[] = []
    upload = { addEventListener: vi.fn() }
    listeners: Record<string, Array<() => void>> = {}
    status = 0
    responseText = ''
    readyState = 1
    onreadystatechange: (() => void) | null = null

    constructor() {
      PendingXhr.instances.push(this)
    }
    addEventListener(event: string, cb: () => void) {
      this.listeners[event] = this.listeners[event] || []
      this.listeners[event].push(cb)
    }
    open() {}
    setRequestHeader() {}
    send() {}
    abort() {
      ;(this.listeners['abort'] || []).forEach((cb) => cb())
    }
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    PendingXhr.instances = []
  })

  it('aborts the request when options.signal fires', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      PendingXhr as unknown as typeof XMLHttpRequest,
    )
    const controller = new AbortController()
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    const pending = upload(file, { signal: controller.signal })
    controller.abort()
    const error = await pending.catch((e) => e)

    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('abort')
    expect(error.message).toBe('Upload cancelled')
  })

  it('rejects an UploadError, not the old AbortError DOMException', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      PendingXhr as unknown as typeof XMLHttpRequest,
    )
    const controller = new AbortController()
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    const pending = upload(file, { signal: controller.signal })
    controller.abort()
    const error = await pending.catch((e) => e)

    // The documented break: `err.name === 'AbortError'` and
    // `err instanceof DOMException` no longer match. See
    // migration#upload-abort-error.
    expect(error.name).toBe('UploadError')
    expect(error instanceof DOMException).toBe(false)
  })

  it('records the abort on useFileUpload state and stops uploading', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      PendingXhr as unknown as typeof XMLHttpRequest,
    )
    const controller = new AbortController()
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    const uploader = useFileUpload()

    const pending = uploader.upload(file, { signal: controller.signal })
    controller.abort()
    const error = await pending.catch((e) => e)

    expect(error).toBe(uploader.state.error)
    expect(uploader.error.value?.kind).toBe('abort')
    expect(uploader.state.uploading).toBe(false)
    expect(uploader.isUploading.value).toBe(false)
  })

  it('rejects an UploadError with kind network when the request errors', async () => {
    class ErroringXhr extends PendingXhr {
      send() {
        ;(this.listeners['error'] || []).forEach((cb) => cb())
      }
    }
    vi.stubGlobal(
      'XMLHttpRequest',
      ErroringXhr as unknown as typeof XMLHttpRequest,
    )
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    const error = await upload(file, {}).catch((e) => e)

    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('network')
    expect(error.message).toBe('Upload failed')
  })
})

describe('chunked upload', () => {
  // Answers like Frappe's upload_file: an empty message for each piece but
  // the last, and the File for the last one. Fails the piece in `failAt`.
  class ChunkServerXhr {
    static DONE = 4
    static requests: FormData[] = []
    static failAt: number | null = null
    progressListeners: Array<(e: ProgressEvent) => void> = []
    upload = {
      addEventListener: (event: string, cb: (e: ProgressEvent) => void) => {
        if (event === 'progress') this.progressListeners.push(cb)
      },
    }
    status = 200
    responseText = ''
    readyState = 4
    onreadystatechange: (() => void) | null = null
    addEventListener() {}
    open() {}
    setRequestHeader() {}
    send(body: FormData) {
      ChunkServerXhr.requests.push(body)
      const piece = body.get('file') as File
      // The request body is larger than the piece: form fields and boundaries.
      const sent = piece.size + 200
      for (const loaded of [sent / 2, sent]) {
        this.progressListeners.forEach((cb) =>
          cb({ lengthComputable: true, loaded, total: sent } as ProgressEvent),
        )
      }
      const index = Number(body.get('chunk_index') ?? 0)
      const count = Number(body.get('total_chunk_count') ?? 1)
      if (index === ChunkServerXhr.failAt) {
        this.status = 413
        this.responseText = '<html>413 Request Entity Too Large</html>'
      } else {
        this.responseText = JSON.stringify(
          index === count - 1
            ? { message: { file_url: '/private/files/demo.mp4' } }
            : {},
        )
      }
      this.onreadystatechange?.()
    }
  }

  const video = (bytes: number) =>
    new File([new Uint8Array(bytes)], 'demo.mp4', { type: 'video/mp4' })

  afterEach(() => {
    vi.unstubAllGlobals()
    setConfig('uploadChunkSize', null)
    ChunkServerXhr.requests = []
    ChunkServerXhr.failAt = null
  })

  it('sends a file larger than the chunk size in pieces and resolves with the File', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      ChunkServerXhr as unknown as typeof XMLHttpRequest,
    )
    setConfig('uploadChunkSize', 1000)
    const uploader = useFileUpload()
    const progress: number[] = []

    const result = await uploader.upload(video(2500), {
      private: true,
      onProgress: ({ loaded }) => progress.push(loaded),
    })

    expect(result).toEqual({ file_url: '/private/files/demo.mp4' })
    const pieces = ChunkServerXhr.requests.map((form) => ({
      name: (form.get('file') as File).name,
      size: (form.get('file') as File).size,
      index: form.get('chunk_index'),
      count: form.get('total_chunk_count'),
      offset: form.get('chunk_byte_offset'),
      total: form.get('total_file_size'),
      isPrivate: form.get('is_private'),
    }))
    expect(pieces).toEqual([
      {
        name: 'demo.mp4',
        size: 1000,
        index: '0',
        count: '3',
        offset: '0',
        total: '2500',
        isPrivate: '1',
      },
      {
        name: 'demo.mp4',
        size: 1000,
        index: '1',
        count: '3',
        offset: '1000',
        total: '2500',
        isPrivate: '1',
      },
      {
        name: 'demo.mp4',
        size: 500,
        index: '2',
        count: '3',
        offset: '2000',
        total: '2500',
        isPrivate: '1',
      },
    ])
    // Progress counts file bytes across all pieces, never going back.
    expect(progress).toEqual([...progress].sort((a, b) => a - b))
    expect(progress.at(-1)).toBe(2500)
    expect(uploader.state.progress).toBe(100)
    expect(uploader.state.result).toEqual(result)
  })

  it('sends a file in one request when it fits in one piece, or chunking is off', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      ChunkServerXhr as unknown as typeof XMLHttpRequest,
    )

    await upload(video(2500), {})
    setConfig('uploadChunkSize', 1000)
    await upload(video(1000), {})
    await upload(video(2500), { chunkSize: false })

    expect(ChunkServerXhr.requests).toHaveLength(3)
    for (const form of ChunkServerXhr.requests) {
      expect(form.has('chunk_index')).toBe(false)
    }
  })

  it('stops at a failed piece and names it as too big', async () => {
    vi.stubGlobal(
      'XMLHttpRequest',
      ChunkServerXhr as unknown as typeof XMLHttpRequest,
    )
    ChunkServerXhr.failAt = 1
    const uploader = useFileUpload()

    const error = await uploader
      .upload(video(3 * 1024 * 1024), { chunkSize: 1024 * 1024 })
      .catch((e) => e)

    expect(ChunkServerXhr.requests).toHaveLength(2)
    expect(error).toBeInstanceOf(UploadError)
    expect(error.kind).toBe('file-size')
    expect(error.message).toBe(
      'This file is 3 MB, which is more than the server accepts.',
    )
    expect(uploader.state.uploading).toBe(false)
  })
})
