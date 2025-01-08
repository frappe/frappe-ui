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

  http.get(url('/api/v2/document/User'), async ({ request }) => {
    const url = new URL(request.url)

    let listParams = parseListParams(url.searchParams)
    let result = getUsers(listParams)

    return HttpResponse.json({
      data: result,
    })
  }),

  http.get(url('/api/v2/document/User/user1'), async () => {
    return HttpResponse.json({
      data: {
        name: 'user1',
        email: 'user1@example.com',
        first_name: 'User',
        last_name: '1',
      },
    })
  }),
  http.post(
    url('/api/v2/document/User/user1/method/update_email'),
    async ({ request }) => {
      let body = await request.json()
      return HttpResponse.json({
        docs: [
          {
            doctype: 'User',
            name: 'user1',
            email: body['email'],
            first_name: 'User',
            last_name: '1',
          },
        ],
      })
    },
  ),
]

function getUsers(listParams) {
  let { start = 0, limit = 20, filters = {} } = listParams

  return Array.from({ length: limit }, (_, i) => {
    let n = i + start + 1
    return {
      name: `User${n}`,
      email: `user${n}@example.com`,
    }
  }).filter((user) => {
    if (filters.email?.[0] === 'like') {
      let query = filters.email[1].replace(/%/g, '')
      return user.email.includes(query)
    }
    return true
  })
}

function parseListParams(searchParams) {
  let out = {}
  for (let [key, value] of searchParams) {
    if (key === 'fields' || key === 'filters') {
      out[key] = JSON.parse(value)
    } else if (key === 'start' || key === 'limit') {
      out[key] = parseInt(value)
    } else if (['group_by', 'order_by', 'parent'].includes(key)) {
      out[key] = value
    }
  }
  return out
}
