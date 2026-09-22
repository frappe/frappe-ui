# Standalone app

frappe-ui in a plain Vite app: a prototype, a static site, or a frontend for
some other server. Components, charts, the editor, the list family, icons and
the Tailwind preset all work with no server at all. This guide assumes you have
finished the [shared install](../getting-started).

## Vite config

Leave the frappe-ui Vite plugin out of `vite.config.ts`. Its default sub-plugins
proxy a bench, inject Jinja into `index.html` and write the build into a Frappe
app's `public/` folder, none of which applies here.

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

Add the plugin only if your own code imports `~icons/lucide/*` or writes
`<LucideX />` tags, with the Frappe sub-plugins off:

```ts
import frappeui from 'frappe-ui/vite'

frappeui({
  lucideIcons: true,
  frappeProxy: false,
  jinjaBootData: false,
  buildConfig: false,
})
```

frappe-ui's own icons are `lucide-<name>` class names and need nothing from
Vite. See [Icons](../other/icons).

## What assumes a Frappe server

Everything under [Data Fetching](../data-fetching/use-call) and
[Resources](../data-fetching/resource) calls Frappe's `/api` routes: `useCall`,
`useList`, `useDoc`, `useDoctype`, `useNewDoc`, `createResource` and friends,
plus `call` and `frappeRequest` underneath them. Use your own client for your
own server. The rest of the library does not import them.

One component has a Frappe default you can point elsewhere: `FileUploader` and
`useFileUpload` post to `/api/method/upload_file`. Pass `uploadEndpoint` to send
the file to your own server.

## A Frappe site on another origin

If the server is a Frappe site that is not serving this frontend, keep the data
fetching composables and point them at it:

```ts
import { setConfig } from 'frappe-ui'

setConfig('requestBaseUrl', 'https://my-site.frappe.cloud')
setConfig('requestHeaders', () => ({ Authorization: `token ${key}:${secret}` }))
```

Relative requests then go cross-origin. With a token header, pass
`credentials: 'omit'` per request; with the session cookie instead, the site has
to answer with `Access-Control-Allow-Credentials: true` and a non-wildcard
origin. See [Configuration](../other/utilities#configuration).
