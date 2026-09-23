# Standalone app

Use frappe-ui in a plain Vite app with no Frappe server: a prototype, a static
site, or a frontend for another backend. Components, charts, the editor, lists,
icons and the Tailwind preset all work without a server.

## Vite config

Add the frappe-ui Vite plugin in `vite.config.ts`, with the features that talk
to a Frappe server turned off. `npm create frappe-ui@latest` sets this up for
you.

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({ frappeProxy: false, jinjaBootData: false, buildConfig: false }),
    vue(),
  ],
})
```

The plugin is needed even without a server. Without it, the dev server loads
two copies of the code behind `toast()`, and `toast()` shows nothing in
development. The production build works either way, so the problem is easy to
miss.

frappe-ui's icons are CSS classes like `lucide-plus`, so they need nothing more
from Vite. See [Icons](../other/icons). If your own code imports icons from
`~icons/lucide/*`, also pass `lucideIcons: true`.

## What needs a Frappe server

The [data fetching](../data-fetching/use-call) composables and
[resources](../data-fetching/resource) call Frappe's `/api` routes. That covers
`useCall`, `useList`, `useDoc`, `useDoctype`, `useNewDoc`, `createResource`,
`call` and `frappeRequest`. Use your own client for your own server. Nothing
else in frappe-ui depends on them.

File uploads go to `/api/method/upload_file` by default. Pass `uploadEndpoint`
to `FileUploader` or `useFileUpload` to send files to your server instead.

## Connecting to a Frappe site elsewhere

If your data lives on a Frappe site on another domain, you can still use the
data fetching composables. Point them at the site:

```ts
import { setConfig } from 'frappe-ui'

setConfig('requestBaseUrl', 'https://my-site.frappe.cloud')
setConfig('requestHeaders', () => ({ Authorization: `token ${key}:${secret}` }))
```

With a token like this, pass `credentials: 'omit'` on each request. To use the
site's login session instead, the site must allow your domain with
`Access-Control-Allow-Credentials: true`. See
[Configuration](../other/utilities#configuration).
