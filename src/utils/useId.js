import { useId as vueUseId } from 'vue';
// Vue 3.5+ provides a hydration-safe `useId()` scoped to the SSR render
// context, so server and client produce the same ids in the same order.
// A module-global counter (the previous implementation) leaked across
// requests in the same Node process, producing ids like `frappe-ui-4` on
// the server and `frappe-ui-1` on the client and breaking hydration.
export function useId() {
    return 'frappe-ui-' + vueUseId();
}
