import { describe, expect, it } from 'vitest'
import { drawsSomething } from './useChart'

// The entry animation is spent on the first option that draws. A chart that
// fetches its rows sets an empty option first — and the plot stays mounted
// through the loading and empty states, so that option reaches echarts like
// any other. Counting it would leave the real data to arrive without the
// animation, which is the state most charts are actually in.
describe('whether an option draws anything', () => {
  it('is false for a chart waiting on its rows', () => {
    expect(drawsSomething({ series: [{ type: 'bar', data: [] }] })).toBe(false)
  })

  it('is false when the option carries no series at all', () => {
    expect(drawsSomething({})).toBe(false)
    expect(drawsSomething({ series: [] })).toBe(false)
  })

  it('is true once one series carries a point', () => {
    expect(drawsSomething({ series: [{ type: 'bar', data: [1] }] })).toBe(true)
  })

  it('reads a single series object, which echarts also accepts', () => {
    expect(drawsSomething({ series: { type: 'pie', data: [1] } })).toBe(true)
  })

  it('is true when only the second series carries anything', () => {
    // A legend toggle can empty one series while the plot still draws.
    const option = { series: [{ data: [] }, { data: [1, 2] }] }
    expect(drawsSomething(option)).toBe(true)
  })
})
