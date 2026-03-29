/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { createClient } from '../createClient'
import { baseUrl, server } from './mocks'
import { http, HttpResponse } from 'msw'
import './setup'

interface ToDoDocType {
  name: string
  status: string
}

describe('createClient', () => {
  it('provides defineDoctype with default baseUrl', async () => {
    let receivedBody: any = null

    server.use(
      http.post(
        `${baseUrl}/api/v2/method/ToDo/send_email`,
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({ sent: true })
        },
      ),
    )

    const { defineDoctype, client } = createClient({
      baseUrl,
      realtime: true,
    })

    expect(client.baseUrl).toBe(baseUrl)
    expect(client.realtime).toBe(true)

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      controllerMethods: {
        sendEmail: {
          method: 'send_email',
          args: (names: string[]) => ({ names }),
        },
      },
    })

    const sendEmail = ToDo.sendEmail.create()
    await sendEmail.submit(['todo-1', 'todo-2'])

    expect(sendEmail.data).toStrictEqual({ sent: true })
    expect(receivedBody).toStrictEqual({ names: ['todo-1', 'todo-2'] })
  })

  it('allows per-doctype baseUrl override', async () => {
    const overrideBaseUrl = 'http://override.example.com'
    let usedFactoryBaseUrl = false
    let usedOverrideBaseUrl = false

    server.use(
      http.post(`${baseUrl}/api/v2/method/ToDo/send_email`, () => {
        usedFactoryBaseUrl = true
        return HttpResponse.json({ source: 'factory' })
      }),
      http.post(`${overrideBaseUrl}/api/v2/method/ToDo/send_email`, () => {
        usedOverrideBaseUrl = true
        return HttpResponse.json({ source: 'override' })
      }),
    )

    const { defineDoctype } = createClient({ baseUrl })

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl: overrideBaseUrl,
      controllerMethods: {
        sendEmail: {
          method: 'send_email',
          args: (names: string[]) => ({ names }),
        },
      },
    })

    const sendEmail = ToDo.sendEmail.create()
    await sendEmail.submit(['todo-1'])

    expect(sendEmail.data).toStrictEqual({ source: 'override' })
    expect(usedOverrideBaseUrl).toBe(true)
    expect(usedFactoryBaseUrl).toBe(false)
  })
})
