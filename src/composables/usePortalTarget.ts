import {
  computed,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'

/** Anything reka-ui's `<*Portal to>` (a Vue `<Teleport>`) accepts. */
export type PortalTarget = string | HTMLElement

/**
 * Injection key a host uses to name where every frappe-ui overlay teleports.
 *
 * `Symbol.for`, not a fresh `Symbol`: a host that cannot import from frappe-ui,
 * or a page carrying two copies of it, still matches through the global
 * registry.
 */
export const portalTargetKey = Symbol.for(
  'frappe-ui:portal-target',
) as InjectionKey<MaybeRefOrGetter<PortalTarget | undefined>>

/**
 * Name the portal target for every overlay below this component. A host that
 * owns the app instance should `app.provide(portalTargetKey, el)` instead, so
 * the target covers the root component too.
 */
export function providePortalTarget(
  target: MaybeRefOrGetter<PortalTarget | undefined>,
): void {
  provide(portalTargetKey, target)
}

/**
 * Resolve where an overlay teleports: `override` (the component's own
 * `portalTo`), else the host's target, else undefined — which leaves reka-ui on
 * its `'body'` default. See [the spec](../../spec/portal-target.md).
 *
 * A `portalTo` prop must stay undefaulted. A `'body'` default outranks the host
 * and silently defeats embedding.
 */
export function usePortalTarget(
  override?: MaybeRefOrGetter<PortalTarget | undefined>,
): ComputedRef<PortalTarget | undefined> {
  const hostTarget = inject(portalTargetKey, undefined)
  return computed(() => toValue(override) ?? toValue(hostTarget))
}
