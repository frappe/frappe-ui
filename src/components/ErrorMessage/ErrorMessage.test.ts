/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import ErrorMessage from './ErrorMessage.vue'
import type { ErrorMessageValue } from './types'

function renderErrorMessage(message: ErrorMessageValue) {
  const host = document.createElement('div')
  const app = createApp(ErrorMessage, { message })
  app.mount(host)

  return {
    alert: host.querySelector('[role="alert"]')!,
    unmount: () => app.unmount(),
  }
}

describe('ErrorMessage', () => {
  it('keeps safe markup while removing executable HTML', () => {
    const { alert, unmount } = renderErrorMessage(
      '<strong>Invalid</strong><img src=x onerror=alert(1)><script>alert(2)</script>',
    )

    expect(alert.innerHTML).toContain('<strong>Invalid</strong>')
    expect(alert.innerHTML).not.toContain('onerror')
    expect(alert.innerHTML).not.toContain('<script')
    expect(alert.textContent).not.toContain('alert(2)')

    unmount()
  })

  it('renders every message in an array', () => {
    const { alert, unmount } = renderErrorMessage(['First', 'Second'])

    expect(alert.textContent).toContain('First')
    expect(alert.textContent).toContain('Second')

    unmount()
  })

  it('renders every message on an Error carrying a messages array', () => {
    const error = Object.assign(new Error('Fallback message'), {
      messages: ['First', 'Second'],
    })
    const { alert, unmount } = renderErrorMessage(error)

    expect(alert.textContent).toContain('First')
    expect(alert.textContent).toContain('Second')
    expect(alert.textContent).not.toContain('Fallback message')

    unmount()
  })

  it('falls back to message when the messages array is empty', () => {
    const error = Object.assign(new Error('Fallback message'), {
      messages: [] as string[],
    })
    const { alert, unmount } = renderErrorMessage(error)

    expect(alert.textContent).toContain('Fallback message')

    unmount()
  })

  it('falls back to message when every entry in messages is empty', () => {
    const error = Object.assign(new Error('Fallback message'), {
      messages: ['', ''],
    })
    const { alert, unmount } = renderErrorMessage(error)

    expect(alert.textContent).toContain('Fallback message')

    unmount()
  })

  it('renders nothing for an Error with no messages and no message', () => {
    const error = Object.assign(new Error(''), { messages: [] as string[] })
    const host = document.createElement('div')
    const app = createApp(ErrorMessage, { message: error })
    app.mount(host)

    expect(host.querySelector('[role="alert"]')).toBeNull()

    app.unmount()
  })

  it('sanitizes the non-standard messages value on Error objects', () => {
    const error = Object.assign(new Error('Fallback message'), {
      messages: '<a href="javascript:alert(1)">Invalid</a>',
    })
    const { alert, unmount } = renderErrorMessage(error)

    expect(alert.textContent).toBe('Invalid')
    expect(alert.querySelector('a')?.getAttribute('href')).toBeNull()

    unmount()
  })
})
