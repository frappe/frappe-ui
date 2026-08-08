import { reactive } from 'vue';
import { useAction } from '../useAction';
import { docStore } from '../docStore';
import { listStore } from '../useList/listStore';
export function useDoctype(doctype, options = {}) {
    const insert = useInsert(doctype, options);
    const delete_ = useDelete(doctype, options);
    const setValue = useSetValue(doctype, options);
    const runDocMethod = useRunDocMethod(doctype, options);
    const runMethod = useRunMethod(doctype, options);
    return reactive({
        insert,
        delete: delete_,
        setValue,
        runDocMethod,
        runMethod,
    });
}
function useInsert(doctype, options = {}) {
    let { baseUrl = '' } = options;
    let action = useAction({
        url: () => `/api/v2/document/${doctype}`,
        method: 'POST',
        baseUrl,
    });
    return reactive({
        data: action.data,
        error: action.error,
        loading: action.loading,
        /**
         * True while an insert is in flight. Takes no target: the document has no
         * name until the server gives it one, so there is nothing to key on. Same
         * answer as `loading`, kept so every write method has `isLoading`.
         */
        isLoading: () => action.loading.value,
        submit: action.submit,
    });
}
function useDelete(doctype, options = {}) {
    let { baseUrl = '' } = options;
    let action = useAction({
        url: ({ name }) => `/api/v2/document/${doctype}/${name}`,
        method: 'DELETE',
        baseUrl,
        key: ({ name }) => name,
        onSuccess(_data, { name }) {
            docStore.removeDoc(doctype, name);
            listStore.removeRow(doctype, name);
        },
    });
    return reactive({
        data: action.data,
        error: action.error,
        loading: action.loading,
        /** True while a delete for this document name is in flight. */
        isLoading: (name) => action.isLoading(name),
        submit: action.submit,
    });
}
function useRunDocMethod(doctype, options = {}) {
    let { baseUrl = '' } = options;
    let action = useAction({
        url: ({ name, method }) => `/api/v2/document/${doctype}/${name}/method/${method}`,
        method: 'POST',
        baseUrl,
        key: ({ name, method }) => `${name}/${method}`,
        body: ({ params }) => params,
        validate: ({ validate }) => validate?.(),
    });
    return reactive({
        data: action.data,
        error: action.error,
        loading: action.loading,
        /** True while this method is running on this document. */
        isLoading: (name, method) => action.isLoading(`${name}/${method}`),
        submit: action.submit,
    });
}
function useRunMethod(doctype, options = {}) {
    let { baseUrl = '' } = options;
    let action = useAction({
        url: ({ method }) => `/api/v2/method/${doctype}/${method}`,
        method: 'POST',
        baseUrl,
        key: ({ method }) => method,
        body: ({ params }) => params,
        validate: ({ validate }) => validate?.(),
    });
    return reactive({
        data: action.data,
        error: action.error,
        loading: action.loading,
        /** True while this method is running. */
        isLoading: (method) => action.isLoading(method),
        submit: action.submit,
    });
}
function useSetValue(doctype, options = {}) {
    let { baseUrl = '' } = options;
    let action = useAction({
        url: ({ name }) => `/api/v2/document/${doctype}/${name}`,
        method: 'PUT',
        baseUrl,
        key: ({ name }) => name,
        onSuccess(data) {
            docStore.setDoc({ doctype, ...data });
            listStore.updateRow(doctype, data);
        },
    });
    return reactive({
        data: action.data,
        error: action.error,
        loading: action.loading,
        /** True while a save for this document name is in flight. */
        isLoading: (name) => action.isLoading(name),
        submit: action.submit,
    });
}
