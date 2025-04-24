import { ref, watch, type Ref } from 'vue'

interface UseImageNavigationOptions {
  initialIndex: Ref<number>
  imageCount: Ref<number>
  onNavigate?: () => void
}

export function useImageNavigation({
  initialIndex,
  imageCount,
  onNavigate,
}: UseImageNavigationOptions) {
  const currentIndex = ref(initialIndex.value)

  watch(initialIndex, (newVal) => {
    currentIndex.value = newVal
    onNavigate?.()
  })

  function nextImage() {
    if (imageCount.value > 0) {
      currentIndex.value = (currentIndex.value + 1) % imageCount.value
      onNavigate?.()
    }
  }

  function previousImage() {
    if (imageCount.value > 0) {
      currentIndex.value =
        (currentIndex.value - 1 + imageCount.value) % imageCount.value
      onNavigate?.()
    }
  }

  return {
    currentIndex,
    nextImage,
    previousImage,
  }
}
