<script setup lang="ts">
import { ref } from 'vue'
import { RefreshCw, Loader2 } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    src: string
    accentColor?: string
  }>(),
  {
    accentColor: '#f59e0b',
  },
)

const imageError = ref(false)
const imageKey = ref(0)
const isLoading = ref(true)

const handleImageError = () => {
  imageError.value = true
  isLoading.value = false
}

const handleRetry = () => {
  imageError.value = false
  isLoading.value = true
  imageKey.value += 1 // Force re-render
}
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-lg border border-border bg-muted"
    style="overflow-anchor: none"
  >
    <div class="relative aspect-video w-full">
      <img
        v-if="!imageError"
        :key="imageKey"
        :src="src"
        alt="Road surface analyzed for potholes"
        class="absolute inset-0 h-full w-full object-contain select-none"
        draggable="false"
        @error="handleImageError"
        @load="
          () => {
            imageError = false
            isLoading = false
          }
        "
      />
      <div
        v-if="isLoading && !imageError"
        class="absolute inset-0 flex items-center justify-center bg-muted/80"
      >
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>
      <div v-if="imageError" class="absolute inset-0 flex items-center justify-center bg-muted/80">
        <button
          @click="handleRetry"
          class="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Retry loading image"
        >
          <RefreshCw class="size-8" />
          <span class="text-sm font-medium">Retry</span>
        </button>
      </div>
      <div
        class="absolute left-2 top-2 size-2.5 rounded-full shadow-sm"
        :style="{ backgroundColor: accentColor }"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
