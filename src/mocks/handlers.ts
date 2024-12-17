import { http, HttpResponse, delay } from 'msw'
import { url } from './utils'

export const handlers = [
  http.get(url('/api/v2/method/ping'), () => {
    return HttpResponse.json({
      data: 'pong',
    })
  }),

  http.get(url('/api/v2/method/error'), () => {
    return HttpResponse.json(
      {
        errors: [
          {
            title: 'Server Error',
            message: 'Internal Server Error occurred',
            type: 'ServerError',
            indicator: 'red',
          },
        ],
      },
      { status: 500 },
    )
  }),

  http.post(url('/api/v2/method/post'), async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      data: { success: true, received: body },
    })
  }),

  http.get(url('/api/v2/method/get'), ({ request }) => {
    const url = new URL(request.url)
    const value = url.searchParams.get('value')
    return HttpResponse.json({
      data: { value },
    })
  }),

  http.get(url('/api/v2/method/numbers'), () => {
    return HttpResponse.json({
      data: { numbers: [1, 2, 3, 4] },
    })
  }),

  http.get(url('/api/v2/method/slow'), async () => {
    await delay(1000)
    return HttpResponse.json({
      data: { success: true },
    })
  }),
]
