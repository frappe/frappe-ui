import type { Component } from 'vue'

export interface IconProps {
  /**
   * Icon source. Supported forms:
   * - `lucide-*` string  → rendered via the Tailwind mask plugin.
   * - emoji / symbol string → rendered as plain text.
   * - Vue component → rendered via `<component :is>`.
   * Any other string (e.g. a bare feather-style name) is unsupported —
   * it renders nothing and warns once in dev. Falsy values render nothing.
   */
  name?: string | Component | null
}
