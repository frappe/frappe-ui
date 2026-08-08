// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { isPrivateUpload, upload } from './useFileUpload'

describe('isPrivateUpload', () => {
  it('defaults to private when neither private nor is_private is set', () => {
    expect(isPrivateUpload()).toBe(true)
    expect(isPrivateUpload({})).toBe(true)
  })

  it('honors an explicit private: false', () => {
    expect(isPrivateUpload({ private: false })).toBe(false)
  })

  it('honors an explicit private: true', () => {
    expect(isPrivateUpload({ private: true })).toBe(true)
  })

  it('falls back to is_private in its three truthy shapes', () => {
    expect(isPrivateUpload({ is_private: true })).toBe(true)
    expect(isPrivateUpload({ is_private: 1 })).toBe(true)
    expect(isPrivateUpload({ is_private: '1' })).toBe(true)
  })

  it('is_private: false/0/"0" resolves to public', () => {
    expect(isPrivateUpload({ is_private: false })).toBe(false)
    expect(isPrivateUpload({ is_private: 0 })).toBe(false)
    expect(isPrivateUpload({ is_private: '0' })).toBe(false)
  })

  it('private wins over is_private when both are set', () => {
    expect(isPrivateUpload({ private: false, is_private: true })).toBe(false)
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
})
