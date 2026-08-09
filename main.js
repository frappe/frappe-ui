import { createApp } from 'vue'
import './src/style.css'
import App from './App.vue'
import { spritePlugin } from './experimental/SpriteIcons'

const app = createApp(App)
app.use(spritePlugin)
app.mount('#app')
