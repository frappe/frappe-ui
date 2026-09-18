/**
 * The token keys, as types.
 *
 * `tokens.d.ts` is generated, so every key here is checked against the real
 * module by `tokens/build.test.js`. What that test cannot show is the point of
 * generating the file: a misspelled key has to stop compiling, and a value has
 * to stay `string` so a token sync is not a breaking type change.
 *
 * `vue-tsc` runs this, not vitest: `yarn type-check` reads it through
 * `tsconfig.app.json`. The `@ts-expect-error` lines below fail that command if
 * the key they name ever starts compiling.
 */
import { describe, expectTypeOf, it } from 'vitest'
import {
  cssVariables,
  fontWeight,
  radius,
  semanticColors,
  spacing,
  type TextStyle,
} from './tokens.js'

// @ts-expect-error `typo` is not a semantic surface.
const wrongSurface = semanticColors.light.surface['typo']
// @ts-expect-error The radius scale stops at 9.
const wrongRadius = radius['10']
// @ts-expect-error The named radius aliases went away in 1.0.0 (ADR-0006).
const wrongAlias = radius.md
// @ts-expect-error Spacing has no half step above 19.5.
const wrongSpacing = spacing['20.5']
// @ts-expect-error `dark` is an override layer, and elevation never flips.
const wrongVariable = cssVariables.dark['--elevation-sm']

type Unused =
  | typeof wrongSurface
  | typeof wrongRadius
  | typeof wrongAlias
  | typeof wrongSpacing
  | typeof wrongVariable

describe('token key types', () => {
  it('names every key it exports', () => {
    expectTypeOf(semanticColors.light.surface['gray-2']).toEqualTypeOf<string>()
    expectTypeOf(semanticColors.dark.ink.base).toEqualTypeOf<string>()
    expectTypeOf(radius['9']).toEqualTypeOf<string>()
    expectTypeOf(spacing['19.5']).toEqualTypeOf<string>()
    expectTypeOf(cssVariables.light['--elevation-sm']).toEqualTypeOf<string>()
  })

  // A numeric literal reaches a string-literal key, which is how the docs
  // write a ramp step.
  it('takes a numeric index on a numeric key', () => {
    expectTypeOf(spacing[17]).toEqualTypeOf<string>()
  })

  // The one export that is not a string. Its keys are typed the same way.
  it('keeps fontWeight numeric', () => {
    expectTypeOf(fontWeight.regular).toEqualTypeOf<number>()
  })

  // `fontWeight` is a number here and in the `fontWeight` export, so
  // `fontSize.base.fontWeight === fontWeight.regular` holds.
  it('keeps TextStyle exported, with a numeric fontWeight', () => {
    expectTypeOf<TextStyle>().toEqualTypeOf<{
      fontSize: string
      lineHeight: string
      letterSpacing: string
      fontWeight: number
    }>()
  })
})
