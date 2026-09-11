/**
 * @vitest-environment jsdom
 *
 * The playhead. `timeupdate` fires about four times a second, which walked the
 * thumb across the track in visible steps, so the position comes off a frame
 * loop while the video plays.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import VideoControls from './VideoControls.vue'

/** A `<video>` stand-in: jsdom has no playback, so time is set by hand. */
function fakeVideo(duration = 100) {
  const el = document.createElement('video')
  Object.defineProperty(el, 'duration', { value: duration, writable: true })
  Object.defineProperty(el, 'paused', { value: true, writable: true })
  return el as HTMLVideoElement & { paused: boolean }
}

let frames: FrameRequestCallback[] = []

beforeEach(() => {
  frames = []
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.push(cb)
    return frames.length
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Run one animation frame, the way the browser would. */
async function paint() {
  const pending = frames.splice(0)
  for (const cb of pending) cb(0)
  await nextTick()
}

function mount(
  videoEl: HTMLVideoElement,
  onFullscreenChange?: (fullscreen: boolean) => void,
) {
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render: () => h(VideoControls, { videoEl, onFullscreenChange }),
  })
  app.mount(root)
  return {
    root,
    fill: () => root.querySelector<HTMLElement>('[aria-label="Seek"] div div'),
    slider: () => root.querySelector<HTMLElement>('[aria-label="Seek"]'),
    fullscreenButton: () =>
      root.querySelector<HTMLButtonElement>('[aria-label="Fullscreen"]'),
    unmount: () => {
      app.unmount()
      root.remove()
    },
  }
}

describe('VideoControls playhead', () => {
  it('follows the video every frame while playing', async () => {
    const video = fakeVideo()
    const ctx = mount(video)

    video.paused = false
    video.dispatchEvent(new Event('play'))
    await nextTick()

    video.currentTime = 25
    await paint()
    expect(ctx.fill()?.style.width).toBe('25%')

    // No `timeupdate` in between: the frame loop is what moves it.
    video.currentTime = 26
    await paint()
    expect(ctx.fill()?.style.width).toBe('26%')

    ctx.unmount()
  })

  it('stops the loop when playback stops', async () => {
    const video = fakeVideo()
    const ctx = mount(video)

    video.paused = false
    video.dispatchEvent(new Event('play'))
    await nextTick()
    await paint()

    video.paused = true
    video.dispatchEvent(new Event('pause'))
    await nextTick()
    frames = []

    video.currentTime = 40
    await paint()
    expect(frames).toHaveLength(0)

    // Paused, the seek still lands — that is what `timeupdate` is left for.
    video.dispatchEvent(new Event('timeupdate'))
    await nextTick()
    expect(ctx.fill()?.style.width).toBe('40%')

    ctx.unmount()
  })

  it('keeps the slider position reported for assistive tech', async () => {
    const video = fakeVideo(200)
    const ctx = mount(video)

    video.dispatchEvent(new Event('durationchange'))
    video.currentTime = 50
    video.dispatchEvent(new Event('timeupdate'))
    await nextTick()

    expect(ctx.slider()?.getAttribute('aria-valuemax')).toBe('200')
    expect(ctx.slider()?.getAttribute('aria-valuenow')).toBe('50')

    ctx.unmount()
  })
})

describe('VideoControls fullscreen', () => {
  it('fullscreens the media wrapper with the standard API', () => {
    const video = fakeVideo()
    const wrapper = document.createElement('div')
    wrapper.dataset.videoFullscreenRoot = ''
    wrapper.appendChild(video)
    const requestFullscreen = vi.fn(() => Promise.resolve())
    Object.defineProperty(wrapper, 'requestFullscreen', {
      value: requestFullscreen,
    })
    const ctx = mount(video)

    ctx.fullscreenButton()?.click()

    expect(requestFullscreen).toHaveBeenCalledOnce()
    ctx.unmount()
    wrapper.remove()
  })

  it('uses native video fullscreen when the standard API is disabled', () => {
    const video = fakeVideo() as HTMLVideoElement & {
      webkitSupportsFullscreen: boolean
      webkitEnterFullscreen: () => void
    }
    const wrapper = document.createElement('div')
    wrapper.dataset.videoFullscreenRoot = ''
    wrapper.appendChild(video)
    const requestFullscreen = vi.fn(() => Promise.resolve())
    Object.defineProperty(wrapper, 'requestFullscreen', {
      value: requestFullscreen,
    })
    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: false,
    })
    video.webkitSupportsFullscreen = true
    video.webkitEnterFullscreen = vi.fn()
    const ctx = mount(video)

    ctx.fullscreenButton()?.click()

    expect(requestFullscreen).not.toHaveBeenCalled()
    expect(video.webkitEnterFullscreen).toHaveBeenCalledOnce()
    ctx.unmount()
    wrapper.remove()
    Reflect.deleteProperty(document, 'fullscreenEnabled')
  })

  it('handles a rejected standard fullscreen request', async () => {
    const video = fakeVideo()
    const requestFullscreen = vi.fn(() =>
      Promise.reject(new DOMException('Fullscreen denied', 'NotAllowedError')),
    )
    Object.defineProperty(video, 'requestFullscreen', {
      value: requestFullscreen,
    })
    const ctx = mount(video)

    ctx.fullscreenButton()?.click()
    await Promise.resolve()

    expect(requestFullscreen).toHaveBeenCalledOnce()
    ctx.unmount()
  })

  it('reports native WebKit fullscreen transitions', () => {
    const video = fakeVideo()
    const onFullscreenChange = vi.fn()
    const ctx = mount(video, onFullscreenChange)

    video.dispatchEvent(new Event('webkitbeginfullscreen'))
    video.dispatchEvent(new Event('webkitendfullscreen'))

    expect(onFullscreenChange).toHaveBeenNthCalledWith(1, true)
    expect(onFullscreenChange).toHaveBeenNthCalledWith(2, false)
    ctx.unmount()
  })
})
