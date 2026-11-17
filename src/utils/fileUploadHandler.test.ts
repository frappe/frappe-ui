// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
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

  describe('chunked uploads', () => {
    // Answers each request on the next tick with the next scripted
    // response, after reporting upload progress for the whole body.
    class ScriptedXhr {
      static DONE = 4
      static instances: ScriptedXhr[] = []
      static responses: Array<{ status: number; body: unknown }> = []
      static inFlight = 0
      static maxInFlight = 0

      uploadListeners: Record<string, Array<(e: unknown) => void>> = {}
      upload = {
        addEventListener: (event: string, cb: (e: unknown) => void) => {
          this.uploadListeners[event] = this.uploadListeners[event] || []
          this.uploadListeners[event].push(cb)
        },
      }
      status = 0
      responseText = ''
      readyState = 1
      body: FormData | null = null
      onreadystatechange: (() => void) | null = null

      constructor() {
        ScriptedXhr.instances.push(this)
      }
      addEventListener() {}
      open() {}
      setRequestHeader() {}
      send(body: FormData) {
        this.body = body
        ScriptedXhr.inFlight++
        ScriptedXhr.maxInFlight = Math.max(
          ScriptedXhr.maxInFlight,
          ScriptedXhr.inFlight,
        )
        const response = ScriptedXhr.responses.shift() ?? {
          status: 200,
          body: {},
        }
        setTimeout(() => {
          // Multipart overhead makes the request larger than the chunk.
          const total = (body.get('file') as Blob).size + 200
          for (const loaded of [total / 2, total]) {
            ;(this.uploadListeners['progress'] || []).forEach((cb) =>
              cb({ lengthComputable: true, loaded, total }),
            )
          }
          ScriptedXhr.inFlight--
          this.status = response.status
          this.responseText = JSON.stringify(response.body)
          this.readyState = 4
          this.onreadystatechange?.()
        })
      }
    }

    // jsdom's Blob has no text().
    const readText = (blob: Blob) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsText(blob)
      })

    const bigFile = () =>
      new File(['a'.repeat(10), 'b'.repeat(10), 'c'.repeat(5)], 'big.bin')

    beforeEach(() => {
      vi.stubGlobal(
        'XMLHttpRequest',
        ScriptedXhr as unknown as typeof XMLHttpRequest,
      )
      setConfig('fileChunkSize', 10)
    })

    afterEach(() => {
      setConfig('fileChunkSize', null)
      ScriptedXhr.instances = []
      ScriptedXhr.responses = []
      ScriptedXhr.inFlight = 0
      ScriptedXhr.maxInFlight = 0
    })

    it('sends a large file as chunks, one after another', async () => {
      ScriptedXhr.responses = [
        { status: 200, body: {} },
        { status: 200, body: {} },
        { status: 200, body: { message: { file_url: '/files/big.bin' } } },
      ]
      const handler = new FileUploadHandler()
      const events: string[] = []
      const progress: number[] = []
      handler.on('start', () => events.push('start'))
      handler.on('finish', () => events.push('finish'))
      handler.on('progress', (p: { uploaded: number; total: number }) => {
        expect(p.total).toBe(25)
        progress.push(p.uploaded)
      })

      const result = await handler.upload(bigFile(), { doctype: 'Note' })

      expect(result).toEqual({ file_url: '/files/big.bin' })
      expect(events).toEqual(['start', 'finish'])
      expect(ScriptedXhr.maxInFlight).toBe(1)

      const bodies = ScriptedXhr.instances.map((xhr) => xhr.body!)
      expect(
        await Promise.all(bodies.map((b) => readText(b.get('file') as File))),
      ).toEqual(['a'.repeat(10), 'b'.repeat(10), 'c'.repeat(5)])
      bodies.forEach((body, index) => {
        expect((body.get('file') as File).name).toBe('big.bin')
        expect(body.get('doctype')).toBe('Note')
        expect(body.get('chunk_index')).toBe(String(index))
        expect(body.get('total_chunk_count')).toBe('3')
        expect(body.get('chunk_byte_offset')).toBe(String(index * 10))
        expect(body.get('total_file_size')).toBe('25')
      })

      // Progress covers the whole file and never goes backwards.
      expect(progress).toEqual([...progress].sort((a, b) => a - b))
      expect(progress.at(-1)).toBe(25)
    })

    it('sends a file that fits in one chunk as a plain upload', async () => {
      await new FileUploadHandler().upload(file(), {})

      expect(ScriptedXhr.instances).toHaveLength(1)
      expect(ScriptedXhr.instances[0]!.body!.has('chunk_index')).toBe(false)
    })

    it('stops at the first failed chunk', async () => {
      ScriptedXhr.responses = [
        { status: 200, body: {} },
        {
          status: 417,
          body: {
            _server_messages: JSON.stringify([
              JSON.stringify({ message: 'Disk full' }),
            ]),
          },
        },
      ]
      const handler = new FileUploadHandler()
      const onError = vi.fn()
      const onFinish = vi.fn()
      handler.on('error', onError)
      handler.on('finish', onFinish)

      const error = await handler.upload(bigFile(), {}).catch((e) => e)

      expect(error).toBeInstanceOf(UploadError)
      expect(error.status).toBe(417)
      expect(error.message).toBe('Disk full')
      expect(ScriptedXhr.instances).toHaveLength(2)
      expect(onError).toHaveBeenCalledTimes(1)
      expect(onFinish).not.toHaveBeenCalled()
    })

    it('stops between chunks when the signal aborts', async () => {
      const controller = new AbortController()
      const handler = new FileUploadHandler()
      handler.on('progress', ({ uploaded }: { uploaded: number }) => {
        if (uploaded >= 10) controller.abort()
      })

      const error = await handler
        .upload(bigFile(), { signal: controller.signal })
        .catch((e) => e)

      expect(error).toBeInstanceOf(UploadError)
      expect(error.kind).toBe('abort')
      expect(ScriptedXhr.instances).toHaveLength(1)
    })

    it('rejects when an error response is JSON null', async () => {
      ScriptedXhr.responses = [{ status: 500, body: null }]

      const error = await new FileUploadHandler()
        .upload(file(), {})
        .catch((e) => e)

      expect(error).toBeInstanceOf(UploadError)
      expect(error.status).toBe(500)
      expect(error.message).toBe('Upload failed')
    })

    it('does not quote maxFileSize when a proxy answers 413', async () => {
      ScriptedXhr.responses = [{ status: 413, body: {} }]
      setConfig('maxFileSize', 200 * 1024 * 1024)
      try {
        const error = await new FileUploadHandler()
          .upload(file(), {})
          .catch((e) => e)

        expect(error.status).toBe(413)
        expect(error.message).toBe(
          'The server rejected this upload because it is too large.',
        )
      } finally {
        setConfig('maxFileSize', null)
      }
    })
  })
})
