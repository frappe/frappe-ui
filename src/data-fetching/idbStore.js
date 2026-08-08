import { get, set, del, setMany, keys } from 'idb-keyval';
export class IDBStore {
    memoryStore = {};
    useIndexedDB;
    constructor() {
        this.useIndexedDB = typeof window !== 'undefined' && !!window.indexedDB;
    }
    set(key, data) {
        if (!this.validateKey(key)) {
            return Promise.resolve(null);
        }
        try {
            if (this.useIndexedDB) {
                return set(key, JSON.stringify(data));
            }
            this.memoryStore[key] = JSON.stringify(data);
            return Promise.resolve();
        }
        catch (error) {
            return this.handleError(error, 'save to');
        }
    }
    setMany(data) {
        try {
            if (this.useIndexedDB) {
                let entries = [];
                for (const [key, value] of Object.entries(data)) {
                    entries.push([key, JSON.stringify(value)]);
                }
                return setMany(entries);
            }
            for (const [key, value] of Object.entries(data)) {
                this.memoryStore[key] = JSON.stringify(value);
            }
            return Promise.resolve();
        }
        catch (error) {
            return this.handleError(error, 'save to');
        }
    }
    delete(key) {
        if (!this.validateKey(key)) {
            return Promise.resolve(null);
        }
        try {
            if (this.useIndexedDB) {
                return del(key);
            }
            delete this.memoryStore[key];
            return Promise.resolve();
        }
        catch (error) {
            return this.handleError(error, 'delete from');
        }
    }
    get(key) {
        if (!this.validateKey(key)) {
            return Promise.resolve(null);
        }
        if (this.useIndexedDB) {
            return get(key).then((val) => {
                if (!val)
                    return null;
                try {
                    return JSON.parse(val);
                }
                catch (error) {
                    return this.handleError(error, 'parse data from');
                }
            });
        }
        try {
            const val = this.memoryStore[key];
            return Promise.resolve(val ? JSON.parse(val) : null);
        }
        catch (error) {
            return this.handleError(error, 'parse data from');
        }
    }
    async keys() {
        try {
            if (this.useIndexedDB) {
                return keys();
            }
            return Promise.resolve(Object.keys(this.memoryStore));
        }
        catch (error) {
            console.error(`Failed to get keys from ${this.useIndexedDB ? 'IndexedDB' : 'memory store'}:`, error);
            return Promise.resolve([]);
        }
    }
    validateKey(key) {
        return !!key;
    }
    handleError(error, operation) {
        console.error(`Failed to ${operation} ${this.useIndexedDB ? 'IndexedDB' : 'memory store'}:`, error);
        return Promise.resolve(null);
    }
}
export let idbStore = new IDBStore();
