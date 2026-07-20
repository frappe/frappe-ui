/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import ErrorMessage from './ErrorMessage.vue'

function renderErrorMessage(message: string | Error) {
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
