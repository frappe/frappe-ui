import type { InjectionKey, Ref } from 'vue'

/**
 * Internal wiring between the parts of one SettingsPanel. Not public API — a
 * SettingsBody reports that it has scrolled, and the SettingsHeader above it
 * shows its divider.
 */
export const settingsPanelScrolledKey: InjectionKey<Ref<boolean>> = Symbol(
  'settingsPanelScrolled',
)
