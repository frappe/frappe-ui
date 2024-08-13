<template>
  <Story :layout="{ type: 'grid', width: 500, heigt: 500 }">
    <Variant title="Default">
      <div class="p-2 w-full h-full">
        <CircularProgressBar :step="1" :totalSteps="4" />
      </div>
    </Variant>
    <Variant title="Progress Different Color">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="3"
          :totalSteps="4"
          progressColor=" #123abc"
          progressRemainingColor="#75ed6b"
        />
      </div>
    </Variant>
    <Variant title="Progress Complete Fill Color Inside">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="9"
          :totalSteps="9"
          progressCompleteColor="#f7b6f7"
          :isOuterCircleFilledOnComplete="false"
        />
      </div>
    </Variant>
    <Variant title="Progress Complete Fill Color Outside">
      <div class="p-2 w-full h-full">
        <CircularProgressBar
          :step="9"
          :totalSteps="9"
          progressCompleteColor="#f7b6f7"
          :isOuterCircleFilledOnComplete="true"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup>
import CircularProgressBar from './CircularProgressBar.vue'
</script>

<style></style>
