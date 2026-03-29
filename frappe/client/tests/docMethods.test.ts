/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { defineDoctype } from '../defineDoctype'
import { ToDoDocType } from './doctypes'
import { baseUrl, server } from './mocks'
import { http, HttpResponse } from 'msw'
import { ref } from 'vue'
import './setup'

describe('docMethods', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it('defines and calls doc methods correctly', async () => {
    let receivedBody: any = null
    server.use(
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-1/method/set_status`,
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({ success: true })
        },
      ),
      // Add back the getDoc handler because getDoc is called
      http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
        return HttpResponse.json({
          data: { name: params.name, status: 'Open' },
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      docMethods: {
        setStatus: {
          method: 'set_status',
          args: (status: 'Open' | 'Closed') => ({ status }),
        },
      },
    })

    const todo = ToDo.getDoc('todo-1')
    await todo.setStatus.submit('Closed')

    if (todo.setStatus.error) {
      console.error('Error in setStatus:', todo.setStatus.error)
    }
    expect(receivedBody).toStrictEqual({ status: 'Closed' })
  })

  it('updates url when reactive name changes', async () => {
    let receivedUrl: string = ''
    server.use(
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-1/method/set_status`,
        async ({ request }) => {
          receivedUrl = request.url
          return HttpResponse.json({ success: true })
        },
      ),
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-2/method/set_status`,
        async ({ request }) => {
          receivedUrl = request.url
          return HttpResponse.json({ success: true })
        },
      ),
      // Add back the getDoc handler
      http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
        return HttpResponse.json({
          data: { name: params.name, status: 'Open' },
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      docMethods: {
        setStatus: {
          method: 'set_status',
          args: (status: 'Open' | 'Closed') => ({ status }),
        },
      },
    })

    const todoName = ref('todo-1')
    const todo = ToDo.getDoc(todoName)

    await todo.setStatus.submit('Closed')
    expect(receivedUrl).toContain('/todo-1/')

    todoName.value = 'todo-2'
    await todo.setStatus.submit('Open')
    expect(receivedUrl).toContain('/todo-2/')
  })

  it('handles errors in doc methods', async () => {
    server.use(
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-1/method/fail_method`,
        () => {
          return HttpResponse.json(
            {
              message: 'Something went wrong',
            },
            { status: 500 },
          )
        },
      ),
      // Add back the getDoc handler
      http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
        return HttpResponse.json({
          data: { name: params.name, status: 'Open' },
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      docMethods: {
        failMethod: {
          method: 'fail_method',
          args: () => ({}),
        },
      },
    })

    const todo = ToDo.getDoc('todo-1')
    try {
      await todo.failMethod.submit()
    } catch (e) {
      // ignore
    }

    expect(todo.failMethod.error).toBeTruthy()
  })

  it('supports optimistic updates', async () => {
    server.use(
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-1/method/set_status`,
        async () => {
          // Delay to test optimistic update
          await new Promise((resolve) => setTimeout(resolve, 50))
          return HttpResponse.json({
            docs: [{ name: 'todo-1', status: 'Closed', doctype: 'ToDo' }],
          })
        },
      ),
      http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
        return HttpResponse.json({
          data: { name: params.name, status: 'Open' },
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      docMethods: {
        setStatus: {
          method: 'set_status',
          args: (status: 'Open' | 'Closed') => ({ status }),
        },
      },
    })

    const todo = ToDo.getDoc('todo-1')
    // Wait for initial fetch
    await new Promise((resolve) => setTimeout(resolve, 50))

    const promise = todo.setStatus.submit('Closed').optimistic((doc) => {
      return { ...doc, status: 'Closed' }
    })

    // Should be updated immediately (optimistic)
    expect(todo.doc!.status).toBe('Closed')

    await promise
    // Should stay 'Closed' because it was updated via json.docs in the mock
    expect(todo.doc!.status).toBe('Closed')
  })

  it('reverts optimistic updates on error', async () => {
    server.use(
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-1/method/fail_method`,
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return HttpResponse.json({ message: 'Error' }, { status: 500 })
        },
      ),
      http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
        return HttpResponse.json({
          data: { name: params.name, status: 'Open' },
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      docMethods: {
        failMethod: {
          method: 'fail_method',
          args: () => ({}),
        },
      },
    })

    const todo = ToDo.getDoc('todo-1')
    await new Promise((resolve) => setTimeout(resolve, 50))

    const promise = todo.failMethod.submit().optimistic((doc) => {
      return { ...doc, status: 'Closed' }
    })

    expect(todo.doc!.status).toBe('Closed')

    try {
      await promise
    } catch (e) {
      // ignore
    }

    // Should revert to 'Open'
    expect(todo.doc!.status).toBe('Open')
  })

  it('supports batch updates via json.docs', async () => {
    server.use(
      http.post(
        `${baseUrl}/api/v2/document/ToDo/todo-1/method/batch_update`,
        async () => {
          return HttpResponse.json({
            docs: [
              { doctype: 'ToDo', name: 'todo-1', status: 'Closed' },
              { doctype: 'ToDo', name: 'todo-2', status: 'Closed' },
            ],
          })
        },
      ),
      http.get(`${baseUrl}/api/v2/document/ToDo/:name`, ({ params }) => {
        return HttpResponse.json({
          data: { name: params.name, status: 'Open' },
        })
      }),
    )

    const ToDo = defineDoctype<ToDoDocType>()({
      doctype: 'ToDo',
      baseUrl,
      docMethods: {
        batchUpdate: {
          method: 'batch_update',
          args: () => ({}),
        },
      },
    })

    const todo = ToDo.getDoc('todo-1')
    await new Promise((resolve) => setTimeout(resolve, 50))

    await todo.batchUpdate.submit()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // todo.doc should be 'Closed' (synced from json.docs)
    expect(todo.doc!.status).toBe('Closed')

    // But method data should have the result
    expect((todo.batchUpdate.data as any).docs[0].status).toBe('Closed')
  })
})
