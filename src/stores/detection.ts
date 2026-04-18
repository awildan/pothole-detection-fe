import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDetectionStore = defineStore('detection', () => {
  const capturedImage = ref<string | null>(null)
  const resetSignal = ref(0)

  function setCapturedImage(image: string | null) {
    capturedImage.value = image
  }

  function triggerReset() {
    capturedImage.value = null
    resetSignal.value++
  }

  return { 
    capturedImage, 
    resetSignal, 
    setCapturedImage, 
    triggerReset 
  }
})