/**
 * End-to-end integration test — points a real HTTP transport at a live bench site.
 *
 * Skipped when `SYNC_INTEGRATION_URL` isn't set, so `yarn vitest run` in isolation
 * stays fast and hermetic. To run:
 *
 *   SYNC_INTEGRATION_URL=http://test.localhost:8000 \
 *   SYNC_INTEGRATION_USER=Administrator SYNC_INTEGRATION_PASS=admin \
 *   npx vitest run src/sync/__tests__/integration.test.ts
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createHttpTransport } from '../http-transport'
import { createClient } from '../vue'
import { server as mswServer } from '../../mocks/node'

const URL = process.env.SYNC_INTEGRATION_URL
const USER = process.env.SYNC_INTEGRATION_USER ?? 'Administrator'
const PASS = process.env.SYNC_INTEGRATION_PASS ?? 'admin'

const run = URL ? describe : describe.skip

type Cookies = Record<string, string>

function parseSetCookie(headers: Headers): Cookies {
  const cookies: Cookies = {}
  // undici's Headers has .getSetCookie()
  const raw = (headers as any).getSetCookie?.() as string[] | undefined
  const list = raw ?? []
  for (const line of list) {
    const [pair] = line.split(';')
    const [k, ...v] = pair.split('=')
    cookies[k.trim()] = v.join('=').trim()
  }
  return cookies
}

async function login(url: string, user: string, pwd: string): Promise<Cookies> {
  const res = await fetch(`${url}/api/method/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Host: 'test.localhost' },
    body: new URLSearchParams({ usr: user, pwd }).toString(),
    // @ts-ignore - node fetch
    redirect: 'manual',
  })
  if (res.status >= 400) throw new Error(`login failed ${res.status}`)
  return parseSetCookie(res.headers)
}

function fetchWithCookies(cookies: Cookies): typeof fetch {
  return async (input: any, init: any = {}) => {
    const headers = new Headers(init.headers ?? {})
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
    if (cookieHeader) headers.set('Cookie', cookieHeader)
    headers.set('Host', 'test.localhost')
    return fetch(input, { ...init, headers })
  }
}

run('integration — real bench transport', () => {
  let cookies: Cookies
  let client: ReturnType<typeof createClient>
  let ToDo: ReturnType<typeof client.doctype<any>>

  beforeAll(async () => {
    mswServer.close() // integration test hits a real network endpoint
    cookies = await login(URL!, USER, PASS)
    const transport = createHttpTransport({
      url: URL!,
      fetch: fetchWithCookies(cookies),
      csrfToken: 'None',
    })
    client = createClient({ name: 'integration', transport })
    ToDo = client.doctype<any>('ToDo')
  }, 30_000)

  afterAll(async () => {
    // best-effort logout
    try {
      await fetchWithCookies(cookies)(`${URL}/api/method/logout`, { method: 'GET' })
    } catch {}
  })

  it('sync.pull returns docs (permission-checked)', async () => {
    const doctypes = await fetchWithCookies(cookies)(
      `${URL}/api/method/frappe.sync.api.pull`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subs: [
            {
              id: 's1',
              query: { kind: 'list', doctype: 'ToDo', limit: 5 },
            },
          ],
        }),
      },
    )
    const body = await doctypes.json()
    expect(body.message).toBeTruthy()
    expect(body.message.docs).toBeDefined()
    expect(body.message.cursor).toBeTypeOf('number')
  })

  it('insert via sync.push, then pull sees it', async () => {
    const desc = `integration-${Date.now()}`
    const doc = await ToDo.insert({ description: desc })
    expect(doc.name).toBeDefined()

    // Fresh pull to observe it via list
    const listHandle = ToDo.list({
      filters: { description: desc },
      limit: 5,
    })
    // Give the pull time to complete
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 100))
    }
    expect(listHandle.docs.value.some((d: any) => d.description === desc)).toBe(true)
  }, 20_000)
})
