<script setup>
import Story from '../.vitepress/components/Story.vue'
import Button from '@/components/Button/Button.vue'
import Select from '@/components/Select/Select.vue'

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]
</script>

<h1>
  Button
</h1>

<br/>

<preview path="@/components/Button/Button.story.vue"  />

<Story>
 <Button variant='outline'> Button </Button>
    
    
</Story>
