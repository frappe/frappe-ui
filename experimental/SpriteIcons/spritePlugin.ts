// @ts-ignore
import sprite from 'lucide-static/sprite.svg?raw'
import type { App } from 'vue'

export default {
  install(app: App) {
    const div = document.createElement('div')
    div.id = 'lucide-sprite'
    div.style.display = 'none'
    div.innerHTML = sprite
    document.body.prepend(div)
  },
}
