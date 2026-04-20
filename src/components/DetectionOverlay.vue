<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  accentColor?: string
}>(), {
  accentColor: '#f59e0b'
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-lg border border-border bg-muted">
    <img
      :src="src"
      alt="Road surface analyzed for potholes"
      class="block h-auto w-full select-none"
      draggable="false"
    />
    <div
      class="absolute left-2 top-2 size-2.5 rounded-full shadow-sm"
      :style="{ backgroundColor: accentColor }"
      aria-hidden="true"
    />
  </div>
</template>