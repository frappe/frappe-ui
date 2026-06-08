/**
 * frappe-ui internals — UNSTABLE. No backward-compatibility promise.
 *
 * This subpath (`frappe-ui/internals`) lets first-party Frappe libraries
 * (e.g. `@framework/ui`) reuse internal building blocks — composables, class
 * helpers, headless logic — without each one being promoted to the public API.
 *
 * Everything re-exported here is EXEMPT from P13 (Deprecate, don't remove):
 * it can change shape or disappear in ANY release, including minor/patch, with
 * no deprecation window. Do NOT import this from product apps or third-party
 * code — pin to a public entry point instead.
 *
 * To expose a new internal: add a re-export below. Nothing else to wire up.
 * Keep this list to what a first-party consumer actually needs — it is a
 * curated barrel, deliberately not a `./src/*` wildcard.
 */

export { inputFontSizeClasses } from './src/components/Combobox/utils'
export { useInputLabeling } from './src/composables/useInputLabeling'
