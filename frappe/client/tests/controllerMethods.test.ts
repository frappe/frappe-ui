/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { defineDoctype, ControllerMethodDef } from '../defineDoctype'
import { baseUrl, server } from './mocks'
import { http, HttpResponse } from 'msw'
import { waitFor } from './setup'
import './setup'

interface ToDoDocType {
  name: string
  status: string
}

describe('defineDoctype controllerMethods', () => {
  it('defines and calls controller methods correctly', async () => {
    let receivedBody: any = null

    server.use(
      http.post(
        `${baseUrl}/api/v2/method/ToDo/send_email`,
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({
            sent: true,
            count: receivedBody.names.length,
          })
        },
      ),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      controllerMethods: {
        sendEmail: {
          method: 'send_email',
          args: (names: string[]) => ({ names }),
        },
      },
    })

    expect(ToDo.sendEmail).toBeDefined()

    const sendEmail = ToDo.sendEmail.create()
    expect(sendEmail.loading).toBe(false)
    expect(sendEmail.data).toBe(null)

    const promise = sendEmail.submit(['task-1', 'task-2'])

    expect(sendEmail.loading).toBe(true)

    await promise

    expect(sendEmail.loading).toBe(false)
    expect(sendEmail.data).toStrictEqual({ sent: true, count: 2 })
    expect(receivedBody).toStrictEqual({ names: ['task-1', 'task-2'] })
  })

  it('handles errors in controller methods', async () => {
    server.use(
      http.post(`${baseUrl}/api/v2/method/ToDo/fail_method`, () => {
        return HttpResponse.json(
          {
            errors: [
              {
                type: 'ServerError',
                message: 'Something went wrong',
              },
            ],
          },
          { status: 500 },
        )
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      controllerMethods: {
        failMethod: {
          method: 'fail_method',
          args: () => ({}),
        },
      },
    })

    const failMethod = ToDo.failMethod.create()

    try {
      await failMethod.submit()
    } catch (e) {
      // Expected error
    }

    expect(failMethod.error).toBeTruthy()
    expect(failMethod.error.type).toBe('ServerError')
  })

  it('supports GET requests in controller methods', async () => {
    server.use(
      http.get(`${baseUrl}/api/v2/method/ToDo/get_info`, ({ request }) => {
        const url = new URL(request.url)
        return HttpResponse.json({
          info: 'some info',
          param: url.searchParams.get('param'),
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      controllerMethods: {
        getInfo: {
          method: 'get_info',
          httpMethod: 'GET',
          args: (param: string) => ({ param }),
        },
      },
    })

    const getInfo = ToDo.getInfo.create()
    await getInfo.submit('test-value')

    expect(getInfo.data).toStrictEqual({
      info: 'some info',
      param: 'test-value',
    })
  })

  it('supports object parameters directly', async () => {
    let receivedBody: any = null
    server.use(
      http.post(
        `${baseUrl}/api/v2/method/ToDo/complex_action`,
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({ success: true })
        },
      ),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      controllerMethods: {
        complexAction: {
          method: 'complex_action',
          args: (params: { names: string[]; action: string }) => params,
        },
      },
    })

    const complexAction = ToDo.complexAction.create()

    await complexAction.submit({
      names: ['a', 'b'],
      action: 'delete',
    })

    expect(receivedBody).toStrictEqual({
      names: ['a', 'b'],
      action: 'delete',
    })
  })

  it('supports typed return values', async () => {
    server.use(
      http.post(`${baseUrl}/api/v2/method/ToDo/typed_method`, () => {
        return HttpResponse.json({ result: 42 })
      }),
    )

    interface TypedResponse {
      result: number
    }

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      controllerMethods: {
        typedMethod: {
          method: 'typed_method',
          args: () => ({}),
        } as ControllerMethodDef<[], TypedResponse>,
      },
    })

    const typedMethod = ToDo.typedMethod.create()

    await typedMethod.submit()

    // @ts-expect-error
    const val: string = typedMethod.data?.result

    expect(typedMethod.data?.result).toBe(42)
  })

  it('returns isolated handles per create call', async () => {
    server.use(
      http.post(
        `${baseUrl}/api/v2/method/ToDo/send_email`,
        async ({ request }) => {
          const body = (await request.json()) as { names: string[] }
          return HttpResponse.json({ sent: true, names: body.names })
        },
      ),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      controllerMethods: {
        sendEmail: {
          method: 'send_email',
          args: (names: string[]) => ({ names }),
        },
      },
    })

    const first = ToDo.sendEmail.create()
    const second = ToDo.sendEmail.create()

    await first.submit(['a'])
    expect(first.data).toStrictEqual({ sent: true, names: ['a'] })
    expect(second.data).toBe(null)

    await second.submit(['b'])
    expect(second.data).toStrictEqual({ sent: true, names: ['b'] })
    expect(first.data).toStrictEqual({ sent: true, names: ['a'] })
  })
})
