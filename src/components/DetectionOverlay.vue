<script setup lang="ts">
import type { BoundingBox } from '@/lib/pothole-detections'

withDefaults(defineProps<{
  src: string
  boxes: BoundingBox[]
  accentColor?: string
}>(), {
  accentColor: '#f59e0b'
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-lg border border-border bg-muted">
    <img
      :src="src || '/placeholder.svg'"
      alt="Road surface analyzed for potholes"
      class="block h-auto w-full select-none"
      draggable="false"
    />
    <div class="pointer-events-none absolute inset-0">
      <div
        v-for="b in boxes"
        :key="b.id"
        class="absolute rounded-[3px]"
        :style="{
          left: `${b.x}%`,
          top: `${b.y}%`,
          width: `${b.w}%`,
          height: `${b.h}%`,
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.25)`,
        }"
      >
        <span
          class="absolute -top-[22px] left-0 inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-white"
          :style="{ backgroundColor: accentColor }"
        >
          {{ b.label }} {{ b.confidence.toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>