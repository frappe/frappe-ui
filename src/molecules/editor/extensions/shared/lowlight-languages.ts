import type { createLowlight } from 'lowlight'

export interface EditorLanguage {
  label: string
  value: string
}

/**
 * Build the deduped, alphabetically sorted list of selectable code-block
 * languages from a lowlight instance.
 *
 * The `html` → `xml` alias is applied exactly ONCE: lowlight registers the
 * grammar under `xml`, but authors expect to pick "html". If `html` is not
 * already registered we add a single `{ label: 'html', value: 'xml' }` entry.
 */
export function listEditorLanguages(
  lowlight: ReturnType<typeof createLowlight>,
): EditorLanguage[] {
  const seen = new Set<string>()
  const languages: EditorLanguage[] = []

  const push = (label: string, value: string) => {
    if (seen.has(value)) return
    seen.add(value)
    languages.push({ label, value })
  }

  for (const name of lowlight.listLanguages()) {
    push(name, name)
  }

  // html→xml alias: lowlight registers the grammar under `value: 'xml'`, but
  // authors expect to pick "html". This is a label-only alias, so it must be
  // added explicitly — routing it through `push` would be rejected by the
  // value-based dedup (the `xml` value is already seen). Guard on the label so
  // we never add a duplicate "html" entry.
  if (!languages.some((language) => language.label === 'html')) {
    languages.push({ label: 'html', value: 'xml' })
  }

  return languages.sort((a, b) => a.label.localeCompare(b.label))
}
