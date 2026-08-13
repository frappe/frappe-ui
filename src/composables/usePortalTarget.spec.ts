// @vitest-environment jsdom
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, type App } from 'vue'
import Dialog from '../components/Dialog/Dialog.vue'
import Popover from '../components/Popover/Popover.vue'
import RailItemBadge from '../components/Rail/RailItemBadge.vue'
import {
  portalTargetKey,
  providePortalTarget,
  usePortalTarget,
  type PortalTarget,
} from './usePortalTarget'

const mounted: Array<{ app: App; host: HTMLElement }> = []

afterEach(() => {
  while (mounted.length) {
    const { app, host } = mounted.pop()!
    app.unmount()
    host.remove()
  }
})

function mount(app: App) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  app.mount(host)
  mounted.push({ app, host })
  return host
}

/** Mount a component that only reports what `usePortalTarget` resolved. */
function resolve(
  override?: PortalTarget,
  provided?: PortalTarget,
): PortalTarget | undefined {
  let resolved: PortalTarget | undefined
  const app = createApp(
    defineComponent({
      setup() {
        resolved = usePortalTarget(() => override).value
        return () => null
      },
    }),
  )
  if (provided !== undefined) app.provide(portalTargetKey, provided)
  mount(app)
  return resolved
}

/** A body-level element standing in for a host's portal container. */
function portalElement(id: string) {
  const el = document.createElement('div')
  el.id = id
  document.body.appendChild(el)
  return el
}

describe('usePortalTarget', () => {
  it('resolves to undefined so reka keeps its own body default', () => {
    expect(resolve()).toBeUndefined()
  })

  it('resolves the host-provided target when the caller passes nothing', () => {
    const el = portalElement('host-portal')
    expect(resolve(undefined, el)).toBe(el)
    el.remove()
  })

  it('lets an explicit override win over the host-provided target', () => {
    const el = portalElement('host-portal')
    expect(resolve('#explicit', el)).toBe('#explicit')
    el.remove()
  })

  it('tracks a reactive target', async () => {
    const target = ref<PortalTarget | undefined>('#first')
    let resolved!: { value: PortalTarget | undefined }
    const app = createApp(
      defineComponent({
        setup() {
          resolved = usePortalTarget(target)
          return () => null
        },
      }),
    )
    mount(app)

    expect(resolved.value).toBe('#first')
    target.value = '#second'
    expect(resolved.value).toBe('#second')
  })

  it('resolves the key through the global symbol registry', () => {
    // A host that cannot import from frappe-ui provides by name instead.
    expect(portalTargetKey).toBe(Symbol.for('frappe-ui:portal-target'))
  })

  it('provides to descendants via providePortalTarget', () => {
    let resolved: PortalTarget | undefined
    const Child = defineComponent({
      setup() {
        resolved = usePortalTarget().value
        return () => null
      },
    })
    const app = createApp(
      defineComponent({
        setup() {
          providePortalTarget('#from-ancestor')
          return () => h(Child)
        },
      }),
    )
    mount(app)

    expect(resolved).toBe('#from-ancestor')
  })
})

describe('overlays honour the host target', () => {
  it('teleports a Dialog into the host target instead of body', async () => {
    const portal = portalElement('dialog-portal')
    const app = createApp(Dialog, { open: true, title: 'Embedded' })
    app.provide(portalTargetKey, portal)
    mount(app)
    // reka's portal only renders once mounted, one tick after app.mount().
    await nextTick()

    expect(portal.querySelector('[role="dialog"]')).not.toBeNull()
    portal.remove()
  })

  it('lets a Popover portalTo prop outrank the host target', async () => {
    const host = portalElement('popover-host-portal')
    const explicit = portalElement('popover-explicit-portal')
    const app = createApp(Popover, {
      open: true,
      portalTo: '#popover-explicit-portal',
    })
    app.provide(portalTargetKey, host)
    mount(app)
    await nextTick()

    expect(explicit.querySelector('[data-slot="content"]')).not.toBeNull()
    expect(host.querySelector('[data-slot="content"]')).toBeNull()
    host.remove()
    explicit.remove()
  })

  it('routes a hand-rolled Teleport to the host target', async () => {
    // The Rail badge pill teleports itself rather than through a reka portal,
    // so it spells out the 'body' fallback and would miss an inject it forgot.
    const portal = portalElement('rail-portal')
    const app = createApp(RailItemBadge, { count: 3, variant: 'count' })
    app.provide(portalTargetKey, portal)
    mount(app)
    await nextTick()

    expect(portal.textContent).toContain('3')
  })
})

describe('no component teleports past the host target', () => {
  // The rule has no compiler behind it. A new component that hardcodes its
  // target still builds, still passes its own tests, and only fails once
  // someone embeds the library — where the overlay lands outside the styles.

  // Read with fs, not import.meta.glob: a `?raw` glob puts every .vue file in
  // the module graph as a one-statement string module, and v8 coverage then
  // attributes that to the component's own path. It cost 14 points.
  // `experimental/` too: it ships in the same package and its components
  // teleport for the same reason. Scanning `src/` alone let FloatingWindow
  // hardcode `body` and go unnoticed.
  const ROOTS = ['src', 'experimental'].map((dir) => join(process.cwd(), dir))

  function vueFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return vueFiles(full)
      return entry.name.endsWith('.vue') ? [full] : []
    })
  }

  const SCRIPT_BLOCK = /<script\b[^>]*>[\s\S]*?<\/script>/g
  const TELEPORTING_TAG = /<([A-Z]\w*Portal|Teleport)\b[^>]*>/g
  const BOUND_TARGET = /(?::|v-bind:)to=/
  const LITERAL_BODY = /(?::|v-bind:)to="\s*'body'\s*"|(?<!:)\bto="body"/

  it('binds every portal and Teleport to a resolved target', () => {
    const offenders: string[] = []
    let scanned = 0

    for (const file of ROOTS.flatMap(vueFiles)) {
      if (/\.(story|playground)\.vue$/.test(file)) continue
      const path = relative(process.cwd(), file)

      // Drop <script> blocks first. A comment that names `<Teleport>` in prose
      // is not a teleport, and scanning it reads as an unbound one.
      const markup = readFileSync(file, 'utf8').replace(SCRIPT_BLOCK, '')

      for (const [tag, name] of markup.matchAll(TELEPORTING_TAG)) {
        scanned++
        if (!BOUND_TARGET.test(tag)) {
          offenders.push(`${path}: <${name}> has no :to binding`)
        } else if (LITERAL_BODY.test(tag)) {
          offenders.push(`${path}: <${name}> hardcodes 'body'`)
        }
      }
    }

    // A broken scan would find nothing and pass. There are 24 teleporting tags
    // across both roots (19 in `src`, 5 in `experimental`), so a drop means the
    // walk broke, not that the components changed. Kept close to the real count
    // so losing one root fails here instead of passing quietly.
    expect(scanned).toBeGreaterThan(20)

    // Call usePortalTarget() and bind its result, so an embedding host can
    // redirect the overlay. See spec/portal-target.md.
    expect(offenders).toEqual([])
  })
})
