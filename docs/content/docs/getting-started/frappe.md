# Frappe app

The frontend of a Frappe app: a Vite project inside the app, served by the site
in production. This guide assumes you have finished the
[shared install](../getting-started).

> The old `frappe-ui-starter` template targets frappe-ui v0 and Vite 2. Do not
> clone it for a v1 app. The steps below replace it.

## Where the frontend lives

Create the Vite project inside your Frappe app, next to the Python package:

```sh
cd apps/todo
npm create vite@latest frontend -- --template vue-ts
cd frontend
```

Then follow the [install](../getting-started#install). The layout the Vite
plugin expects is:

```
apps/todo/
  todo/            # the Python package
    www/
    public/
  frontend/        # this project
```

## Vite config

In `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [frappeui({ frontendRoute: '/todo' }), vue()],
})
```

`frontendRoute` is the path the site serves the app on. Every sub-plugin the
Frappe setup needs is on by default:

- **`frappeProxy`** forwards `/api`, `/assets`, `/files`, `/app`, `/login` and
  `/private` from the Vite dev server to the bench. It reads the bench port from
  `sites/common_site_config.json` and picks the Vite port from it: a bench on
  `8000` gets Vite on `8080`.
- **`jinjaBootData`** adds a Jinja block to the built `index.html` that copies
  every key of the page's `boot` context onto `window`.
- **`buildConfig`** writes the build to `todo/public/frontend`, sets the asset
  base to `/assets/todo/frontend/`, and copies the built `index.html` to
  `todo/www/todo.html`.
- **`barrelImports`** speeds up dev when frappe-ui is linked from a working
  copy. It does nothing for an installed dependency.

`lucideIcons` and `frappeTypes` are off. See the [Vite plugin](../other/vite)
page for their options.

## Dev server

The Vite dev server proxies the bench, so open the app through the site's
hostname on Vite's port. For a site named `todo.test` and a bench on `8000`:

```
http://todo.test:8080
```

In development the CSRF token is not on the page. Turn the check off for the
site, in development only:

```sh
bench --site todo.test set-config ignore_csrf 1
```

In production the token arrives through boot data, so the check stays on.

## The page that serves the app

The site needs a page at `frontendRoute`. Two files in the Python package.

`todo/www/todo.py` builds the boot data. `csrf_token` is the one key frappe-ui
reads itself: `useCall`, `frappeRequest` and the file upload helpers send
`window.csrf_token` with every request. Add whatever else the app needs on first
paint.

```python
import frappe

no_cache = 1


def get_context(context):
    context.boot = {
        "csrf_token": frappe.sessions.get_csrf_token(),
        "user": frappe.session.user,
    }
```

`todo/hooks.py` routes every path under the app to that page, so a client-side
route like `/todo/tasks/42` loads on a hard refresh:

```python
website_route_rules = [
    {"from_route": "/todo/<path:app_path>", "to_route": "todo"},
]
```

The router's history base must match `frontendRoute`:

```ts
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory('/todo'),
  routes,
})
```

`todo/www/todo.html` is written by the build. Do not create it by hand.

## Build

```sh
npm run build
```

`buildConfig` places the output where the site serves it and copies `index.html`
into `www/`. Commit or deploy both `todo/public/frontend` and
`todo/www/todo.html`. After `bench build` or a deploy, the app is live at
`https://todo.test/todo`.

## Talking to the server

The data fetching composables call whitelisted methods and documents over the
session the browser already has with the site:

- [`useCall`](../data-fetching/use-call) for a whitelisted method.
- [`useList`](../data-fetching/use-list), [`useDoc`](../data-fetching/use-doc),
  [`useDoctype`](../data-fetching/use-doctype) and
  [`useNewDoc`](../data-fetching/use-new-doc) for documents.
- [`frappeRequest`](../other/utilities#frapperequest) for anything else.

`FileUploader` and `useFileUpload` post to `/api/method/upload_file` by default.

To generate TypeScript interfaces from your DocTypes, turn on `frappeTypes` with
the doctypes you use:

```ts
frappeui({
  frontendRoute: '/todo',
  frappeTypes: { input: { todo: ['ToDo', 'ToDo Tag'] } },
})
```
