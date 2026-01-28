---
description: 'Frappe UI library development standards and best practices'
applyTo: 'src/**, docs/**, vite/**, tailwind/**, icons/**, frappe/**'
---

# Project Name: frappe-ui

**frappe-ui** is a Vue 3 component library and utilities package designed for
rapid development of modern Frappe-based web applications.

## Overview

frappe-ui provides a comprehensive set of Vue 3 components, data-fetching
composables, Vite plugins, and utilities optimized for building frontend
applications that integrate with Frappe Framework backends.

The library is used across multiple Frappe ecosystem products including Frappe
Cloud, Gameplan, Helpdesk, Insights, Drive, and Builder.

## Tech Stack & Architecture

- **Frontend Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Language**: TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS v3 with custom semantic color system
- **UI Primitives**: Reka UI for accessible, unstyled components - we are
  actively migrating from Headless UI to Reka UI
- **Rich Text**: TipTap v3 (ProseMirror) for rich-text editing
- **Date Utilities**: dayjs for date manipulation
- **Testing**: Vitest for unit and component testing
- **Documentation**: VitePress for component docs and guides

## Project Structure

```bash
frappe-ui/
├── src/                          # Main library source code
│   ├── components/               # Vue components (Button, Dialog, etc.)
│   ├── data-fetching/            # v2 composables (useDoc, useList, useCall) - TypeScript-first, Vue 3 Composition API, works with Frappe API v2
│   ├── resources/                # v1 utilities (createResource, createListResource, createDocumentResource) - Vue 2 Options API compatible, works with Frappe API v1
│   ├── mocks/                    # Mock service worker (MSW) handlers for testing
│   ├── composables/              # Reusable Vue composables
│   ├── directives/               # Custom Vue directives
│   ├── utils/                    # Utility functions and helpers
│   └── index.ts                  # Main entry point with exports
├── vite/                         # Vite plugins for easier Frappe project integration
│   ├── frappeProxy.js            # Dev server proxy configuration
│   ├── frappeTypes.js            # Auto-generate TypeScript types from doctypes
│   ├── lucideIcons.js            # Lucide icon auto-import
│   ├── jinjaBootData.js          # Boot data injection from Jinja templates
│   └── buildConfig.js            # Production build optimization
├── tailwind/                     # Tailwind CSS configuration
│   ├── preset.js                 # Tailwind preset for consumers
│   ├── plugin.js                 # Custom theme plugin
│   └── colors.js                 # Semantic color palette
├── frappe/                       # High-level components and utilities that assume a Frappe backend
│   ├── index.js                  # Session management, API helpers
│   └── [modules]/                # Feature-specific modules (Drive, Billing, etc.)
├── icons/                        # Custom SVG icon components
└── docs/                         # VitePress documentation site
```

## Development Standards

### Component Authoring Guidelines

This section covers everything related to creating new components or editing
existing ones.

#### Component Structure & API Design

All components must follow this directory structure and API conventions:

**File Organization:**

```bash
src/components/ComponentName/
├── ComponentName.vue        # Main component
├── types.ts                 # TypeScript types/interfaces (required)
├── utils.ts                 # Component-specific utilities (if needed)
└── index.ts                 # Public exports
```

**TypeScript Requirements:**

**Critical Requirement - Strict Naming Conventions:**

Every prop, emit event, and slot must have a JSDoc description. Use consistent
naming patterns for all type definitions:

- **Props**: `ComponentNameProps`
- **Emits**: `ComponentNameEmits`
- **Slots**: `ComponentNameSlots`
- **Exposed Methods**: `ComponentNameExposed`
- **Union Types**: `ComponentNameSize`, `ComponentNameTheme`,
  `ComponentNameVariant`, etc.

**These strict naming conventions are mandatory** because they are used to
auto-generate documentation in the `docs/meta/` folder. Deviating from these
patterns will break the documentation generation pipeline.

**JSDoc is required for:**

- Documentation generation (auto-generated in `docs/meta/`)
- Better developer experience with IntelliSense
- Clear API contracts for component consumers

**Example Component:**

```typescript
// src/components/MyComponent/types.ts
export interface MyComponentProps {
  /** The label text displayed in the component */
  label?: string

  /** Whether the component is disabled */
  disabled?: boolean
}

export interface MyComponentEmits {
  /** Emitted when the component value changes */
  (event: 'change', value: string): void

  /** Emitted when the component is submitted */
  (event: 'submit'): void
}

export interface MyComponentSlots {
  /** Main content slot */
  default?: () => any

  /** Header slot for custom titles */
  header?: () => any
}

export interface MyComponentExposed {
  /** Programmatically focus the component */
  focus: () => void
}
```

```vue
<!-- src/components/MyComponent/MyComponent.vue -->
<template>
  <!-- Simple, semantic HTML structure -->
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type {
  MyComponentProps,
  MyComponentEmits,
  MyComponentSlots,
  MyComponentExposed,
} from './types'

const props = withDefaults(defineProps<MyComponentProps>(), {
  label: '',
  disabled: false,
})

const emit = defineEmits<MyComponentEmits>()

defineSlots<MyComponentSlots>()

// Component logic using Composition API
const isActive = ref(false)
const computedValue = computed(() => {
  return props.label.toUpperCase()
})

// Expose public methods/refs for parent access
defineExpose<MyComponentExposed>({
  focus: () => {
    // implementation
  },
})
</script>
```

```typescript
// src/components/MyComponent/index.ts
export { default as MyComponent } from './MyComponent.vue'
export type {
  MyComponentProps,
  MyComponentEmits,
  MyComponentSlots,
  MyComponentExposed,
} from './types'
```

**TypeScript Best Practices:**

- Use `interface` for object types, `type` for unions, intersections, and
  primitives
- Prefer `defineProps<PropsInterface>()` over runtime prop validation
- Use `PropType<T>` only when mixing runtime and type-level validation
- Document all public types with JSDoc comments
- Use `readonly` for props that should not be mutated
- Leverage TypeScript's utility types: `Partial<T>`, `Required<T>`, `Pick<T>`,
  `Omit<T>`

**Component API Guidelines:**

**Props:**

- Provide sensible defaults with `withDefaults()`
- Use descriptive prop names that align with the component's purpose
- Support both controlled and uncontrolled patterns via `v-model`
- Document all props with JSDoc comments
- Prefer primitive types (string, number, boolean) over complex objects or
  arrays
  - Forces you to think about the actual interface
  - Keeps components portable and decoupled
  - Better data flow and composition
  - For complex data (charts, tables), be explicit with TypeScript types and
    document clearly

**Events:**

- Emit semantic event names: `update:modelValue`, `change`, `submit`, `cancel`
- Pass relevant event data as payloads
- Use TypeScript for emit type safety
- Prefer naming by behavior (change, open, close) rather than interaction
  (toggle, click, blur)
- Maintain consistency across similar components (e.g., all form inputs should
  emit `change`)

**Slots:**

- Provide slots for flexible composition: `default`, `header`, `footer`,
  `prefix`, `suffix`
- Use scoped slots to expose internal state
- Document slots with `defineSlots<>`

**Exposed Methods:**

- Expose imperative methods via `defineExpose()` when necessary
- Examples: `focus()`, `reset()`, `validate()`

#### Design Principles

##### Component API Consistency

If you look at components like `<TextInput>`, `<Switch>`, and `<Checkbox>`,
you'll notice small inconsistencies in their props, events, and slots. These
differences make the library harder to learn and use.

We should strive for consistent APIs so that components feel predictable. When
used together—especially in forms—consistency builds intuition.

```vue
<!-- Example 1: technically fine -->
<TextInput @change="" />
<Switch @toggle="" />

<!-- Example 2: better, consistent -->
<TextInput @change="" />
<Switch @change="" />
```

Even though the first example is not "wrong," the second one is one less API to
learn. Consistency reduces cognitive load. Prefer naming APIs by behavior
(change, open, close, submit) rather than by internal interaction (toggle,
click, blur).

We can expand this guideline for events and slot naming as well.

---

##### Prefer v-model for Inputs, Controls, and Interactive Components

In Vue 2, `:value` + `@input` was the convention for two-way binding. In Vue 3,
we now have `modelValue` and `update:modelValue`, which may look verbose but
give us clarity and consistency. It also plays well with v-bind, ref, and
Composition API.

If a component manages multiple reactive values, use Vue's named v-model syntax:

```vue
<Dialog v-model="show" v-model:marginTop="marginTop" />
```

---

##### Split Components Instead of Overloading Them

It's tempting to make "do-it-all" components—like
AutocompleteDropdownSelect—that handle multiple use cases. This leads to complex
props, edge cases, and harder maintenance.

Instead, prefer small, focused components that can be composed together.

Avoid:

```vue
<Autocomplete
  :fetch-options="fetchUsers"
  :multi-select="true"
  :searchable="true"
  :creatable="true"
/>
```

Prefer:

```vue
<Dropdown />
<Autocomplete />
<MultiSelect />
<Select />
```

When you feel the need for a prop like `type="multi"` or `mode="searchable"`,
it's a hint the component might need to be split or needs better composability.

#### Icons

**Lucide Icons (Primary):**

```vue
<template>
  <!-- Direct usage in template (auto-imported) -->
  <LucideCheck class="size-4" />
  <LucideChevronDown class="size-5 text-ink-gray-6" />
</template>

<script setup lang="ts">
// Usage in script (ignore TypeScript errors)
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'

const checkIcon = LucideCheck
</script>
```

**FeatherIcon (Deprecated):**

- Do not use `<FeatherIcon>` component in new code
- Migrate existing uses to Lucide icons when possible

**Custom Icons:**

- Place in `icons/` directory as `.vue` files
- Follow same component structure as library components
- Export from `icons/index.ts`

### Styling Standards

**Semantic Color System:**

Always use semantic color classes instead of hardcoded colors:

```vue
<!-- Background colors -->
<div class="bg-surface-white">
  <!-- Text colors -->
  <h1 class="text-ink-gray-9">Heading</h1>
  <p class="text-ink-gray-7 text-p-base">Paragraph text</p>

  <!-- Border colors -->
  <div class="border border-outline-gray-3 p-4">
    Content with border
  </div>
</div>
```

**Available semantic color scales:**

- Surface: `bg-surface-{white|gray-1|gray-2|...|gray-9|black}`
- Ink (text/fill): `text-ink-{white|gray-1|...|gray-9|black}`
- Outline (borders): `border-outline-{white|gray-1|...|gray-5|black}`
- Support colors: `bg-surface-{red|green|blue|yellow}-{1|2|3|...}` (use
  sparingly)

**Typography:**

```vue
<!-- Font sizes -->
<div class="text-xs">Extra small</div>
<div class="text-sm">Small</div>
<div class="text-base">Base</div>
<div class="text-lg">Large</div>
<div class="text-xl">Extra large</div>

<!-- Multiline text -->
<p class="text-p-sm">Lorem ipsum dolor sit amet.</p>
<p class="text-p-base">Lorem ipsum dolor sit amet.</p>
```

**Spacing and Layout:**

- Use Tailwind's standard spacing scale: `p-2`, `px-4`, `gap-3`, etc.
- Mobile-first responsive design: `sm:`, `md:`, `lg:`, `xl:` prefixes
- Flexbox for most layouts: `flex items-center justify-between gap-2`
- CSS Grid for complex layouts: `grid grid-cols-3 gap-4`

**Scoped Styles:**

Only use `<style scoped>` when:

- Tailwind cannot express the styling
- Complex pseudo-selectors are needed
- Third-party component styling override

```vue
<style scoped>
/* Prefer deep selectors for child component styling */
:deep(.child-component) {
  color: var(--gray-900);
}
</style>
```

## Data Fetching

### v1 vs v2 Data Fetching

frappe-ui provides two generations of data fetching utilities:

**v1 (Legacy)** - `src/resources/`

- Functions: `createResource`, `createListResource`, `createDocumentResource`
- Designed for Vue 2 Options API
- Works with Frappe Framework API v1 endpoints
- Still widely used in production applications
- Mature and stable API

**v2 (Current)** - `src/data-fetching/`

- Composables: `useDoc`, `useList`, `useCall`
- TypeScript-first, designed for Vue 3 Composition API
- Works **strictly** with Frappe Framework API v2 endpoints only
- Work in progress (WIP) - API may evolve
- Recommended for new projects using Vue 3

**For new projects:** Use v2 composables (`useDoc`, `useList`, `useCall`) if
you're building with Vue 3 and Composition API and your backend supports API v2.

**For existing projects:** v1 utilities continue to be supported and are stable
for production use. If you are already using v1 in Vue 3 projects and it works
for you, don't migrate to v2 utilities yet - we are working on a better data
fetching API (v3) that will supersede both v1 and v2.

---

### Data Fetching Composables (v2)

frappe-ui provides three core v2 composables for Frappe API integration:

**`useDoc` - Single document operations:**

```typescript
const item = useDoc<MyDoctype>({
  doctype: 'My Doctype',
  name: 'DOC-001',
  methods: {
    approve: 'approve_document', // Server method name
  },
  immediate: true, // Fetch on mount
})

// Access document data
item.doc.title
item.doc.status

// Update fields
item.setValue.submit({ title: 'New Title' })

// Call server methods
item.approve.submit({ reason: 'Approved by manager' })

// Delete document
item.delete.submit()

// Refetch
item.reload()
```

**`useList` - Document list operations:**

```typescript
const items = useList<MyDoctype>({
  doctype: 'My Doctype',
  fields: ['name', 'title', 'modified'],
  filters: () => ({ status: 'Active' }),
  orderBy: 'modified desc',
  limit: 20,
  cacheKey: 'active-items-list',
  immediate: true,
})

// Access list data
items.data // Current page data
items.allData // All fetched data (if auto-load enabled)

// Pagination
items.next()
items.previous()
items.hasNextPage

// Update a row by name
items.setValue.submit({ name: 'DOC-001', title: 'Updated Title' })

// Insert new row
items.insert.submit({ title: 'New Item' })

// Delete a row
items.delete.submit({ name: 'DOC-001' })

// Reload list
items.reload()
```

**`useCall` - Generic API calls:**

```typescript
const apiCall = useCall<ResponseType, ParamsType>({
  url: '/api/method/my_method',
  onSuccess: (data) => {
    console.log('Success:', data)
  },
  onError: (error) => {
    console.error('Error:', error)
  },
})

// Make the call
apiCall.submit({ param1: 'value' })

// Access state
apiCall.loading
apiCall.error
apiCall.data
```

### Best Practices

- Always provide TypeScript generics for type safety
- Use reactive filters with arrow functions: `filters: () => ({ field: value })`
- Provide meaningful `cacheKey` for better performance
- Handle loading and error states in components
- Use `onSuccess` callbacks for side effects
- Prefer `useDoc`/`useList` over direct `useCall` for standard CRUD

## Vite Plugins

frappe-ui provides a unified Vite plugin that bundles multiple features for
easier Frappe project integration.

### Basic Setup

Import and configure the plugin in your `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({
      frappeProxy: true,
      lucideIcons: true,
      jinjaBootData: true,
      frappeTypes: {
        input: {
          gameplan: ['gp_project', 'gp_team', 'gp_discussion'],
        },
      },
      buildConfig: {
        indexHtmlPath: '../gameplan/www/g.html',
      },
    }),
    vue(),
  ],
})
```

### Configuration Options

**`frappeProxy`** - Dev server proxy configuration

```javascript
frappeProxy: true // Enable with defaults
// or
frappeProxy: {
  port: 8080 // Custom Vite dev server port
}
```

Automatically configures the dev server to proxy requests to your Frappe
backend.

**`lucideIcons`** - Auto-import Lucide icons

```javascript
lucideIcons: true
```

Enables auto-importing of Lucide icons as Vue components. Use them directly in
templates without explicit imports:

```vue
<template>
  <LucideCheck class="size-4" />
</template>
```

**`jinjaBootData`** - Boot data injection

```javascript
jinjaBootData: true
```

Injects boot data from Jinja templates into your Vue app, making it available
via `window.boot_data`.

**`frappeTypes`** - TypeScript type generation

```javascript
frappeTypes: {
  input: {
    app_name: ['DocType1', 'DocType2'],
    another_app: ['DocType3'],
  },
}
```

Auto-generates TypeScript interfaces from Frappe doctypes. Organize doctypes by
app name for better structure.

**`buildConfig`** - Production build settings

```javascript
buildConfig: {
  indexHtmlPath: '../path/to/output.html',  // Where to output the built index.html
}
```

### Documentation

**Component Documentation:**

- All components should have corresponding documentation in
  `docs/content/docs/components/ComponentName.md`
- Use VitePress markdown with embedded Vue component examples
- Include:
  - Component description and use cases
  - Props table (auto-generated from TypeScript)
  - Events table
  - Slots table
  - Interactive examples with code snippets
  - Accessibility notes

**JSDoc Comments:**

````typescript
/**
 * A versatile button component with multiple variants and sizes.
 *
 * @example
 * ```vue
 * <Button label="Click me" theme="blue" @click="handleClick" />
 * ```
 */
interface ButtonProps {
  /** The text displayed on the button */
  label?: string

  /**
   * Visual theme of the button
   * @default 'gray'
   */
  theme?: 'gray' | 'blue' | 'red' | 'green'
}
````

**Component Stories:**

Every component should have story files for visual documentation and testing.
Stories are displayed in the frappe-ui documentation site and help developers
see component variations.

**File Location:**

Create a `stories/` folder inside the component directory with separate files
for each story:

```bash
src/components/ComponentName/
├── ComponentName.vue
├── types.ts
├── index.ts
└── stories/
    ├── Sizes.vue
    ├── Variants.vue
    ├── Themes.vue
    └── CustomExample.vue
```

**Story File Structure:**

Each story file should be a simple, focused example. No need for the `<Story>`
wrapper - just demonstrate the component variations directly.

```vue
<script setup>
import { ComponentName } from 'frappe-ui'
</script>

<template>
  <ComponentName size="sm">Small</ComponentName>
  <ComponentName size="md">Medium</ComponentName>
  <ComponentName size="lg">Large</ComponentName>
</template>
```

**Story Guidelines:**

- **One story per file**: Each file demonstrates a single aspect (sizes,
  variants, themes, etc.)
- **Descriptive filenames**: Use PascalCase names that clearly describe what's
  being shown (e.g., `Sizes.vue`, `Variants.vue`, `WithIcons.vue`)
- **Keep it simple**: No complex layouts or wrappers - just show the component
  variations
- **Common story types**:
  - `Sizes.vue` - Different size options
  - `Variants.vue` - Visual style variants (solid, outline, ghost, etc.)
  - `Themes.vue` - Color themes
  - `WithIcons.vue` or `Icons.vue` - Icon slot usage
  - `States.vue` - Different states (disabled, loading, error, etc.)
  - `Interactive.vue` - Examples with v-model and state

**Example Story Files:**

```vue
<!-- stories/Sizes.vue -->
<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <Button size="sm">Button</Button>
  <Button size="md">Button</Button>
  <Button size="lg">Button</Button>
</template>
```

```vue
<!-- stories/Variants.vue -->
<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <Button variant="solid">Solid</Button>
  <Button variant="subtle">Subtle</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
</template>
```

```vue
<!-- stories/WithIcons.vue -->
<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <Button>
    <template #prefix>
      <LucideDownload class="size-4" />
    </template>
    Download
  </Button>

  <Button>
    <template #suffix>
      <LucideArrowRight class="size-4" />
    </template>
    Next
  </Button>
</template>
```

```vue
<!-- stories/Interactive.vue -->
<script setup>
import { ref } from 'vue'
import { TextInput } from 'frappe-ui'

const value = ref('')
</script>

<template>
  <div>
    <TextInput v-model="value" label="Name" />
    <p>Value: {{ value }}</p>
  </div>
</template>
```

### Performance Optimization

**Bundle Size:**

- Tree-shakeable exports in `src/index.ts`
- Lazy-load heavy components when possible
- Externalize peer dependencies (Vue, Vue Router)

**Runtime Performance:**

- Prefer `computed` over `watch` when deriving state
- Debounce expensive operations (search, validation)

## Code Quality

**Linting and Formatting:**

- ESLint with Vue 3 recommended rules
- Prettier for consistent code formatting
- Pre-commit hooks via Husky and lint-staged

**Code Review Checklist:**

- [ ] TypeScript types are accurate and complete
- [ ] Component is accessible (keyboard, screen reader, ARIA)
- [ ] Semantic color classes used instead of hardcoded colors
- [ ] Props, events, and slots are documented
- [ ] Tests cover key functionality
- [ ] No console logs or debug code
- [ ] Works in both light and dark modes (if applicable)
- [ ] Responsive design implemented (mobile-first)

## Release Process

```bash
# Run tests
yarn test

# Bump minor version and push to github
yarn bump-and-release
```

The CI/CD pipeline automatically publishes to npm when tags are pushed.

## Additional Resources

- [Official Documentation](https://ui.frappe.io)
- [GitHub Repository](https://github.com/frappe/frappe-ui)
- [Frappe Framework Docs](https://docs.frappe.io/framework)

## Code Comments

- Only add comments that explain **why** something is done, not **what** is done
- Use JSDoc/TSDoc for documenting functions, components, and types
- Don't add unnecessary comments for self-explanatory code
- Use inline comments sparingly, only when code complexity requires explanation

## Miscellaneous

- Ignore newline errors in all files
- Use `size-{number}` instead of `w-{number} h-{number}` for square elements
  (e.g., `size-4` instead of `w-4 h-4`)
