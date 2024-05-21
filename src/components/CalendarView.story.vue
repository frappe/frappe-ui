<template>
  <Story>
    <CalendarView
      class="h-[100%] w-[100%]"
      :config="{
        defaultMode: 'Month',
        isEditMode: true,
      }"
    />
    <!-- <p>hey2</p> -->
  </Story>
</template>
<script>
import CalendarView from './CalendarView/CalendarView.vue'

const config = {
  redundantCellHeight: 50,
  defaultMode: 'Month',
  isEditMode: true,
}
</script>
<style></style>
