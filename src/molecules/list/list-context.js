import { inject, provide } from 'vue';
const listContextKey = Symbol('frappe-ui:list');
export function provideListContext(context) {
    provide(listContextKey, context);
}
export function useListContext() {
    return inject(listContextKey, null);
}
