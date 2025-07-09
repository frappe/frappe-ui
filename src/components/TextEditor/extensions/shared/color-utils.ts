/**
 * Shared utilities for color conversion and mapping across text editor extensions
 */

// Foreground/text color mappings (tailwind scale 600)
export const textColorHexMap: Record<string, string> = {
  black: '#000000',
  red: '#dc2626',
  blue: '#1579D0',
  green: '#16a34a',
  yellow: '#ca8a04',
  orange: '#ea580c',
  purple: '#9333ea',
  pink: '#db2777',
  gray: '#6b7280',
  indigo: '#4f46e5',
  teal: '#0d9488',
  cyan: '#06b6d4',
}

// Background/highlight color mappings (tailwind scale 100)
export const highlightColorHexMap: Record<string, string> = {
  red: '#fecaca',
  blue: '#bfdbfe',
  green: '#bbf7d0',
  yellow: '#fef08a',
  orange: '#fed7aa',
  purple: '#e9d5ff',
  pink: '#fbcfe8',
  gray: '#e5e7eb',
  indigo: '#c7d2fe',
  teal: '#99f6e4',
  cyan: '#a5f3fc',
}

// Legacy color mappings for backward compatibility
export const legacyTextColorMap: Record<string, string> = {
  '#1F272E': 'gray',
  '#ca8a04': 'yellow',
  '#ea580c': 'orange',
  '#dc2626': 'red',
  '#16a34a': 'green',
  '#1579D0': 'blue',
  '#9333ea': 'purple',
  '#db2777': 'pink',
}

export const legacyHighlightColorMap: Record<string, string> = {
  '#fef9c3': 'yellow',
  '#ffedd5': 'orange',
  '#fee2e2': 'red',
  '#dcfce7': 'green',
  '#D3E9FC': 'blue',
  '#f3e8ff': 'purple',
  '#fce7f3': 'pink',
}

/**
 * Converts a hex or RGB color to the closest named color from our allowed list
 * @param color - Color to convert (e.g. "#fee2e2" or "rgb(254, 226, 226)")
 * @param allowedColors - List of allowed color names
 * @param colorMap - Map of color names to hex values to compare against
 * @param legacyMap - Optional legacy color mapping for exact matches
 * @returns The closest named color
 */
export function getClosestNamedColor(
  color: string,
  allowedColors: string[],
  colorMap: Record<string, string>,
  legacyMap?: Record<string, string>,
): string | null {
  // Check exact match first for quick returns
  if (legacyMap && color.startsWith('#') && legacyMap[color]) {
    return legacyMap[color]
  }

  // Parse the color to RGB values
  let r = 0,
    g = 0,
    b = 0

  // Handle hex format
  if (color.startsWith('#')) {
    const hex = color.substring(1)
    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
  }
  // Handle rgb format
  else if (color.startsWith('rgb')) {
    const rgbMatch = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.exec(color)
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10)
      g = parseInt(rgbMatch[2], 10)
      b = parseInt(rgbMatch[3], 10)
    }
  }

  // Invalid color format
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null
  }

  let closestColor = null
  let minDistance = Infinity

  // Find the closest color by calculating the Euclidean distance in RGB space
  for (const colorName of allowedColors) {
    const namedHex = colorMap[colorName]
    if (!namedHex) continue

    const namedHexClean = namedHex.startsWith('#')
      ? namedHex.substring(1)
      : namedHex

    if (namedHexClean.length !== 6) continue

    const nr = parseInt(namedHexClean.substring(0, 2), 16)
    const ng = parseInt(namedHexClean.substring(2, 4), 16)
    const nb = parseInt(namedHexClean.substring(4, 6), 16)

    // Calculate Euclidean distance
    const distance = Math.sqrt(
      Math.pow(r - nr, 2) + Math.pow(g - ng, 2) + Math.pow(b - nb, 2),
    )

    if (distance < minDistance) {
      minDistance = distance
      closestColor = colorName
    }
  }

  return closestColor
}

/**
 * Extracts color from a style attribute and converts it to the closest named color
 * @param style - CSS style string (e.g., "color: #ff0000; font-weight: bold;")
 * @param allowedColors - List of allowed color names
 * @param colorMap - Map of color names to hex values
 * @param legacyMap - Optional legacy color mapping
 * @param property - CSS property to extract ('color' or 'background-color')
 * @returns The closest named color or null
 */
export function extractColorFromStyle(
  style: string,
  allowedColors: string[],
  colorMap: Record<string, string> = textColorHexMap,
  legacyMap: Record<string, string> = legacyTextColorMap,
  property: string = 'color',
): string | null {
  const allColorsInMap = Object.keys(colorMap)

  // Check for color in hex format
  const hexColorMatch = new RegExp(`${property}:\\s*(#[0-9a-f]{6})`, 'i').exec(
    style,
  )
  if (hexColorMatch && hexColorMatch[1]) {
    const closestOverallColor = getClosestNamedColor(
      hexColorMatch[1],
      allColorsInMap, // Search in all colors from the map
      colorMap,
      legacyMap,
    )
    if (closestOverallColor) {
      // Check if this color is in the originally passed 'allowedColors'
      if (allowedColors.includes(closestOverallColor)) {
        if (closestOverallColor === 'gray') {
          return null // Special handling for gray
        }
        return closestOverallColor // It's the closest, allowed, and not gray
      }
      // If not in allowedColors, this match is invalid for the current context
    }
  }

  // Check for color in rgb format
  const rgbColorMatch = new RegExp(
    `${property}:\\s*(rgb\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*\\))`,
    'i',
  ).exec(style)
  if (rgbColorMatch && rgbColorMatch[1]) {
    const closestOverallColor = getClosestNamedColor(
      rgbColorMatch[1],
      allColorsInMap, // Search in all colors from the map
      colorMap,
      legacyMap,
    )
    if (closestOverallColor) {
      // Check if this color is in the originally passed 'allowedColors'
      if (allowedColors.includes(closestOverallColor)) {
        if (closestOverallColor === 'gray') {
          return null // Special handling for gray
        }
        return closestOverallColor // It's the closest, allowed, and not gray
      }
      // If not in allowedColors, this match is invalid for the current context
    }
  }

  return null
}

/**
 * Extracts text color from a style attribute
 */
export function extractTextColorFromStyle(
  style: string,
  allowedColors: string[],
): string | null {
  return extractColorFromStyle(
    style,
    allowedColors,
    textColorHexMap,
    legacyTextColorMap,
    'color',
  )
}

/**
 * Extracts background color from a style attribute for highlights
 */
export function extractHighlightColorFromStyle(
  style: string,
  allowedColors: string[],
): string | null {
  return extractColorFromStyle(
    style,
    allowedColors,
    highlightColorHexMap,
    legacyHighlightColorMap,
    'background-color',
  )
}
