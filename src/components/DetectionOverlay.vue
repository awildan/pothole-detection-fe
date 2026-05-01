<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    accentColor?: string
  }>(),
  {
    accentColor: '#f59e0b',
  },
)
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-lg border border-border bg-muted"
    style="overflow-anchor: none"
  >
    <div class="relative aspect-video w-full">
      <img
        :src="src"
        alt="Road surface analyzed for potholes"
        class="absolute inset-0 h-full w-full object-contain select-none"
        draggable="false"
      />
      <div
        class="absolute left-2 top-2 size-2.5 rounded-full shadow-sm"
        :style="{ backgroundColor: accentColor }"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
