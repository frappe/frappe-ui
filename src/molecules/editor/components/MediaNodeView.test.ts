/**
 * @vitest-environment jsdom
 *
 * The caption field rendered by the media node view.
 *
 * Two bugs are pinned here: the caption input was unusable because the node
 * view is an inline draggable leaf (the browser drags the image instead of
 * focusing the field), and one image's caption could show up under the next
 * one when ProseMirror reused the node view.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'

let Editor: any
let EditorContent: any
let CommentKit: any

beforeEach(async () => {
  ;({ default: Editor } = await import('../Editor.vue'))
  ;({ default: EditorContent } = await import('../EditorContent.vue'))
  ;({ CommentKit } = await import('../kits'))
})

function mount(html: string, editable = true) {
  const state = reactive<Record<string, any>>({ modelValue: html, editable })
  let editor: any = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        {
          extensions: [CommentKit],
          ...state,
          'onUpdate:modelValue': (v: any) => (state.modelValue = v),
        },
        {
          default: ({ editor: e }: any) => {
            editor = e
            return h(EditorContent, { editor: e })
          },
        },
      )
    },
  })
  app.mount(root)
  return { root, state, app, getEditor: () => editor }
}

/** Flush Vue + the node-view renderer, which mounts on its own tick. */
async function settle() {
  for (let i = 0; i < 4; i += 1) await nextTick()
}

function captionInputs(root: HTMLElement): HTMLInputElement[] {
  return Array.from(root.querySelectorAll('input[aria-label="Caption"]'))
}

describe('media node view caption field', () => {
  it('renders an editable caption input seeded from data-caption', async () => {
    const ctx = mount('<p><img src="/files/a.png" data-caption="Hello"></p>')
    await settle()

    const inputs = captionInputs(ctx.root)
    expect(inputs).toHaveLength(1)
    expect(inputs[0].value).toBe('Hello')
    ctx.app.unmount()
  })

  it('opts the caption field out of the node view drag', async () => {
    const ctx = mount('<p><img src="/files/a.png" data-caption="Hello"></p>')
    await settle()

    const field = ctx.root.querySelector(
      '[data-media-text-field]',
    ) as HTMLElement
    // ProseMirror sets draggable=true on the node view wrapper because the
    // image node is draggable. An input under a draggable ancestor cannot be
    // focused with the mouse, so the field opts out explicitly.
    expect(field.getAttribute('draggable')).toBe('false')

    const wrapper = field.closest('[data-node-view-wrapper]') as HTMLElement
    expect(wrapper.getAttribute('draggable')).toBe('true')

    // A pointerdown in the field must not reach the editor, which would turn it
    // into a node selection and pull focus straight back out of the input.
    let reachedEditor = false
    ctx.root.addEventListener('mousedown', () => {
      reachedEditor = true
    })
    captionInputs(ctx.root)[0].dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    expect(reachedEditor).toBe(false)

    ctx.app.unmount()
  })

  it('writes a typed caption to the caption attr and leaves alt alone', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" alt="Screenshot 2020-05-09 11.04.00"></p>',
    )
    await settle()

    // Legacy alt does not open the caption field, so open it as a user would:
    // through the media menu, which portals out of the editor root.
    const trigger = ctx.root.querySelector(
      'button[aria-label="Media options"]',
    ) as HTMLButtonElement
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    trigger.click()
    await settle()

    const row = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    ).find((el) => el.textContent?.trim() === 'Caption') as HTMLElement
    row.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    row.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    row.click()
    await settle()

    const input = captionInputs(ctx.root)[0]
    input.value = 'A real caption'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))
    await settle()

    const html = ctx.getEditor().getHTML()
    expect(html).toContain('data-caption="A real caption"')
    expect(html).toContain('alt="Screenshot 2020-05-09 11.04.00"')

    ctx.app.unmount()
  })
})

describe('media node view in read mode', () => {
  it('renders the caption as text, not a disabled input', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" data-caption="Our office cat"></p>',
      false,
    )
    await settle()

    expect(captionInputs(ctx.root)).toHaveLength(0)
    expect(ctx.root.textContent).toContain('Our office cat')
    ctx.app.unmount()
  })

  it('shows nothing for a legacy image whose alt holds an upload filename', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" alt="Screenshot 2020-05-09 11.04.00"></p>',
      false,
    )
    await settle()

    expect(captionInputs(ctx.root)).toHaveLength(0)
    expect(ctx.root.textContent).not.toContain('Screenshot 2020-05-09')
    ctx.app.unmount()
  })
})

describe('media node view native video fullscreen', () => {
  it('hides editing chrome without restyling the inline container', async () => {
    const ctx = mount(
      '<p><video src="/files/clip.mp4" data-caption="Release demo"></video></p>',
    )
    await settle()

    const video = ctx.root.querySelector('video') as HTMLVideoElement
    const container = video.closest(
      '[data-video-fullscreen-root]',
    ) as HTMLElement
    expect(captionInputs(ctx.root)).toHaveLength(1)

    video.dispatchEvent(new Event('webkitbeginfullscreen'))
    await settle()

    expect(captionInputs(ctx.root)).toHaveLength(0)
    expect(container.classList).not.toContain('bg-black')
    expect(video.classList).toContain('rounded-6')
    expect(video.classList).not.toContain('rounded-none')
    expect(video.classList).not.toContain('size-full')

    video.dispatchEvent(new Event('webkitendfullscreen'))
    await settle()
    expect(captionInputs(ctx.root)).toHaveLength(1)

    ctx.app.unmount()
  })
})

describe('media node view reuse', () => {
  it('does not carry a caption over to the next image', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" data-caption="First"><img src="/files/b.png" data-caption="Second"></p>',
    )
    await settle()
    expect(captionInputs(ctx.root).map((i) => i.value)).toEqual([
      'First',
      'Second',
    ])

    // Drop the first image. The second one slides into its position, which is
    // exactly when ProseMirror hands an existing inline node view a different
    // node and the stale caption used to stick.
    const editor = ctx.getEditor()
    editor.commands.setNodeSelection(1)
    editor.commands.deleteSelection()
    await settle()

    expect(captionInputs(ctx.root).map((i) => i.value)).toEqual(['Second'])
    ctx.app.unmount()
  })
})

describe('media node view actions menu', () => {
  async function openMenu(root: HTMLElement) {
    const trigger = root.querySelector(
      'button[aria-label="Media options"]',
    ) as HTMLButtonElement
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    trigger.click()
    await settle()
  }
  function item(label: string): HTMLElement {
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    )
    const found = items.find((el) => el.textContent?.trim() === label)
    if (!found) throw new Error(`no menu item "${label}"`)
    return found
  }
  async function pick(label: string) {
    const el = item(label)
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    el.click()
    await settle()
  }

  it('lists every action for a selected image', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" width="800" height="400"></p>',
    )
    await settle()
    ctx.getEditor().commands.setNodeSelection(1)
    await settle()
    await openMenu(ctx.root)

    const labels = Array.from(
      document.body.querySelectorAll('[role="menuitem"]'),
    ).map((el) => el.textContent?.trim())
    expect(labels).toEqual([
      'Caption',
      'Left',
      'Center',
      'Right',
      'Resize',
      'Replace image',
      'Duplicate',
      'Open link',
      'Copy image',
      'Download',
      'Delete',
    ])
    // the caption row carries the design's check only while the caption
    // shows; the alignment in force carries one always
    const rows = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    )
    const checkedRows = rows
      .filter((el) => el.querySelector('[data-checked]'))
      .map((el) => el.textContent?.trim())
    expect(checkedRows).toEqual(['Left'])
    ctx.app.unmount()
  })

  it("lists the design's six rows for a selected video, in its order", async () => {
    const ctx = mount(
      '<video src="/files/clip.mp4" data-caption="Release demo" loop></video>',
    )
    await settle()
    ctx.getEditor().commands.setNodeSelection(0)
    await settle()
    await openMenu(ctx.root)

    const rows = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    )
    expect(rows.map((el) => el.textContent?.trim())).toEqual([
      'Caption',
      'Replace',
      'Align',
      'Video settings',
      'Duplicate',
      'Delete',
    ])
    // one list: no group labels, no dividers
    expect(document.body.querySelector('[role="separator"]')).toBeNull()
    // the caption shows, so its row is checked; nothing is a switch any more
    expect(rows[0].querySelector('[data-checked]')).not.toBeNull()
    expect(document.body.querySelector('button[role="switch"]')).toBeNull()
    expect(rows[5].className).not.toMatch(/red/)
    ctx.app.unmount()
  })

  it('deletes the image and leaves the paragraph', async () => {
    const ctx = mount(
      '<p>x</p><p><img src="/files/a.png" width="800" height="400"></p><p>y</p>',
    )
    await settle()
    ctx.getEditor().commands.setNodeSelection(4)
    await settle()
    await openMenu(ctx.root)
    await pick('Delete')

    expect(ctx.getEditor().getHTML()).toBe('<p>x</p><p></p><p>y</p>')
    ctx.app.unmount()
  })

  it('duplicates the image into a paragraph of its own, caption and all', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" data-caption="Cat" width="800" height="400"></p><p>y</p>',
    )
    await settle()
    const editor = ctx.getEditor()
    editor.commands.setNodeSelection(1)
    await settle()
    await openMenu(ctx.root)
    await pick('Duplicate')

    const images: { caption: string | null }[] = []
    editor.state.doc.descendants((node: any) => {
      if (node.type.name === 'image')
        images.push({ caption: node.attrs.caption })
    })
    expect(images).toEqual([{ caption: 'Cat' }, { caption: 'Cat' }])
    expect(editor.getHTML()).toMatch(
      /^<p><img [^>]*><\/p><p><img [^>]*><\/p><p>y<\/p>$/,
    )
    // the copy is the selected one, ready to be captioned or moved
    expect(editor.state.selection.toJSON()).toMatchObject({
      type: 'node',
      anchor: 4,
    })
    ctx.app.unmount()
  })

  it('resizes to a share of the width it has, keeping the ratio', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" width="800" height="400"></p>',
    )
    await settle()
    const editor = ctx.getEditor()
    const wrapper = ctx.root.querySelector(
      '[data-node-view-wrapper]',
    ) as HTMLElement
    Object.defineProperty(wrapper, 'clientWidth', { value: 700 })
    editor.commands.setNodeSelection(1)
    await settle()
    await openMenu(ctx.root)
    const resize = item('Resize')
    resize.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
    resize.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }))
    resize.click()
    await settle()
    await pick('Medium')

    const node = editor.state.doc.nodeAt(1)
    expect(node.attrs.width).toBe(350)
    expect(node.attrs.height).toBe(175)
    // and stays selected, its pills and menu still up for the next change
    expect(editor.state.selection.toJSON()).toMatchObject({
      type: 'node',
      anchor: 1,
    })
    ctx.app.unmount()
  })
})

describe('video playback switches', () => {
  async function mountVideo(html: string) {
    const ctx = mount(html)
    await settle()
    const video = ctx.root.querySelector('video') as HTMLVideoElement
    // a video is a block of its own, so it sits at the top of the document
    ctx.getEditor().commands.setNodeSelection(0)
    await settle()
    return { ...ctx, video }
  }

  it('keeps an off flag off across a round trip through HTML', async () => {
    const ctx = await mountVideo('<video src="/files/clip.mp4"></video>')
    const html: string = ctx.getEditor().getHTML()
    expect(html).not.toContain('autoplay')
    expect(html).not.toContain('loop')
    expect(html).not.toContain('muted')
    expect(ctx.video.hasAttribute('autoplay')).toBe(false)

    ctx.getEditor().commands.setVideoOptions({ loop: true })
    await settle()
    expect(ctx.getEditor().getHTML()).toContain('loop=""')
    expect(ctx.getEditor().getHTML()).not.toContain('autoplay')
  })

  it('reads the flags back as booleans', async () => {
    const ctx = await mountVideo(
      '<video src="/files/clip.mp4" autoplay muted></video>',
    )
    const node = ctx.getEditor().state.doc.nodeAt(0)
    expect(node.attrs).toMatchObject({
      autoplay: true,
      loop: false,
      muted: true,
    })
  })

  it('starts the video when Autoplay goes on, and stops it when off', async () => {
    const ctx = await mountVideo('<video src="/files/clip.mp4"></video>')
    let paused = true
    Object.defineProperty(ctx.video, 'paused', { get: () => paused })
    const play = vi
      .spyOn(ctx.video, 'play')
      .mockImplementation(() => ((paused = false), Promise.resolve()))
    const pause = vi
      .spyOn(ctx.video, 'pause')
      .mockImplementation(() => void (paused = true))

    ctx.getEditor().commands.setVideoOptions({ autoplay: true })
    await settle()
    expect(play).toHaveBeenCalledTimes(1)

    ctx.getEditor().commands.setVideoOptions({ autoplay: false })
    await settle()
    expect(pause).toHaveBeenCalledTimes(1)
  })

  it('plays muted when the browser refuses sound', async () => {
    const ctx = await mountVideo('<video src="/files/clip.mp4"></video>')
    Object.defineProperty(ctx.video, 'paused', { get: () => true })
    const play = vi
      .spyOn(ctx.video, 'play')
      .mockImplementationOnce(() =>
        Promise.reject(new DOMException('no gesture', 'NotAllowedError')),
      )
      .mockImplementation(() => Promise.resolve())

    ctx.getEditor().commands.setVideoOptions({ autoplay: true })
    await settle()
    await new Promise((r) => setTimeout(r, 0))
    expect(play).toHaveBeenCalledTimes(2)
    expect(ctx.video.muted).toBe(true)
  })

  it('starts a video that opens with Autoplay on', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve())
    try {
      await mountVideo('<video src="/files/clip.mp4" autoplay></video>')
      expect(play).toHaveBeenCalled()
    } finally {
      play.mockRestore()
    }
  })
})
