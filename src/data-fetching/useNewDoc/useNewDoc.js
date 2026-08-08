import { reactive, unref } from 'vue';
import { useCall } from '../useCall/useCall';
import { docStore } from '../docStore';
export function useNewDoc(doctype, initialValues = {}, options = {}) {
    let doc = reactive(initialValues);
    const out = useCall({
        url: `/api/v2/document/${doctype}`,
        method: 'POST',
        params() {
            let payload = {};
            for (let key in doc) {
                const typedKey = key;
                const value = doc[typedKey];
                payload[typedKey] = unref(value);
            }
            return payload;
        },
        immediate: false,
        ...options,
    });
    function submit() {
        return out
            .submit()
            .then((doc) => docStore
            .setDoc({ doctype, ...doc })
            .then(() => docStore.getDoc(doctype, doc.name.toString())
            .value));
    }
    return reactive({
        ...out,
        submit,
        doc,
    });
}
