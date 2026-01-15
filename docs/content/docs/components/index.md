---
nextprev: false
---
<script setup>

import { useData } from 'vitepress'
const componentList = useData().theme.value.componentList

</script>


# Components
<br/>


<section class='grid grid-cols-3 gap-7 gap-x-3'>
<a v-for="component in componentList" :key="component" :href="'/docs/components/'+ component.toLowerCase()"
        class='no-underline'>
{{ component}}   
</a>
</section>
