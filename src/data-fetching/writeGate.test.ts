/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest'
import { docKey, LOCAL_WRITE, writeGate } from './writeGate'

// The gate's contract, asserted at the seam. `staleWrites.test.ts` proves the
// same rules hold end to end through real requests; these pin them directly,
// so a change in the rule fails here first and reads as one line rather than
// as a network round trip.
//
// The gate is a module singleton with a counter that only rises, so each test
// takes its own key: sequences from one test can never collide with another's.

let keySeq = 0
const freshKey = () => docKey('User', `gate-${++keySeq}`)

describe('writeGate', () => {
  it('admits a newer sequence and rejects an older one', () => {
    const key = freshKey()
    const older = writeGate.next(true)
    const newer = writeGate.next(true)

    expect(writeGate.admit(key, newer)).toBe(true)
    expect(writeGate.admit(key, older)).toBe(false)
  })

  it('admits an equal sequence, so a doc write and its row update agree', () => {
    const key = freshKey()
    const stamp = writeGate.next(true)

    // `docStore.setDoc` then `listStore.updateRow`, one response.
    expect(writeGate.admit(key, stamp)).toBe(true)
    expect(writeGate.admit(key, stamp)).toBe(true)
  })

  it('records nothing for a read, so it cannot gate out an older save', () => {
    const key = freshKey()
    const save = writeGate.next(true)
    const read = writeGate.next(false)

    expect(writeGate.admit(key, read)).toBe(true)
    // The read was dispatched later but recorded nothing, so the save — which
    // the server may well have committed after answering the read — still
    // lands.
    expect(writeGate.admit(key, save)).toBe(true)
  })

  it('seals against a write dispatched after the delete but equal to its own', () => {
    const key = freshKey()
    const inflight = writeGate.next(true)

    writeGate.seal(key)

    // Nothing in flight when the delete settled may re-create the document,
    // whichever side of the delete it was dispatched on. The seal takes a
    // fresh number, so even a write that outranks the delete's own dispatch
    // is rejected.
    expect(writeGate.admit(key, inflight)).toBe(false)
    const later = writeGate.next(true)
    expect(writeGate.admit(key, later)).toBe(true)
  })

  it('never records a local write', () => {
    const key = freshKey()
    const older = writeGate.next(true)

    expect(writeGate.admit(key, LOCAL_WRITE)).toBe(true)
    // Had `LOCAL_WRITE` recorded anything, this earlier-dispatched write would
    // now be rejected. A local write has no place in the dispatch order.
    expect(writeGate.admit(key, older)).toBe(true)
  })

  it('always admits a local write, whatever was recorded', () => {
    const key = freshKey()
    writeGate.admit(key, writeGate.next(true))

    expect(writeGate.admit(key, LOCAL_WRITE)).toBe(true)
  })

  it('clears the per-document records but not the counter', () => {
    const key = freshKey()
    const before = writeGate.next(true)
    writeGate.admit(key, before)

    writeGate.clear()

    // The records are gone, so the key starts fresh...
    expect(writeGate.admit(key, writeGate.next(true))).toBe(true)
    // ...but the counter does not restart. A sequence minted before the clear
    // must never outrank one minted after it — that is how a stamp held by a
    // request in flight across a `clearAll` would resurrect a stale write.
    expect(writeGate.next(true).sequence).toBeGreaterThan(before.sequence)
  })
})
