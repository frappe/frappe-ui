import { computed, getCurrentInstance } from 'vue'
import { RouterLink } from 'vue-router'
import { safeHref } from '../../utils/url-safety'
import type { RouteDestination } from './route'

interface NavLinkProps {
  route?: RouteDestination
  href?: string
}

/**
 * The link half of a nav item: which element to render, the attributes it
 * takes, and the route it points at. Every href passes through `safeHref`
 * here, so a nav item cannot render an unchecked one.
 */
export function useNavLink(props: NavLinkProps) {
  // Read the router/route off global properties instead of useRouter()/useRoute()
  // so the item works — without warnings or crashes — when mounted outside a
  // vue-router app (docs, tests, embedded use). vue-router installs $router/$route
  // here; the $route getter stays reactive when read inside a computed.
  const globals = getCurrentInstance()?.appContext.config.globalProperties
  const hasRouter = computed(() => Boolean(globals?.$router))

  // With a router, render RouterLink; without one, degrade to a plain <a>. It
  // gets an href only when `route` is a string: a route object has no URL
  // without a router to resolve it.
  const linkComponent = computed(() =>
    props.route && hasRouter.value ? RouterLink : 'a',
  )
  const linkAttrs = computed(() =>
    props.route
      ? hasRouter.value
        ? { to: props.route }
        : { href: safeHref(props.route) }
      : { href: safeHref(props.href) },
  )

  const resolvedRoute = computed(() =>
    props.route && globals?.$router
      ? globals.$router.resolve(props.route)
      : null,
  )

  return { globals, linkComponent, linkAttrs, resolvedRoute }
}
