import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const BASE_URL = 'http://test.example.com'

export interface TodoDoc {
  doctype: 'ToDo'
  name: string
  description: string
  status: 'Open' | 'Closed'
  priority: number
  assigned_to?: string
  owner: string
  modified: string
  creation: string
}

const seed: Record<string, Omit<TodoDoc, 'doctype'>> = {
  'todo-1': {
    name: 'todo-1',
    description: 'First todo item',
    status: 'Open',
    priority: 1,
    assigned_to: 'user1@example.com',
    owner: 'admin@example.com',
    modified: '2026-01-14 10:00:00',
    creation: '2026-01-14 09:00:00',
  },
  'todo-2': {
    name: 'todo-2',
    description: 'Second todo item',
    status: 'Closed',
    priority: 2,
    owner: 'admin@example.com',
    modified: '2026-01-14 11:00:00',
    creation: '2026-01-14 09:30:00',
  },
  'todo-3': {
    name: 'todo-3',
    description: 'Third todo item',
    status: 'Open',
    priority: 3,
    owner: 'admin@example.com',
    modified: '2026-01-14 12:00:00',
    creation: '2026-01-14 09:45:00',
  },
}

export let mockTodos: Record<string, Omit<TodoDoc, 'doctype'>> = { ...seed }

export function resetMockTodos() {
  Object.keys(mockTodos).forEach((k) => delete mockTodos[k])
  Object.assign(mockTodos, seed)
}

function notFound(name: string) {
  return HttpResponse.json(
    {
      errors: [
        {
          title: 'Not Found',
          message: `ToDo ${name} not found`,
          type: 'NotFoundError',
          indicator: 'red',
        },
      ],
    },
    { status: 404 },
  )
}

export const handlers = [
  // GET count
  http.get(`${BASE_URL}/api/v2/doctype/ToDo/count`, ({ request }) => {
    const url = new URL(request.url)
    const filtersParam = url.searchParams.get('filters')
    const filters: Record<string, any> = filtersParam ? JSON.parse(filtersParam) : {}
    let todos = Object.values(mockTodos)
    if (filters.status) {
      todos = todos.filter((t) => t.status === filters.status)
    }
    return HttpResponse.json({ data: todos.length })
  }),

  // GET single doc
  http.get(`${BASE_URL}/api/v2/document/ToDo/:name`, ({ params }) => {
    const { name } = params as { name: string }
    const todo = mockTodos[name]
    if (!todo) return notFound(name)
    return HttpResponse.json({ data: todo })
  }),

  // PATCH (setValue)
  http.patch(
    `${BASE_URL}/api/v2/document/ToDo/:name`,
    async ({ params, request }) => {
      const { name } = params as { name: string }
      const todo = mockTodos[name]
      if (!todo) return notFound(name)
      const updates = (await request.json()) as Partial<
        Omit<TodoDoc, 'doctype'>
      >
      Object.assign(todo, updates)
      return HttpResponse.json({ data: todo })
    },
  ),

  // DELETE
  http.delete(`${BASE_URL}/api/v2/document/ToDo/:name`, ({ params }) => {
    const { name } = params as { name: string }
    if (!mockTodos[name]) return notFound(name)
    delete mockTodos[name]
    return HttpResponse.json({ data: null })
  }),

  // POST (insert)
  http.post(`${BASE_URL}/api/v2/document/ToDo`, async ({ request }) => {
    const body = (await request.json()) as Partial<Omit<TodoDoc, 'doctype'>>
    const name = `todo-${Date.now()}`
    const now = new Date().toISOString().replace('T', ' ').split('.')[0]
    const newTodo: Omit<TodoDoc, 'doctype'> = {
      name,
      description: body.description ?? '',
      status: body.status ?? 'Open',
      priority: body.priority ?? 0,
      assigned_to: body.assigned_to,
      owner: 'admin@example.com',
      modified: now,
      creation: now,
    }
    mockTodos[name] = newTodo
    return HttpResponse.json({ data: newTodo })
  }),

  // GET list
  http.get(`${BASE_URL}/api/v2/document/ToDo`, ({ request }) => {
    const url = new URL(request.url)
    const start = parseInt(url.searchParams.get('start') ?? '0')
    const limit = parseInt(url.searchParams.get('limit') ?? '20')
    const filtersParam = url.searchParams.get('filters')
    const filters: Record<string, any> = filtersParam
      ? JSON.parse(filtersParam)
      : {}

    let todos = Object.values(mockTodos)

    if (filters.status) {
      todos = todos.filter((t) => t.status === filters.status)
    }

    todos.sort((a, b) => b.modified.localeCompare(a.modified))

    const page = todos.slice(start, start + limit)
    return HttpResponse.json({
      data: page,
      has_next_page: start + limit < todos.length,
    })
  }),

  // POST bulk_delete (body contains names array)
  http.post(`${BASE_URL}/api/v2/document/ToDo/bulk_delete`, async ({ request }) => {
    let body: any
    try { body = await request.json() } catch { body = {} }
    const names: string[] = body?.names ?? []
    names.forEach((n) => delete mockTodos[n])
    return HttpResponse.json({ data: null })
  }),

  // POST bulk_update (body contains docs array)
  http.post(`${BASE_URL}/api/v2/document/ToDo/bulk_update`, async ({ request }) => {
    const body = (await request.json()) as any
    const rows: Array<{ name: string } & Record<string, any>> = body?.docs ?? []
    const updated: Omit<TodoDoc, 'doctype'>[] = []
    rows.forEach((row) => {
      const { name, ...rest } = row
      if (mockTodos[name]) {
        Object.assign(mockTodos[name], rest)
        updated.push(mockTodos[name])
      }
    })
    return HttpResponse.json({ docs: updated.map((d) => ({ ...d, doctype: 'ToDo' })) })
  }),
]

export const server = setupServer(...handlers)
