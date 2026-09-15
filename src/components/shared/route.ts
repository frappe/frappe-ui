import type {
  RouteLocationOptions,
  RouteLocationRaw,
  RouteParamsRawGeneric,
  RouteQueryAndHash,
  RouteRecordNameGeneric,
} from 'vue-router'

/**
 * The object half of a router destination: a named route with params, or a
 * path, each with the usual query, hash, and navigation options.
 *
 * vue-router's `RouteLocationRaw` is a union of two internal interfaces whose
 * published names are minified. A generated API table printed it as
 * `string | kt | Tt`, which names nothing a reader can look up and pins the
 * library's public signatures to vue-router's internal spelling. This is the
 * library's own name for the same value.
 */
export interface RouteLocationObject
  extends RouteQueryAndHash,
    RouteLocationOptions {
  /** Name of the target route record. */
  name?: RouteRecordNameGeneric

  /** Params for the target route record. Used with `name`. */
  params?: RouteParamsRawGeneric

  /** Percent-encoded path. Used instead of `name` and `params`. */
  path?: string
}

/**
 * Anywhere the library takes a router destination: a path string, or a
 * {@link RouteLocationObject}.
 */
export type RouteDestination = string | RouteLocationObject

/**
 * Hands a {@link RouteDestination} to vue-router.
 *
 * The owned type allows `name` and `path` together, which vue-router's own
 * union does not; vue-router resolves such a value by `path`. The cast lives
 * here, once, rather than at every `RouterLink` and `router.push` call.
 */
export function toRouteLocationRaw(route: RouteDestination): RouteLocationRaw {
  return route as RouteLocationRaw
}
