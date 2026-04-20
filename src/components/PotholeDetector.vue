<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { RotateCcw, ScanSearch, Sparkles, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import UploadZone from './UploadZone.vue'
import ProcessingSkeleton from './ProcessingSkeleton.vue'
import ResultsTabs from './ResultsTabs.vue'
import { predictPothole } from '@/lib/api'
import type { PredictionData } from '@/lib/pothole-detections'

type Status = 'idle' | 'uploading' | 'ready' | 'processing' | 'done' | 'error'

const props = withDefaults(defineProps<{
  initialImage?: string | null
  autoDetect?: boolean
  resetSignal?: number
}>(), {
  initialImage: null,
  autoDetect: false,
  resetSignal: 0
})

const status = ref<Status>('idle')
const progress = ref(0)
const imageUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const predictionData = ref<PredictionData | null>(null)
const errorMessage = ref<string | null>(null)
const createdObjectUrl = ref<string | null>(null)

let uploadTimers: ReturnType<typeof setTimeout>[] = []

const clearTimers = () => {
  uploadTimers.forEach((t) => clearTimeout(t))
  uploadTimers = []
}

const revokeObjectUrl = () => {
  if (createdObjectUrl.value) {
    URL.revokeObjectURL(createdObjectUrl.value)
    createdObjectUrl.value = null
  }
}

const reset = () => {
  clearTimers()
  revokeObjectUrl()
  imageUrl.value = null
  selectedFile.value = null
  predictionData.value = null
  errorMessage.value = null
  progress.value = 0
  status.value = 'idle'
}

const startUpload = (url: string) => {
  clearTimers()
  imageUrl.value = url
  progress.value = 0
  status.value = 'uploading'
  
  const steps = [15, 38, 62, 84, 100]
  steps.forEach((value, i) => {
    uploadTimers.push(
      setTimeout(() => {
        progress.value = value
        if (value === 100) {
          setTimeout(() => {
            status.value = 'ready'
          }, 180)
        }
      }, 220 * (i + 1))
    )
  })
}

const handleFile = (file: File) => {
  revokeObjectUrl()
  selectedFile.value = file
  const url = URL.createObjectURL(file)
  createdObjectUrl.value = url
  startUpload(url)
}

const runDetection = async () => {
  if (!selectedFile.value && !imageUrl.value) return
  
  status.value = 'processing'
  errorMessage.value = null

  try {
    // If we have a File object, use it directly.
    // If we only have a data URL (from camera), convert it first.
    let file = selectedFile.value
    if (!file && imageUrl.value) {
      file = await dataUrlToFile(imageUrl.value, 'capture.jpeg')
    }
    if (!file) return

    const response = await predictPothole(file)

    if (response.success) {
      predictionData.value = response.data
      status.value = 'done'
    } else {
      errorMessage.value = response.message || 'Detection failed. Please try again.'
      status.value = 'error'
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    errorMessage.value = `Failed to connect to the detection server. ${message}`
    status.value = 'error'
  }
}

/**
 * Convert a data-URL (e.g. from canvas.toDataURL) to a File object
 * so it can be sent as multipart/form-data.
 */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type })
}

// React to external reset signal
watch(() => props.resetSignal, (newVal) => {
  if (newVal > 0) reset()
})

// Handle incoming initial image (e.g., from camera)
watch(() => props.initialImage, (newImg) => {
  if (!newImg) return
  reset()
  startUpload(newImg)
}, { immediate: true })

// Auto-run detection after "ready" if requested
watch(status, (newStatus) => {
  if (props.autoDetect && newStatus === 'ready') {
    runDetection()
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  clearTimers()
  revokeObjectUrl()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start justify-between gap-3">
      <div class="space-y-1">
        <h2 class="text-base font-semibold tracking-tight text-pretty">
          Analyze a road surface
        </h2>
        <p class="text-sm text-muted-foreground text-pretty">
          Upload an image and compare detections from RT-DETR, YOLO11, YOLO26 &amp; YOLOv8 side by side.
        </p>
      </div>
      <Button
        v-if="imageUrl && status !== 'processing'"
        variant="ghost"
        size="sm"
        @click="reset"
        class="shrink-0 text-muted-foreground"
      >
        <RotateCcw class="mr-1.5 size-3.5" />
        Reset
      </Button>
    </div>

    <UploadZone v-if="!imageUrl" @file="handleFile" />
    
    <div v-else class="relative overflow-hidden rounded-lg border border-border bg-muted">
      <img
        :src="imageUrl || '/placeholder.svg'"
        alt="Selected road image preview"
        class="block h-auto w-full"
      />
      <Badge
        variant="secondary"
        class="absolute left-3 top-3 bg-background/90 font-mono text-[10px] uppercase tracking-wider shadow-sm backdrop-blur"
      >
        Input
      </Badge>
    </div>

    <div v-if="status === 'uploading'" class="space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="font-mono uppercase tracking-wider text-muted-foreground">
          Uploading
        </span>
        <span class="font-mono tabular-nums text-muted-foreground">
          {{ progress }}%
        </span>
      </div>
      <Progress :model-value="progress" class="h-1.5" />
    </div>

    <Button v-if="status === 'ready'" @click="runDetection" size="lg" class="w-full">
      <ScanSearch class="mr-2 size-4" />
      Detect Potholes
    </Button>

    <ProcessingSkeleton v-if="status === 'processing'" />

    <!-- Error state -->
    <div v-if="status === 'error'" class="space-y-3">
      <div
        class="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
      >
        <AlertTriangle class="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
        <div class="space-y-1">
          <p class="text-sm font-medium text-destructive">Detection failed</p>
          <p class="text-xs text-muted-foreground">{{ errorMessage }}</p>
        </div>
      </div>
      <Button variant="outline" @click="runDetection" size="sm" class="w-full">
        <RotateCcw class="mr-2 size-3.5" />
        Retry
      </Button>
    </div>

    <div v-if="status === 'done' && predictionData" class="space-y-4">
      <div class="flex items-center gap-2 text-xs">
        <Sparkles class="size-3.5 text-foreground" aria-hidden="true" />
        <span class="font-mono uppercase tracking-wider text-muted-foreground">
          Detection complete
        </span>
      </div>
      <ResultsTabs :prediction="predictionData" />
    </div>
  </div>
</template>