// @ts-ignore
import sprite from 'lucide-static/sprite.svg?raw'
import type { App } from 'vue'

export const LEGACY_ICON_ALIASES = {
  angry: 'face-angry',
  annoyed: 'face-expressionless',
  frown: 'face-slightly-frowning',
  history: 'rotate-ccw-clock',
  laugh: 'face-grinning',
  meh: 'face-neutral',
  podcast: 'mic-signal',
  'smile-plus': 'face-slightly-smiling-plus',
  smile: 'face-slightly-smiling',
} as const

export default {
  install(app: App) {
    const div = document.createElement('div')
    div.id = 'lucide-sprite'
    div.style.display = 'none'
    div.innerHTML = sprite

    const spriteElement = div.querySelector('svg')
    for (const [legacyName, replacementName] of Object.entries(
      LEGACY_ICON_ALIASES,
    )) {
      if (div.querySelector(`#${legacyName}`)) continue
      const replacement = div.querySelector(`#${replacementName}`)
      if (!replacement || !spriteElement) continue

      const alias = replacement.cloneNode(true) as SVGSymbolElement
      alias.id = legacyName
      spriteElement.append(alias)
    }

    document.body.prepend(div)
  },
}
