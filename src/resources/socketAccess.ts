import type { Socket } from 'socket.io-client'

/**
 * Read `$socket` off a component instance, treating "not set" as "no socket".
 *
 * Internal. Deliberately not re-exported from `resources/index.ts` — `1.0.0`
 * freezes the public surface, and this is a workaround, not an API.
 *
 * The FrappeUI plugin installs a throwing accessor for `$socket` so an app that
 * reads it gets a message naming the fix instead of an undefined-property crash
 * later. These call sites are the exception: `realtime: true` without a socket
 * has always degraded to a plain non-realtime resource, and that stays true.
 */
export function readSocket(vm: any): Socket | undefined {
  try {
    return vm?.$socket
  } catch {
    return undefined
  }
}
