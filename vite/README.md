# Frappe UI Vite Plugins

A collection of Vite plugins for Frappe applications that handle common
development tasks when building modern frontends for Frappe.

## Installation

```bash
npm install frappe-ui
```

## Usage

In your `vite.config.js` file:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({
      frappeProxy: true, // Setup proxy to Frappe backend
      lucideIcons: true, // Configure Lucide icons
      jinjaBootData: true, // Inject server-side boot data
      // Generate TypeScript interfaces from DocTypes
      frappeTypes: {
        input: {
          app_name: ['doctype_1', 'doctype_2'],
        },
      },
      // Production build config for asset paths and HTML output
      buildConfig: {
        indexHtmlPath: '../your_app/www/frontend.html',
      },
    }),
    vue(),
  ],
})
```

## Plugins

### Frappe Proxy Plugin

Automatically configures a development server that proxies requests to your
Frappe backend.

#### Features

- Sets up a proxy for backend routes (`/api`, `/app`, etc.)
- Automatically detects Frappe port from `common_site_config.json`

#### Configuration

```javascript
frappeui({
  frappeProxy: {
    port: 8080, // Frontend dev server port
    source: '^/(app|login|api|assets|files|private)', // Routes to proxy
  },
})
```

### Lucide Icons Plugin

Integrates [Lucide icons](https://lucide.dev/) with your app, providing access
to all Lucide icons with some customization.

#### Features

- Automatically registers all Lucide icons for use in Vue components
- Configures icons with standardized stroke-width 1.5 according to our design
  system
- Support auto-import

#### Implicit import

```vue
<template>
  <LucideArrowRight class="size-4" />
</template>
```

#### Explicit import

```vue
<template>
  <LucideArrowRight class="size-4" />
  <LucideBarChart class="size-4" />
</template>
<script setup lang="ts">
import LucideArrowRight from '~icons/lucide/arrow-right'
import LucideBarChart from '~icons/lucide/bar-chart'
</script>
```

### Frappe Types Plugin

Generates TypeScript interfaces for your Frappe DocTypes, providing type safety
when working with Frappe data.

#### Features

- Automatically generates TypeScript interfaces from DocType JSON files
- Creates and updates interfaces only when DocTypes change

#### Configuration

```javascript
frappeui({
  frappeTypes: {
    input: {
      your_app_name: ['doctype1', 'doctype2'],
    },
    output: 'src/types/doctypes.ts', // (optional)
  },
})
```

### Jinja Boot Data Plugin

Injects jinja block that reads keys from `boot` context object and sets in
`window`. Useful to set global values like `csrf_token`, `site_name`, etc.

#### Configuration

```javascript
frappeui({
  jinjaBootData: true,
})
```

#### Usage

In your Python/Jinja template:

```python

def get_context(context):
    context.boot = {
        "csrf_token": "...",
        "user": frappe.session.user,
        "user_info": frappe.session.user_info,
    }
    return context
```

In your JavaScript code:

```javascript
// Access injected data
console.log(window.user)
console.log(window.user_info)
```

### Build Configuration Plugin

Handles production builds with proper asset paths and HTML output.

#### Features

- Configures output directories for build assets
- Sets up correct asset paths for Frappe's standard directory structure
- Copies the built index.html to a specified location (typically in www)

#### Configuration

```javascript
frappeui({
  buildConfig: {
    // default: '../app_name/public/frontend', auto-detected if not specified
    outDir: '../app_name/public/frontend',
    // Base URL for assets (auto-detected from outDir if not specified)
    baseUrl: '/assets/app_name/frontend/',
    // required, typically "../app_name/www/app_name.html"
    indexHtmlPath: '../app_name/www/app_name.html',
    emptyOutDir: true, // Clear output directory before build
    sourcemap: true, // Generate sourcemaps
  },
})
```
