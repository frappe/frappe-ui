<script setup>
import { useData } from 'vitepress'
import BgColor from '../../.vitepress/components/tokens/BgColor.vue'
import TxtColor from '../../.vitepress/components/tokens/TxtColor.vue'
import BorderColor from '../../.vitepress/components/tokens/BorderColor.vue'
import FontSize from '../../.vitepress/components/tokens/FontSize.vue'
import FontWeight from '../../.vitepress/components/tokens/FontWeight.vue'
import FontFamily from '../../.vitepress/components/tokens/FontFamily.vue'
import LetterSpacing from '../../.vitepress/components/tokens/LetterSpacing.vue'
import LineHeight from '../../.vitepress/components/tokens/LineHeight.vue'
import DropShadow from '../../.vitepress/components/tokens/DropShadow.vue'
import BorderRadius from '../../.vitepress/components/tokens/BorderRadius.vue'
import BorderWidth from '../../.vitepress/components/tokens/BorderWidth.vue'

const { params } = useData()
const data = params.value.data

const title = params.value.token.replace('-', ' ')

</script>

<h1 class='capitalize mb-5'>
{{ title }}
</h1>

<BgColor v-if="params.token =='bg-color'"  :data="data" />
<TxtColor v-if="params.token =='text-color'"  :data="data" />
<BorderColor v-if="params.token =='border-color'"  :data="data" />
<FontSize v-if="params.token =='font-size'"  :data="data" />
<FontWeight v-if="params.token =='font-weight'"  :data="data" />
<FontFamily v-if="params.token =='font-family'"  :data="data" />
<LetterSpacing v-if="params.token =='letter-spacing'"  :data="data" />
<LineHeight v-if="params.token =='line-height'"  :data="data" />
<DropShadow v-if="params.token =='drop-shadow'"  :data="data" />
<BorderRadius v-if="params.token =='border-radius'"  :data="data" />
<BorderWidth v-if="params.token =='border-width'"  :data="data" />
