<template>
  <Story :layout="{ type: 'grid', width: 500, heigt: 500 }">
    <Variant title="Default">
      <div class="p-2 w-full h-full">
        <CircularProgressBar :step="1" :totalSteps="4" />
      </div>
    </Variant>
    <Variant title="Size">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="1"
          :totalSteps="4"
          size="lg"
          :showPercentage="true"
        />
      </div>
    </Variant>
    <Variant title="Theme">
      <div class="p-2 w-full h-full">
        <CircularProgressBar :step="3" :totalSteps="4" theme="orange" />
      </div>
    </Variant>
    <Variant title="Custom Theme">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="2"
          :totalSteps="6"
          :theme="{
            primary: '#2376f5',
            secondary: '#ddd5d5',
          }"
        />
      </div>
    </Variant>
    <Variant title="Solid Variant">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="9"
          :totalSteps="9"
          variant="solid"
          themeComplete="lightgreen"
        />
      </div>
    </Variant>
    <Variant title="Outline Variant">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="9"
          :totalSteps="9"
          variant="outline"
          themeComplete="lightgreen"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup>
import CircularProgressBar from './CircularProgressBar.vue'
</script>

<style></style>
