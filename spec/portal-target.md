# Portal Target Spec

Status: accepted direction for `frappe-ui` v1.

An overlay teleports its content somewhere. This document says where, and how an
embedding host redirects every overlay at once. Each component's own spec
documents its `portalTo` prop — [`popover.md`](./popover.md),
[`dropdown.md`](./dropdown.md), [`hover-card.md`](./hover-card.md),
[`selection.md`](./selection.md).

## The problem

An overlay renders its content in a `<Teleport>`. A clipping or stacking
ancestor then cannot cut it off. reka-ui teleports to `<body>` by default. That
is correct for an app that mounts frappe-ui at the page root.

It is wrong for an embedded app. A Frappe desk island mounts Vue inside a shadow
root and loads frappe-ui's styles into that root. `<body>` sits outside the
root. An overlay that lands there loses the library's styling and picks up the
host page's CSS.

The host cannot fix this one overlay at a time. An island's markup rarely names
the Dialog that its Combobox opens.

## The contract

The host names one target per Vue app. Every overlay below it reads that target.

```ts
type PortalTarget = string | HTMLElement

const portalTargetKey: InjectionKey<MaybeRefOrGetter<PortalTarget | undefined>>

function providePortalTarget(target: MaybeRefOrGetter<PortalTarget | undefined>): void
function usePortalTarget(
  override?: MaybeRefOrGetter<PortalTarget | undefined>,
): ComputedRef<PortalTarget | undefined>
```

Precedence, highest first:

1. The component's own `portalTo` prop, where it has one. An explicit request
   from the caller always wins.
2. The host-provided target.
3. `undefined`, which leaves reka-ui on its `'body'` default.

`portalTargetKey` is `Symbol.for('frappe-ui:portal-target')`. It therefore
resolves through the global symbol registry. A host that cannot import from
frappe-ui still matches it, and so does a page that carries two copies of the
package.

The target is per Vue app, through provide/inject. A module-level setting would
be wrong: one page can host several islands, each with its own shadow root and
its own target.

## Host side

A host that owns the app instance provides the key before it mounts. The target
then covers the root component too.

```ts
const portalEl = document.createElement('div')
shadowRoot.append(portalEl)

const app = createApp(Island)
app.provide(portalTargetKey, portalEl)
app.mount(mountEl)
```

Pass an element, not a selector, when the target lives in a shadow root. Vue
resolves a string with `document.querySelector`, which does not cross a shadow
boundary.

## Component side

Every component that teleports resolves its target through `usePortalTarget`.
A test enforces this — see `no component teleports past the host target` in
[`usePortalTarget.spec.ts`](../src/composables/usePortalTarget.spec.ts). It
fails on a missing `:to` binding and on a hardcoded `'body'`.

A component with a `portalTo` prop must leave that prop undefaulted. A `'body'`
default outranks the host and defeats embedding silently.

The documented default of every `portalTo` prop stays `'body'`. That is still
what an unembedded app gets. It is now a fallback rather than a prop default.
