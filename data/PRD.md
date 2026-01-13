# Frappe UI Data Layer v2: DocType Definition API

## Overview

A type-safe, declarative API for defining and interacting with Frappe DocTypes
in Vue applications. This new pattern provides:

- Full TypeScript support with autocomplete
- Declarative method definitions (document and controller level)
- Reactive data layer with automatic state management
- Consistent API surface across all doctypes

## API Design

### DocType Definition

```ts
import { ToDoDocType } from '@/doctypes'
import { defineDoctype } from 'frappe-ui/data'

export const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
  // Document-level methods: operate on a specific document instance
  docMethods: {
    setStatus: {
      method: 'set_status', // Python method name on the document class
      httpMethod: 'POST',
      args: (status: 'Open' | 'Closed') => ({ status }),
    },
    assignTo: {
      method: 'assign_to',
      httpMethod: 'POST',
      args: (user: string, description?: string) => ({ user, description }),
    },
  },
  // Controller-level methods: operate on the DocType controller
  controllerMethods: {
    sendEmail: {
      method: 'send_email', // Python @staticmethod or @classmethod on controller
      httpMethod: 'POST',
      args: (names: string[]) => ({ names }),
    },
  },
})
```

## Usage Examples

### Document Operations

#### Fetching a Document

```ts
let todo = ToDo.getDoc('<id>')
// → GET /api/v2/document/ToDo/<id>

// Reactive properties
todo.doc // reactive todo object with all fields
todo.loading // boolean: indicates whether fetch request is loading
todo.error // error object if fetch failed
todo.reload() // refetch the document from server
```

#### Updating Document Fields

```ts
// Update single or multiple fields
await todo.setValue.submit({ description: 'Hello', status: 'Open' })
// → PATCH /api/v2/document/ToDo/<id> { description: 'Hello', status: 'Open' }
// Automatically updates todo.doc reactively

// Request state
todo.setValue.loading // boolean
todo.setValue.error // error object
todo.setValue.data // response data
```

#### Calling Document Methods

```ts
// Type-safe method calls with autocomplete
await todo.setStatus.submit('Open')
// → POST /api/v2/document/ToDo/<id>/method/set_status { status: 'Open' }

// TypeScript will error on invalid arguments
todo.setStatus.submit('Invalid') // ❌ TypeScript error: not 'Open' | 'Closed'

// Method with optional parameters
await todo.assignTo.submit('user@example.com', 'Please review')

// Request state for each method
todo.setStatus.loading
todo.setStatus.error
todo.setStatus.data
```

#### Deleting a Document

```ts
await todo.delete.submit()
// → DELETE /api/v2/document/ToDo/<id>

todo.delete.loading
todo.delete.error
```

### List Operations

#### Fetching Multiple Documents

```ts
let todos = ToDo.getList({
  fields: ['name', 'description', 'status', 'owner', 'modified'],
  filters: { status: 'Open' },
  orderBy: 'modified desc',
  limit: 20,
  start: 0,
})
// → GET /api/v2/document/ToDo?fields=...&filters=...&orderBy=...&limit=...&start=...

// Reactive properties
todos.data // reactive array of todo objects
todos.loading // boolean
todos.error // error object
todos.hasNextPage // boolean: indicates if more records exist
todos.reload() // refetch the list
todos.next() // load next page (increments start by limit)
```

#### Creating New Documents

```ts
await todos.insert.submit({
  description: 'New task',
  status: 'Open',
  priority: 5,
})
// → POST /api/v2/document/ToDo { description: ..., status: ..., priority: ... }
// Automatically adds new doc to todos.data array

todos.insert.loading
todos.insert.error
todos.insert.data // newly created document
```

#### Updating List Items

```ts
// Update a specific document in the list
await todos.setValue.submit({
  name: '<id>',
  status: 'Closed',
  description: 'Updated description',
})
// → PATCH /api/v2/document/ToDo/<id> { status: 'Closed', description: '...' }
// Automatically updates the matching item in todos.data array

todos.setValue.loading
todos.setValue.error
```

#### Deleting from List

```ts
await todos.delete.submit('<id>')
// → DELETE /api/v2/document/ToDo/<id>
// Automatically removes item from todos.data array

todos.delete.loading
todos.delete.error
```

### Controller Methods

Controller methods operate at the DocType level, not on specific documents:

```ts
// controller operations
await ToDo.sendEmail.submit(['todo-1', 'todo-2', 'todo-3'])
// → POST /api/v2/method/ToDo/send_email { names: ['todo-1', 'todo-2', 'todo-3'] }

ToDo.sendEmail.loading
ToDo.sendEmail.error
ToDo.sendEmail.data
```

## Backend Requirements

```python
# document methods are inside the class
class ToDo(Document):
    @frappe.whitelist()
    def set_status(self, status):
        self.status = status
        self.save()
        return self

    @frappe.whitelist()
    def assign_to(self, user, description=None):
        # Implementation
        return self

# controller methods are outside the class
@frappe.whitelist()
def send_email(names):
    # Implementation
    return {"sent": len(names)}
```

## Open Questions

1. **Caching strategy**: Should we have global cache configuration or
   per-doctype?
2. **Optimistic updates**: Should setValue optimistically update the doc before
   server response?
3. **Real-time updates**: How to integrate socket updates into this pattern?
4. **Relationships**: How to handle linked doctypes and nested data?
5. **Permissions**: Should we expose permission checks at the client level?
6. **Validation**: Client-side validation before API calls?
