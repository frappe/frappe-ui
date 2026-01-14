# Data Fetching

## `defineDoctype`

`defineDoctype` is a utility to define a DocType and its associated controller methods. It returns a reactive object that can be used to interact with the DocType.

### Usage

```typescript
import { defineDoctype } from 'frappe-ui/data'

interface ToDoDocType {
  name: string
  status: 'Open' | 'Closed'
}

const ToDo = defineDoctype<ToDoDocType>()('ToDo', {
  controllerMethods: {
    sendEmail: {
      method: 'send_email',
      args: (names: string[]) => ({ names }),
    },
  },
})
```

### Why the Curried API? `defineDoctype<T>()(...)`

You might notice the slightly unusual syntax `defineDoctype<T>()(...)`. This is a "curried" function pattern, and we use it to solve a specific limitation in TypeScript regarding **Partial Type Argument Inference**.

In TypeScript, when you call a generic function, you must either:
1.  Let TypeScript infer **ALL** generic type arguments.
2.  Explicitly specify **ALL** generic type arguments.

You cannot specify some and let TypeScript infer the others.

In `defineDoctype`, we have two generic types:
1.  `TDoc`: The interface for the DocType (e.g., `ToDoDocType`). This **cannot** be inferred because it's not passed as an argument. You must provide it.
2.  `TControllerMethods`: The type of the `controllerMethods` object. We want this to be **inferred** from the `options` object you pass, so you don't have to manually type it out.

If we used a standard function signature like `defineDoctype<TDoc, TControllerMethods>(...)`, you would be forced to provide `TControllerMethods` manually if you provided `TDoc`:

```typescript
// ❌ This would be annoying to write:
defineDoctype<ToDoDocType, { sendEmail: ... }>('ToDo', { ... })
```

By using the curried pattern, we split the function into two parts:

1.  **First call:** `defineDoctype<TDoc>()`
    *   Here, you explicitly provide `TDoc`.
    *   This returns a new function that already "knows" about `TDoc`.
2.  **Second call:** `...('ToDo', options)`
    *   This function is generic over `TControllerMethods`.
    *   Since you don't need to pass `TDoc` again, TypeScript can now infer `TControllerMethods` automatically from the `options` argument.

This gives us the best of both worlds: strong typing for your DocType fields *and* automatic inference for your controller methods.
