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
      http.post(`${baseUrl}/api/v2/method/ToDo/send_email`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ sent: true, count: receivedBody.names.length })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
      baseUrl,
      controllerMethods: {
        sendEmail: {
          method: 'send_email',
          args: (names: string[]) => ({ names }),
        },
      },
    })

    expect(ToDo.sendEmail).toBeDefined()
    expect(ToDo.sendEmail.loading).toBe(false)
    expect(ToDo.sendEmail.data).toBe(null)

    const promise = ToDo.sendEmail.submit(['task-1', 'task-2'])

    expect(ToDo.sendEmail.loading).toBe(true)

    await promise

    expect(ToDo.sendEmail.loading).toBe(false)
    expect(ToDo.sendEmail.data).toStrictEqual({ sent: true, count: 2 })
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

    const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
      baseUrl,
      controllerMethods: {
        failMethod: {
          method: 'fail_method',
          args: () => ({}),
        },
      },
    })

    try {
      await ToDo.failMethod.submit()
    } catch (e) {
      // Expected error
    }

    expect(ToDo.failMethod.error).toBeTruthy()
    expect(ToDo.failMethod.error.type).toBe('ServerError')
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

    const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
      baseUrl,
      controllerMethods: {
        getInfo: {
          method: 'get_info',
          httpMethod: 'GET',
          args: (param: string) => ({ param }),
        },
      },
    })

    await ToDo.getInfo.submit('test-value')

    expect(ToDo.getInfo.data).toStrictEqual({
      info: 'some info',
      param: 'test-value',
    })
  })

  it('supports object parameters directly', async () => {
    let receivedBody: any = null
    server.use(
      http.post(`${baseUrl}/api/v2/method/ToDo/complex_action`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ success: true })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
      baseUrl,
      controllerMethods: {
        complexAction: {
          method: 'complex_action',
          args: (params: { names: string[]; action: string }) => params,
        },
      },
    })

    await ToDo.complexAction.submit({
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

    const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
      baseUrl,
      controllerMethods: {
        typedMethod: {
          method: 'typed_method',
          args: () => ({}),
        } as ControllerMethodDef<[], TypedResponse>,
      },
    })

    await ToDo.typedMethod.submit()

    // @ts-expect-error
    const val: string = ToDo.typedMethod.data?.result

    expect(ToDo.typedMethod.data?.result).toBe(42)
  })
})
