<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import DetectionOverlay from './DetectionOverlay.vue'
import { MOCK_RESULTS } from '@/lib/pothole-detections'
import { Clock, Target } from 'lucide-vue-next'

defineProps<{
  imageUrl: string
}>()

const COLORS: Record<string, string> = {
  'rt-detr': '#ea580c', // orange-600
  yolo: '#0ea5e9', // sky-500
}

const results = Object.values(MOCK_RESULTS)
</script>

<template>
  <Tabs defaultValue="rt-detr" class="w-full">
    <div class="flex items-center justify-between gap-2">
      <TabsList class="grid w-full max-w-xs grid-cols-2">
        <TabsTrigger value="rt-detr" class="font-mono text-xs">
          RT-DETR
        </TabsTrigger>
        <TabsTrigger value="yolo" class="font-mono text-xs">
          YOLO
        </TabsTrigger>
      </TabsList>
    </div>

    <TabsContent 
      v-for="result in results" 
      :key="result.key" 
      :value="result.key" 
      class="mt-4 space-y-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" class="gap-1 font-mono">
          <Target class="size-3" aria-hidden="true" />
          {{ result.boxes.length }} potholes
        </Badge>
        <Badge variant="outline" class="gap-1 font-mono">
          <Clock class="size-3" aria-hidden="true" />
          {{ result.latencyMs }}ms
        </Badge>
        <Badge variant="outline" class="font-mono">
          avg
          {{
            (
              result.boxes.reduce((a, b) => a + b.confidence, 0) /
              Math.max(result.boxes.length, 1)
            ).toFixed(2)
          }}
        </Badge>
      </div>

      <DetectionOverlay
        :src="imageUrl"
        :boxes="result.boxes"
        :accentColor="COLORS[result.key]"
      />

      <ul class="divide-y divide-border rounded-lg border border-border bg-card">
        <li
          v-for="(b, i) in result.boxes"
          :key="b.id"
          class="flex items-center justify-between gap-3 px-3 py-2 text-sm"
        >
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs text-muted-foreground">
              #{{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="font-medium">{{ b.label }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs text-muted-foreground">
              {{ Math.round(b.w) }}×{{ Math.round(b.h) }}%
            </span>
            <span
              class="rounded-sm px-1.5 py-0.5 font-mono text-xs text-white"
              :style="{ backgroundColor: COLORS[result.key] }"
            >
              {{ b.confidence.toFixed(2) }}
            </span>
          </div>
        </li>
      </ul>
    </TabsContent>
  </Tabs>
</template>