/**
 * The stale-write gate for `docStore` and `listStore` (#1017, #1028).
 *
 * Two concurrent writes to one document must leave the stores on the newer
 * one, not on whichever response settled last. The order that matters is the
 * order the requests were DISPATCHED in: a request dispatched later carries
 * the newer intent, whatever the network does with it afterwards.
 *
 * So every request takes a sequence number when it is dispatched, and a store
 * write presents that number to `admit` before it lands. A write whose
 * sequence is older than the newest already applied for that document is
 * rejected. The record is per document, so one response can carry a fresh doc
 * next to one a later-dispatched request already wrote, and two writes to
 * different documents never gate each other.
 *
 * A sequence counter, not a timestamp: clocks move, and two responses can
 * share a millisecond. The counter is store-wide and only ever incremented —
 * a per-document counter restarting at 0 would let a number minted for one
 * key match a later slot's, which is how a deleted doc comes back to life.
 * Comparison is still per document, which is what "per-key sequence" buys.
 *
 * This module is the only bookkeeper. `docStore` and `listStore` both ask it,
 * so a row update and a doc write from the same response share one answer,
 * and a write from any composable instance — or from the docs side channel in
 * `useFrappeFetch` — is ordered against every other.
 */

export type DocKey = `${string}/${string}`

/**
 * What a network write presents to the gate: the sequence number of the
 * request that produced it, and whether the write may RECORD that number.
 *
 * Only a mutating request records. A later-dispatched request that failed
 * wrote nothing on the server, so it must not make an older success stale;
 * and a read (GET) is not an ordered write at all — the server may answer a
 * later-dispatched read before an earlier save commits, so recording it would
 * gate that save's response out for good. A read is admitted on its sequence
 * and records nothing.
 *
 * The two halves always travel together. Carried separately, a caller can
 * pass a sequence and forget `record`, which silently lets a read gate out
 * saves.
 */
export type DispatchStamp = { sequence: number; record: boolean }

/**
 * A write that did not come from a dispatched request — seeding the store in
 * a test, a response that never went through the wrapped fetch. There is no
 * order to compare it against, so it is always admitted and records nothing.
 *
 * It is a value a caller has to name, not an argument they can omit: every
 * store write takes a `WriteStamp`, so the un-ordered case is a decision at
 * the call site rather than the silent default of a forgotten parameter.
 */
export const LOCAL_WRITE = Symbol('local write')

export type WriteStamp = DispatchStamp | typeof LOCAL_WRITE

class WriteGate {
  // Only ever incremented; shared by every document. See the module comment
  // for why this is not per key and not a clock.
  private counter = 0
  // The newest sequence applied to each document. Grows by one number per
  // document ever written, and is cleared with `docStore.clearAll`.
  private applied = new Map<DocKey, number>()

  /**
   * Take the next sequence number. Called when a request is dispatched — not
   * when it settles — so the number reflects the order the writes were
   * intended in.
   */
  next(record: boolean): DispatchStamp {
    return { sequence: ++this.counter, record }
  }

  /**
   * Whether this write may land on this document.
   *
   * Asking is booking: an admitted mutating write is recorded as the newest
   * for the key, so a later call carrying an older sequence is rejected.
   * There is deliberately no way to check without recording — a check that
   * did not record is how a stale write slips in behind an admitted one.
   */
  admit(key: DocKey, stamp: WriteStamp): boolean {
    if (stamp === LOCAL_WRITE) return true
    if (stamp.sequence < (this.applied.get(key) ?? 0)) return false
    if (stamp.record) this.applied.set(key, stamp.sequence)
    return true
  }

  /**
   * The document is gone on the server: reject every write in flight for it.
   *
   * Stamped with a FRESH number rather than the delete's own, because a
   * delete becomes true when it SETTLES. Any write still in flight at that
   * moment — dispatched before or after the delete — must have been committed
   * by the server before the delete to have succeeded, so its response is
   * dead data and must not re-create the document. Anything dispatched after
   * this point takes a higher number and is admitted again.
   *
   * A plain assignment, not a `max`: every number in `applied` was minted by
   * an earlier `next` or `seal`, so a fresh `++counter` already outranks all
   * of them. The record moves forward because the counter does.
   */
  seal(key: DocKey) {
    this.applied.set(key, ++this.counter)
  }

  clear() {
    this.applied.clear()
  }
}

export const writeGate = new WriteGate()

/**
 * The identity a write is gated on. `docStore` keys its documents by the same
 * string, so the gate, the doc refs and the list rows all agree on what "the
 * same document" means.
 */
export function docKey(doctype: string, name: string | number): DocKey {
  return `${String(doctype).trim()}/${String(name).trim()}` as DocKey
}
