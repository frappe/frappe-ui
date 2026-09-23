# Frappe app

Build the frontend of a Frappe app with frappe-ui. The frontend is a Vite
project inside your app, and the site serves it in production.

The examples use an app named `todo`, served at `/todo`.

The quickest start is to run `npm create frappe-ui@latest` from `apps/todo`.
It does every step on this page and asks before it changes your app's files.
The steps below show what it sets up, for an app you set up by hand.

> The old `frappe-ui-starter` template is for frappe-ui v0. Don't use it for a
> new app.

<div class="steps">

### Create the frontend

Create the Vite project inside your app, next to the Python package.

```sh
cd apps/todo
npm create vite@latest frontend -- --template vue-ts
cd frontend
```

Then follow [Installation](../getting-started#install-frappe-ui) from step 2 to
step 5. Your app now looks like this:

```
apps/todo/
  todo/            # the Python package
    www/
    public/
  frontend/        # the Vite project
```

### Add the Vite plugin

Add the frappe-ui plugin to `vite.config.ts`. Set `frontendRoute` to the path
the site serves the app on.

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [frappeui({ frontendRoute: '/todo' }), vue()],
})
```

With no other options, the plugin:

- Forwards `/api`, `/assets`, `/files`, `/app`, `/desk`, `/login` and
  `/private` to your bench while you develop.
- Passes the page's boot data to the app as globals on `window`.
- Builds into `todo/public/frontend` and copies `index.html` to
  `todo/www/todo.html`.

The [Vite plugin](../other/vite) page lists every option.

### Serve the app from the site

Add `todo/www/todo.py`. It sends boot data to the page, and frappe-ui reads
`csrf_token` from it for every request. Add anything else the app needs on first
load.

```python
import frappe

no_cache = 1


def get_context(context):
    context.boot = {
        "csrf_token": frappe.sessions.get_csrf_token(),
        "user": frappe.session.user,
    }
```

Then send every path under `/todo` to that page in `todo/hooks.py`, so a
refresh on `/todo/tasks/42` still loads the app.

```python
website_route_rules = [
    {"from_route": "/todo/<path:app_path>", "to_route": "todo"},
]
```

Don't create `todo/www/todo.html` yourself. The build writes it.

### Set the router base

Give the router the same path as `frontendRoute`.

```ts
const router = createRouter({
  history: createWebHistory('/todo'),
  routes,
})
```

### Start the dev server

Pages in development don't have a CSRF token, so turn the check off for your
site. Only do this on a development site.

```sh
bench --site todo.test set-config ignore_csrf 1
npm run dev
```

Open the app on the site's name with Vite's port. Vite uses your bench port plus
80, so a bench on `8000` means:

```
http://todo.test:8080
```

### Build

Build the app, then commit `todo/public/frontend` and `todo/www/todo.html`.

```sh
npm run build
```

After a deploy, the app is live at `https://todo.test/todo`.

</div>

## Talking to the server

The data fetching composables use the browser's session with the site, so there
is nothing to set up.

- [`useCall`](../data-fetching/use-call) calls a whitelisted method.
- [`useList`](../data-fetching/use-list), [`useDoc`](../data-fetching/use-doc),
  [`useDoctype`](../data-fetching/use-doctype) and
  [`useNewDoc`](../data-fetching/use-new-doc) work with documents.
- [`frappeRequest`](../other/utilities#frapperequest) handles any other request.

File uploads go to `/api/method/upload_file`.

## Types for your DocTypes

The Vite plugin can write TypeScript types for your DocTypes. List the ones you
use, per app:

```ts
frappeui({
  frontendRoute: '/todo',
  frappeTypes: { input: { todo: ['ToDo', 'ToDo Tag'] } },
})
```
