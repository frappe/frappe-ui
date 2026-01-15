<script setup>
import { useData } from 'vitepress'
import BgColor from '@/components/tokens/BgColor.vue'
import TxtColor from '@/components/tokens/TxtColor.vue'
import BorderColor from '@/components/tokens/BorderColor.vue'
import Fonts from '@/components/tokens/Fonts.vue'
import DropShadow from '@/components/tokens/DropShadow.vue'
import BorderRadius from '@/components/tokens/BorderRadius.vue'

const { params } = useData()
const data = params.value.data

const title = params.value.token.replace('-', ' ')
</script>

<h1 class='capitalize mb-5'>
{{ title }}
</h1>

<BgColor v-if="params.token =='background-color'"  :data="data" />
<TxtColor v-if="params.token =='text-color'"  :data="data" />
<BorderColor v-if="params.token =='border-color'"  :data="data" />
<Fonts v-if="params.token =='fonts'"  :data="data" />
<DropShadow v-if="params.token =='drop-shadow'"  />
<BorderRadius v-if="params.token =='border-radius'"  :data="data" />
