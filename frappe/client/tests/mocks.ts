import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { ToDoDocType } from './doctypes'

export const baseUrl = 'http://example.com'

export const url = (path: string) => new URL(path, baseUrl).toString()

const initialMockTodos: Record<string, ToDoDocType> = {
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
}

export const mockTodos: Record<string, ToDoDocType> = { ...initialMockTodos }

export function resetMockTodos() {
  Object.keys(mockTodos).forEach((key) => delete mockTodos[key])
  Object.assign(mockTodos, initialMockTodos)
}

export const handlers = [
  http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
    const { name } = params
    const todo = mockTodos[name as string]

    if (!todo) {
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

    return HttpResponse.json({
      data: todo,
    })
  }),

  http.patch(
    `${baseUrl}/api/v2/document/ToDo/:name`,
    async ({ params, request }) => {
      const { name } = params
      const todo = mockTodos[name as string]

      if (!todo) {
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

      const updates = (await request.json()) as Partial<ToDoDocType>
      const updatedTodo = { ...todo, ...updates }
      mockTodos[name as string] = updatedTodo

      return HttpResponse.json({
        data: updatedTodo,
      })
    },
  ),

  http.delete(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
    const { name } = params
    const todo = mockTodos[name as string]

    if (!todo) {
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

    delete mockTodos[name as string]

    return HttpResponse.json({
      data: null,
    })
  }),

  http.post(`${baseUrl}/api/v2/document/ToDo`, async ({ request }) => {
    const body = (await request.json()) as Partial<ToDoDocType>
    const name = `todo-${Date.now()}`
    const now = new Date().toISOString().replace('T', ' ').split('.')[0]

    const newTodo: ToDoDocType = {
      name,
      description: body.description || '',
      status: body.status || 'Open',
      priority: body.priority || 0,
      assigned_to: body.assigned_to,
      owner: 'admin@example.com',
      modified: now,
      creation: now,
    }

    mockTodos[name] = newTodo

    return HttpResponse.json({
      data: newTodo,
    })
  }),

  http.get(`${baseUrl}/api/v2/document/ToDo`, ({ request }) => {
    const requestUrl = new URL(request.url)
    const start = parseInt(requestUrl.searchParams.get('start') || '0')
    const limit = parseInt(requestUrl.searchParams.get('limit') || '20')
    const filtersParam = requestUrl.searchParams.get('filters')
    const filters = filtersParam ? JSON.parse(filtersParam) : {}

    let todos = Object.values(mockTodos)

    // Apply filters
    if (filters.status) {
      todos = todos.filter((todo) => todo.status === filters.status)
    }

    // Sort by modified desc (default)
    todos.sort((a, b) => b.modified.localeCompare(a.modified))

    // Pagination
    const paginatedTodos = todos.slice(start, start + limit)
    const hasNextPage = start + limit < todos.length

    return HttpResponse.json({
      data: paginatedTodos,
      has_next_page: hasNextPage,
    })
  }),
]

export const server = setupServer(...handlers)
