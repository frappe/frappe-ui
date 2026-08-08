import { ref, toValue } from 'vue';
import { idbStore } from './idbStore';
class DocStore {
    docs;
    lastFetched;
    revisions;
    inflight;
    // Store-wide and only ever incremented. A per-key counter that restarts at 0
    // would let a snapshot taken before a key was cleaned up match the value a
    // later slot starts from, which is how a deleted doc comes back to life.
    revisionCounter = 0;
    cacheTimeout = 5 * 60 * 1000; // 5 minutes
    storePrefix = 'doc:';
    constructor() {
        this.docs = new Map();
        this.lastFetched = new Map();
        this.revisions = new Map();
        this.inflight = new Map();
    }
    /**
     * The single place a doc is assigned into its ref.
     *
     * A key is published twice by design — once from the IndexedDB cache, once
     * from the server (stale-while-revalidate). Each publish takes the next
     * revision so a slow cached read can tell it has been overtaken and skip its
     * write. The invariant: `docRef.value` never moves backwards in time.
     */
    publish(key, doc) {
        if (!this.docs.has(key)) {
            this.docs.set(key, ref(null));
        }
        // Mark fresh BEFORE assigning the ref. Assigning docRef.value synchronously
        // re-runs any computed reading this doc (e.g. useDoc's `doc`), which calls
        // getDoc again — if the entry still looked stale at that point it would kick
        // off a needless reload that evicts the IDB copy we just wrote.
        this.lastFetched.set(key, Date.now());
        this.revisions.set(key, ++this.revisionCounter);
        this.docs.get(key).value = doc;
    }
    setCacheTimeout(minutes) {
        if (minutes < 1) {
            throw new Error('Cache timeout must be at least 1 minute');
        }
        this.cacheTimeout = minutes * 60 * 1000;
    }
    async setDoc(doc) {
        if (!doc?.doctype || !doc?.name) {
            throw new Error('Invalid doc: must have doctype and name');
        }
        doc.name = doc.name.toString();
        const key = this.getKey(doc.doctype, doc.name);
        // Publish before persisting, the way setDocs already does. Awaiting the
        // write first would leave readers on stale data for the length of an IDB
        // round trip, and widen the window a cached read can land in.
        this.publish(key, doc);
        try {
            await idbStore.set(this.storePrefix + key, doc);
        }
        catch (error) {
            console.error('Failed to set doc in IDB:', error);
            throw error;
        }
    }
    /**
     * The store holds docs exactly as the server sent them. Callers that need a
     * `transform` apply it when they read (see useDoc), so a non-idempotent
     * transform cannot compound across the cached and fresh publishes.
     */
    getDoc(doctype, name, options = {}) {
        const nameStr = toValue(name)?.trim();
        if (!doctype || !nameStr) {
            throw new Error('doctype and name are required');
        }
        const key = this.getKey(doctype, nameStr);
        if (!this.docs.has(key)) {
            this.docs.set(key, ref(null));
            this.loadDoc(key, true, options);
        }
        else if (this.isStale(key)) {
            this.loadDoc(key, false, options);
        }
        return this.docs.get(key);
    }
    loadDoc(key, isFirstLoad, options = {}) {
        // Every computed reading this doc calls getDoc, so several readers can ask
        // for the same key in one tick. Without this, each starts its own read and
        // each is free to assign.
        //
        // Keyed on the document alone, so the first caller's `staleOnError` decides
        // whether the IDB copy survives this round. Two useDocs on one document with
        // different values for it is not a case worth splitting the read for: they
        // share the ref either way, and the loser only sees the cached copy kept or
        // dropped one cycle earlier than it asked for.
        const existing = this.inflight.get(key);
        if (existing)
            return existing;
        const load = this.readFromCache(key, isFirstLoad, options)
            .catch((error) => {
            // Nothing awaits this — getDoc fires it and returns the ref straight
            // away — so re-throwing would surface as an unhandled rejection.
            console.error('Failed to load doc from IDB:', error);
        })
            .finally(() => {
            if (this.inflight.get(key) === load) {
                this.inflight.delete(key);
            }
        });
        this.inflight.set(key, load);
        return load;
    }
    async readFromCache(key, isFirstLoad, options = {}) {
        // Snapshot before awaiting. Anything published while this read is in flight
        // is newer than what the read is about to return. `undefined` is a value in
        // its own right here: it means nothing has ever been published for this key,
        // and cleanup() replaces it with a number rather than clearing it.
        const revisionAtStart = this.revisions.get(key);
        if (!isFirstLoad && this.isStale(key)) {
            this.lastFetched.delete(key);
            if (!options.staleOnError) {
                // Keep the IDB copy only when callers explicitly opt into stale
                // read-only fallback, such as offline-capable routes.
                await idbStore.delete(this.storePrefix + key);
            }
        }
        const idbDoc = (await idbStore.get(this.storePrefix + key));
        if (!idbDoc)
            return;
        // A read only ever writes into a slot that still exists. The read was issued
        // before any delete that has since happened, so it still answers with the
        // deleted row — publishing it would re-create the entry.
        if (!this.docs.has(key))
            return;
        if (this.revisions.get(key) !== revisionAtStart)
            return;
        this.publish(key, idbDoc);
    }
    async setDocs(docs) {
        const docMap = {};
        for (const doc of docs) {
            if (!doc?.doctype || !doc?.name)
                continue;
            doc.name = doc.name.toString();
            const key = this.getKey(doc.doctype, doc.name);
            this.publish(key, doc);
            docMap[this.storePrefix + key] = doc;
        }
        await idbStore.setMany(docMap);
    }
    async invalidateDoc(doctype, name) {
        if (!doctype || !name)
            return;
        const key = this.getKey(doctype, name);
        await this.cleanup(key);
    }
    removeDoc(doctype, name) {
        return this.invalidateDoc(doctype, name);
    }
    getKey(doctype, name) {
        return `${doctype.trim()}/${name.trim()}`;
    }
    isStale(key) {
        const fetchTime = this.lastFetched.get(key);
        if (!fetchTime)
            return true;
        return Date.now() - fetchTime > this.cacheTimeout;
    }
    async cleanup(key) {
        this.docs.delete(key);
        this.lastFetched.delete(key);
        this.inflight.delete(key);
        // Bumped, not deleted. A delete is an event reads in flight have to notice,
        // and clearing the entry would hand the next slot a revision an older read
        // still matches.
        this.revisions.set(key, ++this.revisionCounter);
        await idbStore.delete(this.storePrefix + key);
    }
    async clearAll() {
        try {
            const allKeys = await idbStore.keys();
            const docKeys = allKeys.filter((key) => key.startsWith(this.storePrefix));
            await Promise.all(docKeys.map((key) => idbStore.delete(key)));
            this.docs.clear();
            this.lastFetched.clear();
            this.revisions.clear();
            this.inflight.clear();
        }
        catch (error) {
            console.error('Failed to clear all docs:', error);
            throw error;
        }
    }
}
export const docStore = new DocStore();
