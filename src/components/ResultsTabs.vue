<script setup lang="ts">
import { computed } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import DetectionOverlay from './DetectionOverlay.vue'
import { Clock, Target, Gauge } from 'lucide-vue-next'
import type { PredictionData } from '@/lib/pothole-detections'
import { MODEL_COLORS, MODEL_LABELS } from '@/lib/pothole-detections'

const props = defineProps<{
  prediction: PredictionData
}>()

const defaultTab = computed(() => props.prediction.results[0]?.model_name ?? '')

function getModelColor(modelName: string): string {
  return MODEL_COLORS[modelName] ?? '#6b7280'
}

function getModelLabel(modelName: string): string {
  return MODEL_LABELS[modelName] ?? modelName.toUpperCase()
}
</script>

<template>
  <Tabs :defaultValue="defaultTab" class="w-full">
    <div class="flex items-center justify-between gap-2">
      <TabsList
        :class="[
          'grid w-full',
          prediction.results.length === 4
            ? 'grid-cols-4'
            : `grid-cols-${prediction.results.length}`,
        ]"
      >
        <TabsTrigger
          v-for="result in prediction.results"
          :key="result.model_name"
          :value="result.model_name"
          class="font-mono text-xs cursor-pointer"
        >
          {{ getModelLabel(result.model_name) }}
        </TabsTrigger>
      </TabsList>
    </div>

    <TabsContent
      v-for="result in prediction.results"
      :key="result.model_name"
      :value="result.model_name"
      class="mt-4 space-y-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" class="gap-1 font-mono">
          <Target class="size-3" aria-hidden="true" />
          {{ result.summary.total_detections }} pothole{{
            result.summary.total_detections !== 1 ? 's' : ''
          }}
        </Badge>
        <Badge variant="outline" class="gap-1 font-mono">
          <Clock class="size-3" aria-hidden="true" />
          Inference Time {{ result.summary.inference_time_ms.toFixed(1) }}ms
        </Badge>
        <Badge variant="outline" class="gap-1 font-mono">
          <Gauge class="size-3" aria-hidden="true" />
          Avg Confidence {{ result.summary.average_confidence.toFixed(2) }}
        </Badge>
      </div>

      <DetectionOverlay
        :src="result.predicted_image_url"
        :accent-color="getModelColor(result.model_name)"
      />

      <!-- Detection list (only shown when detections exist) -->
      <ul
        v-if="result.detections.length > 0"
        class="divide-y divide-border rounded-lg border border-border bg-card"
      >
        <li
          v-for="(d, i) in result.detections"
          :key="i"
          class="flex items-center justify-between gap-3 px-3 py-2 text-sm"
        >
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs text-muted-foreground">
              #{{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="font-medium">{{ d.class_name }}</span>
          </div>
          <span
            class="rounded-sm px-1.5 py-0.5 font-mono text-xs text-white"
            :style="{ backgroundColor: getModelColor(result.model_name) }"
          >
            {{ d.confidence.toFixed(2) }}
          </span>
        </li>
      </ul>

      <!-- Empty state for no detections -->
      <div
        v-else
        class="flex items-center justify-center rounded-lg border border-dashed border-border py-8"
      >
        <p class="text-xs text-muted-foreground">
          No potholes detected by {{ getModelLabel(result.model_name) }}
        </p>
      </div>
    </TabsContent>
  </Tabs>
</template>
