import { describe, it, expect } from 'vitest'
import { errorLines } from './errorLines'

describe('errorLines', () => {
  it('returns nothing for an empty value', () => {
    expect(errorLines()).toEqual([])
    expect(errorLines(null)).toEqual([])
    expect(errorLines('')).toEqual([])
    expect(errorLines([])).toEqual([])
  })

  it('takes a string', () => {
    expect(errorLines('Required')).toEqual(['Required'])
  })

  it('takes an array and drops the empty entries', () => {
    expect(errorLines(['Email is required', '', 'Password too short'])).toEqual(
      ['Email is required', 'Password too short'],
    )
    expect(errorLines(['', ''])).toEqual([])
  })

  it('reads an Error with several messages', () => {
    const error = Object.assign(new Error('Save failed'), {
      messages: ['Title is required', 'Owner is required'],
    })

    expect(errorLines(error)).toEqual(['Title is required', 'Owner is required'])
  })

  it('reads a non-standard string messages as one line', () => {
    // The server sometimes sends one string. Slicing it used to leak a string
    // where a string array was declared.
    const error = Object.assign(new Error('Save failed'), {
      messages: 'Title is required',
    })

    expect(errorLines(error)).toEqual(['Title is required'])
  })

  it('falls back to Error.message when messages is empty', () => {
    const error = Object.assign(new Error('Save failed'), { messages: [] })

    expect(errorLines(error)).toEqual(['Save failed'])
  })

  it('returns nothing for an Error with no message and no messages', () => {
    expect(errorLines(new Error(''))).toEqual([])
  })
})
