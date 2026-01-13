import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { ToDoDocType } from './doctypes'

export const baseUrl = 'http://example.com'

export const url = (path: string) => new URL(path, baseUrl).toString()

const mockTodos: Record<string, ToDoDocType> = {
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

export const handlers = [
  http.get(url('/api/v2/document/ToDo/:name'), ({ params }) => {
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
]

export const server = setupServer(...handlers)
