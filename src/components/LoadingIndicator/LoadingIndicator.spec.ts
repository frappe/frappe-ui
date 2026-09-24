// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
import { LoadingIndicator } from '.'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

afterEach(() => {
  document.body.innerHTML = ''
  _resetWarnDeprecated()
  vi.restoreAllMocks()
})

describe('<LoadingIndicator />', () => {
  it('renders a Spinner with its props, and warns once that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const host = document.createElement('div')
    document.body.appendChild(host)
    createApp({
      render: () => [
        h(LoadingIndicator, { size: 'lg', class: 'text-ink-gray-5' }),
        h(LoadingIndicator),
      ],
    }).mount(host)

    const spinners = host.querySelectorAll('svg.fui-spinner')
    expect(spinners).toHaveLength(2)
    expect((spinners[0] as SVGElement).style.width).toBe('20px')
    expect(spinners[0].classList.contains('text-ink-gray-5')).toBe(true)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('LoadingIndicator is deprecated')
  })
})
