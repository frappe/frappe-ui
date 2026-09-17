/** A ramp of shades keyed by step (`50`, `100`, … `900`). */
type Ramp = Record<string, string>

/** `fontSize`, `lineHeight`, `letterSpacing` and `fontWeight` for one style. */
export interface TextStyle {
  fontSize: string
  lineHeight: string
  letterSpacing: string
  fontWeight: string
}

/** CSS custom properties keyed by the selector they belong on. */
export type VariableMap = Record<string, Record<string, string>>

export declare const colors: {
  light: Record<string, Ramp>
  dark: Record<string, Ramp>
  overlay: { white: Ramp; black: Ramp }
  neutral: Record<string, string>
}

export declare const semanticColors: {
  light: Record<string, Record<string, string>>
  dark: Record<string, Record<string, string>>
}

export declare const cssVariables: VariableMap

export declare const radius: Record<string, string>

export declare const shadows: {
  elevation: { light: Ramp; dark: Ramp; custom: Ramp }
  focus: { light: Ramp; dark: Ramp }
}

export declare const fontSize: Record<string, TextStyle>
export declare const fontWeight: Record<string, number>
export declare const fontFamily: Record<string, string>
export declare const tracking: Record<string, Record<string, Ramp>>
export declare const textTransform: Record<string, string>

export declare const spacing: Record<string, string>
export declare const screens: Record<string, string>
