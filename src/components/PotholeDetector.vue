<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { RotateCcw, ScanSearch, Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import UploadZone from './UploadZone.vue'
import ProcessingSkeleton from './ProcessingSkeleton.vue'
import ResultsTabs from './ResultsTabs.vue'

type Status = 'idle' | 'uploading' | 'ready' | 'processing' | 'done'

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
const createdObjectUrl = ref<string | null>(null)

let uploadTimers: ReturnType<typeof setTimeout>[] = []
let processTimer: ReturnType<typeof setTimeout> | null = null

const clearTimers = () => {
  uploadTimers.forEach((t) => clearTimeout(t))
  uploadTimers = []
  if (processTimer) clearTimeout(processTimer)
  processTimer = null
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
  const url = URL.createObjectURL(file)
  createdObjectUrl.value = url
  startUpload(url)
}

const runDetection = () => {
  if (!imageUrl.value) return
  status.value = 'processing'
  processTimer = setTimeout(() => {
    status.value = 'done'
  }, 1500)
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
          Upload an image and compare detections from RT-DETR and YOLO side by side.
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

    <div v-if="status === 'done' && imageUrl" class="space-y-4">
      <div class="flex items-center gap-2 text-xs">
        <Sparkles class="size-3.5 text-foreground" aria-hidden="true" />
        <span class="font-mono uppercase tracking-wider text-muted-foreground">
          Detection complete
        </span>
      </div>
      <ResultsTabs :image-url="imageUrl" />
    </div>
  </div>
</template>