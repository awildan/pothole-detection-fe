<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDetectionStore } from '@/stores/detection'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import PotholeDetector from '@/components/PotholeDetector.vue'

const store = useDetectionStore()

const { capturedImage, resetSignal } = storeToRefs(store)
</script>

<template>
  <div class="space-y-6">
    <div class="mb-6 space-y-2 md:mb-8">
      <Badge variant="secondary" class="font-mono text-[10px] uppercase tracking-wider">
        AI Road Inspection
      </Badge>
      <h1 class="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
        Detect Potholes
      </h1>
      <p class="max-w-prose text-sm text-muted-foreground text-pretty md:text-base">
        Upload or capture a photo of a road surface. Get side-by-side detections with confidence
        scores from two state-of-the-art object detection models.
      </p>
    </div>

    <Card class="border-border/80 shadow-sm">
      <CardContent class="px-4 md:px-6">
        <PotholeDetector
          :initial-image="capturedImage"
          :auto-detect="!!capturedImage"
          :reset-signal="resetSignal"
        />
      </CardContent>
    </Card>
  </div>
</template>
